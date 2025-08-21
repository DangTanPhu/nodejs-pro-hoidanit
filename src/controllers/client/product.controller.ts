import { Request, Response } from "express-serve-static-core"
import { getProductById } from "services/client/item.service";
const getProductPage = async (req:Request,res:Response)=> {
    const {id} =req.params;
    const product=await getProductById(+id);
    return res.render("client/product/detail.ejs",{
        product
    });
}
export {
    getProductPage
}