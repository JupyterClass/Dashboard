export function getJson(req) {
  return new Promise((resolve, reject) => {
    let body = [];
    req.on('data', chunk => body.push(chunk.toString()));
    req.on('end', () => {
      body = body.join('');

      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }

    });
  });
}
