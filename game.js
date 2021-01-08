var gameSettings = {
    playerSpeed: 200,
    gameScore: 0,
    enemyPoint: 10,
    lives: 3,
    gameOver: false
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