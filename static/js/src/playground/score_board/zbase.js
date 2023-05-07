class ScoreBoard extends BallGameObject{
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.state = null; // win or lose

        this.win_img = new Image();
        this.win_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/win_logo.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://circle-brawl.oss-cn-hongkong.aliyuncs.com/lose_logo.png";
    }

    start(){
        
    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        let clickCount = 0;
        $canvas.on('click', function() {
            clickCount++;
            if (clickCount === 1) {
                outer.state = "hide";
            }
            else if (clickCount === 2) {
                outer.playground.hide();
                outer.playground.root.menu.show();
                clickCount = 0;
            }
        });
    }

    win(){
        this.state = "win";

        let outer = this;
        // show image for at least 1 second
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    lose(){
        this.state = "lose";

        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }

    late_update(){
        this.render();
    }

    render(){
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
        else if (this.state === "lose"){
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if (this.state === "hide"){
            // hide score board
            // this.ctx.clearRect(this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
