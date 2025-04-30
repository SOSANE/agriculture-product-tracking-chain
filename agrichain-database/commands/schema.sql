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
    issued_by VARCHAR(100) NOT NULL,
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
    qr_code VARCHAR(50),
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
    ('regulator1', '$2b$10$grG6fDHWVJ6HUk9XxJ.IYeewm2JX2XfRPqVzOhuct6IxI3dRBF9p2', 'regulator'), -- securepass
    ('processor1', '$2b$10$namjlQ9gXD6avzlCABfMIeEakEDpc4DkTIDerz9yhsGVPUFa4rdE', 'processor'), -- process123
    ('processor2', '$2b$10$yOHD3YawG9ZkSLnQ6rM1/u/sG4dCuRcGiVbVR/SEjDrfoS3BO9Kwa', 'processor'), -- process321
    ('distributor1', '$2b$10$1tuwh8FNeBSEu3UoohXbxu4M6DVACioGtLNRbl9hfuqkyP.shxCKO', 'distributor'), -- distribute123
    ('distributor2', '$2b$10$2vZ/ScGUoqmvyChZXlAkceh5rv3fFNYe/Y.pBxh7bnxbQFyD0Kb.2', 'distributor'), -- distribute321
    ('retailer1', '$2b$10$RqHWbaAHPqJFXQ20rp6xoOcgJx.9aiZ.UOqMR.H3o2FZqLCs0HkA6', 'retailer'); -- retail123

-- Insert profile data
INSERT INTO supplychain.profile (username, name, organization, email, phone, address) VALUES
('admin', 'Sosane', 'System Admin', 'sosane@agrichain.ca', '898-123-4567', 'Québec, Canada'),
('farmer1', 'Juan Valdez', 'Highland Coffee Co-op', 'jvaldez@agrichain.ca', '123-456-7891', 'Highland Region, Colombia'),
('regulator1', 'Jennie Smith', 'Fair Trade International', 'jsmith@agrichain.ca', '987-654-1230', 'Bonn, Germany'),
('processor1', 'Carlos Rodriguez', 'Bean Processing Co.', 'crodriguez@agrichain.ca', '456-987-5213', 'Bogotá, Colombia'),
('processor2', 'Maria Gonzalez', 'Bean Packaging Co.', 'mgonzalez@agrichain.ca', '525-241-4556', 'Bogotá, Colombia'),
('distributor1', 'Global Logistics', 'International Shipping Ltd.', 'glogistics@agrichain.ca', '652-526-6259', 'Bogotá, Colombia'),
('distributor2', 'US Distribution Co.', 'East Coast Distribution', 'usdistribution@agrichain.ca', '455-951-7555', '123 Distribution Way, New York, NY'),
('retailer1', 'Naima', 'Walmart', 'naimaWalmart@agrichain.ca', '217-544-5656', 'Ontario, Canada');

-- First insert locations
INSERT INTO supplychain.location (id, name, latitude, longitude, address) VALUES
    ('loc-farm1', 'Highland Farm', 4.5709, -74.2973, 'Highland Region, Colombia'),
    ('loc-proc1', 'Processing Plant', 4.6097, -74.0817, 'Bogotá, Colombia'),
    ('loc-pack1', 'Packaging Facility', 4.6097, -74.0817, 'Bogotá, Colombia'),
    ('loc-ship1', 'Cartagena Port', 10.3910, -75.4794, 'Cartagena, Colombia'),
    ('loc-ship2', 'Distributor Warehouse', 40.7128, -74.0060, '123 Distribution Way, New York, NY'),
    ('loc-ret1', 'Retail SuperCentre', 43.65714, -79.43585, 'Ontario, Canada');

-- Insert certificates
INSERT INTO supplychain.certificate (id, name, issued_by, issued_date, expiry_date, status) VALUES
    ('cert1', 'Organic Certified', 'Organic Farmers Association', '2023-09-12T10:00:00Z', '2024-09-12T10:00:00Z', 'valid'),
    ('cert2', 'Fair Trade', 'Fair Trade International', '2023-08-15T10:00:00Z', '2024-08-15T10:00:00Z', 'valid');

