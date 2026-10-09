const userCollection = require('../Models/userSchema');
const productCollection = require('../Models/productSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const datak = 'abchari123@';

signup = async(req, res, next) => {

    try{
        let {name, email, password} = req.body;
        console.log(name, email, password);
        const userData = await userCollection.findOne({email : email});
        if(userData){
           res.status(401).json({message : 'user account already exists'});
        }
        else{
            password = bcrypt.hashSync(password, 13);
            await userCollection.create({name, email, password});
            res.status(200).json({message  :'user created successfully!!!'})
        }
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
}

login = async(req, res) => {

    try{
        const {email, password} = req.body;
        const user = await userCollection.findOne({email : email});
        if(!user){
            res.status(404).json({message : "user not found!!! create one account"});
        }
        else{
            const passwordValidator = bcrypt.compareSync(password, user.password);
            if(!passwordValidator){
                res.status(401).json({message : "invalid password"});
            }
            else{
                const token = jwt.sign({id : user._id, role : user.role}, datak, {expiresIn :"7d"});
                res.status(200).json({message : token, role : user.role, id : user._id});
            }
        }    
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
}


addproducts = async (req, res) => {

    try {

        const { 
            productname, description, category , subcategory,
            price, stockquantity, brand, availability
        } = req.body;

        const image = req.file ? req.file.filename : "";

        await productCollection.create({

            productname,
            description,
            category,
            subcategory,
            price,
            stockquantity,
            brand,
            image,
            availability

        });

        res.status(201).json({
            message: "product added successfully!!!"
        });

    }
    catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
};


fetchProducts = async (req, res, next) => {
    
    try{
        const products = await productCollection.find();
        res.status(200).json({message : products});
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
}

deleteProducts = async(req, res, next) => {

    try{
        const id = req.body.id;
        await productCollection.deleteOne({_id : id});
        res.status(200).json({message : "product deleted successfully!!!"});
    }
    catch(error){
        res.status(500).json({message : error.message});
    }
}


updateProduct = async (req, res) => {

    try {

        const data = req.body;

        if (req.file) {
            data.image = req.file.filename;
        }

        await productCollection.findByIdAndUpdate(
            req.params.id,
            data
        );

        res.status(200).json({
            message: "product updated successfully!!!"
        });

    }
    
    catch(error) {

        res.status(500).json({
            message: error.message
        });

    }
};

buyproduct = async (req, res, next) => {

    try {
        const {purchasequantity, data,id} = req.body;

        const userData = await userCollection.findById(id);
        if (!userData) {
            return res.status(404).json({message: "user not found"});
        }

        const productData = await productCollection.findById(data._id);
        if (!productData) {
            return res.status(404).json({message: "product not found"});
        }

        const remainingStock = productData.stockquantity - purchasequantity;

        if (remainingStock < 0) {
            return res.status(400).json({
                message: "not enough stock"
            });
        }

        if (remainingStock === 0) {
            await productCollection.updateOne(
                { _id: productData._id },
                {
                    $set: {
                        stockquantity: 0,
                        availability: "outofstock"
                    }
                }
            );
        }
        else {
            await productCollection.updateOne(
                { _id: productData._id },
                {
                    $set: {
                        stockquantity: remainingStock
                    }
                }
            );
        }


        userData.purchaseHistory.push({
            productId: productData._id,
            quantity: purchasequantity,
            price: productData.price
        });


        await userData.save();
    
        res.status(201).json({
            message: "product purchased successfully!!!"
        });
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

addToCart = async (req, res) => {

    try {

        const { userId, productId } = req.body;

        const user = await userCollection.findById(userId);

        if (!user) {
            return res.status(404).json({message : "user not found"});
        }

        const existingProduct = user.cart.find(
            item => item.productId.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        }

        else {
            user.cart.push({ 
                productId : productId,
                quantity : 1
            });
        }

        await user.save();
        res.status(200).json({message : "product added to cart"});
    }

    catch(error) {
        res.status(500).json({message : error.message});
    }
};

getCart = async (req, res) => {

    try {
        const user = await userCollection.findById(req.params.userId).populate('cart.productId');

        if (!user) {
            return res.status(404).json({message : "user not found"});
        }
        res.status(200).json({message : user.cart});
    }

    catch(error) {
        res.status(500).json({message : error.message});
    }
};

getCartCount = async (req, res) => {

    try {
        const user = await userCollection.findById(req.params.userId);

        if(!user) {
            return res.status(404).json({message : "user not found"});
        }

        let count = 0;

        user.cart.forEach(item => {
            count += item.quantity;
        });

        res.status(200).json({count : count});
    }
    catch(error) {
        res.status(500).json({message : error.message});
    }
};

removeFromCart = async (req, res) => {

    try {

        const { userId, productId } = req.body;

        const user = await userCollection.findById(userId);

        if (!user) {
            return res.status(404).json({message : "user not found"});
        }


        user.cart = user.cart.filter(
            item =>
            item.productId.toString() !== productId
        );

        await user.save();
        res.status(200).json({message : "product removed from cart"});
    }
    catch(error) {
        res.status(500).json({message : error.message});
    }
};

getPurchaseHistory = async (req, res) => {

    try {

        const user = await userCollection.findById(req.params.userId).populate("purchaseHistory.productId");

        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json({message: user.purchaseHistory});
    }

    catch (error) {
        res.status(500).json({ message: error.message});
    }
};

module.exports = {login, addproducts, fetchProducts, deleteProducts, updateProduct, signup, buyproduct, addToCart,getCart, getCartCount , removeFromCart, getPurchaseHistory};