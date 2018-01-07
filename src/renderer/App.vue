<template>
  <div id="app">
    <main-content></main-content>
  </div>
</template>

<script>
  // import LandingPage from '@/components/LandingPage'
  import MainContent from '@/components/MainContent'

  export default {
    name: 'sample',
    components: {
      MainContent
    }
  }
</script>

<style>
  * {
    box-sizing: initial;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    -webkit-app-region: drag;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .ivu-layout-sider {
    padding-top: 25px;
  }

  .layout-header-bar .ivu-menu {
    display: inline-block;
    background-color: transparent;
  }

  .ivu-menu-horizontal.ivu-menu-light:after {
    display: none;
  }
</style>
