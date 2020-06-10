const status = 'success';

export function joinedSessionSuccess(token) {
  return JSON.stringify({
    status,
    msg: 'Joined session successfully!',
    token,
  });
}

export function uploadNotebookSuccess() {
  return JSON.stringify({
    status,
    msg: 'Notebook uploaded'
  });
}
