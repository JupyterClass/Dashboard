<template>
  <a-upload-dragger
    name="file"
    :multiple="true"
    :showUploadList="false"
    action="/api/upload"
    @change="handleChange"
  >
    <div class="upload-inner-content">
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p class="ant-upload-hint">
        Every notebook should have the appropriate metadata set!
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
      const status = info.file.status;
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
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
  .upload-inner-content {
    padding: 10px;
  }
</style>
