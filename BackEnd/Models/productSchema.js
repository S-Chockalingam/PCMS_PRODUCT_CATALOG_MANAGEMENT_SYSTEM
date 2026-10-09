const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    productname : {
        type : String,
        required: true,
    },
    description : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true,
        enum : ['men', 'women', 'kids']
    },

    subcategory: {
        type: String,
        required: true
    },

    price : {
        type : Number,
        required : true
    },

    stockquantity : {
        type : Number,
        required : true
    },

    brand : {
        type : String,
        required : true
    },

    image: {
        type: String,
        required: true
    },

    availability : {
        type : String,
        required: true,
        enum: ['instock', 'outofstock']
    }
})

module.exports = mongoose.model("ProductsSchema", productSchema);