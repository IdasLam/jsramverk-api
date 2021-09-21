import Express from 'express'
import router from './router'
import * as user from '../database/models/users'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    const validUser = await user.validateUser(username, password)

    if (!validUser) {
        res.send({data: 'Invalid password or username'}).status(403)
    }

    // create jwt
    const token = jwt.sign({username, password}, secret, { expiresIn: '1h'});

    res.send({data: {status: 'ok', token}})
})

router.post('/signup', async (req, res) => {
    const {username, password} = req.body

    await user.createUser(username, password)
    
    // create jwt
    const token = jwt.sign({username, password}, secret, { expiresIn: '1h'});

    res.send({data: {status: 'ok', token}})
})

export default router
