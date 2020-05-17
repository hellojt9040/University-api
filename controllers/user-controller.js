const User = require('../models/user-model')
const sharp = require('sharp')

//LOGIN
exports.userLogin = async (req, res) => {
  try {
      const foundUser = await User.findByCredentials(req.body.email, req.body.password);
      const token = await foundUser.generateAuthToken();
      res.send({foundUser,token});
  } catch (error) {
      res.status(400).send({message:'Invalid username or password'});
  }
}

//LOGOUT
exports.userLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return (token.token !== req.token);
    });

    await req.user.save();
    res.send(req.user);
  } catch (error) {
      res.status(400).send({message:'logout failed !'});
  }
}

//SIGNUP
exports.userSignup = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer();
    req.body.avatar= buffer
    const newUser = new User(req.body)

    await newUser.save()
    const token = await newUser.generateAuthToken();

    if(!token)
      throw new Error();

    res.status(201).send({newUser, token});
  } catch (error) {
      if(error.code == 11000)
        return res.status(500).send({
          message:`${req.body.email} is already registered , try with another !`
        })
      res.status(500).send({message:'Signup Failed, try again !'})
  }
}

//GET AVATAR FIXME:
exports.getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if(!user || !user.avatar){
      throw new Error()
    }

    let userAvatar = user.avatar
    res.set('Content-Type','image/png')
    res.status(200).send(userAvatar)
  } catch (error) {
    res.status(404).send(error)
  }
}

//ABOUT US
exports.aboutUs = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer();

  const newUser = new User({avatar:buffer})
    await newUser.save()
    res.status(201).send({message:'successfully'})
  } catch (error) {
    res.status(error.status).send({message:error.message})
  }

}
