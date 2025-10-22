<template>

  <header class="layout-default fixed-top">

    <div class="progressive-blurr mask-to-t"/>

    
  </header>
  
</template>

<script setup>

</script>

<style scoped>
  @reference "tailwindcss";

  @layer utilities {

    /* Progressive blurr utils*/
    .mask-to-t {
      mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
      -webkit-mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    }

    .progressive-blurr {
      @apply h-full w-full absolute top-0 left-0 backdrop-blur-2xl;
    }
  }
</style>


