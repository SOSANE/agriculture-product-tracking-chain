require("dotenv").config();
const {
  generateBatchId,
  generateProductId,
  generateQrData,
  generateQrURL
} = require("../../utils/generator");
const { callContractFunction } = require("../../AgrichainInterface");
const ProductModel = require("./model");

const ProductController = {
  async getProducts(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      let products;
      const user = req.session.user;

      if (user.role === "admin") {
        products = await ProductModel.getAllProducts();
      } else {
        products = await ProductModel.getProductsByUsername(user.username);
      }

      const productIds = products.map(p => p.id);
      let certsResult = { rows: [] };
      let supplyChainResult = { rows: [] };
      let stepCertsResult = { rows: [] };
      if (productIds.length > 0) {
        certsResult = await ProductModel.getCertificatesByProductIds([productIds]);
        supplyChainResult = await ProductModel.getSupplychainStepsByProductIds([productIds]);
      }

      // Group certificates by product ID
      const certsByProduct = certsResult.reduce((acc, cert) => {
        if (!acc[cert.product_id]) {
          acc[cert.product_id] = [];
        }
        acc[cert.product_id].push({
          id: cert.id,
          name: cert.name,
          issuedBy: cert.issued_by,
          issuedDate: cert.issued_date,
          expiryDate: cert.expiry_date,
          status: cert.status
        });
        return acc;
      }, {});

      // Group supply chain steps by product ID
      const supplyChainByProduct = supplyChainResult.reduce((acc, step) => {
        if (!acc[step.product_id]) {
          acc[step.product_id] = [];
        }
        acc[step.product_id].push({
          id: step.id,
          productId: step.product_id,
          timestamp: step.timestamp,
          action: step.action,
          description: step.description,
          performedBy: step.performed_by_id
            ? {
                id: step.performed_by_id,
                name: step.performed_by_name,
                role: step.performed_by_role,
                organization: step.performed_by_organization
              }
            : null,
          location: step.location_id
            ? {
                id: step.location_id,
                name: step.location_name,
                latitude: step.location_latitude,
                longitude: step.location_longitude,
                address: step.location_address
              }
            : null,
          temperature: step.temperature,
          humidity: step.humidity,
          metadata: step.metadata,
          verified: step.verified,
          transactionHash: step.transaction_hash
        });
        return acc;
      }, {});

      const stepIds = supplyChainResult.map(s => s.id);

      // Get certificates for supply chain steps
      if (stepIds.length > 0) {
        stepCertsResult = await ProductModel.getCertificatesBySupplychainStepIds([stepIds]);
      }

      // Add certificates to supply chain steps
      stepCertsResult.forEach(cert => {
        const productSteps = supplyChainByProduct[cert.product_id];
        if (productSteps) {
          const step = productSteps.find(s => s.id === cert.supply_chain_id);
          if (step) {
            if (!step.certificates) {
              step.certificates = [];
            }
            step.certificates.push({
              id: cert.id,
              name: cert.name,
              issuedBy: cert.issued_by,
              issuedDate: cert.issued_date,
              expiryDate: cert.expiry_date,
              status: cert.status
            });
          }
        }
      });

      // Construct final response
      const response = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        imageUrl: product.image_url,
        batchId: product.batch_id,
        qrCode: product.qr_code,
        qrImage: product.qr_image,
        createdAt: product.created_at,
        currentLocation: product.current_location_id
          ? {
              id: product.current_location_id,
              name: product.current_location_name,
              latitude: product.current_location_latitude,
              longitude: product.current_location_longitude,
              address: product.current_location_address
            }
          : null,
        certificates: certsByProduct[product.id] || [],
        supplyChain: supplyChainByProduct[product.id] || [],
        status: product.status,
        farmer: {
          username: product.farmer_username,
          name: product.farmer_name,
          organization: product.farmer_organization
        },
        retailPrice: product.retail_price,
        verificationCount: product.verification_count,
        lastVerified: product.last_verified
      }));

      res.status(201).json(response);
    } catch (err) {
      return res.status(401).json({ error: `Cannot get products. Received error: ${err.message}` });
    }
  },

  async getProductById(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = req.params.id;
      let product = await ProductModel.findByProductId(id);

      if (!product) {
        product = await ProductModel.findByBatchId(id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
      }

      const productId = product.id;
      const certificates = await ProductModel.getCertificatesByProductId(productId);
      const supplychain = await ProductModel.getSupplychainByProductId(productId);

      // Get certificates for each supply chain step
      const stepsWithCerts = await Promise.all(
        supplychain.map(async step => {
          try {
            const certsBySteps = await ProductModel.getCertificatesByStepIdAndProductId(
              step.id,
              productId
            );

            return {
              ...step,
              performedBy: step.performed_by_id
                ? {
                    id: step.performed_by_id,
                    name: step.performed_by_name,
                    role: step.performed_by_role,
                    organization: step.performed_by_organization
                  }
                : null,
              location: step.location_id
                ? {
                    id: step.location_id,
                    name: step.location_name,
                    latitude: step.location_latitude,
                    longitude: step.location_longitude,
                    address: step.location_address
                  }
                : null,
              certificates: certsBySteps.map(cert => ({
                id: cert.id,
                name: cert.name,
                issuedBy: cert.issued_by,
                issuedDate: cert.issued_date,
                expiryDate: cert.expiry_date,
                status: cert.status
              }))
            };
          } catch (err) {
            return res
              .status(401)
              .json({
                error: `Error processing step id ${step.id}. Received error: ${err.message}`
              });
          }
        })
      ).then(results => results.filter(Boolean));

      // Construct final response
      const response = {
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        imageUrl: product.image_url,
        batchId: product.batch_id,
        qrCode: product.qr_code,
        qrImage: product.qr_image,
        createdAt: product.created_at,
        currentLocation: product.current_location_id
          ? {
              id: product.current_location_id,
              name: product.current_location_name,
              latitude: product.current_location_latitude,
              longitude: product.current_location_longitude,
              address: product.current_location_address
            }
          : null,
        certificates: certificates.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuedBy: cert.issued_by,
          issuedDate: cert.issued_date,
          expiryDate: cert.expiry_date,
          status: cert.status
        })),
        supplyChain: stepsWithCerts,
        status: product.status,
        farmer: {
          username: product.farmer_username,
          name: product.farmer_name,
          organization: product.farmer_organization
        },
        retailPrice: product.retail_price,
        verificationCount: product.verification_count,
        lastVerified: product.last_verified
      };

      res.status(201).json(response);
    } catch (err) {
      return res
        .status(401)
        .json({ error: `Cannot get product by ID. Received error: ${err.message}` });
    }
  },

  async getCertificateByUsername(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      let certificates;
      const user = req.session.user;

      if (user.role === "admin") {
        certificates = await ProductModel.getAllCertificates();
      } else if (user.role === "regulator") {
        certificates = await ProductModel.getCertificatesByUsername(user.username);
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const response = certificates.rows.map(certificate => ({
        id: certificate.id,
        name: certificate.name,
        issuedBy: certificate.issued_by,
        issuedDate: certificate.issued_date,
        expiryDate: certificate.expiry_date,
        status: certificate.status
      }));

      res.status(201).json(response);
    } catch (err) {
      return res
        .status(401)
        .json({ error: `Could not get certificate by username. Received error: ${err.message}` });
    }
  },

  async getCertificateById(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const certificate = await ProductModel.getCertificateById(req.params.id);

      if (!certificate) {
        return res.status(401).json({ error: "Certificate not found." });
      }

      res.status(201).json(certificate);
    } catch (err) {
      return res
        .status(401)
        .json({
          error: `Could not get certificate for this product. Received error: ${err.message}`
        });
    }
  },

  async registerProduct(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const productId = generateProductId();
      const batchId = generateBatchId(req.body.name, req.body.type);
      const qrCode = generateQrData(process.env.CONTRACT_ADDRESS, productId);
      const qrImage = await generateQrURL(qrCode);

      const productData = {
        productId,
        batchId,
        qrCode,
        qrImage,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        imageUrl: req.body.imageUrl,
        status: req.body.status,
        farmerUsername: req.session.user.username,
        temperature: req.body.temperature,
        humidity: req.body.humidity
      };

      const product = await ProductModel.registerProduct(productData);
      const address = await ProductModel.getCurrentLocation(req.session.user.username);

      const registerTransaction = await callContractFunction(
        "registerProduct",
        productId,
        product.name,
        product.description,
        product.type,
        product.image_url,
        batchId,
        qrCode,
        address.address
      );

      if (!registerTransaction) {
        return res
          .status(400)
          .json({ error: "Could not register this product in the blockchain." });
      }

      res.status(201).json(product);
    } catch (err) {
      return res
        .status(401)
        .json({ error: `Cannot register product. Received error: ${err.message}` });
    }
  },

  // Access to all products in product page
  async getAllProductsForProductPage(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const products = await ProductModel.getAllProducts();

      if (!products) {
        return res.status(401).json({ error: "No products found." });
      }

      // Construct final response
      const response = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        imageUrl: product.image_url,
        batchId: product.batch_id,
        qrCode: product.qr_code,
        qrImage: product.qr_image,
        createdAt: product.created_at,
        currentLocation: product.current_location_id
          ? {
              id: product.current_location_id,
              name: product.current_location_name,
              latitude: product.current_location_latitude,
              longitude: product.current_location_longitude,
              address: product.current_location_address
            }
          : null,
        status: product.status,
        farmer: {
          username: product.farmer_username,
          name: product.farmer_name,
          organization: product.farmer_organization
        },
        retailPrice: product.retail_price,
        verificationCount: product.verification_count,
        lastVerified: product.last_verified
      }));

      res.status(201).json(response);
    } catch (err) {
      return res
        .status(401)
        .json({ error: `Cannot get All Products page. Received error: ${err.message}` });
    }
  },

  async verifyProduct(req, res) {
    try {
      const { id } = req.body;
      let product = await ProductModel.findByProductId(id);

      if (!product) {
        product = await ProductModel.findByBatchId(id);
        if (!product) {
          return res.status(401).json({
            success: false,
            message: "Product with this ID do not exist."
          });
        }
      }
      const productId = product.id;
      const verifiedProduct = await ProductModel.verifyProduct(productId);
      if (verifiedProduct > 0) {
        res.status(201).json({ success: true });
      } else {
        res.status(401).json({ success: false, message: "Could not verify this product." });
      }
    } catch (err) {
      return res.status(401).json({ error: `Verification error. Received error: ${err.message}` });
    }
  }
};

module.exports = { ProductController };