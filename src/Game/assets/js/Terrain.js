export default class Terrain {
  constructor(scene)  {
    this.scene = scene;
  }
 
  load(data) {

    this.grid = [];
    this.cellSize = data.cellSize || 40; // Size of each grid cell
    this.gridWidth = data.gridWidth || 72; // Width of the grid in cells
    this.gridHeight = data.gridHeight || 167; // Height of the grid in cells
    this.WORLD_WIDTH = this.gridWidth * this.cellSize;
    this.WORLD_HEIGHT = this.gridHeight * this.cellSize;

    let i = 0;
    // Initialize grid with more open space
    for (let y = 0; y < this.gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        this.grid[y][x] = data.grid[i++]; 
      }
    }

    // Create landing pads
    this.landingPads = [];
    for (let i = 0; i < 3; i++) {
      let padX, padY;
      let found = false;

      // Find valid landing pad locations
      while (!found) {
        padX = Math.floor(Math.random() * (this.gridWidth - 10)) + 5;
        padY = Math.floor(Math.random() * (this.gridHeight - 10)) + 5;

        // Check if area is clear for landing pad
        let clear = true;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 3; dx++) {
            if (this.grid[padY + dy][padX + dx] === 1) {
              clear = false;
              break;
            }
          }
          if (!clear) break;
        }

        if (clear) {
          found = true;
          // Make landing pad
          for (let dx = 0; dx < 3; dx++) {
            this.grid[padY][padX + dx] = 2; // Landing pad
          }

          this.landingPads.push({
            x: (padX + 1) * this.cellSize,
            y: padY * this.cellSize,
            width: 3 * this.cellSize,
          });
        }
      }
    }

    // Convert grid to polygons for efficient drawing and collision
    this.walls = [];
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y][x] === 1) {
          this.walls.push({
            x: x * this.cellSize,
            y: y * this.cellSize,
            width: this.cellSize,
            height: this.cellSize,
          });
        }
      }
    }
      
    this.enemies = [];
    this.pod = null;
  }

  color(value) {
    switch (value) {
      case 0:
        return "#000000"; // Empty space
      case 1:
        return "#FFFFFF"; // Wall
      case 2:
        return "#FF0000"; // Landing pad
      default:
        return "#AAAAAA"; // Default color
    }
  }

  draw(ctx, offsetX, offsetY) {
    
    ctx.fillStyle = "#4CFF4C";
    for (const wall of this.walls) {
      const screenX = wall.x - offsetX;
      const screenY = wall.y - offsetY;

      // Only draw if on screen (rough culling)
      if (
        screenX < -this.cellSize ||
        screenX > this.scene.game.canvas.width ||
        screenY < -this.cellSize ||
        screenY > this.scene.game.canvas.height
      ) {
        continue;
      }

      ctx.fillRect(screenX, screenY, wall.width, wall.height);
    }

    
    // Draw landing pads
    ctx.fillStyle = "#FF4C4C";
    for (const pad of this.landingPads) {
      const screenX = pad.x - offsetX;
      const screenY = pad.y - offsetY;

      if (
        screenX < -pad.width ||
        screenX > this.scene.game.canvas.width ||
        screenY < -this.cellSize ||
        screenY > this.scene.game.canvas.height
      ) {
        continue;
      }

      ctx.fillRect(screenX, screenY, pad.width, this.cellSize);
    }
  }

  // Draw minimap
  drawMinimap(ctx) {
    const scaleX = this.scene.game.minimapCanvas.width / this.WORLD_WIDTH;
    const scaleY = this.scene.game.minimapCanvas.height / this.WORLD_HEIGHT;

    // Clear minimap
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.scene.game.minimapCanvas.width, this.scene.game.minimapCanvas.height);

    // Draw walls
    ctx.fillStyle = "#4CFF4C";
    for (const wall of this.walls) {
      ctx.fillRect(
        wall.x * scaleX,
        wall.y * scaleY,
        this.cellSize * scaleX,
        this.cellSize * scaleY
      );
    }

    // Draw landing pads
    ctx.fillStyle = "#FF4C4C";
    for (const pad of this.landingPads) {
      ctx.fillRect(
        pad.x * scaleX,
        pad.y * scaleY,
        pad.width * scaleX,
        this.cellSize * scaleY
      );
    }

    // Draw pod
    if (!this.scene.ship.hasPod) {
      ctx.fillStyle = "#A0A0FF";
      ctx.fillRect(
        this.scene.pod.x * scaleX - 1,
        this.scene.pod.y * scaleY - 1,
        3,
        3
      );
    }

    // Draw enemies
    ctx.fillStyle = "#FF0000";
    for (const enemy of this.scene.enemies) {
      ctx.fillRect(enemy.x * scaleX - 1, enemy.y * scaleY - 1, 3, 3);
    }

    // Draw ship
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      this.scene.ship.x * scaleX - 2,
      this.scene.ship.y * scaleY - 2,
      4,
      4
    );

    // Draw viewport rectangle
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.scene.offsetX * scaleX,
      this.scene.offsetY * scaleY,
      this.scene.game.canvas.width * scaleX,
      this.scene.game.canvas.height * scaleY
    );
  }
}
