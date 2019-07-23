const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (request, response, next) => {

    try{

        const auth_header = request.header('Authorization');
        if(!auth_header){
            return response.status(401).send({message:'No authorization header'});
        }
        const token = auth_header.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token});

        if(!user){
            throw new Error('Provide valid authentication token');
        }

        request.user = user;
        next();

    }catch({message}){

        response.status(401).send({message})
    }

}

module.exports = authMiddleware;