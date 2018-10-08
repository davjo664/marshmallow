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
        let rnd = Phaser.Math.RND.integerInRange(this.currentScene.cameras.main.scrollY,this.currentScene.cameras.main.scrollY+this.currentScene.sys.canvas.height);
        let rndScale = Phaser.Math.RND.integerInRange(3,6)/10;
        let rndDuration = Phaser.Math.RND.integerInRange(5000,10000);
        let cloud = this.currentScene.add.image(-200,rnd,this.textureKey).setScale(rndScale,rndScale);
        cloud.setDepth(Math.random() >= 0.5 ? -1 : 1);
        let tween = this.currentScene.tweens.add({
            targets: cloud,
            x: this.currentScene.sys.canvas.width+200,
            ease: 'easeInOut',
            onComplete: () => {
              console.log("Complete");
              cloud.destroy();
            },
            duration: rndDuration
        });
      }
}