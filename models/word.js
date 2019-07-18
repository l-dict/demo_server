const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    "word":String,
    "phonetic":String,    //音标，以英语英标为主
    "definition":String,  //单词释义（英文），每行一个释义
    "translation":String, //单词释义（中文），每行一个释义 
    "collins":Number,           //柯林斯星级
    "oxford":String,            //是否是牛津三千核心词汇
    "tag":String,               //字符串标签：zk/中考，gk/高考，cet4/四级 等等标签，空格分割
    "bnc":Number,               //英国国家语料库词频顺序
    "frq":Number,               //当代语料库词频顺序
    "exchange":String           //时态复数等变换，使用 "/" 分割不同项目，见后面表格

},{ versionKey: false });    //关闭文档版本控制

module.exports = mongoose.model('Word',wordSchema);

