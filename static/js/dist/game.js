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
class Particle extends BallGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_len){
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_len = move_len;
        this.friction = 0.9;
        this.eps = 1;
    }

    start(){

    }

    update(){
        if (this.move_len < this.eps || this.speed < this.eps){
            this.destroy();
            return false;
        }
        else{
            let moved = Math.min(this.move_len, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.speed *= this.friction;
            this.move_len -= moved;
        }

        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends BallGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;  //remained distance to move
        this.color = color;
        this.speed = speed;
        this.damage_vx = 0;
        this.damage_vy = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
        this.radius = radius;
        this.is_me = is_me;
        // float computing
        this.eps = 0.1;

        this.cur_skill = null;

        // AI attack coll down time
        this.spent_time = 0;
    }

    start(){
        if(this.is_me){
            // change position via mouse
            this.add_listening_events();
        }else{
            // AI enemy : randonmly move
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events(){
        let outer = this;
        // disable default mouse right click event
        // this.playground.game_map.$canvas.on("contextmenu", function() {
        //     return false;
        // });
        this.playground.game_map.$canvas.on("mousedown", function(event){
            if (event.button === 2){
                event.preventDefault();
                return false;
            }
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            // left-click:1 wheel:2 right-click:3
            if (e.which === 3) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }
            else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }
                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if (e.which === 81) {
                // keycode 81 = 'Q' in keyboard
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        // speed should not be binded with px
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1.0;
        // deduct 20% player's energy
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
    }

    get_dist (x1, y1, x2, y2) {
        // calculate Euclidean distance
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty){
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage){
        // particle effect
        for (let i = 0; i < 20 + Math.random() * 5; i ++ ) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = 2 * Math.PI * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_len = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_len);
        }

        this.radius -= damage;
        if (this.radius < 10) {
            // dead
            this.destroy();
            return false;
        }

        // repel
        this.damage_vx = Math.cos(angle);
        this.damage_vy = Math.sin(angle);
        this.damage_speed = damage * 100;

        // Movement speed is halved when hit
        this.speed *= 1.25;
    }

    update(){
        this.spent_time += this.timedelta / 1000;
        if (!this.is_me && this.spent_time > 5 && Math.random() * 200 < 1){
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.2;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.2;
            this.shoot_fireball(tx, ty);
        }

        if (this.damage_speed > 10){
            this.vx = 0;
            this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_vx * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_vy * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        else{
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = 0;
                this.vy = 0;

                if(!this.is_me){
                    // AI enemy : never stop
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else{
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy(){
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
class FireBall extends BallGameObject{
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.player = player;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start(){

    }

    update(){
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        else{
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;

            // collision detection
            for (let i = 0; i < this.playground.players.length; i ++ ) {
                let player = this.playground.players[i];
                if (this.player !== player && this.is_collision(player)) {
                    // cannot hurt myself
                    this.attack(player);
                }
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player){
        // collision : |c2 - c1| < r1+r2
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < (this.radius + player.radius)){
            return true;
        }
        return false;
    }

    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground"></div>`);

        this.hide();

        this.start();
    }

    get_random_color(){
        let colors = ["blue", "red", "pink", "grey", "green", "Cyan", "AntiqueWhite", "Azure"];
        return colors[Math.floor(Math.random() * 8)];
    }

    start(){

    }

    update(){

    }

    show(){
        // show playground page
        this.$playground.show();

		this.root.$ball_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = []; 
       	
		// add players
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        // add AI enemies
        for (let i = 0; i < 5; i ++ ) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
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
        this.menu = new BallGameMenu(this);
        this.playground = new BallGamePlayground(this);
    }

    start(){

    }
}
