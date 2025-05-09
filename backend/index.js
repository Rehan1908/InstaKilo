import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
 
dotenv.config();


const PORT = process.env.PORT || 3000;


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'https://insta-kilo-9asl.vercel.app', 
        'https://insta-kilo-9asl-en8cqa9vu-rehans-projects-bda1d4c6.vercel.app', 
        'https://insta-kilo-9asl-ak2hd57in-rehans-projects-bda1d4c6.vercel.app',
        'https://insta-kilo-9asl-p7aos3t4m-rehans-projects-bda1d4c6.vercel.app' // NEW frontend URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ensure 'OPTIONS' is implicitly handled or add it if needed, though 'cors' middleware usually does.
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Explicitly allow Content-Type
}
app.use(cors(corsOptions));
// Optionally, handle preflight requests:
app.options('*', cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);



server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});