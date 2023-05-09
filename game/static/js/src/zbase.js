export class BallGame {
  constructor(id, AcWingOS, access, refresh) {
    this.is = id;
    this.$ball_game = $("#" + id);

    this.AcWingOS = AcWingOS;
    this.access = access;
    this.refresh = refresh;

    this.settings = new Settings(this);
    this.menu = new BallGameMenu(this);
    this.playground = new BallGamePlayground(this);

    this.start();
  }

  start() {}
}
