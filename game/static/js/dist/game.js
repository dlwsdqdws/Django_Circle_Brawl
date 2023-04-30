class BallGameMenu{
    constructor(root){
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
        this.root.$ball_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ball-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ball-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ball-game-menu-field-item-settings');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            console.log("click single");
        });
        this.$multi_mode.click(function(){
            console.log("click multi");
        });
        this.$settings.click(function(){console.log("click settings")});
    }

    show(){
        // show menu page
        this.$menu.show();
    }

    hide(){
        // hide menu page
        this.$menu.hide();
    }
}
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

class BallGame {
    constructor(id) {
        this.is = id;
        this.$ball_game = $('#' + id);
        this.menu = new BallGameMenu(this);
        this.playground = new BallGamePlayground(this);
    }

    start(){

    }
}
