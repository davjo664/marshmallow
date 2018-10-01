export class Player extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private cursors: CursorKeys;
  private walkingSpeed: number;
  private increasedVelocityRight: Boolean = false;
  private increasedVelocityLeft: Boolean = false;
  private highestClimed: number = 0;
  private floorY: number = 0;
  private climbed: number = 0;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);
    
    this.initVariables(params);
    this.initImage();
    this.initInput();

    this.floorY = params.floorY;
    this.setDepth(1);


    // params.scene.anims.create({
    //   key: 'left',
    //   frames: params.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    //   frameRate: 10,
    //   repeat: -1
    // });

    // params.scene.anims.create({
    //     key: 'turn',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });

    // params.scene.anims.create({
    //     key: 'right',
    //     frames: params.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    params.scene.add.existing(this);
    params.scene.physics.world.enable(this);
    this.setScale(0.5,0.5);
    this.body.setMaxVelocity(900,900)
    // this.body.setCollideWorldBounds(true); //Phaser.Physics.Arcade.Body
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.walkingSpeed = 5;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.handleInput();
    if(this.x < 0) {
      this.setPosition(this.currentScene.sys.canvas.width,this.y);
    }
    if(this.x > this.currentScene.sys.canvas.width) {
      this.setPosition(0,this.y);
    }

    this.climbed = -this.getBottomLeft().y+this.floorY;
    if (this.climbed > this.highestClimed) {
      this.highestClimed = this.climbed;
    }
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      if(this.increasedVelocityLeft) {
        this.body.setMaxVelocity(900, 900);
      }
      this.body.setAccelerationX(8000);
      // this.setRotation(0.2);
      // this.anims.play('right',true);
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      if(this.increasedVelocityRight) {
        this.body.setMaxVelocity(900, 900);
      }
      this.body.setAccelerationX(-8000);
      // this.setRotation(-0.2);
      // this.anims.play('left',true);
      this.setFlipX(true);
    } 
    else
    {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
      // this.setRotation(0);
      // this.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.body.touching.right)
    {
      console.log("jump left up")
      this.body.setMaxVelocity(5000,5000);
      this.increasedVelocityRight = true;
      this.body.setVelocityY(-700);
      this.body.setVelocityX(-1400);
      let timeEvent = this.currentScene.time.addEvent({ delay: 200, callback: this.timer, callbackScope: this });
      
    } else if (this.cursors.up.isDown && this.body.touching.left)
    {
      console.log("jump right up")
      this.body.setMaxVelocity(5000,5000);
      this.increasedVelocityLeft = true;
      this.body.setVelocityY(-700);
      this.body.setVelocityX(1400);
      let timeEvent = this.currentScene.time.addEvent({ delay: 200, callback: this.timer, callbackScope: this });
    }
    else if (this.cursors.up.isDown && this.body.touching.down)
    {
      console.log("jump straight")
      console.log("y: " + this.y + "     highest: " + this.highestClimed);
      this.body.setVelocityY(-600);
    } 
  }

  private timer() {
    this.body.setMaxVelocity(900, 900);
    this.increasedVelocityLeft = false;
    this.increasedVelocityRight = false;
  }

  public getHighestClimed(): string {
    return this.highestClimed.toFixed()+"";
  }

  public getClimbed(): string {
    return this.climbed > 0 ? this.climbed.toFixed()+"" : 0+"";
  }
}
