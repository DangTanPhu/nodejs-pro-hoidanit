import { createUsersAPI, deleteUserByIdAPI, getAllUserByIdAPI, getAllUsersAPI, postAddProductToCartAPI, updateUserByIdAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express'
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
    app.use('/api', router)
}
export default apiRouter;
