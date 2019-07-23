const { Food } = require('../../models');

const Create = async ( request, response ) => {

    const food = new Food({...request.body, owner: request.user._id});

    try{
        const result = await food.save();

        if(!result){
            response.status(400).send({message: "Couldn't save food" });
        }
        response.status(201).send({result});
    }catch({ message }){
        response.status(500).send({message})
    }
}

const List = async ( request, response ) => {

    try{
        const foods = await Food.find({});

        if(!foods){
            response.status(400).send({ message: 'Couldnt get foods'});
        }
        response.send({foods})
    }catch({message}){
        response.status(500).send({message});
    }
}

const View = async (request, response) => {

    try{
        const food = await Food.findById(request.params.id);

        if(!food){
            response.status(404).send({ message: 'Food not found'});
        }

        await food.populate('owner').execPopulate();
        response.send({food})
    }catch({message}){
        response.status(500).send({message})
    }
}

const Update = async ( request, response ) => {

    const parameters = Object.keys(request.body);
    const allowedParameters = ['title', 'description'];
    const isValidOperation = parameters.every( parameter => allowedParameters.includes(parameter));

    if(!isValidOperation){
        response.status(401).send({ message: 'Invalid parameters'});
    }

    try{

        const food = await Food.findByIdAndUpdate({ _id: request.params.id}, request.body, { new: true, runValidators: true});

        if(!food){
            response.status(400).send({ message: 'failed to update'});
        }

        response.send({ food });
    }catch({message}){
        response.status(500).send({message})
    }
}

const Delete = async (request, response) => {

    try{
        const food = Food.findByIdAndDelete(request.params.id);

        if(!food){
            response.status(400).send({message: 'Food not found'});
        }

        response.send({messags:'Food successfully deleted'});
    }catch({message}){
        response.status(500).send({ message })
    }

}

module.exports = {
    Create,
    List,
    View,
    Update,
    Delete,
}

