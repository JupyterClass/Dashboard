import { invalidEndpoint } from "./errors";
import endpoints from "./endpoints";

export default function (req, res, next) {

  console.log("got request: " + req.url);

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