-- Insert product
INSERT INTO supplychain.product (
    id, name, description, type, image_url, batch_id, qr_code,
    created_at, current_location_id, status, farmer_username, farmer_name,
    farmer_organization, retail_price, verification_count, last_verified
) VALUES (
             '1', 'Organic Coffee Beans',
             'Premium Arabica coffee beans grown using sustainable farming practices in the highlands. These beans are cultivated without the use of synthetic pesticides or fertilizers, ensuring a pure and natural taste. The rich volcanic soil and ideal climate conditions contribute to the exceptional quality of these coffee beans.',
             'Coffee',
             'https://images.pexels.com/photos/4919737/pexels-photo-4919737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
             'BATCH-CF-2023-001', 'QR-001', '2023-10-15T08:30:00Z', 'loc-ret1', 'received',
             'farmer1', 'Juan Valdez', 'Highland Coffee Co-op', 12.99, 367, '2023-11-20T14:22:10Z'
         );

-- Link product to certificates
INSERT INTO supplychain.product_certificate (product_id, certificate_id) VALUES
     ('1', 'cert1'),
     ('1', 'cert2');

-- Insert supply chain steps
INSERT INTO supplychain.supply_chain (
    id, product_id, timestamp, action, description, performed_by_id,
    performed_by_name, performed_by_role, performed_by_organization,
    location_id, temperature, humidity, metadata, verified, transaction_hash
) VALUES
      ('step1', '1', '2023-06-01T09:00:00Z', 'planted', 'Coffee seedlings planted in highland area at optimal season',
       'farmer1', 'Juan Valdez', 'farmer', 'Highland Coffee Co-op', 'loc-farm1', NULL, NULL,
       '{"seedType": "Arabica", "soilType": "Volcanic"}', TRUE, '0x8a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c77'),
      ('step2', '1', '2023-09-15T08:30:00Z', 'harvested', 'Coffee cherries harvested at peak ripeness',
       'farmer1', 'Juan Valdez', 'farmer', 'Highland Coffee Co-op', 'loc-farm1', 22, 68, NULL, TRUE, '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'),
      ('step3', '1', '2023-09-20T10:15:00Z', 'processed', 'Coffee beans extracted from cherries and dried',
       'processor1', 'Carlos Rodriguez', 'processor', 'Bean Processing Co.', 'loc-proc1', 26, 55, NULL, TRUE, '0x2a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700f19'),
      ('step4', '1', '2023-09-25T13:20:00Z', 'packaged', 'Coffee beans roasted and packaged in eco-friendly bags',
       'processor2', 'Maria Gonzalez', 'processor', 'Bean Packaging Co.', 'loc-pack1', NULL, NULL, NULL, TRUE, '0x6a5f16c5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700e33'),
      ('step5', '1', '2023-10-10T08:00:00Z', 'shipped', 'Products shipped to USA via container ship',
       'distributor1', 'Global Logistics', 'distributor', 'International Shipping Ltd.', 'loc-ship1', 24, 60, NULL, TRUE, '0x3c8d17b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700b55'),
      ('step6', '1', '2023-10-20T14:30:00Z', 'delivered', 'Product received at distributor warehouse',
       'distributor2', 'US Distribution Co.', 'distributor', 'East Coast Distribution', 'loc-ship2', NULL, NULL, NULL, TRUE, '0x9b8c56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700a22'),
      ('step7', '1', '2023-10-21T17:30:00Z', 'received', 'Product on retailer shelves',
       'retailer1', 'Naima', 'retailer', 'Walmart', 'loc-ret1', NULL, NULL, NULL, TRUE, '0x5b8c56b5dc63a8e8c8bf01f3f4cd5d49f7d82439f9bc14849d8b861549700a22');

-- Link certificates to supply chain steps where applicable
INSERT INTO supplychain.supply_chain_certificate (supply_chain_id, product_id, certificate_id) VALUES
    ('step3', '1', 'cert1');

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