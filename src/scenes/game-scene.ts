
import { Block } from "../objects/block";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private camera: Phaser.Cameras.Sprite3D.Camera;
  private coinsCollectedText: Phaser.GameObjects.Text;
  private highestClimbed: Phaser.GameObjects.Text;
  private cursors: CursorKeys;
  private floorHeight: number;
  private customPipeline2: any;
  private time2: number = 0.0;
  private timeEvent;
  private floor;
  private blocks: Phaser.Physics.Arcade.Group;

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
    this.load.image("player", "./src/assets/rundare2.png");
    this.load.image("block", "./src/assets/block4.png");
    this.load.image("coin", "./src/assets/coin.png");
    this.load.image("floor", "./src/assets/floor2.png");
    this.load.image("normalmap", "./src/assets/normalmap.png");
    this.load.image("pause", "./src/assets/pause.png");
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

    // create background
    // this.camera.create(this.sys.canvas.width/2, this.sys.canvas.height/2, "background").setScrollFactor(0);
    // this.background.setOrigin(0, 0);

    //  Create a few images to check the perspective with
    this.camera.create(0, 0, 0, 'coin', null);
    this.camera.create(-150, 0, -100, 'coin', null);

    let floorImage = new Phaser.GameObjects.Image(this,0,0,'floor');
    let scaleX = this.sys.canvas.width/floorImage.width;
    let scaleY = floorImage.height/floorImage.width;
    this.floor = this.physics.add.staticImage(scaleX*floorImage.width/2, this.sys.canvas.height-scaleY*floorImage.height/2, 'floor');
    this.floor.setScale(scaleX,scaleY).refreshBody();
    this.floor.body.setSize(scaleX*floorImage.width,scaleY*floorImage.height-110);
    this.floor.body.setOffset(0,110);

    this.floorHeight = scaleY*floorImage.height;

    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      floorY: this.floor.body.y,
      key: "player"
    });

    this.highestClimbed = this.add.text(
      20,
      20,
      0 + "",
      {
        fontFamily: "Connection",
        fontSize: 58,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    this.highestClimbed.setDepth(1);
    

    // // create texts
    this.coinsCollectedText = this.add.text(
      20,
      80,
      0 + "",
      {
        fontFamily: "Connection",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ).setScrollFactor(0); //Fixed to camera

    this.coinsCollectedText.setDepth(1);

    this.coinsCollectedText.setInteractive();

    let pause = this.add.image(this.sys.canvas.width,0,'pause');
    pause.setScale(0.08,0.08);
    pause.setX(pause.x-pause.displayWidth/2-20);
    pause.setY(pause.displayHeight/2+20)
    pause.setScrollFactor(0); //Fixed to camera
    pause.setInteractive();
    pause.setDepth(1);

    this.coinsCollectedText.on('pointerdown', () => { 
      this.gameOver();
    });

    pause.on('pointerdown', () => { 
      this.physics.world.isPaused ? this.physics.world.resume() : this.physics.world.pause();
    });

    this.blocks = this.physics.add.group({immovable: true});
    this.physics.add.collider(this.blocks, this.floor, (floor,block) => {
      block.body.setAllowGravity(false);
      block.body.stop();
    });
    this.physics.add.collider(this.blocks, this.blocks, (block1,block2) => {
      block1.body.setAllowGravity(false);
      block2.body.setAllowGravity(false);
      block1.body.stop();
      block2.body.stop();
    });
    this.physics.add.collider(this.blocks, this.player, (player,block) => {
      if (player.body.touching.up && player.body.touching.down) {
        this.gameOver();
      }
      if (player.body.touching.right || player.body.touching.left) {
        player.body.setVelocityY(70);
      }
    });
    this.physics.add.collider(this.player, this.floor, (player,block) => {
      if (player.body.touching.up) {
        this.gameOver();
      }
    });

    this.timeEvent = this.time.addEvent({ delay: 1000, callback: this.createBlock, callbackScope: this, loop: true });
  }

  createBlock(): void {
    // this.cameras.main.shake(1000);
    if (!this.physics.world.isPaused) {
      let y: number = this.floor.y;
      this.blocks.getChildren().forEach((block) => {
        if (!block.body.allowGravity && block.body.y < y) {
          y = block.body.y;
        }
      });
      this.blocks.add(new Block({
        scene: this,
        x: Phaser.Math.RND.integerInRange(0, this.sys.canvas.width),
        y: y-this.sys.canvas.height,
        size: Phaser.Math.RND.integerInRange(this.sys.canvas.width/8,this.sys.canvas.width/4),
        key: "block"
      }));
    }
  }
  

  update(): void {
    // this.updateShader();
    // update objects
    this.player.update();
    // this.cameras.main.scrollY = this.player.getCenter().y-this.floorHeight-110;
    if (this.player.getBottomLeft().y-this.sys.canvas.height/2 < 0) {
      this.cameras.main.scrollY = this.player.getBottomLeft().y-this.sys.canvas.height/2;
    }

    // console.log('Event.progress: ' + this.timeEvent.getProgress().toString().substr(0, 4))
    

    if (this.cursors.left.isDown)
    {
        // this.camera.x -= 0.3;
        // this.cameras.main.scrollX -= 1;
    }
    else if (this.cursors.right.isDown)
    {
      // this.camera.x += 0.3;
      // this.cameras.main.scrollX += 1;
    }


    // // do the collision check
    // if (
    //   // Phaser.Geom.Intersects.RectangleToRectangle(
    //   //   this.player.getBounds(),
    //   //   this.coin.getBounds()
    //   // )
    // ) {
      this.updateCoinStatus();
    // }
  }

  private updateCoinStatus(): void {
    // this.collectedCoins++;
    this.coinsCollectedText.setText(this.player.getClimbed());
    this.highestClimbed.setText(this.player.getHighestClimed());
  }

  updateShader(): void {
    this.customPipeline2.setFloat1('time', this.time2);
    this.time2 += 0.01;
  }

  gameOver(): void {
    console.log("gameOver");
    // this.player.body.destroy();
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
    // this.time.addEvent({ delay: 800, callback: () => this.scene.setActive(false), callbackScope: this, loop: false });
    //   this.scene.transition({
    //     target: 'GameoverScene',
    //     duration: 1000
    // });

    // this.scene.launch('GameoverScene');
    this.scene.run('GameoverScene', {climbed: this.player.getHighestClimed()});
  }

  initShader(): void {
    const renderer = this.sys.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    const game = this.sys.game;
    let shader = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
      game: game,
      renderer: renderer,
      fragShader: [
        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform sampler2D uMainSampler;",
        "varying vec2 outTexCoord;",

        "#define MAX_ITER 4",

        "void main( void )",
        "{",
            "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

            "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
            "vec2 i = p;",
            "float c = 1.0;",
            "float inten = .05;",

            "for (int n = 0; n < MAX_ITER; n++)",
            "{",
                "float t = time * (1.0 - (3.0 / float(n+1)));",

                "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                "sin(t - i.y) + cos(t + i.x));",

                "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                "p.y / (cos(i.y+t)/inten)));",
            "}",

            "c /= float(MAX_ITER);",
            "c = 1.5 - sqrt(c);",

            "vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);",

            "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",
            "vec4 pixel = texture2D(uMainSampler, outTexCoord);",

            "gl_FragColor = pixel + texColor;",
        "}"
        ].join('\n')
    });
    this.customPipeline2 = renderer.addPipeline('Custom2', shader);

    this.customPipeline2.setFloat2('resolution', this.sys.canvas.width, this.sys.canvas.height);

    //Behöver skicka in en texture istället för float

    this.add.sprite(100, 100, 'background').setPipeline('Custom2');
  }
}
