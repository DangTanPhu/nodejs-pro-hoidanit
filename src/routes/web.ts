// const express = require('express');
import express ,{Express} from "express";
import { getCreateUserPage, getHomePage, postCreateUser,postDeleteUser,getViewUser, postUpdateUser} from "controllers/user.controller";
import { getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashBoardPage } from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
const router = express.Router();
const webRoutes=(app : Express)=> {
    router.get('/', getHomePage );
    router.post('/handle-update-user', postUpdateUser);
    // console.log(__dirname + "/views");  

    //admin routes
    router.get('/admin', getDashBoardPage );
    router.get('/admin/user', getAdminUserPage);
    router.get('/admin/create-user', getCreateUserPage);
    router.post('/admin/handle-create-user',fileUploadMiddleware("avatar"), postCreateUser);
    router.post('/admin/handle-delete-user/:id', postDeleteUser);
    router.get('/admin/handle-view-user/:id', getViewUser);
    router.post('/admin/handle-update-user',fileUploadMiddleware("avatar"), postUpdateUser);

    router.get('/admin/product', getAdminProductPage);
    router.get('/admin/order', getAdminOrderPage);
    app.use("/",router);
}



export default webRoutes;