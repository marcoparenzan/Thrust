import LevelScene from "./LevelScene.js";
import BeginScene from "./levels/BeginScene.js";
import EndScene from "./levels/EndScene.js";

export default class Game {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.mapCanvas = opts.mapCanvas;
    this.reset();
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

  resize() {
    if (!this.currentScene) return;

    this.currentScene.resize();
  }

  reset() {
    this.resetKeyboard();

    this.gameOver = false;
    this.score = 0;

    this.currentScene = new BeginScene(this);
  }

  draw(ctx, mapCtx) {
    if (!this.currentScene) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.currentScene.draw(ctx);
    // Draw map
    if (!this.currentScene.terrain) return;
    this.currentScene.drawMap(mapCtx);
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
      this.currentScene = new LevelScene(this);
      this.currentScene.load(data);
    });
  }

  gotoEnd(message) {
    this.resetKeyboard();
    this.currentScene = new EndScene(this);
    this.currentScene.message = message;
  }
}
