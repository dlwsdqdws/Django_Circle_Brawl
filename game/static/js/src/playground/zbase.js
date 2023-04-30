class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground">

            </div>`);

        // this.hide();
        this.root.$ball_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();

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

