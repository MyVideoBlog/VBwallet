<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  import { showEth, getAccounts } from "./utils/web3Service";
  export default {
    name: 'VBwallet',
    mounted() {
      this.tee();
    },
    methods:{
      async tee(){
        console.log("----");
        showEth();
        let accounts = await getAccounts();
        console.log(accounts);
      }
    }
  }
</script>

<style>
  /* CSS */
  #app {
    height: 100%;
  }
</style>
