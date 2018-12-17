import { Block } from "../objects/block";
import { Player } from "./player";

export class BlockGenerator {
    private currentScene: Phaser.Scene;
    private textureKey: string;
    private blocks: Phaser.Physics.Arcade.Group;
    private floorY: number;
    private highestBlockY: number;
    private frequency: number;
    private loop: Phaser.Time.TimerEvent;
    private player: Player;

    constructor(params) {
        this.currentScene = params.scene;
        this.frequency = params.frequency;
        this.textureKey = params.key;
        this.floorY = params.floorY;
        this.player = params.player;
        this.blocks = this.currentScene.physics.add.group({immovable: true});

        this.highestBlockY = this.floorY;

        if(params.loop) {
            this.startLoop();
        }
    }

    createBlock(): void {
        console.log("create");
        if (this.currentScene.physics.world.isPaused) {
            return;
        }
        let y: number = this.floorY;
        let lowestBlock: Block;
        console.log(this.blocks.getChildren().length);
        this.blocks.getChildren().forEach((block: Block) => {
            if (!block.body.allowGravity && block.body.y < y) {
                y = block.body.y;
            }
            if (!block.body.allowGravity && (!lowestBlock || block.body.y > lowestBlock.y)) {
                lowestBlock = block;
            }
        });

        if (this.player.body.y < y) {
            console.log("player highest");
            y = this.player.body.y;
        }

        // Remove lowest block if it is more then 2*the screen size below the highest block
        // and if it is below the camera position.
        if (lowestBlock && lowestBlock.y > (y+this.currentScene.sys.canvas.height*2) && lowestBlock.y > -this.currentScene.cameras.main.scrollY) {
            lowestBlock.destroy();
        }
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
        this.loop = this.currentScene.time.addEvent({ delay: 1600, callback: this.createBlock, callbackScope: this, loop: true });
      }

      stopLoop() {
        setTimeout(()=> {
            this.loop.destroy();
          },20000)
      }
}