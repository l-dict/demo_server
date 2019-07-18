const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const daywordSchema = new Schema({
    "word":String,
    "content":String,    //录入的内容
    "date":Date,         //录入日期
    "manager":String,     //录入的管理员
  
},{ versionKey: false });  //关闭文档版本控制

module.exports = mongoose.model('Dayword',daywordSchema);
