const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayButton extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene('GamePlay');
        this.node.on('touchstart', function () {
            cc.director.loadScene("GamePlay");
        });
    }

    start() {

    }

    // update (dt) {}
}
