var mongoose = require('mongoose');

const user = new mongoose.Schema({
    avatar: String,
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    createTime: String,
    updateTime: String,
    password: String,
    desc: String,
}, {versionKey: false, timestamps: {createdAt: 'createTime',
        updatedAt: 'updateTime' }});

module.exports = mongoose.model("user", user);