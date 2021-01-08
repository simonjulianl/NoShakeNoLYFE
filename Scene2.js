var lane1;
var lane2;
var lane3;

const startingX = 75;
const startingY = 320;

const tileX = 150;
const tileY = 150;

var currentLane = startingY + tileY;
var count = 0;

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }
  
    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "sky");
        this.background.setOrigin(0, 0);

        //CREATE LANE
        // setting up stage, tile of 150 x 150 pixels;
        lane1 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : startingY, stepX : tileX, stepY : 0}
        });

        lane2 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : startingY + tileY, stepX : tileX, stepY : 0}
        });

        lane3 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : startingY + tileY * 2, stepX : tileX, stepY : 0}
        });
        //SCORE LABEL
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(config.width, 0);
        this.graphics.lineTo(config.width, 30);
        this.graphics.lineTo(0, 30);
        this.graphics.lineTo(0, 0);
        this.graphics.closePath();
        this.graphics.fillPath();
        this.scoreLabel = this.add.text(20, 10, "SCORE " + gameSettings.gameScore);

        //GAMEOVER TEXT
        this.gameOverText = this.add.text(config.width / 2, config.height / 2, "Game Over", {fontSize: '64px', fill: '#000'});
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.visible = false;
    
        //AMMO BAR
        this.healthBar = this.makeBar(150, 5, 0x2ecc71);
        this.setValue(this.healthBar, 0);

        //AMMO FULL
        this.ammoText = this.add.text(300, 10, "SHOOT!");
        this.ammoText.visible = false;

        //INITIALIZE ENEMIES
        /*
        this.ship1 = this.add.sprite(config.width, startingY, "ship");
        this.ship2 = this.add.sprite(config.width, startingY + tileY, "ship2");
        this.ship3 = this.add.sprite(config.width, startingY + tileY * 2, "ship3");
        */

        //INITIALIZE PLAYER
        this.dude = this.physics.add.sprite(tileX / 2, currentLane, "dude");
        this.dude.play("thrust");
        this.dude.setScale(2);
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.dude.setCollideWorldBounds(true);

        //INITIALIZE ENEMIES, PROJECTILES, HEARTS, SHOOTING KEY
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enemies = this.add.group();
        this.projectiles = this.add.group();
        this.hearts = this.add.group();

        for(var i = 0; i < gameSettings.lives; i++){
            var heart = new Heart(this, config.width - 30 * (3 - i), 15);
        }
        /*
        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");
        */
    
        /*//CLICK PLANE
        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);
        */

        this.physics.add.overlap(this.dude, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }
  
    update() {
        count += 1;
        console.log(count);

        if(gameSettings.gameOver){
            this.dude.setVelocityY(0);
            this.gameOverText.visible= true;
            return;
        }

        if(count % 200 === 0){
            for(let i = 0; i < count / 1000; i++){
                setTimeout(() => Phaser.Math.Between(0, 10) > 3 ? this.generateEnemy() : this.generateMonster(), i * 500);
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            if(this.dude.active && this.dude.alpha === 1  && this.healthBar.scaleX < 1){
                this.addValue(this.healthBar);
            } else if(this.dude.active && this.dude.alpha === 1  && this.healthBar.scaleX >= 1){
                this.shootBomb();
                console.log("Fire!");
                this.setValue(this.healthBar, 0);
                this.ammoText.visible = false;
            }
        }

        if(this.healthBar.scaleX >= 1){
            this.ammoText.visible = true;
        }

        /*
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);
        */
    
        this.background.tilePositionX += 0.5;

        this.movePlayerManager();
            
        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var bomb = this.projectiles.getChildren()[i];
            bomb.update();
        }

        for(var i = 0; i < this.enemies.getChildren().length; i++){
            var enemies = this.enemies.getChildren()[i];
            if(enemies.update()){
                gameSettings.lives -= 1;
                this.hearts.getChildren()[0].update();
            }
            if(gameSettings.lives === 0){
                gameSettings.gameOver = true;
                break;
            }
        }
    }
  
    /*
    moveShip(ship, speed) {
        ship.x -= speed;
        if (ship.x < 0) {
            this.resetShipPos(ship);
            this.hearts.getChildren()[0].update();
            gameSettings.lives -= 1;
            console.log(gameSettings.lives);
                if(gameSettings.lives === 0){
                gameSettings.gameOver = true;
                return;
            }
        }
    }
  
    resetShipPos(ship){
        ship.x = config.width;
        var randomY = Phaser.Math.Between(0, 2);
        ship.y = startingY + randomY * tileY;
    }
    
    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }
    */

    movePlayerManager(){
        if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.up) && this.dude.alpha === 1){
            currentLane = currentLane === startingY ? currentLane : currentLane - tileY;
            this.dude.setPosition(tileX / 2, currentLane);
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.down) && this.dude.alpha === 1){
            currentLane = currentLane === startingY + 2 * tileY ? currentLane : currentLane + tileY;
            this.dude.setPosition(tileX / 2, currentLane);
        } else{
            this.dude.setVelocityY(0);
        }
    }

    generateEnemy(){
        var x = config.width;
        var randomY = Phaser.Math.Between(0, 2);
        var y = startingY + randomY * tileY;
        var enemy = new Enemy(this, x, y);
    }

    generateMonster(){
        var x = config.width;
        var randomY = Phaser.Math.Between(0, 2);
        var y = startingY + randomY * tileY;
        var enemy = new Monster(this, x, y);
    }

    shootBomb(){
        var bomb = new Bomb(this);
    }

    hurtPlayer(dude, enemy){
        //this.resetShipPos(enemy);

        if(this.dude.alpha < 1){
            return;
        }
        
        enemy.destroy();

        this.hearts.getChildren()[0].update();
        gameSettings.lives -= 1;
        console.log(gameSettings.lives);
        if(gameSettings.lives === 0){
            gameSettings.gameOver = true;
            return;
        }

        var explosion = new Explosion(this, dude.x, dude.y);

        dude.disableBody(true, true);

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
        this.resetPlayer();
    }

    resetPlayer(){
        var x = 0;
        var y = currentLane;
        this.dude.enableBody(true, x, y, true, true);

        this.dude.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.dude,
            x: tileX / 2,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function(){
                this.dude.alpha = 1;
            },
            callbackScope: this
        })
    }

    hitEnemy(projectile, enemy){

        var explosion = new Explosion(this, enemy.x, enemy.y);

        projectile.destroy();
        enemy.destroy();
        gameSettings.gameScore += gameSettings.enemyPoint;
        this.scoreLabel.text = "SCORE " + gameSettings.gameScore;
    }

    makeBar(x, y,color) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, 100, 20);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }

    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage/100;
    }

    addValue(bar){
        bar.scaleX += 0.2; 
    }
}