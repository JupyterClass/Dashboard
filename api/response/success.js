const status = 'success';

export function joinedSessionSuccess() {
  return JSON.stringify({
    status,
    msg: 'Joined session successfully!'
  });
}

export function uploadNotebookSuccess() {
  return JSON.stringify({
    status,
    msg: 'Notebook uploaded'
  });
}
