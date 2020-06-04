import Web3 from "web3";

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/
const chainUrl = "http://localhost:8545/";

let getWeb3 = new Promise((resolve, reject) => {
// Check for injected web3
    const web3js = window.web3;
    if(typeof web3js !== 'undefined') {
        const web3 = new Web3(web3js.currentProvider);
        resolve({
            injectedWeb3: web3.isConnected(),
            web3(){
                return web3;
            }
        })
    }else {
// web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        const web3 = new Web3(new Web3.providers.HttpProvider(chainUrl));
        console.log("=============",web3);
        resolve({
            injectedWeb3: web3.isConnected(),
            web3(){
                return web3;
            }
        })

        // reject(new Error("Unable to connect to Metamask"));
    }
}).then(result => {
   return new Promise((resolve, reject) => {
   //    Retrieve network ID
       result.web3().version.getNetwork((err, networkId) => {
           if (err) {
               // If we can't find a networkId keep result the same and reject the promise
               reject(new Error('Unable to retrieve network ID'))
           } else {
               // Assign the networkId property to our result and resolve promise
               result = Object.assign({}, result, {networkId});
               resolve(result);
           }
       })
   })
}).then(result => {
    return new Promise((resolve, reject) => {
    //    Retrieve coinbase
        result.web3().eth.getCoinbase((error, coinbaseAddress) => {
            if (error) {
                reject( new Error("Unable to retrieve coinbase"));
            } else {
                result = Object.assign({}, result, { coinbaseAddress });
                resolve(result);
            }
        })
    })
}).then(result => {
    return new Promise((resolve, reject) => {
    //    Retrieve balance for coinbase
        result.web3().eth.getBalance(result.coinbaseAddress, (error, balance) => {
            if(error) {
                reject(new Error('Unable to retrieve balance for address: '+ result.coinbaseAddress));
            } else {
                result = Object.assign({}, result, { balance });
                resolve(result)
            }
        })
    })
});

export default getWeb3;
