//建立模型
var mongoose = require('mongoose');

var managerSchema = new mongoose.Schema({
  "managerName":String,  
  "managerPwd":String,
  "e-mail":String,        //邮箱
   "tel":"String"         //联系电话
},{ versionKey: false });//关闭文档版本控制

module.exports = mongoose.model("Manager",managerSchema);
