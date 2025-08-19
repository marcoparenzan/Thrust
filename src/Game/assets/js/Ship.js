export default class Ship {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.thrust = 0.1;
    this.width = 20;
    this.height = 30;
    this.fuel = 100;
    this.hasPod = false;
    this.screenX = this.scene.game.canvas.width / 2;
    this.screenY = this.scene.game.canvas.height / 2;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.screenX, this.screenY);
    ctx.rotate(this.rotation);

    // Ship body
    ctx.strokeStyle = "#4CFF4C";
    ctx.lineWidth = 1;
    ctx.font = "12px monospace";
    ctx.fillStyle = "#85C2FF";
    // ctx.beginPath();
    // ctx.moveTo(0, -this.height / 2);
    // ctx.lineTo(this.width / 2, this.height / 2);
    // ctx.lineTo(-this.width / 2, this.height / 2);
    // ctx.closePath();
    // ctx.fill();
    ctx.fillText(`${this.x}`, 0, 0);
    ctx.fillText(`${this.y}`, 0, 0 + 10);
    ctx.strokeRect(0, 0, this.width, this.height);

    // Thrust flame
    if (this.scene.game.keys.up && this.fuel > 0) {
      ctx.fillStyle = "#FF4500";
      ctx.beginPath();
      ctx.moveTo(-this.width / 4, this.height / 2);
      ctx.lineTo(this.width / 4, this.height / 2);
      ctx.lineTo(0, this.height / 2 + 15 * Math.random());
      ctx.closePath();
      ctx.fill();
    }

    // Draw pod if attached
    if (this.hasPod) {
      ctx.fillStyle = "#A0A0FF";
      ctx.fillRect(-15, this.height / 2 - 5, 30, 15);
    }

    ctx.restore();
  }

  update() {
    // Apply thrust
    if (this.scene.game.keys.up && this.fuel > 0) {
      const thrustX = Math.sin(this.rotation) * this.thrust;
      const thrustY = -Math.cos(this.rotation) * this.thrust;

      this.velocityX += thrustX;
      this.velocityY += thrustY;

      // Decrease fuel
      this.fuel = Math.max(0, this.fuel - 0.1);
    }

    // Apply rotation
    if (this.scene.game.keys.left) {
      this.rotation -= 0.05;
    }
    if (this.scene.game.keys.right) {
      this.rotation += 0.05;
    }

    // Apply gravity
    this.velocityY += this.scene.gravity;

    // Apply drag (new feature)
    this.velocityX *= 0.995;
    this.velocityY *= 0.995;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Boundary check
    if (this.x < 0) this.x = 0;
    if (this.x > this.scene.WORLD_WIDTH) this.x = this.scene.WORLD_WIDTH;
    if (this.y < 0) this.y = 0;
    if (this.y > this.scene.WORLD_HEIGHT) this.y = this.scene.WORLD_HEIGHT;
  }
}
