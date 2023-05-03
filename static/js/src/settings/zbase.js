class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.username = "";
        this.photo = "";

        this.$settings = $(
            `
                <div class="ball-game-settings">
                    <div class="ball-game-settings-login">
                        <div class="ball-game-settings-title">Login</div>
                        <div class="ball-game-settings-username">
                            <div class="ball-game-settings-item">
                                <input type="text" placeholder="Please Enter Your Username">
                            </div>
                        </div>
                        <div class="ball-game-settings-password">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password">
                            </div>
                        </div>
                        <div class="ball-game-settings-submit">
                            <div class="ball-game-settings-item">
                                <button>Login</button>
                            </div>
                        </div>
                        <div class="ball-game-settings-error-message"></div>
                        <div class="ball-game-settings-option">
                            Register
                        </div>
                        <br>
                        <div class="ball-game-settings-logo">
                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">
                            <br>
                            <div>Acwing Login</div>
                        </div>
                    </div>
                    <div class="ball-game-settings-register">
                    </div>
                </div>
            `
        );


        this.$login = this.$settings.find(".ball-game-settings-login");
        this.$login.hide();

        this.$register = this.$settings.find(".ball-game-settings-register");
        this.$register.hide();

        this.root.$ball_game.append(this.$settings);
        this.start();
    }

    start(){
        this.getinfo();
    }

    register(){
        // register page
        this.$login.hide();
        this.$register.show();
    }

    login(){
        // login page
        this.$register.hide();
        this.$login.show();
    }

    getinfo() {
        let outer = this;

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }
                else{
                    outer.login();
                }
            }
        });
    }

    hide(){
        this.$settings.hide();
    }

    show(){
        this.$settings.show();
    }
}
