export function isValidEvalPayload(payload) {
  return (
    payload &&
    'practiceId' in payload &&
    'questionId' in payload &&
    'output' in payload
  )
}
