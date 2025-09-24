import { getAllUsersAPI, postAddProductToCartAPI } from 'controllers/client/api.controller';
import express, { Express } from 'express'
const router = express.Router();
const apiRouter = (app: Express) => {
    router.post('/add-product-to-cart', postAddProductToCartAPI);
    router.get('/get-all-users', getAllUsersAPI);
    app.use('/api', router)
}
export default apiRouter;
