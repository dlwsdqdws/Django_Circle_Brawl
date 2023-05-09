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
    this.$login_username = this.$login.find(
      ".ball-game-settings-username input"
    );
    this.$login_password = this.$login.find(
      ".ball-game-settings-password input"
    );
    this.$login_submit = this.$login.find(".ball-game-settings-submit button");
    this.$login_error_message = this.$login.find(
      ".ball-game-settings-error-message"
    );
    this.$login_register = this.$login.find(".ball-game-settings-option");
    this.$login.hide();

    this.$register = this.$settings.find(".ball-game-settings-register");
    this.$register_username = this.$register.find(
      ".ball-game-settings-username input"
    );
    this.$register_password = this.$register.find(
      ".ball-game-settings-password-first input"
    );
    this.$register_password_confirm = this.$register.find(
      ".ball-game-settings-password-second input"
    );
    this.$register_submit = this.$register.find(
      ".ball-game-settings-submit button"
    );
    this.$register_error_message = this.$register.find(
      ".ball-game-settings-error-message"
    );
    this.$register_login = this.$register.find(".ball-game-settings-option");
    this.$register.hide();

    this.$acw_login = this.$settings.find(".ball-game-settings-logo img");

    this.root.$ball_game.append(this.$settings);
    this.start();
  }

  start() {
    if (this.platform === "ACAPP") {
      this.getinfo_app();
    } else {
      if (this.root.access){
        this.getinfo_web();
        this.refresh_jwt_token();
      }
      else{
        this.login();
      }
      this.add_listening_events();
    }
  }

  refresh_jwt_token() {
    // refresh jwt for every 4 min 30 s
    setInterval(() => {
      $.ajax({
        url: "https://app4415.acapp.acwing.com.cn/settings/token/refresh/",
        type: "post",
        data: {
          refresh: this.root.refresh,
        },
        success: resp => {
          this.root.access = resp.access;
          console.log(resp);
        }
      });
    }, 4.5 * 60 * 1000);

    setTimeout(() => {
      $.ajax({
        url: "https://app4415.acapp.acwing.com.cn/settings/ranklist/",
        type: "get",
        headers: {
          'Authorization': "Bearer " + this.root.access,
        },
        success: resp => {
          console.log(resp);
        }
      });
     }, 5000);
  }

  add_listening_events() {
    let outer = this;

    this.add_listening_events_login();
    this.add_listening_events_register();

    this.$acw_login.click(function () {
      outer.acw_login();
    });
  }

  add_listening_events_login() {
    // jump to register page
    let outer = this;
    this.$login_register.click(function () {
      outer.register();
    });
    this.$login_submit.click(function () {
      outer.login_on_remote();
    });
  }

  add_listening_events_register() {
    // jump to login page
    let outer = this;
    this.$register_login.click(function () {
      outer.login();
    });
    this.$register_submit.click(function () {
      outer.register_on_remote();
    });
  }

  acw_login() {
    $.ajax({
      url: "https://app4415.acapp.acwing.com.cn/settings/acw/web/apply_code/",
      type: "GET",
      success: function (resp) {
        if (resp.result === "success") {
          window.location.replace(resp.apply_code_url);
        }
      },
    });
  }

  login_on_remote() {
    // login via server
    let username = this.$login_username.val();
    let password = this.$login_password.val();
    this.$login_error_message.empty();

    try{
      $.ajax({
        url: "https://app4415.acapp.acwing.com.cn/settings/token/",
        type: "post",
        data: {
          username: username,
          password: password,
        },
        success: resp => {
          this.root.access = resp.access;
          this.root.refresh = resp.refresh;
          this.refresh_jwt_token();
          this.getinfo_web();
        },
        error: () => {
            this.$login_error_message.html("Username/Password is not correct");
        }
      });
    }  catch(e){
      console.log("Unable to login")
    }
  }

  register_on_remote() {
    // register a user via server
    let username = this.$register_username.val();
    let password = this.$register_password.val();
    let password_confirm = this.$register_password_confirm.val();
    this.$register_error_message.empty();

    $.ajax({
      url: "https://app4415.acapp.acwing.com.cn/settings/register/",
      type: "post",
      data: {
        username,
        password,
        password_confirm,
      },
      success: resp => {
        if (resp.result === "success") {
          this.login_on_remote(username, password);
        } else {
          this.$register_error_message.html(resp.result);
        }
      },
    });
  }

  logout_on_remote() {
    // logout function only works on web-end
    if (this.platform === "ACAPP") {
      this.root.AcWingOS.api.window.close();
    } else {
      this.root.access = "";
      this.root.refresh = "";
      location.href = "/";
    }
  }

  register() {
    // register page
    this.$login.hide();
    this.$register.show();
  }

  login() {
    // login page
    this.$register.hide();
    this.$login.show();
  }

  app_login(appid, redirect_uri, scope, state) {
    this.root.AcWingOS.api.oauth2.authorize(
      appid,
      redirect_uri,
      scope,
      state,
      resp => {
        if (resp.result === "success") {
          this.username = resp.username;
          this.photo = resp.photo;
          // hide settings page, show menu page
          this.hide();
          this.root.menu.show();
          
          this.root.access = resp.access;
          this.root.refresh = resp.refresh;
          this.refresh_jwt_token();
        }
      }
    );
  }

  getinfo_app() {
    let outer = this;
    $.ajax({
      url: "https://app4415.acapp.acwing.com.cn/settings/acw/app/apply_code/",
      type: "GET",
      success: function (resp) {
        if (resp.result === "success") {
          outer.app_login(
            resp.appid,
            resp.redirect_uri,
            resp.scope,
            resp.state
          );
        }
      },
    });
  }

  getinfo_web() {
    $.ajax({
      url: "https://app4415.acapp.acwing.com.cn/settings/getinfo/",
      type: "GET",
      data: {
        platform: this.platform,
      },
      headers: {
        'Authorization': "Bearer " + this.root.access,
      },
      success: resp => {
        if (resp.result === "success") {
          this.username = resp.username;
          this.photo = resp.photo;
          this.hide();
          this.root.menu.show();
        } else {
          this.login();
        }
      },
    });
  }

  hide() {
    this.$settings.hide();
  }

  show() {
    this.$settings.show();
  }
}
