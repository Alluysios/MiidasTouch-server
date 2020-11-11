/* eslint-disable */
const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    let filter = {}
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const products = await features.query.populate({
        path: 'user',
        select: 'name'
    });

    res.status(200).json({products});
}

// CREATE SINGLE PRODUCT
exports.createProduct = async (req, res) => {
    if(req.file) req.body.image = req.file.filename;
    if(req.user) req.body.user = req.user.id;
    const products = await Product.create(req.body);
    
    res.status(201).json({products});
}

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate({
        path: 'user',
        select: 'name'
    });
    
    res.status(200).json({product});
}

// UPDATE SINGLE PRODUCT BY PRODUCT ID
exports.updateProduct = async (req, res) => {
    if(req.file) req.body.image = req.file.filename;
    if(req.user) req.body.user = req.user.id;
    const product = await Product.findByIdAndUpdate(req.params.pid, req.body, {
        new: true
    });
    res.status(200).json({product})
}

// DELETE SINGLE PRODUCT BY PRODUCT ID
exports.deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.pid);
    res.json({ pid: product._id });
}