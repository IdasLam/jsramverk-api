import DB from '../schemas/index'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

export const validateUser = async (username: string, password: string) => {
    const {Users} = await DB

    const hash = (await Users.findOne({username}) as any).password

    const validUser = bcrypt.compareSync(password, hash)

    return validUser
}

export const createUser = async (username: string, password: string) => {
    const {Users} = await DB
    const hash = bcrypt.hashSync(password, salt)

    const user = new Users({username, password: hash})

    await user.save()

    return user
}

export const findUser = async (username: string) => {
    const {Users} = await DB

    const user = (await Users.findOne({username}) as any)

    return user
}