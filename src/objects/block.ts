export class Block extends Phaser.GameObjects.Image {
    private currentScene: Phaser.Scene;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.currentScene = params.scene;
        this.currentScene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.setScale(params.size/this.width, params.size/this.width);
        this.body.setMaxVelocity(700,700)
    }
}