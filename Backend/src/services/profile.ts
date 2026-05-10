import { AppDataSource } from "../app.ts";
import { User } from "../entites/User.ts";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.ts";
import { UpdateProfileInput, ChangePasswordInput } from "../schemas/profile.ts";

const fetchMyProfile = async(user_id: number) =>{
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where:{user_id},
    });

    if(!user){
        throw createError('User not found', 404);
    }

    const {password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
};

const updateMyProfile = async (user_id: number, input: UpdateProfileInput) =>{
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where:{user_id},
    });
    
    if(!user){
        throw createError('User not found', 404);
    }

    if(input.username)
        user.username = input.username;
    if(input.phone)
        user.phone = input.phone;
    if(input.dob)
        user.dob = input.dob;

    await userRepo.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const changeMyPassword = async(user_id: number, input: ChangePasswordInput) =>{
     const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where:{user_id},
    });
    
    if(!user){
        throw createError('User not found', 404);
    }

    const isMatch = await bcrypt.compare(input.current_password, user.password);
    if(!isMatch){
        throw createError ('Current password did not match', 404);
    }

    const isSame = await bcrypt.compare(input.new_password, user.password);
    if(isSame){
        throw createError ('Cant put current password as new password', 404);
    }

    user.password = await bcrypt.hash(input.new_password, 10);
    await userRepo.save(user);
    
};

export {changeMyPassword, updateMyProfile, fetchMyProfile};