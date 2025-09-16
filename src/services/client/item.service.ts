import { prisma } from "config/client"
import { number, string } from "zod";

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
                cartId: cart.id,
            }
        })
        await prisma.cartDetail.upsert({
            where: {
                // trong truong hop khong ton tai thi truyen 0 vao create
                id: currentCartDetail?.id ?? 0
            },
            update: {
                quantity: {
                    increment: quantity
                },
            },
            create: {
                price: product.price,
                quantity: quantity,
                productId: product.id,
                cartId: cart.id
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
const getProductInCart = async (userId: number) => {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    })
    if (cart) {
        const currentCartDetail = await prisma.cartDetail.findMany({
            where: { cartId: cart.id },
            include: { product: true }
        })
        return currentCartDetail;
    }
    return [];
}

const deleteProductInCart = async (cartDetailId: number, userId: number, sumCart: number) => {
    // xoas cart - detail
    const currentCardDetail = await prisma.cartDetail.findUnique({
        where: { id: cartDetailId }
    })
    const quantity = currentCardDetail.quantity;
    await prisma.cartDetail.delete({
        where: { id: cartDetailId }
    });

    if (sumCart === 1) {
        //delete cart
        await prisma.cart.delete({
            where: { userId }
        })
    } else {
        // update cart
        await prisma.cart.update({
            where: { userId },
            data: {
                sum: {
                    // decrement :w
                    decrement: quantity,
                }
            }
        })
    }
}
const updateCartDetailBeforeCheckOut = async (data: { id: string; quantity: string }[], cartId: string) => {
    let quantity = 0;
    for (let i = 0; i < data.length; i++) {
        quantity += +(data[i].quantity);
        await prisma.cartDetail.update({
            where: {
                id: +(data[i].id)
            },
            data: {
                quantity: +(data[i].quantity)
            }
        })
    }
    await prisma.cart.update({
        where: {
            id: +cartId
        },
        data: {
            sum: quantity
        }
    })
}
const handlerPlaceOrder = async (userId: number, receiverName: string, receiverAddress: string, receiverPhone: string, totalPrice: number) => {
    try {
        // tao transection
        prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: {
                    cartDetails: true
                }
            })
            if (cart) {
                //create order
                const dataOrderDetail = cart?.cartDetails?.map(
                    item => ({
                        price: item.price,
                        quantity: item.quantity,
                        productId: item.productId
                    })
                ) ?? [];
                await tx.order.create({
                    data: {
                        receiverName,
                        receiverAddress,
                        receiverPhone,
                        paymentMethod: "COD",
                        paymentStatus: "PAYMENT_UNPAID",
                        status: "PENDING",
                        totalPrice: totalPrice,
                        userId,
                        orderDetails: {
                            create: dataOrderDetail
                        }
                    }
                })
                //remove cartdetail
                await tx.cartDetail.deleteMany({
                    where: { cartId: cart.id }
                })
                await tx.cart.delete({
                    where: { id: cart.id }
                })
                //check product
                for (let i = 0; i < cart.cartDetails.length; i++) {
                    const productId = cart.cartDetails[i].productId;
                    const product = await tx.product.findUnique({
                        where: { id: productId }
                    })
                    if (!product || product.quantity < cart.cartDetails[i].quantity) {
                        throw new Error(`Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng!`)
                    }
                    await tx.product.update({
                        where: { id: productId },
                        data: {
                            quantity: {
                                decrement: cart.cartDetails[i].quantity
                            },
                            sold: {
                                increment: cart.cartDetails[i].quantity
                            }
                        }
                    })
                }
            }
        })
        return "";
    } catch (error) {
        console.log(error)
        return error.message;
    }


}
const getOrderHistory = async (userId: number) => {
    return await prisma.order.findMany({
        where: { userId },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        }
    })
}
export {
    getProduct,
    getProductById,
    addProductToCart,
    getProductInCart,
    deleteProductInCart,
    updateCartDetailBeforeCheckOut, handlerPlaceOrder, getOrderHistory
}