const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const studentSchema = new mongoose.Schema({
  studentName:{
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
  sem:{
    type:Number,
    required:true
  },
  branch:{
    type:String,
    required:true,
    trim:true,
  },
  course:{
    type:String,
    trim:true,
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

/* // realationship
studentSchema.virtual('post', {
  ref:'Post',
  localField: '_id',
  foreignField: 'owner'
}) */

//generating auth token
studentSchema.methods.generateAuthToken = async function() {
  const student = this;
  const token = jwt.sign({_id:student._id.toString()}, process.env.JWT_SECRET, {expiresIn:"1h"}); //{expiresIn: '1h'} <- 3rd param

  student.tokens = student.tokens.concat({token});
  await student.save();
  return token;
}

//login security validation
studentSchema.statics.findByCredentials = async (email, password) => {
  const foundStudent = await Student.findOne({email});

  if(!foundStudent)
      throw new Error('unable to login, try again !!');
  const isMatch = await bcrypt.compare(password, foundStudent.password);

  if(!isMatch)
      throw new Error('unable to login, try again !!');

  return foundStudent;
}

// hash the plain text before saving
studentSchema.pre('save', async function(next) {
  const student = this;

  if( student.isModified('password')) {
      student.password = await bcrypt.hash(student.password, 8);
  }

  next();
});

//hidding private data
studentSchema.methods.toJSON = function () {
  const student = this.toObject();

  //deleting private data and retuning
  delete student.password;
  delete student.tokens;
  delete student.avatar;
  return student;
}

const Student = mongoose.model('Student',studentSchema)

module.exports = Student
