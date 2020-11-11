/* eslint-disable */
const router = require('express').Router();

const { protect } = require('../middleware/auth');
const productController = require('../controllers/productController');
const parser = require('../utils/cloudinary');

router.route('/')
    .get(productController.getAllProducts)
    .post(
        protect,
        parser.single('image'),
        productController.createProduct
    )

router.get('/:slug', productController.getProduct)

router.route('/:pid')
    .put(
        protect,
        parser.single('image'),
        productController.updateProduct
    )
    .delete(productController.deleteProduct)

module.exports = router;