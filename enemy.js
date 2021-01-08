class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "enemy");
        scene.enemies.add(this);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.x = -gameSettings.enemySpeed;
        this.play("enemy");
        this.setScale(2);
    }

    update(){
        if(this.x < 8){
            this.destroy();
            return 1;
        } else{
            return 0;
        }
    }
}