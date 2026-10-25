// import type { CookieOptions } from "express";

// const isProduction = process.env.Node_ENV === "production";

// export const cookieOptions: CookieOptions = {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? "none" : "lax",
// };

// export const ACCESS_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
// export const REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;



import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export const ACCESS_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
export const REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;