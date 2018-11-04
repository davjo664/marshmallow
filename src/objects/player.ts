export class Player extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private cursors: CursorKeys;
  private increasedVelocityRight: Boolean = false;
  private increasedVelocityLeft: Boolean = false;
  private highestClimed: number = 0;
  private floorY: number = 0;
  private climbed: number = 0;
  private animationTime: number = 0;
  private renderPipeline: any;
  private isDead = false;
  private velocityMultiplier = 0;
  private particles: any;
  private fuelText: Phaser.GameObjects.Text;
  private fuelTextTween: Phaser.Tweens.Tween;
  private onGroundTime: Boolean = false;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);
    
    this.currentScene = params.scene;
    this.setOrigin(0.5, 0.5);
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();

    this.floorY = params.floorY;
    this.setDepth(1);

    params.scene.add.existing(this);
    params.scene.physics.world.enable(this);
    let ratio = this.height/this.width;
    this.setScale(params.scene.sys.canvas.width/30/this.width*ratio,params.scene.sys.canvas.width/30/this.width);

    this.velocityMultiplier = params.scene.sys.canvas.width/1800;
    this.body.setMaxVelocity(900*this.velocityMultiplier,900*this.velocityMultiplier)

    this.particles = this.currentScene.add.particles('flares');

    this.fuelText = this.currentScene.add.text(
      0,
      0,
      "",
      {
        fontFamily: "Arial Black",
        fontSize: this.currentScene.sys.canvas.width/60,
        fill: "#fff"
      }
    )
    

    this.initShader();
  }

  update(): void {
    if (!this.isDead) {
      this.handleInput();
    }
    if(this.x < -30) {
      this.setPosition(this.currentScene.sys.canvas.width+30,this.y);
    }
    if(this.x > this.currentScene.sys.canvas.width+30) {
      this.setPosition(-30,this.y);
    }

    this.climbed = -this.getBottomLeft().y+this.floorY;
    if (this.climbed > this.highestClimed) {
      this.highestClimed = this.climbed;
    }

    this.updateShader();
  }

  private handleInput(): void {
    
    if (this.cursors.right.isDown) {
      if(this.increasedVelocityLeft) {
        this.body.setMaxVelocity(900*this.velocityMultiplier, 900*this.velocityMultiplier);
      }
      this.body.setAccelerationX(8000*this.velocityMultiplier);
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      if(this.increasedVelocityRight) {
        this.body.setMaxVelocity(900*this.velocityMultiplier, 900*this.velocityMultiplier);
      }
      this.body.setAccelerationX(-8000*this.velocityMultiplier);
      // this.setFlipX(true);
    } 
    else
    {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }

    if (this.cursors.up.isDown && this.body.touching.right)
    {
      console.log("jump left up")
      this.body.setMaxVelocity(5000*this.velocityMultiplier,5000*this.velocityMultiplier);
      this.increasedVelocityRight = true;
      this.body.setVelocityY(-700*this.velocityMultiplier);
      this.body.setVelocityX(-1400*this.velocityMultiplier);
      let timeEvent = this.currentScene.time.addEvent({ delay: 200, callback: this.timer, callbackScope: this });
      
    } else if (this.cursors.up.isDown && this.body.touching.left)
    {
      console.log("jump right up")
      this.body.setMaxVelocity(5000*this.velocityMultiplier,5000*this.velocityMultiplier);
      this.increasedVelocityLeft = true;
      this.body.setVelocityY(-700*this.velocityMultiplier);
      this.body.setVelocityX(1400*this.velocityMultiplier);
      let timeEvent = this.currentScene.time.addEvent({ delay: 200, callback: this.timer, callbackScope: this });
    }
    else if (this.cursors.up.isDown && (this.body.touching.down || parseFloat(localStorage.getItem("fuel")) > 0))
    {
      if(!this.onGroundTime && this.body.touching.down) {
        console.log("kkk")
        this.onGroundTime = true;
      }
      setTimeout(()=>{
        this.onGroundTime = false;
      },200)
      console.log(this.onGroundTime);
      if ( parseFloat(localStorage.getItem("fuel")) > 0 && !this.onGroundTime && !this.increasedVelocityLeft && !this.increasedVelocityRight) {
        let newFuel = parseFloat(localStorage.getItem("fuel"))-1;
        localStorage.setItem("fuel",newFuel.toString());
        this.fuelText.setText(newFuel+"");
        this.fuelText.setX(this.getCenter().x-this.fuelText.displayWidth/2);
        this.fuelText.setY(this.getCenter().y-this.fuelText.displayHeight/2);
        console.log(localStorage.getItem("fuel"));
        if(!this.particles.emitters.length) {
          this.particles.createEmitter({
              frame: [ 'yellow', 'orange' ],
              x: this.getCenter().x,
              y: this.getCenter().y,
              lifespan: 500,
              speed: 100,
              scale: { start: 0.7, end: 0 },
              blendMode: 'ADD'
          });
        } else {
          this.particles.emitters.first.setPosition(this.getCenter().x,this.getCenter().y);
        }
          
      }
      // console.log("y: " + this.y + "     highest: " + this.highestClimed);
      this.body.setVelocityY(-600*this.velocityMultiplier);
    } else {
      if(this.particles.emitters.length) {
        this.particles.emitters.first.setPosition(-100,0);
        this.fuelTextTween = this.currentScene.tweens.add({
          targets: this.fuelText,
          alpha: 0,
          duration: 2000,
        })
        this.fuelText = this.currentScene.add.text(
          0,
          0,
          "",
          {
            fontFamily: "Arial Black",
            fontSize: this.currentScene.sys.canvas.width/60,
            fill: "#fff"
          }
        )
      }
    }
  }

  private timer() {
    this.body.setMaxVelocity(900*this.velocityMultiplier, 900*this.velocityMultiplier);
    this.increasedVelocityLeft = false;
    this.increasedVelocityRight = false;
  }

  public getHighestClimed(): string {
    return (this.highestClimed/10).toFixed()+"";
  }

  public getClimbed(): string {
    return this.climbed > 0 ? (this.climbed/10).toFixed()+"" : 0+"";
  }

  updateShader(): void {
    if( -this.body.velocity.y/1400 > 0) {
      this.renderPipeline.setFloat1('time', 1-this.body.velocity.y/1400);
    } else {
      this.renderPipeline.setFloat1('time', 1);
    }
    
    // this.renderPipeline.setFloat1('time2', Math.abs(1+this.body.velocity.x/1000));
    // console.log(Math.abs(1+this.body.velocity.x/1000));
    // this.renderPipeline.setFloat1('time2', Math.abs(this.body.velocity.x/8000));
    if( this.body.velocity.x != 0) {
      this.renderPipeline.setFloat1('time2', 1.2);
    } else {
      this.renderPipeline.setFloat1('time2', 1);
    }
    
    this.animationTime += 0.015;
}

