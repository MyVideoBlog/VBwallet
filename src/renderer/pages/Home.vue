<template>
    <div class="home_wrap">
        <a-layout style="width: 100%">
            <a-layout-header>
                <div class="header_wrap">
                    <div>
                        <a-select :default-value="currentAccount"
                                  size="large"
                                  style="width: 450px;"
                                  @change="getAccInfo"
                        >
                            <a-select-option v-for="(item, index) in acList"
                                             :value="item"
                                             :key="index"
                            >
                                {{item}}
                            </a-select-option>
                        </a-select>
                        <a-button type="primary"
                                  shape="circle"
                                  style="margin-left: 10px"
                                  @click="toWelcome"
                        >
                            <a-icon type="plus" />
                        </a-button>
                        <a-button type="primary"
                                  shape="circle"
                                  style="margin-left: 10px"
                                  @click="readyTransaction"
                        >
                            <a-icon type="transaction" />
                        </a-button>
                        <a-button type="primary"
                                  shape="circle"
                                  style="margin-left: 10px"
                                  @click="recordList"
                        >
                            <a-icon type="swap" />
                        </a-button>
                        <a-dropdown :trigger="['click']">
                            <a-button type="link"
                                      size="large"
                            >
                                <a-icon type="more" style="color: #fff;" />

                            </a-button>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <a href="javascript:;" @click="expKey">导出私钥</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;" @click="clearAllAcc">清除所有账号</a>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>

                    </div>
                    <a-button type="link"
                              @click="openNodeDrawer"
                    >
                        <a-icon type="menu-fold" style="color: white" />
                    </a-button>
                </div>


            </a-layout-header>
            <a-layout-content>
                <a-list item-layout="horizontal" :data-source="accInfo">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-list-item-meta
                                :description="item.value +' '+ (item.unit?item.unit:'')"
                        >
                            <span slot="title" >{{ item.title}}</span>
                            <img slot="avatar" v-if="item.icon === 'eth'" src="../assets/icons/money-icon.png" width="42px" />
                            <img slot="avatar" v-else-if="item.icon === 'gas'" src="../assets/icons/G-icon.png" width="42px" />
                            <img slot="avatar" v-else-if="item.icon === 'block'" src="../assets/icons/B-icon.png" width="32px" />
                            <img slot="avatar" v-else src="../assets/icons/A-icon.png" width="42px" />

                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </a-layout-content>
            <a-layout-footer>
<!--                {{$store.state.AccountInfo.networkError}}-->
                <div v-show="$store.state.AccountInfo.networkError">
                    <a-icon type="exclamation-circle" style="color: #faad14"/>
                    <span style="color: #faad14">网络异常请更换节点或稍后再试！</span>
                </div>
            </a-layout-footer>
        </a-layout>



<!--        转账modal -->
        <a-modal v-model="transactionModal" :closable="false" :maskClosable="false" :keyboard="false" >
            <template slot="title">
                <p style="text-align: center;font-weight: bold;font-size: 18px;color: #333">
                    <a-icon type="transaction" style="color: #108ee9"/> 转账
                </p>
            </template>
            <p class="modal_title">收款地址</p>
            <a-input ref="userNameInput" v-model="transTo" placeholder="请收款地址">
                <a-icon slot="prefix" type="user" />
                <span  slot="suffix">VB</span>
            </a-input>
            <p class="modal_title">转账金额</p>
            <a-input ref="userNameInput" v-model="transAmount" placeholder="请转账金额">
                <a-icon slot="prefix" type="dollar" />
            </a-input>

            <template slot="footer">
                <a-row type="flex" :gutter="16">
                    <a-col :span="12">
                        <a-button type="default" size="large" block @click="cancelTransaction">取消</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-button type="primary" size="large" block @click="startTransaction" :loading="transLoading">确定</a-button>
                    </a-col>
                </a-row>
            </template>
        </a-modal>

