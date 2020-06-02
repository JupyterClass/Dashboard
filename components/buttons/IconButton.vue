<template>
  <a-icon v-on="$listeners"
          style="font-size: 30px;"
          theme="twoTone"
          :twoToneColor="color"
          :type="type" />
</template>

<script>
import { Icon as AIcon } from 'ant-design-vue';

export default {
  name: "IconButton",
  props: ['type', 'color'],
  components: { AIcon }
};
</script>

<style scoped>
.icon-wrapper {
  cursor: pointer;
  border: 1px solid red;
}
</style>
