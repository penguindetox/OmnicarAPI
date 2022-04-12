import { WebSocketServer } from "ws";

export class ImageServer{
    server:WebSocketServer;

    constructor(){
        this.server = new WebSocketServer({'port':4444});
    }

    public async run(){
        this.server.on('connection',async function(socket,req){

        });
    }
}