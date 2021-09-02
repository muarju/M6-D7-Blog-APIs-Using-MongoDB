import mongoose from 'mongoose'

const {Schema, model} = mongoose

const blogSchema = new Schema({
    category : {type: String, required: true},
    title : {type: String, required: true},
    cover : {type: String, required: true},
    readTime : {
        value: {type:Number, required: true},
        unit: {type:String, required: true}
    },
    author : { type: Schema.Types.ObjectId, ref: "authors", required: true },
    content: {type:String, required: true},
    Comments: [{
    comment: { type: String, required: true },
    rate: { type: Number, required: true },
    }],
    likes: [{ type: Schema.Types.ObjectId}],
    }, {
        timestamps: true
    })

export default model("blogPost", blogSchema) // bounded to the "users" collection, if it is not there it is going to be created automatically