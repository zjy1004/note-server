var mongoose = require('mongoose');

const user = new mongoose.Schema({
    avatar: String,
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    desc: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      default: ''
    }
}, {versionKey: false, timestamps: {createdAt: 'createTime',
        updatedAt: 'updateTime' }});

module.exports = mongoose.model("user", user);