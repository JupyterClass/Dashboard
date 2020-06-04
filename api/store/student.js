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
      // practiceId,
      // questionId,
      // completeness: 0 to 100
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
    StudentStore[studentId]['progress'] = {
      [practiceId]: {}
    }
  }
  StudentStore[studentId]['progress'][practiceId][questionId] = {
    completeness,
    updatedAt,
  };
  pushStudentsState();
}
