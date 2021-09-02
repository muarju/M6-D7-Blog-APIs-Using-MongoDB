import express from 'express'
import createError from 'http-errors'

import authorModel from './schema.js'

const authorsRouter = express.Router()

authorsRouter.post("/", async(req,res,next) => {
  try {

    const newBlog = new authorModel(req.body) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    const {_id} = await newBlog.save()

    res.status(201).send({_id})
    
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", async(req,res,next) => {
  try {
    
    const blogPosts = await authorModel.find({})

    res.send(blogPosts)
    
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/:authorId", async(req,res,next) => {
  try {

    const authorId = req.params.authorId

    const blogPosts = await authorModel.findById(authorId) // similar to findOne()

    if(blogPosts){

      res.send(blogPosts)

    } else {
      next(createError(404, `Blog with id ${authorId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:authorId", async(req,res,next) => {
  try {
    const authorId = req.params.authorId

    const modifiedBlog = await authorModel.findByIdAndUpdate(authorId, req.body, {
      new: true // returns the modified blog
    })

    if(modifiedBlog){
      res.status(202).send(modifiedBlog)
    } else {
      next(createError(404, `User with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", async(req,res,next) => {
  try {
    const authorId = req.params.authorId

    const deletedBlog = await authorModel.findByIdAndDelete(authorId)

    if(deletedBlog){
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId/comments/:commentId", async(req,res,next) => {
  try {
    const { authorId, commentId } = req.params

    const blog = await authorModel.findByIdAndUpdate(
      authorId,
      {
        $pull: {
          Comments: { _id: commentId },
        },
      },
      {
        new: true,
      }
    )
    res.status(200).send(blog)

  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
})

export default authorsRouter