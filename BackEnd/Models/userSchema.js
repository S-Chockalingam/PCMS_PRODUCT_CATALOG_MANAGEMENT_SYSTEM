const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    email : {
        type: String,
        required : true
    },
    
    password : {
        type : String,
        required : true
    },

    role : {
        type : String,
        required : true,
        default : 'user'
    },

     cart : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'ProductsSchema'
            },

            quantity : {
                type : Number,
                default : 1
            }
        }
    ],

    purchaseHistory: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductsSchema'
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            purchasedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = mongoose.model("userdetails", userSchema);