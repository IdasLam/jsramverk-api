import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cors from 'cors'
import morgan from "morgan"
import {error, errorRes} from './middleware/error'

import {index} from './routes/index'

const app = express();
const port = 1337;

app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', index);


// // Testing routes with method
// app.get("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a GET request"
//         }
//     });
// });

// app.post("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a POST request"
//         }
//     });
// });

// app.put("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a PUT request"
//         }
//     });
// });

// app.delete("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a DELETE request"
//         }
//     });
// });


app.use(error)
app.use(errorRes)


// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));