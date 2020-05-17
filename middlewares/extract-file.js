const multer = require('multer')

//multer configuration
const upload = multer({         //dest: 'avatars',  not to save it inside the app, rather in database
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error('Only jpg/jpeg/png files are allowed !!', false));

        cb(undefined, true);
    }
})

module.exports = upload.single('avatar')

/* TODO:
const MIME_TYPE = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',
}

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype]
    const error = new Error('Invlid mime-type error')
    if(isValid)
      error = null

    cb(error, '../assets/images')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '-' + Date.now()
    const name = file.originalname.toLowerCase().split(' ').join('-')  + uniqueSuffix
    const ext = MIME_TYPE[file.mimetype]
    cb(null, name + uniqueSuffix + '.' + ext)
  }
}) */


