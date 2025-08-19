import getConnection from "config/database";
import { PrismaClient, Prisma } from '@prisma/client'
import { prisma } from "config/client";



const getAllUsers =async() => {
  const users = await prisma.user.findMany();
  return users;
}
const handleCreateUser= async(
    fullName: string,
    email: string, 
    address:string) => {
    //insert into database
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        address: address,
      }
    })
    return newUser;
   
}
const handleDeleteUser = async(id: string) => {
    try {
        const connection = await getConnection();
        const sql = 'DELETE FROM `users` WHERE `id` = ? LIMIT 1';
        const values = [id];

        const [result, fields] = await connection.execute(sql, values);
        return result;
        
        } catch (err) {
        console.log(err);
        return [];
    }
}
const getUserById = async(id: string) => {
    try {
        const connection = await getConnection();
        const sql = 'SELECT * FROM `users` WHERE `id` = ?';
        const values = [id];

        const [result, fields] = await connection.execute(sql, values);
        return result[0];
        
        } catch (err) {
        console.log(err);
        return [];
    }
}
const updateUserById = async (
  id: string,
  fullName: string,
  email: string,
  address: string
) => {
  try {
    const connection = await getConnection();
    const sql =
      "UPDATE `users` SET `name` = ?,`email`= ?,`address`= ? WHERE `id` = ?";
    const values = [fullName, email, address, id];

    const [result, fields] = await connection.execute(sql, values);

    console.log(result);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
};


export {handleCreateUser,getAllUsers,handleDeleteUser,getUserById,updateUserById}