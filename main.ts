import { BluetoothHandler } from "./bluetooth/BluetoothHandler";
import readline from 'readline';
import http from 'http';
import { Server } from "socket.io";
import fs from 'fs/promises';
var tf = require('@tensorflow/tfjs-node');
const server = http.createServer();
const io = new Server(server);
var faceapi = require('@vladmandic/face-api');

var netoptions:any;
async function loadModels(){
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + `/../models`);
   netoptions =  new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1, maxResults:5 });

}

loadModels();

async function detectFace(buf:Buffer){
    var img = tf.node.decodeImage(buf,3);
    var expandimg = img.expandDims(0);

    var result = await faceapi.detectAllFaces(expandimg,netoptions);

    return result;
}



var bluetoothhandle = new BluetoothHandler();

var lineinterface = readline.createInterface({input:process.stdin,output:process.stdout});

lineinterface.on('line', line =>{
    if(line == "f" || line == "forward"){
        bluetoothhandle.MoveForward();
    }

    if(line == "b" || line == "backward"){
        bluetoothhandle.MoveBackwards();
    }

    if(line == "r" || line == "right"){
        bluetoothhandle.TurnRight();
    }

    if(line == "l" || line == "left"){
        bluetoothhandle.TurnLeft();
    }

    if(line == "c" || line == "center"){
        bluetoothhandle.CenterCar();
    }
});


var recentMovement = false;
io.on('connection', client =>{
    console.log("connected")
    client.on('videostream',stream =>{
       

        //fs.writeFile(__dirname +`/../out/${i}.png`,trueb64,'base64');
        var boxdata = detectFace(Buffer.from(stream.frame.replace(/^data:image\/png;base64,/, ""),'base64')).then(data =>{
            if(data[0]){
                if(data[0]._box._y > 300&& !recentMovement){
                    recentMovement = true;
                    setTimeout(() =>{
                        recentMovement = false;
                    },1000)
                    //console.log("yes ",i);
                    console.log("forward")
                    bluetoothhandle.MoveForward();
                }
                
                else if(data[0]._box._y < 40 && !recentMovement){
                    recentMovement = true;
                    setTimeout(() =>{
                        recentMovement = false;
                    },1000)
                    console.log("backwards")
                    bluetoothhandle.MoveBackwards();
                }
                io.emit("boxdata",data[0]._box);
            }
            return;
        });

        return;
        //console.log(trueb64);
    });

    client.on("disconnect",function(socket){
        console.log("client disconnected");
    });
})


server.listen(8080);