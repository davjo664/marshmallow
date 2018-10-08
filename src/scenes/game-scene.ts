
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
  
  private isGameOver: boolean = false;

  constructor() {
    super({
      key: "GameScene",
      physics: {
        arcade: {
          gravity: { y: 800 },
          debug: true
        }
      }
    });
  }

  preload(): void {

    this.load.image("background","./src/assets/background.png");
    this.load.image("player", "./src/assets/player.png");
    this.load.image("block", "./src/assets/block.png");
    this.load.image("coin", "./src/assets/coin.png");
    this.load.image("floor", "./src/assets/floor.png");
    this.load.image("normalmap", "./src/assets/normalmap.png");
    this.load.image("pause", "./src/assets/pause.png");
    this.load.image("lava", "./src/assets/lava.png");
    this.load.image("cloud", "./src/assets/cloud.png");
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

    //  Create a few images to check the perspective with
    // this.camera.create(-150, 0, -100, 'coin', null);

    let floorImage = new Phaser.GameObjects.Image(this,0,0,'floor');
    let scaleX = this.sys.canvas.width/floorImage.width;
    let scaleY = floorImage.height/floorImage.width;
    this.floor = this.physics.add.staticImage(scaleX*floorImage.width/2, this.sys.canvas.height-scaleY*floorImage.height/2, 'floor');
    this.floor.setScale(scaleX,scaleY).refreshBody();
    this.floor.body.setSize(scaleX*floorImage.width,scaleY*floorImage.height-110);
    this.floor.body.setOffset(0,110);


    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      floorY: this.floor.body.y,
      key: "player"
    });

    this.lava = new Lava({
      scene: this,
      key: "lava"
    });

    this.cloudGenerator = new CloudGenerator({
      scene: this,
      frequency: 4000,
      key: "cloud"
    })

    this.blockGenerator = new BlockGenerator({
      scene: this,
      frequency: 1000,
      floorY: this.floor.body.y,
      key: "block"
    })

    this.addGUIelement();
    this.addCollisionHandlers();
  }


  addGUIelement(): void {
    this.highestClimbed = this.add.text(
      20,
      20,
      0 + "",
      {
        fontFamily: "Arial",
        fontSize: 58,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    this.highestClimbed.setDepth(1);
    

    this.currentClimbed = this.add.text(
      20,
      80,
      0 + "",
      {
        fontFamily: "Arial",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    this.currentClimbed.setDepth(1);
    this.currentClimbed.setInteractive();

    let pause = this.add.image(this.sys.canvas.width,0,'pause');
    pause.setScale(0.08,0.08);
    pause.setX(pause.x-pause.displayWidth/2-20);
    pause.setY(pause.displayHeight/2+20)
    pause.setScrollFactor(0); //Fixed to camera
    pause.setInteractive();
    pause.setDepth(1);

    this.currentClimbed.on('pointerdown', () => { 
      this.gameOver(false);
    });

    pause.on('pointerdown', () => { 
      this.physics.world.isPaused ? this.physics.world.resume() : this.physics.world.pause();
    });
  }

  addCollisionHandlers(): void {
    let blocks = this.blockGenerator.getBlocks();
    this.physics.add.collider(blocks, this.floor, (floor,block) => {
      block.body.setAllowGravity(false);
      block.body.stop();
    });
    this.physics.add.collider(blocks, blocks, (block1,block2) => {
      block1.body.setAllowGravity(false);
      block2.body.setAllowGravity(false);
      block1.body.stop();
      block2.body.stop();
    });
    this.physics.add.collider(blocks, this.player, (player,block) => {
      if (player.body.touching.up && player.body.touching.down) {
        this.gameOver(false);
      }
      if (player.body.touching.right || player.body.touching.left) {
        player.body.setVelocityY(70);
      }
    });
    this.physics.add.collider(this.player, this.floor, (player,block) => {
      if (player.body.touching.up) {
        this.gameOver(false);
      }
    });

    this.physics.add.collider(this.player, this.lava, (player,lava) => {
        this.gameOver(true);
    });
  }

  update(): void {
    this.updateCamera();
    this.player.update();
    this.lava.update();
    this.updateScore();
  }

  private updateScore(): void {
    this.currentClimbed.setText(this.player.getClimbed());
    this.highestClimbed.setText(this.player.getHighestClimed());
  }

  gameOver(lava: boolean): void {
    if (!this.isGameOver) {
      this.isGameOver = true;
      console.log("gameOver");

      if(!lava) {
        this.tweens.add({
          targets: this.player,
          scaleY: 0,
          duration: 50
        });
          var particles = this.add.particles('flares');
          particles.createEmitter({
            frame: [ 'red', 'yellow', 'blue', 'green' ],
            x: this.player.body.x,
            y: this.player.body.y,
            lifespan: 2000,
            speed: 200,
            scale: { start: 0.7, end: 0 },
            blendMode: 'ADD'
        });
      } else {
        this.player.body.setImmovable(true);
      }
      this.scene.run('GameoverScene', {climbed: this.player.getHighestClimed()});
    }
  }

  updateCamera(): void {
    if (this.player.getBottomLeft().y-this.sys.canvas.height/2 < 0) {
      this.cameras.main.scrollY = this.player.getBottomLeft().y-this.sys.canvas.height/2;
    }
  }
}
