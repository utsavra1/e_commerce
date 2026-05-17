import 'reflect-metadata';
import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import {DataSource} from 'typeorm';
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
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const httpServer = createServer(app);
initSocket(httpServer);
const port = 3000; 

export const AppDataSource = new DataSource({
   type: "postgres",
   host: env.db.host,
   port: env.db.port,
   username: env.db.username,
   password: env.db.password,
   database: env.db.name,
   entities: ["src/entites/*{.ts,.js}"],
   synchronize: true,
   logging: true
})

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


app.use(errorHandler);


AppDataSource.initialize().then(() => {
    console.log('Database Connection Successful');
    httpServer.listen(env.port, () => {
    console.log(`listening on port${env.port}`);
})
}).catch((err) => {
    console.log(`Database connection error ${err}`);
});

