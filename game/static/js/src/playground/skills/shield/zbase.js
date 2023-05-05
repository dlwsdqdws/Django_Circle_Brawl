class Shield extends BallGameObject {
  constructor(playground, player, x, y, radius, vr, speed, last_radius, color) {
    super();
    this.playground = playground;
    this.ctx = this.playground.game_map.ctx;
    this.player = player;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vr = vr;
    this.speed = speed;
    this.last_radius = last_radius;
    this.color = color;
    this.continue_time = 3; //3 seconds
  }

  start() {}

  get_dist(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  is_collision(fireball) {
    let dist = this.get_dist(this.x, this.y, fireball.x, fireball.y);
    if (dist <= this.radius + fireball.radius) return true;
    else return false;
  }

  destroy_fireball() {
    for (let i = 0; i < this.playground.bullets.length; i++) {
      let fireball = this.playground.bullets[i];
      if (fireball.player === this.player) continue;
      if (this.is_collision(fireball)) {
        this.playground.bullets.splice(i, 1);
        fireball.destroy();
      }
    }
  }

  update() {
    if (this.radius >= this.last_radius) {
      if (this.continue_time > 0) {
        this.continue_time -= this.timedelta / 1000;
      } else {
        this.destroy();
      }
    }
    this.destroy_fireball();
    this.x = this.player.x;
    this.y = this.player.y;
    this.radius += (this.speed * this.timedelta) / 1000;
    this.speed *= this.vr;
    this.radius = Math.min(this.radius, this.last_radius);
    // console.log(this.radius);

    this.render();
  }

  render() {
    let scale = this.playground.scale;
    this.ctx.beginPath();
    this.ctx.arc(
      this.x * scale,
      this.y * scale,
      this.radius * scale,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
}
