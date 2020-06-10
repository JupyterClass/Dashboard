<template>
  <nuxt />
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  width: 100%;
  margin: 0;
}

h1,
h2,
h3,
h4 {
  margin: 0 !important;
  padding: 0 !important;
  color: #486177 !important;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

@keyframes glow {
  from {
    background: #129cff;
  }
  to {
    background: #0ee4ff;
  }
}

@keyframes glow-shadow {
  from {
    box-shadow: 0px 0px 20px 10px hsl(218, 100%, 92%);
  }
  to {
    box-shadow: 0px 0px 20px 5px hsl(0, 73%, 90%);
  }
}

</style>
