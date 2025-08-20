export default class BeginScene {

  constructor(game) {
    this.game = game;

    this.resize();
  }

  resize() {
  }

  update() {
    if (this.game.keys.space || this.game.keys.up) {
      this.game.gotoLevel('assets/js/levels/06/LevelScene.json');
    }
  }

  draw(ctx, mapCtx) {

    // Draw stars (terrain)
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * this.game.canvas.width,
        Math.random() * this.game.canvas.height,
        1,
        1
      );
    }

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    ctx.fillStyle = "#FF0000";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THRUST", this.game.canvas.width / 2, this.game.canvas.height / 2 - 40);
    // ctx.fillText(this.message, this.game.canvas.width / 2, this.game.canvas.height / 2);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px monospace";
    ctx.fillText(
      "Press SPACE to start",
      this.game.canvas.width / 2,
      this.game.canvas.height / 2 + 60
    );
    
  }

  reset() {
    this.initializeWorld();
  }
}
