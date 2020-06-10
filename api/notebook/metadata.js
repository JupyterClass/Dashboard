const REQUIRED_FIELDS = [
  'practiceId',
  'studentId',
  'server',
  'sessionPwd',
]

export function verifyMetadata(notebook) {
  // TODO: Send ALL validation errors to the client.

  if (!('JupyterClass' in notebook['metadata'])) {
    throw Error(`Missing JupyterClass configs. Ensure that the notebook metadata contains a 'JupyterClass' key...`);
  }

  const { metadata } = notebook;
  const missingFields = [];

  for (const requiredField of REQUIRED_FIELDS) {
    if (!(requiredField in metadata['JupyterClass'])) {
      missingFields.push(requiredField);
    }
  }
  if (missingFields.length > 0) {
    throw Error(`Invalid JupyterClass config. Required fields ["${missingFields}"] are missing from notebook metadata.`);
  }

  const expiry = metadata['JupyterClass']['expiry']; // Optional
  if (expiry && !isExpiryValid(expiry)) {
    throw Error(`Invalid JupyterClass config -> "Expiry" is an invalid timestamp / not parsable.`)
  }

  const invalidCells = [];
  for (const cell of notebook.cells) {
    if (
      cell['cell_type'] === 'code' &&
      'Question' in cell['metadata']
    ) {
      const questionCell = cell['metadata']['Question'];
      if (!('expected' in questionCell)) {
        invalidCells.push(questionCell);
      }
    }
  }

  if (invalidCells.length > 0) {
    throw Error(`
      Invalid cells: ${JSON.stringify(invalidCells)}
    `);
  }

  return {

  }
}

/**
 * @param {string|number} timestamp - Either an unix timestamp (number) or string that can
 *                                    be converted to a unix timestamp occurring after Date.now()
 * @returns {boolean}
 */
function isExpiryValid(timestamp) {
  if (!timestamp) {
    return false;
  }
  if (isNaN(timestamp)) {
    timestamp = Number(new Date(timestamp));
    if (isNaN(timestamp)) {
      return false;
    }
  }
  return timestamp > Date.now();
}
