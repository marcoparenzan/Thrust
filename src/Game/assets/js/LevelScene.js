import Ship from './Ship.js';
import TerrainLayer from './TerrainLayer.js';

export default class LevelScene {
  
  constructor(game) {
    this.game = game;
  }

  load(data) {

    this.tileSize = data.tileSize || 40; // Size of each tiles cell
    this.canvasWidth = data.canvasWidth || 72; // Width of the tiles in cells
    this.canvasHeight = data.canvasHeight || 167; // Height of the tiles in cells
    this.WORLD_WIDTH = this.canvasWidth * this.tileSize;
    this.WORLD_HEIGHT = this.canvasHeight * this.tileSize;

    // Create terrain first
    this.terrain = new TerrainLayer(this);
    const terrainLayer = data.layers.find(layer => layer.name === "Terrain");
    this.terrain.load(terrainLayer);

    this.gravity = data.gravity || 0.05;


    const playerLayer = data.layers.find(layer => layer.name === "Player");
    const shipSprite = playerLayer.data.find(sprite => sprite.type === "ship");
    this.ship = new Ship(this, shipSprite);

    // Init viewport offset
    this.resize();
  }

  resize() {
    this.offsetX = Math.max(0, this.ship.x - this.game.canvas.width / 2);
    this.offsetY = Math.max(0, this.ship.y - this.game.canvas.height / 2);
  }
  
  color(value) {
    return [
      "transparent", // 0 striped transparent
      "#000000", // 1 Black
      "#FFFFFF", // 2 White
      "#880000", // 3 Red
      "#AAFFEE", // 4 Cyan
      "#CC44CC", // 5 Purple
      "#00CC55", // 6 Green
      "#0000AA", // 7 Blue
      "#EEEE77", // 8 Yellow
      "#DD8855", // 9 Orange
      "#664400", // 10 Brown
      "#FF7777", // 11 Light red
      "#333333", // 12 Dark gray
      "#777777", // 13 Medium gray
      "#AAFF66", // 14 Light green
      "#0088FF", // 15 Light blue (excluded from palette below)
    ][value];
  }

  update() {
    if (this.game.gameOver) return;

    this.ship.update();

    // Check collision with terrain
    this.checkCollision();

    this.offsetX = Math.max(
      0,
      Math.min(this.WORLD_WIDTH - this.game.canvas.width, this.ship.x - this.game.canvas.width / 2)
    );
    this.offsetY = Math.max(
      0,
      Math.min(this.WORLD_HEIGHT - this.game.canvas.height, this.ship.y - this.game.canvas.height / 2)
    );
  }

  checkCollision() {
    // Check collision with cave walls
    const tileSize = this.tileSize;
    const shipLeft = this.ship.x - this.ship.width / 2;
    const shipRight = this.ship.x + this.ship.width / 2;
    const shipTop = this.ship.y - this.ship.height / 2;
    const shipBottom = this.ship.y + this.ship.height / 2;

    // Get grid cells the ship might be colliding with
    const gridXStart = Math.floor(shipLeft / tileSize);
    const gridXEnd = Math.floor(shipRight / tileSize);
    const gridYStart = Math.floor(shipTop / tileSize);
    const gridYEnd = Math.floor(shipBottom / tileSize);

    let collidingWithBackground = false;
    let collidingWithLandingPad = false;
    let landingPadY = 0;

    // Check each potential grid cell
    for (let y = gridYStart; y <= gridYEnd; y++) {
      for (let x = gridXStart; x <= gridXEnd; x++) {
        // Check grid boundaries
        if (
          y < 0 ||
          x < 0 ||
          y >= this.terrain.tiles.length ||
          x >= this.terrain.tiles[0].length
        ) {
          continue;
        }

        if (this.terrain.tiles[y][x] === 1) {
          // Background collision
          collidingWithBackground = true;
        } else if (this.terrain.tiles[y][x] === 3) {
          // Landing pad
          collidingWithLandingPad = true;
          landingPadY = y * tileSize;
        }
      }
    }

    if (collidingWithBackground) {
      // Handle wall collision
      this.game.gotoEnd("CRASHED INTO BACKGROUND!");
    } else if (collidingWithLandingPad) {
      // Check for proper landing
      const shipBottomY = this.ship.y + this.ship.height / 2;
      const distanceToLandingPad = Math.abs(shipBottomY - landingPadY);

      if (
        distanceToLandingPad < 5 &&
        Math.abs(this.ship.velocityY) < 0.8 &&
        Math.abs(Math.sin(this.ship.rotation)) < 0.1
      ) {
        // Successful landing
        this.ship.velocityX = 0;
        this.ship.velocityY = 0;
        this.ship.y = landingPadY - this.ship.height / 2;

        // Award points
        this.score += this.ship.hasPod ? 500 : 100;

        // Refuel
        this.ship.fuel = 100;

        // If has pod and lands, complete mission
        if (this.ship.hasPod) {
          this.game.gotoNext();
        }
      } else if (
        Math.abs(this.ship.velocityY) >= 0.8 ||
        Math.abs(Math.sin(this.ship.rotation)) >= 0.1
      ) {
        // Bad landing
        this.game.gotoEnd("CRASH LANDING!");
      }
    }

    // Also check if ship goes outside world bounds
    if (
      this.ship.x < 0 ||
      this.ship.x > this.WORLD_WIDTH ||
      this.ship.y < 0 ||
      this.ship.y > this.WORLD_HEIGHT
    ) {
      this.game.gotoEnd("OUT OF BOUNDS!");
    }
  }

  draw(ctx) {

    // Draw game world
    this.terrain.draw(ctx, this.offsetX, this.offsetY);

    // Draw ship (always centered)
    this.ship.draw(ctx, this.offsetX, this.offsetY);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${this.game.score} | FUEL: ${Math.floor(this.ship.fuel)}% | VELOCITY: ${Math.floor(this.ship.velocityX)},${Math.floor(this.ship.velocityY)}%`, 20, 20);
  }
  
  // Draw map
  drawMap(ctx) {
    const scaleX = this.game.mapCanvas.width / this.WORLD_WIDTH;
    const scaleY = this.game.mapCanvas.height / this.WORLD_HEIGHT;

    // Clear map
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(
      0,
      0,
      this.game.mapCanvas.width,
      this.game.mapCanvas.height
    );

    // Draw backgroundTiles
    ctx.fillStyle = "#4CFF4C";
    for (const backgroundTile of this.terrain.geometryTiles) {
      ctx.fillRect(
        backgroundTile.x * scaleX,
        backgroundTile.y * scaleY,
        this.tileSize * scaleX,
        this.tileSize * scaleY
      );
    }

    // Draw ship
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      this.ship.x * scaleX - 2,
      this.ship.y * scaleY - 2,
      4,
      4
    );

    // Draw viewport rectangle
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.offsetX * scaleX,
      this.offsetY * scaleY,
      this.game.canvas.width * scaleX,
      this.game.canvas.height * scaleY
    );
  }
}
