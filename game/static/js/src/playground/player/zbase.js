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
        this.radius = radius;
        this.is_me = is_me;
        // float computing
        this.eps = 0.1;
    }

    start(){
        if(this.is_me){
            // change position via mouse
            this.add_listening_events();
        }
    }

    add_listening_events(){
        let outer = this;
        // disable default mouse right click event
        this.playground.game_map.$canvas.on("contextmenu", function() {
             return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            // left-click:1 wheel:2 right-click:3
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            }
        });
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

    update(){
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = 0;
            this.vy = 0;
        }
        else{
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
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

    }
}
