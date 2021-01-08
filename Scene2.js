class Scene2 extends Phaser.Scene {
    constructor() {
      super("playGame");
    }
  
    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "sky");
        this.background.setOrigin(0, 0);

        //SCORE LABEL
        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 30);
        graphics.lineTo(0, 30);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();
        this.scoreLabel = this.add.text(20, 10, "SCORE " + gameSettings.gameScore);
    
        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.dude = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "dude");
        this.dude.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.dude.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();
    
        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");
    
        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.physics.add.overlap(this.dude, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }
  
    update() {
  
      this.moveShip(this.ship1, 1);
      this.moveShip(this.ship2, 2);
      this.moveShip(this.ship3, 3);
  
      this.background.tilePositionY -= 0.5;

      this.movePlayerManager();
        
      if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBomb();
            console.log("Fire!");
      }
      for(var i = 0; i < this.projectiles.getChildren().length; i++){
          var bomb = this.projectiles.getChildren()[i];
          bomb.update();
      }
    }
  
    moveShip(ship, speed) {
      ship.y += speed;
      if (ship.y > config.height) {
        this.resetShipPos(ship);
      }
    }
  
    resetShipPos(ship){
      ship.y = 0;
      var randomX = Phaser.Math.Between(0, config.width);
      ship.x = randomX;
    }
  
    destroyShip(pointer, gameObject) {
      gameObject.setTexture("explosion");
      gameObject.play("explode");
    }

    movePlayerManager(){
        if(this.cursorKeys.left.isDown){
            this.dude.setVelocityX(-gameSettings.playerSpeed);
        } else if(this.cursorKeys.right.isDown){
            this.dude.setVelocityX(gameSettings.playerSpeed);
        } else{
            this.dude.setVelocityX(0);
        }
    }

    shootBomb(){
        var bomb = new Bomb(this);
    }

    hurtPlayer(player, enemy){
         this.resetShipPos(enemy);
         player.x = config.width / 2 - 8;
         player.y = config.height - 64;
    }

    hitEnemy(projectile, enemy){
        projectile.destroy();
        this.resetShipPos(enemy);
        gameSettings.gameScore += gameSettings.enemyPoint;
        this.scoreLabel.text = "SCORE " + gameSettings.gameScore;
    }
}