<!--        新增NodeHost-->
        <a-modal v-model="nodeModal" :closable="false" :maskClosable="false" :keyboard="false" >
            <template slot="title">
                <p style="text-align: center;font-weight: bold;font-size: 18px;color: #333">
                    <a-icon type="transaction" style="color: #108ee9"/> 新增节点
                </p>
            </template>
            <p class="modal_title">节点IP/域名</p>
            <a-input ref="userNameInput" v-model="newNode" placeholder="请输入节点IP/域名">
                <a-icon slot="prefix" type="key" />
                <a-tooltip slot="suffix" title="https://example.com">
                    <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
                </a-tooltip>
            </a-input>

            <template slot="footer">
                <a-row type="flex" :gutter="16">
                    <a-col :span="12">
                        <a-button type="default" size="large" block @click="cancelAddNodeHost">取消</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-button type="primary" size="large" block @click="addNodeHost" >确定</a-button>
                    </a-col>
                </a-row>
            </template>
        </a-modal>

<!--     drawer   -->
        <a-drawer
                title="节点选择"
                placement="right"
                :closable="false"
                :visible="openDrawer"
                :bodyStyle="{'padding-left':0, 'padding-right':0}"
        >
            <div style="padding: 15px 24px; text-align: right">
                <a-button type="default" size="default" class="node_btn"
                          @click="resetNodeList"
                >
                    重置节点
                </a-button>
                <a-button shape="circle" size="default" class="node_btn"
                          @click="addNewNode"
                >
                    <a-icon type="plus" />
                </a-button>
            </div>
            <a-list size="default" split :data-source="nodeList">
                <a-list-item slot="renderItem"
                             slot-scope="item"
                             :class="{'node_list': true, 'isActive': item.id === selectedNode}"
                             @click="() => selectNode(item)"
                >
                    <p class="node_content">
                        {{ item.nodeAddress }}
                    </p>
                    <a-button type="link" class="close_btn">
                        <a-icon type="close" />
                    </a-button>

                </a-list-item>
            </a-list>
            <div class="node_btns">
                <a-button type="default" size="default" class="node_btn"
                          @click="abortSelectNode"
                >
                    取消
                </a-button>
                <a-button type="primary"
                          size="default"
                          class="node_btn"
                          @click="setNodeHost"
                >
                    确定
                </a-button>
            </div>
        </a-drawer>
<!--        交易记录列表-->
        <a-drawer
                placement="left"
                :closable="false"
                :visible="openTradeList"
                :bodyStyle="{'padding-left':0, 'padding-right':0}"
                width="600px"
        >

            <a-list size="small" split :data-source="tradeList">
                <div slot="header" class="trade_header">
                    <span class="tr_bh">
                        交易标识号
                    </span>
                    <span class="tr_bn">
                        区块高度
                    </span>
                    <span class="tr_bt">
                        交易时间
                    </span>
                </div>
                <a-list-item slot="renderItem"
                             slot-scope="item"
                             @click="() => showTradeDetils(item)"
                             class="trade_row"
                >
                    <div class="tr_bh">
                        <a-tooltip placement="bottom" :title="item.blockHash" >
                            {{ item.blockHash.substring(0,43)+'...' }}
                        </a-tooltip>
                    </div>
                    <div class="tr_bn">
                        {{item.blockNumber}}
                    </div>
                    <div class="tr_bt">
                        {{new Date(item.timeStamp*1000).toLocaleString()}}
                    </div>


                </a-list-item>
            </a-list>
            <div class="node_btns">
                <a-button type="default" size="default" class="node_btn"
                          @click="openTradeList = false"
                >
                    关闭
                </a-button>
            </div>
        </a-drawer>
<!--        交易记录详情-->
        <a-modal v-model="tradeListModel" :closable="false" :maskClosable="false" :keyboard="false" width="80%">
            <template slot="title">
                <p style="text-align: center;font-weight: bold;font-size: 18px;color: #333">
                    <a-icon type="transaction" style="color: #108ee9"/> 交易详情
                </p>
            </template>
            <div>
                <a-row>
                    <a-col :span="tdSp1">交易标识</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.blockHash}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">区块高度</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.blockNumber}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">交易时间</a-col>
                    <a-col :span="tdSp2">{{new Date(tradeDetails.timeStamp*1000).toLocaleString()}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">发送方</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.from}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">接收方</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.to}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">交易量</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.value}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">燃料上限</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.gas}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">燃料消耗</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.gasUsed}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">燃料价格</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.gasPrice}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="tdSp1">区块高度</a-col>
                    <a-col :span="tdSp2">{{tradeDetails.blockNumber}}</a-col>
                </a-row>
            </div>

            <template slot="footer">
                <a-row type="flex" justify="center">
                    <a-col :span="12">
                        <a-button type="primary" size="large" block @click="tradeListModel = false" >确定</a-button>
                    </a-col>
                </a-row>
            </template>
        </a-modal>


    </div>
