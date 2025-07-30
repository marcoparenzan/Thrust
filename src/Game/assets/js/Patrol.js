export default class Patrol {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.shootTimer = 0;
    this.bullets = [];
    this.health = 3;

    this.direction = Math.random() * Math.PI * 2;
    this.speed = 0.5 + Math.random();
    this.patrolTimer = 0;
  }

  update() {
    // Patrol logic: move along paths
    this.patrolTimer++;
    if (this.patrolTimer > 120) {
      // Change direction occasionally
      this.patrolTimer = 0;
      this.direction += (Math.random() - 0.5) * 2;
    }

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // Boundary checking
    if (this.x < 50) this.direction = 0;
    if (this.x > this.scene.WORLD_WIDTH - 50) this.direction = Math.PI;
    if (this.y < 50) this.direction = Math.PI / 2;
    if (this.y > this.scene.WORLD_HEIGHT - 50) this.direction = Math.PI * 1.5;

    // Shoot at random intervals
    this.shootTimer++;
    if (this.shootTimer > 120) {
      // Shoot less often than turrets
      this.shootTimer = 0;

      const dx = this.scene.ship.x - this.x;
      const dy = this.scene.ship.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 400) {
        const angle = Math.atan2(dy, dx);

        this.bullets.push({
          x: this.x,
          y: this.y,
          velocityX: Math.cos(angle) * 2,
          velocityY: Math.sin(angle) * 2,
          life: 80,
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

      // Draw patrol enemy
      ctx.fillStyle = "#ff5555";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw direction indicator
      ctx.rotate(this.direction);
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(5, -8);
      ctx.lineTo(5, 8);
      ctx.closePath();
      ctx.fill();

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
