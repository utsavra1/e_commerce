import { Request, Response, NextFunction } from "express";
import { ChangePasswordInput, UpdateProfileInput } from "../schemas/profile.ts";
import { fetchMyProfile, updateMyProfile,changeMyPassword } from "../services/profile.ts";

const getMyProfile = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const user_id = (req as any).user.user_id;
        const result = await fetchMyProfile(user_id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

const updateProfile = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const user_id = (req as any).user.user_id;
        const result = await updateMyProfile(user_id, req.body as UpdateProfileInput);
        return res.status(200).json({message: 'your profile has been updare', user: result});
    } catch (err) {
        next(err)
    }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const user_id = (req as any).user.user_id;
        const result = await changeMyPassword(user_id, req.body as ChangePasswordInput);
        return res.status(200).json({message: 'Password changed successfully'});
    } catch (err) {
        next(err);
    }
};

export {getMyProfile, updateProfile, changePassword};