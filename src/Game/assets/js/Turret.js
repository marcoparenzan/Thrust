export default class Turret {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.shootTimer = 0;
    this.bullets = [];
    this.health = 3;
  }

  update() {
      // Turret logic: shoot at player when in range
      const dx = this.scene.ship.x - this.x;
      const dy = this.scene.ship.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 300) {
        this.shootTimer++;
        if (this.shootTimer > 60) {
          // Shoot every 60 frames
          this.shootTimer = 0;
          const angle = Math.atan2(dy, dx);

          this.bullets.push({
            x: this.x,
            y: this.y,
            velocityX: Math.cos(angle) * 3,
            velocityY: Math.sin(angle) * 3,
            life: 100,
          });
        }
      }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.x += bullet.velocityX;
      bullet.y += bullet.velocityY;
      bullet.life--;

      // Remove dead bullets
      if (bullet.life <= 0) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check for collision with ship
      const dx = this.scene.ship.x - bullet.x;
      const dy = this.scene.ship.y - bullet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 15) {
        // Ship hit radius
        this.bullets.splice(i, 1);
        this.scene.game.end("SHOT DOWN!");
      }
    }
  }

  draw(ctx, offsetX, offsetY) {
    const screenX = this.x - offsetX;
    const screenY = this.y - offsetY;

    // Only draw if on screen
    if (
      screenX > -this.width &&
      screenX < this.scene.game.canvas.width + this.width &&
      screenY > -this.height &&
      screenY < this.scene.game.canvas.height + this.height
    ) {
      ctx.save();
      ctx.translate(screenX, screenY);

      // Draw turret base
      ctx.fillStyle = "#777777";
      ctx.fillRect(-15, -15, 30, 30);

      // Draw turret gun
      const angle = Math.atan2(this.scene.ship.y - this.y, this.scene.ship.x - this.x);
      ctx.rotate(angle);
      ctx.fillStyle = "#aaaaaa";
      ctx.fillRect(0, -5, 20, 10);

      ctx.restore();
    }

    // Draw bullets
    ctx.fillStyle = "#ffff00";
    for (const bullet of this.bullets) {
      const bulletScreenX = bullet.x - offsetX;
      const bulletScreenY = bullet.y - offsetY;

      if (
        bulletScreenX > 0 &&
        bulletScreenX < this.scene.game.canvas.width &&
        bulletScreenY > 0 &&
        bulletScreenY < this.scene.game.canvas.height
      ) {
        ctx.beginPath();
        ctx.arc(bulletScreenX, bulletScreenY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
