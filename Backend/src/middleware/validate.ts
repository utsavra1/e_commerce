import { Request, Response, NextFunction } from "express";
import { z} from 'zod';

const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errors = result.error.issues.map((err) =>({
                field: err.path.join('.'),
                message: err.message,
            }));

        return res.status(400).json({ message: 'Validation failed', errors });
        }

        req.body = result.data;
        next();
    };
};

export default validate;