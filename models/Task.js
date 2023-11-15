const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    text:String
})

module.exports = mongoose.model('Task',TaskSchema)