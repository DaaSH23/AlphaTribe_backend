import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http"
import userRoutes from "./routes/userRoute.js";
import stockRoutes from "./routes/stockRoute.js";
import ErrorMiddleware from "./middleware/ErrorMiddleware.js";
import socketMiddleware from "./middleware/socketMiddleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(socketMiddleware(io));
app.use(bodyParser.json());
app.use(cookieParser());

// Handle Socket.io connection
io.on('connection', (socket)=>{
    console.log('Client connected: ', socket.id);

    // Handle disconnect
    socket.on('disconnect', ()=>{
        console.log('Client disconnected: ', socket.id);
    });
});

app.get('/v1', (req, res)=>{
    try{
        res.status(200).json({
            success: true,
            message: "Welcome to Api home page this is developed by Abhishek!"
        })
    }catch(err){
        console.error("Error: ", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

app.use('/api', userRoutes);
app.use('/api', stockRoutes);
app.use(ErrorMiddleware);

export default app;
