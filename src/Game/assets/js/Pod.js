export default class Pod {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 15;
  }

  draw(ctx, offsetX, offsetY) {
    if (!this.scene.ship.hasPod) {
      const screenX = this.x - offsetX;
      const screenY = this.y - offsetY;

      // Only draw if on screen
      if (
        screenX > -this.width &&
        screenX < this.scene.game.canvas.width + this.width &&
        screenY > -this.height &&
        screenY < this.scene.game.canvas.height + this.height
      ) {
        ctx.fillStyle = "#A0A0FF";
        ctx.fillRect(
          screenX - this.width / 2,
          screenY - this.height / 2,
          this.width,
          this.height
        );
      }
    }
  }
}
