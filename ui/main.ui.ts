import {app,BrowserWindow, protocol} from 'electron';
import fs from 'fs';
import path from 'path';

import faceapi from '@vladmandic/face-api';

//faceapi.nets.ssdMobilenetv1.loadFromUri('/models')

function createWindow(){
        var window:BrowserWindow = new BrowserWindow({
            webPreferences:{
                nodeIntegration:true,
                contextIsolation: false,
                webgl:true
            },
            width:1280,
            height:720,
            title:"omnicar"
            
        });
        
        window.loadFile("./public/index.html");
        return window;
    //window.maximize();
    //remoteMain.enable(window.webContents);
}

app.whenReady().then(() =>{
    var window = createWindow();


})