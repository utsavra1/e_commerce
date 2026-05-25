import { Request, Response, NextFunction } from "express";
import { z} from 'zod';

const validate = (schema: z.ZodType, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const issues = result.error.issues;
            const errors = issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return res.status(400).json({
                message: issues[0]?.message || 'Validation failed',
                errors
            });
        }

        if (source === 'body') {
            req.body = result.data;
        } else {
            const target = (req as any)[source];
            if (target && typeof target === 'object') {
                // Clear existing properties and assign validated ones
                Object.keys(target).forEach(key => delete target[key]);
                Object.assign(target, result.data);
            } else {
                (req as any)[source] = result.data;
            }
        }
        next();
    };
};

export default validate;