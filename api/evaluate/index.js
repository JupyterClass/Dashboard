function evaluate(output, expectedOutput) {

  if (!output || !expectedOutput) {
    return false;
  }

  output = output.toString();
  expectedOutput = expectedOutput.toString();

  return output.trim().toLowerCase() === expectedOutput.trim().toLowerCase();

}

export default evaluate;