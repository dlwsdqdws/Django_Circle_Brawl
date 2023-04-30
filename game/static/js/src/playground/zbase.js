class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>playground</div>`);

        this.hide();
        this.root.$ball_game.append(this.$playground);

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

