class BallGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
                <div class = "ball-game-menu">
                    <div class = "ball-game-menu-field">
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-single">
                            Single
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-multi">
                            Multiple
                        </div><br>
                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-setting">
                            Settings
                        </div>
                    </div>
                </div>
            `);
        this.root.$ball_game.append(this.$menu);
        this.$single = this.$menu.find('.ball-game-menu-field-item-single');
        this.$multi = this.$menu.find('.ball-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.ball-game-menu-field-item-settings');
    }
}
