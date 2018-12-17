
export class StartScene extends Phaser.Scene {

  constructor() {
    super({
      key: "StartScene"
    });
  }

  preload(): void {

    this.load.image("title","./src/assets/title.png");
    this.load.atlas('flares', './src/assets/flares.png', './src/assets/flares.json');
    this.load.audio('travels', ['./src/assets/travels.mp3']);
    this.load.audio('boogie', ['./src/assets/boogie.mp3']);
    this.load.audio('travels2', ['./src/assets/travels2.mp3']);
    this.load.audio('hop1', ['./src/assets/hop1.mp3']);
    this.load.audio('hop2', ['./src/assets/hop2.mp3']);
    this.load.audio('record', ['./src/assets/record.mp3']);
    this.load.audio('squeezed', ['./src/assets/squeezed.mp3']);
    this.load.audio('drowned', ['./src/assets/drowned.mp3']);
  }

  init(): void {
 
  }

  create(): void {

      this.input.once('pointerdown', () => {
        this.scene.stop('StartScene');
        this.scene.manager.getScene('GameScene').scene.restart();
    }, this);

    this.sound.add('travels');
    this.sound.add('boogie');
    this.sound.add('travels2');
    this.sound.add('hop1');
    this.sound.add('hop2');
    this.sound.add('record');
    this.sound.add('squeezed');
    this.sound.add('drowned');
    this.sound.play('travels');
  
    var title = this.add.image(-1000, this.sys.canvas.height/2.5, 'title').setScale(0.4);

    let gameOverText = this.add.text(
      -1000,
      title.getTopLeft().y+200,
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
      var flares = this.add.particles('flares');
      flares.createEmitter({
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
        targets: title,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    },2000)

  this.tweens.add({
      targets: title,
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
