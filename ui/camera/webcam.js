const { writeFile } = require("fs");
var io = require('socket.io-client');



var onscreencanvas = document.getElementById('videocanvas');
//var faceapi = require('@vladmandic/face-api');
const videoElement = document.getElementById('videocam');
var boxpos = {_x:0,_y:0,_width:0,_height:0,center:0};

async function main(){
    var client = io('http://localhost:8080');

    //context.fillStyle = "red";

    client.on('boxdata',data =>{
        //context.clearRect(0,0,onscreencanvas.width,onscreencanvas.height);
        
        boxpos = data;

        boxpos["center"] = boxpos._y + boxpos._height / 2;
        console.log(boxpos);
    });

    
    var camdevicestream = await navigator.mediaDevices.getUserMedia({"audio":false,"video":{"frameRate":7,"facingMode":"user"}});
    videoElement.srcObject = camdevicestream;

    videoElement.onloadeddata = async () =>{
        videoElement.play();
        
        console.log(client)
    setInterval(async () =>{
        var frame = await getFrame(videoElement);
        client.emit('videostream',{frame});
        
        
    },1000 / 7)
        //await getFrame(videoElement);
       
    }


    DrawBox();
}

const context = onscreencanvas.getContext('2d');
function DrawBox(){
    
    context.clearRect(0,0,onscreencanvas.width,onscreencanvas.height);
    context.fillStyle = "red";
    context.strokeRect(parseInt(boxpos._x) / 2,parseInt(boxpos._y)/4,parseInt(boxpos._width) / 2,parseInt(boxpos._height) / 3);

    requestAnimationFrame(DrawBox);
}



function getFrame(video){
    var canvas = document.getElementById('offscreencanvas')

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/png');

    return data;
}

window.onload = main;