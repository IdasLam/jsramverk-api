import Express from 'express'
import router from './router'
import * as user from '../database/models/users'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    const validUser = await user.validateUser(username, password)

    if (!validUser) {
        return res.send({data: 'Invalid password or username'}).status(403)
    }

    // create jwt
    const token = jwt.sign({username}, secret, { expiresIn: '1h'});

    res.cookie('token', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    })

    return res.send({data: {status: 'ok', token}})
})

router.post('/signup', async (req, res) => {
    const {username, password} = req.body

    await user.createUser(username, password)
    
    // create jwt
    const token = jwt.sign({username}, secret, { expiresIn: '1h'});

    res.cookie('token', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }).send({data: {status: 'ok', token}})
})

router.get('/status', (req, res) => {
    const token = req.cookies.token as string

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({authorized: false})
        }

        return res.json({authorized: true})
    });
})

router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    });

    return res.json({info: 'logged out'})
})

export default router
