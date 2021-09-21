import 'express-async-errors'
import * as document from '../database/models/documents'

import router from './router'
import {io} from '../app'
import decoder from '../helper/jwt'


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
    const doc = await document.findDocument(id, username) as Record<string, unknown>

    const data = {
        data: {
            ...doc
        }
    };

    res.json(data);
});

router.post('/save', async (req, res) => {
    const {username} = await decoder(req)
    const {_id, title, content} = req.body

    try {
        if (!_id) {
            const id = (await document.newDocument(username))._id as string
            await document.saveDocument({_id: id, title, content})

            const data = {
                data: {
                    _id: id
                }
            };
            res.json(data)
        } else {
            await document.saveDocument({_id, title, content})
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

router.post('/addAccess', async (req, res) => {
    const {_id} = req.body
    const {username} = await decoder(req)

    try {
        const doc = await document.addDocumentAccess(_id, username, username)

        io.in(_id).emit("doc", doc)

        res.send({data: 'Access added'})
    } catch (error) {
        throw new Error()
    }
});

export default router