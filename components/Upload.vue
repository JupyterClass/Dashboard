<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    :showUploadList="false"
    :beforeUpload="beforeUpload"
    action="/api/upload"
    @change="handleChange"
  >
    <div class="upload-inner-content">
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Upload JupyterClass Notebook
      </p>
    </div>
  </a-upload-dragger>
</template>

<script>
import {
  Upload as AUploadDragger,
  Icon as AIcon,
  message,
} from "ant-design-vue";

export default {
  name: "Upload",
  components: {
    "AUploadDragger": AUploadDragger.Dragger,
    AIcon,
  },

  methods: {
    handleChange(info) {
      const response = info.file.response;
      if (response) {
        const { status, msg } = response;
        if (status === 'success') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${msg}`);
        }
      }
    },
    beforeUpload(file) {
      return true;
    },
  }
};
</script>

<style scoped>
  .upload-inner-content {
    padding: 10px;
  }
</style>
