// const express = require('express');
import express, { Express } from "express";
import { getCreateUserPage, getHomePage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser } from "controllers/user.controller";
import { getAdminOrderDetailPage, getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashBoardPage } from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getCartPage, getCheckOutPage, getProductPage, getThanksPage, postAddProductToCart, postDeleteProductInCart, postHandleCartToCheckOut, postPlaceOrder } from "controllers/client/product.controller";
import { getCreateProductPage, getViewProduct, postAdminCreateProduct, postDeleteProduct, postUpdateProduct } from "controllers/admin/product.controller";
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postLogout, postRegister } from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";
const router = express.Router();
const webRoutes = (app: Express) => {
    router.get("/", getHomePage);
    router.get("/success-redirect", getSuccessRedirectPage)
    router.get("/product/:id", getProductPage);
    router.get("/login", isLogin, getLoginPage);
    router.post('/login', passport.authenticate('local', {
        successRedirect: "/success-redirect",
        failureRedirect: "/login",
        failureMessage: true,
    }));
    router.post("/logout", postLogout);


    router.get("/register", getRegisterPage);
    router.post("/register", postRegister);
    router.post("/add-product-to-cart/:id", postAddProductToCart);
    router.get("/cart", getCartPage);
    router.post("/delete-product-in-cart/:id", postDeleteProductInCart);

    router.post("/handle-cart-to-checkout", postHandleCartToCheckOut);
    router.get("/checkout", getCheckOutPage);
    router.post("/place-order", postPlaceOrder);
    router.get("/thanks", getThanksPage);
    // console.log(__dirname + "/views");  

    //admin routes
    router.get('/admin', isAdmin, getDashBoardPage);
    router.get('/admin/user', getAdminUserPage);
    router.get('/admin/create-user', getCreateUserPage);
    router.post('/admin/handle-create-user', fileUploadMiddleware("avatar"), postCreateUser);
    router.post('/admin/handle-delete-user/:id', postDeleteUser);
    router.get('/admin/handle-view-user/:id', getViewUser);
    router.post('/admin/handle-update-user', fileUploadMiddleware("avatar"), postUpdateUser);

    router.get('/admin/product', getAdminProductPage);
    router.get('/admin/create-product', getCreateProductPage);
    router.post('/admin/handle-create-product', fileUploadMiddleware("image", "images/product"), postAdminCreateProduct);
    router.post('/admin/handle-delete-product/:id', postDeleteProduct);
    router.get('/admin/handle-view-product/:id', getViewProduct);
    router.post('/admin/handle-update-product', fileUploadMiddleware("image", "images/product"), postUpdateProduct);

    router.get('/admin/order', getAdminOrderPage);
    router.get('/admin/order/:id', getAdminOrderDetailPage);
    app.use("/", isAdmin, router);
}



export default webRoutes;