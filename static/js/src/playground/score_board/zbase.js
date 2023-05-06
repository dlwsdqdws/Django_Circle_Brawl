class ScoreBoard extends BallGameObject{
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.state = null; // win or lose

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/lose_logo.png";
    }

    start(){
        this.win();
    }

    win(){
        this.state = "win";
    }

    lose(){
        this.state = "lose";
    }

    update(){
        this.render();
    }

    render(){
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
        else if (this.state === "lose"){
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
