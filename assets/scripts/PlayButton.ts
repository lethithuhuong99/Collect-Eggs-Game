const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayButton extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene('game');
        this.node.on('touchstart', function () {
            cc.director.loadScene("game");
        });
    }

    start() {

    }

    // update (dt) {}
}
