<template>
  <div class="students">
    <div class="header">
      <h1>Students</h1>
      <div>
        <a-search placeholder="Search student" />
      </div>
<!--      <a-button type="danger" shape="round" @click="handleKickAll">-->
<!--        Kick All-->
<!--      </a-button>-->
    </div>
    <div class="questions">
      <a-select mode="tags"
                placeholder="Questions"
                style="width: 100%"
                :value="selectedQuestions"
                @change="handleSelectQuestionChange">
        <a-select-option v-for="(question, i) in questions"
                         :key="question.id">
          {{ question.id }}
        </a-select-option>
      </a-select>
    </div>
    <student-card v-for="(student, i) in students"
                  :key="'student-' + i"
                  :student="student"/>
  </div>
</template>

<script>
import {
  Input,
  Select as ASelect,
  Switch as ASwitch,
  Button as AButton,
} from "ant-design-vue";
import StudentCard from "./StudentCard";
export default {
  name: "Students",
  components: {
    ASearch: Input.Search,
    ASelect,
    ASelectOption: ASelect.Option,
    ASwitch,
    AButton,
    StudentCard,
  },
  computed: {
    students() {
      return Object.values(this.$store.state.StudentStore) || [];
    },
    questions() {
      if (!this.$store.state.selectedNotebook) {
        return [];
      }
      return Object.values(
        this.$store.state.QuestionStore
          [this.$store.state.selectedNotebook.id]
      ) || [];
    },

    selectedQuestions() {
      return [...this.$store.state.selectedQuestions];
    }
  },
  methods: {
    handleKickAll() {
      // TODO:
      //  1. are you sure?
      //  2. eject all students from the server
    },
    handleSelectQuestionChange(questionIds) {
      this.$store.commit('setSelectedQuestions', questionIds);
    },
  }
};
</script>

<style scoped>
.students {
  padding: 20px;
  height: 100%;
}
.search {
  padding: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.questions {
  display: flex;
}
.question {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}
</style>
