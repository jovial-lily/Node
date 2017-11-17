module.exports = function ( app ) {
    //查看购物车商品
    app.get('/cart', function(req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:"
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id,"cStatus":false}, function (error, docs) {
                res.render('cart',{carts:docs});
            });
        }
    });
    //添加购物车商品
    app.get("/addToCart/:id", function(req, res) {
       //req.params.id 获取商品ID号
        if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:"
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,doc){
                //商品已存在 +1
                if(doc){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 }},function(error,doc){
                        //成功返回1  失败返回0
                        if(doc > 0){
                            res.redirect('/home');
                        }
                    });
                //商品未存在，添加
                }else{
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc) {
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cPrice: doc.price,
                                cImgSrc: doc.imgSrc,
                                cQuantity : 1
                            },function(error,doc){
                                if(doc){
                                    res.redirect('/home');
                                }
                            });
                        } else {

                        }
                    });
                }
            });
        }
    });

    //删除购物车商品
    app.get("/delFromCart/:id", function(req, res) {
        //req.params.id 获取商品ID号
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
    });

	 //购物车商品数量增减
    app.post("/cart/goodsnum",function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id":req.params.id},{$set : { cQuantity : req.params.cnum}},function(error,doc){
            //更新成功返回1  失败返回0
            if(doc > 0){
                 res.redirect('/cart');
            }else{
				console.log("增减失败");
			}
        });
		
    });

    //购物车结算
    app.post("/cart/clearing",function(req,res){
        //var Cart = global.dbHelper.getModel('cart');
       // Cart.update({"_id":req.body.cid},{$set : { cQuantity : req.body.cnum,cStatus:true }},function(error,doc){
       //     //更新成功返回1  失败返回0
       //     if(doc > 0){
       //         res.send(200);
      //      }
      //  });
		 var Cart = global.dbHelper.getModel('cart');
        Cart.remove({},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
    });



app.get('/getuserinfo', function (req, res) {
	var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
	var code,msg;

        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                code = 500;
                msg = "存在数据库";
            } else if (!doc) {
				code = 404;
                msg = "用户名不存在！";
               
            } 
			// 输出 JSON 格式
			   var response = {
				   "code":code,
			       "uname":uname,
			       "msg":msg
			   };
				console.log(response);
				res.end(JSON.stringify(response),'utf-8');

        });
 
	});
}

