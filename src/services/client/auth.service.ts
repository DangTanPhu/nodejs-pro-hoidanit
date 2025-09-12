import { prisma } from "config/client"
import { ACCOUNT_TYPE } from "config/constant";
import { comparePassword, hashPassword } from "services/user.service";

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })
    if (user) { return true; }
    return false;
}
const registerNewUser = async (fullName: string, email: string, password: string) => {
    const newPassword = await hashPassword(password);
    const userRole = await prisma.role.findUnique({
        where: { name: "USER" }
    })
    if (userRole) {
        await prisma.user.create({
            data: {
                username: email,
                password: newPassword,
                fullName: fullName,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole.id
            }
        })
    } else {
        throw new Error("User Role No exists")
    }
}
const getUserWithRoleById = async (id:string) => {
    const user = await prisma.user.findUnique({
        where:{id:+id},
        include: {
            role:true
        },
        // Dung ORM nen Sudung cai OMIT
        omit: {
            password:true
        }
    });
    //Con khong sudung thi ghi the nay :delete user.password
    return user;
}
const getUserSumCart = async (id:string) => {
    const user = await prisma.cart.findUnique({
        where:{userId:+id},
    });
    //Con khong sudung thi ghi the nay :delete user.password
    return user?.sum ?? 0;
}
export {
    isEmailExist,
    registerNewUser,
    getUserWithRoleById,
    getUserSumCart
}