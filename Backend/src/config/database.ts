import { DataSource } from 'typeorm';
import { env } from './env.ts';

export const AppDataSource = new DataSource({
   type: "postgres",

   ...(env.db.url ? { url: env.db.url } : {
   host: env.db.host,
   port: env.db.port,
   username: env.db.username,
   password: env.db.password,
   database: env.db.name,
   }),
   ssl: env.db.url ? {rejectUnauthorized: false}: false,
   entities: ["src/entites/*{.ts,.js}"],
   synchronize: true,
   logging: true
});
