import express from 'express'
import createError from 'http-errors'
import bcrypt from 'bcryptjs'
import authorModel from './schema.js'

const authorsRouter = express.Router()

authorsRouter.get("/", async(req,res,next) => {
  try {
    const authors = await authorModel.find({})
    res.send(authors)
    
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", async(req,res,next) => {
  try {

    const authorId = req.params.authorId
    const authors = await authorModel.findById(authorId) // similar to findOne()

    if(authors){
      res.send(authors)
    } else {
      next(createError(404, `Author with id ${authorId} not found!`))
    }
    
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/", async(req,res,next) => {
  try {
    const password= req.body.password
    const passwordHash = bcrypt.hashSync(password, 10);
    const email= req.body.email

    const newAuthor = new authorModel({...req.body,email: email.toLowerCase(), password: passwordHash}) // here happens validation of the req.body, if it's not ok mongoose will throw a "ValidationError"
    const {_id} = await newAuthor.save()

    res.status(201).send({_id})
    
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/login", async(req,res,next) => {
  try {
    const {email,password}=req.body;
    const data = await authorModel.findOne(
      { "email": email.toLowerCase() },
    );
     // check account found and verify password
    if (!data || !bcrypt.compareSync(password, data.password)) {
      res.status(200).send("authentication failed");
    } else {
      // authentication successful
      res.send(data);
    }
    
  } catch (error) {
    next(error)
  }
})


authorsRouter.put("/:authorId", async(req,res,next) => {
  try {
    const authorId = req.params.authorId

    const modifiedAuthor = await authorModel.findByIdAndUpdate(authorId, req.body, {
      new: true // returns the modified blog
    })

    if(modifiedAuthor){
      res.status(202).send(modifiedAuthor)
    } else {
      next(createError(404, `author with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", async(req,res,next) => {
  try {
    const authorId = req.params.authorId

    const deletedAuthor = await authorModel.findByIdAndDelete(authorId)

    if(deletedAuthor){
      res.status(204).send()
    } else {
      next(createError(404, `Author with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter