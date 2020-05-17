const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title:{
      type:String,
      required:true,
      trim:true,
      default:'Post Title',
      maxlength:100
    },
    description:{
      type:String,
      required:true,
      trim:true,
      maxlength:200
    },
    media:{
      type:Buffer,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },{
    timestamps:true
  }
)

const Post = mongoose.model('Post', postSchema)

/* postSchema.methods.toJSON = function () {
  const user = this.toObject()

} */

module.exports = Post
