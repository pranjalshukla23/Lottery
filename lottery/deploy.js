const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');

//provider will contain mnemonic phrase of metamask and infura url
const provider = new HDWalletProvider(
    'table mass correct raise ripple wrist twenty digital auto sunset exact visit'
    ,'https://rinkeby.infura.io/v3/87999500b8d24c6c9152845e9bb726e1'
);

const web3 = new Web3(provider);


const deploy = async () =>{

  //get a list of accounts
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  //deploy the contract with the help of abi and bytecode through contract creation transaction
  const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({data:bytecode})
      .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0]});

  //log the abi of contract
  console.log(interface);

  //log the account address of contract
  console.log('Contract deployed to',result.options.address);
};

deploy();
