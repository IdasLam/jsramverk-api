import dotenv from 'dotenv'
dotenv.config()

import app from './express'
import { Server } from 'socket.io'
import * as document from './database/models/documents'

type Doc = {
    _id: string
    title: string
    content: string
    access: string[]
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
    socket.on('create', async ({id}) => {
        if (!id) return

        socket.join(id);

        socket.emit('doc', await document.findDocument(id))
    });

    socket.on('updatedDoc', (doc: Doc) => {
        socket.to(doc._id).emit('doc', doc)

        document.saveDocument(doc)
    })

    socket.on('updatedAcess', async (doc: Doc) => {
        io.in(doc._id).emit('doc', doc) 
        
        document.addDocumentAccess(doc._id, doc.access)
    })

    socket.on('close', () => {
        socket.disconnect()
    })

    socket.on('leave', (id: string) => {
        socket.leave(id)
    })
});

export {io}
