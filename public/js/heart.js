class Heart extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "star");
        scene.hearts.add(this);
        scene.add.existing(this);
        this.setScale(2);
    }

    update(){
        this.destroy();
    }
}