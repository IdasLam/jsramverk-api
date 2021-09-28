import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const verifyToken: RequestHandler = (req, res, next) => {
    const token = req.cookies.token as string

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send({data: 'unable to verify token'})

            return
        }

        next();
    });
}

export default verifyToken