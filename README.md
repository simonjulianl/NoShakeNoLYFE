# DeFentilz
## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project 

## Writing Code
After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `node server/index.js`.

## Connecting to Localhost from Other Devices
1. Make sure that other devices and the main device are in the same LAN
2. Run `ifconfig | grep "inet " | grep -v 127.0.0.1` on the main device and get the first ip address in the last line 
3. Connect to `https://<ip_address_found_in_step_1>:8081` from other devices. Note that Generic Sensors API only works under HTTPS connection
4. If step 3 doesn't work, enable port 8081 in firewall settings of the main device to be used as a screen

## Proposed Features / Changes
1. Add a start screen
2. Add support for multiplayer in one screen
3. Add bosses at certain score level
4. Increase number of enemies spawned sooner