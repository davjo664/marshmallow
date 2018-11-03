
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

    // Store
    console.log(data.climbed)
    console.log(localStorage.getItem("highscore"));
    if (!localStorage.getItem("highscore") || data.climbed > parseFloat(localStorage.getItem("highscore"))) {
      console.log("YES");
      localStorage.setItem("highscore", data.climbed);
    }

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

    let highestScore = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+100,
      "Personal best ",
      {
        fontFamily: "Arial Black",
        fontSize: 40,
        fill: "#bbb"
      }
    )

    let highestScore2 = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+150,
      localStorage.getItem("highscore") + "",
      {
        fontFamily: "Arial Black",
        fontSize: 40,
        fill: "#000"
      }
    )

    let climbedScore = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+200,
      "You climbed " + "",
      {
        fontFamily: "Arial Black",
        fontSize: 40,
        fill: "#bbb"
      }
    )

    let climbedScore2 = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+250,
       data.climbed + "",
      {
        fontFamily: "Arial Black",
        fontSize: 40,
        fill: "#000"
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
      targets: highestScore,
      x: this.sys.canvas.width/2-highestScore.displayWidth/2,
      ease: 'Elastic',
      easeParams: [ 2.0, 3.2 ],
      duration: 2000
  });

  this.tweens.add({
      targets: highestScore2,
      x: this.sys.canvas.width/2-highestScore2.displayWidth/2,
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

  this.tweens.add({
    targets: climbedScore2,
    x: this.sys.canvas.width/2-climbedScore2.displayWidth/2,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
  });

  }


  update(): void {

  }
}
