require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

pool.query('SELECT NOW()')
    .then(res => console.log('Database connected at:', res.rows[0].now))
    .catch(err => console.error('Database connection error:', err));


// Authentification route
app.post('/auth/:role', async (req, res) => {
    console.log('Auth request received:', req.body); // Debug log
    const { username, password } = req.body;
    const requestedRole = req.params.role;

    console.log('Login attempt:', { username, requestedRole }); // Debug log

    try {
        const result = await pool.query(
            'SELECT * FROM supplychain.auth WHERE username = $1 AND role = $2',
            [username, requestedRole]
        );

        console.log('DB query result:', result.rows); // Debug log

        if (result.rows.length === 0) {
            console.log('User not found'); // Debug
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];
        console.log('Stored hash:', user.password); // Debug

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match); // Debug

        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        req.session.user = {
            username: user.username,
            role: user.role
        };
        console.log('Session created:', req.session.user); // Debug log

        res.json({
            success: true,
            role: user.role,
            redirect: '/dashboard'
        });

    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    try {
        const result = await pool.query(
            'SELECT a.username, a.role, p.name, p.email, p.organization, p.phone, p.address FROM supplychain.auth a LEFT JOIN supplychain.profile p ON a.username = p.username WHERE a.username = $1',
            [req.session.user.username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.get('/auth/verify-session', async (req, res) => {
    console.log('Session verification request received'); // Debug log
    if (!req.session.user) {
        console.log('No session user found'); // Debug log
        return res.status(401).json({ success: false, message: 'No active session'});
    }

    try {
        const result = await pool.query(
            'SELECT username, role FROM supplychain.auth WHERE username = $1',
            [req.session.user.username]
        );

        if (result.rows.length === 0) {
            console.log('User not found in database'); // Debug log
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        console.log('Session verified successfully'); // Debug log
        res.json({ success: true, user: result.rows[0]});
    } catch (err) {
        console.error('Session verification error:', err);
        res.status(500).json({ success: false, message: 'Server error'});
    }
});

// Get products (productcards and dashboardlayout)
app.get('/api/products', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { farmer } = req.query;
        const user = req.session.user;

        // Base product query
        let productQuery = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.type,
                p.image_url,
                p.batch_id,
                p.qr_code,
                p.created_at,
                p.status,
                p.retail_price,
                p.verification_count,
                p.last_verified,
                p.farmer_username,
                l.id as current_location_id,
                l.name as current_location_name,
                l.latitude as current_location_latitude,
                l.longitude as current_location_longitude,
                l.address as current_location_address,
                pr.name as farmer_name,
                pr.organization as farmer_organization
            FROM supplychain.product p
            LEFT JOIN supplychain.location l ON p.current_location_id = l.id
            LEFT JOIN supplychain.profile pr ON p.farmer_username = pr.username
        `;

        let params = [];
        let whereClause = '';

        // admin sees all products
        if (user.role === 'admin') {
            // no filters
        }
        // Farmer sees their own products when farmer query param is present
        else if (user.role === 'farmer' && farmer) {
            if (farmer !== user.username) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            whereClause = ' WHERE p.farmer_username = $1';
            params = [farmer];
        }
        // Other roles see products they're involved with
        else {
            whereClause = `
                WHERE p.farmer_username = $1 
                OR EXISTS (
                    SELECT 1 FROM supplychain.supply_chain sc
                    WHERE sc.product_id = p.id AND sc.performed_by_id = $1
                )
                OR EXISTS (
                    SELECT 1 FROM supplychain.supply_chain_certificate scc
                    JOIN supplychain.certificate c ON scc.certificate_id = c.id
                    JOIN supplychain.supply_chain sc ON scc.supply_chain_id = sc.id AND scc.product_id = sc.product_id
                    WHERE sc.product_id = p.id AND c.issued_by = $1
                )
            `;
            params = [user.username];
        }

        productQuery += whereClause + ' ORDER BY p.created_at DESC';
        const productResult = await pool.query(productQuery, params);

        // Get certificates for all products in one query
        const productIds = productResult.rows.map(p => p.id);
        let certsResult = { rows: [] };
        if (productIds.length > 0) {
            const certsQuery = `
                SELECT
                    pc.product_id,
                    c.id,
                    c.name,
                    p.name as issued_by,
                    c.issued_date,
                    c.expiry_date,
                    c.status
                FROM supplychain.certificate c
                JOIN supplychain.profile p ON c.issued_by = p.username
                JOIN supplychain.product_certificate pc ON c.id = pc.certificate_id
                WHERE pc.product_id = ANY($1)
            `;
            certsResult = await pool.query(certsQuery, [productIds]);
        }

        // Group certificates by product ID
        const certsByProduct = certsResult.rows.reduce((acc, cert) => {
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

        // Get supply chain steps for all products in one query
        let supplyChainResult = { rows: [] };
        if (productIds.length > 0) {
            const supplyChainQuery = `
                SELECT
                    sc.id,
                    sc.product_id,
                    sc.timestamp,
                    sc.action,
                    sc.description,
                    sc.performed_by_id,
                    sc.performed_by_name,
                    sc.performed_by_role,
                    sc.performed_by_organization,
                    sc.location_id,
                    sc.temperature,
                    sc.humidity,
                    sc.metadata,
                    sc.verified,
                    sc.transaction_hash,
                    l.name as location_name,
                    l.latitude as location_latitude,
                    l.longitude as location_longitude,
                    l.address as location_address
                FROM supplychain.supply_chain sc
                LEFT JOIN supplychain.location l ON sc.location_id = l.id
                WHERE sc.product_id = ANY($1)
                ORDER BY sc.timestamp ASC
            `;
            supplyChainResult = await pool.query(supplyChainQuery, [productIds]);
        }

        // Group supply chain steps by product ID
        const supplyChainByProduct = supplyChainResult.rows.reduce((acc, step) => {
            if (!acc[step.product_id]) {
                acc[step.product_id] = [];
            }
            acc[step.product_id].push({
                id: step.id,
                productId: step.product_id,
                timestamp: step.timestamp,
                action: step.action,
                description: step.description,
                performedBy: step.performed_by_id ? {
                    id: step.performed_by_id,
                    name: step.performed_by_name,
                    role: step.performed_by_role,
                    organization: step.performed_by_organization,
                } : null,
                location: step.location_id ? {
                    id: step.location_id,
                    name: step.location_name,
                    latitude: step.location_latitude,
                    longitude: step.location_longitude,
                    address: step.location_address,
                } : null,
                temperature: step.temperature,
                humidity: step.humidity,
                metadata: step.metadata,
                verified: step.verified,
                transactionHash: step.transaction_hash
            });
            return acc;
        }, {});

        // Get certificates for supply chain steps
        const stepIds = supplyChainResult.rows.map(s => s.id);
        let stepCertsResult = { rows: [] };
        if (stepIds.length > 0) {
            const stepCertsQuery = `
                SELECT 
                    scc.supply_chain_id,
                    scc.product_id,
                    c.id, 
                    c.name, 
                    p.name as issued_by,
                    c.issued_date, 
                    c.expiry_date, 
                    c.status
                FROM supplychain.certificate c
                JOIN supplychain.profile p ON c.issued_by = p.username
                JOIN supplychain.supply_chain_certificate scc ON c.id = scc.certificate_id
                WHERE scc.supply_chain_id = ANY($1)
            `;
            stepCertsResult = await pool.query(stepCertsQuery, [stepIds]);
        }

        // Add certificates to supply chain steps
        stepCertsResult.rows.forEach(cert => {
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
        const response = productResult.rows.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            type: product.type,
            imageUrl: product.image_url,
            batchId: product.batch_id,
            qrCode: product.qr_code,
            createdAt: product.created_at,
            currentLocation: product.current_location_id ? {
                id: product.current_location_id,
                name: product.current_location_name,
                latitude: product.current_location_latitude,
                longitude: product.current_location_longitude,
                address: product.current_location_address
            } : null,
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

        res.json(response);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get specific products for ProductDetails.tsx (unauthorized use from others not implemented yet)
app.get('/api/products/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const productId = req.params.id;

        // Get product details
        const productQuery = `
            SELECT
                p.*,
                l.id as current_location_id,
                l.name as current_location_name,
                l.latitude as current_location_latitude,
                l.longitude as current_location_longitude,
                l.address as current_location_address,
                pr.name as farmer_name,
                pr.organization as farmer_organization
            FROM supplychain.product p
                     LEFT JOIN supplychain.location l ON p.current_location_id = l.id
                     LEFT JOIN supplychain.profile pr ON p.farmer_username = pr.username
            WHERE p.id = $1
        `;
        const productResult = await pool.query(productQuery, [productId]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = productResult.rows[0];

        // Get certificates for this product
        const certsQuery = `
            SELECT
                c.id,
                c.name,
                p.name as issued_by,
                c.issued_date,
                c.expiry_date,
                c.status
            FROM supplychain.certificate c
                     JOIN supplychain.profile p ON c.issued_by = p.username
                     JOIN supplychain.product_certificate pc ON c.id = pc.certificate_id
            WHERE pc.product_id = $1
        `;
        const certsResult = await pool.query(certsQuery, [productId]);

        // Get supply chain steps for this product
        const supplyChainQuery = `
            SELECT
                sc.id,
                sc.product_id,
                sc.timestamp,
                sc.action,
                sc.description,
                sc.performed_by_id,
                sc.performed_by_name,
                sc.performed_by_role,
                sc.performed_by_organization,
                sc.location_id,
                sc.temperature,
                sc.humidity,
                sc.metadata,
                sc.verified,
                sc.transaction_hash,
                l.name as location_name,
                l.latitude as location_latitude,
                l.longitude as location_longitude,
                l.address as location_address
            FROM supplychain.supply_chain sc
                     LEFT JOIN supplychain.location l ON sc.location_id = l.id
            WHERE sc.product_id = $1
            ORDER BY sc.timestamp ASC
        `;
        const supplyChainResult = await pool.query(supplyChainQuery, [productId]);

        // Get certificates for each supply chain step
        const stepsWithCerts = await Promise.all(
            supplyChainResult.rows.map(async (step) => {
                try {
                    const certsQuery = `
                        SELECT 
                            c.id, 
                            c.name, 
                            p.name as issued_by,
                            c.issued_date, 
                            c.expiry_date, 
                            c.status
                        FROM supplychain.certificate c
                            JOIN supplychain.profile p ON c.issued_by = p.username
                            JOIN supplychain.supply_chain_certificate scc ON c.id = scc.certificate_id
                        WHERE scc.supply_chain_id = $1 AND scc.product_id = $2
                    `;
                    const certsResult = await pool.query(certsQuery, [step.id, productId]);

                    return {
                        ...step,
                        performedBy: step.performed_by_id ? {
                            id: step.performed_by_id,
                            name: step.performed_by_name,
                            role: step.performed_by_role,
                            organization: step.performed_by_organization,
                        } : null,
                        location: step.location_id ? {
                            id: step.location_id,
                            name: step.location_name,
                            latitude: step.location_latitude,
                            longitude: step.location_longitude,
                            address: step.location_address,
                        } : null,
                        // certificates: certsResult.rows, --> mapping instead
                        certificates: certsResult.rows.map(cert => ({
                            id: cert.id,
                            name: cert.name,
                            issuedBy: cert.issued_by,
                            issuedDate: cert.issued_date,
                            expiryDate: cert.expiry_date,
                            status: cert.status
                        }))
                    };
                } catch (err) {
                    console.error('Error processing step:', step.id, err);
                    return null;
                }
            })
        ).then(results => results.filter(Boolean));


        const response = {
            id: product.id,
            name: product.name,
            description: product.description,
            type: product.type,
            imageUrl: product.image_url,
            batchId: product.batch_id,
            qrCode: product.qr_code,
            createdAt: product.created_at,
            currentLocation: product.current_location_id ? {
                id: product.current_location_id,
                name: product.current_location_name,
                latitude: product.current_location_latitude,
                longitude: product.current_location_longitude,
                address: product.current_location_address
            } : null,
            // certificates: certsResult.rows, --> mapping instead
            certificates: certsResult.rows.map(cert => ({
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

        res.json(response);
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});