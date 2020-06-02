<template>
  <div class="question-card">
    <div class="question-card-title">
      <h3>Question {{ question.id }}</h3>
      <status v-if="isLive"
              text="LIVE"
              color="#66cb7c" />
    </div>
    <icon-button v-if="isLive"
                 type="stop"
                 color="salmon"
                 @click.stop="handleStopButtonClick"/>
    <icon-button v-else
                 type="play-circle"
                 color="#66cb7c"
                 @click.stop="handlePlayButtonClick"/>
  </div>
</template>

<script>
import Status from "./indicators/Status";
import IconButton from "./buttons/IconButton";
export default {
  name: "QuestionCard",
  props: ['question'],
  components: { Status, IconButton },
  methods: {
    handlePlayButtonClick() {
      this.$store.commit(
        'setQuestionIsLive',
        {
          question: this.question,
          startTime: Date.now(),
        }
      );
    },
    handleStopButtonClick() {
      this.$store.commit(
        'setQuestionIsNotLive',
        {
          question: this.question,
          endTime: Date.now(),
        }
      );
    }
  },
  computed: {
    isLive() {
      return this.question.id in this.$store.state.questions &&
             this.$store.state.questions[this.question.id].isLive;
    }
  }
};
</script>

<style scoped>
.question-card {
  box-shadow: 0 2px 8px 2px #d5d8e2;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
}

.question-card-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
