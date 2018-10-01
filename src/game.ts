/// <reference path="../phaser.d.ts"/>

import "phaser";
import { GameScene } from "./scenes/game-scene";
import { GameoverScene } from "./scenes/gameover-scene";

const config: GameConfig = {
  title: "Coin Runner",
  version: "1.0.0",
  width: 750,
  height: 1334,
  type: Phaser.AUTO,
  parent: "game",
  scene: [GameScene, GameoverScene],
  input: {
    keyboard: true
  },
  backgroundColor: "#71859e",
  pixelArt: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};
