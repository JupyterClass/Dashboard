export function isValidEvalPayload(payload) {
  return (
    payload &&
    'studentId' in payload &&
    'practiceId' in payload &&
    'questionId' in payload &&
    'output' in payload
  )
}
