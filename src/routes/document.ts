import Express from 'express'
import 'express-async-errors'
import * as document from '../database/models/documents'

const router = Express.Router()

router.get('/all', async (req, res) => {
    const allDocs = await document.allDocuments()

    const data = {
        data: allDocs
    };

    res.json(data);
});

router.post('/find', async (req, res) => {
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

// router.get('/new', async (req, res) => {
//     const doc = await document.newDocument()

//     const data = {
//         data: {
//             ...doc
//         }
//     };

//     res.json(data);
// });

router.post('/delete', async (req, res) => {
    const {_id} = req.body

    try {
        await document.deleteDocument(_id)
        res.send(`${_id} has been deleted`)
    } catch (error) {
        throw new Error()
    }
});

export default router