import mongoose from 'mongoose'
import docSchema from './documents'
import userSchema from './users'

let dsn =  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.omajj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connection = mongoose.connect(dsn, {})

mongoose.connection

export default (async () => {
    const db = await connection

    const Documents = db.model('documents', docSchema)
    const Users = db.model('users', userSchema)
    
    return {
        Documents,
        Users
    }
})()
