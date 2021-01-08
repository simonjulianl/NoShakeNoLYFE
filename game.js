var gameSettings = {
    playerSpeed: 200
}

var config = {
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade:{
            debug: false
        }
    },
    scene: [Scene1, Scene2]
}

var game = new Phaser.Game(config);