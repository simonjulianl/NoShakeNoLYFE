class LobbyScene extends Phaser.Scene {
    constructor() {
      super("LobbyScene");
    }

    playerUpdate(){
        this.playerList.forEach( (player, i) => {
            //get position and width for that specific number of players
            
            let characterWidth = config.width/this.playerList.length;
            let characterPos = i*characterWidth + characterWidth/2;
            
            player.character = this.characterList[i];

            if ( player.sprite !== null ) {
               player.sprite.destroy();
               player.ready.destroy();
               player.bg.destroy();
            }

            player.bg = this.add.image(characterPos, config.height/2, this.bgList[i]);
            player.bg.displayWidth = characterWidth+10;
            player.bg.displayHeight = config.height;

            player.sprite = this.add.sprite(characterPos, config.height/2, this.characterList[i]);
            player.ready = this.add.text(characterPos-55, config.height/2 - 100, 'READY', { fill: '#ff0000' , fontFamily: 'Georgia', fontSize: '40px'});
        });
    }
    create() {
        this.characterList = ["green", "red", "pink"];
        this.bgList = ["green_bg", "red_bg", "pink_bg"];

        this.playerList = [];
        this.socket = io();
        
        this.socket.on('connect', () => this.socket.emit("lobby_scene_connected"));
        this.socket.on('deletePlayer', (socketId) => {
            console.log("Player left");
            
            for(let i = 0; i < this.playerList.length; i++){
                this.playerList[i].sprite.destroy();
                this.playerList[i].ready.destroy();
                this.playerList[i].bg.destroy();
            }

            this.playerList = this.playerList.filter( p => p.id !== socketId);
            console.log(this.playerList);
            this.playerUpdate();
        });
        
        this.socket.on("newPlayer", (socketId) => {
            //game only support 3 players at a time, if more than 3 players, drop connection to 4th player
            if (this.playerList.length === 3) {
                console.log("Fourth player dropped");
                this.socket.emit("dropPlayer", socketId);
                return;
            }

            let newPlayer = {
                'id': socketId,
                'isReady': false,
                'sprite': null, //character sprite
                'ready': null,   //ready sign underneath
                'bg': null,
                'character': null,
            } 
            this.playerList.push(newPlayer);
            //depending on number of players, adjust their position accordingly.
            //then add all sprite
            this.playerUpdate();
        })
        //when player call ready
        this.socket.on("moveUp", (socketId) => this.playerReady(socketId));
        this.socket.on("moveDown", (socketId) => this.playerReady(socketId));
    }

    playerReady(socketId) {
        //update isReady property
        this.playerList.forEach( (player) => {
            if(player !== null){
                if ( player.id === socketId ) {
                    player.isReady = !player.isReady;
                    player.ready.setStyle({fill: player.isReady? '#008000' : '#ff0000' });
                }
            }
        })
        //check if all players is ready then move to game scene
        if ( this.isAllPlayerReady() ) {
            let playerIdList= [];
            this.playerList.forEach((player) => {
                playerIdList.push({
                    'id': player.id,
                    'character': player.character,
                }) 
            })

            this.socket.disconnect();
            this.scene.start('playGame', playerIdList);
        }
    }

    isAllPlayerReady() {
        if ( this.playerList.length === 0 ) {
            return false;
        }
        for ( let i=0; i < this.playerList.length; i++ ) {
            let player = this.playerList[i];
            if ( !player.isReady ) {
                return false;
            }
        }
        return true;
    }
  }