class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground"></div>`);

        this.hide();
        this.root.$ball_game.append(this.$playground);

        this.start();
    }

    get_random_color(){
        let colors = ["blue", "red", "pink", "grey", "green", "Cyan", "AntiqueWhite", "Azure"];
        return colors[Math.floor(Math.random() * 8)];
    }

    start(){
        let outer = this;
        $(window).resize(function() {
            outer.resize();
        });
    }

    resize(){
        // 16 : 9
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;

        this.scale = this.height;

        if (this.game_map){
            this.game_map.resize();
        }
    }

    update(){

    }

    show(mode){
        // show playground page
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.resize();

        this.players = []; 
       	
		// add players
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if(mode === "single mode"){
            // add AI enemies
            for (let i = 0; i < 5; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"));
            }
        }
        else if(mode === "multi mode"){
        }
    }

    hide(){
        // hide playground page
        this.$playground.hide();
    }
}

