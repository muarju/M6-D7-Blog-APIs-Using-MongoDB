# M6-D7-Mongoose CRUD
 Mongoose CRUD Homework
In this application should enable the creation, editing, deletion, listing of blog posts

Blog posts should contain following information:
```
{
	    "_id": "MONGO GENERATED ID",
	    "category": "ARTICLE CATEGORY",
	    "title": "ARTICLE TITLE",
	    "cover":"ARTICLE COVER (IMAGE LINK)",
	    "readTime": {
	      "value": 2,
	      "unit": "minute"
	    },
	    "author": {
	      "name": "AUTHOR NAME",
	      "avatar":"AUTHOR AVATAR LINK"
	    },
	    "content": "HTML",
	    "createdAt": "DATE",
        "updatedAt": "DATE"           
}
```

### The backend should include the following routes:

- GET /blogPosts => returns the list of blogPosts 
- GET /blogPosts /123 => returns a single blogPost
- POST /blogPosts => create a new blogPost
- PUT /blogPosts /123 => edit the blogPost with the given id
- DELETE /blogPosts /123 => delete the blogPost with the given id

The persistence must be granted via MongoDB

## Deply on HeroKu: 
- GET https://striveblogmongodb.herokuapp.com/blogPosts 
(returns the list of blogPosts)

- GET https://striveblogmongodb.herokuapp.com/blogPosts/<:blogId> (returns a single blogPost)

- POST https://striveblogmongodb.herokuapp.com/blogPosts  (create a new blogPost) <br/>
In request body from postman need to send below details

```
{
    "category": "{{$randomLoremWord}}",
    "title": "{{$randomLoremSentence}}",
    "cover":"{{$randomImageUrl}}",
    "readTime": {
        "value": {{$randomInt}},
        "unit": "minute"
    },
    "author": {
        "name": "{{$randomFirstName}} {{$randomLastName}}",
        "avatar":"{{$randomAvatarImage}}"
    },
    "content": "{{$randomLoremParagraph}}"
}
```

- PUT https://striveblogmongodb.herokuapp.com/blogPosts/<:blogId> edit the blogPost with the given id <br>
from postman need to send update key: value
```
{
    "category": "Technology",
    "title": "My update title",

}
```

- DELETE https://striveblogmongodb.herokuapp.com/blogPosts/<:blogId> delete the blogPost with the given id

# D8 - Embedding documents
### add a comment to an article.
Mongo's preferred data design should be to embed comments into blog posts if possible, therefore you should implement the following endpoints

- GET /blogPosts/:id/comments => returns all the comments for the specified blog post
- GET /blogPosts/:id/comments/:commentId=> returns a single comment for the specified blog post
- POST /blogPosts/:id => adds a new comment for the specified blog post
- PUT /blogPosts/:id/comment/:commentId => edit the comment belonging to the specified blog post
- DELETE /blogPosts/:id/comment/:commentId=> delete the comment belonging to the specified blog post

# D9 Embedding vs Referencing
### Create Author CRUD
Today I am going to create author CRUD. So, author can login our system and can create new blog post. 

- GET /authors/ => returns all the authors
- GET /authors/:id => returns a single Author 
- POST /authors/ => adds a new author
- POST /authors/login => return author data if given email and password matches
- PUT /authors/:id/ => update for 
- DELETE /authors/:id/comment/:commentId=> delete the comment belonging to the specified blog post


### Blog Post Like Option API
- GET /blogPosts/:blogPostId/like/:userId => will add user id if not exist and will return total Like for a single post