const express = require('express');
const multer = require('multer');
const {
    login,
    addproducts,
    fetchProducts,
    deleteProducts,
    updateProduct,
    signup,
    buyproduct,
    addToCart,
    getCart,
    getCartCount,
    removeFromCart,
    getPurchaseHistory
} = require('../Controllers/apiControllers');

const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/signup', signup);
router.post("/login", login);
router.post('/addproducts',upload.single('image'),addproducts);
router.get("/fetchproducts", fetchProducts);
router.delete("/deleteproduct", deleteProducts);
router.put('/updateproduct/:id',upload.single('image'),updateProduct);
router.post("/buyproduct", buyproduct);

router.post('/addtocart', addToCart);
router.get('/cart/:userId', getCart);
router.get('/cartcount/:userId', getCartCount);
router.delete('/removefromcart', removeFromCart);
router.get("/purchase-history/:userId",getPurchaseHistory);

module.exports = router;