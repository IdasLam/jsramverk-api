import { Schema } from "mongoose"

type Doc = {
    title: string,
    content: string,
    access: string[],
    type: 'code' | 'text',
    code: string
}

const docSchema = new Schema<Doc>({
    title: { type: String},
    content: { type: String},
    access: [{type: String}],
    type: {default: 'text', type: String},
    code: {type: String, default: ''}
});

export default docSchema;