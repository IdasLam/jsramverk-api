import { Schema } from "mongoose"

type Doc = {
    title: string,
    content: string,
}

const docSchema = new Schema<Doc>({
    title: { type: String},
    content: { type: String},
});

export default docSchema;