const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawBackground extends cc.Component {

    @property(cc.Color)
    color: cc.Color = null;

    graphics: cc.Graphics = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.node.addComponent(cc.Graphics);
        this.graphics.lineWidth = 0;
    }

    update(dt) {
        this.graphics.clear();
        this.graphics.fillColor = this.color;
        this.graphics.fillRect(-this.node.width / 2, -this.node.height / 2, this.node.width, this.node.height);
    }

    setAlpha(alpha) {
        this.color = new cc.Color(this.color.r, this.color.g, this.color.b, alpha);
    }

    changeColor(newColor) {
        this.color = newColor;
    }
}