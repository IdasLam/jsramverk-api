import { Schema } from "mongoose"

type Doc = {
    title: string,
    contents: string,
}

const docSchema = new Schema<Doc>({
    title: { type: String},
    contents: { type: String},
});

export default docSchema;