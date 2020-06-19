<template>
  <div class="steps">
    <h1>Setup Instructions</h1>
    <hr/>
    <div class="step" v-for="(step, i) in steps" :key="'setup-step-' + i">
      <h2>{{ 'step ' + (i + 1) }}</h2>
      <p>{{ step.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetupInstructions",
  data() {
    return {
      steps: [
        {
          text: 'Upload a JupyterClass notebook',
        },
        {
          text: `Start each question to start tracking your students' progress`,
        },
      ]
    }
  }
};
</script>

<style scoped>
.steps {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 0 2px 8px 2px #d5d8e2;
  padding: 16px;
  border-radius: 4px;
}
.steps > h1 {
  width: 100%;
  text-align: center;
  margin-bottom: 12px !important;
}
.steps > hr {
  width: 100%;
  border-top: 1px solid #d4dfea;
  margin-bottom: 12px;
}
.step > h2 {
  text-transform: uppercase;
}
</style>
