<template>
 
  <footer class="layout-default fixed-bottom">

    <div class="progressive-blurr mask-to-b"/>
    <AppNavbar />
    
  </footer>

  
</template>

<script setup>
  import AppNavbar from '../ui/AppNavbar.vue';
</script>

<style scoped>
  @reference "tailwindcss";

  @layer utilities {

    /* Progressive blurr utils*/
    .mask-to-b {
      mask: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
      -webkit-mask: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    }

    .progressive-blurr {
      @apply h-full w-full absolute bottom-0 left-0 backdrop-blur-2xl;
    }
  }
</style>


