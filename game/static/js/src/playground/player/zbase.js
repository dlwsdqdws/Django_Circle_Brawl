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
            this.shield_codetime = 10;
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
            // console.log("right click")
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
                    // console.log("flash");
                    if(outer.flash_codetime >= outer.eps){
                        return false;
                    }
                    
                    outer.flash(tx, ty);
                    if (outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_flash(tx, ty);
                    }
                }
                else if (outer.cur_skill === "shield"){
                    if (outer.shield_coldtime >= outer.eps){
                        return false;
                    }
                    outer.shoot_shield();
                }
                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
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
                // console.log("shield");
                if (outer.shield_coldtime >= outer.eps) return true;
                outer.cur_skill = "shield";
                return false;
            }
        });
    }

    shoot_shield(){
        let x=this.x;
        let y=this.y;
        let radius=this.radius * 1.5;
        let vr=1.2;
        let speed=(this.playground.height * 0.0045) / this.playground.scale;;
        let last_radius=this.radius * 2.5;
        let color=this.color;
        new Shield(this.playground,this,x,y,radius,vr,speed,last_radius,color);

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
        // console.log(tx, ty);
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
        if (this.character === "robot" && this.spent_time > 5 && Math.random() * 200 < 1){
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
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.shield_coldtime / 5) - Math.PI / 2, true);
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
