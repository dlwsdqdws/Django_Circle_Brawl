export class BallGame {
  constructor(id, AcWingOS, access, refresh) {
    this.is = id;
    this.$ball_game = $("#" + id);

    this.AcWingOS = AcWingOS;
    this.access = access;
    this.access_expires = new Date();
    this.refresh = refresh;
    this.refresh_expires = new Date();

    this.menu = new BallGameMenu(this);
    this.settings = new Settings(this);
    this.playground = new BallGamePlayground(this);

    this.start();
  }

  start() {}
}
