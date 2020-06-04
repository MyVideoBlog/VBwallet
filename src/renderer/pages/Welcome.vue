<template>
    <div class="home_wrap">
        <div class="we_header">
            <a-button type="link"
                      size="large"
                      class="go_home"
                      @click="goHome"
            >
                <a-icon type="home" /> 返回
            </a-button>
        </div>
        <p class="home_title">欢迎使用 Blog Block</p>
        <div style="text-align: center">
            <a-button type="primary" class="home_btn" :size="btnSize"
                      :loading="creating"
                      @click="createNew"
            >
                创建钱包
            </a-button>

            <a-button type="default" class="home_btn"
                      :size="btnSize"
                      @click="() => {pkey = ''; imModal=true}"
            >
                导入私钥
            </a-button>
        </div>

<!--创建-->
        <a-modal v-model="createModal" :closable="false" :maskClosable="false" :keyboard="false" >
            <template slot="title">
                <p style="text-align: center;font-weight: bold;font-size: 18px;color: #333">
                    <a-icon type="check" style="color: #53C21B"/>
                    创建成功
                </p>
            </template>
            <p style="text-align: center">账户：{{newAccount.address}}</p>
            <p style="text-align: center;font-size: 20px;font-weight: bold;color: #333;margin-bottom: 10px">私钥</p>
            <p style="text-align: center;font-size: 16px;color: #333;border-radius: 10px;border: 1px solid #eee;padding: 20px"
            >
                {{newAccount.privateKey}}
            </p>
            <a-checkbox v-model="recorded" style="color: red">
                私钥非常重要请确认已经备份！
            </a-checkbox>
            <template slot="footer">
                <div style="text-align: center">
                    <a-button type="primary" size="large" block @click="closeCreate">确定</a-button>
                </div>
            </template>
        </a-modal>
<!--        导入-->
        <a-modal v-model="imModal" :closable="false" :maskClosable="false" :keyboard="false" >
            <template slot="title">
                <p style="text-align: center;font-weight: bold;font-size: 18px;color: #333">
                    <a-icon type="key" style="color: #108ee9"/>
                    导入钱包
                </p>
            </template>
            <p class="modal_title">请输入私钥</p>
            <a-input ref="userNameInput" v-model="pkey" placeholder="请输入私钥">
                <a-icon slot="prefix" type="key" />
                <a-tooltip slot="suffix" title="私钥应该为64位长度的字符串">
                    <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
                </a-tooltip>
            </a-input>
            <template slot="footer">
                <a-row type="flex" :gutter="16">
                    <a-col :span="12">
                        <a-button type="default" size="large" block @click="imModal=false">取消</a-button>
                    </a-col>
                    <a-col :span="12">
                        <a-button type="primary" size="large" block @click="imAccount" :loading="imLoading">确定</a-button>
                    </a-col>
                </a-row>
            </template>
        </a-modal>
    </div>
</template>

<script>
    import { createAccounts, importAccount, createPersonalAccounts } from "../utils/web3Service";

    export default {
        name: "Welcome",
        data(){
            return {
                btnSize: "large",
                creating: false,
                createModal: false,
                newAccount: {
                    // "address":"0x3F7b90E199522202254bAF0cdDfD864B14D0b82B",
                    // "privateKey":"0xb4e4e455641116891938edba2362a63e7aa2b2b9680129adfb901fc601310ecf"
                },
                recorded: false,
                pkey:"",
                imModal: false,
                imLoading: false

            }
        },
        methods:{
            goHome(){
                this.$router.push("/")
            },
            async createNew(){
                this.creating = true;
                let newAcc = await createAccounts();
                this.creating = false;
                this.createModal = true;
                this.newAccount = newAcc;
                console.log(newAcc);
                //
                // {
                //     "address":"0x3F7b90E199522202254bAF0cdDfD864B14D0b82B",
                //     "privateKey":"0xb4e4e455641116891938edba2362a63e7aa2b2b9680129adfb901fc601310ecf"
                // }

            },
            async createNewPer(){
                const pwd = '123456789';
                let newAcc = await  createPersonalAccounts(pwd);
                console.log(newAcc);
            },
            closeCreate(){
                if(this.recorded){
                    this.createModal = false
                } else {
                    this.$message.error('请备份私钥！');
                }
            },
        //    导入
            async imAccount(){
                this.imLoading = true;
                let accInfo = await importAccount(this.pkey);
                if(accInfo.code && accInfo.code === 44 ){
                    this.$message.warning(accInfo.message);
                    setTimeout(() => {
                        this.imLoading = false;
                    },500)
                }else {
                    console.log(accInfo);
                    await this.$store.dispatch("addAccount", accInfo);
                    console.log(this.$store.getters.accountList);
                    console.log("end");
                    this.imModal = false;
                    this.imLoading = false;
                    this.$router.push({
                        path: "/",
                        params: accInfo
                    });
                }
            },
            tes(){
                this.$store.dispatch("delAccount");
            }
        }
    }
</script>

<style scoped>
    .home_wrap{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        background-image: linear-gradient(#108ee9, #fff);
    }
    .we_header{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        justify-items: center;
        padding: 0 24px;
        height: 60px;

    }
    .go_home{
        color: #fff;
    }
    .home_title{
        color: #fff;
        font-size: 60px;
        font-weight: bold;
        text-align: center;
        margin-top: 100px;
    }
    .home_btn{
        margin: 20px;
    }
    .modal_title{
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
    }
</style>
