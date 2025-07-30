import LevelScene from './LevelScene.js';
import EndScene from './EndScene.js';

export default class Game {
  
  constructor(opts) {
    this.canvas = opts.canvas;
    this.minimapCanvas = opts.minimapCanvas;
    this.fuelDisplay = opts.fuelDisplay;
    this.scoreDisplay = opts.scoreDisplay;

    this.keys = {
      left: false,
      right: false,
      up: false,
      space: false,
    };
    this.gameOver = false;
    this.score = 0;

    this.levelScene = new LevelScene(this);
    this.endScene = new EndScene(this);

    this.currentScene = this.levelScene;
  }

  update() {
    if (this.gameOver) return;

    this.currentScene.update();
  }

  reset() {
    this.currentScene = this.levelScene;

    this.currentScene.reset();
    this.gameOver = false;
    this.fuelDisplay.textContent = this.scene.ship.fuel;
  }

  draw(ctx, minimapCtx) {
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene.draw(ctx, minimapCtx);
  }

  end(message) {
    this.currentScene = this.endScene;
    this.currentScene.message = message;
  }
}
