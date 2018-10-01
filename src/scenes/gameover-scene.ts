
export class GameoverScene extends Phaser.Scene {

  constructor() {
    super({
      key: "GameoverScene"
    });
  }

  preload(): void {

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

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
     //  Inject our CSS
     var element = document.createElement('style');

     document.head.appendChild(element);
 
     var sheet:any = element.sheet;
 
     var styles = '@font-face { font-family: "troika"; src: url("assets/fonts/ttf/troika.otf") format("opentype"); }\n';
 
     sheet.insertRule(styles, 0);
 
     styles = '@font-face { font-family: "Caroni"; src: url("assets/fonts/ttf/caroni.otf") format("opentype"); }';
 
     sheet.insertRule(styles, 0);
 
  }

  create(data): void {



    var add = this.add;
    var input = this.input;

    // var a: any = WebFont;

    // WebFont.load({
    //     custom: {
    //         families: [ 'troika', 'Caroni' ]
    //     },
    //     active: function ()
    //     {
    //         add.text(32, 32, 'The face of the\nmoon was in\nshadow.', { fontFamily: 'troika', fontSize: 80, color: '#ff0000' }).setShadow(2, 2, "#333333", 2, false, true);

    //         add.text(150, 350, 'Waves flung themselves\nat the blue evening.', { fontFamily: 'Caroni', fontSize: 64, color: '#5656ee' });
    //     }
    // });

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
        fontFamily: "troika",
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
        fontFamily: "Connection",
        fontSize: 30,
        fill: "#000000"
      }
    )

    let climbedScore = this.add.text(
      -this.sys.canvas.width,
      planet.getTopLeft().y+150,
      data.climbed + "",
      {
        fontFamily: "Connection",
        fontSize: 50,
        fill: "#000000"
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
