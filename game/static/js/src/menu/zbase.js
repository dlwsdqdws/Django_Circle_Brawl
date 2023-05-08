class BallGameMenu {
  constructor(root) {
    this.root = root;
    this.$menu = $(`
                <div class = "ball-game-menu">
                    <div class = "ball-game-menu-field">
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-single-mode">
                            Single
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-multi-mode">
                            Multiple
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-settings">
                            Settings
                        </div>
                    </div>
                </div>
            `);
    this.$menu.hide();
    this.root.$ball_game.append(this.$menu);
    this.$single_mode = this.$menu.find(
      ".ball-game-menu-field-item-single-mode"
    );
    this.$multi_mode = this.$menu.find(".ball-game-menu-field-item-multi-mode");
    this.$settings = this.$menu.find(".ball-game-menu-field-item-settings");

    this.start();
  }

  start() {
    this.add_listening_events();
  }

  add_listening_events() {
    let outer = this;
    this.$single_mode.click(function () {
      outer.hide();
      outer.root.playground.show("single mode");
    });
    this.$multi_mode.click(function () {
      outer.hide();
      outer.root.playground.show("multi mode");
    });
    this.$settings.click(function () {
      outer.root.settings.logout_on_remote();
    });
  }

  show() {
    // show menu page
    this.$menu.show();
  }

  hide() {
    // hide menu page
    this.$menu.hide();
  }
}
