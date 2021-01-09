var lane1;
var lane2;
var lane3;

const startingX = 75;
const startingY = 320;

const tileX = 150;
const tileY = 150;

// var currentLane = startingY + tileY;
var count = 0;

// voice recognition to be done 
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'ja';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const voiceCoolDown = 1000; // cooldown between events

var commands = ['死ね' ,'止めて'];
var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;'

speechRecognitionList.addFromString(grammar, 10000);

recognition.onspeechend = () => {
    voiceActivate = false;
    ultiText.visible = false;
}

recognition.onnomatch = (event) => {
    console.log("not recognized");
    ultiText.visible = false;
}

recognition.onerror = (event) => {
    console.log(event.error);
    ultiText.visible = false;
}

var voiceActivate = false;

function activateVoice(){
    if(!voiceActivate){
        recognition.start();
        voiceActivate = true;
        console.log('Ready to receive command');
        ultiText.visible = true;
    }
}

var ultimateReady = false;
var ultiText;  

var ultimateBarIncrease = 0.1;

var boss;
var bossHealth = 10;

var monsterChance = 90; // /100 percent, this is the noober one
var enemyChance = 90; // 

var bgMusicPlaying  = true;

class chargeBar {
    constructor (scene, x, y){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bossExist = false;

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 0;

        this.maxBar = 5.0;

        this.draw();
        this.scene = scene;
        scene.add.existing(this.bar);
    }

    increase (amount){
        this.p += amount;

        if (this.p > this.maxBar){
            this.p = this.maxBar;
        }

        this.draw();
    }
    
    reset (){
        this.p = 0;
        this.draw();
    }

    draw (){
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 5, 7);
        this.bar.setScale(2);

