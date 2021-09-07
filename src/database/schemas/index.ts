import mongoose from 'mongoose'
import docSchema from './documents'

const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/mumin";

const connection = mongoose.connect(dsn, {})

mongoose.connection

export = (async () => {
    const db = await connection

    const Documents = db.model('documents', docSchema)

    return {
        Documents
    }
})()
