import express from 'express'
import createError from 'http-errors'

import BlogModel from './schema.js'

const blogsRouter = express.Router()

blogsRouter.post("/", async(req,res,next) => {
  try {

    const newBlog = new BlogModel(req.body) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    const {_id} = await newBlog.save()

    res.status(201).send({_id})
    
  } catch (error) {
    next(error)
  }
})
blogsRouter.post("/:blogId/comments", async(req,res,next) => {
  try {
    const addComment = await BlogModel.findByIdAndUpdate(
      req.params.blogId,
      { $push: { Comments: req.body } },
      { new: true,
        runValidators: true
      }
    )
    res.status(201).send(addComment)
  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
})

blogsRouter.get("/", async(req,res,next) => {
  try {
    
    const blogPosts = await BlogModel.find({})

    res.send(blogPosts)
    
  } catch (error) {
    next(error)
  }
})
blogsRouter.get("/:blogId", async(req,res,next) => {
  try {

    const blogId = req.params.blogId

    const blogPosts = await BlogModel.findById(blogId) // similar to findOne()

    if(blogPosts){

      res.send(blogPosts)

    } else {
      next(createError(404, `Blog with id ${blogId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})
blogsRouter.get("/:blogId/comments/:commentId", async(req,res,next) => {
  try {
    const { blogId, commentId } = req.params
    const comment = await BlogModel.findOne(
      { "Comments._id": commentId },
      {
        "Comments.$": 1,
        "_id": 0 //suppress blogID
      }
    )
    res.status(200).send(comment)
  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
})
blogsRouter.get("/:blogId/comments/", async(req,res,next) => {
  try {

    const blogs = await BlogModel.findById(req.params.blogId)
    res.status(200).send(blogs.Comments)

  } catch (error) {
    res.status(500)
    next(error)
  }
})


blogsRouter.put("/:blogId", async(req,res,next) => {
  try {
    const blogId = req.params.blogId

    const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true // returns the modified blog
    })

    if(modifiedBlog){
      res.status(202).send(modifiedBlog)
    } else {
      next(createError(404, `User with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
blogsRouter.put("/:blogId/comments/:commentId", async(req,res,next) => {
  try {
    const { blogId, commentId } = req.params

    const updatedComment = await BlogModel.findOneAndUpdate(
      { "_id": blogId, "Comments._id" : commentId },
      {
        $set: {
          "Comments.$": { 
            "_id": commentId,
            ...req.body
          },
        },    
      },
      {new: true}
      )
    res.status(202).send(updatedComment)
  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
})

blogsRouter.delete("/:blogId", async(req,res,next) => {
  try {
    const blogId = req.params.blogId

    const deletedBlog = await BlogModel.findByIdAndDelete(blogId)

    if(deletedBlog){
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete("/:blogId/comments/:commentId", async(req,res,next) => {
  try {
    const { blogId, commentId } = req.params

    const blog = await BlogModel.findByIdAndUpdate(
      blogId,
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

export default blogsRouter