class Bomb extends Phaser.GameObjects.Sprite{
    constructor(scene){
        var x = scene.dude.x;
        var y = scene.dude.y;
        super(scene, x, y, "bomb");
        scene.projectiles.add(this);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.x = 250;
    }

    update(){
        if(this.y < 8){
            this.destroy();
        }
    }
}