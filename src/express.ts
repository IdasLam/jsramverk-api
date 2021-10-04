import express from "express"
import cors from 'cors'
import morgan from "morgan"
import {error, errorRes} from './middleware/error'
import {index} from './routes/index'
import router from './routes/document'
import login from './routes/login'
import cookieParser from 'cookie-parser'

import verifyToken from './middleware/jwt'
import { GraphQLSchema } from "graphql"
import RootQueryType from "./graphql/root"
import {graphqlHTTP} from 'express-graphql'

const app = express()

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.enable('trust proxy') 

app.use(cors({
    origin: ["http://localhost:3000", "https://www.student.bth.se"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', [index, login]);
app.use('/document', verifyToken, router);
app.use('/graphql', verifyToken, graphqlHTTP({
    schema: schema,
    graphiql: true,
}));


app.use(error)
app.use(errorRes)

export default app