import dotenv from 'dotenv'
dotenv.config()

import app from './express'
import { Server } from 'socket.io'
import * as document from './database/models/documents'

type Doc = {
    _id: string
    title: string
    content: string
}

const port = process.env.PORT || 1337;

// Start up server
const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://www.student.bth.se"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('create', async (id) => {
        socket.join(id);

        socket.emit('doc', await document.findDocument(id))
    });

    socket.on('updatedDoc', (doc: Doc) => {
        socket.to(doc._id).emit('doc', doc)

        document.saveDocument(doc)
    })
});

export {io}
