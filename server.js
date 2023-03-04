var mysql = require("mysql")
var express = require("express")
var mqtt = require("mqtt")

var client = mqtt.connect('mqtt://172.20.10.8')
//192.168.0.7

var app = express()
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:"",
    database: "wsn"
});

con.connect(function(err){
    if(err) throw err;
    console.log("mysql connected")
})                                     

app.use('/public', express.static('public'));
app.set("view engine", "ejs")
app.set("views","./views")

var server = require("http").Server(app);   
var io = require("socket.io")(server);
server.listen(3003);

app.get("/",function(req,res){
    res.render("main")
})                                       


client.on('connect',function(){
    console.log("mqtt connected")
    client.subscribe("sensor")
})                

client.on("message",function(topic,message,h){
    const data = JSON.parse(message)
    var state_1 = data.state_1             
    var state_2 = data.state_2
    var temp_data =  data.temperature//.toFixed(2)
    var humi_data =  data.humidity.toFixed(2)
    var light_data = data.light.toFixed(2)
    
    var sql = "insert into data_sensors(temp,humi,light) value ( "+temp_data+" , "+humi_data+" ,"+light_data+")" 
    con.query(sql,function(err,result){
        if (err) throw err
         console.log( " temp: "+temp_data+" ,humi: "+humi_data+", light: "+light_data+" ")
    })
      
// pub tất cả gtri lên từng kênh
    io.emit("temp",temp_data)
    io.emit("humi",humi_data)
    io.emit("light",light_data)
    io.emit("relay_1",state_1)
    io.emit("relay_2",state_2)
})



io.on("connection",function(socket){
    console.log('user ' + socket.id + " connected")
    socket.on("control_relay_1",function(state){
        if(state == "1"){
            client.publish("relay_1","1")
            //con.query("insert into relay(relay_id, state) value ( 'relay_1' , 'ON') " )
        }else{
            client.publish("relay_1","0")
            //con.query("insert into relay(relay_id, state) value ( 'relay_1' , 'OFF') " )
        }
    })

    socket.on("control_relay_2",function(state2){
        if(state2 == "1"){
            client.publish("relay_2","1")
            //con.query("insert into relay(relay_id, state) value ( 'relay_2' , 'ON') " )
        }else{
            client.publish("relay_2","0")
            //con.query("insert into relay(relay_id, state) value ( 'relay_2' , 'OFF') " )
        }
    })
})
