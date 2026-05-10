import {z} from 'zod';

const updateProfileSchema = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must not exceed 100 characters')
    .optional(),

    phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone must be a valid 10-digit number')
    .optional(),

    dob: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format')
    .optional(),

});

const changePasswordSchema = z.object({
  current_password: z.string()
    .min(6, 'Current password must be at least 6 characters'),
  new_password: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(50, 'New password must not exceed 50 characters'),
});

export{changePasswordSchema, updateProfileSchema}

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;