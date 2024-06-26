// Our node.js webserver
import {argv} from "./index";

const isKarma = argv.karma;
console.log("karma", isKarma);
export const AUTH0_DOMAIN = isKarma ? 'test-conning.auth0.com' : (process.env["AUTH_DOMAIN"] || process.env["AUTH0_TENANT_DOMAIN"] || 'conning.auth0.com');
export const AUTH_DOMAIN = AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = isKarma ? 'HdAO4Xatl0Mf73gmuAbEH4lYvq8WXX4L' : (process.env["AUTH0_BROWSER_CLIENT_ID"] || 'qnvpoJRgeyPVud3ewdPnt0bJ2wRFsX1N');
export const AUTH0_REST_CLIENT_ID = isKarma ? "RtrMmqbmzErZoBteRIACgzTjPFwmGxOp" : (process.env["AUTH0_REST_CLIENT_ID"] || 'JGOPwkWmqn544TSRdQk2RLYjrypNmk38');
export const AUTH0_REST_CLIENT_SECRET = isKarma ? "80rrrgDK7JM7xWvPTLj3_BjGI8xmFc3gGaKaKS-vgBIFyYW8LUI2XEsEkBUKM6K0" : (process.env["AUTH0_REST_CLIENT_SECRET"] || 'hJVLK1Bb1Y6Cf9dWHm1NlytoOpayAee_Ywe8mdcIdnnnXELdf9niFEvFMrsT-I1C');

// export const AUTH0_CLIENT_ID = 'U7iPiHJ46mkKHDfkOwEXLuYprx7gJdxt'
// export const AUTH0_DOMAIN = 'conning.auth0.com'
// export const AUTH0_SECRET = 'wz7KIsulizjqAbNBdcaUu2QCUGXl15TXlkKBOfveEljGEjyOAJdskz_wm9b3nzVZ'
