import { GameObjects } from "phaser";

export class CloudGenerator {
    private currentScene: Phaser.Scene;
    private textureKey: string;

    constructor(params) {
        this.currentScene = params.scene;
        this.textureKey = params.key;
        this.currentScene.time.addEvent({ delay: params.frequency, callback: this.createCloud, callbackScope: this, loop: true });
    }

    createCloud(): void {
        let lowestY = (-this.currentScene.cameras.main.scrollY > this.currentScene.sys.canvas.height/2) ? this.currentScene.cameras.main.scrollY : -this.currentScene.sys.canvas.height/2;
        let rnd = Phaser.Math.RND.integerInRange(lowestY,lowestY+this.currentScene.sys.canvas.height);
        let rndScale = Phaser.Math.RND.integerInRange(3,6)/10;
        let rndDuration = Phaser.Math.RND.integerInRange(8000,12000);
        let cloud = this.currentScene.add.image(-200,rnd,this.textureKey).setScale(rndScale,rndScale);
        cloud.setDepth(Math.random() >= 0.5 ? -1 : 1);
        this.currentScene.tweens.add({
            targets: cloud,
            x: this.currentScene.sys.canvas.width+200,
            ease: 'easeInOut',
            onComplete: () => {
              cloud.destroy();
            },
            duration: rndDuration
        });
      }
}