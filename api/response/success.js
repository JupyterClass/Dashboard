const status = 'success';

export function joinedSessionSuccess() {
  return JSON.stringify({
    status,
    msg: 'Joined session successfully!'
  });
}