        if (this.p >= this.maxBar){
            ultiText.visible = true;
            this.bar.fillStyle(0xff0000); //red
            ultimateReady = true;
            activateVoice();
        } else{
            ultimateReady = false;
            this.bar.fillStyle(0x00ff00); //green
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 4, this.y + 4, d, 12);
    }

}

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    yesCharging(playerId, players){
        // this.chargingMusic.play();
        players[playerId].charge += 1;
        // console.log(players[playerId].charge);
    }

    noCharging(playerId, players){}
  
    mid(){
        return startingY + tileY;
    }

    top(){
        return startingY;
    }

    bottom(){
        return startingY + 2 * tileY;
    }

    create(playerList) {
        this.bgMusic = this.sound.add('theme', { volume: 1.0, loop: true });
        this.bgMusic.stop();
        this.bgMusic.play();
        this.bgMusic.resume();

        this.playerList = playerList;
        this.players = {};

        this.socket = io(); // Connects to server

        // list the skills 
        recognition.onresult = event => {
            var result = event.results[0][0].transcript; 
            console.log(result + ' Confidence : ' + event.results[0][0].confidence); 
            if(result.substring(0, 2) === '死ね' && ultimateReady){
                this.ultimateSHINE();
                this.ultimateBar.reset();
                ultiText.visible = false;
                ultimateReady = false;
            } else if (result.substring(0, 3) === "止めて" && ultimateReady){ // actually i think thats not yamete
                this.ultimateYAMETE();
                this.ultimateBar.reset();
                ultiText.visible = false;
                ultimateReady = false;
            }
        }

        this.background = this.add.tileSprite(0, 0, config.width, config.height, "sky");
        this.background.setOrigin(0, 0);


        this.chargingMusic = this.sound.add('charging', {volume : 0.5, loop : false});
        this.chargingMusic.stop();

        this.enemyHit = this.sound.add('enemyHit', {volume : 0.5, loop : false});
        this.enemyHit.stop();

        //CREATE LANE
        // setting up stage, tile of 150 x 150 pixels;
        lane1 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : this.top(), stepX : tileX, stepY : 0}
        });

        lane2 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : this.mid(), stepX : tileX, stepY : 0}
        });

        lane3 = this.physics.add.staticGroup({
            key : 'tile',
            repeat : 6,
            setXY : {x : startingX, y : this.bottom(), stepX : tileX, stepY : 0}
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

        //ULTIMATE BAR
        this.ultimateBar = new chargeBar(this, 7, 12);
        ultiText = this.add.text(50, 35, "ULTI READY!! SHOUT IT!");
        ultiText.visible = false;

        //INITIALIZE ENEMIES, PROJECTILES, HEARTS, SHOOTING KEY
        this.enemies = this.add.group();
        this.projectiles = this.add.group();
        this.hearts = this.add.group();
        this.bosses = this.add.group();

        for(var i = 0; i < gameSettings.lives; i++){
            var heart = new Heart(this, config.width - 250 - 30 * (3 - i), 15);
        }

        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        //INITIALIZE PLAYER/S
        for(let i = 0; i < playerList.length; i++){
            // Setup player
            let id = playerList[i].id;
            let characterAvatar = playerList[i].character;

            console.log(playerList);
            console.log(id);
            console.log(characterAvatar);

            this.players[id] = {
                'playerObject' : this.physics.add.sprite(tileX / 2, startingY + i * tileY, characterAvatar),
                'charge' : 0,
                'currentLane' : i % 3 === 0 
                                    ? this.top()
                                    : i % 3 === 1
                                        ? this.mid()
                                        : this.bottom()
            };

            this.players[id].playerObject.setData('currentLane', this.players[id].currentLane);
            this.players[id].playerObject.setData('type', characterAvatar);
            this.players[id].playerObject.play("idle_" + characterAvatar);
            this.players[id].playerObject.setScale(2);    
            this.players[id].playerObject.setCollideWorldBounds(true);
            this.physics.add.overlap(this.players[id].playerObject,
                                        this.enemies,
                                        this.hurtPlayer, null, this);
        }
        this.physics.add.overlap(this.projectiles, this.bosses, this.getHit, null, this);

        // Setup controls
        this.socket.on('yesShaking', (playerId) => this.yesCharging(playerId, this.players));
        this.socket.on('noShaking', (playerId) => this.noCharging(playerId, this.players));
        this.socket.on('moveUp', (playerId) =>this.moveUp(playerId));
        this.socket.on('moveDown', (playerId) =>this.moveDown(playerId));
    }
    
    getHit(projectile, boss){
        if(this.bossExist){
            this.bosses.children.iterate(child => { 
                if(child !== undefined){
                    child.getHit();
                }
            })
        }
        projectile.destroy();
        this.enemyHit.play();
    }

    update() {

        if(ultimateReady && bgMusicPlaying){
            this.bgMusic.pause();
            this.bgMusic.setVolume(1.0);
            this.bgMusic.resume();
            bgMusicPlaying = false;
        } else if(bgMusicPlaying){
            // do nothing
        } else {
            this.bgMusic.setVolume(1.0);
            bgMusicPlaying = true;
        }

        count += 1;
        // console.log(count);

        if(gameSettings.gameOver){
            for (let i = 0; i < this.players.length; i ++){
                id = this.playerList[i].id;
                this.players[id].playerObject.setVelocityY(0);
            }
            this.gameOverText.visible= true;
            this.bgMusic.stop();
            bgMusicPlaying = false;

            return;
        }

        // generate enemy 
        if(Phaser.Math.Between(0, 10000) < enemyChance){
            this.generateEnemy();
        }

        if(Phaser.Math.Between(0, 10000) < monsterChance){
            this.generateMonster();
        }

        // increase level, create a new wave 
        if(count % 2000 === 0 && !this.bossExist){
            this.bossExist = true;
            this.generateBoss();

            bossHealth += 30;
            enemyChance += 60;
            monsterChance += 60;
            ultimateBarIncrease /= 1.1;
        }

        for(let i = 0; i < this.playerList.length; i++){
            let id = this.playerList[i].id;
            let player = this.players[id];

            // if(player.charge){
            //     if(player.playerObject.active && this.healthBar.scaleX < 1){
            //         this.addValue(this.healthBar);
            //     } else if(player.playerObject.active && this.healthBar.scaleX >= 1){
            //         player.playerObject.on('animationcomplete', () => {
            //             this.setValue(this.healthBar, 0);
            //             player.playerObject.play('idle_' + this.playerList[i].character, true);
            //     });
            //         this.shootBomb(player.playerObject);
            //         this.ammoText.visible = false;
            //         player.playerObject.play('attack_' + this.playerList[i].character, true);  
            //     }
            // }    

            if(player.playerObject.active && player.charge < 10){

            } else if(player.playerObject.active & player.charge >= 10){
                player.playerObject.on('animationcomplete', () => {
                    player.charge = 0;
                    player.playerObject.play('idle_' + this.playerList[i].character, true);
                });
                    this.shootBomb(player.playerObject);
                    player.playerObject.play('attack_' + this.playerList[i].character, true);  
                }
            }

        // if(this.healthBar.scaleX >= 1){
        //     this.ammoText.visible = true;
        // }
    
        this.background.tilePositionX += 0.5;

            
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
                this.bgMusic.stop();
                bgMusicPlaying = false;
                break;
            }
        }

        if(this.bossExist){
            this.bosses.children.iterate(child => { 
                if(child !== undefined){
                    child.update(count % 200 === 0);
                }
            })
        }
    }

    ultimateSHINE(){
        const newLaser = this.add.image(1100, 450, 'laser').setScale(8.0);
        setTimeout(() => newLaser.destroy(), 1000);
        for(let i = 0; i < 10; i++){ 
            // need to repeat because otherwise some of the monsters are not deleted
            this.enemies.children.iterate(child => { 
                if(child !== undefined){
                    const point = this.add.image(child.x, child.y, 'point');
                    gameSettings.gameScore += gameSettings.enemyPoint;
                    this.scoreLabel.text = "SCORE " + gameSettings.gameScore;
                    this.tweens.add({
                        targets: point,
                        x : 100,
                        y: 30,
                        duration: 1000,
                        ease: "Sine.easeInOut",
                        yoyo: false,
                        repeat : 0,
                        callbackScope : this,
                        onComplete : () => {
                            point.alpha = 0;
                            point.destroy();
                        }
                    });
                    child.destroy();
                }
            })
        }

        for(let i = 0; i < 3 ; i++){
            if(this.bossExist){
                this.bosses.children.iterate(child => { 
                    if(child !== undefined){
                        child.getHit();
                    }
                })
            }
        }
    }

    ultimateYAMETE(){
        // todo 
        for(let i = 0; i < 10; i++){ 
            // need to repeat because otherwise some of the monsters are not deleted
            this.enemies.children.iterate(child => { 
                if(child !== undefined){
                    child.body.velocity.x = 0;
                }
            })
            if(this.bossExist){
                boss.body.velocity.x = 0;
            }
        }

       
        this.enemies.children.iterate(child => {
            if(child !== undefined){
                setTimeout( () => {
                    child.body.velocity.x = -gameSettings.enemySpeed;
                    if(this.bossExist){
                        boss.body.velocity.x  = -gameSettings.enemySpeed / 2;
                    }
                }, 5000)              
            }
        })
    }

    moveUp(playerId){
        let player = this.players[playerId];
        if(player.playerObject !== undefined){
            if(player.playerObject.alpha === 1){
                player.currentLane = player.currentLane === startingY
                                        ? player.currentLane
                                        : player.currentLane - tileY;
                player.playerObject.setPosition(tileX / 2, player.currentLane);
                player.playerObject.setData('currentLane', player.currentLane);
            } else{
                player.playerObject.setVelocityY(0);
            }
        }
    }

    moveDown(playerId){
        let player = this.players[playerId];
        if(player.playerObject !== undefined){
            if(player.playerObject.alpha === 1){
                player.currentLane = player.currentLane === this.bottom()
                                        ? player.currentLane
                                        : player.currentLane + tileY;
                player.playerObject.setPosition(tileX / 2, player.currentLane);
                player.playerObject.setData('currentLane', player.currentLane);
            } else{
                player.playerObject.setVelocityY(0);
            }
        }
    }

    generateBoss(){
        var x = config.width;
        var y = 450;
        var randomY = config.height;
        boss = new Boss(this, x, y, bossHealth);
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

    shootBomb(dude){
        var bomb = new Bomb(this, dude);
    }

    hurtPlayer(dude, enemy){
        //this.resetShipPos(enemy);
        // dude is a playerObject

        if(dude.alpha < 1){
            return;
        }
        this.chargingMusic.play();
        enemy.destroy();

        this.hearts.getChildren()[0].update();
        gameSettings.lives -= 1;
        console.log(gameSettings.lives);
        if(gameSettings.lives === 0){
            gameSettings.gameOver = true;
            this.bgMusic.stop();
            bgMusicPlaying = false;
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
        this.resetPlayer(dude);
    }

    resetPlayer(dude){
        var x = 0;
        if(dude !== undefined){
            var y = dude.getData('currentLane');
            dude.enableBody(true, x, y, true, true);

            dude.alpha = 0.5;

            var tween = this.tweens.add({
                targets: dude,
                x: tileX / 2,
                ease: 'Power1',
                duration: 1500,
                repeat: 0,
                onComplete: function(){
                    dude.alpha = 1;
                },
                callbackScope: this
            })
        }
    }

    hitEnemy(projectile, enemy){

        var explosion = new Explosion(this, enemy.x, enemy.y);
        const point = this.add.image(enemy.x, enemy.y, 'point');

        projectile.destroy();
        
        this.ultimateBar.increase(ultimateBarIncrease);
        gameSettings.gameScore += gameSettings.enemyPoint;
        this.scoreLabel.text = "SCORE " + gameSettings.gameScore;

        this.tweens.add({
            targets: point,
            x : 100,
            y: 30,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: false,
            repeat : 0,
            callbackScope : this,
            onComplete : () => {
                point.alpha = 0;
                point.destroy();
            }
        });

        enemy.destroy();

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
        bar.scaleX += 0.05; 
    }
}