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
                                <button>Submit</button>
                            </div>
                        </div>
                        <div class="ball-game-settings-error-message"></div>
                        <div class="ball-game-settings-option">Register</div>
                        <br>
                        <div class="ball-game-settings-logo">
                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">
                            <br>
                            <div>Acwing Login</div>
                        </div>
                    </div>
                    <div class="ball-game-settings-register">
                        <div class="ball-game-settings-title">Register</div>
                        <div class="ball-game-settings-username">
                            <div class="ball-game-settings-item">
                                <input type="text" placeholder="Please Enter Your Username">
                            </div>
                        </div>
                        <div class="ball-game-settings-password ball-game-settings-password-first">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password">
                            </div>
                        </div>
                        <div class="ball-game-settings-password ball-game-settings-password-second">
                            <div class="ball-game-settings-item">
                                <input type="password" placeholder="Please Enter Your Password Again">
                            </div>
                        </div>
                        <div class="ball-game-settings-submit">
                            <div class="ball-game-settings-item">
                                <button>Submit</button>
                            </div>
                        </div>
                        <div class="ball-game-settings-error-message"></div>
                        <div class="ball-game-settings-option">Login</div>
                        <br>
                        <div class="ball-game-settings-logo">
                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">
                            <br>
                            <div>Acwing Login</div>
                        </div>
                    </div>
                </div>
            `
        );


        this.$login = this.$settings.find(".ball-game-settings-login");
        this.$login_username = this.$login.find(".ball-game-settings-username input");
        this.$login_password = this.$login.find(".ball-game-settings-password input");
        this.$login_submit = this.$login.find(".ball-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ball-game-settings-error-message");
        this.$login_register = this.$login.find(".ball-game-settings-option");
        this.$login.hide();

        this.$register = this.$settings.find(".ball-game-settings-register");
        this.$register_username = this.$register.find(".ball-game-settings-username input");
        this.$register_password = this.$register.find(".ball-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ball-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ball-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ball-game-settings-error-message");
        this.$register_login = this.$register.find(".ball-game-settings-option");
        this.$register.hide();

        this.root.$ball_game.append(this.$settings);
        this.start();
    }

    start(){
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events(){
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login(){
        // jump to register page
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register(){
        // jump to login page
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    login_on_remote(){
        // login via server
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp){
                console.log(resp);
                if (resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote(){
        // register a user via server
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
                else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote(){
        // logout function only works on web-end
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://app4415.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
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
