class BallGameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
            <div class="ball-game-rank">
                <div class="ball-game-rank-return ball-game-return">
                    Back
                </div>
                <div class="ball-game-rank-table">
                    <div class="ball-game-rank-tables">
                        <table class="table table-bordered table-hover ball-game-rank-table-score">
                            <thead class="ball-game-rank-table-score-thead">
                                <tr>
                                    <th>Ranking</th>
                                    <th>ID</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody class="ball-game-rank-table-score-tbody"></tbody>
                        </table>
                        <nav aria-label="Page navigation" class="ball-game-rank-table-time-page">
                            <ul class="pagination">
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        `);
        this.$rank.hide();
        this.root.$ball_game.append(this.$rank);
        this.$return = this.$rank.find('.ball-game-rank-return');

        this.$score_table = this.$rank.find('.ball-game-rank-table-score');
        this.$score_table_content = this.$rank.find('.ball-game-rank-table-score-tbody');

        this.$pagination = this.$rank.find('.pagination');
        this.page_num = 1;      // current page
        this.total_page = 0;    
        this.show_page = 3;     
        this.generic_page();  

        this.$time_table_page_btn = this.$rank.find('.ball-game-rank-table-time-page-num');
        this.$time_table_page_pre = this.$rank.find('.ball-game-rank-table-time-page-pre');
        this.$time_table_page_next = this.$rank.find('.ball-game-rank-table-time-page-next');

        this.start();

        this.score_player = null;
        this.score_player_time = null;
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$return.click(() => {
            this.hide();
            this.root.menu.show();
        });

        let outer = this;
        $.each(this.$time_table_page_btn, function() {
            $(this).click(() => {
                outer.page_num = parseInt($(this).text());
                outer.getinfo_rank_time();
            });
        });

        this.$time_table_page_pre.click(() => {
            this.page_num = this.page_num - 1;
            if(this.page_num === 0) this.page_num = this.total_page;
            this.getinfo_rank_time();
        });

        this.$time_table_page_next.click(() => {
            this.page_num = this.page_num + 1;
            if(this.page_num == this.total_page + 1) this.page_num = 1;
            this.getinfo_rank_time();
        });
    }

    generic_page() {
        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ball-game-rank-table-time-page-pre\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");

        for(let i = 1; i <= this.show_page; i++) {
            this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ball-game-rank-table-time-page-num\">" + i + "</a></li>");
        }

        this.$pagination.append("<li><a href=\"javascript:void(0)\" class=\"ball-game-rank-table-time-page-next\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li>");
    }

    modify_page() {
        // keep this.page_num always in the middle: say this.page_num is 3, if this.show_page is 3, then 2 3 4, if this.show_page is 4 then 2 3 4 5
        let start = null, end = null;
        if(this.page_num < this.show_page) start = 1, end = this.show_page;
        else if(this.page_num > this.total_page - this.show_page) start = this.total_page - this.show_page + 1, end = this.total_page;
        else {
            start = this.page_num - this.show_page / 2; // 5 - 3 / 2 ~ 5 + 3 / 2 => 4 5 6, 5 - 4 / 2 ~ 5 + 4 / 2 => 3 4 5 6 7
            end = this.page_num + (this.show_page % 2 == 0 ? this.show_page / 2 - 1 : this.show_page / 2);
        }
        start = Math.ceil(start);
        $.each(this.$time_table_page_btn, function(i) {
            $(this).text(start + i);
        });
    }

    getinfo_rank_score() {
        if(this.score_player && this.score_player_time && new Date().getTime() - this.score_player_time.getTime() <= 5 * 60 * 1000) return;
        this.$score_table_content.empty();
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/menu/rank/getplayers/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                console.log(resp)
                if(resp.result === "success") {
                    this.score_player = resp.players;
                    this.score_player_time = new Date();
                    for(let i = 0; i < this.score_player.length; i++) {
                        let player = this.score_player[i];
                        let obj = "<tr><td>" + player.rank  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$score_table_content.append(obj);
                    }
                }
            }
        });
    }

    getinfo_rank_time() {
        this.$score_table_content.empty();
        this.get_page();        
        this.modify_page();  

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/menu/rank/getplayers/" + this.page_num + "/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: resp => {
                console.log(resp)
                if(resp.result === "success") {
                    let players = resp.players;
                    for(let i = 0; i < players.length; i++) {
                        let player = players[i];
                        let obj = "<tr><td>" + ((this.page_num - 1) * 10 + i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td>" + player.score + "</td></tr>";
                        this.$score_table_content.append(obj);
                    }
                }
            }
        });
    }

    get_page() {
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/menu/rank/getpage/",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            async: false,     
            success: resp => {
                console.log(resp)
                if(resp.result === "success") {
                    this.total_page = resp.page_count;
                }
            }
        });
    }

    show() {
        this.getinfo_rank_score();
        this.$rank.show();
    }

    hide() {
        this.$rank.hide();
    }
}
