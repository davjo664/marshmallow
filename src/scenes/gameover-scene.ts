
export class GameoverScene extends Phaser.Scene {

  constructor() {
    super({
      key: "GameoverScene"
    });
  }

  preload(): void {

    this.load.image("background","./src/assets/background.png");
    this.load.image("player", "./src/assets/rundare.png");
    this.load.image("block", "./src/assets/block.png");
    this.load.image("coin", "./src/assets/coin.png");
    this.load.image("floor", "./src/assets/floor.png");
    this.load.image("normalmap", "./src/assets/normalmap.png");
    this.load.spritesheet('dude', 
        './src/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }

  init(): void {
 
  }

  create(): void {
  }


  update(): void {

  }
}
