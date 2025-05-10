'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import providerRoutes from '../src/providers/provider.routes.js';
import productRoutes from '../src/products/product.routes.js';
import clientRoutes from '../src/clients/client.routes.js';
import historyRoutes from '../src/history/history.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/almacenadoraSystem/v1/auth', authRoutes);
    app.use('/almacenadoraSystem/v1/user', userRoutes);
    app.use('/almacenadoraSystem/v1/category', categoryRoutes);
    app.use('/almacenadoraSystem/v1/provider', providerRoutes);
    app.use('/almacenadoraSystem/v1/product', productRoutes);
    app.use('/almacenadoraSystem/v1/client', clientRoutes);
    app.use('/almacenadoraSystem/v1/history', historyRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    }catch(error){
        console.error('Error Conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3333;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port:  ${port}`)

    } catch (err) {
        console.log(`Server init fail : ${err}`)
    }
}