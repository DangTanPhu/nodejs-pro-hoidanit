import { Request, Response } from "express";
import { countTotalProductClientPages, getProduct } from "services/client/item.service";
import { getProductWithFilter } from "services/client/product.filter";
import { getAllRoles, getUserById, handleCreateUser, handleDeleteUser, updateUserById } from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1
    const totalPages = await countTotalProductClientPages(8);
    const products = await getProduct(currentPage, 8);

    return res.render("client/home/show.ejs", {
        products: products,
        totalPages: +totalPages,
        page: +currentPage
    });
}
const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getAllRoles();
    console.log(roles);
    return res.render("admin/user/create.ejs", {
        roles: roles
    })
}
const postCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;

    // Lấy đúng tên file đã upload
    const avatar = file?.filename ?? null;

    // Lưu xuống DB
    await handleCreateUser(fullName, username, address, phone, avatar, role);

    return res.redirect("/admin/user");
};
const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const a = await handleDeleteUser(id);
    return res.redirect("/admin/user");
}
const getViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getUserById(id);
    const roles = await getAllRoles();
    return res.render("admin/user/detail.ejs", {
        id: id,
        user: user,
        roles
    });
}
const postUpdateUser = async (req: Request, res: Response) => {
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;

    // Lấy đúng tên file đã upload
    const avatar = file?.filename ?? undefined;
    await updateUserById(fullName, username, address, phone, avatar, role);
    return res.redirect("/admin/user");
}
const getProductFilterPage = async (req: Request, res: Response) => {
    const { page, factory="", target ="", price = "", sort ="" } 
    = req.query as {
        page?:string;
        factory : string,
        target :string,
        price : string,
        sort:string
    };
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;
    // const totalPages = await countTotalProductClientPages(6);
    // const products = await getProduct(currentPage, 6);
    const data =await getProductWithFilter(currentPage,6,factory,target,price,sort);
    return res.render("client/product/filter.ejs",{
        products:data.products,
        totalPages:+data.totalPages,
        page:+currentPage
    })
    // const { username } = req.query;
    // const users = await userFilter(username as string);
    // const { minPrice, maxPrice, factory, price, sort } = req.query;
    // // yc1
    // // const products = await yeucau1(+minPrice);
    // // yc2
    // // const products = await yeucau2(+maxPrice);
    // // yc3
    // // const products = await yeucau3(factory as string);
    // // yc4
    // // const products = await yeucau4((factory as string).split(","));
    // // yc5
    // // const products = await yeucau5(10000000 ,15000000);
    // // // yc6
    // //  const products = await yeucau6();
    // // yc7
    // const products = await yeucau7();

    // res.status(200).json({
    //     data: products
    // })
}
export {
    getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getViewUser, postUpdateUser,
    getProductFilterPage
};