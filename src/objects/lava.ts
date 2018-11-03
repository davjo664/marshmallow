import { GameScene } from "../scenes/game-scene";

export class Lava extends Phaser.GameObjects.Image {
    private currentScene: GameScene;
    private animationTime: number = 0;
    private renderPipeline: any;
    private isStarted: boolean = false;

    constructor(params) {
        // var lavaImage = params.scene.textures.get(params.key).getSourceImage();

        super(params.scene,0, 0, params.key);
        this.currentScene = params.scene;
        this.currentScene.add.existing(this);
        this.setDepth(4);

        let floorImage = new Phaser.GameObjects.Image(params.scene,0,0,params.key);
        let scaleX = params.scene.sys.canvas.width/floorImage.width;
        this.setScale(scaleX,1);
        this.setX(this.displayWidth/2);
        this.setY(params.floorY+this.height/2);

        this.currentScene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(-50);
        
        
        this.body.setSize(this.width,this.displayHeight);
        this.body.setOffset(0,140);

        this.currentScene.time.addEvent({ delay: 5000, callback: ()=>{this.isStarted = true}, callbackScope: this });

        this.initShader();
    }

    update(): void {
        this.renderPipeline.setFloat1('time', this.animationTime);
        this.animationTime += 0.015;

        if ((this.y - 800) < this.currentScene.getHighestBlockY() || this.currentScene.getIsGameOver()) {
            this.body.setVelocityY(0);
        } else if (this.isStarted && !this.currentScene.getIsGameOver()) {
            this.body.setVelocityY(-50);
        }
    }

    initShader(): void {
        const renderer = this.currentScene.sys.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
        if (!renderer.getPipeline("LavaPipeline")) {
            const game = this.currentScene.sys.game;
            let shader = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
            game: game,
            renderer: renderer,
            fragShader: [
                "precision mediump float;",
        
                "uniform float     time;",
                "uniform vec2      resolution;",
                "uniform sampler2D uMainSampler;",
                "varying vec2 outTexCoord;",
        
                "void main( void ) {",
        
                    "vec2 uv = outTexCoord;",
                    "//uv.y *= -1.0;",
                    "uv.y += (sin((uv.x + (time * 0.5)) * 3.0) * 0.01);",
                    "vec4 texColor = texture2D(uMainSampler, uv);",
                    "gl_FragColor = texColor;",
        
                "}"
                ].join('\n')
            });
            this.renderPipeline = renderer.addPipeline('LavaPipeline', shader);
        } else {
            this.renderPipeline = renderer.getPipeline('LavaPipeline');
        }
        this.renderPipeline.setFloat1('time', this.animationTime);
        this.renderPipeline.setFloat2('resolution', this.currentScene.sys.canvas.width, this.currentScene.sys.canvas.height);
        this.setPipeline('LavaPipeline');
      }

}