</template>

<script>
    import { getAccountBalance, signTransaction, getGasPrice, numFromWei, getBlockNumber, getHashrate, sendTransaction, getEstimateGas, numToWei, exportKeyStore } from "../utils/web3Service";

    export default {
        name: "Home",
        data(){
            return {
                acList:[],
                currentAccount: "",
                accInfo:[
                    {
                        title: "余额",
                        value:"-"
                    }
                ],
                signInfo:{},
                transactionModal: false,
                transTo:"",
                transAmount:"",
                transLoading: false,
            //    drawer
                openDrawer: false,
                selectedNode: '',
                nodeList:[],
                nodeModal: false,
                newNode:"",
                openTradeList: false,
                tradeListModel: false,
                tdSp1: 4,
                tdSp2: 20,
                tradeList:[],
                tradeDetails:{ },

            }
        },
        created() {
            this.currentAccount = this.$store.getters.defAccount;
        },
        mounted() {
            this.acList = this.$store.getters.accountList;
            if(this.acList.length < 1) {
                this.$message.info("请先导入至少一个账户");
                this.$router.push("/welcome")
                return
            }
            this.getAccInfo(this.currentAccount);
        },
        destroyed() {

        },
        methods:{
            clearAllAcc(){
                const th = this;
                th.$confirm({
                    title: "该操作将会删除所有账户！",
                    onOk(){
                        th.$store.dispatch("delAllAccount",{});
                    },
                    onCancel(){
                        th.$message.info("已取消");
                    },
                    okText:"删除",
                    cancelText:"取消"
                })
            },
            expKey(){
                const keyInfo = this.$store.getters.getAccSecret;
                exportKeyStore({
                    acc: this.currentAccount,
                    data: keyInfo
                });
            },
            toWelcome(){
                this.$router.push("/welcome")
            },
            async getAccInfo(address){
                let accInfo = [];
                await this.$store.dispatch("setDefaultAccount", { address });
                let balanceBN = await getAccountBalance(address);
                if(balanceBN.msg === "Unable get balance"){
                    this.$store.dispatch("setNetwork", { status: true })
                }else {
                    this.$store.dispatch("setNetwork", { status: false })
                }
                console.log(balanceBN);
                let balance = await numFromWei({
                    number: balanceBN,
                    unit: "ether"
                });
                console.log(balance);
                accInfo.push({
                    title: "余额",
                    value: balance,
                    unit: 'VB',
                    icon: "eth"
                });
                let gasPriceBN = await getGasPrice();
                let gasPrice = await numFromWei({
                    number: gasPriceBN,
                    unit: "ether",
                    icon: 'gas'
                });
                console.log(gasPrice);
                accInfo.push({
                    title: "Gas price",
                    value: gasPrice,
                    unit: "VB",
                    icon: "gas"
                });

                let blockNumber = await getBlockNumber();
                accInfo.push({
                    title: "块高度",
                    value: blockNumber,
                    icon: "block"
                });

                let hashRate = await getHashrate();
                accInfo.push({
                    title: "Hash",
                    value: hashRate,
                    icon: "hash"
                });


                this.accInfo = accInfo;
            },

            readyTransaction(){
                this.transactionModal = true;

            },
            cancelTransaction() {
                const th = this;
                this.$confirm({
                    title: '确定取消转账?',
                    onOk() {
                        console.log('OK');
                        th.transactionModal = false;
                    },
                    onCancel() { return; },
                    okText: "确定",
                    cancelText: "取消"
                });
            },
            async startTransaction() {
                if(!this.transTo){
                    this.$error("请输入转账地址");
                    return ;
                }
                if(!this.transAmount){
                    this.$error("请输入转账金额");
                    return ;
                }
                const secretInfo = this.$store.getters.getAccSecret;
                this.transLoading = true;
                let balance = await getAccountBalance(this.currentAccount);
                console.log("======",balance);
                const signatureInfo = await this.signTrans(secretInfo);
                console.log(signatureInfo);
                let res = await sendTransaction(signatureInfo);
                console.log(JSON.stringify(res));
                if(res.status){
                    this.getAccInfo(this.currentAccount);
                    this.transactionModal = false;
                    this.transLoading = false;
                    this.$message.success("转账成功");
                }else {
                    this.transLoading = false;
                    this.$message.error("转账失败!" + res);
                }
            },
            async signTrans({address, privateKey}){
                let gasPrice = await getGasPrice();
                let weiVal =  numToWei({
                    val: this.transAmount,
                    unit: 'ether'
                });
                let gasBN = await getEstimateGas({
                    from: this.currentAccount,
                    to: this.transTo,
                    value: weiVal,
                    gasPrice
                });
                let gas = gasBN.toString(10);
                return await signTransaction({
                    to: this.transTo,
                    value: weiVal,
                    gas,
                    gasPrice,
                    pkey: privateKey,
                });
            },
            openNodeDrawer(){
                this.selectedNode = this.$store.getters.getNodeHost.id;
                this.nodeList = this.$store.getters.getNodeList;
                this.openDrawer = true;



            },
            addNewNode(){
                this.nodeModal = true;
            },
            selectNode(item) {
                this.selectedNode = item.id;
            },
            async setNodeHost(){
                await this.$store.dispatch("setNodeHost",{id: this.selectedNode});
                let nodeObj =  this.$store.getters.getNodeHost;
                console.log(nodeObj);
                this.selectedNode = nodeObj.id;
                this.openDrawer = false;
                // this.$message.success("已成功切换到:"+nodeObj.nodeAddress);
            },
            abortSelectNode(){
                let nodeObj =  this.$store.getters.getNodeHost;
                this.selectedNode = nodeObj.id;
                this.openDrawer = false;
                this.$message.info("已取消");
            },
            cancelAddNodeHost(){
                this.nodeModal = false;
            },
            async addNodeHost(){
                await this.$store.dispatch("addNodeList", { nodeAddress: this.newNode});
                this.nodeList = this.$store.getters.getNodeList;
                this.selectedNode = this.$store.getters.getNodeHost.id;
                this.nodeModal = false;
            },
            resetNodeList(){
                this.$confirm({
                    title: '重置节点',
                    content: '重置将会删除所有节点只保留默认接点！是否继续？',
                    okText: '继续重置',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: async () => {
                        await this.$store.dispatch("resetNodeList",{});
                        this.$message.success("节点已经重置完成！");
                    },
                    onCancel() {
                        this.$message.info("已取消");
                    },
                });



            },
            //记录
            async recordList(){
                this.openTradeList = true;
                // ?module=account&action=txlist&address={addressHash}

                let addressHash = this.currentAccount;
                let url = `http://47.91.226.232:4000/api?module=account&action=txlist&address=${addressHash}`;
                let res = await this.$http.get({ url });
                console.log(res);
                if(res.status == 1){
                    this.tradeList = res.result;
                }else {
                    this.tradeList = [];
                }
            },
            showTradeDetils(item){
                console.log(item);
                this.tradeDetails = item;
                this.tradeListModel = true;

            },
        }
    }
