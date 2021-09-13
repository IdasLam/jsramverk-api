import app from './express'

import request from 'supertest'
import express from 'express'
import * as document from './database/models/documents'

let allDocs = [
    {_id: '2hjbn34o34l', title: 'My secret doc', content: 'No secrets'},
    {_id: 'sd2h3jbn34o34l', title: 'Your secret doc', content: 'Many secrets'},
    {_id: 'showoff123', title: 'Princess Fiona', content: 'Hates Shrek'}
]

jest.mock('./database/models/documents', () => {
    return {
        allDocuments: jest.fn(() => ( allDocs)),
        findDocument: jest.fn((id) => {
            return allDocs.find(doc => doc._id === id)
        }),
        newDocument: jest.fn(() => {
            return {_id: (Math.random() + 1).toString(36).substring(7)}
        }),
        saveDocument: jest.fn(({_id, title, content}) => {

            if (_id) {
                allDocs.map(doc => {
                    if (doc._id === _id) {
                        doc.title = title
                        doc.content = content
                    }
                })
            } else {
                allDocs[-1] = {_id, title, content}
            }
        }),
        deleteDocument: jest.fn((_id) => {
            const mockRemove = allDocs.filter(doc => {
                return doc._id !== _id;
            });

            return mockRemove
        })
    }
})

describe('Testing root', () => {
    it('Should return Hello world', async () => {
        const res = await request(app).get('/').set('Accept', 'application/json')

        expect(res.body.data).toMatchObject({msg: "Hello World"})
    })
})


describe('Testing route /document', () => {

    it('Should return get all documents', async () => {
        const res = await request(app).get('/document/all').set('Accept', 'application/json')
        
        expect(document.allDocuments).toHaveBeenCalled()
        
        expect(res.body.data).toHaveLength(3)
        expect(res.body.data[0].title).toBe('My secret doc')
        expect(res.body.data[1].title).toBe('Your secret doc')
        expect(res.body.data[2].title).toBe('Princess Fiona')
    })

    it('Should return get find a document', async () => {
        let id = 'showoff123'
        let res = await request(app).post('/document/find').send({id}).set('Accept', 'application/json')
        
        expect(document.findDocument).toHaveBeenCalled()

        expect(res.body.data.title).toBe('Princess Fiona')
        expect(res.body.data.content).toBe('Hates Shrek')
        expect(res.body.data._id).toBe(id)

        id = 'CatRocks'

        res = await request(app).post('/document/find').send({id}).set('Accept', 'application/json')

        expect(res.body.data).toMatchObject({})
    })


    it('Should not find document', async () => {
        const id = 'notValid'

        let res = await request(app).post('/document/find').send({id}).set('Accept', 'application/json')

        expect(res.body.data).toMatchObject({})
    })

    it('Should return save an exsisting document', async () => {
        const id = 'showoff123'

        let res = await request(app).post('/document/find').send({id}).set('Accept', 'application/json')

        expect(res.body.data.title).toBe('Princess Fiona')
        expect(res.body.data.content).toBe('Hates Shrek')
        expect(res.body.data._id).toBe(id)

        res = await request(app).post('/document/save').send({_id: id, title: 'Donkey Ass', content: 'I love Shrek'}).set('Accept', 'application/json')
        
        expect(document.saveDocument).toHaveBeenCalled()

        expect(res.body.data._id).toBe(id)
    })

    it('Should return create a new document', async () => {
        const res = await request(app).post('/document/save').send({title: 'Donkey Ass', content: 'I love Shrek'}).set('Accept', 'application/json')
        
        expect(document.newDocument).toHaveBeenCalled()
        expect(document.saveDocument).toHaveBeenCalled()

        expect(typeof res.body.data._id === "string").toBeTruthy()
    })

    it('Should delete a document', async () => {
        let id = 'showoff123'

        let res = await request(app).post('/document/delete').send({id}).set('Accept', 'application/json')

        expect(document.deleteDocument).toHaveBeenCalled()
        expect(res.status).toBe(200)
    })
})



