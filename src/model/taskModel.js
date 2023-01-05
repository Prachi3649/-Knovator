
const mongoose = require("mongoose")



const taskSchema = new mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    title: {
        type: String,
        require: true
    },

    body: {
        type: String,
        require: true

    },

    latitude: {
        type: String,
        require: true

    },
    longitude: {
        type: String,
        require: true,

    },
    isActive: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

module.exports = new mongoose.model("task", taskSchema)