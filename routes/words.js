var express = require('express');
var router = express.Router(); 
var Word = require('./../models/word');
var User = require('../models/user');
var Dayword = require('../models/dayword');


//增加每日一词
router.post("/daywordAdd", function (req,res,next) {
    var daywordDoc = new Dayword({dayword:req.body.dayword,
        content:req.body.content,
        date:req.body.date,
        manager:req.cookies.userName});
    if(req.cookies.userName){
        User.findOne({userName:req.cookies.userName},function(err,userDoc){
            if(err){
                res.json({
                    status:"1",
                    msg:err.message
                });
              }else{
                if(userDoc){
                    var dayword1 = '';
                    Dayword.findOne({dayword:req.body.dayword},function(err1,dayworddoc){
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err.message
                            });
                          }else{
                            dayword1=dayworddoc.dayword;
                          }
                    });
                    if(dayword1){
                        res.json({
                            status:'2',
                            msg:'该单词添加重复',
                            result:'fail'
                          });
                    }else{
                        //检查前端发送的单词是否存在于words表中
                        Word.findOne({word:req.body.dayword},function(err1,wordDoc){
                            if(err1){
                                res.json({
                                    status:"1",//报错
                                    msg:err1.message});
                            }else{
                                // console.log("wordDoc1:\n"+wordDoc);//控制台输出查询结果
                                if(wordDoc){//词库存在该单词
                                    
                                    daywordDoc.save(function(err0,doc0){
                                        if(err0){
                                            res.json({
                                                status:"1",
                                                msg:err0,
                                                result:err0
                                               });
                                       }else{
                                            // console.log("doc0:"+doc0);
                                            res.json({
                                                status:"0",
                                                msg:"suc",
                                                result:doc0
                                            });
                                       }
                                    });
                                }else{
                                    res.json({
                                        status:"3",
                                        msg:"fail",
                                        result:"词库中没有这个单词"
                                        
                                       });
                                }
                            }
                        });
                        
                    }
                }else{
                    res.json({
                        status:"1000",
                        msg:"fail",
                        result:'该用户未注册'
                    });
                }
              }
        });

    }else{
        res.json({
            status:"1001",
            msg:"fail",
            result:'未登录'
        });
    }
});
//加入到收藏
router.post("/addCollection", function (req,res,next) {
    var coword = req.body.word;
    if(req.cookies.userName){
        User.findOne({userName:req.cookies.userName},function(err,userDoc){
            if(err){
                res.json({
                    status:"1",
                    msg:err.message
                });
              }else{
                if(userDoc){
                    var collectionsItem = '';
                    userDoc.collectionList.forEach(function(item){
                        if(item.word==coword){//要收藏的单词已经在该用户的收藏表中
                            collectionsItem=item;//将收藏表中的单词放进collectionsItem，使其非空，标志已被收藏过
                        }
                    });
                    if(collectionsItem){//collectionsItem不为空，说明已被收藏
                        res.json({
                            status:'2',
                            msg:'该单词已收藏',
                            result:'fail'
                          });
                    }else{//collectionsItem为空，说明为被收藏
                        //检查前端发送的单词是否存在于words表中
                        Word.findOne({word:coword},function(err1,wordDoc){
                            if(err1){
                                res.json({
                                    status:"1",//报错
                                    msg:err1.message});
                            }else{
                                // console.log("wordDoc1:\n"+wordDoc);//控制台输出查询结果
                                if(wordDoc){//词库存在该单词
                                    userDoc.collectionList.push(wordDoc);
                                    userDoc.save(function(err0,doc0){
                                        if(err0){
                                            res.json({
                                                status:"1",
                                                msg:err0,
                                                result:err0
                                               });
                                       }else{
                                            // console.log("doc0:"+doc0);
                                            res.json({
                                                status:"0",
                                                msg:"suc",
                                                result:
                                                {wordDoc:wordDoc,
                                                userDoc:userDoc}
                                               });
                                       }
                                    });
                                }
                            }
                        });
                        
                    }
                }else{
                    res.json({
                        status:"1000",
                        msg:"fail",
                        result:'该用户未注册'
                    });
                }
              }
        });

    }else{
        res.json({
            status:"1001",
            msg:"fail",
            result:'未登录'
        });
    }
});

//根据word查询翻译信息
router.post("/transWord", function (req,res,next) {
  var word = req.body.word;
  Word.findOne({word:word}, function (err,doc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        });
    }else{
        if(doc){
            res.json({
                status:'0',
                msg:'查询成功',
                result:{
                  doc:doc
                }
            });
        }else{
            res.json({
                status:"2",
                msg:"词条信息不存在！"
            });
        }
    }
});
});

//查询每日一词列表数据
router.get("/getDayword", function (req,res,next) {
    Dayword.find({}).sort({'_id':-1}).limit(1).exec(function(err,doc){
        if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:'出错了！'








 


            });
          }else{
              if(doc){
                res.json({
                  status:'0',
                  msg:'查询成功',
                  result:doc
                });
              }
          }
    });
    // Dayword.find(function (err,doc) {
    //     if(err){
    //       res.json({
    //         status:'1',
    //         msg:err.message,
    //         result:'出错了！'
    //       });
    //     }else{
    //         if(doc){
    //           res.json({
    //             status:'0',
    //             msg:'查询成功',
    //             result:doc
    //           });
    //         }
    //     }
    // });
  });

  //查询dayword列表
router.get("/daywordList", function (req,res,next) {
    if(req.cookies.userName){
        Dayword.find(function (err,doc) {
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
                  daywordslist:doc
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

  //删除dayword
router.post("/daywordDel", function (req,res,next) {
    var delWord = req.body.dayword;
    
    console.log(delWord);
    Dayword.remove({dayword:delWord}, function (err) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:'删除失败！'
        });
      }else{
        res.json({
          status:'0',
          msg:delWord+"has been delete.",
          result:'succuss'
        });
      }
    });
  });

module.exports = router;
