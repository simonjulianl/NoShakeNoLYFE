let oldX = 0;
let oldY = 0;
let oldZ = 0;
let permissionGranted = false;

socket = io();
socket.on('connect', () => socket.emit('mobileToServer', socket.id));

//drop Player if no of players more than supported
socket.on('dropPlayer', (socketId) => {
    if ( socketId === socket.id ) {
        socket.disconnect();
    }
});

function updateVars(newX, newY, newZ) {
    oldX = newX;
    oldY = newY;
    oldZ = newZ;
}

function deviceMotionHandler(data){
    let newX = data.acceleration.x;
    let newY = data.acceleration.y;
    let newZ = data.acceleration.z;

    let delta = Math.abs(newY - oldY);
    
    if (delta > 10){
        socket.emit('deviceShaking', socket.id);
    } else{
        socket.emit('deviceNotShaking', socket.id);
    }

    setTimeout(() => updateVars(newX, newY, newZ), 100);
}

function requestPermission () {
    if (!permissionGranted){
        if(window.DeviceMotionEvent.requestPermission !== undefined){
            window.DeviceMotionEvent.requestPermission()
            .then(response => {
                window.addEventListener('devicemotion', (data) => deviceMotionHandler(data));
                permissionGranted = true;
            })
            .catch(console.error);
        } else{
            window.addEventListener('devicemotion', (data) => deviceMotionHandler(data));
            permissionGranted = true;
        }
    }
}

function buttonUp(){
    requestPermission();
    socket.emit("moveUp", socket.id);
}

function buttonDown(){
    requestPermission();
    socket.emit("moveDown", socket.id);
}
