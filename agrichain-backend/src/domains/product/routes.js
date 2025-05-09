const express = require('express');
const router = express.Router();
const {ProductController} = require('./controller');

router.get('/api/products/:id', ProductController.getProductById);
router.get('/api/products', ProductController.getProducts);
router.put('/api/register-product', ProductController.registerProduct);
router.get('/api/certificates', ProductController.getCertificateByUsername);
router.get('/api/certificates/:id', ProductController.getCertificateById);

module.exports = router;
