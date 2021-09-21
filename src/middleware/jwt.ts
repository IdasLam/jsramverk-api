import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken: RequestHandler = (req, res, next) => {
    const token = req.headers['x-access-token'] as string;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.send({data: 'unable to verify token'}).status(403)
            return
        }

        next();
    });
}

export default verifyToken