import 'reflect-metadata';
import express from 'express';
import {DataSource} from 'typeorm';
import { swaggerSpec } from './config/swagger.ts';
import  swaggerUI  from 'swagger-ui-express';
import {env} from './config/env.ts'
import authRoutes from './routes/auth.ts'
import productRoutes from './routes/product.ts'
import cartRoutes from './routes/cart.ts'
import orderRoutes from './routes/order.ts'
import reviewRoutes from './routes/review.ts'
import adminRoutes from './routes/admin.ts'
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();
app.use(express.json());
const port = 3000;



/* app.get('/',async function(req, res){

 const userRepo = AppDataSource.getRepository(User);
/*     const getdata = await userRepo.find() */ 
   /*  let user: User = new User()
    user.username = "utsav";
    user.email = "u@gmail.com";
    user.password = "t12";
    user.phone = "9090909090";
    user.dob = 20600112;
    user.role = Role.ADMIN;

    const userInserted = await userRepo.save(user);

    res.json(userInserted); 
});*/
 

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


app.use(errorHandler);


AppDataSource.initialize().then(() => {
    console.log('Database Connection Successful');
    app.listen(port, () => {
    console.log(`listening on port${port}`);
})
}).catch((err) => {
    console.log(`Database connection error ${err}`);
});

