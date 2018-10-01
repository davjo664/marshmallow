/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Coin Runner: Coin
 * @license      Digitsensitive
 */

export class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen: number;
  private currentScene: Phaser.Scene;
  private lastPosition: string;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.initVariables(params);
    this.initImage();

    this.currentScene.add.existing(this);
  }

  private initVariables(params): void {
    this.currentScene = params.scene;
    this.centerOfScreen = this.currentScene.sys.canvas.width / 2;
    this.setFieldSide();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  update(): void {}

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = "left";
    } else {
      this.lastPosition = "right";
    }
  }
}
