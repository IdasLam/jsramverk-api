import { Document } from 'mongoose'
import DB from '../schemas/index'

type DocumentType = {
    _id: string, 
    title: string,
    content: string
}

export const findDocument = async (_id: string) => {
    const {Documents} = await DB
    
    return await Documents.findById(_id)
}


export const saveDocument = async ({_id, title, content}: DocumentType) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {
        title,
        content
    })
}

export const allDocuments = async () => {
    const {Documents} = await DB

    return await Documents.find({})
}

export const newDocument = async () => {
    const {Documents} = await DB

    const doc = new Documents({})

    await doc.save()

    return doc._id
}

export const deleteDocument = async (_id: string) => {
    const {Documents} = await DB

    return Documents.deleteOne({_id})
}