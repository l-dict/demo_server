var express = require('express');
var router = express.Router();
var User = require('./../models/user');//引入一个User模型

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/test', function(req, res, next) {
//   res.send('test');
// });




//登入接口
router.post("/login", function (req,res,next) {//配置路由并使用post方法
  var param = { //临时新建一个Object类型的参数，包含userName和userPwd两个参数
      userName:req.body.userName, //获取http请求中body里的userName
      userPwd:req.body.userPwd //获取http请求中body里的userPwd
  }
  User.findOne(param, function (err,doc) {  //查找参数为param 的数据库中的一个文档
      if(err){  //函数返回的err为真，则查找失败         
          res.json({
              status:"1",   //响应报文返回状态码自定义为1，表示出错
              msg:err.message //将错误的具体信息放进响应报文的msg字段
          });
      }else{
          if(doc){   //返回
              res.cookie("userName",doc.userName,{
                  path:'/',           //缓存路径，浏览器跟目录下
                  maxAge:1000*60*60   //缓存时间控制
              });
              //req.session.user = doc;
              res.json({
                  status:'0',  //数据库返回
                  msg:'登录成功',       
                  result:{
                    userName:doc.userName, //将数据库返回文档的userName，userPwd字段写入result
                    userPwd:doc.userPwd
                  }
              });
          }else{
            res.json({
              status:'2',  //数据库返回
              msg:'登录失败',       
              result:"用户名或密码错误"
          });
          }
      }
  });
});


//登出接口
router.post("/logout", function (req,res,next) {
  res.cookie("userName","",{//将缓存中的userName清空
    path:'/',
    maxAge:-1
});
  res.json({
    status:"0",   //登出成功，给前端返回状态码为0
    msg:'登出成功',
    result:''
  })
});

//修改密码
router.post("/updateUser",function(req,res,next){
  var userName=req.cookies.userName, //获取http请求中body里的userName
    userPwd=req.body.userPwd ;//获取http请求中body里的userPwd
  if(req.cookies.userName){  //检查请求报文的缓存中是否存在userName
    User.findOne({userName:userName},function(err,userDoc){
      if(err){
        res.json({     
          status:'1',  //userName存在则返回状态码为0
          msg:err.message,
          result:"查找用户出错" 
        });

      }else{
        if(userDoc){
          User.updateOne({userName:userName},{userPwd:userPwd},function(err,doc){
            if(err){
              res.json({     
                status:'1',  //userName存在则返回状态码为0
                msg:err.message,
                result:"更新用户出错" 
              });
            }else{
              res.json({     
                status:'0',  //userName存在则返回状态码为0
                msg:"修改密码成功",
                result:doc
              });
  
            }
          });
        }
        
      }
    });
      
  }else{
    res.json({
      status:'1001',  //userName存在返回状态码为1
      msg:'未登录',
      result:''
    });
  }


});

//查询是否登陆
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userName){  //检查请求报文的缓存中是否存在userName
      res.json({     
        status:'0',  //userName存在则返回状态码为0
        msg:'',
        result:req.cookies.userName || ''  
      });
  }else{
    res.json({
      status:'1001',  //userName存在返回状态码为1
      msg:'未登录',
      result:''
    });
  }
});

//判断是否是管理员
router.post("/ifManager", function (req,res,next) {
  if(req.cookies.userName){  //检查请求报文的缓存中是否存在userName
    User.findOne({userName:req.cookies.userName},function(err,doc){
      if(err){
        res.json({     
          status:'1',  //userName存在则返回状态码为0
          msg:err.message,
          result:"" 
        });

      }else{
        if(doc.manager==true){
          res.json({     
            status:'0',  //是管理员存在则返回状态码为0
            msg:'该用户是管理员',
            result:"suc" 
          });
        }else{
          res.json({     
            status:'2',  //不是管理员则返回状态码为2
            msg:'该用户不是是管理员',
            result:"suc" 
          });
        }
       
      }
    });
      
  }else{
    res.json({
      status:'1001',  //userName存在返回状态码为1
      msg:'未登录',
      result:''
    });
  }
});

//注册接口
router.post("/regist", function (req,res,next) { //接口路由
  //新建一个User模型
  var userDoc =new User(  
              {
              userName:req.body.userName,//获取发来的请求报文body中携带的userName
              userPwd:req.body.userPwd,//获取发来的请求报文body中携带的userPwd
              manager:req.body.manager   //false表示不是管理者
              }
            )
  //查找参数为请求传来的userName的数据库中的一个文档
  //注册之前先判断数据库是否存在该userName的文档
  User.findOne({userName:req.body.userName}, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){          //数据库中存在这个文档
            res.json({
              status:"2",   //定义响应报头状态码2
              msg:"用户名存在"
          });
          }else{   //不存在改文档
            userDoc.save(function (err1,docs){//写入一个一个User文档
              if(err1){
                res.json({
                status:'3',    //写入失败状态码定义为3
                msg:err1.message
                });
              }else{
                res.json({
                  status:'0',
                  msg:'注册成功'+docs,
                  result:'success'
                });
              }

            })
          }
      }
  });
});

//查询当前用户的收藏数据
router.get("/collectionList", function (req,res,next) {
  if(req.cookies.userName){
    var userName = req.cookies.userName;
  User.findOne({userName:userName}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:'出错了！'
        });
      }else{
        console.log("doc:"+doc);
          if(doc){
            res.json({
              status:'0',
              msg:'查询成功',
              result:{collectionList:doc.collectionList,
                     count:doc.collectionList.length}
            });
          }
      }
  });
  }else{
    res.json({
      status:'1001',
      msg:"fail",
      result:'未登录'
    });
  }
  
});

//收藏删除
router.post("/collectionDel", function (req,res,next) {
  var userName = req.cookies.userName,
      delWord = req.body.word;
  
  console.log(delWord);
  User.update({userName:userName},{
    $pull:{
      'collectionList':{'word':delWord}
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'删除失败！'
      });
    }else{
      res.json({
        status:'0',
        msg:delWord,
        result:'succuss'
      });
    }
  });
});

router.post("/editCheckAll", function (req,res,next) {
  var userName = req.cookies.userName,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({userName:userName}, function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.collection.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1,message,
                result:''
              });
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              });
            }
        })
      }
    }
  });
});


//查询所有用户
router.get("/usersList", function (req,res,next) {
  if(req.cookies.userName){
  User.find(function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:'fail'
        });
      }else{
        console.log("doc:"+doc);
          if(doc){
            res.json({
              status:'0',
              msg:'查询成功',
              result:{
                count:doc.length,
                userslist:doc
              }
            });
          }
      }
  });
  }else{
    res.json({
      status:'1001',
      msg:"fail",
      result:'未登录'
    });
  }
  
});

module.exports = router;
