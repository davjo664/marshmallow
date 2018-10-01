export class Block extends Phaser.GameObjects.Image {
    private currentScene: Phaser.Scene;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.currentScene = params.scene;
        this.currentScene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.setScale(params.size/this.width, params.size/this.width);
        this.body.setMaxVelocity(700,700)
        var hsv: any = Phaser.Display.Color.HSVColorWheel(0.5,1);
        var i = Phaser.Math.Between(100, 400);
        if(hsv[i] && hsv[i].color) {
        this.setTint(hsv[i].color);
        }
        this.body.setSize(this.body.width, this.body.height-70,true);
        this.body.setOffset(0,50);
    }
}