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
        this.$menu.hide();
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
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
        });
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

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
        this.eps = 0.01;
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
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
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
        this.eps = 0.01;

        this.cur_skill = null;

        // AI attack coll down time
        this.spent_time = 0;

        this.dead = false;

		if(this.is_me){
        	this.img = new Image();
        	this.img.src = this.playground.root.settings.photo;
		}
    }

    start(){
        this.dead = false;
        if(this.is_me){
            // change position via mouse
            this.add_listening_events();
        }else{
            // AI enemy : randonmly move
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events(){
        let outer = this;
        // disable default mouse right click event
        this.playground.game_map.$canvas.on("contextmenu", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        // this.playground.game_map.$canvas.on("mousedown", function(event){
        //     if (event.button === 2){
        //         event.preventDefault();
        //         return false;
        //     }
        // });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            // left-click:1 wheel:2 right-click:3
            if (e.which === 3) {
                outer.move_to((e.clientX - rect.left) / outer.playground.scale, (e.clientY - rect.top) / outer.playground.scale);
            }
            else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball((e.clientX - rect.left) / outer.playground.scale, (e.clientY - rect.top) / outer.playground.scale);
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
        if(this.dead) return false;
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        // speed should not be binded with px
        let speed = 0.5;
        let move_length = 1.0;
        // deduct 20% player's energy
        let damage = 0.01;
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
        if (this.radius < this.eps) {
            // dead
            this.dead = true;
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
        this.update_move();
        this.render();
    }

    update_move(){
        this.spent_time += this.timedelta / 1000;
        if (!this.is_me && this.spent_time > 5 && Math.random() * 200 < 1){
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.2;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.2;
            this.shoot_fireball(tx, ty);
        }

        if (this.damage_speed > this.eps){
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
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
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
    }


    render(){
        let scale = this.playground.scale;
        if(this.is_me){
			this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        }
        else{
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
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
        this.eps = 0.01;
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
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground"></div>`);

        this.hide();
        this.root.$ball_game.append(this.$playground);

        this.start();
    }

    get_random_color(){
        let colors = ["blue", "red", "pink", "grey", "green", "Cyan", "AntiqueWhite", "Azure"];
        return colors[Math.floor(Math.random() * 8)];
    }

    start(){
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    resize(){
        // 16 : 9
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;

        this.scale = this.height;

        if (this.game_map){
            this.game_map.resize();
        }
    }

    update(){

    }

    show(){
        // show playground page
        this.$playground.show();
        this.resize();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = []; 
       	
		// add players
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, true));

        // add AI enemies
        for (let i = 0; i < 5; i ++ ) {
            this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, false));
        }
    }

    hide(){
        // hide playground page
        this.$playground.hide();
    }
}

class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.username = "";
        this.photo = "";

        this.$settings = $(
            `
                <div class="ball-game-settings">
                    <div class="ball-game-settings-login">
                        <div class="ball-game-settings-title">Login</div>
                        <div class="ball-game-settings-username">
                            <div class="ball-game-settings-item">
                                <input type="text" placeholder="Please Enter Your Username">
                            </div>
                        </div>
                        <div class="ball-game-settings-password">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password">
                            </div>
                        </div>
                        <div class="ball-game-settings-submit">
                            <div class="ball-game-settings-item">
                                <button>Submit</button>
                            </div>
                        </div>
                        <div class="ball-game-settings-error-message"></div>
                        <div class="ball-game-settings-option">Register</div>
                        <br>
                        <div class="ball-game-settings-logo">
                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">
                            <br>
                            <div>Acwing Login</div>
                        </div>
                    </div>
                    <div class="ball-game-settings-register">
                        <div class="ball-game-settings-title">Register</div>
                        <div class="ball-game-settings-username">
                            <div class="ball-game-settings-item">
                                <input type="text" placeholder="Please Enter Your Username">
                            </div>
                        </div>
                        <div class="ball-game-settings-password ball-game-settings-password-first">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password">
                            </div>
                        </div>
                        <div class="ball-game-settings-password ball-game-settings-password-second">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password Again">
                            </div>
                        </div>
                        <div class="ball-game-settings-submit">
                            <div class="ball-game-settings-item">
                                <button>Submit</button>
                            </div>
                        </div>
                        <div class="ball-game-settings-error-message"></div>
                        <div class="ball-game-settings-option">Login</div>
                        <br>
                        <div class="ball-game-settings-logo">
                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">
                            <br>
                            <div>Acwing Login</div>
                        </div>
                    </div>
                </div>
            `
        );


        this.$login = this.$settings.find(".ball-game-settings-login");
        this.$login_username = this.$login.find(".ball-game-settings-username input");
        this.$login_password = this.$login.find(".ball-game-settings-password input");
        this.$login_submit = this.$login.find(".ball-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ball-game-settings-error-message");
        this.$login_register = this.$login.find(".ball-game-settings-option");
        this.$login.hide();

        this.$register = this.$settings.find(".ball-game-settings-register");
        this.$register_username = this.$register.find(".ball-game-settings-username input");
        this.$register_password = this.$register.find(".ball-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ball-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ball-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ball-game-settings-error-message");
        this.$register_login = this.$register.find(".ball-game-settings-option");
        this.$register.hide();

        this.$acw_login = this.$settings.find('.ball-game-settings-logo img'); 

        this.root.$ball_game.append(this.$settings);
        this.start();
    }

    start(){
        if (this.platform === "ACAPP"){
            this.getinfo_app();
        }
        else{
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events(){
        let outer = this;

        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acw_login.click(function() {
            outer.acw_login();
        });
    }

    acw_login(){
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/acw/web/apply_code/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    add_listening_events_login(){
        // jump to register page
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register(){
        // jump to login page
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    login_on_remote(){
        // login via server
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp){
                console.log(resp);
                if (resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote(){
        // register a user via server
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
                else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote(){
        // logout function only works on web-end
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }

    register(){
        // register page
        this.$login.hide();
        this.$register.show();
    }

    login(){
        // login page
        this.$register.hide();
        this.$login.show();
    }

    app_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
            console.log(resp);
            if (resp.result === "success"){
                outer.username = resp.username;
                outer.photo = resp.photo;
                // hide settings page, show menu page
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_app(){
        let outer = this;
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/acw/app/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.app_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }
                else{
                    outer.login();
                }
            }
        });
    }

    hide(){
        this.$settings.hide();
    }

    show(){
        this.$settings.show();
    }
}
export class BallGame {
    constructor(id, AcWingOS) {
        this.is = id;
        this.$ball_game = $('#' + id);

        this.AcWingOS = AcWingOS;

        this.settings = new Settings(this);
        this.menu = new BallGameMenu(this);
        this.playground = new BallGamePlayground(this);
    }

    start(){

    }
}
