import mongoose from 'mongoose'
import docSchema from './documents'

const dsn =  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.omajj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connection = mongoose.connect(dsn, {})

mongoose.connection

export = (async () => {
    const db = await connection

    const Documents = db.model('documents', docSchema)

    return {
        Documents
    }
})()
