const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    trim:true,
    required:true,
    minlength:4
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value))
        throw new Error('enter a valid email')
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(value.includes('password'))
        throw new Error("entered password field can't contain word: 'password'")

      /* if (!value.match(/[a-z]/g) &&
          !value.match(/[A-Z]/g) &&
          !value.match(/[0-9]/g) &&
          !value.match(/[^a-zA-Z\d]/g))
        throw new Error('Re-Check password policy') */
    }
  },
  avatar:{
    type:Buffer
  },
  tokens:[{
    token:{
        type: String,
        required: true
    }
  }],
},{
  timestamps:true
})

// realationship
userSchema.virtual('task', {
  ref:'Task',
  localField: '_id',
  foreignField: 'owner'
})

//generating auth token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET, {expiresIn:"1h"}); //{expiresIn: '1h'} <- 3rd param

  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

//login security validation
userSchema.statics.findByCredentials = async (email, password) => {
  const foundUser = await User.findOne({email});

  if(!foundUser)
      throw new Error('unable to login, try again !!');
  const isMatch = await bcrypt.compare(password, foundUser.password);

  if(!isMatch)
      throw new Error('unable to login, try again !!');

  return foundUser;
}

// hash the plain text before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if( user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//hidding private data
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  //deleting private data and retuning
  delete user.password;
  delete user.tokens;
  delete user.avatar;
  return user;
}

const User = mongoose.model('User',userSchema)

module.exports = User
