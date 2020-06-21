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
    <div class="question-card-body">
      <div class="timestamp">
        {{ startTime }}
        <hr/>
        <a-icon v-if="isLive" type="sync" :spin="true"/>
        <span v-else-if="isCompleted">
          {{ endTime }}
        </span>
        <a-icon v-else type="question" />
      </div>
      <span v-if="isLive">
        {{ readableElapsed }}
      </span>
      <span v-else-if="isCompleted">
        {{ readableDuration }}
      </span>
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
  Icon as AIcon,
  Button as AButton
} from "ant-design-vue";
import dayjs from "dayjs";
import { readableDuration } from "../utils/datetime";

export default {
  name: "QuestionCard",
  props: ['question'],
  components: { Status, IconButton, AButton, AIcon },
  data() {
    return {
      elapsed: Math.round((Date.now() - this.question.startTime) / 1000),
      timerIntervalFn: null,
    }
  },

  mounted() {
    if (this.question.isLive) {
      this.startTimer();
    }
  },

  methods: {

    startTimer() {
      if (!this.timerIntervalFn) {
        this.timerIntervalFn = setInterval(() => {
          this.elapsed = Math.round((Date.now() - this.question.startTime) / 1000);
        }, 1000);
      }
    },
    stopTimer() {
      clearInterval(this.timerIntervalFn);
    },

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
      this.elapsed = 0;
      this.startTimer();
      this.showQuestionInformation();
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
      this.stopTimer();
      this.hideQuestionInformation();
    },
    handleToggleQuestionVisibility() {
      if (this.shouldShow) {
        this.hideQuestionInformation();
      } else {
        this.showQuestionInformation();
      }
    },

    showQuestionInformation() {
      this.$store.commit('setSelectedQuestion', this.question.id);
    },
    hideQuestionInformation() {
      this.$store.commit('unsetSelectedQuestion', this.question.id);
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
    },
    startTime() {
      return dayjs(this.question.startTime).format('h:mm a');
    },
    endTime() {
      return dayjs(this.question.endTime).format('h:mm a');
    },
    duration() {
      return this.question.endTime - this.question.startTime;
    },
    readableDuration() {
      return readableDuration(this.question.startTime, this.question.endTime);
    },
    readableElapsed() {
      let mins = Math.floor(this.elapsed / 60);
      if (mins < 10) {
        mins = '0' + mins;
      }
      let secs = this.elapsed % 60;
      if (secs < 10) {
        secs = '0' + secs;
      }
      return mins + ':' + secs;
    }
  },
  watch: {
    question: {
      handler(object) {
        this.startTimer();
        this.elapsed = Math.round((Date.now() - object.startTime) / 1000);
      },
      deep: true
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

.question-card-body {
  display: flex;
  flex-direction: column;
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

.timestamp {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.timestamp > hr {
  flex: 1;
  margin: 0 6px 0 6px;
}

</style>
