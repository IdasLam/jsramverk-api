import Express from 'express'
import 'express-async-errors'
import * as document from '../database/models/documents'

const router = Express.Router()

router.get('/all', async (req, res) => {
    const allDocs = await document.allDocuments()

    const data = {
        data: {
            ...allDocs
        }
    };

    res.json(data);
});

router.get('/find', async (req, res) => {
    const id = req.body.id as string
    const doc = await document.findDocument(id)

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
        await document.saveDocument({_id, title, content})
    } catch (error) {
        throw new Error()
    }
});

router.get('/new', async (req, res) => {
    const doc = await document.newDocument()

    const data = {
        data: {
            ...doc
        }
    };

    res.json(data);
});

router.post('/delete', async (req, res) => {
    const _id = req.body._id as string

    try {
        await document.deleteDocument(_id)
    } catch (error) {
        throw new Error()
    }
});

export default router