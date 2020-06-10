<template>
  <div class="main-wrapper">
    <div>
      <img style="width: 50vw; min-width: 300px; max-width: 800px;" src="../assets/login.png" />
    </div>
    <div class="card">
      <h1 class="title">Jupyter Class</h1>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :validate-status="passwordError() ? 'error' : ''"
          :help="passwordError() || ''"
        >
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: 'Please input your Password!' }] },
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :block="true"
            type="primary"
            html-type="submit"
            :disabled="hasErrors(form.getFieldsError())"
          >Log in</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import {
  Form as AForm,
  Input as AInput,
  Button as AButton,
  Icon as AIcon,
  notification,
} from 'ant-design-vue';
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  props: ["visible"],
  components: { AForm, AFormItem: AForm.Item, AInput, AButton, AIcon },
  data() {
    return {
      hasErrors,
      loading: false,
      form: AForm.createForm(this, { name: "horizontal_login" }),
    };
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("userName") && getFieldError("userName");
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("password") && getFieldError("password");
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let { password } = values;
          this.loading = true;
          try {
            let response = await this.$auth.loginWith('customStrategy', { data: { password }});
            console.log('RESPONSE:', response);
            this.showNotification('Welcome back!');
          } catch (err) {
            console.error(err);
            this.showNotification('ACCESS DENIED');
          }
          this.loading = false;
        }
      });
    },
    showNotification(title, icon, message) {
      notification.open({
        message: title,
        description: message,
      });
    }
  }
};
</script>

<style scoped>
  .main-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: rgba(34, 48, 86, 0.26) !important;
    margin-bottom: 16px !important;
  }
  .card {
    background: #ffffff;
    padding: 16px;
    border-radius: 8px;
    width: 300px;
    max-width: 500px;
    animation: glow-shadow 1.3s infinite alternate;
  }
</style>
