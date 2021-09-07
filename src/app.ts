import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cors from 'cors'
import morgan from "morgan"
import {error, errorRes} from './middleware/error'

import {index} from './routes/index'
import router from './routes/document'

const app = express();
const port = 1337;

app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', index);
app.use('/document', router);


app.use(error)
app.use(errorRes)


// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));