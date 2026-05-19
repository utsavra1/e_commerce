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

        if (source === 'body') {
            req.body = result.data;
        } else {
            Object.defineProperty(req, source, {
                value: result.data,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        next();
    };
};

export default validate;