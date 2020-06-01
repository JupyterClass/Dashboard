<template>
  <div class="container">
    <h1>Hello world!</h1>
    <upload />
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import Upload from '../components/Upload';
export default {
  components: { Upload },
  mounted() {
    console.log(socket);
    socket.on('store-update', message => {
      console.log('🚀', message);
    })
  },
}
</script>

<style>
</style>
