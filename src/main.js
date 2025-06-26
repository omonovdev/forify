import express from 'express';
import config from './config/index.js';
import cookieParser from 'cookie-parser';
import adminRouter from './routes/admin.routes.js';
import { createSuperadmin } from './db/create-supperadmin.js';
import { connectDB } from './db/index.js';
import clientRouter from './routes/client.routes.js';
import categoryRouter from './routes/category.routes.js';
import salesmanRouter from './routes/salesman.routes.js';
import productRouter from  './routes/product.routes.js';
import soldProductRouter from './routes/sold-product.routes.js';



const PORT = config.PORT
const app = express();
app.use(express.json());
app.use(cookieParser());

await connectDB();
await createSuperadmin();

app.use('/admins', adminRouter);
app.use('/client', clientRouter);
app.use('/category', categoryRouter);
app.use('/salesman', salesmanRouter);
app.use('/product', productRouter);
app.use('/sold-products', soldProductRouter);


app.use((err, req, res, next) => {
    if (err) {
        const statusCode = err.status ? err.status : 500;
        const message = err.message ? err.message : 'Internal server error';
        return res.status(statusCode).json({
            statusCode,
            message
        });
    }
});

app.listen(PORT, () => console.log('Server running on port', +PORT));