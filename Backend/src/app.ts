import 'reflect-metadata';
import express from 'express';
import {DataSource} from 'typeorm';
import { User } from './entites/User.ts';
import { Role } from './entites/User.ts';
import authRoutes from './routes/auth.ts'
import productRoutes from './routes/product.ts'
import cartRoutes from './routes/cart.ts'

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
   host: "localhost",
   port: 5433,
   username: "postgres",
   password: "Ali5ha",
   database: 'estore',
   entities: ["src/entites/*{.ts,.js}"],
   synchronize: true,
   logging: true
})

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);


AppDataSource.initialize().then(() => {
    console.log('Database Connection Successful');
    app.listen(port, () => {
    console.log(`listening on port${port}`);
})
}).catch((err) => {
    console.log(`Database connection error ${err}`);
});

