import { Server } from "socket.io";
import { Server as HttpServer } from 'http';
import { verifyToken } from "../utils/jwt.ts";
import { SOCKET_EVENTS } from "./socket.event.ts";
import { Socket } from "socket.io";

let io: Server;

const initSocket = (httpserver: HttpServer) => {
    io = new Server(httpserver, {
        cors:{
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });  

    io.use((socket, next) => {
        const token = socket.handshake.auth['token'];

        if(!token){
            return next(new Error('Authentication error — no token provided'));
        }

        try {
            const decoded = verifyToken(token);
            (socket as any).user = decoded;
            next()

        } catch (err) {
            return next(new Error('Authentication error — invalid token'));
        }
    });

    io.on(SOCKET_EVENTS.CONNECTION, (socket) =>{
        const user = (socket as any).user;
        console.log(`User connected: ${user.user_id} | Role: ${user.role}`);

        socket.join(`user_${user.user_id}`);

        if(user.role === 'admin'){
            socket.join('admin_room');
            console.log(`admin${user.user_id} joined admin room`);
        }

        socket.on(SOCKET_EVENTS.DISCONNECT, () =>{
            console.log(`User disconnected ${user.user_id}`);
        });
    });
};

const getIO = (): Server =>{
    if(!io){
        throw new Error('Socket.io not initialized');
    }
    return io;
}
export {initSocket, getIO};