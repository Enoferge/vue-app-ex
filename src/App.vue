<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
  #app {
    font-family: Georgia, serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #E4EAF6;
  }
</style>-->

<style type="scss">
  html {
    height: 100%;
    width: 100%;
    overflow: hidden !important;
  }

  body {
    margin: 0;
    //font-family: Helvetica, Verdana, sans-serif;
    font-family: Georgia, serif;
    /*border: solid 3px red;*/
    height: 100% ;
    width: 100% ;
    overflow: hidden;
    background-color: #E4EAF6;
  }

  @media only print {
    html, body {
      width: auto !important;
      height: auto !important;
      overflow: visible !important;
    }
  }

  .application {
    height: 100vh;
    font-family: "Times New Roman", Times, serif !important;
  }

  .application--wrap {
    background-color: #515f7a;
  }

  .background-color {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #515f7a;
  }

  .background-image {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    background-position: center;
    filter: blur(4px) opacity(0.3);
  }
</style>
