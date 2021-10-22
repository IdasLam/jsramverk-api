import dotenv from 'dotenv'
dotenv.config()

import app from './express'
import { Server } from 'socket.io'
import * as document from './database/models/documents'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { sendInvite } from './helper/nodemailer'
import { addComentToText } from './helper/comment'
import { Comment } from './database/schemas/documents'

type Doc = {
    _id: string
    title: string
    content: string
    access: string[]
    type: 'code' | 'text'
    code: string
    comments?: Comment[]
}

type CommentData = {
    comment: string
    y: number
    start: number
    end: number
    selected: string
    _id?: string
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
    const username = getUsername(socket.handshake.headers.cookie)
    socket.join(`username=${username}`)

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
        if (!id) return

        await socket.join(id);
        const doc = await document.findDocument(id)

        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)

            const allDoc = await document.allDocuments(username)

            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
    });

    socket.on('updatedDoc', async (doc: Doc) => {
        await document.saveDocument(doc)
        
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            const allDoc = await document.allDocuments(username)
            
            const users = allUsers(allDoc)
            users.forEach(async (user: string) => {
                
                if (user === username) return

                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }

    })

    socket.on('delete', async (id, cb) => {
        //...delte
        const doc = (await document.findDocument(id)) as Doc
        await document.deleteDocument(id)

        await Promise.all(doc.access.map(async (user) => {
            const allUsersDoc = await document.allDocuments(user)

            io.in(`username=${user}`).emit('allDocs', allUsersDoc)
        }))
        cb()
    })

    socket.on('refreshDocs', async () => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            const allDoc = await document.allDocuments(username)
            
            const users = allUsers(allDoc)

            if (allDoc.length === 0) {
                return 
            }

            users.forEach(async (user: string) => {
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
    })

    socket.on('updatedAcess', async (doc: Doc) => {
        const oldDoc = await document.findDocument(doc._id)
        const validateEmail = (email: string) => {
            const re =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }

        const allUsers = [...new Set(doc.access)].filter(user => validateEmail(user) ? user : null)
        await document.addDocumentAccess(doc._id, allUsers)

        const newDoc = await document.findDocument(doc._id)

        const isAdding = newDoc.access.length > oldDoc.access.length

        const docToLoop = isAdding ? newDoc : oldDoc

        
        if (!!socket.handshake.headers.cookie) {
            await Promise.all(docToLoop.access.map(async (user: string) => {
                if (validateEmail(user)) {
                    const allUsersDoc = await document.allDocuments(user) as Doc[]
                    
                    io.in(`username=${user}`).emit('allDocs', allUsersDoc)
                }
            }))

            if (isAdding) {
                const oldList = oldDoc.access
                const newList = newDoc.access
                const newUsers = newList.filter(user => !oldList.includes(user))

                // Send mail to new users
                await sendInvite(newUsers, doc.title)
            } 
            
        }
    })

    socket.on('changeType', async (doc: Doc) => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            await document.changeType(doc._id, doc.type)
            
            const users = doc.access
            users.forEach(async (user: string) => {
                
                // if (user === username) return

                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
    })

    socket.on('comment', async ({id, data}: {id: string, data: CommentData} ) => {
        if (!!socket.handshake.headers.cookie) {
            const username = getUsername(socket.handshake.headers.cookie)
            
            const doc = await document.findDocument(id)

            // send await to helper to modify document
            try {
                await addComentToText(id, data, username)
            } catch(err) {
                console.error(err)
            }
            // update everyones doc

            const users = doc.access
            users.forEach(async (user: string) => {
                
                const allUsersDoc = await document.allDocuments(user)

                io.in(`username=${user}`).emit('allDocs', allUsersDoc)
            })
        }
    })

    socket.on('close', () => {
        socket.disconnect()
    })

    socket.on('leave', (id: string) => {
        socket.leave(id)
    })
});

export {io, CommentData}
