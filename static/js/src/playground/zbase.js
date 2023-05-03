class BallGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ball-game-playground"></div>`);

        this.hide();

        this.start();
    }

    get_random_color(){
        let colors = ["blue", "red", "pink", "grey", "green", "Cyan", "AntiqueWhite", "Azure"];
        return colors[Math.floor(Math.random() * 8)];
    }

    start(){

    }

    update(){

    }

    show(){
        // show playground page
        this.$playground.show();

		this.root.$ball_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = []; 
       	
		// add players
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        // add AI enemies
        for (let i = 0; i < 5; i ++ ) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
    }

    hide(){
        // hide playground page
        this.$playground.hide();
    }
}

