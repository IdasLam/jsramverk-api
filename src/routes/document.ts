import 'express-async-errors'
import * as document from '../database/models/documents'

import router from './router'
import {io} from '../app'
import decoder from '../helper/jwt'
import generatePdf from '../helper/puppeteer'


router.get('/all', async (req, res) => {
    const {username} = await decoder(req)
    const allDocs = await document.allDocuments(username)

    const data = {
        data: allDocs
    };

    res.json(data);
});

router.post('/find', async (req, res) => {
    const {username} = await decoder(req)
    const {id} = req.body
    const doc = await document.findDocument(id) as Record<string, unknown>

    const data = {
        data: {
            ...doc
        }
    };

    res.json(data);
});

router.post('/save', async (req, res) => {
    const {username} = await decoder(req)
    const {_id, title, content, code}: document.DocumentType = req.body

    try {
        if (!_id) {
            const id = (await document.newDocument(username))._id as string
            await document.saveDocument({_id: id, title, content, code})

            const data = {
                data: {
                    _id: id
                }
            };
            res.json(data)
        } else {
            await document.saveDocument({_id, title, content, code})
            const data = {
                data: {
                    _id
                }
            };
            res.json(data)
        }

    } catch (error) {
        throw new Error()
    }
});

router.post('/delete', async (req, res) => {
    const {_id} = req.body

    try {
        await document.deleteDocument(_id)
        res.send(`${_id} has been deleted`)
    } catch (error) {
        throw new Error()
    }
});

router.post('/download-pdf', async (req, res) => {
    try {
        const {_id} = req.body
        const doc = await document.findDocument(_id)
    
        if (doc) {
            const buffer = await generatePdf(doc.content)
        
            res.header('Content-type','application/pdf')
            res.send(buffer)
        }
    } catch (err) {
        console.error(err)
        try {
            return res.status(500).send(err.toString())
        } catch {
            res.status(500).send(err)
        }
    }
});

export default router