</script>

<style scoped>
    .home_wrap{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-image: linear-gradient(#108ee9, #fff);
    }
    .header_wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .close_btn{
        width: 46px;
        color: #333;
    }
    .close_btn:hover{
        color: #108ee9;
    }
    .node_content{
        display: flex;
        flex: 1;
        margin: 0;
        cursor: default;
        color: #333;
    }
    .node_list{
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-left: 3px solid #fff;
        padding-left: 15px;
    }
    .node_list.isActive {
        background-color: #e6f7ff;
        border-left-color: #108ee9;
    }
    .node_list.isActive .node_content{
        color: #1890ff;
    }
    .node_list:hover .node_content{
        color: #1890ff;
    }
    .node_btns {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        padding: 24px;
    }
    .node_btns .node_btn {
        margin-left: 30px;
    }
    .trade_header{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .trade_row{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
    }
    .trade_row:hover{
        background-color: #eee;
    }
    .tr_bh{
        display: flex;
        flex: 6;
        padding: 0 5px;
        /*color: #108ee9;*/
        overflow: hidden;
    }
    .tr_bn{
        display: flex;
        flex: 1;
        justify-content: center;
    }
    .tr_bt{
        display: flex;
        flex: 3;
        padding: 0 5px;
        justify-content: center;
    }
</style>
