import { GameObject, DisplayObject, Graphics, Text } from '../../../utils/black-engine.module';

export default class CoinsCounter extends DisplayObject {
    constructor(coins) {
        super();
        this.coins = coins;
    }

    onAdded() {
        console.log('Coins counter works');
        this._container = new GameObject();
        this.add(this._container);

        let outline = new Graphics();
        outline.beginPath();
        outline.roundedRect(0, 0, 200, 70, 30);
        outline.fillStyle(0x000000, 0.5);
        outline.fill(0);
        outline.stroke();
        this.addChild(outline);


    }
}
