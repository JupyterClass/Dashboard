<template>
  <div class="accent-card">
    <h1 class="title">{{ title }}</h1>
    <slot/>
    <div class="accent" :style="{backgroundColor: accentColor}"/>
  </div>
</template>

<script>
import { Icon as AIcon } from 'ant-design-vue';
export default {
  name: "AccentCard",
  components: { AIcon },
  props: ['accentColor', 'title']
};
</script>

<style scoped>
.accent-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px 1px #d0ddf0;
  overflow: hidden;
  padding: 16px;
  min-width: 250px;
}
.title {
  font-size: 1.5em;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0;
}

.accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
}
</style>
