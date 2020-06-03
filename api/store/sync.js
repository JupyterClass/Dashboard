import { NotebookStore, QuestionStore } from "./question";
import { StudentStore } from "./student";
import { io } from "../websocket";

export function pushToClient() {
  io.emit('store-update', {
    NotebookStore, QuestionStore, StudentStore
  });
}
