var gameSettings = {
    gameScore: 0,
    enemyPoint: 10,
    lives: 10,
    gameOver: false,
    enemySpeed: 30,
    projectileSpeed:  500
}

var config = {
    width: 1050,
    height: 700,
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade:{
            debug: false
        }
    },
    scene: [Scene1, LobbyScene ,Scene2]
}

var game = new Phaser.Game(config);