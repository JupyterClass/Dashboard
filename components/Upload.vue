<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    action="/api/upload"
    @change="handleChange"
  >
    <p class="ant-upload-drag-icon">
      <a-icon type="inbox" />
    </p>
    <p class="ant-upload-text">
      Click or drag file to this area to upload
    </p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
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
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
};
</script>

<style scoped>

</style>