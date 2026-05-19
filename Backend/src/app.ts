import 'reflect-metadata';
import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { swaggerSpec } from './config/swagger.ts';
import  swaggerUI  from 'swagger-ui-express';
import {env} from './config/env.ts'
import {initSocket} from './socket/socket.ts'
import authRoutes from './routes/auth.ts'
import productRoutes from './routes/product.ts'
import cartRoutes from './routes/cart.ts'
import orderRoutes from './routes/order.ts'
import reviewRoutes from './routes/review.ts'
import adminRoutes from './routes/admin.ts'
import profileRoutes from './routes/profile.ts'
import { errorHandler } from './middleware/errorHandler.ts';
import paymentRoute from './routes/payment.ts';
import cors from 'cors';
import { AppDataSource } from './config/database.ts';

const app = express();

const allowedOrigins = [
    'http://localhost:3001',
    process.env['FRONTEND_URL']
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const httpServer = createServer(app);
initSocket(httpServer);
const port = 3000; 

// swagger api 
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/payment', paymentRoute);


app.use(errorHandler);


AppDataSource.initialize().then(() => {
    console.log('Database Connection Successful');
    httpServer.listen(env.port, () => {
    console.log(`listening on port${env.port}`);
})
}).catch((err) => {
    console.log(`Database connection error ${err}`);
});

