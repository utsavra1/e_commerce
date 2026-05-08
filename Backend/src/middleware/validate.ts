import { Request, Response, NextFunction } from "express";
import { z} from 'zod';

const validate = (schema: z.ZodType, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if(!result.success){
            const errors = result.error.issues.map((err) =>({
                field: err.path.join('.'),
                message: err.message,
            }));

        return res.status(400).json({ message: 'Validation failed', errors });
        }

        (req as any)[source] = result.data;
        next();
    };
};

export default validate;