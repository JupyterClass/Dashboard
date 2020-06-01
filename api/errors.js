export function invalidPayloadError() {
  return JSON.stringify({
    status: 'error',
    msg: 'Invalid Payload Error'
  });
}

export function invalidEndpoint() {
  return JSON.stringify({
    status: 'error',
    msg: 'Endpoint not found!'
  })
}
