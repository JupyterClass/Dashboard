<template>
  <div class="students">
    <div class="header">
      <h1>Students</h1>
      <div>
        <a-search v-model="searchStudent" placeholder="Search student" />
      </div>
<!--      <a-button type="danger" shape="round" @click="handleKickAll">-->
<!--        Kick All-->
<!--      </a-button>-->
    </div>
    <div class="students-in-progress">
      <student-card v-for="(student, i) in students.studentsInProgress"
                    v-show="shouldShowStudent(student)"
                    :key="student.id"
                    :student="student"
                    :attempted-questions="getStudentAttemptedQuestions(student)"/>
    </div>
    <div class="students-done">
      <student-card v-for="(student, i) in students.studentsCompleted"
                    v-show="shouldShowStudent(student)"
                    :key="student.id"
                    :student="student"
                    :attempted-questions="getStudentAttemptedQuestions(student)"/>
    </div>
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

  data() {
    return {
      searchStudent: null,
    }
  },

  computed: {
    students() {
      const students = Object.values(this.$store.state.StudentStore);
      const studentsCompleted = [];
      const studentsInProgress = [];
      const selectedNotebook = this.$store.state.selectedNotebook;

      for (const student of students) {
        let isStudentDone = true;

        for (const qnId of this.$store.state.selectedQuestions) {
          const practice = student.progress[selectedNotebook.id];
          if (!practice) {
            isStudentDone = false;
            break;
          }
          const question = practice[qnId];
          if (!question || question.completeness !== 100) {
            isStudentDone = false;
            break;
          }
        }

        if (isStudentDone) {
          studentsCompleted.push(student);
        } else {
          studentsInProgress.push(student);
        }
      }

      return { studentsInProgress, studentsCompleted };
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

    shouldShowStudent(student) {
      let includeStudent = true;
      if (this.searchStudent) {
        if (!student.id.toLowerCase().includes(this.searchStudent.toLowerCase())) {
          includeStudent = false;
        }
      }
      return includeStudent;
    },

    getStudentAttemptedQuestions(student) {
      let attemptedQuestions = {};
      for (const qnId of this.$store.state.selectedQuestions) {
        attemptedQuestions[qnId] = {
          id: qnId,
          completeness: 0,
        };
      }

      if (!this.$store.state.selectedNotebook) {
        return attemptedQuestions;
      }

      const notebookProgress = this.$store.state
        .StudentStore[student.id]
        .progress[this.$store.state.selectedNotebook.id];

      if (!notebookProgress) {
        return attemptedQuestions;
      }

      for (const [questionId, completeness] of Object.entries(notebookProgress)) {
        if (this.$store.state.selectedQuestions.indexOf(questionId) !== -1) {
          attemptedQuestions[questionId] = {
            ...attemptedQuestions[questionId],
            ...completeness
          };
        }
      }

      return Object.values(attemptedQuestions).sort((a, b) => {
        if (a.questionId < b.questionId) return -1;
        if (a.questionId > b.questionId) return 1;
        return 0;
      });
    },
    handleKickAll() {
      // TODO:
      //  1. are you sure?
      //  2. eject all students from the server
    },
  }
};
</script>

<style scoped>
.students {
  position: relative;
  background-color: #e6e9f4;
  box-shadow: inset 2px 0 8px #bbc1d5;
  min-height: 100%;
  height: 100%;
  overflow: scroll;
}
.students-in-progress {
  display: flex;
  flex-direction: column;
  padding: 12px;
}
.students-done {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 12px;
}
.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6e9f4;
  z-index: 1;
  box-shadow: 0 8px 4px -4px #bbc1d5;
}
.header > h1 {
  text-transform: uppercase;
  font-size: 1.8em;
  letter-spacing: 3px;
}
</style>
