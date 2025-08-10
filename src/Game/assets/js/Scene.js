import Ship from './Ship.js';
import Pod from './Pod.js';
import Turret from './Turret.js';
import Patrol from './Patrol.js';
import Terrain from './Terrain.js';

export default class Scene {
  
  constructor(game) {
    this.game = game;
  }

  load(data) {

    // Create terrain first
    this.terrain = new Terrain(this);
    this.terrain.load(data);

    this.gravity = data.gravity || 0.05;

    // Find a good starting position for the ship (open space)
    let shipX, shipY;
    shipX = data.shipX || 300;
    shipY = data.shipY || 100;

    this.ship = new Ship(this, shipX, shipY);

    // Place pod near a landing pad
    const padIndex = Math.floor(
      Math.random() * this.terrain.landingPads.length
    );
    const pad = this.terrain.landingPads[padIndex];
    this.pod = new Pod(this, pad.x + pad.width / 2, pad.y - 20);

    // Create enemies
    this.enemies = [];

    // // Add turrets near landing pads
    // for (let i = 0; i < this.terrain.landingPads.length; i++) {
    //   const pad = this.terrain.landingPads[i];

    //   // Add 2 turrets per landing pad
    //   for (let j = 0; j < 2; j++) {
    //     let enemyX, enemyY;
    //     let validPosition = false;

    //     // Try to find valid positions
    //     for (let attempts = 0; attempts < 10 && !validPosition; attempts++) {
    //       // Place turrets near landing pads
    //       enemyX = pad.x + pad.width / 2 + (Math.random() - 0.5) * 300;
    //       enemyY = pad.y + (Math.random() - 0.5) * 300;

    //       // Validate position is not inside a wall
    //       validPosition = !this.isPositionSolid(enemyX, enemyY);
    //     }

    //     if (validPosition) {
    //       this.enemies.push(new Turret(this, enemyX, enemyY));
    //     }
    //   }
    // }

    // // Add patrolling enemies
    // for (let i = 0; i < 10; i++) {
    //   let enemyX, enemyY;
    //   let validPosition = false;

    //   // Try to find valid positions
    //   for (let attempts = 0; attempts < 10 && !validPosition; attempts++) {
    //     enemyX = Math.random() * (this.terrain.WORLD_WIDTH - 400) + 200;
    //     enemyY = Math.random() * (this.terrain.WORLD_HEIGHT - 400) + 200;

    //     // Validate position is not inside a wall
    //     validPosition = !this.isPositionSolid(enemyX, enemyY);
    //   }

    //   if (validPosition) {
    //     this.enemies.push(new Patrol(this, enemyX, enemyY));
    //   }
    // }

    // Init viewport offset
    this.offsetX = Math.max(0, this.ship.x - this.game.canvas.width / 2);
    this.offsetY = Math.max(0, this.ship.y - this.game.canvas.height / 2);
  }

  update() {
    if (this.game.gameOver) return;

    this.ship.update();

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update();
    }

    // Check collision with terrain
    this.checkCollision();

    // Check for pod pickup
    if (
      !this.ship.hasPod &&
      Math.abs(this.ship.x - this.pod.x) < 30 &&
      Math.abs(this.ship.y - this.pod.y) < 30
    ) {
      this.ship.hasPod = true;
    }

    // Check for mission complete (exit at top with pod)
    if (this.ship.hasPod && this.ship.y < 50) {
      this.game.score += 1000;
      this.game.scoreDisplay.textContent = this.score;
      this.game.reset();
    }

    // Update viewport offset (camera follows ship)
    this.offsetX = Math.max(
      0,
      Math.min(this.terrain.WORLD_WIDTH - this.game.canvas.width, this.ship.x - this.game.canvas.width / 2)
    );
    this.offsetY = Math.max(
      0,
      Math.min(this.terrain.WORLD_HEIGHT - this.game.canvas.height, this.ship.y - this.game.canvas.height / 2)
    );
  }

  checkCollision() {
    // Check collision with cave walls
    const cellSize = this.terrain.cellSize;
    const shipLeft = this.ship.x - this.ship.width / 2;
    const shipRight = this.ship.x + this.ship.width / 2;
    const shipTop = this.ship.y - this.ship.height / 2;
    const shipBottom = this.ship.y + this.ship.height / 2;

    // Get grid cells the ship might be colliding with
    const gridXStart = Math.floor(shipLeft / cellSize);
    const gridXEnd = Math.floor(shipRight / cellSize);
    const gridYStart = Math.floor(shipTop / cellSize);
    const gridYEnd = Math.floor(shipBottom / cellSize);

    let collidingWithWall = false;
    let onLandingPad = false;
    let landingPadY = 0;

    // Check each potential grid cell
    for (let y = gridYStart; y <= gridYEnd; y++) {
      for (let x = gridXStart; x <= gridXEnd; x++) {
        // Check grid boundaries
        if (
          y < 0 ||
          x < 0 ||
          y >= this.terrain.grid.length ||
          x >= this.terrain.grid[0].length
        ) {
          continue;
        }

        if (this.terrain.grid[y][x] === 1) {
          // Wall collision
          collidingWithWall = true;
        } else if (this.terrain.grid[y][x] === 3) {
          // Landing pad
          onLandingPad = true;
          landingPadY = y * cellSize;
        }
      }
    }

    if (collidingWithWall) {
      // Handle wall collision
      this.game.gotoEnd("CRASHED INTO WALL!");
    } else if (onLandingPad) {
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
        this.game.scoreDisplay.textContent = this.score;

        // Refuel
        this.ship.fuel = 100;
        this.game.fuelDisplay.textContent = "100";

        // If has pod and lands, complete mission
        if (this.ship.hasPod) {
          this.game.reset();
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

    // Draw stars (background)
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * this.game.canvas.width,
        Math.random() * this.game.canvas.height,
        1,
        1
      );
    }

    // Draw game world
    this.terrain.draw(ctx,this.offsetX, this.offsetY);
    this.pod.draw(ctx,this.offsetX, this.offsetY);

    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(ctx,this.offsetX, this.offsetY);
    }

    // Draw ship (always centered)
    this.ship.draw(ctx);
  }
}
