var express = require('express');
var router = express.Router();
var User = require('./../models/manager');



//登入接口
router.post("/login", function (req,res,next) {
  var param = {
      managerName:req.body.managerName,
      managerPwd:req.body.managerPwd
  }
  User.findOne(param, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){
              res.cookie("managerName",doc.managerName,{
                  path:'/',
                  maxAge:1000*60*60
              }); 
              //req.session.user = doc;
              res.json({
                  status:'0',
                  msg:'',
                  result:{
                      managerName:doc.managerName,
                      managerPwd:doc.managerPwd
                  }
              });
          }
      }
  });
});


//登出接口
router.post("/logout", function (req,res,next) {
  res.cookie("managerName","",{
    path:'/',
    maxAge:1000*60*60
});
  res.json({
    status:"0",
    msg:'',
    result:'登出成功'
  })
});

router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.managerName || ''
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});

//查询当前用户的收藏数据
router.get("/collection", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
          if(doc){
            res.json({
              status:'0',
              msg:'',
              result:doc.collectionList
            });
          }
      }
  });
});

//收藏删除
router.post("/collectionDel", function (req,res,next) {
  var userId = req.cookies.userId,wordId = req.body.wordId;
  User.update({userId:userId},{
    $pull:{
      'collectionList':{
        'wordId':wordId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

router.post("/editCheckAll", function (req,res,next) {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId}, function (err,user) {
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


//根据订单Id查询订单信息

module.exports = router;
