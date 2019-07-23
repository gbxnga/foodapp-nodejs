const mongoose = require('mongoose');



const FoodSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    type: {
        type: String,
        validate(value){
            if(value != 'edible' && value != 'canned' && value != 'beverage' && value != 'spice'){
                throw new Error('Food type can only be Edible, Canned, Beverage or Spice');
            }
        }
    },
    photo: {
        type: String
    },
    location: {
        type: String,
        // required: true
    },
    state: {
        type: String
    },
    pick_up_time: {
        type: String
    },
    keep_listed_for: {
        type: String
    },
    pick_up_address: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

},{
    timestamps: true
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;