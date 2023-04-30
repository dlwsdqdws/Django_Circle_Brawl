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
