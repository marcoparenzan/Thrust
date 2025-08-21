export default class FuelsLayer {
  constructor(scene) {
    this.scene = scene;
  }

  load(layer) {
    this.tiles = [];

    // Convert tiles to polygons for efficient drawing and collision
    this.sprites = [];
    for (let y = 0; y < layer.data.length; y++) {
      let spriteInfo = layer.data[y];
      this.sprites.push({
        id: spriteInfo.id,
        name: spriteInfo.name,
        type: spriteInfo.type,
        x: spriteInfo.x,
        y: spriteInfo.y,
        width: this.scene.tileSize,
        height: this.scene.tileSize,
      });
    }
  }

  update() {

  }

  draw(ctx, offsetX, offsetY) {

    ctx.lineWidth = 1;
    ctx.font = "12px monospace";

    for (const sprite of this.sprites) {
      const screenX = sprite.x - offsetX;
      const screenY = sprite.y - offsetY;

      // Only draw if on screen (rough culling)
      if (
        screenX < -this.scene.tileSize ||
        screenX > this.scene.game.canvas.width ||
        screenY < -this.scene.tileSize ||
        screenY > this.scene.game.canvas.height
      ) {
        continue;
      }

      ctx.strokeStyle = this.scene.color(14);
      ctx.fillText(`${sprite.x}`, screenX, screenY);
      ctx.fillText(`${sprite.y}`, screenX, screenY + 10);
      ctx.strokeRect(
        screenX,
        screenY,
        sprite.width,
        sprite.height
      );
      // ctx.fillRect(screenX, screenY, geometryTile.width, geometryTile.height);
    }
  }
}
