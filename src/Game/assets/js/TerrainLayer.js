export default class TerrainLayer {
  constructor(scene) {
    this.scene = scene;
  }

  load(layer) {
    this.tiles = [];

    let i = 0;
    // Initialize tiles with more open space
    for (let y = 0; y < this.scene.canvasHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.scene.canvasWidth; x++) {
        this.tiles[y][x] = layer.data[i++];
      }
    }

    // Convert tiles to polygons for efficient drawing and collision
    this.geometryTiles = [];
    for (let y = 0; y < this.scene.canvasHeight; y++) {
      for (let x = 0; x < this.scene.canvasWidth; x++) {
        if (this.tiles[y][x] === 1) {
          this.geometryTiles.push({
            x: x * this.scene.tileSize,
            y: y * this.scene.tileSize,
            width: this.scene.tileSize,
            height: this.scene.tileSize,
          });
        }
      }
    }
  }

  update() {
    
  }

  draw(ctx, offsetX, offsetY) {

    ctx.lineWidth = 1;
    ctx.font = "12px monospace";

    for (const geometryTile of this.geometryTiles) {
      const screenX = geometryTile.x - offsetX;
      const screenY = geometryTile.y - offsetY;

      // Only draw if on screen (rough culling)
      if (
        screenX < -this.scene.tileSize ||
        screenX > this.scene.game.canvas.width ||
        screenY < -this.scene.tileSize ||
        screenY > this.scene.game.canvas.height
      ) {
        continue;
      }

      ctx.strokeStyle = "#FFFFFF";
      ctx.fillText(`${geometryTile.x}`, screenX, screenY);
      ctx.fillText(`${geometryTile.y}`, screenX, screenY + 10);
      ctx.strokeStyle = this.scene.color(geometryTile.type);
      ctx.strokeRect(
        screenX,
        screenY,
        geometryTile.width,
        geometryTile.height
      );
      // ctx.fillRect(screenX, screenY, geometryTile.width, geometryTile.height);
    }
  }
}
