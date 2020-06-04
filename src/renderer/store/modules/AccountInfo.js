import { message } from "ant-design-vue";

const defaultHost = {
    id: 1,
    nodeAddress: "http://node.videoblog1.com"
};

const state = {
    accounts: [],
    currentAccount: "",
    nodeHost: { },
    nodeId: 1,
    nodeHostList:[],
    networkError: false,
};

const getters = {
    accountList(state) {
        let aList = [];
        state.accounts.map(item => {
            aList.push(item.address);
        });
        return aList;
    },
    defAccount(state) {
        return state.currentAccount;
    },
    getAccSecret(state) {
        let sAcc = {};
        let res = state.accounts.filter( acc => acc.address === state.currentAccount);
        sAcc = res[0];  //todo
        return sAcc;
    },
    getNodeHost(state) {
        console.log(state.nodeHost);
        let res = state.nodeHostList.filter(item => item.id === state.nodeHost.id);
        let nodeInfo = "";
        if(res.length > 0){
            nodeInfo = res[0]
        }else {
            message.error("默认节点错误！")
        }
        return nodeInfo;
    },
    getNodeList(state) {
        if(state.nodeHostList.length === 0){
            mutations.resetNodeHostList(state,{});
        }
        return state.nodeHostList;
    },
    getNetworkStatus(state) {
        return state.networkError;
    }

};

const mutations = {
    addAccountList(state, payload){
        console.log("updating");
        //检查是否有重复
        if(state.accounts.filter( acc => acc.address === payload.address).length > 0 ){
            message.error("该账户已存在！");
        }else {
            state.accounts.push({
                address: payload.address,
                privateKey: payload.privateKey
            })
        }
        //    切换为默认钱包
        state.currentAccount = payload.address;
    },
    delAllAccountList(state, payload) {
        state.accounts = [];
        state.currentAccount = "";
        message.success("清除成功！");
        setTimeout(()=>{
            location.reload();
        },500);

    },
    setDefAccount(state, payload){
        console.log(payload);
        state.currentAccount = payload.address
    },
    setNode(state, payload) {
        let sNode = state.nodeHostList.filter(item => item.id === payload.id);
        if(sNode.length > 0 ){
            state.nodeHost = sNode[0];
            message.success("设置成功，重载中...");
            setTimeout(()=>{
                location.reload();
            },500);
        }else {
            message.error("无法设置节点");
        }
    },
    addNodeHost(state, payload) {
        if(state.nodeHostList.filter(nodeItem => nodeItem.nodeAddress === payload.nodeAddress).length > 0) {
            message.error("该节点已存在！");
        } else {
            do {
                state.nodeId++;
            }while (state.nodeHostList.map(item => item.id == state.nodeId).length === 0);
            console.log(state.nodeId);
            state.nodeHostList.push({
                id: state.nodeId,
                nodeAddress: payload.nodeAddress
            })
        }
    },
    resetNodeHostList(state, payload) {
        const defHost = defaultHost;
        state.nodeHostList = [defHost];
        state.nodeHost = defHost;
        setTimeout(()=>{
            location.reload();
        },500);
    },
    setNetworkStatus(state, payload) {
        state.networkError = payload.status;
    }

};

const actions = {
    setNetwork({state, commit}, payload) {
        commit("setNetworkStatus", payload)
    },
    addAccount({state, commit}, payload) {
        commit("addAccountList", payload)
    },
    delAllAccount({state, commit}, payload) {
        commit("delAllAccountList", payload)
    },
    setDefaultAccount({state, commit}, payload) {
        commit("setDefAccount", payload)
    },
    setNodeHost({state, commit}, payload) {
        commit("setNode", payload)
    },
    addNodeList({state, commit}, payload){
        commit("addNodeHost", payload)
    },
    resetNodeList({state, commit}, payload) {
        commit("resetNodeHostList", payload)
    }

};

export default {
    state,
    getters,
    mutations,
    actions
}
