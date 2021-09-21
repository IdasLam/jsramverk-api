import { Schema } from "mongoose"

type Users = {
    password: string
    username: string
}

const userSchema = new Schema<Users>({
    username: { type: String, unique: true},
    password: {type: String},
})

export default userSchema