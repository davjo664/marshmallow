
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
    this.load.image("floor", "./src/assets/floor.png");
    this.load.image("bar", "./src/assets/bar.png");
    this.load.image("pointer", "./src/assets/pointer.png");
    this.load.image("superjump", "./src/assets/superjump.png");
    this.load.atlas('flares', './src/assets/flares.png', './src/assets/flares.json');
  }

  init(): void {
 
  }

  create(data): void {
    setTimeout(()=> {
      this.sound.pauseAll();
      this.sound.play('travels2');
    },1000)

    // Store
    if (!localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", "0");
      localStorage.setItem("totalClimbed", "0");
    }
    if (data.climbed > parseFloat(localStorage.getItem("highscore"))) {
      localStorage.setItem("highscore", data.climbed);
    }
    let prevTotalClimbed = parseFloat(localStorage.getItem("totalClimbed"));
    let newTotal = parseFloat(localStorage.getItem("totalClimbed"))+parseFloat(data.climbed);
    localStorage.setItem("totalClimbed", newTotal.toString());

    this.input.once('pointerdown', () => {
      console.log("START");
      if (localStorage.getItem("fuel") === "100" && square.alpha == 1) {
        this.tweens.add({
          targets: square,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: bar,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: pointer,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: highestScore,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: highestScore2,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: climbedScore2,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: superjump,
          alpha: 1,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: superjump,
          scaleX: 2,
          scaleY:2,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        
        var particles = this.add.particles('flares');
        var emitter1 = particles.createEmitter({
          frame: 'yellow',
          x: this.sys.canvas.width/2, y: this.sys.canvas.height/2,
          speed: 200,
          blendMode: 'ADD',
          lifespan: 1000
      });
    
      var emitter2 = particles.createEmitter({
          frame: 'yellow',
          x: this.sys.canvas.width/2, y: this.sys.canvas.height/2,
          speed: 200,
          scale: 0.5,
          blendMode: 'ADD',
          lifespan: 2000
      });
    
      var emitter3 = particles.createEmitter({
          frame: 'yellow',
          x: this.sys.canvas.width/2, y: this.sys.canvas.height/2,
          speed: 200,
          scale: { min: 0, max: 1 },
          blendMode: 'ADD',
          lifespan: 2500
      });
      this.input.once('pointerdown', () => {
        this.scene.stop('GameoverScene');
        this.scene.manager.getScene('GameScene').scene.restart();
      });
      } else {
        this.scene.stop('GameoverScene');
        this.scene.manager.getScene('GameScene').scene.restart();
      }
      
      // this.scene.start('GameScene');
      // this.scene.launch('GameScene');

  }, this);
  
    let floorImage = new Phaser.GameObjects.Image(this,0,0,'square');
    let scaleX = this.sys.canvas.width/2/floorImage.width;
    let scaleY = this.sys.canvas.height/2/floorImage.height;

    var square = this.add.image(-1000, this.sys.canvas.height/2, 'square').setScale(scaleX,scaleY);

    floorImage = new Phaser.GameObjects.Image(this,0,0,'superjump');
    scaleX = this.sys.canvas.width/4/floorImage.width;
    scaleY = this.sys.canvas.height/4/floorImage.height;

    var superjump = this.add.image(this.sys.canvas.width/2, this.sys.canvas.height/2, 'superjump').setScale(scaleX,scaleX);
    superjump.setAlpha(0);

    superjump.setDepth(1);


    floorImage = new Phaser.GameObjects.Image(this,0,0,'bar');
    scaleX = this.sys.canvas.width/3/floorImage.width;

    var bar = this.add.image(0, square.getCenter().y, 'bar').setScale(scaleX,scaleX);
    bar.setX(-bar.displayWidth/2);

    floorImage = new Phaser.GameObjects.Image(this,0,0,'pointer');
    scaleX = this.sys.canvas.width/30/floorImage.width;

    var pointer = this.add.image(0, 0, 'pointer').setScale(scaleX,scaleX);
    pointer.setY(bar.getBottomLeft().y);

    let climbedScore2 = this.add.text(
      0,
      0,
       "You climbed: " + data.climbed + "",
      {
        fontFamily: "Arial Black",
        fontSize: this.sys.canvas.width/30,
        fill: "#000"
      }
    )
    climbedScore2.setY(square.getTopLeft().y+climbedScore2.displayHeight);
    
    let count = 0;
    this.time.addEvent({ delay: 500/data.climbed, callback: () => {
        climbedScore2.setText("You climbed: " + count.toString());
        count++;
    }, callbackScope: this, repeat: data.climbed ? data.climbed : 0 });

    let highestScore = this.add.text(
      -this.sys.canvas.width,
      0,
      "Personal best ",
      {
        fontFamily: "Arial Black",
        fontSize: this.sys.canvas.width/60,
        fill: "#bbb"
      }
    )
    highestScore.setY(bar.getBottomLeft().y+square.displayHeight/8);

    let highestScore2 = this.add.text(
      -this.sys.canvas.width,
      0,
      localStorage.getItem("highscore") + "",
      {
        fontFamily: "Arial Black",
        fontSize: this.sys.canvas.width/50,
        fill: "#000"
      }
    )

    highestScore2.setY(bar.getBottomLeft().y+square.displayHeight/8+highestScore2.displayHeight);

  this.tweens.add({
    targets: square,
    x: this.sys.canvas.width/2,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
  });

  this.tweens.add({
    targets: bar,
    x: this.sys.canvas.width/2,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
  });

  console.log(prevTotalClimbed);
  console.log(parseFloat(localStorage.getItem("totalClimbed")))

  let barStartPostX = this.sys.canvas.width/2-bar.displayWidth/2+pointer.displayWidth/2;
  let pointerStartPosX = barStartPostX + (bar.displayWidth-pointer.displayWidth)/1000 * prevTotalClimbed;
  let pointerEndPosX = barStartPostX + (bar.displayWidth-pointer.displayWidth)/1000 * parseFloat(localStorage.getItem("totalClimbed")) ;

  if (parseFloat(localStorage.getItem("totalClimbed")) > 500) {
  //   console.log("yesh");
    pointerEndPosX = barStartPostX+bar.displayWidth-pointer.displayWidth;
    localStorage.setItem("totalClimbed", "0");
    if (localStorage.getItem("fuel") == undefined) {
      localStorage.setItem("superJumpTutorial", "1");
    }
    localStorage.setItem("fuel", "100");
  }

  this.tweens.add({
    targets: pointer,
    x: pointerStartPosX,
    ease: 'Elastic',
    easeParams: [ 2.0, 3.2 ],
    duration: 2000
  });

  setTimeout(()=> {
    this.tweens.add({
      targets: pointer,
      x: pointerEndPosX,
      duration: 1000
    });
  },2000)

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
