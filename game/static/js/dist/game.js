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
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
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

        this.uuid = this.create_uuid();  // unique identifier uid
    }

    create_uuid(){
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
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
        this.$canvas = $(`<canvas tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){
        this.$canvas.focus();
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
class NoticeBoard extends BallGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "Ready：0 Player(s)";
    }

    start(){
    }

    update(){
        this.render();
    }

    write(text){
        this.text = text;
    }

    render(){
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
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
    constructor(playground, x, y, radius, color, speed, character, username, photo){
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
        this.character = character;
        this.username = username;
        this.photo = photo;
        // float computing
        this.eps = 0.01;

        this.cur_skill = null;

        this.fireballs = [];

        // AI attack coll down time
        this.spent_time = 0;

        // this.dead = false;

        if(this.character !== "robot"){
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }

        if (this.character === "me") {
            // skill fire_ball CD 3s
            this.fireball_coldtime = 3;
            this.fireball_img = new Image();
            this.fireball_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/fire_balll.png";

            // flash
            this.flash_coldtime = 5;
            this.flash_img = new Image();
            this.flash_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/blink.png";

            // shield
            this.shield_coldtime = 10;
            this.shield_img = new Image();
            this.shield_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/shield.png";
        }
    }

    start(){
        this.playground.player_count ++ ;
        this.playground.notice_board.write("Ready：" + this.playground.player_count + " Player(s)");

        if (this.playground.player_count >= 3) {
            // multi game start
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting!!!");
        }

        // this.dead = false;
        if(this.character === "me"){
            // change position via mouse
            this.add_listening_events();
        }
        else if(this.character === "robot"){
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
            if (outer.playground.state !== "fighting"){
                // cannot move before game starts
                return false;
            }
            const rect = outer.ctx.canvas.getBoundingClientRect();
            // left-click:1 wheel:2 right-click:3
            if (e.which === 3) {
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx, ty);
                if (outer.playground.mode === "multi mode"){
                    // broadcast postion
                    outer.playground.mps.send_move_to(tx, ty);
                }
            }
            else if (e.which === 1) {
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    if(outer.fireball_coldtime >= outer.eps){
                        return false;
                    }
                    let fireball = outer.shoot_fireball(tx, ty);

                    if (outer.playground.mode === "multi mode"){
                        // broadcast
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                    outer.fireball_coldtime = 3;
                }
                else if (outer.cur_skill === "flash"){
                    if(outer.flash_codetime >= outer.eps){
                        return false;
                    }
                    
                    outer.flash(tx, ty);
                    if (outer.playground.mode === "multi mode"){
                        // broadcast
                        outer.playground.mps.send_flash(tx, ty);
                    }
                }
                else if (outer.cur_skill === "shield"){
                    if (outer.shield_coldtime >= outer.eps){
                        return false;
                    }
                    outer.shoot_shield();

                    if(outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_shoot_shield();
                    }
                }
                outer.cur_skill = null;
            }
        });

        this.playground.game_map.$canvas.keydown(function(e) {
            if (outer.playground.state !== "fighting") {
                // cannot attack before game starts
                return true;
            }

            if (e.which === 81) {
                // keycode 81 = 'Q' in keyboard
                if (outer.fireball_coldtime > outer.eps) return true;
                outer.cur_skill = "fireball";
                return false;
            }
            else if (e.which === 70) {
                // keycode 70 = 'F' in keyboard
                if (outer.flash_coldtime >= outer.eps) return true;
                outer.cur_skill = "flash";
                return false;
            }
            else if (e.which === 83){
                // keycode 83 = 'S' in keyboard
                if (outer.shield_coldtime >= outer.eps) return true;
                outer.cur_skill = "shield";
                return false;
            }
        });
    }

    shoot_shield(){
        let x = this.x;
        let y = this.y;
        let radius = this.radius * 1.3;
        let vr = 1.2;
        let speed =  0.045;
        let last_radius = this.radius * 2;
        let color = this.color;
        new Shield(this.playground, this, x, y, radius, vr, speed, last_radius, color);

        this.shield_coldtime = 10;
        // stop last move in shield
        this.move_length = 0;
    }

    shoot_fireball(tx, ty){
        // if(this.dead) return false;
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
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.fireballs.push(fireball);
        this.playground.bullets.push(fireball);
        return fireball;
    }

    destroy_fireball(uuid){
        for (let i = 0; i < this.fireballs.length; i ++ ) {
            let fireball = this.fireballs[i];
            if (fireball.uuid == uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    flash(tx, ty){
        let d = this.get_dist(this.x, this.y, tx, ty);

        // max_flash_dist = 0.4 * height
        d = Math.min(d, 0.4);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.flash_coldtime = 5;

        // stop last move when finishing flash
        this.move_length = 0;
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
            // this.dead = true;
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

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        // Forcibly update position when being attacked
        // correct accumulated position errors.
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
    }

    update(){
        this.spent_time += this.timedelta / 1000;

        if (this.character === "me" && this.playground.state === "fighting"){
            // player only updates its own CD
            this.update_coldtime();
        }

        this.update_move();
        this.render();
    }

    update_coldtime() {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(0, this.fireball_coldtime);

        this.flash_coldtime -= this.timedelta / 1000;
        this.flash_coldtime = Math.max(this.flash_coldtime, 0);

        this.shield_coldtime -= this.timedelta / 1000;
        this.shield_coldtime = Math.max(this.shield_coldtime, 0);
    }

    update_move(){
        // this.spent_time += this.timedelta / 1000;
        if (this.character === "robot" && this.spent_time > 5 ){
            if (Math.random() * 200 < 1){
                let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.2;
                let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.2;
                this.shoot_fireball(tx, ty);
            }
            if (Math.random() * 1000 < 1){
                this.shoot_shield();
            }
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

                if(this.character === "robot"){
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
        if(this.character !== "robot"){
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

        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime() {
        let scale = this.playground.scale;
        // skill image : right bottom
        let x = 1.5, y = 0.9, r = 0.04;

        // render fireball image
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // render fireball CD reminder
        if (this.fireball_coldtime >= this.eps) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(169, 169, 169, 0.6)";
            this.ctx.fill();
        }

        x = 1.62, y = 0.9, r = 0.04;

        // render flash image
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.flash_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // render flash CD reminder
        if (this.flash_coldtime >= this.eps){
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.flash_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(169, 169, 169, 0.6)";
            this.ctx.fill();
        }

        x = 1.38, y = 0.9, r = 0.04;

        // render shield image
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.shield_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // render shield CD reminder
        if (this.shield_coldtime >= this.eps){
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.shield_coldtime / 10) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(169, 169, 169, 0.6)";
            this.ctx.fill();
        }
    }

    on_destroy(){
        if (this.character === "me"){
            this.playground.state = "over";
        }


        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
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

        this.update_move();

        if (this.player.character !== "enemy"){
            this.update_attack();
        }
       
        this.render();
    }

    update_move(){
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack(){
        // collision detection
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                // cannot hurt myself
                this.attack(player);
                break;
            }
        }
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

        if (this.playground.mode === "multi mode") {
            // broadcast attack
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }

    render(){
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destory(){
        for(let i=0;i<this.playground.bullets.length;i++){
            if(this.playground.bullets[i] === this){
                this.playground.bullets.splice(i,1);
                break;
            }
        }

        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i ++ ) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}
class Shield extends BallGameObject {
  constructor(playground, player, x, y, radius, vr, speed, last_radius, color) {
    super();
    this.playground = playground;
    this.ctx = this.playground.game_map.ctx;
    this.player = player;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vr = vr;
    this.speed = speed;
    this.last_radius = last_radius;
    this.color = color;

    // lasts for 3 seconds
    this.continue_time = 3;
  }

  start() {}

  get_dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  is_collision(fireball) {
    let dist = this.get_dist(this.x, this.y, fireball.x, fireball.y);
    if (dist <= this.radius + fireball.radius) return true;
    else return false;
  }

  destroy_fireball() {
    for (let i = 0; i < this.playground.bullets.length; i++) {
      let fireball = this.playground.bullets[i];
      if (fireball.player === this.player) continue;
      if (this.is_collision(fireball)) {
        this.playground.bullets.splice(i, 1);
        fireball.destroy();
      }
    }
  }

  update() {
    if (this.radius >= this.last_radius) {
      if (this.continue_time > 0) {
        this.continue_time -= this.timedelta / 1000;
      } else {
        this.destroy();
      }
    }
    this.destroy_fireball();
    this.x = this.player.x;
    this.y = this.player.y;
    this.radius += (this.speed * this.timedelta) / 1000;
    this.speed *= this.vr;
    this.radius = Math.min(this.radius, this.last_radius);

    this.render();
  }

  render() {
    let scale = this.playground.scale;
    this.ctx.beginPath();
    this.ctx.arc(
      this.x * scale,
      this.y * scale,
      this.radius * scale,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
}
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app4415.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
    }

    start(){
        this.receive();
    }

    receive(){
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;

            // do not broadcast to self
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if(event === "move_to"){
                outer.receive_move_to(uuid, data.tx, data.ty);
            } 
            else if(event === "shoot_fireball"){
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if (event === "attack"){
                
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            }
            else if (event === "flash"){
                outer.receive_flash(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_shield"){
                outer.receive_shoot_shield(uuid);
            }
        };
    }

    send_create_player(username, photo){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'create_player',
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo){
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'move_to',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    get_player(uuid){
        let players = this.playground.players;
        for (let i = 0; i < players.length; i ++ ) {
            let player = players[i];
            if (player.uuid === uuid) return player;
        }
        return null;
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid){
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        
        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_flash(tx, ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "flash",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_flash(uuid, tx, ty){
        let player = this.get_player(uuid);
        if (player) {
            player.flash(tx, ty);
        }
    }

    send_shoot_shield(){
        let outer=this;
        this.ws.send(JSON.stringify({
            'event':'shoot_shield',
            'uuid':outer.uuid,
        }));
    }

    receive_shoot_shield(uuid){
        let player=this.get_player(uuid);
        player.shoot_shield();
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

    show(mode){
        let outer = this;
        
        // show playground page
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.resize();

        this.mode = mode;
        // player state machine: waiting -> fighting -> over
        this.state = "waiting";
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;

        this.bullets=[];
        this.players = []; 
       	
		// add players
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if(mode === "single mode"){
            // add AI enemies
            for (let i = 0; i < 5; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"));
            }
        }
        else if(mode === "multi mode"){
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function(){
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
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
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        }
        else{
            $.ajax({
                url: "https://app4415.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
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
