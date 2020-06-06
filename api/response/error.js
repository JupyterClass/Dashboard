const status = 'error';

export function invalidPayloadError() {
  return JSON.stringify({
    status,
    msg: 'Invalid Payload Error'
  });
}

export function invalidEndpoint() {
  return JSON.stringify({
    status,
    msg: 'Endpoint not found!'
  })
}

export function duplicateStudentIdError() {
  return JSON.stringify({
    status,
    msg: 'Duplicate student id.'
  });
}

export function nonexistentPracticeError() {
  JSON.stringify({
    status,
    msg: "Tried to join a practice session that doesn't exist!"
  });
}
