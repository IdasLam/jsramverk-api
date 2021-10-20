import { Schema } from "mongoose"

export type Comment = {
    selected: string,
    y: number,
    comment: string,
    user: string,
    date: string,
    _id?: string
}

export type Doc = {
    title: string,
    content: string,
    access: string[],
    type: 'code' | 'text',
    code: string
    comments?: Comment[]
}

const docSchema = new Schema<Doc>({
    title: { type: String},
    content: { type: String},
    access: [{type: String}],
    type: {default: 'text', type: String},
    code: {type: String, default: ''},
    comments: [{
        selected: String,
        y: Number,
        comment: String,
        user: String,
        date: String
    }]
});

export default docSchema;