import { Block } from "../objects/block";

export class BlockGenerator {
    private currentScene: Phaser.Scene;
    private textureKey: string;
    private blocks: Phaser.Physics.Arcade.Group;
    private floorY: number;

    constructor(params) {
        this.currentScene = params.scene;
        this.textureKey = params.key;
        this.floorY = params.floorY;
        this.blocks = this.currentScene.physics.add.group({immovable: true});

        this.currentScene.time.addEvent({ delay: params.frequency, callback: this.createBlock, callbackScope: this, loop: true });
    }

    createBlock(): void {
        let y: number = this.floorY;
        this.blocks.getChildren().forEach((block) => {
            if (!block.body.allowGravity && block.body.y < y) {
                y = block.body.y;
            }
        });
        let size = Phaser.Math.RND.integerInRange(this.currentScene.sys.canvas.width/8,this.currentScene.sys.canvas.width/4);
        this.blocks.add(new Block({
            scene: this.currentScene,
            x: Phaser.Math.RND.integerInRange(size/2, this.currentScene.sys.canvas.width-size/2),
            y: y-this.currentScene.sys.canvas.height,
            size: size,
            key: this.textureKey
        }));
      }

      getBlocks(): Phaser.Physics.Arcade.Group {
          return this.blocks;
      }
}