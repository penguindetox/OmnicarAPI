import noble from '@abandonware/noble';
import readline from 'readline';

export class BluetoothHandler{

    public characteristics: noble.Characteristic | undefined;
    constructor(){

        //start looking for the car bluetooth
        noble.on('stateChange', async (state) => {
            if (state === 'poweredOn') {
              await noble.startScanningAsync([], false);
            }
        });
        
        //get all discoverable periphrals, make sure to connect to the one in the car
        noble.on('discover', async (peripheral) => {
          if(peripheral.advertisement.localName == "DSD TECH"){
              console.log(peripheral.id);
              await peripheral.connectAsync();
              console.log("connected to the device");
                this.characteristics = (await peripheral.discoverAllServicesAndCharacteristicsAsync()).characteristics[0];   
                peripheral.on('disconnect',this.disconnect);
          }
        });

       
    }

    public async Init(){
        
    }

    public async disconnect(error:string){
        this.characteristics = undefined;
        console.log("disconnected from the device");
        await noble.startScanningAsync();
    }
    //Moves forward at max throttle for like a second i think(the torque is dependent on the battery voltage for some fucking reason)
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

    //Centering the car barely works
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



