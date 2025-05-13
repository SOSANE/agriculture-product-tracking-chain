const db = require('../../config/db');

const ProductModel = {
    async findByProductId (id) {
        const query = `
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

        const { rows } = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    async existsByProductId (id) {
        const { rows } = await db.query('SELECT * FROM supplychain.product WHERE id = $1', [id]);
        return rows.length > 0;
    },

    async findByName (name) {
        const { rows } = await db.query('SELECT * FROM supplychain.product WHERE name = $1', [name]);
        return rows.length > 0 ? rows[0] : null;
    },

    async getAllProducts() {
        const query = `
            SELECT p.*,
                   l.id            as current_location_id,
                   l.name          as current_location_name,
                   l.latitude      as current_location_latitude,
                   l.longitude     as current_location_longitude,
                   l.address       as current_location_address,
                   pr.name         as farmer_name,
                   pr.organization as farmer_organization
            FROM supplychain.product p
                     LEFT JOIN supplychain.location l ON p.current_location_id = l.id
                     LEFT JOIN supplychain.profile pr ON p.farmer_username = pr.username
            ORDER BY p.created_at DESC
        `;
        const {rows} = await db.query(query);
        return rows;
    },

    async getCertificatesByProductId (productId) {
        const query = `
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
        const { rows } = await db.query(query, [productId]);
        return rows;
    },

    async getSupplychainByProductId (productId) {
        const query = `
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
        const { rows } = await db.query(query, [productId]);
        return rows;
    },

    async getCertificatesByStepIdAndProductId(stepId, productId) {
        const query = `
            SELECT c.id,
                   c.name,
                   p.name as issued_by,
                   c.issued_date,
                   c.expiry_date,
                   c.status
            FROM supplychain.certificate c
                     JOIN supplychain.profile p ON c.issued_by = p.username
                     JOIN supplychain.supply_chain_certificate scc ON c.id = scc.certificate_id
            WHERE scc.supply_chain_id = $1
              AND scc.product_id = $2
        `;
        const { rows } = await db.query(query, [stepId, productId]);
        return rows;
    },

    async getProductsByUsername(username) {
        const query = `
            SELECT p.*,
                   l.id            as current_location_id,
                   l.name          as current_location_name,
                   l.latitude      as current_location_latitude,
                   l.longitude     as current_location_longitude,
                   l.address       as current_location_address,
                   pr.name         as farmer_name,
                   pr.organization as farmer_organization
            FROM supplychain.product p
                     LEFT JOIN supplychain.location l ON p.current_location_id = l.id
                     LEFT JOIN supplychain.profile pr ON p.farmer_username = pr.username
            WHERE p.farmer_username = $1
               OR EXISTS (SELECT 1
                          FROM supplychain.supply_chain sc
                          WHERE sc.product_id = p.id
                            AND sc.performed_by_id = $1)
               OR EXISTS (SELECT 1
                          FROM supplychain.supply_chain_certificate scc
                                   JOIN supplychain.certificate c ON scc.certificate_id = c.id
                                   JOIN supplychain.supply_chain sc
                                        ON scc.supply_chain_id = sc.id AND scc.product_id = sc.product_id
                          WHERE sc.product_id = p.id
                            AND c.issued_by = $1)
            ORDER BY p.created_at DESC
        `;
        const {rows} = await db.query(query, [username]);
        return rows;
    },

    async getCertificatesByProductIds(productIds) {
        const query = `
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
        const {rows} = await db.query(query, [productIds]);
        return rows;
    },

    async getSupplychainStepsByProductIds(productIds) {
        const query = `
            SELECT sc.id,
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
                   l.name      as location_name,
                   l.latitude  as location_latitude,
                   l.longitude as location_longitude,
                   l.address   as location_address
            FROM supplychain.supply_chain sc
                     LEFT JOIN supplychain.location l ON sc.location_id = l.id
            WHERE sc.product_id = ANY ($1)
            ORDER BY sc.timestamp ASC
        `;
        const {rows} = await db.query(query, [productIds]);
        return rows;
    },

    async getCertificatesBySupplychainStepIds(stepIds) {
        const query = `
            SELECT scc.supply_chain_id,
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
            WHERE scc.supply_chain_id = ANY ($1)
        `;
        const {rows} = await db.query(query, [stepIds]);
        return rows;
    },

    // See all certificates (admin)
    async getAllCertificates() {
        const query = `
            SELECT c.id,
                   c.name,
                   p.name as issued_by,
                   c.issued_date,
                   c.expiry_date,
                   c.status
            FROM supplychain.certificate c
                     JOIN supplychain.profile p ON c.issued_by = p.username
            ORDER BY c.issued_date DESC
        `;

        const rows = await db.query(query);
        return rows;
    },

    // See certificates issued for a regulator
    async getCertificatesByUsername(username) {
        const query = `
            SELECT c.id,
                   c.name,
                   p.name as issued_by,
                   c.issued_date,
                   c.expiry_date,
                   c.status
            FROM supplychain.certificate c
                     JOIN supplychain.profile p ON c.issued_by = p.username
            WHERE c.issued_by = $1
            ORDER BY c.issued_date DESC
        `;

        const rows = await db.query(query, [username]);
        return rows;
    },

    async getCertificateById (certificateId) {
        const query = `
        SELECT c.id,
                   c.name,
                   p.name as issued_by,
                   c.issued_date,
                   c.expiry_date,
                   c.status
            FROM supplychain.certificate c
                     JOIN supplychain.profile p ON c.issued_by = p.username
        WHERE c.id = $1
        `;

        const {rows} = await db.query(query, [certificateId]);
        return rows[0];
    },

    // Register product function
    async registerProduct(productData) {
        const {
            productId,
            batchId,
            qrCode,
            name,
            description,
            type,
            imageUrl,
            status,
            farmerUsername,
            temperature = null,
            humidity = null
        } = productData;

        // Query
        const query = `
            WITH profile_info AS (
            SELECT 
                p.username,
                p.name,
                p.organization,
                l.id as location_id
            FROM supplychain.profile p
            JOIN supplychain.location l ON p.address = l.address
            WHERE p.username = $6
        ),
        product_insert AS (
            INSERT INTO supplychain.product(
                id, name, description, type, image_url, batch_id, qr_code,
                created_at, current_location_id, status, farmer_username,
                farmer_name, farmer_organization, retail_price,
                verification_count, last_verified
            )
            SELECT 
                $1, $2, $3, $4, $5, $7, $8,
                CURRENT_TIMESTAMP, pi.location_id, $9, pi.username,
                pi.name, pi.organization, NULL,
                0, NULL
            FROM profile_info pi
            RETURNING *
        ),
        supplychain_insert AS (
            INSERT INTO supplychain.supply_chain(
                id, product_id, timestamp, action, description,
                performed_by_id, performed_by_name,
                performed_by_role, performed_by_organization,
                location_id, temperature, humidity, verified
            )
            SELECT 
                'step1', $1, CURRENT_TIMESTAMP, $9::product_status, $3,
                pi.username, pi.name, 'farmer', pi.organization,
                pi.location_id, NULLIF($10, '')::DECIMAL(5, 2), NULLIF($11, '')::DECIMAL(5, 2), TRUE
            FROM profile_info pi
            RETURNING *
        )
        SELECT * FROM product_insert;
        `;

        const { rows } = await db.query(query, [productId, name, description, type, imageUrl, farmerUsername, batchId, qrCode, status, temperature, humidity]);

        return {
            ...rows[0],
            qrData: qrCode
        };
    },

    async getCurrentLocation(username) {
        const query = `
            SELECT l.*
            FROM supplychain.location l
                     JOIN supplychain.profile p ON l.address = p.address
            WHERE p.username = $1
        `;
        const {rows} = await db.query(query, [username]);
        return rows.length > 0 ? rows[0] : null;
    },

    async verifyProduct(productId) {
        const query = `
        UPDATE supplychain.product p
        SET p.verification_count = p.verification_count + 1, p.last_verified = CURRENT_TIMESTAMP;
        WHERE p.id = $1
        `;

        let rows;
        if(await this.existsByProductId(productId)) {
            rows = await db.query(query, [productId]);
        }
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = ProductModel;