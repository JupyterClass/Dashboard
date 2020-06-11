import jwt from "jsonwebtoken";
import { getJson } from "../utils/json";
import { unauthorizedError } from "../response/error";

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;
const SECRET = process.env.SECRET;
const DEFAULT_TOKEN_LIFESPAN = Number.parseInt(process.env.DEFAULT_TOKEN_LIFESPAN) || 14400; // 4 hrs
if (isNaN(DEFAULT_TOKEN_LIFESPAN)) {
  throw Error('DEFAULT_TOKEN_LIFESPAN must be an integer!');
}
console.log('⏳ JWT Default token lifespan:', DEFAULT_TOKEN_LIFESPAN);

const roles = {
  owner: 'own',
  teamMember: 'tm',
  student: 'stu',
}

/**
 * Checks and verifies jwt with body:
 * {
 *
 *   role: string {'owner', 'tm', 'stu'}
 *   exp: timestamp
 * }
 */
export default async (req, res) => {
  for (const endpoint in handlers) {
    if (req.url.startsWith(endpoint)) {
      const handler = handlers[endpoint];
      return handler(req, res);
    }
  }
  return handlers['*'](req, res);
}

const handlers = {
  '/auth/login': async (req, res) => {
    try {
      const { password } = await getJson(req);
      if (password === DASHBOARD_PASSWORD) {
        res.end(JSON.stringify({
          token: createJwt.teamMember({}, SECRET)
        }));
      } else {
        res.statusCode = 401;
        res.end(unauthorizedError());
      }
    } catch (err) {
      res.statusCode = 401;
      console.log('AUTH: invalid login request');
      res.end(unauthorizedError());
    }
  },

  '*': (req, res) => {
    try {
      const { id, exp, role } = decodeJwt(getBearerToken(req), SECRET);

      if (exp < Math.floor(Date.now() / 1000)) {
        console.log('AUTH: Token expired');
        return false;
      }
      return { id, exp, role };

    } catch (err) {
      console.log('AUTH: Invalid token -> ' + err);
      res.statusCode = 401;
      res.end(unauthorizedError());
      return false;
    }
  }
};

export const createJwt = {
  student({ id, exp }, secret) {
    return jwt.sign({
      id,
      exp: exp || (Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_LIFESPAN),
      role: roles.student,
    }, secret);
  },

  teamMember({ exp }, secret) {
    return jwt.sign({
      exp: exp || (Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_LIFESPAN),
      role: roles.teamMember,
    }, secret);
  }
}

export function decodeJwt(jwtString, secret) {
  return jwt.verify(jwtString, secret);
}

function getBearerToken(req) {
  const { authorization } = req.headers;
  if (authorization) {
    return authorization.replace('bearer ', '');
  }
  return null;
}
