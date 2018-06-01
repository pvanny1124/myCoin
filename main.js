const SHA256 = require('crypto-js/sha256');


class Block {
    constructor(timestamp, transactions, index, previousHash = ''){
        //Data holds the actual data that we'd like to pass in this block ex. how much money was transferred, who's involved, and etc
        //the timestamp is when the block was created
        //index is optional, telss us where the block sits on the chain
        //previousHash is the hash of the previous block
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //random number that doesn't have anything to do with our block
        //need nonce because we need to change the hash in the while loop of mineBlock
    }
    
    calculateHash(){
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash()
        }
            console.log("Block Mined: " + this.hash);
    }
    
}

class Blockchain {
    
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    
    createGenesisBlock(){
        return new Block('01/01/2018', 'Genesis Block', '0'); //prevBlock can be anything here
    }
    
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty) ;
        this.chain.push(newBlock);
    }
    
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;   
            }
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        
        return true;
    }
    
    minePendingTransactions(miningRewardAddress){
        //send reward to this wallet address
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        
        console.log('Block sucessfully mined!!');
        
        this.chain.push(block);
        this.pendingTransactions = [
                new Transaction(null, miningRewardAddress, this.miningReward)  
        ];
    }
    
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    
    getBalanceOfAddress(address){
        //loop through transactions to calculate balance of the address
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                //if you are the fromAddress, you have transferred money to someone
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                
                //if you are the toAddress, you have money incoming
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        
        return balance;
    }
    
}

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
        this.amount = amount;
    }
}

let myCoin = new Blockchain();

//Increase the difficulty to make it harder for a spammer to generate blocks.

// console.log('Mining block 1...');
// myCoin.addBlock(new Block(1, '10/3/2018', {amount: 4}));

// console.log('Mining block 2...')
// myCoin.addBlock(new Block(1, '10/5/2018', {amount: 10}));

// console.log('Mining block 3...')
// myCoin.addBlock(new Block(1, '10/7/2018', {amount: 15}));



//Ways to tamper with block hashes
// myCoin.chain[1].data = {amount: 100};
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

console.log('Is blockhain valid? ' + myCoin.isChainValid());

myCoin.createTransaction(new Transaction('address1', 'address2', 100));
myCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
myCoin.minePendingTransactions('xaviers-address');
console.log('Balance of xavier is: ' + myCoin.getBalanceOfAddress('xaviers-address'));


console.log('\nStarting the miner...');
myCoin.minePendingTransactions('xaviers-address');
console.log('Balance of xavier is: ' + myCoin.getBalanceOfAddress('xaviers-address'));

console.log(JSON.stringify(myCoin, null, 4));