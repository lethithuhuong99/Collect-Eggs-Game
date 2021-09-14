const { ccclass, property } = cc._decorator;

@ccclass
export default class CompletePopup extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Button)
    yesBtn: cc.Button = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // super.onLoad();
        this.setYesCallback();
        this.setNoCallback();
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

    setNoCallback(callback?, closePopupOnFinish = true) {
        this.closeBtn.node.off('click');

        const cb = () => {
            if (callback) {
                callback();
            }
            if (closePopupOnFinish) {
                this.node.destroy();
            }
        };
        this.closeBtn.node.on('click', cb, this);
    }

    setTitle(title: string) {
        this.title.string = title;
    }

    setContent(content: string) {
        this.content.string = content;
    }

    setBtnContent(yes: string, no: string) {
        this.yesBtn.node.getComponentInChildren(cc.Label).string = yes;
        this.closeBtn.node.getComponentInChildren(cc.Label).string = no;
    }


    // update (dt) {}
}
