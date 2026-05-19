import { DataSource } from 'typeorm';
import { env } from './env.ts';

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
});
