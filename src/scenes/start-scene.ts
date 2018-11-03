
export class StartScene extends Phaser.Scene {

  constructor() {
    super({
      key: "StartScene"
    });
  }

  preload(): void {

    this.load.image("title","./src/assets/title.png");
    this.load.atlas('flares', './src/assets/flares.png', './src/assets/flares.json');
  }

  init(): void {
 
  }

  create(): void {

      this.input.once('pointerdown', () => {
        console.log("START");
        this.scene.stop('StartScene');
        this.scene.manager.getScene('GameScene').scene.restart();
        
        // this.scene.start('GameScene');
        // this.scene.launch('GameScene');

    }, this);
  

    var planet = this.add.image(-1000, this.sys.canvas.height/2.5, 'title').setScale(0.4);

    let gameOverText = this.add.text(
      -1000,
      planet.getTopLeft().y+200,
      "TOUCH TO PLAY",
      {
        fontFamily: "Arial",
        fontSize: 40,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    )

    setTimeout(()=> {
      var planet = this.add.particles('flares');
      planet.createEmitter({
        frame: [ 'white', 'red', 'yellow', 'blue', 'green' ],
        x: this.sys.canvas.width/2,
        y: this.sys.canvas.height/2.5,
        lifespan: 4000,
        speed: 200,
        scale: { start: 0.1, end: 0 },
        blendMode: 'ADD'
    });

    },2000)

    setTimeout(()=> {
      this.tweens.add({
        targets: planet,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    },2000)

  this.tweens.add({
      targets: planet,
      x: this.sys.canvas.width/2,
      ease: 'Elastic',
      easeParams: [ 2.0, 3.2 ],
      duration: 2000
  });

  setTimeout(()=> {
    this.tweens.add({
      targets: gameOverText,
      alpha: 0.2,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
  });

  },2000)
  

  this.tweens.add({
      targets: gameOverText,
      x: this.sys.canvas.width/2-gameOverText.width/2,
      ease: 'Elastic',
      easeParams: [ 2.0, 3.2 ],
      duration: 3000,
  });

  

  }


  update(): void {

  }
}
