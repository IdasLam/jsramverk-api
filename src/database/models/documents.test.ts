import { access } from 'fs'
import { Comment } from '../schemas/documents'
import * as document from './documents'

jest.mock('../schemas/index', () => {
    let docs: document.DocumentType[] = [
        {
            _id: 'hejsansvejsan',
            title: 'Test',
            content: 'hejsan din kringla',
            access: ['idla18@student.bth.se'],
            type: 'text',
            code: '',
            comments: []
        },
        {
            _id: 'Tester',
            title: 'Hej',
            content: '',
            access: ['idla18@student.bth.se'],
            type: 'text',
            code: '',
            comments: []
        },
    ]

    const DB =  {
        Documents: {
            findOne: jest.fn(({_id}: {_id: string}) => {
                return {lean: jest.fn(() => docs.find(doc => doc._id === _id))}
            }),
            updateOne: jest.fn(({_id}: {_id: string}, data: any ) => {
                const index = docs.findIndex(doc => doc._id === _id)

                if (!data.$push) {
                    docs[index] = {...docs[index], ...data} 
                    
                } else if (data.$push) {
                    const comments = [...docs[index].comments, data.$push.comments]

                    docs[index] = {...docs[index], comments: comments} 
                } 
            }),
            find: jest.fn(({access}: {access: string}) => {
                return {lean: jest.fn(() => docs.filter(doc => doc.access.includes(access)))}
            }),
            deleteOne: jest.fn(({_id}: {_id: string}) => {
                const index = docs.findIndex(doc => doc._id === _id)
                docs.splice(index)
            })

        }
    }

    return DB
})

describe('Document tests', () => {
    it('Should find document', async () => {
        const doc = await document.findDocument('hejsansvejsan')

        expect(doc._id).toBe('hejsansvejsan')
    })

    it('Should save comment', async () => {
        const comment: Comment = {
            selected: 'hejsan',
            y: 0,
            comment: 'coolt',
            user: 'idla18@student.bth.se',
            date: new Date().toString(),
            _id: 'testcomment',
        }

        const commentId = await document.saveComment('hejsansvejsan', comment)

        expect(commentId).toBe('testcomment')
    })

    it('Should save documet', async () => {
        const data = {
            _id: 'hejsansvejsan',
            title: 'new Title',
            content: '<comment id="testcomment">hejsan</comment> svensan',
            code: 'console.log("hejsan")'
        }

        let doc = await document.findDocument('hejsansvejsan')
        expect(doc.title).not.toBe('new Title')
        expect(doc.content).not.toBe('<comment id="testcomment">hejsan</comment> svensan')
        expect(doc.code).not.toBe('console.log("hejsan")')

        await document.saveDocument(data)

        doc = await document.findDocument('hejsansvejsan')

        expect(doc.title).toBe('new Title')
        expect(doc.content).toBe('<comment id="testcomment">hejsan</comment> svensan')
        expect(doc.code).toBe('console.log("hejsan")')       
    })

    it('Should remove comments in documet', async () => {
        const data = {
            _id: 'hejsansvejsan',
            title: 'new Title',
            content: 'hejsan svensan',
            code: ''
        }

        await document.saveDocument(data)

        const doc = await document.findDocument('hejsansvejsan')

        expect(doc.comments.length).toBe(0)
    })

    it('Should get all documents', async () => {
        const docs = await document.allDocuments('idla18@student.bth.se')
        expect(docs.length).toBe(2)
    })

    it('Should delete a document', async () => {
        await document.deleteDocument('Tester')

        const doc = await document.findDocument('Tester')

        expect(doc).toBe(undefined)
    })

    it('Should add document access', async () => {
        let doc = await document.findDocument('hejsansvejsan')

        expect(doc.access).toStrictEqual(['idla18@student.bth.se'])
        
        doc = await document.addDocumentAccess('hejsansvejsan', ['idla18@student.bth.se', 'testmail.idal@gmail.com'])

        expect(doc.access).toStrictEqual(['idla18@student.bth.se', 'testmail.idal@gmail.com'])
    })

    it('Should change document type', async () => {
        let doc = await document.findDocument('hejsansvejsan')

        expect(doc.type).toBe('text')

        await document.changeType('hejsansvejsan', 'text')

        doc = await document.findDocument('hejsansvejsan')

        expect(doc.type).toBe('code')
    })
})