import { prisma } from "config/client"

const getProduct = async () => {
    const products = await prisma.product.findMany();
    return products;
}
const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id }
    })
}
const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    });
    const product = await prisma.product.findUnique({
        where: { id: productId }
    })
    if (cart) {
        //update

        // cap nhat cart
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                sum: {
                    increment: quantity,
                }
            }
        })
        //cap nhat cart-detail 
        //neu chua co tao moi , roi cap nhat quantity
        //upsert = update + insert

        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                productId: productId,
                cartId:cart.id,
            }
        })
        await prisma.cartDetail.upsert({
            where: {
                // trong truong hop khong ton tai thi truyen 0 vao create
                id: currentCartDetail?.id ?? 0 
            },
            update: {
                quantity:{
                    increment:quantity 
                },
            },
            create: {
                price: product.price,
                quantity:quantity,
                productId:product.id,
                cartId:cart.id
            },
        })
    } else {
        //create
        await prisma.cart.create({
            data: {
                sum: quantity,
                userId: user.id,
                cartDetails: {
                    create: [
                        {
                            price: product.price,
                            quantity: quantity,
                            productId: productId
                        }
                    ]
                }
            }
        })
    }
}
const getProductInCart = async (userId: number)=>{
    const cart= await prisma.cart.findUnique({
        where:{userId}
    })
    if(cart){
        const currentCartDetail= await prisma.cartDetail.findMany({
            where:{cartId:cart.id},
            include:{product:true}
        })
        return currentCartDetail;
    }
    return [];
}
export {
    getProduct,
    getProductById,
    addProductToCart,
    getProductInCart
}