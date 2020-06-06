<template>
  <div class="question-card"
       :style="{ opacity: isCompleted ? 0.4 : 1 }">
    <div class="question-card-head">
      <div class="question-card-title">
        <h3>{{ question.id }}</h3>
        <div class="question-visibility-toggle">
          <icon-button v-if="shouldShow"
                       type="eye-invisible"
                       @click.stop="handleToggleQuestionVisibility"
                       color="grey"
                       size="15"/>
          <icon-button v-else
                       type="eye"
                       color="grey"
                       @click.stop="handleToggleQuestionVisibility"
                       size="15"/>
        </div>
      </div>
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
import socket from '~/plugins/socket.io.js';
import Status from "./indicators/Status";
import IconButton from "./buttons/IconButton";
import { Icon as AIcon } from "ant-design-vue";

export default {
  name: "QuestionCard",
  props: ['question'],
  components: { Status, IconButton, AIcon },
  methods: {
    handlePlayButtonClick() {
      // this.$store.commit(
      //   'setQuestionIsLive',
      //   {
      //     question: this.question,
      //     startTime: Date.now(),
      //   }
      // );
      socket.emit('client-question-enable', {
        ...this.question,
        isLive: true,
        startTime: Date.now()
      });
    },
    handleStopButtonClick() {
      // this.$store.commit(
      //   'setQuestionIsNotLive',
      //   {
      //     question: this.question,
      //     endTime: Date.now(),
      //   }
      // );
      socket.emit('client-question-enable', {
        ...this.question,
        isLive: false,
        endTime: Date.now()
      });
    },
    handleToggleQuestionVisibility() {
      if (this.shouldShow) {
        this.$store.commit('unsetSelectedQuestion', this.question.id);
      } else {
        this.$store.commit('setSelectedQuestion', this.question.id);
      }
    },
  },
  computed: {
    isLive() {
      return this.question.id in this.$store.state.QuestionStore[this.$store.state.selectedNotebook.id] &&
             this.$store.state.QuestionStore[this.$store.state.selectedNotebook.id][this.question.id].isLive;
    },
    isCompleted() {
      return this.question.endTime && !this.question.isLive;
    },
    shouldShow() {
      return this.$store.state.selectedQuestions.indexOf(this.question.id) !== -1;
    }
  }
};
</script>

<style scoped>
.question-card {
  position: relative;
  box-shadow: 0 2px 8px 2px #d5d8e2;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
}

.question-card-head {
  display: flex;
}

.question-visibility-toggle {
  margin-left: 8px;
}

.question-card-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.ended-overlay {
  position: absolute;
  left: 50%;
}

</style>
