import { Request, Response } from "express-serve-static-core"
import { handleDeleteUserById, handleGetAllUser, handleGetUserById, handleLogin, handleUpdateUserById } from "services/client/api.service";
import { registerNewUser } from "services/client/auth.service";
import { addProductToCart } from "services/client/item.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const postAddProductToCartAPI = async (req: Request, res: Response) => {
    const { quantity, productId } = req.body;
    const user = req.user;
    const currentSum = req?.user?.sumCart ?? 0;
    const newSum = currentSum + (+quantity);
    await addProductToCart(+quantity, +productId, user);
    res.status(200).json({
        data: newSum
    })
}
const getAllUsersAPI = async (req: Request, res: Response) => {
    const users = await handleGetAllUser();
    const user = req.user;
    console.log(">>> Check user :", user)
    res.status(200).json({
        data: users
    })
}
const getAllUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params
    const users = await handleGetUserById(+id);
    res.status(200).json({
        data: users
    })
}
const createUsersAPI = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body as TRegisterSchema;
    const validate = await RegisterSchema.safeParseAsync(req.body);
    if (!validate.success) {
        const errorZod = validate.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);

        res.status(400).json({
            errors: errors
        })
        return;
    }
    await registerNewUser(fullName, email, password);
    res.status(201).json({
        data: "create user succeed"
    })
}

const updateUserByIdAPI = async (req: Request, res: Response) => {
    const { fullName, address, phone } = req.body;
    const { id } = req.params;

    // if(fullname) => update fullname : neu dung patch thi kiem tra nghiem ngat, khi truyen cai nao thi se update cai do
    await handleUpdateUserById(+id, fullName, address, phone);
    res.status(200).json({
        data: "Update user succeed"
    })
}
const deleteUserByIdAPI = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUserById(+id);
    res.status(200).json({
        data: "Delete user succeed"
    })
}
const loginAPI = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const access_token = await handleLogin(username, password);
        res.status(200).json({
            data:{
                access_token
            }
        })
    } catch (error) {
        res.status(401).json({
            data: null,
            message: error.message
        })
    }

}
//API endpoint "lấy thông tin tài khoản".
const fetchAccountAPI = async (req: Request, res: Response) => {
    const user = req.user;

    res.status(200).json({
        data: {
            user
        }
    })


}
export {
    postAddProductToCartAPI,
    getAllUsersAPI,
    getAllUserByIdAPI,
    createUsersAPI,
    updateUserByIdAPI,
    deleteUserByIdAPI,
    loginAPI,
    fetchAccountAPI
}