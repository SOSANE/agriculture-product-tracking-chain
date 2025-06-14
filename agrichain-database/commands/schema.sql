-- Create the database schema
CREATE SCHEMA IF NOT EXISTS supplychain;

-- Create enum type for roles
CREATE TYPE user_role AS ENUM (
    'admin',
    'regulator',
    'farmer',
    'processor',
    'distributor',
    'retailer'
    );

-- Create enum type for certificate status
CREATE TYPE cert_status AS ENUM (
    'valid',
    'expired',
    'revoked'
    );

-- Create enum type for product status
CREATE TYPE product_status AS ENUM (
    'planted',
    'growing',
    'harvested',
    'processed',
    'packaged',
    'shipped',
    'delivered',
    'received',
    'sold'
    );

-- Create auth table with password column that will store hashes
CREATE TABLE IF NOT EXISTS supplychain.auth (
    username VARCHAR(50) PRIMARY KEY,
    password TEXT NOT NULL,
    role user_role NOT NULL
    );

-- Create profile table
CREATE TABLE IF NOT EXISTS supplychain.profile (
    username VARCHAR(50) PRIMARY KEY REFERENCES supplychain.auth(username),
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

-- Create location table
CREATE TABLE IF NOT EXISTS supplychain.location (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    address TEXT
    );

-- Create certificate table
CREATE TABLE IF NOT EXISTS supplychain.certificate (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    issued_by VARCHAR(100) NOT NULL REFERENCES supplychain.profile(username),
    issued_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status cert_status
    );

-- Create product table
CREATE TABLE IF NOT EXISTS supplychain.product (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    image_url TEXT,
    batch_id VARCHAR(50),
    qr_code VARCHAR(100),
    qr_image VARCHAR(6000),
    created_at TIMESTAMP WITH TIME ZONE,
    current_location_id VARCHAR(50) REFERENCES supplychain.location(id),
    status product_status,
    farmer_username VARCHAR(50) REFERENCES supplychain.profile(username),
    farmer_name VARCHAR(100),
    farmer_organization VARCHAR(100),
    retail_price DECIMAL(10, 2),
    verification_count INTEGER DEFAULT 0,
    last_verified TIMESTAMP WITH TIME ZONE
    );

-- Create product_certificate junction table
CREATE TABLE IF NOT EXISTS supplychain.product_certificate (
    product_id VARCHAR(50) REFERENCES supplychain.product(id),
    certificate_id VARCHAR(50) REFERENCES supplychain.certificate(id),
    PRIMARY KEY (product_id, certificate_id)
    );

-- Create supply_chain table
CREATE TABLE IF NOT EXISTS supplychain.supply_chain (
    id VARCHAR(50),
    product_id VARCHAR(50) REFERENCES supplychain.product(id),
    PRIMARY KEY (id, product_id),
    timestamp TIMESTAMP WITH TIME ZONE,
    action product_status,
    description TEXT,
    performed_by_id VARCHAR(50) REFERENCES supplychain.profile(username),
    performed_by_name VARCHAR(100),
    performed_by_role user_role,
    performed_by_organization VARCHAR(100),
    location_id VARCHAR(50) REFERENCES supplychain.location(id),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    metadata JSONB,
    verified BOOLEAN DEFAULT FALSE,
    transaction_hash VARCHAR(100)
);

-- Create supply_chain_certificate junction table
CREATE TABLE IF NOT EXISTS supplychain.supply_chain_certificate (
    supply_chain_id VARCHAR(50),
    product_id VARCHAR(50),
    certificate_id VARCHAR(50) REFERENCES supplychain.certificate(id),
    PRIMARY KEY (supply_chain_id, product_id, certificate_id),
    FOREIGN KEY (supply_chain_id, product_id) REFERENCES supplychain.supply_chain(id, product_id)
    );

-- Insert auth data (initial passwords hashed)
INSERT INTO supplychain.auth (username, password, role) VALUES
    ('admin', '$2b$10$poe6hiiQXPzSe4a.DzBibeSL.yreEGVegeWpcFaF7.BWWlHVY4ftq', 'admin'), -- admin123
    ('farmer1', '$2b$10$xDBv1yKBVeVFS8/27PKz5OYmgUP0VfGPW2UEAIEN90LfvCW3p7HO6', 'farmer'), -- password123
    ('farmer2', '$2b$10$xDBv1yKBVeVFS8/27PKz5OYmgUP0VfGPW2UEAIEN90LfvCW3p7HO6', 'farmer'), -- password123
    ('farmer3', '$2b$10$xDBv1yKBVeVFS8/27PKz5OYmgUP0VfGPW2UEAIEN90LfvCW3p7HO6', 'farmer'), -- password123
    ('farmer4', '$2b$10$xDBv1yKBVeVFS8/27PKz5OYmgUP0VfGPW2UEAIEN90LfvCW3p7HO6', 'farmer'), -- password123
    ('regulator1', '$2b$10$grG6fDHWVJ6HUk9XxJ.IYeewm2JX2XfRPqVzOhuct6IxI3dRBF9p2', 'regulator'), -- securepass
    ('regulator2', '$2b$10$grG6fDHWVJ6HUk9XxJ.IYeewm2JX2XfRPqVzOhuct6IxI3dRBF9p2', 'regulator'), -- securepass
    ('regulator3', '$2b$10$grG6fDHWVJ6HUk9XxJ.IYeewm2JX2XfRPqVzOhuct6IxI3dRBF9p2', 'regulator'), -- securepass
    ('processor1', '$2b$10$m1y0TVQnOfBRrhH2ueCLXeoM0FICaLkDC2DFpP9kyt.psWtMe5HOO', 'processor'), -- process123
    ('processor2', '$2b$10$yOHD3YawG9ZkSLnQ6rM1/u/sG4dCuRcGiVbVR/SEjDrfoS3BO9Kwa', 'processor'), -- process321
    ('distributor1', '$2b$10$1tuwh8FNeBSEu3UoohXbxu4M6DVACioGtLNRbl9hfuqkyP.shxCKO', 'distributor'), -- distribute123
    ('distributor2', '$2b$10$2vZ/ScGUoqmvyChZXlAkceh5rv3fFNYe/Y.pBxh7bnxbQFyD0Kb.2', 'distributor'), -- distribute321
    ('retailer1', '$2b$10$RqHWbaAHPqJFXQ20rp6xoOcgJx.9aiZ.UOqMR.H3o2FZqLCs0HkA6', 'retailer'); -- retail123

-- Insert profile data
INSERT INTO supplychain.profile (username, name, organization, email, phone, address) VALUES
('admin', 'Sosane', 'System Admin', 'sosane@agrichain.com', '898-123-4567', 'Québec, Canada'),
('farmer1', 'Juan Valdez', 'Highland Coffee Co-op', 'jvaldez@agrichain.com', '123-456-7891', 'Highland Region, Colombia'),
('farmer2', 'Cleland Northern', 'Valley Rice Growers', 'cnorthern@agrichain.com', '541-541-3554', 'California, USA'),
('farmer3', 'Christian M. Manor', 'Green Valley Farms', 'cmanor@agrichain.com', '652-471-5256', 'Arizona, USA'),
('farmer4', 'Cleo Clarkeson', 'Sunny Meadows Apiary', 'cclarkeson@agrichain.com', '654-572-3456', 'Pennsylvanie, USA'),
('regulator1', 'Jennie Smith', 'Fair Trade International', 'jsmith@agrichain.com', '987-654-1230', 'Bonn, Germany'),
('regulator2', 'Naomi Bloomfield', 'Organic Farmers Association', 'nbloomfield@agrichain.com', '789-456-1230', 'Sydney, Australia'),
('regulator3', 'Catherine Edwards', 'Global Sustainable Agriculture', 'cedwards@agrichain.com', '654-564-2523', 'British Columbia, Canada'),
('processor1', 'Carlos Rodriguez', 'Bean Processing Co.', 'crodriguez@agrichain.com', '456-987-5213', 'Bogotá, Colombia'),
('processor2', 'Maria Gonzalez', 'Bean Packaging Co.', 'mgonzalez@agrichain.com', '525-241-4556', 'Bogotá, Colombia'),
('distributor1', 'Global Logistics', 'International Shipping Ltd.', 'glogistics@agrichain.com', '652-526-6259', 'Bogotá, Colombia'),
('distributor2', 'US Distribution Co.', 'East Coast Distribution', 'usdistribution@agrichain.com', '455-951-7555', '123 Distribution Way, New York, NY'),
('retailer1', 'Naima', 'Walmart', 'naima@agrichain.com', '217-544-5656', 'Ontario, Canada');

-- First insert locations
INSERT INTO supplychain.location (id, name, latitude, longitude, address) VALUES
    ('loc-farm1', 'Highland Farm', 4.5709, -74.2973, 'Highland Region, Colombia'),
    ('loc-farm2', 'Valley Farm', 4.7709, -74.9973, 'Valley Region, USA'),
    ('loc-farm3', 'Mountain Farm', 4.7809, -74.9983, 'Mountain Region, USA'),
    ('loc-farm4', 'Meadows Apiary', 5.7809, -75.9983, 'Pennsylvania, USA'),
    ('loc-proc1', 'Processing Plant', 4.6097, -74.0817, 'Bogotá, Colombia'),
    ('loc-proc2', 'Processing Facility', 36.7783, -119.4179, '456 Processing Ave, California, CA'),
    ('loc-pack1', 'Packaging Facility', 4.6097, -74.0817, 'Bogotá, Colombia'),
    ('loc-pack2', 'Packaging Centre', 40.4406, -79.9959, '101 Packaging Rd, Pittsburgh, PA'),
    ('loc-ship1', 'Cartagena Port', 10.3910, -75.4794, 'Cartagena, Colombia'),
    ('loc-ship2', 'Distributor Warehouse', 40.7128, -74.0060, '123 Distribution Way, New York, NY'),
    ('loc-ret1', 'Retail SuperCentre', 43.65714, -79.43585, 'Ontario, Canada'),
    ('loc-ret2', 'Retail Distribution Center', 33.4484, -112.0740, '789 Distribution Blvd, Phoenix, AZ');

-- Insert certificates
INSERT INTO supplychain.certificate (id, name, issued_by, issued_date, expiry_date, status) VALUES
    ('cert1', 'Organic Certified', 'regulator1', '2023-09-12T10:00:00Z', '2025-09-12T10:00:00Z', 'valid'),
    ('cert2', 'Fair Trade', 'regulator2', '2023-08-15T10:00:00Z', '2025-08-15T10:00:00Z', 'valid'),
    ('cert3', 'Sustainable Farming', 'regulator3', '2023-09-05T08:00:00Z', '2025-09-05T08:00:00Z', 'valid'),
    ('cert4', 'Organic Certified', 'regulator1', '2023-08-20T10:00:00Z', '2025-08-20T10:00:00Z', 'valid');

-- Insert product
INSERT INTO supplychain.product (
    id, name, description, type, image_url, batch_id, qr_code, qr_image,
    created_at, current_location_id, status, farmer_username, farmer_name,
    farmer_organization, retail_price, verification_count, last_verified
) VALUES (
             'PROD-E6BCCC', 'Organic Coffee Beans',
             'Premium Arabica coffee beans grown using sustainable farming practices in the highlands. These beans are cultivated without the use of synthetic pesticides or fertilizers, ensuring a pure and natural taste. The rich volcanic soil and ideal climate conditions contribute to the exceptional quality of these coffee beans.',
             'Coffee',
             'https://images.pexels.com/photos/4919737/pexels-photo-4919737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
             'BATCH-CF-2023-001', 'QR-001', 'data:image/png;base64,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',
             '2023-10-15T08:30:00Z', 'loc-ret1', 'received',
             'farmer1', 'Juan Valdez', 'Highland Coffee Co-op', 12.99, 367, '2023-11-20T14:22:10Z'
         ),
         (
             'PROD-A7E807', 'Premium Rice',
             'High-quality rice grown in sustainable conditions',
             'Grain',
             'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
             'BATCH-RC-2023-042', 'QR-042', 'data:image/png;base64,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',
             '2023-10-22T10:15:00Z', 'loc-proc2', 'processed',
             'farmer2', 'Cleland Northern', 'Valley Rice Growers', 8.99, 215, '2023-11-18T09:45:30Z'
         ),
         (
             'PROD-D14DDB', 'Fresh Avocados',
             'Farm-fresh avocados harvested at peak ripeness',
             'Produce',
             'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
             'BATCH-AV-2023-087', 'QR-087', 'data:image/png;base64,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',
             '2023-11-05T07:30:00Z', 'loc-ret2', 'delivered',
             'farmer3', 'Christian M. Manor', 'Green Valley Farms', 6.49, 132, '2023-11-19T16:12:45Z'
         ),
         (
             'PROD-B9EDBF', 'Wild Honey',
             'Pure, unfiltered honey from wildflower sources',
             'Honey',
             'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
             'BATCH-HN-2023-029', 'QR-029', 'data:image/png;base64,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',
             '2023-10-30T11:45:00Z', 'loc-pack2', 'packaged',
             'farmer4', 'Cleo Clarkeson', 'Sunny Meadows Apiary', 14.99, 198, '2023-11-17T13:30:20Z'
         );

-- Link product to certificates
INSERT INTO supplychain.product_certificate (product_id, certificate_id) VALUES
     ('PROD-E6BCCC', 'cert1'),
     ('PROD-E6BCCC', 'cert2'),
     ('PROD-A7E807', 'cert3'),
     ('PROD-B9EDBF', 'cert4');

-- Insert supply chain steps
INSERT INTO supplychain.supply_chain (
    id, product_id, timestamp, action, description, performed_by_id,
    performed_by_name, performed_by_role, performed_by_organization,
    location_id, temperature, humidity, metadata, verified, transaction_hash
) VALUES
      ('step1', 'PROD-E6BCCC', '2023-06-01T09:00:00Z', 'planted', 'Coffee seedlings planted in highland area at optimal season',
       'farmer1', 'Juan Valdez', 'farmer', 'Highland Coffee Co-op', 'loc-farm1', NULL, NULL,
       '{"seedType": "Arabica", "soilType": "Volcanic"}', TRUE, '0x8a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c77'),
      ('step2', 'PROD-E6BCCC', '2023-09-15T08:30:00Z', 'harvested', 'Coffee cherries harvested at peak ripeness',
       'farmer1', 'Juan Valdez', 'farmer', 'Highland Coffee Co-op', 'loc-farm1', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step3', 'PROD-E6BCCC', '2023-09-20T10:15:00Z', 'processed', 'Coffee beans extracted from cherries and dried',
       'processor1', 'Carlos Rodriguez', 'processor', 'Bean Processing Co.', 'loc-proc1', 26, 55, NULL, TRUE, '0x2a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700f19'),
      ('step4', 'PROD-E6BCCC', '2023-09-25T13:20:00Z', 'packaged', 'Coffee beans roasted and packaged in eco-friendly bags',
       'processor2', 'Maria Gonzalez', 'processor', 'Bean Packaging Co.', 'loc-pack1', NULL, NULL, NULL, TRUE, '0x6a5f16c5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700e33'),
      ('step5', 'PROD-E6BCCC', '2023-10-10T08:00:00Z', 'shipped', 'Products shipped to USA via container ship',
       'distributor1', 'Global Logistics', 'distributor', 'International Shipping Ltd.', 'loc-ship1', 24, 60, NULL, TRUE, '0x3c8d17b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700b55'),
      ('step6', 'PROD-E6BCCC', '2023-10-20T14:30:00Z', 'delivered', 'Product received at distributor warehouse',
       'distributor2', 'US Distribution Co.', 'distributor', 'East Coast Distribution', 'loc-ship2', NULL, NULL, NULL, TRUE, '0x9b8c56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700a22'),
      ('step7', 'PROD-E6BCCC', '2023-10-21T17:30:00Z', 'received', 'Product on retailer shelves',
       'retailer1', 'Naima', 'retailer', 'Walmart', 'loc-ret1', NULL, NULL, NULL, TRUE, '0x5b8c56b5dc63a8e8c8bf01f3f4cd5d49f7d82439f9bc14849d8b861549700a22'),
      ('step1', 'PROD-A7E807', '2023-10-22T10:15:00Z', 'harvested', 'Rice grains harvested',
       'farmer2', 'Cleland Northern', 'farmer', 'Valley Rice Growers', 'loc-farm2', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3b7e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step2', 'PROD-A7E807', '2023-10-30T10:15:00Z', 'processed', 'Rice grains polished and whitened',
       'processor1', 'Carlos Rodriguez', 'processor', 'Bean Processing Co.', 'loc-proc2', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step1', 'PROD-D14DDB', '2023-11-05T07:30:00Z', 'harvested', 'Avocados harvested at peak ripeness',
       'farmer3', 'Christian M. Manor', 'farmer', 'Green Valley Farms', 'loc-farm3', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step2', 'PROD-D14DDB', '2023-11-10T07:30:00Z', 'processed', 'Processed avocados',
       'processor1', 'Carlos Rodriguez', 'processor', 'Bean Processing Co.', 'loc-proc2', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step3', 'PROD-D14DDB', '2023-11-15T07:30:00Z', 'delivered', 'Produce delivered',
       'distributor2', 'US Distribution Co.', 'distributor', 'East Coast Distribution', 'loc-ship2', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step1', 'PROD-B9EDBF', '2023-10-30T11:45:00Z', 'harvested', 'Honey harvested from wildflower sources',
       'farmer4', 'Cleo Clarkeson', 'farmer', 'Sunny Meadows Apiary', 'loc-farm4', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step2', 'PROD-B9EDBF', '2023-11-06T11:45:00Z', 'packaged', 'Packaged honey',
       'processor2', 'Maria Gonzalez', 'processor', 'Bean Packaging Co.', 'loc-pack1', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a');

-- Link certificates to supply chain steps where applicable
INSERT INTO supplychain.supply_chain_certificate (supply_chain_id, product_id, certificate_id) VALUES
    ('step3', 'PROD-E6BCCC', 'cert1'),
    ('step7', 'PROD-E6BCCC', 'cert2'),
    ('step1', 'PROD-A7E807', 'cert3'),
    ('step1', 'PROD-B9EDBF', 'cert4');

-- Change ownership of all tables to postgres
ALTER TABLE supplychain.auth OWNER TO postgres;
ALTER TABLE supplychain.profile OWNER TO postgres;
ALTER TABLE supplychain.location OWNER TO postgres;
ALTER TABLE supplychain.certificate OWNER TO postgres;
ALTER TABLE supplychain.product OWNER TO postgres;
ALTER TABLE supplychain.product_certificate OWNER TO postgres;
ALTER TABLE supplychain.supply_chain OWNER TO postgres;
ALTER TABLE supplychain.supply_chain_certificate OWNER TO postgres;

-- Change ownership of types to postgres
ALTER TYPE user_role OWNER TO postgres;
ALTER TYPE cert_status OWNER TO postgres;
ALTER TYPE product_status OWNER TO postgres;