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

    create_uuid(){
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }

        return res;
    }

    start(){
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function() {
            outer.resize();
        });

        if (this.root.AcWingOS){
            outer.root.AcWingOS.api.window.on_close(function() {
                $(window).off(`resize.${uuid}`);
            });
        }
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
        let outer = this;
        
        // show playground page
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.resize();

        this.mode = mode;
        // player state machine: waiting -> fighting -> over
        this.state = "waiting";
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        this.player_count = 0;

        this.bullets=[];
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
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function(){
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }
    }

    hide(){
        // hide playground page
        this.$playground.hide();
    }
}

