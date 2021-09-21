import 'express-async-errors'
import * as document from '../database/models/documents'

import router from './router'
import {io} from '../app'

router.get('/all', async (req, res) => {
    const allDocs = await document.allDocuments()

    const data = {
        data: allDocs
    };

    res.json(data);
});

router.post('/find', async (req, res) => {
    const id = req.body.id as string
    const doc = await document.findDocument(id) as Record<string, unknown>

    const data = {
        data: {
            ...doc
        }
    };

    res.json(data);
});

router.post('/save', async (req, res) => {
    const {_id, title, content} = req.body

    try {
        if (!_id) {
            const id = (await document.newDocument())._id as string
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
    const {_id, username} = req.body

    try {
        const doc = await document.addDocumentAccess(_id, username)

        io.in(_id).emit("doc", doc)

        res.send({data: 'Access added'})
    } catch (error) {
        throw new Error()
    }
});

export default router