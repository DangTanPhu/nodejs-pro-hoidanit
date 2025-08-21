import { Request, Response } from "express-serve-static-core"
const getAdminProductPage = async (req:Request,res:Response)=> {
    return res.render("admin/product/");
}
const getCreateProductPage = async(req :Request, res :Response) => {
    
    return res.render("admin/product/create.ejs");
    }
const postAdminCreateProduct = async(req :Request, res :Response) => {
    const {name} = req.body;
    return res.redirect("/admin/product");
    }
export {
    getAdminProductPage,
    getCreateProductPage,
    postAdminCreateProduct
}