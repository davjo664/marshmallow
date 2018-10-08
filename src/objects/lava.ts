import { GameObjects } from "phaser";

export class Lava extends Phaser.GameObjects.Image {
    private currentScene: Phaser.Scene;
    private animationTime: number = 0;
    private renderPipeline: any;

    constructor(params) {
        // var lavaImage = params.scene.textures.get(params.key).getSourceImage();

        super(params.scene,params.scene.sys.canvas.width/2, params.scene.sys.canvas.height+600, params.key);
        this.currentScene = params.scene;
        this.currentScene.add.existing(this);
        this.setDepth(1);
        this.currentScene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(-10);
        this.body.setOffset(0,130);

        this.initShader();
        this.setPipeline('Custom2');
    }

    update(): void {
        this.renderPipeline.setFloat1('time', this.animationTime);
        this.animationTime += 0.015;
    }

    initShader(): void {
        const renderer = this.currentScene.sys.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
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
        this.renderPipeline = renderer.addPipeline('Custom2', shader);
        this.renderPipeline.setFloat1('time', this.animationTime);
        this.renderPipeline.setFloat2('resolution', this.currentScene.sys.canvas.width, this.currentScene.sys.canvas.height);
      }

}