import { Document } from 'mongoose'
import DB from '../schemas/index'

type DocumentType = {
    _id: string, 
    title: string,
    content: string
    access?: string[]
}

export const findDocument = async (_id: string, username: string) => {
    const {Documents} = await DB

    return await Documents.findOne({_id, access: username}).lean()
}


export const saveDocument = async ({_id, title, content}: DocumentType) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {
        title,
        content
    })
}

export const allDocuments = async (username: string) => {
    const {Documents} = await DB

    return await Documents.find({access: username}).lean()
}

export const newDocument = async (username: string) => {
    const {Documents} = await DB

    const doc = new Documents({access: [username]})

    await doc.save()

    return doc._id
}

export const deleteDocument = async (_id: string) => {
    const {Documents} = await DB

    await Documents.deleteOne({_id})
}

export const addDocumentAccess = async (_id: string, usernames: string[], username: string) => {
    const {Documents} = await DB

    await Documents.findByIdAndUpdate(_id, {$push : usernames}, { 'upsert': true }) 

    return findDocument(_id, username)
}