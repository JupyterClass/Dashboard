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
    </div>
    <div class="btn">
      <a-button :block="true"
                v-if="isLive"
                type="danger"
                @click.stop="handleStopButtonClick">
        STOP
      </a-button>
      <a-button :block="true"
                v-else-if="isCompleted"
                @click.stop="handlePlayButtonClick">
        RESTART
      </a-button>
      <a-button :block="true"
                v-else
                type="primary"
                @click.stop="handlePlayButtonClick">
        START
      </a-button>
    </div>
    <div class="accent"
         :style="{
            animation: isLive ? 'glow 1.3s infinite alternate' : null,
            width: isLive ? '12px' : '8px',
            background: (
              isCompleted ? '#ffcb52' :
                isLive ? '#3de88d' : 'salmon'
            )
         }"/>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import Status from "./indicators/Status";
import IconButton from "./buttons/IconButton";
import {
  Button as AButton
} from "ant-design-vue";

export default {
  name: "QuestionCard",
  props: ['question'],
  components: { Status, IconButton, AButton },
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
  padding: 10px 18px 10px 10px;
  margin: 10px;
  overflow: hidden;
  transition: opacity 0.3s;
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

.accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  transition: all 0.3s;
}

.btn {
  margin-top: 8px;
}

</style>
