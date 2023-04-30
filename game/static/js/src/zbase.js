class BallGame {
    constructor(id) {
        this.is = id;
        this.$ball_game = $('#' + id);
        this.menu = new BallGameMenu(this);
    }
}
