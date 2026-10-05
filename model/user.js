const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    mailid: {
        type: String,
        required: true,
    },

    otp: {
        type: Number,
    },

    otpExpiry: {
        type: Date,
    }
})

module.exports = mongoose.model("USER", userSchema);