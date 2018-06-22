var express=require('express');
var app=express();
var fs=require("fs");

//获取所有的商品
app.get('/items',function(req,res){
    fs.readFile( __dirname + "/" + "datbase.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data);
    });
})
//获取一个商品
app.get('/items/:id',function(req,res){
    fs.readFile(__dirname+'/'+"datbase.json",'utf8',function(err,data){
        data=JSON.parse(data);
       // console.log(data);
       // console.log("food"+req.params.id);
         var good=data["good"+req.params.id]
         console.log(good);
         res.end(JSON.stringify(good));
    })
})

//添加一个商品
var good={ 
    "good5":{ 
        "id": "ITEM000008",
        "name": "百事可乐",
        "unit": "瓶",
        "price": 3.00,
        "barcodes":"买二送一"
    }    
}

app.post('/items',function(err,res){
    fs.readFile(__dirname+"/"+"datbase.json","utf8",function(err,data){
        data=JSON.parse(data);
        data['good5']=good['good5'];
        console.log(data);
        res.end(JSON.stringify(data));  
    })
})
//删除商品
app.delete('/items/:id',function(req,res){
    fs.readFile(__dirname+'/'+"datbase.json",'utf8',function(err,data){
        data=JSON.parse(data);
        delete data["good"+req.params.id];
        console.log(data);
        //res.end(JSON.stringify(data));
        
    })
})
//更新数据
var good1={ 
    "good4":{ 
        "id": "ITEM000003",
        "name": "新的荔枝",
        "unit": "斤",
        "price": 15,
        "barcodes":"无"
    }    
}

app.put('/items/:id',function(req,res){
    fs.readFile(__dirname+'/'+"datbase.json",'utf8',function(err,data){
        data=JSON.parse(data);
        data['good'+req.params.id]=good1['good4'];
        console.log(data);
        res.end(JSON.stringify(data));  

    })
})

//处理商品条形码
app.get('/buy',function(req,res){
    fs.readFile(__dirname+'/'+"datbase.json",'utf8',function(err,data){
        fs.readFile(__dirname+'/'+"buy_good.json",'utf8',function(err,data1){
            data1=JSON.parse(data1);
            data=JSON.parse(data);
           let str="***<没钱赚商店>收据***"+"\n";;
           let count=0;
           let countzong=0;
          for(let i in data){
              for(let j in data1){
                  if(data[i]["id"]==data1[j]["id"]){
                      if(data1[j]["barcodes"]=="买二送一"){
                          data1[j]["count"]--;
                      str=str+`名称：${data1[j]["name"]},数量：${data1[j]["count"]}${data1[j]["unit"]},单价：${data1[j]["price"].toFixed(2)}（元），小计：`+(data1[j]["price"]*data1[j]["count"]).toFixed(2)+"（元）"+"\n";
                      count=count+1*data1[j]["price"];
                      countzong=countzong+data1[j]["price"]*data1[j]["count"];
                      }else{
                        countzong=countzong+data1[j]["price"]*data1[j]["count"];
                        str=str+`名称：${data1[j]["name"]},数量：${data1[j]["count"]}${data1[j]["unit"]},单价：${data1[j]["price"]}（元），小计：`+(data1[j]["price"]*data1[j]["count"]).toFixed(2)+"（元）"+"\n";
                      }
                  }
              }
          }
          str=str+'----------------------\n'+
          '总计:'+countzong.toFixed(2)+'(元)\n'+
          '节省:'+count.toFixed(2)+'(元)\n'+
          '**********************';
          console.log(str);
          res.end(str);  
        })
    })

})

var server=app.listen(8081,function(){
    var host=server.address().address
    var port=server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})