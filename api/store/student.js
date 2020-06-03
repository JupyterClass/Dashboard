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
import { pushToClient } from "./sync";

export const StudentStore = {};

export function saveStudent(studentId) {
  StudentStore[studentId] = {
    id: studentId,
    questions: {},
  };
  pushToClient();
}

export function getStudent(id) {
  return StudentStore[id];
}

export function getAllStudents() {
  return Object.values(StudentStore);
}
