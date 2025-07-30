export default class Terrain {
  constructor(scene)  {
    this.scene = scene;
    this.generateCaves();
  }

  generateCaves() {
    this.grid = [];
    const cellSize = 40; // Size of each grid cell
    const gridWidth = Math.ceil(this.scene.WORLD_WIDTH / cellSize);
    const gridHeight = Math.ceil(this.scene.WORLD_HEIGHT / cellSize);

    // Initialize grid with more open space
    for (let y = 0; y < gridHeight; y++) {
      this.grid[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        // Make edges always walls
        if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1) {
          this.grid[y][x] = 1; // Wall
        } else {
          // Reduce wall probability from 0.45 to 0.30
          this.grid[y][x] = Math.random() < 0.3 ? 1 : 0;
        }
      }
    }

    // Cellular automata to create caves
    for (let iteration = 0; iteration < 5; iteration++) {
      const newGrid = JSON.parse(JSON.stringify(this.grid));

      for (let y = 1; y < gridHeight - 1; y++) {
        for (let x = 1; x < gridWidth - 1; x++) {
          let walls = 0;

          // Count walls in 3x3 neighborhood
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (this.grid[y + dy][x + dx] === 1) {
                walls++;
              }
            }
          }

          // Modified rule for more open space
          if (walls > 5) {
            // Increased from 4 to 5
            newGrid[y][x] = 1; // Create wall
          } else if (walls < 4) {
            // Increased from 3 to 4
            newGrid[y][x] = 0; // Create open space
          }
        }
      }

      this.grid = newGrid;
    }

    // Create larger passages by removing some walls
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        // Randomly remove some walls to create more open space
        if (this.grid[y][x] === 1 && Math.random() < 0.2) {
          this.grid[y][x] = 0;
        }
      }
    }

    // Create landing pads
    this.landingPads = [];
    for (let i = 0; i < 3; i++) {
      let padX, padY;
      let found = false;

      // Find valid landing pad locations
      while (!found) {
        padX = Math.floor(Math.random() * (gridWidth - 10)) + 5;
        padY = Math.floor(Math.random() * (gridHeight - 10)) + 5;

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
            x: (padX + 1) * cellSize,
            y: padY * cellSize,
            width: 3 * cellSize,
          });
        }
      }
    }

    // Convert grid to polygons for efficient drawing and collision
    this.walls = [];
    this.cellSize = cellSize;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (this.grid[y][x] === 1) {
          this.walls.push({
            x: x * cellSize,
            y: y * cellSize,
            width: cellSize,
            height: cellSize,
          });
        }
      }
    }
  }

  draw(ctx, offsetX, offsetY) {
    // Draw walls
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
    const scaleX = this.scene.game.minimapCanvas.width / this.scene.WORLD_WIDTH;
    const scaleY = this.scene.game.minimapCanvas.height / this.scene.WORLD_HEIGHT;

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
