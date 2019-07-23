const { User } = require('../../models');


const Login = async (request, response) => {

    const { email, password} = request.body;
    try{

        const user = await User.findByCredentials(email, password);

        if(!user){
            response.status(404).send({message: 'Wrong email or password!'});
        }

        const token = await user.generateAuthToken();
        response.send({ message: 'Login successful', user, token})

    }catch({message}){
        response.status(500).send({message})
    }
}

const Register = async (request, response) => {

    console.log(request.body)
    const user = new User(request.body);

    try{

        const result = await user.save();

        response.status(201).send({ message: 'User succesfully registered', user});
    }catch({message}){

        response.status(500).send({message, request: request.body})
    }
} 

module.exports = {
    Login,
    Register
}