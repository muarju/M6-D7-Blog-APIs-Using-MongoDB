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


blogsRouter.put("/:blogId", async(req,res,next) => {
  try {
    const blogId = req.params.blogId

    const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true // returns the modified blog
    })

    if(modifiedBlog){
      res.send(modifiedBlog)
    } else {
      next(createError(404, `User with id ${blogId} not found!`))
    }
  } catch (error) {
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


export default blogsRouter