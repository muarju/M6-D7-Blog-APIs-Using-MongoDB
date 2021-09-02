import mongoose from 'mongoose'

const {Schema, model} = mongoose

const authorSchema = new Schema({
    name: {type:String, required: true},
    avatar: {type:String, required: true},
    }, {
        timestamps: true
    })

export default model("authors", authorSchema) // bounded to the "users" collection, if it is not there it is going to be created automatically