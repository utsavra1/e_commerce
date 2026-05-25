import { Request, Response, NextFunction } from "express";
import { addUserAddress, getUserAddress, deleteAddress } from "../services/address.ts";

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const address = await addUserAddress(user_id, req.body);
        res.status(201).json({ message: "Address added successfully", address });
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const addresses = await getUserAddress(user_id);
        res.status(200).json({ addresses });
    } catch (error) {
        next(error);
    }
};

export const removeAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as any).user.user_id;
        const address_id = parseInt(req.params['id'] as string);
        await deleteAddress(user_id, address_id);
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        next(error);
    }
};
