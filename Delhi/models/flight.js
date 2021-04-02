const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    flightId:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    arrival:{
        type:Date,
        required:true
    },
    departure:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    seats:{
        type:Number,
        required: true
    }
})

module.exports = mongoose.model('Flights',flightSchema);