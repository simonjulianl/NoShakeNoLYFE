class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("sky", "assets/images/background.jpg");
        this.load.image("bomb", "assets/images/ammo.png");
        this.load.image("star", "assets/images/star.png");
        this.load.image("tile", "assets/images/tile.png");
        this.load.spritesheet("monster", "assets/spritesheets/monster.png",{
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet("enemy", "assets/spritesheets/enemy.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("ship", "assets/spritesheets/ship.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png",{
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosion", "assets/spritesheets/dead.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("dude", "assets/spritesheets/gal.png",{
            frameWidth: 48,
            frameHeight: 48      
        });
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        this.anims.create({
            key: "monster",
            frames: this.anims.generateFrameNumbers("monster"),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "enemy",
            frames: this.anims.generateFrameNumbers("enemy"),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });
    
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "thrust",
            frames: this.anims.generateFrameNumbers("dude"),
            frameRate: 4,
            repeat: -1
        });
    }
}