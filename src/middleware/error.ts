import {Request, Response, NextFunction} from 'express'

export const error = (req: Request, res: Response, next: NextFunction) => {
    var err = new Error("Not Found") as any;
    err.status = 404;
    next(err);
};

export const errorRes = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    })
}