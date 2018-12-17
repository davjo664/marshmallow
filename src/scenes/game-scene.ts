
import { Player } from "../objects/player";
import { Lava } from "../objects/lava";
import { CloudGenerator } from "../objects/cloudGenerator"
import { BlockGenerator } from "../objects/blockGenerator"

export class GameScene extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Sprite3D.Camera;
  private currentClimbed: Phaser.GameObjects.Text;
  private highestClimbed: Phaser.GameObjects.Text;
  private cursors: CursorKeys;
  private customPipeline2: any;
  private time2: number = 0.0;
  private timeEvent;
  private floor;
  private lava: Lava;
  private cloudGenerator: CloudGenerator;
  private blockGenerator: BlockGenerator;
  private down = false;
  private up = false;
  private highscoreText: any;
  private highscore: boolean = false;
  private graphics: Phaser.GameObjects.Graphics;
  private isTutorial: boolean = false;
  private controls: Phaser.GameObjects.Image;
  private arrow: Phaser.GameObjects.Image;
  private slidejump: Phaser.GameObjects.Image;
  private goodjob: Phaser.GameObjects.Image;
  private isSuperJumpTutorial: boolean = false;
  private presshold: Phaser.GameObjects.Image;
  
  private isGameOver: boolean = false;

  constructor() {
    super({
      key: "GameScene",
      physics: {
        arcade: {
          gravity: { y: 800 },
          debug: false
        }
      }
    });
  }

  preload(): void {

    this.load.image("background","./src/assets/background.png");
    this.load.image("player", "./src/assets/player2.png");
    this.load.image("block", "./src/assets/block.png");
    this.load.image("floor", "./src/assets/floor.png");
    this.load.image("normalmap", "./src/assets/normalmap.png");
    this.load.image("pause", "./src/assets/pause.png");
    this.load.image("play", "./src/assets/play.png");
    this.load.image("restart", "./src/assets/restart.png");
    this.load.image("lava", "./src/assets/lava.png");
    this.load.image("cloud", "./src/assets/cloud.png");
    this.load.image("controls", "./src/assets/controls.png");
    this.load.image("arrow", "./src/assets/arrow.png");
    this.load.image("slidejump", "./src/assets/slidejump.png");
    this.load.image("goodjob", "./src/assets/goodjob.png");
    this.load.image("presshold", "./src/assets/presshold.png");
    this.load.spritesheet('dude', 
        './src/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    this.load.atlas('flares', './src/assets/flares.png', './src/assets/flares.json');
  }

  init(): void {
 
  }

  create(): void {

    // this.initShader();

    //  Camera at 0x0x200 and looking at 0x0x0
    this.camera = this.cameras3d.add(85).setPosition(0, 0, 200);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.isGameOver = false;
    this.up = false;
    this.down = false;

    this.isTutorial = localStorage.getItem("highscore") ? false : true;
    this.isSuperJumpTutorial = localStorage.getItem("superJumpTutorial") === "1" ? true : false;

    this.sound.pauseAll();
    this.sound.play('boogie');


    //  Create a few images to check the perspective with
    // this.camera.create(-150, 0, -100, 'coin', null);

    let floorImage = new Phaser.GameObjects.Image(this,0,0,'floor');
    let scaleX = this.sys.canvas.width/floorImage.width;
    let scaleY = floorImage.height/floorImage.width;
    this.floor = this.physics.add.staticImage(scaleX*floorImage.width/2, this.sys.canvas.height-scaleY*floorImage.height/2, 'floor');
    this.floor.setScale(scaleX,scaleY).refreshBody();
    this.floor.body.setSize(this.sys.canvas.width+100,scaleY*floorImage.height-110);
    this.floor.body.setOffset(-50,110);


    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      floorY: this.floor.body.y,
      key: "player"
    });
    
    this.lava = new Lava({
      scene: this,
      key: "lava",
      floorY:this.floor.body.y
    });

    this.cloudGenerator = new CloudGenerator({
      scene: this,
      frequency: 4000,
      key: "cloud"
    })

    this.blockGenerator = new BlockGenerator({
      scene: this,
      frequency: this.sys.canvas.width/1.5,
      floorY: this.floor.body.y,
      key: "block",
      loop: this.isTutorial ? false : true,
      player:this.player
    })

    this.addGUIelement();
    this.addCollisionHandlers();
  }


  addGUIelement(): void {
    this.highestClimbed = this.add.text(
      20,
      0,
      0 + "",
      {
        fontFamily: "Arial",
        fontSize: this.sys.canvas.width/16,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    this.highestClimbed.setDepth(5);
    

    this.currentClimbed = this.add.text(
      20,
      this.sys.canvas.width/16,
      0 + "",
      {
        fontFamily: "Arial",
        fontSize: this.sys.canvas.width/20,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    let y:number = localStorage.getItem("highscore") ? parseFloat(localStorage.getItem("highscore")) : 0;
    this.highscoreText = this.add.text(
      0,
      this.floor.body.y-y*10-30,
      "HIGHSCORE",
      {
        fontFamily: "Arial",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    );
    this.highscoreText.setX(this.sys.canvas.width/2-this.highscoreText.displayWidth/2);

    const renderer = { lineStyle: { width: 4, color: 0xffffff } } as GraphicsOptions;
    this.graphics = this.add.graphics(renderer);
    let line = new Phaser.Geom.Line(0, this.highscoreText.getBottomLeft().y, this.sys.canvas.width, this.highscoreText.getBottomLeft().y);
    this.graphics.strokeLineShape(line);

    if (this.isTutorial) {
      this.graphics.setAlpha(0);
      this.highscoreText.setAlpha(0);
    }

    this.currentClimbed.setDepth(5);
    this.currentClimbed.setInteractive();

    let pause = this.add.image(this.sys.canvas.width,0,'pause');
    pause.setScale((this.sys.canvas.width/14)/pause.height,(this.sys.canvas.width/14)/pause.height);
    pause.setX(this.sys.canvas.width-pause.displayWidth/2-pause.displayWidth/14);
    pause.setY(pause.displayHeight/2+pause.displayHeight/14);
    pause.setScrollFactor(0); //Fixed to camera
    pause.setInteractive();
    pause.setDepth(5);

    let play = this.add.image(this.sys.canvas.width,0,'play');
    play.setScale((this.sys.canvas.width/14)/play.height,(this.sys.canvas.width/14)/play.height);
    play.setX(this.sys.canvas.width-play.displayWidth/2-play.displayWidth/14);
    play.setY(pause.y);
    play.setScrollFactor(0); //Fixed to camera
    play.setInteractive();
    play.setDepth(5);
    play.setAlpha(0);

    let restart = this.add.image(0,0,'restart');
    restart.setScale((this.sys.canvas.width/14)/restart.height,(this.sys.canvas.width/14)/restart.height);
    restart.setX(this.sys.canvas.width-restart.displayWidth/2-restart.displayWidth/14);
    restart.setY(pause.y+restart.displayHeight+restart.displayHeight/14);
    restart.setScrollFactor(0); //Fixed to camera
    restart.setInteractive();
    restart.setDepth(5);
    restart.setAlpha(0);

    if (this.isSuperJumpTutorial) {
      this.presshold = this.add.image(0,0,'presshold');
      this.presshold.setScale((this.sys.canvas.width/8)/this.presshold.height,(this.sys.canvas.width/8)/this.presshold.height);
      this.presshold.setX(this.sys.canvas.width/2);
      this.presshold.setY(this.sys.canvas.height/3);
      // restart.setInteractive();
      this.presshold.setDepth(1);
      // restart.setAlpha(0);
    }

    if (this.isTutorial) {
      this.controls = this.add.image(0,0,'controls');
      this.controls.setScale((this.sys.canvas.width/6)/this.controls.height,(this.sys.canvas.width/6)/this.controls.height);
      this.controls.setX(this.sys.canvas.width/2);
      this.controls.setY(this.sys.canvas.height/3);
      // restart.setInteractive();
      this.controls.setDepth(1);
      // restart.setAlpha(0);

      this.slidejump = this.add.image(0,0,'slidejump');
      this.slidejump.setScale((this.sys.canvas.width/6)/this.slidejump.height,(this.sys.canvas.width/6)/this.slidejump.height);
      this.slidejump.setX(this.sys.canvas.width/2);
      this.slidejump.setY(this.sys.canvas.height/3);
      // restart.setInteractive();
      this.slidejump.setDepth(1);
      this.slidejump.setAlpha(0);

      this.goodjob = this.add.image(0,0,'goodjob');
      this.goodjob.setScale((this.sys.canvas.width/6)/this.goodjob.height,(this.sys.canvas.width/6)/this.goodjob.height);
      this.goodjob.setX(this.sys.canvas.width/2);
      this.goodjob.setY(this.sys.canvas.height/3);
      // restart.setInteractive();
      this.goodjob.setDepth(1);
      this.goodjob.setAlpha(0);

      this.arrow = this.add.image(0,0,'arrow');
      this.arrow.setScale((this.sys.canvas.width/10)/this.arrow.width,(this.sys.canvas.width/10)/this.arrow.width);
      this.arrow.setX(this.sys.canvas.width-this.arrow.displayWidth);
      this.arrow.setY(this.floor.body.y-this.arrow.displayHeight);
      this.arrow.setDepth(1);

      this.tweens.add({
          targets: this.arrow,
          x: this.sys.canvas.width-this.arrow.displayWidth/1.5,
          duration: 500,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
      });
    }

    pause.on('pointerdown', () => { 
      console.log(this.isGameOver);
      this.physics.world.pause();
      pause.setAlpha(0);
      play.setAlpha(1);
      restart.setAlpha(1);
      this.sound.pauseAll();
    });

    play.on('pointerdown', () => { 
      console.log(this.isGameOver);
      this.physics.world.resume();
      play.setAlpha(0);
      restart.setAlpha(0);
      pause.setAlpha(1);
      this.sound.play('boogie');
    });

    restart.on('pointerdown', () => { 
      this.scene.manager.getScene('GameScene').scene.restart();
    });
  }

  addCollisionHandlers(): void {
    let blocks = this.blockGenerator.getBlocks();
    this.physics.add.collider(blocks, this.floor, (floor,block) => {
      block.body.setAllowGravity(false);
      block.body.stop();
    });
    this.physics.add.collider(blocks, blocks, (block1,block2) => {
      if(block1.body.touching.down || block2.body.touching.down) {
        block1.body.setAllowGravity(false);
        block2.body.setAllowGravity(false);
        block1.body.stop();
        block2.body.stop();
      }
    });
    this.physics.add.collider(blocks, this.player, (player,block) => {
      if (!this.isGameOver && player.body.touching.none) {
        this.gameOver(false);
      }
      
      if (player.body.touching.up) {
        this.up = true;
        this.time.addEvent({ delay: 30, callback: this.timerUp, callbackScope: this });
        if(!this.isGameOver && this.down) {
          this.gameOver(false);
        }
      }
      if (player.body.touching.down) {
        this.down = true;
        this.time.addEvent({ delay: 30, callback: this.timerDown, callbackScope: this });
        if(!this.isGameOver && this.up) {
          this.gameOver(false);
        }
      }
      if (player.body.touching.right || player.body.touching.left) {
        player.body.setVelocityY(70);
      }
    });
    this.physics.add.collider(this.player, this.floor, (player,block) => {
      if (!this.isGameOver && player.body.touching.none) {
        this.gameOver(false);
      }
      this.down = true;
      this.time.addEvent({ delay: 30, callback: this.timerDown, callbackScope: this });
      if (!this.isGameOver && this.up) {
        this.gameOver(false);
      }
    });

    this.physics.add.collider(this.player, this.lava, (player,lava) => {
      if (!this.isGameOver) {
        this.gameOver(true);
      }
    });
  }

  timerUp(): void {
    this.up = false;
  }

  timerDown(): void {
    this.down = false;
  }

  update(): void {
    this.updateCamera();
    this.player.update();
    this.lava.update();
    this.updateScore();

    if (this.isTutorial && !this.slidejump.alpha && (this.player.x == this.sys.canvas.width+30 || this.player.x == -30)) {
      console.log("HURRAY");
      this.tweens.add({
        targets: this.controls,
        alpha: 0,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: this.arrow,
        alpha: 0,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: this.slidejump,
        alpha: 1,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.blockGenerator.createBlock();
    }

    if (this.isTutorial && this.player.getSidewaysJump()) {
      console.log("HURRAY2");
      this.tweens.add({
        targets: this.slidejump,
        alpha: 0,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: this.goodjob,
        alpha: 1,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.blockGenerator.startLoop();
      this.isTutorial = false;

      setTimeout(()=>{
        this.tweens.add({
          targets: this.goodjob,
          alpha: 0,
          duration: 1000,
          ease: 'Sine.easeInOut',
        });
      },2000)
    }

    if (this.isSuperJumpTutorial && parseFloat(localStorage.getItem("fuel")) < 90) {
      console.log("HURRAY3");
      this.tweens.add({
        targets: this.presshold,
        alpha: 0,
        duration: 1000,
        ease: 'Sine.easeInOut',
      });
      this.isSuperJumpTutorial = false;
      localStorage.setItem("superJumpTutorial", "0");
    }
  }

  private updateScore(): void {
    this.currentClimbed.setText(this.player.getClimbed());
    this.highestClimbed.setText(this.player.getHighestClimed());
      
    if(this.highscoreText.alpha != 0 && !this.highscore && parseFloat(this.player.getClimbed())*10-this.floor.body.y > -this.highscoreText.y) {
        this.tweens.add({
          targets: this.highscoreText,
          alpha: 0.2,
          duration: 500,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
      });
      this.tweens.add({
        targets: this.graphics,
        alpha: 0.2,
        duration: 500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
      this.highscore = true;
      this.sound.play('record');
    }
  }

  gameOver(lava: boolean): void {
    console.log("gameover");
    if (lava) {
      this.sound.play('drowned');
    } else {
      this.sound.play('squeezed');
    }

    if (this.isTutorial) {
      this.scene.restart();
      return;
    }
    if (!this.isGameOver) {
      this.isGameOver = true;
      console.log("gameOver");
      this.blockGenerator.stopLoop();

      if(!lava) {
        this.tweens.add({
          targets: this.player,
          scaleY: 0,
          duration: 50
        });
          var particles:any = this.add.particles('flares');
          particles.createEmitter({
              frame: [ 'red', 'yellow', 'blue', 'green' ],
              x: this.player.body.x,
              y: this.player.body.y,
              lifespan: 2000,
              speed: 200,
              scale: { start: 0.7, end: 0 },
              blendMode: 'ADD'
          });
          setTimeout(()=> {
            particles.emitters.first.setPosition(-this.sys.canvas.width,0);
          },1000)
          
      } else {
        this.player.body.setImmovable(true);
        this.player.body.stop();
      }
      this.scene.run('GameoverScene', {climbed: this.player.getHighestClimed()});
    }
  }

  updateCamera(): void {
    if (!this.isGameOver && this.player.getBottomLeft().y-this.sys.canvas.height/2 < 0) {
      this.cameras.main.scrollY = this.player.getBottomLeft().y-this.sys.canvas.height/2;
    }
  }

  public getHighestBlockY(): number {
    return this.blockGenerator.getHighestBlockY();
  }

  public getIsGameOver(): boolean {
    return this.isGameOver;
  }
}
