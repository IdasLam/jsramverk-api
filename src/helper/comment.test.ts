import { addComentToText } from "./comment";
import * as document from '../database/models/documents'
import {DocumentType} from '../database/models/documents'
import { Comment } from "../database/schemas/documents";
import { CommentData } from "../app";

let data: CommentData = {
    selected: 'Hejsan',
    y: 0,
    start: 0,
    end: 5,
    comment: 'bra comment'
}

jest.mock('../database/models/documents', () => {
    let comments: Comment[] = []
    
    let doc: DocumentType = {
        _id: 'testDoc',
        title: 'Test',
        content: '<p>Hejsan svejsan</p>',
        access: ['idla18@student.bth.se'],
        type: 'text',
        code: '',
        comments: comments
    }
    
    return {
        saveComment: jest.fn((id: string, data: Comment) => {
            comments.push(data)

            return 'testerComment'
        }),
        saveDocument: jest.fn((newDoc: DocumentType) => {
            doc = {...doc, ...newDoc}
            return 
        }),
        findDocument: jest.fn((id: string) => {
            return doc
        })
    }
})

describe('Comment method', () => {
    it('Should append comment to doc content', async () => {
        await addComentToText('testDoc', data, 'idla18@student.bth.se')

        const doc = await document.findDocument('testDoc')

        expect(doc.content).toBe('<p><comment id="testerComment">Hejsan</comment> svejsan</p>')
    })

    it('Should append comment to doc comments', async () => {
        await addComentToText('testDoc', {...data, comment:'kul'}, 'idla18@student.bth.se')

        const doc = await document.findDocument('testDoc')

        expect(JSON.stringify(doc.comments)).toMatch(/(kul)/i)
    })

    it('Should throw error with wrong start index', async () => {
        try {
            await addComentToText('testDoc', {...data, comment:'kul', start:3 }, 'idla18@student.bth.se')
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
        }
    })
})