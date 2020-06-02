<template>
  <div class="statcard">
    <a-icon class="icon" :type="icon" theme="twoTone" :twoToneColor="accentColor" />
    <div class="main-content">
      <h1 class="title">{{ title }}</h1>
      <h1 class="stat">{{ stat }}</h1>
    </div>
    <div class="statcard-accent" :style="{backgroundColor: accentColor}"/>
  </div>
</template>

<script>
import { Icon as AIcon } from 'ant-design-vue';
export default {
  name: "StatCard",
  components: { AIcon },
  props: ['accentColor', 'title', 'stat', 'icon']
};
</script>

<style scoped>
.statcard {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px 1px #d0ddf0;
  overflow: hidden;
  padding: 8px 24px 0 16px;
  min-width: 250px;
}

.icon {
  font-size: 3.5em;
  color: #486177;
  margin-right: 16px;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  text-align: right;
}

.title {
  font-size: 1.5em;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0;
}

.stat {
  font-size: 2.5em;
  margin: 0;
}

.statcard-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
}
</style>
