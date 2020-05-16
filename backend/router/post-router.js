const express = require('express')
const postRouter = new express.Router()
const PostController = require('../controllers/post-controller')
const auth = require('../middlewares/auth')


// get post
postRouter.get('/api/posts', auth, PostController.getPost)

// get post media
postRouter.get('/api/post/:userId/media', PostController.getPostMedia)

//add post
postRouter.post('/api/posts', auth, PostController.addPost)

//edit post
postRouter.patch('/api/posts/:id', auth, PostController.editPost)

//delete post
postRouter.delete('/api/posts/:id', auth, PostController.deletePost)


module.exports = postRouter
