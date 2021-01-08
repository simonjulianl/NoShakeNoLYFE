class Boss extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, bossHealth){
        super(scene, x, y, "boss");
        scene.bosses.add(this);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.x = -gameSettings.enemySpeed / 2;
        // create the animation 
        this.setScale(7);
        this.play("bossIdle");
        this.health = bossHealth;
    }

    getHit(){
        console.log(this.health);
        if(this.health > 0){
            this.health -= 1;
            this.play("bossAttacked");
            setTimeout(() => {this.play("bossIdle")}, 500);
        } else {
            this.scene.bossExist = false;
            this.destroy();
            gameSettings.gameScore += gameSettings.enemyPoint * 5;
        }
    }

    update(toAttack){
        if(this.x < 200){
            this.body.velocity.x = 0;
            if(toAttack){
                this.on('animationcomplete', () => {
                    gameSettings.lives -= 1;
                    this.scene.hearts.getChildren()[0].update();
                    console.log(gameSettings.lives);

                    if(gameSettings.lives === 0){
                        gameSettings.gameOver = true;
                        this.scene.bgMusic.stop();
                        return;
                    }

                });

                this.play("bossAttack", true)
            }
            return 1;
        } else{
            return 0;
        }
    }
}
