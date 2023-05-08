class BallGameMenu{constructor(t){this.root=t,this.$menu=$('\n                <div class = "ball-game-menu">\n                    <div class = "ball-game-menu-field">\n                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-single-mode">\n                            Single\n                        </div><br>\n                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-multi-mode">\n                            Multiple\n                        </div><br>\n                        <div class = "ball-game-menu-field-item ball-game-menu-field-item-settings">\n                            Settings\n                        </div>\n                    </div>\n                </div>\n            '),this.$menu.hide(),this.root.$ball_game.append(this.$menu),this.$single_mode=this.$menu.find(".ball-game-menu-field-item-single-mode"),this.$multi_mode=this.$menu.find(".ball-game-menu-field-item-multi-mode"),this.$settings=this.$menu.find(".ball-game-menu-field-item-settings"),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$single_mode.click((function(){t.hide(),t.root.playground.show("single mode")})),this.$multi_mode.click((function(){t.hide(),t.root.playground.show("multi mode")})),this.$settings.click((function(){t.root.settings.logout_on_remote()}))}show(){this.$menu.show()}hide(){this.$menu.hide()}}let last_timestamp,Ball_Game_Objects=[];class BallGameObject{constructor(){Ball_Game_Objects.push(this),this.has_called_start=!1,this.timedelta=0,this.uuid=this.create_uuid()}create_uuid(){let t="";for(let s=0;s<8;s++){t+=parseInt(Math.floor(10*Math.random()))}return t}start(){}update(){}late_update(){}on_destroy(){}destroy(){this.on_destroy();for(let t=0;t<Ball_Game_Objects.length;t++)if(Ball_Game_Objects[t]===this){Ball_Game_Objects.splice(t,1);break}}}let Ball_Game_Animation=function(t){for(let s=0;s<Ball_Game_Objects.length;s++){let i=Ball_Game_Objects[s];i.has_called_start?(i.timedelta=t-last_timestamp,i.update()):(i.start(),i.has_called_start=!0)}for(let t=0;t<Ball_Game_Objects.length;t++){Ball_Game_Objects[t].late_update()}last_timestamp=t,requestAnimationFrame(Ball_Game_Animation)};requestAnimationFrame(Ball_Game_Animation);class ChatField{constructor(t){this.playground=t,this.$history=$('\n            <div class="ball-game-chat-field-history">\n            </div>\n           '),this.$input=$('\n            <input type="text" class="ball-game-chat-field-input">\n            '),this.$history.hide(),this.$input.hide(),this.func_id=null,this.playground.$playground.append(this.$history),this.playground.$playground.append(this.$input),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$input.keydown((function(s){if(27===s.which)return t.hide_input(),!1;if(13===s.which){let s=t.playground.root.settings.username,i=t.$input.val();return i&&(t.$input.val(""),t.add_message(s,i),t.playground.mps.send_message(s,i)),!1}}))}show_history(){let t=this;this.$history.fadeIn(),this.func_id&&clearTimeout(this.func_id),this.func_id=setTimeout((function(){t.$history.fadeOut(),t.func_id=null}),3e3)}render_message(t){return $(`<div>${t}</div>`)}add_message(t,s){this.show_history();let i=`[${t}] ${s}`;this.$history.append(this.render_message(i)),this.$history.scrollTop(this.$history[0].scrollHeight)}show_input(){this.show_history(),this.$input.show(),this.$input.focus()}hide_input(){this.$input.hide(),this.playground.game_map.$canvas.focus()}}class GameMap extends BallGameObject{constructor(t){super(),this.playground=t,this.$canvas=$("<canvas tabindex=0></canvas>"),this.ctx=this.$canvas[0].getContext("2d"),this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.playground.$playground.append(this.$canvas)}start(){this.$canvas.focus()}resize(){this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.ctx.fillStyle="rgba(0, 0, 0, 1)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}update(){this.render()}render(){this.ctx.fillStyle="rgba(0, 0, 0, 0.2)",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}}class NoticeBoard extends BallGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.text="Ready: 0 Player"}start(){}update(){this.render()}write(t){this.text=t}render(){this.ctx.font="20px serif",this.ctx.fillStyle="white",this.ctx.textAlign="center",this.ctx.fillText(this.text,this.playground.width/2,20)}}class Particle extends BallGameObject{constructor(t,s,i,e,a,h,l,n,r){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.radius=e,this.vx=a,this.vy=h,this.color=l,this.speed=n,this.move_len=r,this.friction=.9,this.eps=.01}start(){}update(){if(this.move_len<this.eps||this.speed<this.eps)return this.destroy(),!1;let t=Math.min(this.move_len,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.speed*=this.friction,this.move_len-=t,this.render()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class Player extends BallGameObject{constructor(t,s,i,e,a,h,l,n,r){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.vx=0,this.vy=0,this.move_length=0,this.color=a,this.speed=h,this.damage_vx=0,this.damage_vy=0,this.damage_speed=0,this.friction=.9,this.radius=e,this.character=l,this.username=n,this.photo=r,this.eps=.01,this.cur_skill=null,this.fireballs=[],this.spent_time=0,this.old_score=1500,this.new_score=1500,"robot"!==this.character&&(this.img=new Image,this.img.src=this.photo),"me"===this.character&&(this.get_score(),this.fireball_coldtime=3,this.fireball_img=new Image,this.fireball_img.src="https://circle-brawl.oss-cn-hongkong.aliyuncs.com/fire_balll.png",this.flash_coldtime=5,this.flash_img=new Image,this.flash_img.src="https://circle-brawl.oss-cn-hongkong.aliyuncs.com/blink.png",this.shield_coldtime=10,this.shield_img=new Image,this.shield_img.src="https://circle-brawl.oss-cn-hongkong.aliyuncs.com/shield.png")}start(){if(this.playground.player_count++,this.playground.notice_board.write("Ready: "+this.playground.player_count+(1==this.playground.player_count?" Player":" Players")),this.playground.player_count>=3&&(this.playground.state="fighting",this.playground.notice_board.write("Fighting!!!")),"me"===this.character)this.add_listening_events();else if("robot"===this.character){let t=Math.random()*this.playground.width/this.playground.scale,s=Math.random()*this.playground.height/this.playground.scale;this.move_to(t,s)}}add_listening_events(){let t=this;this.playground.game_map.$canvas.on("contextmenu",(function(t){return t.preventDefault(),t.stopPropagation(),!1})),this.playground.game_map.$canvas.mousedown((function(s){if("fighting"!==t.playground.state)return!0;const i=t.ctx.canvas.getBoundingClientRect();if(3===s.which){let e=(s.clientX-i.left)/t.playground.scale,a=(s.clientY-i.top)/t.playground.scale;t.move_to(e,a),"multi mode"===t.playground.mode&&t.playground.mps.send_move_to(e,a)}else if(1===s.which){let e=(s.clientX-i.left)/t.playground.scale,a=(s.clientY-i.top)/t.playground.scale;if("fireball"===t.cur_skill){if(t.fireball_coldtime>=t.eps)return!1;let s=t.shoot_fireball(e,a);"multi mode"===t.playground.mode&&t.playground.mps.send_shoot_fireball(e,a,s.uuid)}else if("flash"===t.cur_skill){if(t.flash_codetime>=t.eps)return!1;t.flash(e,a),"multi mode"===t.playground.mode&&t.playground.mps.send_flash(e,a)}else if("shield"===t.cur_skill){if(t.shield_coldtime>=t.eps)return!1;t.shoot_shield(),"multi mode"===t.playground.mode&&t.playground.mps.send_shoot_shield()}t.cur_skill=null}})),this.playground.game_map.$canvas.keydown((function(s){if(13===s.which){if("multi mode"===t.playground.mode)return t.playground.chat_field.show_input(),!1}else 27===s.which&&"multi mode"===t.playground.mode&&t.playground.chat_field.hide_input();return"fighting"!==t.playground.state||(81===s.which?t.fireball_coldtime>t.eps||(t.cur_skill="fireball",!1):70===s.which?t.flash_coldtime>=t.eps||(t.cur_skill="flash",!1):83===s.which?t.shield_coldtime>=t.eps||(t.cur_skill="shield",!1):void 0)}))}shoot_shield(){let t=this.x,s=this.y,i=1.3*this.radius,e=2*this.radius,a=this.color;new Shield(this.playground,this,t,s,i,1.2,.045,e,a),this.shield_coldtime=10,this.move_length=0}shoot_fireball(t,s){let i=this.x,e=this.y,a=Math.atan2(s-this.y,t-this.x),h=Math.cos(a),l=Math.sin(a),n=new FireBall(this.playground,this,i,e,.01,h,l,"orange",.5,1,.01);return this.fireballs.push(n),this.playground.bullets.push(n),this.fireball_coldtime=3,n}destroy_fireball(t){for(let s=0;s<this.fireballs.length;s++){let i=this.fireballs[s];if(i.uuid==t){i.destroy_from_bullets(),i.destroy();break}}}flash(t,s){let i=this.get_dist(this.x,this.y,t,s);i=Math.min(i,.4);let e=Math.atan2(s-this.y,t-this.x);this.x+=i*Math.cos(e),this.y+=i*Math.sin(e),this.flash_coldtime=5,this.move_length=0}get_dist(t,s,i,e){let a=i-t,h=e-s;return Math.sqrt(a*a+h*h)}move_to(t,s){this.move_length=this.get_dist(this.x,this.y,t,s);let i=Math.atan2(s-this.y,t-this.x);this.vx=Math.cos(i),this.vy=Math.sin(i)}is_attacked(t,s){for(let t=0;t<20+5*Math.random();t++){let t=this.x,s=this.y,i=this.radius*Math.random()*.1,e=2*Math.PI*Math.random(),a=Math.cos(e),h=Math.sin(e),l=this.color,n=10*this.speed,r=this.radius*Math.random()*5;new Particle(this.playground,t,s,i,a,h,l,n,r)}if(this.radius-=s,this.radius<this.eps)return this.destroy(),!1;this.damage_vx=Math.cos(t),this.damage_vy=Math.sin(t),this.damage_speed=100*s,this.speed*=1.25}receive_attack(t,s,i,e,a,h){console.log("receive",t,s),h.destroy_fireball(a),this.x=t,this.y=s,this.is_attacked(i,e)}update(){(this.x<0||this.x>2||this.y<0||this.y>1)&&console.log("yes",this.x,this.y),this.spent_time+=this.timedelta/1e3,this.update_win(),"me"===this.character&&"fighting"===this.playground.state&&this.update_coldtime(),this.update_move(),this.render()}update_win(){"fighting"===this.playground.state&&"me"===this.character&&1===this.playground.players.length&&(this.playground.state="over",this.get_score(),this.playground.score_board.win())}update_coldtime(){this.fireball_coldtime-=this.timedelta/1e3,this.fireball_coldtime=Math.max(0,this.fireball_coldtime),this.flash_coldtime-=this.timedelta/1e3,this.flash_coldtime=Math.max(this.flash_coldtime,0),this.shield_coldtime-=this.timedelta/1e3,this.shield_coldtime=Math.max(this.shield_coldtime,0)}update_move(){if("robot"===this.character&&this.spent_time>5){if(200*Math.random()<1){let t=this.playground.players[Math.floor(Math.random()*this.playground.players.length)],s=t.x+t.speed*this.vx*this.timedelta/1e3*.2,i=t.y+t.speed*this.vy*this.timedelta/1e3*.2;this.shoot_fireball(s,i)}1e3*Math.random()<1&&this.shoot_shield()}if(this.damage_speed>this.eps)this.vx=0,this.vy=0,this.move_length=0,this.x+=this.damage_vx*this.damage_speed*this.timedelta/1e3,this.y+=this.damage_vy*this.damage_speed*this.timedelta/1e3,console.log("reple",this.damage_vx*this.damage_speed*this.timedelta/1e3,this.damage_vy*this.damage_speed*this.timedelta/1e3),this.damage_speed*=this.friction;else if(this.move_length<this.eps){if(this.move_length=0,this.vx=0,this.vy=0,"robot"===this.character){let t=Math.random()*this.playground.width/this.playground.scale,s=Math.random()*this.playground.height/this.playground.scale;this.move_to(t,s)}}else{let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}}render(){let t=this.playground.scale;"robot"!==this.character?(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.img,(this.x-this.radius)*t,(this.y-this.radius)*t,2*this.radius*t,2*this.radius*t),this.ctx.restore()):(this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()),"me"===this.character&&"fighting"===this.playground.state&&this.render_skill_coldtime()}render_skill_coldtime(){let t=this.playground.scale,s=1.5,i=.9,e=.04;this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(s*t,i*t,e*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.fireball_img,(s-e)*t,(i-e)*t,2*e*t,2*e*t),this.ctx.restore(),this.fireball_coldtime>=this.eps&&(this.ctx.beginPath(),this.ctx.moveTo(s*t,i*t),this.ctx.arc(s*t,i*t,e*t,0-Math.PI/2,2*Math.PI*(1-this.fireball_coldtime/3)-Math.PI/2,!0),this.ctx.lineTo(s*t,i*t),this.ctx.fillStyle="rgba(169, 169, 169, 0.6)",this.ctx.fill()),s=1.62,i=.9,e=.04,this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(s*t,i*t,e*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.flash_img,(s-e)*t,(i-e)*t,2*e*t,2*e*t),this.ctx.restore(),this.flash_coldtime>=this.eps&&(this.ctx.beginPath(),this.ctx.moveTo(s*t,i*t),this.ctx.arc(s*t,i*t,e*t,0-Math.PI/2,2*Math.PI*(1-this.flash_coldtime/5)-Math.PI/2,!0),this.ctx.lineTo(s*t,i*t),this.ctx.fillStyle="rgba(169, 169, 169, 0.6)",this.ctx.fill()),s=1.38,i=.9,e=.04,this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(s*t,i*t,e*t,0,2*Math.PI,!1),this.ctx.stroke(),this.ctx.clip(),this.ctx.drawImage(this.shield_img,(s-e)*t,(i-e)*t,2*e*t,2*e*t),this.ctx.restore(),this.shield_coldtime>=this.eps&&(this.ctx.beginPath(),this.ctx.moveTo(s*t,i*t),this.ctx.arc(s*t,i*t,e*t,0-Math.PI/2,2*Math.PI*(1-this.shield_coldtime/10)-Math.PI/2,!0),this.ctx.lineTo(s*t,i*t),this.ctx.fillStyle="rgba(169, 169, 169, 0.6)",this.ctx.fill())}get_score(){let t=this;$.ajax({url:"https://app4415.acapp.acwing.com.cn/playground/getscore/",type:"GET",success:function(s){"success"===s.result&&("over"===t.playground.state?t.new_score=s.score:t.old_score=s.score)}})}on_destroy(){"me"===this.character&&"fighting"===this.playground.state&&(this.playground.state="over",this.get_score(),this.playground.score_board.lose());for(let t=0;t<this.playground.players.length;t++)if(this.playground.players[t]===this){this.playground.players.splice(t,1);break}}}class ScoreBoard extends BallGameObject{constructor(t){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.state=null,this.win_img=new Image,this.win_img.src="https://circle-brawl.oss-cn-hongkong.aliyuncs.com/win_logo.png",this.lose_img=new Image,this.lose_img.src="https://circle-brawl.oss-cn-hongkong.aliyuncs.com/lose_logo.png"}start(){}add_listening_events(){let t=this,s=this.playground.game_map.$canvas,i=0;s.on("click",(function(){i++,1===i?t.state="hide":2===i&&(t.playground.hide(),t.playground.root.menu.show(),i=0)}))}win(){this.state="win";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}lose(){this.state="lose";let t=this;setTimeout((function(){t.add_listening_events()}),1e3)}late_update(){this.render()}render(){let t=this.playground.height/2;"win"===this.state?this.ctx.drawImage(this.win_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t):"lose"===this.state?this.ctx.drawImage(this.lose_img,this.playground.width/2-t/2,this.playground.height/2-t/2,t,t):this.state}}class FireBall extends BallGameObject{constructor(t,s,i,e,a,h,l,n,r,o,d){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.player=s,this.x=i,this.y=e,this.vx=h,this.vy=l,this.radius=a,this.color=n,this.speed=r,this.move_length=o,this.damage=d,this.eps=.01}start(){}update(){if(this.move_length<this.eps)return this.destroy_from_bullets(),this.destroy(),!1;this.update_move(),"enemy"!==this.player.character&&this.update_attack(),this.render()}update_move(){let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_length-=t}update_attack(){for(let t=0;t<this.playground.players.length;t++){let s=this.playground.players[t];if(this.player!==s&&this.is_collision(s)){this.attack(s);break}}}get_dist(t,s,i,e){let a=i-t,h=e-s;return Math.sqrt(a*a+h*h)}is_collision(t){return this.get_dist(this.x,this.y,t.x,t.y)<this.radius+t.radius}attack(t){let s=Math.atan2(t.y-this.y,t.x-this.x);t.is_attacked(s,this.damage),"multi mode"===this.playground.mode&&this.playground.mps.send_attack(t.uuid,t.x,t.y,s,this.damage,this.uuid),this.destroy_from_bullets(),this.destroy()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}destroy_from_bullets(){for(let t=0;t<this.playground.bullets.length;t++)if(this.playground.bullets[t]===this){this.playground.bullets.splice(t,1);break}}on_destroy(){let t=this.player.fireballs;for(let s=0;s<t.length;s++)if(t[s]===this){t.splice(s,1);break}}}class Shield extends BallGameObject{constructor(t,s,i,e,a,h,l,n,r){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.player=s,this.x=i,this.y=e,this.radius=a,this.vr=h,this.speed=l,this.last_radius=n,this.color=r,this.continue_time=3}start(){}get_dist(t,s,i,e){let a=t-i,h=s-e;return Math.sqrt(a*a+h*h)}is_collision(t){return this.get_dist(this.x,this.y,t.x,t.y)<=this.radius+t.radius}destroy_fireball(){for(let t=0;t<this.playground.bullets.length;t++){let s=this.playground.bullets[t];s.player!==this.player&&(this.is_collision(s)&&(this.playground.bullets.splice(t,1),s.destroy_from_bullets(),s.destroy()))}}update(){this.radius>=this.last_radius&&(this.continue_time>0?this.continue_time-=this.timedelta/1e3:this.destroy()),this.destroy_fireball(),this.x=this.player.x,this.y=this.player.y,this.radius+=this.speed*this.timedelta/1e3,this.speed*=this.vr,this.radius=Math.min(this.radius,this.last_radius),this.render()}render(){let t=this.playground.scale;this.ctx.beginPath(),this.ctx.arc(this.x*t,this.y*t,this.radius*t,0,2*Math.PI,!1),this.ctx.strokeStyle=this.color,this.ctx.stroke()}}class MultiPlayerSocket{constructor(t){this.playground=t,this.ws=new WebSocket("wss://app4415.acapp.acwing.com.cn/wss/multiplayer/"),this.start()}start(){this.receive()}receive(){let t=this;this.ws.onmessage=function(s){let i=JSON.parse(s.data),e=i.uuid;if(e===t.uuid)return!1;let a=i.event;"create_player"===a?t.receive_create_player(e,i.username,i.photo):"move_to"===a?t.receive_move_to(e,i.tx,i.ty):"shoot_fireball"===a?t.receive_shoot_fireball(e,i.tx,i.ty,i.ball_uuid):"attack"===a?t.receive_attack(e,i.attackee_uuid,i.x,i.y,i.angle,i.damage,i.ball_uuid):"flash"===a?t.receive_flash(e,i.tx,i.ty):"shoot_shield"===a?t.receive_shoot_shield(e):"message"===a&&t.receive_message(e,i.username,i.text)}}get_player(t){let s=this.playground.players;for(let i=0;i<s.length;i++){let e=s[i];if(e.uuid===t)return e}return null}send_create_player(t,s){this.ws.send(JSON.stringify({event:"create_player",uuid:this.uuid,username:t,photo:s}))}receive_create_player(t,s,i){let e=new Player(this.playground,this.playground.width/2/this.playground.scale,.5,.05,"white",.15,"enemy",s,i);e.uuid=t,this.playground.players.push(e)}send_move_to(t,s){this.ws.send(JSON.stringify({event:"move_to",uuid:this.uuid,tx:t,ty:s}))}receive_move_to(t,s,i){let e=this.get_player(t);e&&e.move_to(s,i)}send_shoot_fireball(t,s,i){this.ws.send(JSON.stringify({event:"shoot_fireball",uuid:this.uuid,tx:t,ty:s,ball_uuid:i}))}receive_shoot_fireball(t,s,i,e){let a=this.get_player(t);if(a){a.shoot_fireball(s,i).uuid=e}}send_attack(t,s,i,e,a,h){this.ws.send(JSON.stringify({event:"attack",uuid:this.uuid,attackee_uuid:t,x:s,y:i,angle:e,damage:a,ball_uuid:h}))}receive_attack(t,s,i,e,a,h,l){let n=this.get_player(t),r=this.get_player(s);n&&r&&r.receive_attack(i,e,a,h,l,n)}send_flash(t,s){this.ws.send(JSON.stringify({event:"flash",uuid:this.uuid,tx:t,ty:s}))}receive_flash(t,s,i){let e=this.get_player(t);e&&e.flash(s,i)}send_shoot_shield(){this.ws.send(JSON.stringify({event:"shoot_shield",uuid:this.uuid}))}receive_shoot_shield(t){let s=this.get_player(t);s&&s.shoot_shield()}send_message(t,s){this.ws.send(JSON.stringify({event:"message",uuid:this.uuid,username:t,text:s}))}receive_message(t,s,i){this.playground.chat_field.add_message(s,i)}}class BallGamePlayground{constructor(t){this.root=t,this.$playground=$('<div class="ball-game-playground"></div>'),this.hide(),this.root.$ball_game.append(this.$playground),this.start()}get_random_color(){return["blue","red","pink","grey","green","Cyan","AntiqueWhite","Azure"][Math.floor(8*Math.random())]}create_uuid(){let t="";for(let s=0;s<8;s++){t+=parseInt(Math.floor(10*Math.random()))}return t}start(){let t=this,s=this.create_uuid();$(window).on(`resize.${s}`,(function(){t.resize()})),this.root.AcWingOS&&this.root.AcWingOS.api.window.on_close((function(){$(window).off(`resize.${s}`)}))}resize(){this.width=this.$playground.width(),this.height=this.$playground.height();let t=Math.min(this.width/16,this.height/9);this.width=16*t,this.height=9*t,this.scale=this.height,this.game_map&&this.game_map.resize()}show(t){let s=this;if(this.$playground.show(),this.width=this.$playground.width(),this.height=this.$playground.height(),this.game_map=new GameMap(this),this.mode=t,this.state="waiting",this.notice_board=new NoticeBoard(this),this.score_board=new ScoreBoard(this),this.player_count=0,this.resize(),this.bullets=[],this.players=[],this.players.push(new Player(this,this.width/2/this.scale,.5,.05,"white",.15,"me",this.root.settings.username,this.root.settings.photo)),"single mode"===t)for(let t=0;t<5;t++)this.players.push(new Player(this,this.width/2/this.scale,.5,.05,this.get_random_color(),.15,"robot"));else"multi mode"===t&&(this.chat_field=new ChatField(this),this.mps=new MultiPlayerSocket(this),this.mps.uuid=this.players[0].uuid,this.mps.ws.onopen=function(){s.mps.send_create_player(s.root.settings.username,s.root.settings.photo)})}hide(){for(;this.players&&this.players.length>0;)this.players[0].destroy();for(;this.bullets&&this.bullets.length>0;)this.bullets[0].destroy_from_bullets();this.game_map&&(this.game_map.destroy(),this.game_map=null),this.notice_board&&(this.notice_board.destroy(),this.notice_board=null),this.score_board&&(this.score_board.destroy(),this.score_board=null),this.$playground.empty(),this.$playground.hide()}}class Settings{constructor(t){this.root=t,this.platform="WEB",this.root.AcWingOS&&(this.platform="ACAPP"),this.username="",this.photo="",this.$settings=$('\n                <div class="ball-game-settings">\n                    <div class="ball-game-settings-login">\n                        <div class="ball-game-settings-title">Login</div>\n                        <div class="ball-game-settings-username">\n                            <div class="ball-game-settings-item">\n                                <input type="text" placeholder="Please Enter Your Username">\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-password">\n                            <div class="ball-game-settings-item">\n                                <input type="password" placeholder="Please Enter Your Password">\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-submit">\n                            <div class="ball-game-settings-item">\n                                <button>Submit</button>\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-error-message"></div>\n                        <div class="ball-game-settings-option">Register</div>\n                        <br>\n                        <div class="ball-game-settings-logo">\n                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">\n                            <br>\n                            <div>Acwing Login</div>\n                        </div>\n                    </div>\n                    <div class="ball-game-settings-register">\n                        <div class="ball-game-settings-title">Register</div>\n                        <div class="ball-game-settings-username">\n                            <div class="ball-game-settings-item">\n                                <input type="text" placeholder="Please Enter Your Username">\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-password ball-game-settings-password-first">\n                            <div class="ball-game-settings-item">\n                                <input type="password" placeholder="Please Enter Your Password">\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-password ball-game-settings-password-second">\n                            <div class="ball-game-settings-item">\n                                <input type="password" placeholder="Please Enter Your Password Again">\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-submit">\n                            <div class="ball-game-settings-item">\n                                <button>Submit</button>\n                            </div>\n                        </div>\n                        <div class="ball-game-settings-error-message"></div>\n                        <div class="ball-game-settings-option">Login</div>\n                        <br>\n                        <div class="ball-game-settings-logo">\n                            <img width="30" src="https://app4415.acapp.acwing.com.cn/static/image/settings/logo.png">\n                            <br>\n                            <div>Acwing Login</div>\n                        </div>\n                    </div>\n                </div>\n            '),this.$login=this.$settings.find(".ball-game-settings-login"),this.$login_username=this.$login.find(".ball-game-settings-username input"),this.$login_password=this.$login.find(".ball-game-settings-password input"),this.$login_submit=this.$login.find(".ball-game-settings-submit button"),this.$login_error_message=this.$login.find(".ball-game-settings-error-message"),this.$login_register=this.$login.find(".ball-game-settings-option"),this.$login.hide(),this.$register=this.$settings.find(".ball-game-settings-register"),this.$register_username=this.$register.find(".ball-game-settings-username input"),this.$register_password=this.$register.find(".ball-game-settings-password-first input"),this.$register_password_confirm=this.$register.find(".ball-game-settings-password-second input"),this.$register_submit=this.$register.find(".ball-game-settings-submit button"),this.$register_error_message=this.$register.find(".ball-game-settings-error-message"),this.$register_login=this.$register.find(".ball-game-settings-option"),this.$register.hide(),this.$acw_login=this.$settings.find(".ball-game-settings-logo img"),this.root.$ball_game.append(this.$settings),this.start()}start(){"ACAPP"===this.platform?this.getinfo_app():(this.getinfo_web(),this.add_listening_events())}add_listening_events(){let t=this;this.add_listening_events_login(),this.add_listening_events_register(),this.$acw_login.click((function(){t.acw_login()}))}add_listening_events_login(){let t=this;this.$login_register.click((function(){t.register()})),this.$login_submit.click((function(){t.login_on_remote()}))}add_listening_events_register(){let t=this;this.$register_login.click((function(){t.login()})),this.$register_submit.click((function(){t.register_on_remote()}))}acw_login(){$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/acw/web/apply_code/",type:"GET",success:function(t){"success"===t.result&&window.location.replace(t.apply_code_url)}})}login_on_remote(){let t=this,s=this.$login_username.val(),i=this.$login_password.val();this.$login_error_message.empty(),$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/login/",type:"GET",data:{username:s,password:i},success:function(s){"success"===s.result?location.reload():t.$login_error_message.html(s.result)}})}register_on_remote(){let t=this,s=this.$register_username.val(),i=this.$register_password.val(),e=this.$register_password_confirm.val();this.$register_error_message.empty(),$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/register/",type:"GET",data:{username:s,password:i,password_confirm:e},success:function(s){"success"===s.result?location.reload():t.$register_error_message.html(s.result)}})}logout_on_remote(){"ACAPP"===this.platform?this.root.AcWingOS.api.window.close():$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/logout/",type:"GET",success:function(t){"success"===t.result&&location.reload()}})}register(){this.$login.hide(),this.$register.show()}login(){this.$register.hide(),this.$login.show()}app_login(t,s,i,e){let a=this;this.root.AcWingOS.api.oauth2.authorize(t,s,i,e,(function(t){"success"===t.result&&(a.username=t.username,a.photo=t.photo,a.hide(),a.root.menu.show())}))}getinfo_app(){let t=this;$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/acw/app/apply_code/",type:"GET",success:function(s){"success"===s.result&&t.app_login(s.appid,s.redirect_uri,s.scope,s.state)}})}getinfo_web(){let t=this;$.ajax({url:"https://app4415.acapp.acwing.com.cn/settings/getinfo/",type:"GET",data:{platform:t.platform},success:function(s){"success"===s.result?(t.username=s.username,t.photo=s.photo,t.hide(),t.root.menu.show()):t.login()}})}hide(){this.$settings.hide()}show(){this.$settings.show()}}export class BallGame{constructor(t,s){this.is=t,this.$ball_game=$("#"+t),this.AcWingOS=s,this.settings=new Settings(this),this.menu=new BallGameMenu(this),this.playground=new BallGamePlayground(this),this.start()}start(){}}
