const crypto = require('crypto');

// Generate the product id
function generateProductId() {
    const prefix = 'PROD';
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${random}`;
}

// Generate the batch id for a product
function generateBatchId(productName = '', productType = '') {
    const source = (productType || productName).toUpperCase();
    let code = '';

    const words = source.split(/\s+/);
    if (words.length >= 2) {
        code = words[0].charAt(0) + words[1].charAt(0);
    } else {
        code = source.replace(/\s/g, '').substring(0, 2);
    }

    code = code.padEnd(2, 'X').substring(0, 2);

    const year = new Date().getFullYear();
    const seq = crypto.randomInt(1000).toString().padStart(3, '0');

    return `BATCH-${code}-${year}-${seq}`;
}

// Generate the QR data for a product
function generateQrData(contractAddress, productId) {
    return `${contractAddress}|${productId}`;
}

// Generate the QrImage from Data
async function generateQrURL(qrData) {
    const QRCode = await import('qrcode')
    return QRCode.default.toDataURL(qrData);
}

module.exports = { generateProductId, generateBatchId, generateQrData, generateQrURL };