import {message} from "ant-design-vue";

const Web3 = require("web3");// 创建web3对象
const BigNumber = require('bignumber.js');
import store from '../store/index'



// const chainHost = "http://47.57.164.0:30304";
// const chainHost = "http://47.112.235.61:30304";
// const chainHost = "http://localhost:8545";
// const chainHost = "http://node.videoblog1.com";
const chainId = "0x20200522";

const chainHost = store.getters.getNodeHost.nodeAddress;


let web3;

export const showEth = () => {
    if(typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider)
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(chainHost));
    }
    window.web3 = web3;
    console.log(web3);
};

export const createAccounts = () => {
    return new Promise((resolve, reject) => {
        resolve (web3.eth.accounts.create())
    })
};

export const createPersonalAccounts = (pwd) => {
    return new Promise((resolve, reject) => {
        web3.eth.personal.newAccount(pwd)
            .then(res => resolve(res))
    })
};

export const importAccount = (pkey) => {
  return new Promise((resolve, reject) => {
      try {
          resolve(web3.eth.accounts.privateKeyToAccount(pkey))
      }catch (e) {
          resolve({
              code: 44,
              message:"Import error! Please check you privateKey",
              e
          })
      }
  })
};

export const getAccounts = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((error, accounts) => {
            if(error) {
                reject("Unable get accounts",error);
            } else {
                resolve(accounts);
            }
        })
    })
};

export const getAccountBalance = address => {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address)
            .then(balance =>{
                console.log(balance);
                resolve( new web3.utils.BN(balance) )
            } )
            .catch(e => resolve({msg:"Unable get balance",e}))
    })
};

export const getGasPrice = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getGasPrice()
            .then(gp => resolve( new web3.utils.BN(gp) ))
            .catch(e => reject(e))
    })
};


//估计gas用量
export const getEstimateGas = ({ from, to, value, gasPrice }) => {
    return new Promise((resolve, reject) => {
        web3.eth.estimateGas({ from, to, value, gasPrice })
            .then(useGas => {
                console.log(useGas);
                resolve( new web3.utils.BN(useGas) )
            })
            .catch(e => reject(e))
    })
};



export const signTransaction = ({to, value, gas, gasPrice, nonce, pkey}) => {
    return new Promise((resolve, reject) => {
        console.log(to,value,gas,pkey);
        web3.eth.accounts.signTransaction({
            to,
            value,
            gas,
            gasPrice,
            // nonce: 0,
            chainId
        }, pkey )
            .then(res => {
                console.log(res);
                resolve(res)
            }).catch(e => {
            console.log(e);
        })
    })
};

export const sendTransaction = ({rawTransaction}) => {
    return new Promise((resolve, reject) => {
        let raw = rawTransaction.toString('hex');
        console.log(raw);
        web3.eth.sendSignedTransaction(raw)
            .on('receipt', res => resolve(res)).catch(e => resolve(e)  );

    });
};

export const getBlockNumber = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getBlockNumber()
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

export const getHashrate = () => {
    return new Promise((resolve, reject) => {
        web3.eth.getHashrate()
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

//数据处理
export const numFromWei = ({ number, unit }) => {
    return web3.utils.fromWei(number, unit)
};

export const numToWei = ({val, unit}) => {
    return web3.utils.toWei(val, unit)
};

//导出私钥
export const exportKeyStore = ({data}) => {
    return new Promise((resolve, reject) => {
        try {
            const fs = require('fs');
            const os = require('os');
            const path = require('path');
            const sep = path.sep;
            let keyDir = os.homedir()+sep+"VBwallet";
            if(!fs.existsSync(keyDir)){
                   // 文件路径不存在
                fs.mkdir(keyDir,e=>{
                    if(e) {
                        message.error( JSON.stringify(e) );
                        throw e
                    }
                })
            }
            let fileDir = keyDir+sep+"key-"+data.address+".json";
            fs.writeFile(fileDir, JSON.stringify(data), e => {
                if (e){
                    message.error( JSON.stringify(e) );
                    throw e;
                } else {
                    message.success("key保存在："+fileDir)
                }
            })

        } catch (e) {
            console.log(e);
            message.error("保存失败！");
        }
    });

};
