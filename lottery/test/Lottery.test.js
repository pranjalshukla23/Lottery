const assert = require("assert");

const ganache = require("ganache-cli");

const Web3 = require("web3");

//web3 requires a provider as input
const web3 = new Web3(ganache.provider());

const {interface,bytecode} = require("../compile");


let lottery;
let accounts;

beforeEach(async () =>{

  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({data : bytecode})
      .send({ from : accounts[0], gas:'1000000'});
});

describe('Lottery Contract', ()=>{

  it('deploys a contract',()=>{

    assert.ok(lottery.options.address);

  });

  it('allows one account to enter',async () =>{

    //adds an address to players array
    await lottery.methods.enter().send({

      from: accounts[0],
      value : web3.utils.toWei('0.02','ether')
    });

    //returns players array
    const players =  await lottery.methods.getPlayers().call({

      from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);
  });
  it('allows multiple account to enter',async () =>{

    //adds an address to players array
    await lottery.methods.enter().send({

      from: accounts[0],
      value : web3.utils.toWei('0.02','ether')
    });

    //adds an address to players array
    await lottery.methods.enter().send({

      from: accounts[1],
      value : web3.utils.toWei('0.02','ether')

    });
    //adds an address to players array
    await lottery.methods.enter().send({

      from: accounts[2],

      //convert ether to wei
      value : web3.utils.toWei('0.02','ether')
    });

    //returns players array
    const players =  await lottery.methods.getPlayers().call({

      from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
  });

  it('requires a minimum amount of ether to enter',async()=>{

    try{
      await lottery.methods.enter().send({

        from : accounts[0],
        value : 0
      });

      //this line will run if exception does not occur
      assert(false);

    } catch(err){

      assert(err);
    }

  });

  it('only manager can call pickWinner',async ()=>{

    try{

      await lottery.methods.pickWinner().send({

        from : accounts[1]
      });
      assert(false);

    }catch(err){

      assert(err);
    }
  });

  it('sends money to the winner and resets the players array',async()=>{

    await lottery.methods.enter().send({

      from : accounts[0],
      value: web3.utils.toWei('2','ether')
    });

    //to get balance of account 0 after sending ethers and some gas for transaction
    const initialBalance =  await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from : accounts[0] });

    //get final balance after sending ethers from contract
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    //get difference between initial and final balance
    const difference = finalBalance - initialBalance;


    //check difference between initial and final balance is greater than 1.8
    assert(difference > web3.utils.toWei('1.8','ether'));
  });
});
