const SHA256 = require('crypto-js/sha256');


class Block {
    constructor(data, timestamp, index, previousHash = ''){
        //Data holds the actual data that we'd like to pass in this block ex. how much money was transferred, who's involved, and etc
        //the timestamp is when the block was created
        //index is optional, telss us where the block sits on the chain
        //previousHash is the hash of the previous block
        this.data = data;
        this.timestamp = timestamp;
        this.index = index;
        this.previousHash = this.calculateHash();
    }
    
    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
    
}

class Blockchain {
    
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }
    
    createGenesisBlock(){
        return new Block(0, '01/01/2018', 'Genesis Block', '0'); //prevBlock can be anything here
    }
    
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
    
}

let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, '10/3/2018', {amount: 4}));
myCoin.addBlock(new Block(1, '10/5/2018', {amount: 10}));
myCoin.addBlock(new Block(1, '10/7/2018', {amount: 15}));



//Ways to tamper with block hashes
myCoin.chain[1].data = {amount: 100};
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

console.log('Is blockhain valid? ' + myCoin.isChainValid());

console.log(JSON.stringify(myCoin, null, 4));