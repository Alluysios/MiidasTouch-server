/* eslint-disable */
const mongoose = require('mongoose')
const slugify = require('slugify')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    downPayment: Number,
    plan: [
        {
            
            term: Number,
            monthly: Number
        }
    ],
    image: String,
    images: [String],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    slug: String
});

productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower: true
    })

    next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;