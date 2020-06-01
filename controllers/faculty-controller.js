const Facuty = require('../models/faculty-model')
const Result = require('../models/studentResult-model')
const xlsxj = require("xlsx-to-json")
const sharp = require('sharp')





//LOGIN
exports.facultyLogin = async (req, res) => {
  try {
      const foundFaculty = await Facuty.findByCredentials(req.body.email, req.body.password);
      const token = await foundFaculty.generateAuthToken();
      res.send({foundFaculty,token});
  } catch (error) {
      res.status(400).send({message:'Invalid username or password'});
  }
}

//LOGOUT
exports.facultyLogout = async (req, res) => {
  try {
    req.faculty.tokens = req.faculty.tokens.filter((token) => {
        return (token.token !== req.token);
    });

    await req.faculty.save();
    res.send(req.faculty);
  } catch (error) {
      res.status(400).send({message:'logout failed !'})
  }
}

//SIGNUP
exports.facultySignup = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer();
    req.body.avatar= buffer
    
    const newFaculty = new Facuty(req.body)

    await newFaculty.save()
    const token = await newFaculty.generateAuthToken();

    if(!token)
      throw new Error();

    res.status(201).send({newFaculty, token});
  } catch (error) {
      if(error.code == 11000)
        return res.status(500).send({
          message:`${req.body.email} is already registered , try with another !`
        })
      res.status(500).send({message:'Signup Failed, try again !'})
  }
}

//GET AVATAR FIXME:
exports.getFacultyAvatar = async (req, res) => {
  try {
    const faculty = await Facuty.findById(req.params.facultyId)

    if(!faculty || !faculty.avatar){
      throw new Error()
    }

    let facultyAvatar = faculty.avatar
    res.set('Content-Type','image/png')
    res.status(200).send(facultyAvatar)
  } catch (error) {
    res.status(404).send(error)
  }
}

//ABOUT US
exports.aboutUs = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer();

  const newFaculty = new Faculty({avatar:buffer})
    await newFaculty.save()
    res.status(201).send({message:'successfully'})
  } catch (error) {
    res.status(error.status).send({message:error.message})
  }
}

//uploading student result data using excel
exports.uploadSuccess = (req, res) => {
  const destination = req.file.destination
  const resultFilePath = destination+ '/'+req.file.filename

  
  

  xlsxj({
    input: resultFilePath, 
    output: destination+'/'+"recentResult.json",
    lowerCaseHeaders:true //converts excel header rows into lowercase as json keys
  }, function(err, result) {
    if(err) {
      console.error(err);
      //return res.status(err.status).send({message:err.message})
    }else {
      let resultDataArray= [...result]
      for(eachResult of resultDataArray){
        saveResultToDb(eachResult)
      }
      res.send({message:'result upload successful'})
    }
  })

  saveResultToDb=async (eachResult) => {
    try {
      let newResult = new Result(eachResult)
      const savedResult = await newResult.save()
    } catch (error) {
      console.log(error,'saveResultToDb_ERR');
    }
  }
}

//get student result data
exports.getStudentResults = async (req, res) => {
  try {
    let studentResults = await Result.find({})
    
    if(!studentResults)
      return res.status(404).send({message:'No Results found'})

    studentResults = Object.entries(studentResults).map((e) => ( { [e[0]]: e[1] } ))
    let tempArr = []
    for(data of studentResults){
      for(ress in data){
        tempArr.push(data[ress])
        
      }
      
    }
    
    
    res.status(200).send({resultDataArray:tempArr})
  } catch (error) {
    res.status(error.status).send({message:error.message})
  }
}
