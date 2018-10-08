
export class GameoverScene extends Phaser.Scene {

  constructor() {
    super({
      key: "GameoverScene"
    });
  }

  preload(): void {

    this.load.image("square","./src/assets/square.png");
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

  create(data): void {

    this.input.once('pointerdown', () => {
      console.log("START");
      this.scene.stop('GameoverScene');
      this.scene.manager.getScene('GameScene').scene.restart();
      
      // this.scene.start('GameScene');
      // this.scene.launch('GameScene');

  }, this);

    var planet = this.add.image(-1000, this.sys.canvas.height/2, 'square').setScale(0.6,0.4);

    let gameOverText = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y-80,
      "HIGHSCORES" + "",
      {
        fontFamily: "Arial",
        fontSize: 50,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    )

    let climbedText = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+50,
      "YOU CLIMBED:" + "",
      {
        fontFamily: "Arial",
        fontSize: 30,
        fill: "#000000"
      }
    )

    let climbedScore = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+150,
      data.climbed + "",
      {
        fontFamily: "Arial Black",
        fontSize: 80,
        fill: "#b7b7b7"
      }
    )

  this.tweens.add({
    targets: planet,
    x: this.sys.canvas.width/2,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
  });

  this.tweens.add({
      targets: gameOverText,
      x: this.sys.canvas.width/2-gameOverText.displayWidth/2,
      ease: 'Elastic',
      easeParams: [ 2.0, 3.2 ],
      duration: 2000
  });

  this.tweens.add({
      targets: climbedText,
      x: this.sys.canvas.width/2-climbedText.displayWidth/2,
      ease: 'Elastic',
      easeParams: [ 2.0, 3.2 ],
      duration: 2000
  });

  this.tweens.add({
    targets: climbedScore,
    x: this.sys.canvas.width/2-climbedScore.displayWidth/2,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
});

  }


  update(): void {

  }
}
