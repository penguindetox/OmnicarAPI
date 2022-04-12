import noble from '@abandonware/noble';
import readline from 'readline';

export class BluetoothHandler{

    public characteristics: noble.Characteristic | undefined;
    constructor(){


        noble.on('stateChange', async (state) => {
            if (state === 'poweredOn') {
              await noble.startScanningAsync([], false);
            }
        });
      
        noble.on('discover', async (peripheral) => {
          //console.log(peripheral.advertisement.localName);
          if(peripheral.advertisement.localName == "DSD TECH"){
              console.log(peripheral.id);
              await peripheral.connectAsync();
                this.characteristics = (await peripheral.discoverAllServicesAndCharacteristicsAsync()).characteristics[0];   
                peripheral.on('disconnect',this.disconnect);
              //console.log(buf.toString());
          }
        });

       
    }

    public async disconnect(error:string){
        await noble.startScanningAsync();
    }

    public async MoveForward(){
        if(this.characteristics){
            this.characteristics.write(Buffer.from("64","hex"),true);
        }
        
    }

    public async MoveBackwards(){
        if(this.characteristics){
            this.characteristics.write(Buffer.from("96","hex"),true);
        }
    }

    public async CenterCar(){
        if(this.characteristics){
            this.characteristics.write(Buffer.from("FF","hex"),true);
        }
    }

    public async TurnLeft(){
        if(this.characteristics){
            this.characteristics.write(Buffer.from("C8","hex"),true);
        }
    }

    public async TurnRight(){
        if(this.characteristics){
            this.characteristics.write(Buffer.from("FA","hex"),true);
        }
    }
}



