import express from 'express'
import createError from 'http-errors'
import BlogModel from './schema.js'
import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary} from 'cloudinary'
import authJwt from '../../tools/authJwt.js'

export const cloudinaryStorageMedia = new CloudinaryStorage({
  cloudinary,
  params:{
      folder: "Blog-images",
  },
})


const blogsRouter = express.Router()

blogsRouter.put("/coverUpdate/:postId",multer({ storage: cloudinaryStorageMedia }).single("cover"), async(req,res,next) => {
  try {
   const blogId = req.params.postId
   if(req.file.path===""){
    req.file.path="https://res.cloudinary.com/djm1hfijq/image/upload/v1630601514/Blog-images/No_image_3x4.svg_lozryx.png"
  }
   const modifiedBlog = await BlogModel.findByIdAndUpdate(blogId,{
    ...req.body,
    cover: req.file.path
   }, {
    new: true // returns the modified blog
  })

    res.status(201).send({modifiedBlog})
    
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/",[authJwt.verifyToken], async(req,res,next) => {
  try {
    const newBlog = new BlogModel(req.body) 
    const {_id} = await newBlog.save()

    res.status(201).send({_id})
    
  } catch (error) {
    next(error)
  }
})

blogsRouter.post("/:blogId/comments",[authJwt.verifyToken], async(req,res,next) => {
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
    
    const blogPosts = await BlogModel.find({}).populate('author')

    res.send(blogPosts)
    
  } catch (error) {
    next(error)
  }
})
blogsRouter.get("/:blogId", async(req,res,next) => {
  try {

    const blogId = req.params.blogId

    const blogPosts = await BlogModel.findById(blogId).populate('author') // similar to findOne()

    if(blogPosts){

      res.send(blogPosts)

    } else {
      next(createError(404, `Blog with id ${blogId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})
blogsRouter.get("/me/:authorId", async(req,res,next) => {
  try {

    const authorId = req.params.authorId

    const blogPosts = await BlogModel.find({ "author": authorId }) // similar to findOne()

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


blogsRouter.put("/:blogId",[authJwt.verifyToken], async(req,res,next) => {
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
blogsRouter.put("/:blogId/comments/:commentId",[authJwt.verifyToken], async(req,res,next) => {
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

blogsRouter.delete("/:blogId",[authJwt.verifyToken], async(req,res,next) => {
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

blogsRouter.delete("/:blogId/comments/:commentId",[authJwt.verifyToken], async(req,res,next) => {
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


blogsRouter.get("/:blogPostId/like/:userId",[authJwt.verifyToken], async(req,res,next) => {
  try {
    const {blogPostId, userId} = req.params
    const isLiked = await BlogModel.find( { likes: userId } )
    let response
    if (isLiked.length === 0 ){
       response = await BlogModel.findByIdAndUpdate(blogPostId, {$push : {
        likes: userId
      }}, {new: true})
      
    } else {
      response = await BlogModel.findByIdAndUpdate(blogPostId, {$pull : {
        likes: userId
      }}, {new: true})

    }

    res.send({totalLikes: response.likes.length, currentUserLike: response.likes.includes(userId)? true: false})

  } catch (error) {
    res.status(500)
    console.log(error)
    next(error)
  }
})
export default blogsRouter