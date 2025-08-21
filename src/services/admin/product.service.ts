import {prisma}from "config/client";
import { name } from "ejs";
import { updateUserById } from "services/user.service";
import { TProductSchema } from "src/validation/product.schema";

const createProduct = async (
    name: string,
    price:number,
    detailDesc: string,
    shortDesc:string,
    quantity:number,
    factory:string,
    target:string,
    imageUpload:string
) => {
    await prisma.product.create({
        data:{
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            factory,
            target,
            ...(imageUpload && {image:imageUpload})
        }
    })
}
const getProductList =async() => {
  const products = await prisma.product.findMany();
  return products;
}
const handleDeleteProduct = async (id:number) => {
    await prisma.product.delete({
        where: {id}
    })
}
const getProductById = async (id:number) => {
    return await prisma.product.findUnique({
        where: {id}
    })
}
const updateProductById = async (
    id:number,
    name:string,
    price:number,
    detailDesc:string,
    shortDesc:string,
    quantity:number,
    factory:string,
    target:string,
    imageUpload: string
) => {
    await prisma.product.update({
        where:{id},
        data: {
            name,
            price,
            quantity,
            shortDesc,
            detailDesc,
            factory,
            target,
            ...(imageUpload && {image: imageUpload })
        }
    })
}

export {
    createProduct,
    getProductList,
    handleDeleteProduct,
    getProductById,
    updateProductById
}