const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    jumpHeight: number = 0;

    @property
    jumpDuration: number = 0;

    @property
    maxMoveSpeed: number = 0;

    @property
    accel: number = 0;

    accLeft: boolean;
    accRight: boolean;
    accUp: boolean;
    accDown: boolean;
    xSpeed: number;
    ySpeed: number = 10;
    isPause: boolean = false;


    // add audio
    @property({
        type: cc.AudioClip,
    })
    jumpAudio: cc.AudioClip = null;

    playJumpSound() {
        // Invoke sound engine to play the sound
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    onLoad() {

        // acceleration direction switch
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        // the main charater's current horizontal velocity
        this.xSpeed = 0;

        // Initialize the keyboard input listening
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        //  set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
            case cc.macro.KEY.left:
                this.accLeft = true;
                break;
            case cc.macro.KEY.right:
                this.accRight = true;
                break;
            case cc.macro.KEY.w:
                this.accUp = true;
                break;
            case cc.macro.KEY.s:
                this.accDown = true;
                break;
            case cc.macro.KEY.up:
                this.accUp = true;
                break;
            case cc.macro.KEY.down:
                this.accDown = true;
                break;
        }
    }

    onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
            case cc.macro.KEY.w:
                this.accUp = false;
                break;
            case cc.macro.KEY.s:
                this.accDown = false;
                break;
            case cc.macro.KEY.up:
                this.accUp = false;
                break;
            case cc.macro.KEY.down:
                this.accDown = false;
                break;

        }
    }

    update(dt) {
        // update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel + dt;
        } else if (this.accUp) {
            this.newYPosition(this.ySpeed);
        } else if (this.accDown) {
            this.newYPosition(-this.ySpeed)
        }
        // restrict the movement speed of the main character to the maximum movement speed
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // update the position of the main character according to the current speed
        if (this.node.x + this.xSpeed * dt < - cc.winSize.width / 2 + this.node.width) {
            this.node.x = - cc.winSize.width / 2 + this.node.width
        }
        else if (this.node.x + this.xSpeed * dt > cc.winSize.width / 2 - this.node.width) {
            this.node.x = cc.winSize.width / 2 - this.node.width
        }
        else if (!this.isPause) {
            this.node.x += this.xSpeed * dt;
        }

    }

    newYPosition(ySpeed) {
        // update the position of the main character according to the current speed
        if (this.node.y + ySpeed < -cc.winSize.height / 2 + this.node.height / 2) {
            this.node.y = -cc.winSize.height / 2 + this.node.height / 2 + 5;
        }
        else if (this.node.y + ySpeed > cc.winSize.height / 2 - this.node.height) {
            this.node.y = cc.winSize.height / 2 - this.node.height;
        }
        else if (!this.isPause) {
            this.node.y += ySpeed;
        }
    }

    onDestroy() {
        // cancel keyboad input monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
