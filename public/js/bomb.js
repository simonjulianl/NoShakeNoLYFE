class Bomb extends Phaser.GameObjects.Sprite{
    constructor(scene, dude){
        var x = dude.x;
        var y = dude.y;
        var type = dude.getData('type')
        if(type === 'green'){
            super(scene, x, y, "bomb");
            this.play("fireAttack");
        } else if (type === 'pink'){
            super(scene, x, y, 'arrow');
        } else if (type === 'red'){
            super(scene, x, y, 'dagger');
        }
        
        scene.projectiles.add(this);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        
        this.body.velocity.x = gameSettings.projectileSpeed;
        this.setScale(3);
    }

    update(){
        if(this.x > config.width - 8){
            this.destroy();
        }
    }
}