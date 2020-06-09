/**
 * {
 *   student-id-1: {
 *     ...
 *   },
 *   student-id-2: {
 *     ...
 *   }
 * }
 */
import { pushStudentsState } from "./sync";

export const StudentStore = {};

export function saveStudent(studentId) {
  StudentStore[studentId] = {
    id: studentId,
    progress: {
      // practiceId: {,
      //   questionId,
      //   completeness: 0 to 100
      // }
    },
  };
  pushStudentsState();
}

export function getStudent(id) {
  return StudentStore[id];
}

export function getAllStudents() {
  return Object.values(StudentStore);
}

export function getStudentQuestionCompleteness({ studentId, practiceId, questionId }) {
  return StudentStore[studentId]['progress'][practiceId][questionId]['completeness'];
}

export function setStudentProgress({
  studentId,
  practiceId,
  questionId,
  completeness,
  updatedAt,
}) {
  if (!(practiceId in StudentStore[studentId]['progress'])) {
    StudentStore[studentId]['progress'][practiceId] = {}
  }

  if (!(questionId in StudentStore[studentId]['progress'][practiceId])) {
    StudentStore[studentId]['progress'][practiceId][questionId] = {
      id: questionId,
      firstAttempt: updatedAt,
      completeness,
      updatedAt,
    }
  }

  const studentQuestionState = StudentStore[studentId]['progress'][practiceId][questionId];

  studentQuestionState.completeness = completeness;
  studentQuestionState.updatedAt = updatedAt;

  if (completeness === 100 && !studentQuestionState.completedAt) {
    // completedAt timestamp hasn't been set already
    studentQuestionState.completedAt = updatedAt
  }

  pushStudentsState();
}

export function deletePracticeProgress(practiceId) {
  for (const studentId in StudentStore) {
    delete StudentStore[studentId].progress[practiceId];
  }
}
