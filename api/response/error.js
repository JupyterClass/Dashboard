const status = 'error';

export function error(msg) {
  return JSON.stringify({
    status,
    msg
  });
}

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
  return JSON.stringify({
    status,
    msg: "Tried to join a practice session that doesn't exist!"
  });
}

export function nonexistentQuestionError() {
  return JSON.stringify({
    status,
    msg: "Submitted output to a question that doesn't exist!"
  });
}
