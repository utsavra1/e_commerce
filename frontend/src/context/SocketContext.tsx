'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext<any>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { token, user } = useAuth();
    const [socket, setSocket] = useState<any>(null);

    useEffect(() =>{
        if (!token)
            return;

        const newSocket = io('http://localhost:3000', {
            auth: {token},
        });

        if (user?.role === 'admin'){
            newSocket.on('new order', (data: any) =>{
                toast.info(`🛒 ${data.message}`, { position: "top-right" });
            });
        }

        newSocket.on('order_status_update', (data: any) => {
            toast.success(`📦 ${data.message}`, { position: "bottom-right" });
        });

        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [token, user?.role]);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);