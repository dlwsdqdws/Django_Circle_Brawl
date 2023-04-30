export class BallGame {
    constructor(id) {
        this.is = id;
        this.$ball_game = $('#' + id);
        // this.menu = new BallGameMenu(this);
        this.playground = new BallGamePlayground(this);
    }

    start(){

    }
}
