<template>
  <a-icon class="icon-wrapper"
          v-on="$listeners"
          :style="`font-size: ${size || 30}px;`"
          theme="twoTone"
          :twoToneColor="color"
          :type="type" />
</template>

<script>
import { Icon as AIcon } from 'ant-design-vue';

export default {
  name: "IconButton",
  props: ['type', 'color', 'size'],
  components: { AIcon }
};
</script>

<style scoped>
.icon-wrapper {
  cursor: pointer;
}
</style>
