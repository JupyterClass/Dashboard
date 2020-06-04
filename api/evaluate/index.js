function evaluate(output, expectedOutput) {

  if (!output) {
    return {
      result: 'FAIL',
      reason: "Missing student's output",
    }
  }
  if (!expectedOutput) {
    console.error('expectedOutput was falsey:', expectedOutput);
    return {
      result: 'FAIL',
      reason: 'Missing expected output.. Notebook not initialised on server?'
    }
  }

  output = output.toString();
  expectedOutput = expectedOutput.toString();
  const isCorrect = output.trim().toLowerCase() === expectedOutput.trim().toLowerCase();

  if (isCorrect) {
    return {
      result: 'OK'
    }
  }
  return {
    result: 'FAIL',
    reason: 'Student output did not match expected output!'
  }
}

export default evaluate;
