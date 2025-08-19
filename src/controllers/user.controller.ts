import { Request,Response } from "express";
import { getAllRoles, getAllUsers, getUserById, handleCreateUser, handleDeleteUser, updateUserById} from "services/user.service";
const getHomePage = async(req :Request, res :Response) => {
    //get user
    const users =await getAllUsers();
    console.log("Check user: ", users);
    // x<-y
    return res.render("home",{
        users: users
    });
    }
const getCreateUserPage = async(req :Request, res :Response) => {
    const roles = await getAllRoles();
    console.log(roles); 
    return res.render("admin/user/create.ejs",{
        roles : roles
    })
    }
const postCreateUser = async(req :Request, res :Response) => {
    
    //object detructering
    const {fullName,username,phone,role,address}=req.body; 
   
    //handle create user
    // const a = await handleCreateUser(fullName,email,address);

    return res.redirect("/admin/");
    }  
const postDeleteUser   = async(req :Request, res :Response) => {
    const {id} = req.params;
    const a = await handleDeleteUser(id);
    return res.redirect("/");
    }  
const getViewUser = async(req :Request, res :Response) => {
    const {id} = req.params;
    const user =await getUserById(id);
    return res.render("view-user.ejs", {
        id:id,
        user:user
    });
    }  
const postUpdateUser = async(req :Request, res :Response) => {
    const {id,fullName,email,address} = req.body;
    const a= await updateUserById(id,fullName,email,address);
    return res.redirect("/");
    }  
export {getHomePage ,getCreateUserPage,postCreateUser,postDeleteUser,getViewUser,postUpdateUser };