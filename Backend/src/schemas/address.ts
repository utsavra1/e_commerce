import { z } from "zod";

export const addressSchema = z.object({
    label: z.string().min(1, "Label is required"),
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City is required"),
    street_address: z.string().min(1, "Street address is required"),
});

export type AddressInput = z.infer<typeof addressSchema>;
