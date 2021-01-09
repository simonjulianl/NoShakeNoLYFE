class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        //background
        this.load.image("logo", "assets/images/NSNL_Logo2.png");
        this.load.image("sky", "assets/images/background.jpg");
        
        this.load.image("star", "assets/images/heart.png");
        this.load.image("tile", "assets/images/tile.png");
        this.load.image("laser", "assets/images/laser.png");

        this.load.image("point", "assets/images/star.png");
        
        this.load.spritesheet("bomb", "assets/spritesheets/fire.png", {
            frameWidth : 16,
            frameHeight : 16
        });

        //lobby background
        this.load.image("green_bg", "assets/images/green.jpg");
        this.load.image("red_bg", "assets/images/red.png")
        this.load.image("pink_bg", "assets/images/pink.jpg")

        this.load.image("arrow", "assets/images/arrow.png");
        this.load.image("dagger", "assets/images/dagger.png");
        
        //character spritesheet
        // this.load.spritesheet("boboi", "assets/spritesheets/boi.png", {
        //     frameWidth: 102,
        //     frameHeight : 68 
        // })
        
        this.load.spritesheet("green", "assets/spritesheets/green_sprite.png", {
            frameWidth: 64,
            frameHeight : 64 
        })

        this.load.spritesheet("pink", "assets/spritesheets/pink_sprite.png", {
            frameWidth: 64,
            frameHeight : 64 
        })

        this.load.spritesheet("red", "assets/spritesheets/red_sprite.png", {
            frameWidth: 64,
            frameHeight : 64 
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
        this.load.spritesheet("boss", "assets/spritesheets/boss.png",{
            frameWidth: 38,
            frameHeight: 64      
        });

        this.load.audio('theme', [
            "assets/bgm/bgm.mp3"
        ]);

        this.load.audio('charging', [
            "assets/bgm/charging.mp3"
        ]);

        this.load.audio('enemyHit', [
            "assets/bgm/enemyHit.mp3"
        ]);

        this.load.audio('entrance', [
            "assets/bgm/entrance.mp3"
        ]);

        this.load.audio('waiting', [
            "assets/bgm/waiting.mp3"
        ]);    
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "sky");
        this.background.setOrigin(0, 0);
        const logo = this.add.image(510, 250, 'logo');
        this.tweens.add({
            targets: logo,
            y: 330,
            duration: 4000,
            ease: "Power1",
            yoyo: true,
            loop: -1
        });
        
        this.sound.pauseOnBlur = false;
        this.bgMusic = this.sound.add('entrance', { volume: 1.0, loop: true });
        this.bgMusic.play();

        const startButton = this.add.text(482, 450, 'Start!', { fill: '#0f0' }).setScale(2.0);
        startButton.setInteractive()
        .on('pointerover', () => startButton.setStyle({ fill: '#ff0'}))
        .on('pointerout', () => startButton.setStyle({ fill: '#0f0'}))
        .on('pointerdown', () => {
            this.bgMusic.stop();
            this.scene.start("LobbyScene")
        });

        
        //this.scene.start("LobbyScene");

        this.anims.create({
            key : "fireAttack",
            frames : this.anims.generateFrameNumbers("bomb", {start : 0, end : 1}),
            frameRate : 4,
            repeat : -1
        })

        this.anims.create({
            key : "bossAttacked",
            frames : this.anims.generateFrameNumbers("boss", {start : 2, end : 2}),
            frameRate : 4,
            repeat : 1
        })

        this.anims.create({
            key : "bossIdle",
            frames : this.anims.generateFrameNumbers("boss", {start : 0, end : 1}),
            frameRate: 4,
            repeat : -1
        })

        this.anims.create({
            key : "bossAttack",
            frames : this.anims.generateFrameNumbers("boss", {start : 3, end : 4}),
            frameRate : 4,
            repeat : 0
        })

        this.anims.create({
            key : "idle_pink",
            frames : this.anims.generateFrameNumbers("pink", {start : 0 , end : 1}),
            frameRate : 4,
            repeat : -1
        })

        this.anims.create({
            key : "attack_pink",
            frames : this.anims.generateFrameNumbers("pink", {start : 2 , end : 4}),
            frameRate : 20,
            repeat : 0
        }) 

        this.anims.create({
            key : "idle_red",
            frames : this.anims.generateFrameNumbers("red", {start : 0 , end : 1}),
            frameRate : 4,
            repeat : -1
        })

        this.anims.create({
            key : "attack_red",
            frames : this.anims.generateFrameNumbers("red", {start : 2 , end : 4}),
            frameRate : 20,
            repeat : 0
        }) 
        this.anims.create({
            key : "idle_green",
            frames : this.anims.generateFrameNumbers("green", {start : 0 , end : 1}),
            frameRate : 4,
            repeat : -1
        })

        this.anims.create({
            key : "attack_green",
            frames : this.anims.generateFrameNumbers("green", {start : 2 , end : 4}),
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

    update(){
        // To make single click suffices to play
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
        this.background.tilePositionX += 0.5;
    }
}