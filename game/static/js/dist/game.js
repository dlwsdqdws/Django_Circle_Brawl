class BallGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
                <div class = "ball-game-menu">
                    <div class = "ball-game-menu-field">
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-single-mode">
                            Single
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-multi-mode">
                            Multiple
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-settings">
                            Settings
                        </div>
                    </div>
                </div>
            `);
        this.root.$ball_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ball-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ball-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ball-game-menu-field-item-settings');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi");
        });
        this.$settings.click(function(){console.log("click settings")});
    }

    show(){
        // show menu page
        this.$menu.show();
    }

    hide(){
        // hide menu page
        this.$menu.hide();
    }
}
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
class GameMap extends BallGameObject {
    constructor(playground){
        super();

        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){

    }

    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class Player extends BallGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.radius = radius;
        this.is_me = is_me;
        // float computing
        this.eps = 0.1;
    }

    start(){

    }

    update(){
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy(){

    }
}
class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground">

            </div>`);

        // this.hide();
        this.root.$ball_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        this.start();
    }

    start(){

    }

    update(){

    }

    show(){
        // show playground page
        this.$playground.show();
    }

    hide(){
        // hide playground page
        this.$playground.hide();
    }
}

export class BallGame {
    constructor(id) {
        this.is = id;
        this.$ball_game = $('#' + id);
        // this.menu = new BallGameMenu(this);
        this.playground = new BallGamePlayground(this);
    }

    start(){

    }
}
