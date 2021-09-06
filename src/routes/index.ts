import Express from 'express'

const router = Express.Router()

export const index = router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});