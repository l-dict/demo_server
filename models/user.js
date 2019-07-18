//建立模型
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userName":String,
  "userPwd":String,
  "manager":Boolean,             //是否是后台管理者
  "collectionList":[        //收藏单词列表
    {
        "word":String,
        "phonetic":String,        //音标，以英语英标为主
        "definition":String,      //单词释义（英文），每行一个释义
        "translation":String,     //单词释义（中文），每行一个释义 
        "collins":Number,         //柯林斯星级
        "oxford":String,          //是否是牛津三千核心词汇
        "tag":String,             //字符串标签：zk/中考，gk/高考，cet4/四级 等等标签，空格分割
        "bnc":Number,             //英国国家语料库词频顺序
        "frq":Number,             //当代语料库词频顺序
        "exchange":String         //时态复数等变换，使用 "/" 分割不同项目，见后面表格
   
    }
  ]
},{ versionKey: false });//关闭文档版本控制

module.exports = mongoose.model("User",userSchema);
