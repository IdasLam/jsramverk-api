import { Schema } from "mongoose"

type Doc = {
    title: string,
    content: string,
    access: string[]
}

const docSchema = new Schema<Doc>({
    title: { type: String},
    content: { type: String},
    access: [{type: String}]
});

export default docSchema;