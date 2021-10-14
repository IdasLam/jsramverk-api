import { Document } from 'mongoose'
import DB from '../schemas/index'

type DocumentType = {
    _id: string, 
    title: string,
    content: string
    access?: string[]
    type: 'code' | 'text'
    code: string
}

export const findDocument = async (_id: string): Promise<DocumentType> => {
    const {Documents} = await DB

    return await Documents.findOne({_id}).lean()
}


export const saveDocument = async ({_id, title, content, code}: DocumentType) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {
        title,
        content,
        code
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

export const addDocumentAccess = async (_id: string, usernames: string[]) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {access: usernames}) 

    return findDocument(_id)
}

export const changeType = async (_id: string, type: 'code' | 'text') => {
    const {Documents} = await DB
    let newType: 'code' | 'text' = 'text'

    if (type === 'code') {
        newType = 'text'
    } else {
        newType = 'code'
    }

    await Documents.updateOne({_id}, {type: newType})
}