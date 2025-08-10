import Scene from "./Scene.js";
import BeginScene from "./levels/BeginScene.js";
import EndScene from "./levels/EndScene.js";

export default class Game {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.minimapCanvas = opts.minimapCanvas;
    this.fuelDisplay = opts.fuelDisplay;
    this.scoreDisplay = opts.scoreDisplay;
  }

  update() {
    if (this.gameOver) return;
    if (!this.currentScene) return;

    this.currentScene.update();
  }

  resetKeyboard(){
    this.keys = {
      left: false,
      right: false,
      up: false,
      space: false,
    };
  }

  reset() {
    this.resetKeyboard();

    this.gameOver = false;
    this.score = 0;

    this.currentScene = new BeginScene(this);
  }

  draw(ctx, minimapCtx) {
    if (!this.currentScene) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene.draw(ctx);
    // Draw minimap
    if (!this.currentScene.terrain) return;
    this.currentScene.terrain.drawMinimap(minimapCtx);
  }

  loadJSON(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  gotoLevel(url) {
    this.resetKeyboard();
    this.loadJSON(url).then((data) => {
      this.currentScene = new Scene(this);
      this.currentScene.load(data);

      this.fuelDisplay.textContent = this.currentScene.ship.fuel;
    });
  }

  gotoEnd(message) {
    this.resetKeyboard();
    this.currentScene = new EndScene(this);
    this.currentScene.message = message;
  }
}
