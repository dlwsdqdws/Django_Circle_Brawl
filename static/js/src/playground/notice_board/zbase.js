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
