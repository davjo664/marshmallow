/// <reference path="../phaser.d.ts"/>

import "phaser";
import { GameScene } from "./scenes/game-scene";
import { GameoverScene } from "./scenes/gameover-scene";
import { StartScene } from "./scenes/start-scene";

const config: GameConfig = {
  title: "Coin Runner",
  version: "1.0.0",
  type: Phaser.AUTO,
  parent: "game",
  scene: [StartScene, GameScene, GameoverScene],
  input: {
    keyboard: true
  },
  backgroundColor: "#71859e",
  pixelArt: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    this.resize(window.innerWidth, window.innerHeight);
    window.onresize = () => {
      // location.reload();
    }
  }
}

window.onload = () => {
  var game = new Game(config);
};
