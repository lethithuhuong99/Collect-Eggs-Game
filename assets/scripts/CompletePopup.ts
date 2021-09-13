const { ccclass, property } = cc._decorator;

@ccclass
export default class CompletePopup extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Button)
    yesBtn

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setYesCallback();
    }

    start() {

    }

    setYesCallback(callback?, closePopupOnFinish = true) {
        this.yesBtn.node.off('click');

        const cb = () => {
            if (callback) {
                callback();
            }
            if (closePopupOnFinish) {
                this.node.destroy();
            }
        };
        this.yesBtn.node.on('click', cb, this);
    }

    setTitle(title: string) {
        this.title.string = title;
    }

    setContent(content: string) {
        this.content.string = content;
    }

    // update (dt) {}
}
