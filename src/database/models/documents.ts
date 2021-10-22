import { Comment, Doc } from '../schemas/documents'
import DB from '../schemas/index'

export type DocumentType = {
    _id: string, 
    title: string,
    content: string
    access?: string[]
    type?: 'code' | 'text'
    code: string
    comments?: Comment[]
}

export const findDocument = async (_id: string): Promise<DocumentType> => {
    const {Documents} = await DB

    return await Documents.findOne({_id}).lean()
}

export const saveComment = async (_id: string, comment: Comment) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {
        $push: {
            comments: comment
        }
    })

    const allComment = (await findDocument(_id)).comments

    return allComment[allComment.length - 1]._id
}


export const saveDocument = async ({_id, title, content, code}: DocumentType) => {
    const {Documents} = await DB

    await Documents.updateOne({_id}, {
        title,
        content,
        code
    })

    const doc = await findDocument(_id)
    const allComment = doc.comments

    const filteredComments = allComment.filter(comment => doc.content.includes(comment?._id))
    await Documents.updateOne({_id}, {
        comments: filteredComments
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

export const changeType = async (_id: string, oldType: 'code' | 'text') => {
    const {Documents} = await DB
    let newType: 'code' | 'text' = 'text'

    if (oldType === 'code') {
        newType = 'text'
    } else {
        newType = 'code'
    }

    await Documents.updateOne({_id}, {type: newType})
}