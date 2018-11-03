import { Block } from "../objects/block";

export class BlockGenerator {
    private currentScene: Phaser.Scene;
    private textureKey: string;
    private blocks: Phaser.Physics.Arcade.Group;
    private floorY: number;
    private highestBlockY: number;
    private frequency: number;

    constructor(params) {
        this.currentScene = params.scene;
        this.frequency = params.frequency;
        this.textureKey = params.key;
        this.floorY = params.floorY;
        this.blocks = this.currentScene.physics.add.group({immovable: true});

        this.highestBlockY = this.floorY;

        if(params.loop) {
            this.startLoop();
        }
    }

    createBlock(): void {
        if (this.currentScene.physics.world.isPaused) {
            return;
        }
        let y: number = this.floorY;
        this.blocks.getChildren().forEach((block) => {
            if (!block.body.allowGravity && block.body.y < y) {
                y = block.body.y;
            }
        });
        this.highestBlockY = y;
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

      getHighestBlockY(): number {
          return this.highestBlockY;
      }

      startLoop() {
        this.currentScene.time.addEvent({ delay: 2000, callback: this.createBlock, callbackScope: this, loop: true });
      }
}