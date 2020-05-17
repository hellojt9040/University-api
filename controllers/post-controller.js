const Post = require('../models/post-model')

//GET POST
exports.getPost = async (req, res) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.currentpage
  const postQwery = Post.find({owner: req.user._id})
  let foundPosts = {}

  try {
    if(pageSize && currentPage){
      foundPosts = await postQwery
                        .skip(pageSize * (currentPage-1))
                        .limit(pageSize)
    }

    //queries
    foundPosts = await postQwery
    const totalPostsLength = await Post.countDocuments()

    if(!foundPosts)
      throw new Error()

    res.status(200).send({
      message:'fetched data successfully',
      posts:foundPosts,
      totalPostsLength,
    })
  } catch (error) {
      res.status(404).send({
        message:'no data found, try again !!',
        posts:undefined,
        totalPostsLength:undefined
      })
  }
}

//GET POST media
exports.getPostMedia = async (req, res) => {
  try {
    const post = await Post.findById(req.params.userId)

    if(!post || !post.media){
      throw new Error()
    }

    let postMedia = post.media
    res.set('Content-Type','image/png')
    res.status(200).send(postMedia)
  } catch (error) {
    res.status(404).send(error)
  }
}

//ADD POST
exports.addPost = async (req, res) => {
  const post = new Post({
    ...req.body,
    owner:req.user._id});

  try {
    await post.save()
    res.status(201).send({
      message:'post created successfully'
    })

  } catch (error) {
    res.status(400).send({message:error.message})
  }

}

//EDIT POST
exports.editPost = async (req, res) => {
  const updates = Object.keys(req.body);

  try {
      const editedPost = await Post.updateOne({_id:req.body.id, owner:req.user._id}, req.body)
      console.log(editedPost);
      if(editedPost.nMOdified > 0)
        res.status(200).send({message:'Edited successfully'})
      else
        throw new Error({message:'Please Authenticate !!'})
  }catch (error) {
      res.status(401).send({message:error.message});
  }
}

//DELETE POST
exports.deletePost = async (req, res) => {
  const deletingTask = await Post.findOne({_id:req.params.id, owner: req.user._id})
  try {
    if(!deletingTask)
      return res.status(401).send({error:'Unable to find the task'});

    await deletingTask.remove()
    res.status(200).send({success:'successfully !'})
  } catch (error) {
    res.status(500).send({success:error.message})
  }
}
