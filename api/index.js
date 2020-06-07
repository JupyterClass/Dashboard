import { invalidEndpoint } from "./response/error";
import endpoints from "./endpoints";

export default function (req, res, next) {

  addCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    // browser's CORS preflight request.
    res.end("");
    return;
  }

  // Registering our endpoints
  for (const endpoint in endpoints) {
    if (req.url.endsWith(endpoint)) {
      const handler = endpoints[endpoint];
      res.setHeader('Content-Type', 'application/json'); // Applies to all endpoints
      handler(req, res, next);
      return;
    }
  }
  // If client requests for some nonsense endpoint
  res.end(invalidEndpoint());

}

function addCorsHeaders(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Max-Age", "86400");
}
