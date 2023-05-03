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
