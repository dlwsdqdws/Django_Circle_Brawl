class Particle extends BallGameObject {
  constructor(playground, x, y, radius, vx, vy, color, speed, move_len) {
    super();

    this.playground = playground;
    this.ctx = this.playground.game_map.ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.speed = speed;
    this.move_len = move_len;
    this.friction = 0.9;
    this.eps = 0.01;
  }

  start() {}

  update() {
    if (this.move_len < this.eps || this.speed < this.eps) {
      this.destroy();
      return false;
    }
    let moved = Math.min(this.move_len, (this.speed * this.timedelta) / 1000);
    this.x += this.vx * moved;
    this.y += this.vy * moved;
    this.speed *= this.friction;
    this.move_len -= moved;

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
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}
