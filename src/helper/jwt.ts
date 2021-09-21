import { rejects } from 'assert';
import { Request } from 'express';
import jwt from 'jsonwebtoken'

const decoder = (req: Request): Promise<Record<string, any>> => {
    const token = req.headers['x-access-token'] as string;

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
        })
    })
}

export default decoder