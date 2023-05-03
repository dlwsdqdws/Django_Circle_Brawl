let Ball_Game_Objects = []

class BallGameObject{
    constructor(){
        Ball_Game_Objects.push(this);
        
        this.has_called_start = false;
        this.timedelta = 0;   // time difference to last frame
    }

    start(){

    }

    update(){

    }

    on_destroy(){

    }

    destroy(){
        this.on_destroy();

        for(let i = 0; i < Ball_Game_Objects.length; i++){
            if(Ball_Game_Objects[i] === this){
                Ball_Game_Objects.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let Ball_Game_Animation = function(timestamp) {
    
    for (let i = 0; i < Ball_Game_Objects.length; i ++ ) {
        let obj = Ball_Game_Objects[i];
        if (!obj.has_called_start) { 
            obj.start();
            obj.has_called_start = true;
        }
        else {  
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

	last_timestamp = timestamp;
    requestAnimationFrame(Ball_Game_Animation);
}


requestAnimationFrame(Ball_Game_Animation);
