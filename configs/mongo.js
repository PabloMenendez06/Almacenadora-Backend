'use strict';

import mongoose from "mongoose";
import Usuario from "../src/users/user.model.js";
import Provider from "../src/providers/provide.model.js";  
import { hash } from "argon2";

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('Could not connect to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('Trying to connect...');
        });

        mongoose.connection.on('connected', async () => {
            console.log('Connected to MongoDB');

            try {
                const adminExists = await Usuario.findOne({ role: "ADMIN" });
                if (!adminExists) {
                    const adminPassword = await hash("12345678");
                    await Usuario.create({
                        name: "Admin",
                        username: "admin",
                        email: "admin@gmail.com",
                        password: adminPassword,
                        role: "ADMIN"
                    });
                    console.log("Usuario administrador creado");
                } else {
                    console.log("Usuario administrador ya existe");
                }

                const defaultProvider = await Provider.findOne({ name: "defaultProvider" }); 
                if (!defaultProvider) {
                    await Provider.create({ name: "defaultProvider", email: "default@gmail.com", number: "+12345678" }); 
                    console.log("Proveedor 'defaultProvider' creado");
                } else {
                    console.log("Proveedor 'defaultProvider' ya existe");
                }

            } catch (error) {
                console.error("Error al verificar/crear admin o proveedor:", error);
            }
        });

        mongoose.connection.on('open', () => {
            console.log('Database connection open');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (error) {
        console.log('Database connection failed:', error);
    }
};
