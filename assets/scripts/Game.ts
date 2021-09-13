import CompletePopup from "./CompletePopup";
import Player from "./Player";
import Star from "./Star";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    // This property quotes the PreFab resource of stars
    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    // The random scale of disappearing time for stars
    @property
    maxStarDuration: number = 0;

    @property
    minStarDuration: number = 0;

    // Player node for obtaining the jump height of the main character and controlling the movement switch of the main character
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    btnPause: cc.Node = null;

    @property(cc.Node)
    clock: cc.Node = null;

    // reference of score label
    @property(cc.Label)
    scoreDisplay: cc.Label = null;

    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null;

    @property([cc.SpriteFrame])
    button: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    completePopup: cc.Prefab = null;

    starDuration: number;
    timer: number;
    score: number;
    groundY: number;
    // limit time: (s)
    private _timeLimit: number = 20;
    private listTexture: [cc.SpriteFrame] = [null];
    // time play game
    countTime: number = 0;
    isPause: boolean = false;
    private numberOfEggs: number;
    private numberOfEggsLeft: number;

    async onLoad() {
        await this.onLoadTexture();
        // initialize timer
        this.timer = 0;
        this.starDuration = 0;
        this.numberOfEggs = this.generateRandom(5, 10);
        this.numberOfEggsLeft = this.numberOfEggs;
        let numberOfFirstEggs = this.numberOfEggs;
        while (numberOfFirstEggs > 0) {
            // generate a new star
            this.spawnNewStar();
            numberOfFirstEggs--;
        }

        // initialize scoring
        this.score = -1;
        this.gainScore();
    }

    onEnable() {
        this.btnPause.on('click', () => {
            if (this.btnPause.getComponentInChildren(cc.Label).string == 'Pause') {
                this.btnPause.getComponentInChildren(cc.Sprite).spriteFrame = this.button[1];
                this.btnPause.getComponentInChildren(cc.Label).string = 'Resume';
                this.isPause = true;
                this.player.getComponent(Player).isPause = true;

            }
            else {
                this.btnPause.getComponentInChildren(cc.Sprite).spriteFrame = this.button[0];
                this.btnPause.getComponentInChildren(cc.Label).string = 'Pause';
                this.isPause = false;
                this.player.getComponent(Player).isPause = false;
            }

        });
    }

    onDisable() {
        this.btnPause.off('click', function () {
            this.gameOver();
        });
    }

    spawnNewStar() {
        // Generate a new node in the scene with a preset template
        var newEgg = cc.instantiate(this.starPrefab);
        // Put the newly added node under the Canvas node
        this.node.addChild(newEgg);
        newEgg.getComponent(Star).game = this;

        const random = this.generateRandom(0, this.listTexture.length - 1);
        newEgg.getComponent(Star).setEggsTexture(this.listTexture[random]);
        newEgg.x = this.generateRandom(-this.node.width / 2 + this.player.width, this.node.width / 2 - this.player.width, false);
        // newEgg.y = this.generateRandom(-this.node.height / 2 + this.player.height / 2 + 20, this.node.height / 2 - this.player.height, false);
        // e.x = -530 + 1060 * Math.random();
        newEgg.y = 500;
        newEgg.angle = this.generateRandom(0, 360, false);
        // reset timer, randomly choose a value according the scale of star duration
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    update(dt) {
        // Update timer for each frame, when a new star is not generated after exceeding duration
        if (this.isPause)
            return;
        else {
            // invoke the logic of game failure
            // if (this.timer > this.starDuration) {
            //     this.gameOver();
            //     return;
            // }

            this.timer += dt;
            if (this._timeLimit > 0) {
                this._timeLimit -= dt;

                this.clock.getComponentInChildren(cc.Label).string = this.toMMSS(
                    this._timeLimit
                );
                // if (this._timeLimit < 17 && this._isshowHighlight === false) {
                //     this.highlight();
                // }
                // if (this._timeLimit < 30) {
                //     this.schedule(this.createOneEnemy, 1);
                // }
                if (this._timeLimit < 10) {
                    this.runOutOfTime();
                }
            } else {
                this.clock.getComponentInChildren(cc.Label).string = this.toMMSS(0);
                this.gameOver();
            }
        }


    }

    gameOver() {
        this.isPause = true;
        this.player.stopAllActions();
        this.player.y = -100;
        this.player.x = 0;
        const popup = cc.instantiate(this.completePopup);
        popup.setParent(this.node);
        const popupCmp = popup.getComponent(CompletePopup);
        popupCmp.setTitle('GameOver');
        popupCmp.setContent("You have collected: " + this.score + " eggs!")
        popupCmp.setYesCallback(() => {
            cc.director.loadScene('PlayGame');
        })
    }

    gainScore() {
        this.score += 1;
        this.numberOfEggsLeft -= 1;
        // update the words of the scoreDisplay label
        this.scoreDisplay.string = this.score.toString();
        // Play the scoring sound effect
        cc.audioEngine.playEffect(this.scoreAudio, false);
        if (!this.isPause) {
            if (this.numberOfEggsLeft <= Math.round(this.numberOfEggs / 3)) {
                let numberOfFirstEggs = this.generateRandom(1, 10);
                this.numberOfEggs += numberOfFirstEggs - this.numberOfEggsLeft;
                this.numberOfEggsLeft = this.numberOfEggs;
                while (numberOfFirstEggs > 0) {
                    // generate a new star
                    this.spawnNewStar();
                    numberOfFirstEggs--;
                }
            }
        }
    }

    public toMMSS(seconds, useHour = false) {
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const hDisplay = h + ':';
        let mDisplay;
        if (useHour) {
            mDisplay = m > 9 ? m + ':' : '0' + m + ':';
        } else {
            mDisplay = m + ':';
        }
        const sDisplay = s > 9 ? s + '' : '0' + s;

        if (useHour) {
            return hDisplay + mDisplay + sDisplay;
        }
        return mDisplay + sDisplay;
    }

    runOutOfTime() {
        if (
            this.clock.getNumberOfRunningActions() > 0
        ) {
            return;
        }

        cc.tween(this.clock)
            .repeatForever(
                cc
                    .tween()
                    .by(0.25, { scale: -0.05 })
                    .by(0.25, { scale: 0.05 })
                    .by(0.25, { scale: 0.05 })
                    .by(0.25, { scale: -0.05 })
            )

            .start();
    }

    generateRandom(min, max, isInterger: boolean = true) {
        let number
        if (isInterger)
            number = Math.floor(Math.random() * (max - min + 1)) + min;
        else
            number = Math.random() * (max - min + 1) + min;
        return number;
    }

    async onLoadTexture() {
        this.listTexture = [];

        let textureFolder = 'textures/Eggs';


        const listName = cc.resources.getDirWithPath(textureFolder).filter(
            (item, idx, arr) =>
                // remove duplicated
                arr.findIndex((innerItem) => item.path === innerItem.path) ===
                idx
        );

        const listEggTexture: [] = await Promise.all(
            listName.map(
                (item) =>
                    new Promise((resolve, reject) => {
                        cc.resources.load(
                            item,
                            cc.SpriteFrame,
                            (err, spriteFrame: cc.SpriteFrame) => {
                                if (err) {
                                    resolve(undefined);
                                }
                                resolve(spriteFrame);
                            }
                        );
                    })
            )
        );

        this.listTexture.push(...listEggTexture);
        console.log(this.listTexture);

    }

}