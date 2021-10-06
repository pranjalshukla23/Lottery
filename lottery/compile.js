//importing the path module
const path = require('path');
//importing the file system module
const fs= require('fs');
//importing the solidity compiler module
const solc = require('solc');

//fetching the path of Lottery.sol contract
const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol');

//reading the Lottery.sol contract
const source = fs.readFileSync(lotteryPath,'utf8');

//compiling the Lottery.sol contract and importing the abi,bytecode to make it available to other modules
module.exports = solc.compile(source,1).contracts[':Lottery'];
