class LoadingScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("sky", "assets/images/background.jpg");
        this.load.image("bomb", "assets/images/ammo.png");
        this.load.image("star", "assets/images/star.png");
        this.load.image("tile", "assets/images/tile.png");
        this.load.image("laser", "assets/images/laser.png");

        this.load.spritesheet("boboi", "assets/images/boi.png", {
            frameWidth: 40,
            frameHeight : 68 
        })

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
        this.load.spritesheet("boss", "assets/spritesheets/gal.png",{
            frameWidth: 48,
            frameHeight: 48      
        });
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        this.anims.create({
            key : "idle",
            frames : this.anims.generateFrameNumbers("boboi", {start : 0 , end : 1}),
            frameRate : 4,
            repeat : -1
        })

        this.anims.create({
            key : "attack",
            frames : this.anims.generateFrameNumbers("boboi", {start : 2 , end : 4}),
            frameRate : 20,
            repeat : 0
        }) 

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
    }
}