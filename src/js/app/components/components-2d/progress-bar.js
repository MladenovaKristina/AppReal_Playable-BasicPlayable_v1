import { GameObject, Graphics, DisplayObject } from '../../../utils/black-engine.module';

export default class ProgressBar extends DisplayObject {
    constructor() {
        super();
        this.progress = 0;
        this.clickCount = 0;
        this.progressIndicator = null;

        document.addEventListener('click', this.onClick.bind(this));
    }

    onAdded() {
        this._container = new GameObject();
        this.add(this._container);

        let outline = new Graphics();
        outline.beginPath();
        outline.lineStyle(20, 0xffffff);
        outline.roundedRect(0, 0, 300, 60, 35);
        outline.fillStyle(0xfffff, 1);
        outline.fill(0);
        outline.stroke();
        this.addChild(outline);

        let insideIndicator = new Graphics();
        insideIndicator.beginPath();
        insideIndicator.roundedRect(0, 0, 300, 60, 35);
        insideIndicator.fillStyle(0x666666, 1);
        insideIndicator.fill(0);
        insideIndicator.stroke();

        outline.clipRect = insideIndicator;
        this.add(insideIndicator);

        this.progressIndicator = new Graphics();
        let width = 300;
        this.progressIndicator.beginPath();
        this.progressIndicator.roundedRect(0, 0, width, 60, 35);

        this.progressIndicator.clipRect = outline;
        this.add(this.progressIndicator);
    }

    onClick() {
        this.clickCount++;
        this.progress = this.clickCount * 10;
        const targetWidth = (this.progress / 100) * 300;
        if (targetWidth <= 300) {
            this.progressIndicator.clear();
            this.progressIndicator.fillStyle(0x00ff00, 1);
            this.progressIndicator.beginPath();
            this.progressIndicator.roundedRect(0, 0, targetWidth, 60, 35);
            this.progressIndicator.fill();
        }
    }
}
