const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    pickRadius: number = 0;
    game: any;

    getPlayerDistance() {
        // determine the distance according to the position of the player node
        var playerPos = this.game.player.getPosition();

        // calculate the distance between two nodes according to their positions
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onLoad() {
        this.dir = Math.random() > 0.5 ? 1 : -1;
        // this.speed_x = 100 + Math.floor(120 * Math.random());
        this.speed_x = 50 + Math.floor(50 * Math.random());
    }

    onPicked() {

        // invoke the scoring method of the game script
        this.game.gainScore()

        // then destroy the current star's node
        this.node.destroy();
    }
    speed_x: number;
    time = 0
    timeplayer = 60;
    dir: number;
    public update(dt) {
        if (!this.game.isPause) {
            this.time += dt;
            this.timeplayer -= dt;
            if (this.time > 7) {
                this.speed_x += 20;
                this.time = 0;
            }
            if (this.timeplayer <= 17) {
                this.speed_x = 200 + Math.floor(100 * Math.random());
            }

            this.node.x += this.speed_x * dt * this.dir;
            if (this.node.x < -cc.winSize.width / 2 + this.node.width / 2)
                this.dir = 1;
            if (this.node.x > cc.winSize.width / 2 - this.node.width / 2)
                this.dir = -1;

            this.node.y -= this.speed_x * dt;
            if (this.node.y < -800) this.node.y = 800;
            if (this.getPlayerDistance() < this.pickRadius) {
                // invoke collectiong behavior
                this.onPicked();
                // return;
            }
        }
    }

    setEggsTexture(texture) {
        this.node.getComponent(cc.Sprite).spriteFrame = texture;
    }
}