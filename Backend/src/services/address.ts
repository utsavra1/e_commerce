import { AppDataSource } from "../config/database.ts"
import { Address } from "../entites/Address.ts"

export const addUserAddress = async (user_id: number, data: any) => {
    const addressRepo = AppDataSource.getRepository(Address);
    const newAddress = addressRepo.create({...data, user: {user_id}});
    return await addressRepo.save(newAddress);
}

export const getUserAddress = async (user_id: number) => {
    return await AppDataSource.getRepository(Address).find({
        where: { user: { user_id } }
    });
}

export const deleteAddress = async (user_id: number, address_id: number) => {
    const addressRepo = AppDataSource.getRepository(Address);
    const address = await addressRepo.findOne({
        where: { address_id, user: { user_id } }
    });
    if (!address) {
        throw new Error("Address not found");
    }
    return await addressRepo.remove(address);
}