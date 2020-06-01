const jwt = require('jsonwebtoken');
const Faculty = require('../models/faculty-model');

//authorization
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const faculty = await Faculty.findOne({_id:decoded._id, 'tokens.token': token})

        if(!faculty)
            throw new Error();

        req.token = token;
        req.faculty = faculty;
        next();
    } catch (error) {
        res.status(400).send({message:'You are not authenticated !!!'});
    }
}

module.exports = auth;