initShader(): void {
    const renderer = this.currentScene.sys.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    if (!renderer.getPipeline('PlayerPipeline')) {
      const game = this.currentScene.sys.game;
      let shader = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
        game: game,
        renderer: renderer,
        fragShader: [
          "precision mediump float;",

          "uniform float     time;",
          "uniform float     time2;",
          "uniform vec2      resolution;",
          "uniform sampler2D uMainSampler;",
          "varying vec2 outTexCoord;",

          "void main( void ) {",

              "vec2 uv = outTexCoord;",
              "uv.y = time*uv.y;",
              "uv.x = time2*uv.x;",
              "if(uv.y>1.0 || uv.y < 0.0){ gl_FragColor = vec4(0.0);return;}",
              "//if(uv.x>1.0 || uv.x < 0.0){ gl_FragColor = vec4(0.0);return;}",
              "vec4 texColor = texture2D(uMainSampler, uv);",
              "gl_FragColor = texColor;",

          "}"
          ].join('\n')
      });
      this.renderPipeline = renderer.addPipeline('PlayerPipeline', shader)
    } else {
      this.renderPipeline = renderer.getPipeline('PlayerPipeline');
    }
      this.renderPipeline.setFloat1('time', this.animationTime);
      this.renderPipeline.setFloat2('resolution', this.currentScene.sys.canvas.width, this.currentScene.sys.canvas.height);
      this.setPipeline('PlayerPipeline');
  }

  getSidewaysJump(): boolean {
    if (this.increasedVelocityLeft || this.increasedVelocityRight) {
      return true;
    } 
    return false;
  }
}
