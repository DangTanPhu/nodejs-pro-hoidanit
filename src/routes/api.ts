import { createUsersAPI, deleteUserByIdAPI, fetchAccountAPI, getAllUserByIdAPI, getAllUsersAPI, loginAPI, postAddProductToCartAPI, updateUserByIdAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express'
import { checkValidJWT } from 'src/middleware/jwt';
const router = express.Router();
const apiRouter = (app: Express) => {
    router.post('/add-product-to-cart', postAddProductToCartAPI);
    router.get('/users', getAllUsersAPI);
    router.get('/users/:id', getAllUserByIdAPI);
    router.post('/users',createUsersAPI);
    // put and patch : su dung nao cung duoc ko khac nhau , khac nhau ve logic thoi
    // put la thuong map toan bo, gui day du field
    // patch kiem tra tung field neu co , chi gui 1-2 field
    router.put('/users/:id',updateUserByIdAPI);
    router.delete('/users/:id',deleteUserByIdAPI);


    router.post('/login', loginAPI);
    router.get('/account',fetchAccountAPI)

    app.use('/api',checkValidJWT, router)
}
export default apiRouter;
