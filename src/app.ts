import dotenv from 'dotenv'
dotenv.config()

import app from './express'
import { Server } from 'socket.io'
import * as document from './database/models/documents'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

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
        methods: ["GET", "POST"],
        credentials: true
    }
});


const getUsername = (cookiestr: string) => {
    if (!!cookiestr) {
        const { token } = cookie.parse(cookiestr || '')
        const { username } = jwt.decode(token) as Record<string, string>

        return username
    }
}

const allUsers = (documents: any) => {
    const users = new Set()
    
    documents.forEach((doc: any) => {
        doc.access.forEach((user: string) => users.add(user))
    });

    return Array.from(users)
}

io.on('connection', (socket) => {
    socket.on('login', async () => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            await socket.join(`username=${username}`)

            const allDoc = await document.allDocuments(username)

            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
    })

    socket.on('create', async (id: string) => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)

            const allDoc = await document.allDocuments(username)

            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }

        if (!id) return


        await socket.join(id);
        const doc = await document.findDocument(id)

        io.in(id).emit('doc', doc)
    });

    socket.on('updatedDoc', async (doc: Doc) => {
        socket.to(doc._id).emit('doc', doc)

        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            await socket.join(`username=${username}`)

            const allDoc = await document.allDocuments(username)
            
            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }

        document.saveDocument(doc)
    })

    socket.on('refreshDocs', async () => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            await socket.join(`username=${username}`)

            const allDoc = await document.allDocuments(username)
            
            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
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
