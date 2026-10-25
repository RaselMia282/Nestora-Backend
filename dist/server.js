
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    var fs = __require("fs");
    var path3 = __require("path");
    var os = __require("os");
    var crypto2 = __require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path3.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports, module) {
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports, module) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/modules/auth/auth.routes.ts
import { Router } from "express";

// src/modules/auth/auth.controller.ts
import httpStatus2 from "http-status";

// src/utilis/catchAsync.ts
import httpStatus from "http-status";
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "",
        error: error.message
      });
    }
  };
};

// src/modules/auth/auth.validation.ts
import z from "zod";

// src/generated/prisma/enums.ts
var Role = {
  OWNER: "OWNER",
  TENANT: "TENANT",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL"
};
var Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
};
var RoomStatus = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  OCCUPIED: "OCCUPIED"
};
var ApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};
var VerificationStatus = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED"
};
var LeaseStatus = {
  ACTIVE: "ACTIVE",
  TERMINATED: "TERMINATED"
};
var PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  SSLCOMMERZ: "SSLCOMMERZ",
  BKASH: "BKASH",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  STRIPE: "STRIPE"
};

// src/modules/auth/auth.validation.ts
var registerUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password atleast must be 6 characters or long"),
  phone: z.string().optional(),
  gender: z.enum(Gender).optional(),
  role: z.enum([Role.TENANT, Role.ADMIN, Role.MANAGER, Role.OWNER]).default(Role.TENANT)
});
var loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password atleast must be 6 characters or long")
});
var googleLoginSchema = z.object({
  idToken: z.string().min(1),
  required_error: "Google ID Token is required"
});
var forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email")
});
var resetPasswordSchema = z.object({
  email: z.string({
    message: "Email is required"
  }).email("Invalid email address"),
  newPassword: z.string({
    message: "Password is required"
  }).min(6, "Password must be at least 6 characters long"),
  otp: z.string({
    message: "OTP is required"
  }).length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain numbers only")
});

// src/modules/auth/auth.service.ts
import ejs from "ejs";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model PropertyCategory {\n  id                  String   @id @default(uuid())\n  name                String   @unique\n  slug                String   @unique\n  description         String?\n  categoryImg         String?\n  categoryImgPublicId String?\n  isActive            Boolean  @default(true)\n  sortOrder           Int      @default(0)\n  createdAt           DateTime @default(now())\n  updatedAt           DateTime @updatedAt\n\n  properties Property[]\n\n  @@map("property_categories")\n}\n\nmodel Application {\n  id         String            @id @default(uuid())\n  roomId     String?\n  tenantId   String\n  status     ApplicationStatus @default(PENDING)\n  createdAt  DateTime          @default(now())\n  updatedAt  DateTime          @updatedAt\n  propertyId String?\n  room       Room?             @relation(fields: [roomId], references: [id], onDelete: Cascade)\n  tenant     User              @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n  lease      Lease?\n  property   Property?         @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n\n  @@index([roomId])\n  @@index([tenantId])\n  @@index([status])\n  @@map("applications")\n}\n\nenum Role {\n  OWNER\n  TENANT\n  MANAGER\n\n  ADMIN\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum RoomStatus {\n  AVAILABLE\n  RESERVED\n  OCCUPIED\n}\n\nenum ApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  SUSPENDED\n  DELETED\n}\n\nenum PropertyType {\n  APARTMENT\n  HOUSE\n  CONDO\n  VILLA\n  TOWNHOUSE\n  DUPLEX\n}\n\nenum RoomType {\n  SINGLE\n  DOUBLE\n  MASTER\n  SHARED\n}\n\nenum VerificationStatus {\n  PENDING\n  VERIFIED\n  REJECTED\n}\n\nenum LeaseStatus {\n  ACTIVE\n  TERMINATED\n}\n\nenum PaymentMethod {\n  CREDIT_CARD\n  SSLCOMMERZ\n  BKASH\n\n  CASH_ON_DELIVERY\n  STRIPE\n}\n\nmodel Lease {\n  id              String      @id @default(uuid())\n  applicationId   String      @unique\n  startDate       DateTime\n  endDate         DateTime\n  monthlyRent     Float\n  securityDeposit Float\n  isSigned        Boolean     @default(false)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n  status          LeaseStatus @default(ACTIVE)\n  application     Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)\n  payments        Payment[]\n\n  @@map("leases")\n}\n\nmodel Listing {\n  id          String   @id @default(uuid())\n  roomId      String   @unique\n  title       String\n  description String\n  isPublished Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  @@map("listings")\n}\n\nmodel Payment {\n  id            String @id @default(uuid())\n  leaseId       String @unique\n  tenantId      String\n  transactionId String @unique\n  amount        Float\n\n  paymentMethod PaymentMethod?\n  paymentData   Json?\n  status        PaymentStatus  @default(PENDING)\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n\n  lease  Lease @relation(fields: [leaseId], references: [id], onDelete: Cascade)\n  tenant User  @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  @@map("payments")\n}\n\nmodel Profile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  firstName      String\n  lastName       String?\n  phone          String?\n  gender         Gender?\n  avatarUrl      String?\n  avatarPublicId String?\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("profiles")\n}\n\nmodel Property {\n  id                  String           @id @default(uuid())\n  ownerId             String\n  title               String\n  address             String\n  city                String\n  description         String?          @db.Text\n  latitude            Float?\n  longitude           Float?\n  areaSqft            Int?\n  propertyImg         String?\n  propertyImgPublicId String?\n  categoryId          String\n  applications        Application[]\n  createdAt           DateTime         @default(now())\n  updatedAt           DateTime         @updatedAt\n  fullRent            Decimal?         @db.Decimal(10, 2)\n  category            PropertyCategory @relation(fields: [categoryId], references: [id])\n  owner               User             @relation(fields: [ownerId], references: [id], onDelete: Cascade)\n  rooms               Room[]\n\n  @@index([ownerId])\n  @@index([city])\n  @@map("properties")\n}\n\nmodel Room {\n  id         String     @id @default(uuid())\n  propertyId String\n  roomNumber String\n  roomType   RoomType\n  baseRent   Decimal    @db.Decimal(10, 2)\n  status     RoomStatus @default(AVAILABLE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  property     Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n  images       RoomImage[]\n  listing      Listing?\n  applications Application[]\n\n  @@unique([propertyId, roomNumber])\n  @@index([propertyId])\n  @@map("rooms")\n}\n\nmodel RoomImage {\n  id        String   @id @default(uuid())\n  roomId    String\n  imageUrl  String\n  publicId  String\n  createdAt DateTime @default(now())\n\n  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  @@index([roomId])\n  @@map("room_images")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id    String @id @default(uuid())\n  email String @unique\n\n  password             String?\n  role                 Role                  @default(TENANT)\n  authProvider         AuthProvider          @default(CREDENTIAL)\n  googleId             String?               @unique\n  createdAt            DateTime              @default(now())\n  updatedAt            DateTime              @updatedAt\n  status               UserStatus            @default(ACTIVE)\n  profile              Profile?\n  properties           Property[]\n  applications         Application[]\n  payments             Payment[]\n  identityVerification IdentityVerification?\n\n  @@map("users")\n}\n\nmodel IdentityVerification {\n  id               String             @id @default(uuid())\n  userId           String             @unique\n  nidNumber        String?            @unique\n  nidFrontUrl      String?\n  nidFrontPublicId String?\n  nidBackUrl       String?\n  nidBackPublicId  String?\n  status           VerificationStatus @default(PENDING)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([status])\n  @@map("identity_verifications")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"PropertyCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"categoryImg","kind":"scalar","type":"String"},{"name":"categoryImgPublicId","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToPropertyCategory"}],"dbName":"property_categories","schema":null},"Application":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ApplicationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"room","kind":"object","type":"Room","relationName":"ApplicationToRoom"},{"name":"tenant","kind":"object","type":"User","relationName":"ApplicationToUser"},{"name":"lease","kind":"object","type":"Lease","relationName":"ApplicationToLease"},{"name":"property","kind":"object","type":"Property","relationName":"ApplicationToProperty"}],"dbName":"applications","schema":null},"Lease":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicationId","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"monthlyRent","kind":"scalar","type":"Float"},{"name":"securityDeposit","kind":"scalar","type":"Float"},{"name":"isSigned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"LeaseStatus"},{"name":"application","kind":"object","type":"Application","relationName":"ApplicationToLease"},{"name":"payments","kind":"object","type":"Payment","relationName":"LeaseToPayment"}],"dbName":"leases","schema":null},"Listing":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"ListingToRoom"}],"dbName":"listings","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"leaseId","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentData","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"lease","kind":"object","type":"Lease","relationName":"LeaseToPayment"},{"name":"tenant","kind":"object","type":"User","relationName":"PaymentToUser"}],"dbName":"payments","schema":null},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"firstName","kind":"scalar","type":"String"},{"name":"lastName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"avatarPublicId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"}],"dbName":"profiles","schema":null},"Property":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"},{"name":"areaSqft","kind":"scalar","type":"Int"},{"name":"propertyImg","kind":"scalar","type":"String"},{"name":"propertyImgPublicId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToProperty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"fullRent","kind":"scalar","type":"Decimal"},{"name":"category","kind":"object","type":"PropertyCategory","relationName":"PropertyToPropertyCategory"},{"name":"owner","kind":"object","type":"User","relationName":"PropertyToUser"},{"name":"rooms","kind":"object","type":"Room","relationName":"PropertyToRoom"}],"dbName":"properties","schema":null},"Room":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"roomNumber","kind":"scalar","type":"String"},{"name":"roomType","kind":"enum","type":"RoomType"},{"name":"baseRent","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"RoomStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToRoom"},{"name":"images","kind":"object","type":"RoomImage","relationName":"RoomToRoomImage"},{"name":"listing","kind":"object","type":"Listing","relationName":"ListingToRoom"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToRoom"}],"dbName":"rooms","schema":null},"RoomImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"RoomToRoomImage"}],"dbName":"room_images","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToUser"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"identityVerification","kind":"object","type":"IdentityVerification","relationName":"IdentityVerificationToUser"}],"dbName":"users","schema":null},"IdentityVerification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"nidNumber","kind":"scalar","type":"String"},{"name":"nidFrontUrl","kind":"scalar","type":"String"},{"name":"nidFrontPublicId","kind":"scalar","type":"String"},{"name":"nidBackUrl","kind":"scalar","type":"String"},{"name":"nidBackPublicId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"VerificationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"IdentityVerificationToUser"}],"dbName":"identity_verifications","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","property","room","images","listing","applications","_count","user","profile","properties","application","payments","lease","tenant","identityVerification","category","owner","rooms","PropertyCategory.findUnique","PropertyCategory.findUniqueOrThrow","PropertyCategory.findFirst","PropertyCategory.findFirstOrThrow","PropertyCategory.findMany","data","PropertyCategory.createOne","PropertyCategory.createMany","PropertyCategory.createManyAndReturn","PropertyCategory.updateOne","PropertyCategory.updateMany","PropertyCategory.updateManyAndReturn","create","update","PropertyCategory.upsertOne","PropertyCategory.deleteOne","PropertyCategory.deleteMany","having","_avg","_sum","_min","_max","PropertyCategory.groupBy","PropertyCategory.aggregate","Application.findUnique","Application.findUniqueOrThrow","Application.findFirst","Application.findFirstOrThrow","Application.findMany","Application.createOne","Application.createMany","Application.createManyAndReturn","Application.updateOne","Application.updateMany","Application.updateManyAndReturn","Application.upsertOne","Application.deleteOne","Application.deleteMany","Application.groupBy","Application.aggregate","Lease.findUnique","Lease.findUniqueOrThrow","Lease.findFirst","Lease.findFirstOrThrow","Lease.findMany","Lease.createOne","Lease.createMany","Lease.createManyAndReturn","Lease.updateOne","Lease.updateMany","Lease.updateManyAndReturn","Lease.upsertOne","Lease.deleteOne","Lease.deleteMany","Lease.groupBy","Lease.aggregate","Listing.findUnique","Listing.findUniqueOrThrow","Listing.findFirst","Listing.findFirstOrThrow","Listing.findMany","Listing.createOne","Listing.createMany","Listing.createManyAndReturn","Listing.updateOne","Listing.updateMany","Listing.updateManyAndReturn","Listing.upsertOne","Listing.deleteOne","Listing.deleteMany","Listing.groupBy","Listing.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Property.findUnique","Property.findUniqueOrThrow","Property.findFirst","Property.findFirstOrThrow","Property.findMany","Property.createOne","Property.createMany","Property.createManyAndReturn","Property.updateOne","Property.updateMany","Property.updateManyAndReturn","Property.upsertOne","Property.deleteOne","Property.deleteMany","Property.groupBy","Property.aggregate","Room.findUnique","Room.findUniqueOrThrow","Room.findFirst","Room.findFirstOrThrow","Room.findMany","Room.createOne","Room.createMany","Room.createManyAndReturn","Room.updateOne","Room.updateMany","Room.updateManyAndReturn","Room.upsertOne","Room.deleteOne","Room.deleteMany","Room.groupBy","Room.aggregate","RoomImage.findUnique","RoomImage.findUniqueOrThrow","RoomImage.findFirst","RoomImage.findFirstOrThrow","RoomImage.findMany","RoomImage.createOne","RoomImage.createMany","RoomImage.createManyAndReturn","RoomImage.updateOne","RoomImage.updateMany","RoomImage.updateManyAndReturn","RoomImage.upsertOne","RoomImage.deleteOne","RoomImage.deleteMany","RoomImage.groupBy","RoomImage.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","IdentityVerification.findUnique","IdentityVerification.findUniqueOrThrow","IdentityVerification.findFirst","IdentityVerification.findFirstOrThrow","IdentityVerification.findMany","IdentityVerification.createOne","IdentityVerification.createMany","IdentityVerification.createManyAndReturn","IdentityVerification.updateOne","IdentityVerification.updateMany","IdentityVerification.updateManyAndReturn","IdentityVerification.upsertOne","IdentityVerification.deleteOne","IdentityVerification.deleteMany","IdentityVerification.groupBy","IdentityVerification.aggregate","AND","OR","NOT","id","userId","nidNumber","nidFrontUrl","nidFrontPublicId","nidBackUrl","nidBackPublicId","VerificationStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","email","password","Role","role","AuthProvider","authProvider","googleId","UserStatus","every","some","none","roomId","imageUrl","publicId","propertyId","roomNumber","RoomType","roomType","baseRent","RoomStatus","ownerId","title","address","city","description","latitude","longitude","areaSqft","propertyImg","propertyImgPublicId","categoryId","fullRent","firstName","lastName","phone","Gender","gender","avatarUrl","avatarPublicId","leaseId","tenantId","transactionId","amount","PaymentMethod","paymentMethod","paymentData","PaymentStatus","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","isPublished","applicationId","startDate","endDate","monthlyRent","securityDeposit","isSigned","LeaseStatus","ApplicationStatus","name","slug","categoryImg","categoryImgPublicId","isActive","sortOrder","propertyId_roomNumber","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "7wVosAEOCwAA1AIAIMwBAACUAwAwzQEAAC8AEM4BAACUAwAwzwEBAAAAAdgBQADCAgAh2QFAAMICACH9AQEAwAIAIaMCAQAAAAGkAgEAAAABpQIBAMACACGmAgEAwAIAIacCIACDAwAhqAICAJUDACEBAAAAAQAgFgcAANUCACARAACtAwAgEgAAwwIAIBMAAK4DACDMAQAAqQMAMM0BAAADABDOAQAAqQMAMM8BAQDPAgAh2AFAAMICACHZAUAAwgIAIfkBAQDPAgAh-gEBAM8CACH7AQEAzwIAIfwBAQDPAgAh_QEBAMACACH-AQgAqgMAIf8BCACqAwAhgAICAKsDACGBAgEAwAIAIYICAQDAAgAhgwIBAM8CACGEAhAArAMAIQsHAADeBAAgEQAApAUAIBIAALkDACATAAClBQAg_QEAAK8DACD-AQAArwMAIP8BAACvAwAggAIAAK8DACCBAgAArwMAIIICAACvAwAghAIAAK8DACAWBwAA1QIAIBEAAK0DACASAADDAgAgEwAArgMAIMwBAACpAwAwzQEAAAMAEM4BAACpAwAwzwEBAAAAAdgBQADCAgAh2QFAAMICACH5AQEAzwIAIfoBAQDPAgAh-wEBAM8CACH8AQEAzwIAIf0BAQDAAgAh_gEIAKoDACH_AQgAqgMAIYACAgCrAwAhgQIBAMACACGCAgEAwAIAIYMCAQDPAgAhhAIQAKwDACEDAAAAAwAgAQAABAAwAgAABQAgDgMAAKgDACAEAACmAwAgDgAApwMAIA8AAMMCACDMAQAApAMAMM0BAAAHABDOAQAApAMAMM8BAQDPAgAh1wEAAKUDowIi2AFAAMICACHZAUAAwgIAIfABAQDAAgAh8wEBAMACACGNAgEAzwIAIQYDAACgBQAgBAAAgwUAIA4AAKMFACAPAAC5AwAg8AEAAK8DACDzAQAArwMAIA4DAACoAwAgBAAApgMAIA4AAKcDACAPAADDAgAgzAEAAKQDADDNAQAABwAQzgEAAKQDADDPAQEAAAAB1wEAAKUDowIi2AFAAMICACHZAUAAwgIAIfABAQDAAgAh8wEBAMACACGNAgEAzwIAIQMAAAAHACABAAAIADACAAAJACAPAwAAmwMAIAUAAJwDACAGAACdAwAgBwAA1QIAIMwBAACXAwAwzQEAAAsAEM4BAACXAwAwzwEBAM8CACHXAQAAmgP5ASLYAUAAwgIAIdkBQADCAgAh8wEBAM8CACH0AQEAzwIAIfYBAACYA_YBIvcBEACZAwAhAQAAAAsAIAkEAACEAwAgzAEAAKMDADDNAQAADQAQzgEAAKMDADDPAQEAzwIAIdgBQADCAgAh8AEBAM8CACHxAQEAzwIAIfIBAQDPAgAhAQQAAIMFACAJBAAAhAMAIMwBAACjAwAwzQEAAA0AEM4BAACjAwAwzwEBAAAAAdgBQADCAgAh8AEBAM8CACHxAQEAzwIAIfIBAQDPAgAhAwAAAA0AIAEAAA4AMAIAAA8AIAsEAACEAwAgzAEAAIIDADDNAQAAEQAQzgEAAIIDADDPAQEAzwIAIdgBQADCAgAh2QFAAMICACHwAQEAzwIAIfoBAQDPAgAh_QEBAM8CACGaAiAAgwMAIQEAAAARACADAAAABwAgAQAACAAwAgAACQAgAQAAAA0AIAEAAAAHACAOCQAAwwIAIMwBAADwAgAwzQEAABYAEM4BAADwAgAwzwEBAM8CACHQAQEAzwIAIdgBQADCAgAh2QFAAMICACGFAgEAzwIAIYYCAQDAAgAhhwIBAMACACGJAgAA8QKJAiOKAgEAwAIAIYsCAQDAAgAhAQAAABYAIAMAAAADACABAAAEADACAAAFACADAAAABwAgAQAACAAwAgAACQAgDw4AAKIDACAPAADDAgAgzAEAAJ4DADDNAQAAGgAQzgEAAJ4DADDPAQEAzwIAIdcBAAChA5QCItgBQADCAgAh2QFAAMICACGMAgEAzwIAIY0CAQDPAgAhjgIBAM8CACGPAggAigMAIZECAACfA5ECI5ICAACgAwAgBA4AAKMFACAPAAC5AwAgkQIAAK8DACCSAgAArwMAIA8OAACiAwAgDwAAwwIAIMwBAACeAwAwzQEAABoAEM4BAACeAwAwzwEBAAAAAdcBAAChA5QCItgBQADCAgAh2QFAAMICACGMAgEAAAABjQIBAM8CACGOAgEAAAABjwIIAIoDACGRAgAAnwORAiOSAgAAoAMAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAQAAABoAIA4JAADDAgAgzAEAAL8CADDNAQAAIAAQzgEAAL8CADDPAQEAzwIAIdABAQDPAgAh0QEBAMACACHSAQEAwAIAIdMBAQDAAgAh1AEBAMACACHVAQEAwAIAIdcBAADBAtcBItgBQADCAgAh2QFAAMICACEBAAAAIAAgAQAAAAMAIAEAAAAHACABAAAAGgAgDwwAAIwDACANAADWAgAgzAEAAIkDADDNAQAAJQAQzgEAAIkDADDPAQEAzwIAIdcBAACLA6ICItgBQADCAgAh2QFAAMICACGbAgEAzwIAIZwCQADCAgAhnQJAAMICACGeAggAigMAIZ8CCACKAwAhoAIgAIMDACEBAAAAJQAgAQAAAAMAIAQDAACgBQAgBQAAoQUAIAYAAKIFACAHAADeBAAgEAMAAJsDACAFAACcAwAgBgAAnQMAIAcAANUCACDMAQAAlwMAMM0BAAALABDOAQAAlwMAMM8BAQAAAAHXAQAAmgP5ASLYAUAAwgIAIdkBQADCAgAh8wEBAM8CACH0AQEAzwIAIfYBAACYA_YBIvcBEACZAwAhqQIAAJYDACADAAAACwAgAQAAKAAwAgAAKQAgAQAAAAcAIAEAAAALACABAAAAAwAgAQAAAAEAIA4LAADUAgAgzAEAAJQDADDNAQAALwAQzgEAAJQDADDPAQEAzwIAIdgBQADCAgAh2QFAAMICACH9AQEAwAIAIaMCAQDPAgAhpAIBAM8CACGlAgEAwAIAIaYCAQDAAgAhpwIgAIMDACGoAgIAlQMAIQQLAADdBAAg_QEAAK8DACClAgAArwMAIKYCAACvAwAgAwAAAC8AIAEAADAAMAIAAAEAIAMAAAAvACABAAAwADACAAABACADAAAALwAgAQAAMAAwAgAAAQAgCwsAAJ8FACDPAQEAAAAB2AFAAAAAAdkBQAAAAAH9AQEAAAABowIBAAAAAaQCAQAAAAGlAgEAAAABpgIBAAAAAacCIAAAAAGoAgIAAAABARkAADQAIArPAQEAAAAB2AFAAAAAAdkBQAAAAAH9AQEAAAABowIBAAAAAaQCAQAAAAGlAgEAAAABpgIBAAAAAacCIAAAAAGoAgIAAAABARkAADYAMAEZAAA2ADALCwAAlQUAIM8BAQCzAwAh2AFAALYDACHZAUAAtgMAIf0BAQC0AwAhowIBALMDACGkAgEAswMAIaUCAQC0AwAhpgIBALQDACGnAiAA7wMAIagCAgCUBQAhAgAAAAEAIBkAADkAIArPAQEAswMAIdgBQAC2AwAh2QFAALYDACH9AQEAtAMAIaMCAQCzAwAhpAIBALMDACGlAgEAtAMAIaYCAQC0AwAhpwIgAO8DACGoAgIAlAUAIQIAAAAvACAZAAA7ACACAAAALwAgGQAAOwAgAwAAAAEAICAAADQAICEAADkAIAEAAAABACABAAAALwAgCAgAAI8FACAmAACQBQAgJwAAkwUAICgAAJIFACApAACRBQAg_QEAAK8DACClAgAArwMAIKYCAACvAwAgDcwBAACRAwAwzQEAAEIAEM4BAACRAwAwzwEBALECACHYAUAAtAIAIdkBQAC0AgAh_QEBALICACGjAgEAsQIAIaQCAQCxAgAhpQIBALICACGmAgEAsgIAIacCIAD_AgAhqAICAJIDACEDAAAALwAgAQAAQQAwJQAAQgAgAwAAAC8AIAEAADAAMAIAAAEAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgCwMAAIEEACAEAAD_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_QEBALMDACGaAiAA7wMAIQIAAAARACAZAACFAQAgAgAAABEAIBkAAIUBACADAAAAdwAgIAAAfgAgIQAAgwEAIAEAAAB3ACABAAAAEQAgAwgAAP4EACAoAACABQAgKQAA_wQAIArMAQAA_gIAMM0BAACMAQAQzgEAAP4CADDPAQEAsQIAIdgBQAC0AgAh2QFAALQCACHwAQEAsQIAIfoBAQCxAgAh_QEBALECACGaAiAA_wIAIQMAAAARACABAACLAQAwJQAAjAEAIAMAAAARACABAAB6ADACAAB3ACABAAAAHAAgAQAAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIAwOAADaAwAgDwAA_AMAIM8BAQAAAAHXAQAAAJQCAtgBQAAAAAHZAUAAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIIAAAAAZECAAAAkQIDkgKAAAAAAQEZAACUAQAgCs8BAQAAAAHXAQAAAJQCAtgBQAAAAAHZAUAAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIIAAAAAZECAAAAkQIDkgKAAAAAAQEZAACWAQAwARkAAJYBADAMDgAA2AMAIA8AAPoDACDPAQEAswMAIdcBAADWA5QCItgBQAC2AwAh2QFAALYDACGMAgEAswMAIY0CAQCzAwAhjgIBALMDACGPAggA1AMAIZECAADVA5ECI5ICgAAAAAECAAAAHAAgGQAAmQEAIArPAQEAswMAIdcBAADWA5QCItgBQAC2AwAh2QFAALYDACGMAgEAswMAIY0CAQCzAwAhjgIBALMDACGPAggA1AMAIZECAADVA5ECI5ICgAAAAAECAAAAGgAgGQAAmwEAIAIAAAAaACAZAACbAQAgAwAAABwAICAAAJQBACAhAACZAQAgAQAAABwAIAEAAAAaACAHCAAA-QQAICYAAPoEACAnAAD9BAAgKAAA_AQAICkAAPsEACCRAgAArwMAIJICAACvAwAgDcwBAADyAgAwzQEAAKIBABDOAQAA8gIAMM8BAQCxAgAh1wEAAPYClAIi2AFAALQCACHZAUAAtAIAIYwCAQCxAgAhjQIBALECACGOAgEAsQIAIY8CCADzAgAhkQIAAPQCkQIjkgIAAPUCACADAAAAGgAgAQAAoQEAMCUAAKIBACADAAAAGgAgAQAAGwAwAgAAHAAgDgkAAMMCACDMAQAA8AIAMM0BAAAWABDOAQAA8AIAMM8BAQAAAAHQAQEAAAAB2AFAAMICACHZAUAAwgIAIYUCAQDPAgAhhgIBAMACACGHAgEAwAIAIYkCAADxAokCI4oCAQDAAgAhiwIBAMACACEBAAAApQEAIAEAAAClAQAgBgkAALkDACCGAgAArwMAIIcCAACvAwAgiQIAAK8DACCKAgAArwMAIIsCAACvAwAgAwAAABYAIAEAAKgBADACAAClAQAgAwAAABYAIAEAAKgBADACAAClAQAgAwAAABYAIAEAAKgBADACAAClAQAgCwkAAPgEACDPAQEAAAAB0AEBAAAAAdgBQAAAAAHZAUAAAAABhQIBAAAAAYYCAQAAAAGHAgEAAAABiQIAAACJAgOKAgEAAAABiwIBAAAAAQEZAACsAQAgCs8BAQAAAAHQAQEAAAAB2AFAAAAAAdkBQAAAAAGFAgEAAAABhgIBAAAAAYcCAQAAAAGJAgAAAIkCA4oCAQAAAAGLAgEAAAABARkAAK4BADABGQAArgEAMAsJAAD3BAAgzwEBALMDACHQAQEAswMAIdgBQAC2AwAh2QFAALYDACGFAgEAswMAIYYCAQC0AwAhhwIBALQDACGJAgAA1gSJAiOKAgEAtAMAIYsCAQC0AwAhAgAAAKUBACAZAACxAQAgCs8BAQCzAwAh0AEBALMDACHYAUAAtgMAIdkBQAC2AwAhhQIBALMDACGGAgEAtAMAIYcCAQC0AwAhiQIAANYEiQIjigIBALQDACGLAgEAtAMAIQIAAAAWACAZAACzAQAgAgAAABYAIBkAALMBACADAAAApQEAICAAAKwBACAhAACxAQAgAQAAAKUBACABAAAAFgAgCAgAAPQEACAoAAD2BAAgKQAA9QQAIIYCAACvAwAghwIAAK8DACCJAgAArwMAIIoCAACvAwAgiwIAAK8DACANzAEAAOwCADDNAQAAugEAEM4BAADsAgAwzwEBALECACHQAQEAsQIAIdgBQAC0AgAh2QFAALQCACGFAgEAsQIAIYYCAQCyAgAhhwIBALICACGJAgAA7QKJAiOKAgEAsgIAIYsCAQCyAgAhAwAAABYAIAEAALkBADAlAAC6AQAgAwAAABYAIAEAAKgBADACAAClAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACATBwAAzgQAIBEAAM8EACASAADzBAAgEwAA0AQAIM8BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIQAAAAAQEZAADCAQAgD88BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIQAAAAAQEZAADEAQAwARkAAMQBADATBwAAkAQAIBEAAJEEACASAADyBAAgEwAAkgQAIM8BAQCzAwAh2AFAALYDACHZAUAAtgMAIfkBAQCzAwAh-gEBALMDACH7AQEAswMAIfwBAQCzAwAh_QEBALQDACH-AQgAjAQAIf8BCACMBAAhgAICAI0EACGBAgEAtAMAIYICAQC0AwAhgwIBALMDACGEAhAAjgQAIQIAAAAFACAZAADHAQAgD88BAQCzAwAh2AFAALYDACHZAUAAtgMAIfkBAQCzAwAh-gEBALMDACH7AQEAswMAIfwBAQCzAwAh_QEBALQDACH-AQgAjAQAIf8BCACMBAAhgAICAI0EACGBAgEAtAMAIYICAQC0AwAhgwIBALMDACGEAhAAjgQAIQIAAAADACAZAADJAQAgAgAAAAMAIBkAAMkBACADAAAABQAgIAAAwgEAICEAAMcBACABAAAABQAgAQAAAAMAIAwIAADtBAAgJgAA7gQAICcAAPEEACAoAADwBAAgKQAA7wQAIP0BAACvAwAg_gEAAK8DACD_AQAArwMAIIACAACvAwAggQIAAK8DACCCAgAArwMAIIQCAACvAwAgEswBAADjAgAwzQEAANABABDOAQAA4wIAMM8BAQCxAgAh2AFAALQCACHZAUAAtAIAIfkBAQCxAgAh-gEBALECACH7AQEAsQIAIfwBAQCxAgAh_QEBALICACH-AQgA5AIAIf8BCADkAgAhgAICAOUCACGBAgEAsgIAIYICAQCyAgAhgwIBALECACGEAhAA5gIAIQMAAAADACABAADPAQAwJQAA0AEAIAMAAAADACABAAAEADACAAAFACABAAAAKQAgAQAAACkAIAMAAAALACABAAAoADACAAApACADAAAACwAgAQAAKAAwAgAAKQAgAwAAAAsAIAEAACgAMAIAACkAIAwDAADsBAAgBQAAwQQAIAYAAMIEACAHAADDBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAHzAQEAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQEZAADYAQAgCM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB8wEBAAAAAfQBAQAAAAH2AQAAAPYBAvcBEAAAAAEBGQAA2gEAMAEZAADaAQAwDAMAAOsEACAFAAChBAAgBgAAogQAIAcAAKMEACDPAQEAswMAIdcBAACfBPkBItgBQAC2AwAh2QFAALYDACHzAQEAswMAIfQBAQCzAwAh9gEAAJ0E9gEi9wEQAJ4EACECAAAAKQAgGQAA3QEAIAjPAQEAswMAIdcBAACfBPkBItgBQAC2AwAh2QFAALYDACHzAQEAswMAIfQBAQCzAwAh9gEAAJ0E9gEi9wEQAJ4EACECAAAACwAgGQAA3wEAIAIAAAALACAZAADfAQAgAwAAACkAICAAANgBACAhAADdAQAgAQAAACkAIAEAAAALACAFCAAA5gQAICYAAOcEACAnAADqBAAgKAAA6QQAICkAAOgEACALzAEAANkCADDNAQAA5gEAEM4BAADZAgAwzwEBALECACHXAQAA3AL5ASLYAUAAtAIAIdkBQAC0AgAh8wEBALECACH0AQEAsQIAIfYBAADaAvYBIvcBEADbAgAhAwAAAAsAIAEAAOUBADAlAADmAQAgAwAAAAsAIAEAACgAMAIAACkAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgBgQAAOUEACDPAQEAAAAB2AFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAQEZAADuAQAgBc8BAQAAAAHYAUAAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAABARkAAPABADABGQAA8AEAMAYEAADkBAAgzwEBALMDACHYAUAAtgMAIfABAQCzAwAh8QEBALMDACHyAQEAswMAIQIAAAAPACAZAADzAQAgBc8BAQCzAwAh2AFAALYDACHwAQEAswMAIfEBAQCzAwAh8gEBALMDACECAAAADQAgGQAA9QEAIAIAAAANACAZAAD1AQAgAwAAAA8AICAAAO4BACAhAADzAQAgAQAAAA8AIAEAAAANACADCAAA4QQAICgAAOMEACApAADiBAAgCMwBAADYAgAwzQEAAPwBABDOAQAA2AIAMM8BAQCxAgAh2AFAALQCACHwAQEAsQIAIfEBAQCxAgAh8gEBALECACEDAAAADQAgAQAA-wEAMCUAAPwBACADAAAADQAgAQAADgAwAgAADwAgEQcAANUCACAKAADTAgAgCwAA1AIAIA0AANYCACAQAADXAgAgzAEAAM4CADDNAQAAggIAEM4BAADOAgAwzwEBAAAAAdcBAADSAu0BItgBQADCAgAh2QFAAMICACHlAQEAAAAB5gEBAMACACHoAQAA0ALoASLqAQAA0QLqASLrAQEAAAABAQAAAP8BACABAAAA_wEAIBEHAADVAgAgCgAA0wIAIAsAANQCACANAADWAgAgEAAA1wIAIMwBAADOAgAwzQEAAIICABDOAQAAzgIAMM8BAQDPAgAh1wEAANIC7QEi2AFAAMICACHZAUAAwgIAIeUBAQDPAgAh5gEBAMACACHoAQAA0ALoASLqAQAA0QLqASLrAQEAwAIAIQcHAADeBAAgCgAA3AQAIAsAAN0EACANAADfBAAgEAAA4AQAIOYBAACvAwAg6wEAAK8DACADAAAAggIAIAEAAIMCADACAAD_AQAgAwAAAIICACABAACDAgAwAgAA_wEAIAMAAACCAgAgAQAAgwIAMAIAAP8BACAOBwAA2QQAIAoAANcEACALAADYBAAgDQAA2gQAIBAAANsEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAEBGQAAhwIAIAnPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAEBGQAAiQIAMAEZAACJAgAwDgcAAMIDACAKAADAAwAgCwAAwQMAIA0AAMMDACAQAADEAwAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhAgAAAP8BACAZAACMAgAgCc8BAQCzAwAh1wEAAL8D7QEi2AFAALYDACHZAUAAtgMAIeUBAQCzAwAh5gEBALQDACHoAQAAvQPoASLqAQAAvgPqASLrAQEAtAMAIQIAAACCAgAgGQAAjgIAIAIAAACCAgAgGQAAjgIAIAMAAAD_AQAgIAAAhwIAICEAAIwCACABAAAA_wEAIAEAAACCAgAgBQgAALoDACAoAAC8AwAgKQAAuwMAIOYBAACvAwAg6wEAAK8DACAMzAEAAMQCADDNAQAAlQIAEM4BAADEAgAwzwEBALECACHXAQAAxwLtASLYAUAAtAIAIdkBQAC0AgAh5QEBALECACHmAQEAsgIAIegBAADFAugBIuoBAADGAuoBIusBAQCyAgAhAwAAAIICACABAACUAgAwJQAAlQIAIAMAAACCAgAgAQAAgwIAMAIAAP8BACAOCQAAwwIAIMwBAAC_AgAwzQEAACAAEM4BAAC_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_AgAwzQEAACAAEM4BAAC_AgAwzwEBAM8CACHQAQEAzwIAIdEBAQDAAgAh0gEBAMACACHTAQEAwAIAIdQBAQDAAgAh1QEBAMACACHXAQAAwQLXASLYAUAAwgIAIdkBQADCAgAhqgIAACAAIKsCAAAgACAIzAEAANgCADDNAQAA_AEAEM4BAADYAgAwzwEBALECACHYAUAAtAIAIfABAQCxAgAh8QEBALECACHyAQEAsQIAIQvMAQAA2QIAMM0BAADmAQAQzgEAANkCADDPAQEAsQIAIdcBAADcAvkBItgBQAC0AgAh2QFAALQCACHzAQEAsQIAIfQBAQCxAgAh9gEAANoC9gEi9wEQANsCACEHCAAAtgIAICgAAOICACApAADiAgAg2gEAAAD2AQLbAQAAAPYBCNwBAAAA9gEI4QEAAOEC9gEiDQgAALYCACAmAADgAgAgJwAA4AIAICgAAOACACApAADgAgAg2gEQAAAAAdsBEAAAAATcARAAAAAE3QEQAAAAAd4BEAAAAAHfARAAAAAB4AEQAAAAAeEBEADfAgAhBwgAALYCACAoAADeAgAgKQAA3gIAINoBAAAA-QEC2wEAAAD5AQjcAQAAAPkBCOEBAADdAvkBIgcIAAC2AgAgKAAA3gIAICkAAN4CACDaAQAAAPkBAtsBAAAA-QEI3AEAAAD5AQjhAQAA3QL5ASIE2gEAAAD5AQLbAQAAAPkBCNwBAAAA-QEI4QEAAN4C-QEiDQgAALYCACAmAADgAgAgJwAA4AIAICgAAOACACApAADgAgAg2gEQAAAAAdsBEAAAAATcARAAAAAE3QEQAAAAAd4BEAAAAAHfARAAAAAB4AEQAAAAAeEBEADfAgAhCNoBEAAAAAHbARAAAAAE3AEQAAAABN0BEAAAAAHeARAAAAAB3wEQAAAAAeABEAAAAAHhARAA4AIAIQcIAAC2AgAgKAAA4gIAICkAAOICACDaAQAAAPYBAtsBAAAA9gEI3AEAAAD2AQjhAQAA4QL2ASIE2gEAAAD2AQLbAQAAAPYBCNwBAAAA9gEI4QEAAOIC9gEiEswBAADjAgAwzQEAANABABDOAQAA4wIAMM8BAQCxAgAh2AFAALQCACHZAUAAtAIAIfkBAQCxAgAh-gEBALECACH7AQEAsQIAIfwBAQCxAgAh_QEBALICACH-AQgA5AIAIf8BCADkAgAhgAICAOUCACGBAgEAsgIAIYICAQCyAgAhgwIBALECACGEAhAA5gIAIQ0IAAC7AgAgJgAA6gIAICcAAOoCACAoAADqAgAgKQAA6gIAINoBCAAAAAHbAQgAAAAF3AEIAAAABd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCAAAAAHhAQgA6wIAIQ0IAAC7AgAgJgAA6gIAICcAALsCACAoAAC7AgAgKQAAuwIAINoBAgAAAAHbAQIAAAAF3AECAAAABd0BAgAAAAHeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIA6QIAIQ0IAAC7AgAgJgAA6AIAICcAAOgCACAoAADoAgAgKQAA6AIAINoBEAAAAAHbARAAAAAF3AEQAAAABd0BEAAAAAHeARAAAAAB3wEQAAAAAeABEAAAAAHhARAA5wIAIQ0IAAC7AgAgJgAA6AIAICcAAOgCACAoAADoAgAgKQAA6AIAINoBEAAAAAHbARAAAAAF3AEQAAAABd0BEAAAAAHeARAAAAAB3wEQAAAAAeABEAAAAAHhARAA5wIAIQjaARAAAAAB2wEQAAAABdwBEAAAAAXdARAAAAAB3gEQAAAAAd8BEAAAAAHgARAAAAAB4QEQAOgCACENCAAAuwIAICYAAOoCACAnAAC7AgAgKAAAuwIAICkAALsCACDaAQIAAAAB2wECAAAABdwBAgAAAAXdAQIAAAAB3gECAAAAAd8BAgAAAAHgAQIAAAAB4QECAOkCACEI2gEIAAAAAdsBCAAAAAXcAQgAAAAF3QEIAAAAAd4BCAAAAAHfAQgAAAAB4AEIAAAAAeEBCADqAgAhDQgAALsCACAmAADqAgAgJwAA6gIAICgAAOoCACApAADqAgAg2gEIAAAAAdsBCAAAAAXcAQgAAAAF3QEIAAAAAd4BCAAAAAHfAQgAAAAB4AEIAAAAAeEBCADrAgAhDcwBAADsAgAwzQEAALoBABDOAQAA7AIAMM8BAQCxAgAh0AEBALECACHYAUAAtAIAIdkBQAC0AgAhhQIBALECACGGAgEAsgIAIYcCAQCyAgAhiQIAAO0CiQIjigIBALICACGLAgEAsgIAIQcIAAC7AgAgKAAA7wIAICkAAO8CACDaAQAAAIkCA9sBAAAAiQIJ3AEAAACJAgnhAQAA7gKJAiMHCAAAuwIAICgAAO8CACApAADvAgAg2gEAAACJAgPbAQAAAIkCCdwBAAAAiQIJ4QEAAO4CiQIjBNoBAAAAiQID2wEAAACJAgncAQAAAIkCCeEBAADvAokCIw4JAADDAgAgzAEAAPACADDNAQAAFgAQzgEAAPACADDPAQEAzwIAIdABAQDPAgAh2AFAAMICACHZAUAAwgIAIYUCAQDPAgAhhgIBAMACACGHAgEAwAIAIYkCAADxAokCI4oCAQDAAgAhiwIBAMACACEE2gEAAACJAgPbAQAAAIkCCdwBAAAAiQIJ4QEAAO8CiQIjDcwBAADyAgAwzQEAAKIBABDOAQAA8gIAMM8BAQCxAgAh1wEAAPYClAIi2AFAALQCACHZAUAAtAIAIYwCAQCxAgAhjQIBALECACGOAgEAsQIAIY8CCADzAgAhkQIAAPQCkQIjkgIAAPUCACANCAAAtgIAICYAAP0CACAnAAD9AgAgKAAA_QIAICkAAP0CACDaAQgAAAAB2wEIAAAABNwBCAAAAATdAQgAAAAB3gEIAAAAAd8BCAAAAAHgAQgAAAAB4QEIAPwCACEHCAAAuwIAICgAAPsCACApAAD7AgAg2gEAAACRAgPbAQAAAJECCdwBAAAAkQIJ4QEAAPoCkQIjDwgAALsCACAoAAD5AgAgKQAA-QIAINoBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAHgAYAAAAAB4QGAAAAAAZQCAQAAAAGVAgEAAAABlgIBAAAAAZcCgAAAAAGYAoAAAAABmQKAAAAAAQcIAAC2AgAgKAAA-AIAICkAAPgCACDaAQAAAJQCAtsBAAAAlAII3AEAAACUAgjhAQAA9wKUAiIHCAAAtgIAICgAAPgCACApAAD4AgAg2gEAAACUAgLbAQAAAJQCCNwBAAAAlAII4QEAAPcClAIiBNoBAAAAlAIC2wEAAACUAgjcAQAAAJQCCOEBAAD4ApQCIgzaAYAAAAAB3QGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAeEBgAAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAoAAAAABmAKAAAAAAZkCgAAAAAEHCAAAuwIAICgAAPsCACApAAD7AgAg2gEAAACRAgPbAQAAAJECCdwBAAAAkQIJ4QEAAPoCkQIjBNoBAAAAkQID2wEAAACRAgncAQAAAJECCeEBAAD7ApECIw0IAAC2AgAgJgAA_QIAICcAAP0CACAoAAD9AgAgKQAA_QIAINoBCAAAAAHbAQgAAAAE3AEIAAAABN0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCAAAAAHhAQgA_AIAIQjaAQgAAAAB2wEIAAAABNwBCAAAAATdAQgAAAAB3gEIAAAAAd8BCAAAAAHgAQgAAAAB4QEIAP0CACEKzAEAAP4CADDNAQAAjAEAEM4BAAD-AgAwzwEBALECACHYAUAAtAIAIdkBQAC0AgAh8AEBALECACH6AQEAsQIAIf0BAQCxAgAhmgIgAP8CACEFCAAAtgIAICgAAIEDACApAACBAwAg2gEgAAAAAeEBIACAAwAhBQgAALYCACAoAACBAwAgKQAAgQMAINoBIAAAAAHhASAAgAMAIQLaASAAAAAB4QEgAIEDACELBAAAhAMAIMwBAACCAwAwzQEAABEAEM4BAACCAwAwzwEBAM8CACHYAUAAwgIAIdkBQADCAgAh8AEBAM8CACH6AQEAzwIAIf0BAQDPAgAhmgIgAIMDACEC2gEgAAAAAeEBIACBAwAhEQMAAJsDACAFAACcAwAgBgAAnQMAIAcAANUCACDMAQAAlwMAMM0BAAALABDOAQAAlwMAMM8BAQDPAgAh1wEAAJoD-QEi2AFAAMICACHZAUAAwgIAIfMBAQDPAgAh9AEBAM8CACH2AQAAmAP2ASL3ARAAmQMAIaoCAAALACCrAgAACwAgDcwBAACFAwAwzQEAAHQAEM4BAACFAwAwzwEBALECACHXAQAAhgOiAiLYAUAAtAIAIdkBQAC0AgAhmwIBALECACGcAkAAtAIAIZ0CQAC0AgAhngIIAPMCACGfAggA8wIAIaACIAD_AgAhBwgAALYCACAoAACIAwAgKQAAiAMAINoBAAAAogIC2wEAAACiAgjcAQAAAKICCOEBAACHA6ICIgcIAAC2AgAgKAAAiAMAICkAAIgDACDaAQAAAKICAtsBAAAAogII3AEAAACiAgjhAQAAhwOiAiIE2gEAAACiAgLbAQAAAKICCNwBAAAAogII4QEAAIgDogIiDwwAAIwDACANAADWAgAgzAEAAIkDADDNAQAAJQAQzgEAAIkDADDPAQEAzwIAIdcBAACLA6ICItgBQADCAgAh2QFAAMICACGbAgEAzwIAIZwCQADCAgAhnQJAAMICACGeAggAigMAIZ8CCACKAwAhoAIgAIMDACEI2gEIAAAAAdsBCAAAAATcAQgAAAAE3QEIAAAAAd4BCAAAAAHfAQgAAAAB4AEIAAAAAeEBCAD9AgAhBNoBAAAAogIC2wEAAACiAgjcAQAAAKICCOEBAACIA6ICIhADAACoAwAgBAAApgMAIA4AAKcDACAPAADDAgAgzAEAAKQDADDNAQAABwAQzgEAAKQDADDPAQEAzwIAIdcBAAClA6MCItgBQADCAgAh2QFAAMICACHwAQEAwAIAIfMBAQDAAgAhjQIBAM8CACGqAgAABwAgqwIAAAcAIArMAQAAjQMAMM0BAABcABDOAQAAjQMAMM8BAQCxAgAh1wEAAI4DowIi2AFAALQCACHZAUAAtAIAIfABAQCyAgAh8wEBALICACGNAgEAsQIAIQcIAAC2AgAgKAAAkAMAICkAAJADACDaAQAAAKMCAtsBAAAAowII3AEAAACjAgjhAQAAjwOjAiIHCAAAtgIAICgAAJADACApAACQAwAg2gEAAACjAgLbAQAAAKMCCNwBAAAAowII4QEAAI8DowIiBNoBAAAAowIC2wEAAACjAgjcAQAAAKMCCOEBAACQA6MCIg3MAQAAkQMAMM0BAABCABDOAQAAkQMAMM8BAQCxAgAh2AFAALQCACHZAUAAtAIAIf0BAQCyAgAhowIBALECACGkAgEAsQIAIaUCAQCyAgAhpgIBALICACGnAiAA_wIAIagCAgCSAwAhDQgAALYCACAmAAD9AgAgJwAAtgIAICgAALYCACApAAC2AgAg2gECAAAAAdsBAgAAAATcAQIAAAAE3QECAAAAAd4BAgAAAAHfAQIAAAAB4AECAAAAAeEBAgCTAwAhDQgAALYCACAmAAD9AgAgJwAAtgIAICgAALYCACApAAC2AgAg2gECAAAAAdsBAgAAAATcAQIAAAAE3QECAAAAAd4BAgAAAAHfAQIAAAAB4AECAAAAAeEBAgCTAwAhDgsAANQCACDMAQAAlAMAMM0BAAAvABDOAQAAlAMAMM8BAQDPAgAh2AFAAMICACHZAUAAwgIAIf0BAQDAAgAhowIBAM8CACGkAgEAzwIAIaUCAQDAAgAhpgIBAMACACGnAiAAgwMAIagCAgCVAwAhCNoBAgAAAAHbAQIAAAAE3AECAAAABN0BAgAAAAHeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAtgIAIQLzAQEAAAAB9AEBAAAAAQ8DAACbAwAgBQAAnAMAIAYAAJ0DACAHAADVAgAgzAEAAJcDADDNAQAACwAQzgEAAJcDADDPAQEAzwIAIdcBAACaA_kBItgBQADCAgAh2QFAAMICACHzAQEAzwIAIfQBAQDPAgAh9gEAAJgD9gEi9wEQAJkDACEE2gEAAAD2AQLbAQAAAPYBCNwBAAAA9gEI4QEAAOIC9gEiCNoBEAAAAAHbARAAAAAE3AEQAAAABN0BEAAAAAHeARAAAAAB3wEQAAAAAeABEAAAAAHhARAA4AIAIQTaAQAAAPkBAtsBAAAA-QEI3AEAAAD5AQjhAQAA3gL5ASIYBwAA1QIAIBEAAK0DACASAADDAgAgEwAArgMAIMwBAACpAwAwzQEAAAMAEM4BAACpAwAwzwEBAM8CACHYAUAAwgIAIdkBQADCAgAh-QEBAM8CACH6AQEAzwIAIfsBAQDPAgAh_AEBAM8CACH9AQEAwAIAIf4BCACqAwAh_wEIAKoDACGAAgIAqwMAIYECAQDAAgAhggIBAMACACGDAgEAzwIAIYQCEACsAwAhqgIAAAMAIKsCAAADACAD7QEAAA0AIO4BAAANACDvAQAADQAgDQQAAIQDACDMAQAAggMAMM0BAAARABDOAQAAggMAMM8BAQDPAgAh2AFAAMICACHZAUAAwgIAIfABAQDPAgAh-gEBAM8CACH9AQEAzwIAIZoCIACDAwAhqgIAABEAIKsCAAARACAPDgAAogMAIA8AAMMCACDMAQAAngMAMM0BAAAaABDOAQAAngMAMM8BAQDPAgAh1wEAAKEDlAIi2AFAAMICACHZAUAAwgIAIYwCAQDPAgAhjQIBAM8CACGOAgEAzwIAIY8CCACKAwAhkQIAAJ8DkQIjkgIAAKADACAE2gEAAACRAgPbAQAAAJECCdwBAAAAkQIJ4QEAAPsCkQIjDNoBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAHgAYAAAAAB4QGAAAAAAZQCAQAAAAGVAgEAAAABlgIBAAAAAZcCgAAAAAGYAoAAAAABmQKAAAAAAQTaAQAAAJQCAtsBAAAAlAII3AEAAACUAgjhAQAA-AKUAiIRDAAAjAMAIA0AANYCACDMAQAAiQMAMM0BAAAlABDOAQAAiQMAMM8BAQDPAgAh1wEAAIsDogIi2AFAAMICACHZAUAAwgIAIZsCAQDPAgAhnAJAAMICACGdAkAAwgIAIZ4CCACKAwAhnwIIAIoDACGgAiAAgwMAIaoCAAAlACCrAgAAJQAgCQQAAIQDACDMAQAAowMAMM0BAAANABDOAQAAowMAMM8BAQDPAgAh2AFAAMICACHwAQEAzwIAIfEBAQDPAgAh8gEBAM8CACEOAwAAqAMAIAQAAKYDACAOAACnAwAgDwAAwwIAIMwBAACkAwAwzQEAAAcAEM4BAACkAwAwzwEBAM8CACHXAQAApQOjAiLYAUAAwgIAIdkBQADCAgAh8AEBAMACACHzAQEAwAIAIY0CAQDPAgAhBNoBAAAAowIC2wEAAACjAgjcAQAAAKMCCOEBAACQA6MCIhEDAACbAwAgBQAAnAMAIAYAAJ0DACAHAADVAgAgzAEAAJcDADDNAQAACwAQzgEAAJcDADDPAQEAzwIAIdcBAACaA_kBItgBQADCAgAh2QFAAMICACHzAQEAzwIAIfQBAQDPAgAh9gEAAJgD9gEi9wEQAJkDACGqAgAACwAgqwIAAAsAIBEMAACMAwAgDQAA1gIAIMwBAACJAwAwzQEAACUAEM4BAACJAwAwzwEBAM8CACHXAQAAiwOiAiLYAUAAwgIAIdkBQADCAgAhmwIBAM8CACGcAkAAwgIAIZ0CQADCAgAhngIIAIoDACGfAggAigMAIaACIACDAwAhqgIAACUAIKsCAAAlACAYBwAA1QIAIBEAAK0DACASAADDAgAgEwAArgMAIMwBAACpAwAwzQEAAAMAEM4BAACpAwAwzwEBAM8CACHYAUAAwgIAIdkBQADCAgAh-QEBAM8CACH6AQEAzwIAIfsBAQDPAgAh_AEBAM8CACH9AQEAwAIAIf4BCACqAwAh_wEIAKoDACGAAgIAqwMAIYECAQDAAgAhggIBAMACACGDAgEAzwIAIYQCEACsAwAhqgIAAAMAIKsCAAADACAWBwAA1QIAIBEAAK0DACASAADDAgAgEwAArgMAIMwBAACpAwAwzQEAAAMAEM4BAACpAwAwzwEBAM8CACHYAUAAwgIAIdkBQADCAgAh-QEBAM8CACH6AQEAzwIAIfsBAQDPAgAh_AEBAM8CACH9AQEAwAIAIf4BCACqAwAh_wEIAKoDACGAAgIAqwMAIYECAQDAAgAhggIBAMACACGDAgEAzwIAIYQCEACsAwAhCNoBCAAAAAHbAQgAAAAF3AEIAAAABd0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCAAAAAHhAQgA6gIAIQjaAQIAAAAB2wECAAAABdwBAgAAAAXdAQIAAAAB3gECAAAAAd8BAgAAAAHgAQIAAAAB4QECALsCACEI2gEQAAAAAdsBEAAAAAXcARAAAAAF3QEQAAAAAd4BEAAAAAHfARAAAAAB4AEQAAAAAeEBEADoAgAhEAsAANQCACDMAQAAlAMAMM0BAAAvABDOAQAAlAMAMM8BAQDPAgAh2AFAAMICACHZAUAAwgIAIf0BAQDAAgAhowIBAM8CACGkAgEAzwIAIaUCAQDAAgAhpgIBAMACACGnAiAAgwMAIagCAgCVAwAhqgIAAC8AIKsCAAAvACAD7QEAAAsAIO4BAAALACDvAQAACwAgAAAAAAGyAgEAAAABAbICAQAAAAEBsgIAAADXAQIBsgJAAAAAAQUgAADrBQAgIQAA7gUAIKwCAADsBQAgrQIAAO0FACCwAgAA_wEAIAMgAADrBQAgrAIAAOwFACCwAgAA_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_wMAIA4AAIAEACDPAQEAAAAB1wEAAACjAgLYAUAAAAAB2QFAAAAAAfABAQAAAAHzAQEAAAABAgAAAAkAICAAAP4DACADAAAACQAgIAAA_gMAICEAAOYDACABGQAA5AUAMA4DAACoAwAgBAAApgMAIA4AAKcDACAPAADDAgAgzAEAAKQDADDNAQAABwAQzgEAAKQDADDPAQEAAAAB1wEAAKUDowIi2AFAAMICACHZAUAAwgIAIfABAQDAAgAh8wEBAMACACGNAgEAzwIAIQIAAAAJACAZAADmAwAgAgAAAOMDACAZAADkAwAgCswBAADiAwAwzQEAAOMDABDOAQAA4gMAMM8BAQDPAgAh1wEAAKUDowIi2AFAAMICACHZAUAAwgIAIfABAQDAAgAh8wEBAMACACGNAgEAzwIAIQrMAQAA4gMAMM0BAADjAwAQzgEAAOIDADDPAQEAzwIAIdcBAAClA6MCItgBQADCAgAh2QFAAMICACHwAQEAwAIAIfMBAQDAAgAhjQIBAM8CACEGzwEBALMDACHXAQAA5QOjAiLYAUAAtgMAIdkBQAC2AwAh8AEBALQDACHzAQEAtAMAIQGyAgAAAKMCAgkDAADpAwAgBAAA5wMAIA4AAOgDACDPAQEAswMAIdcBAADlA6MCItgBQAC2AwAh2QFAALYDACHwAQEAtAMAIfMBAQC0AwAhByAAANYFACAhAADiBQAgrAIAANcFACCtAgAA4QUAIK4CAAALACCvAgAACwAgsAIAACkAIAcgAADqAwAgIQAA7QMAIKwCAADrAwAgrQIAAOwDACCuAgAAJQAgrwIAACUAILACAABfACAHIAAA1AUAICEAAN8FACCsAgAA1QUAIK0CAADeBQAgrgIAAAMAIK8CAAADACCwAgAABQAgCg0AAP0DACDPAQEAAAAB1wEAAACiAgLYAUAAAAAB2QFAAAAAAZwCQAAAAAGdAkAAAAABngIIAAAAAZ8CCAAAAAGgAiAAAAABAgAAAF8AICAAAOoDACADAAAAJQAgIAAA6gMAICEAAO4DACAMAAAAJQAgDQAA8QMAIBkAAO4DACDPAQEAswMAIdcBAADwA6ICItgBQAC2AwAh2QFAALYDACGcAkAAtgMAIZ0CQAC2AwAhngIIANQDACGfAggA1AMAIaACIADvAwAhCg0AAPEDACDPAQEAswMAIdcBAADwA6ICItgBQAC2AwAh2QFAALYDACGcAkAAtgMAIZ0CQAC2AwAhngIIANQDACGfAggA1AMAIaACIADvAwAhAbICIAAAAAEBsgIAAACiAgILIAAA8gMAMCEAAPYDADCsAgAA8wMAMK0CAAD0AwAwrgIAAM4DADCvAgAAzgMAMLACAADOAwAwsQIAAPUDACCyAgAAzgMAMLMCAAD3AwAwtAIAANEDADAKDwAA_AMAIM8BAQAAAAHXAQAAAJQCAtgBQAAAAAHZAUAAAAABjQIBAAAAAY4CAQAAAAGPAggAAAABkQIAAACRAgOSAoAAAAABAgAAABwAICAAAPsDACADAAAAHAAgIAAA-wMAICEAAPkDACABGQAA3QUAMAIAAAAcACAZAAD5AwAgAgAAANIDACAZAAD4AwAgCc8BAQCzAwAh1wEAANYDlAIi2AFAALYDACHZAUAAtgMAIY0CAQCzAwAhjgIBALMDACGPAggA1AMAIZECAADVA5ECI5ICgAAAAAEKDwAA-gMAIM8BAQCzAwAh1wEAANYDlAIi2AFAALYDACHZAUAAtgMAIY0CAQCzAwAhjgIBALMDACGPAggA1AMAIZECAADVA5ECI5ICgAAAAAEFIAAA2AUAICEAANsFACCsAgAA2QUAIK0CAADaBQAgsAIAAP8BACAKDwAA_AMAIM8BAQAAAAHXAQAAAJQCAtgBQAAAAAHZAUAAAAABjQIBAAAAAY4CAQAAAAGPAggAAAABkQIAAACRAgOSAoAAAAABAyAAANgFACCsAgAA2QUAILACAAD_AQAgBCAAAPIDADCsAgAA8wMAMLACAADOAwAwsQIAAPUDACAJAwAAgQQAIAQAAP8DACAOAACABAAgzwEBAAAAAdcBAAAAowIC2AFAAAAAAdkBQAAAAAHwAQEAAAAB8wEBAAAAAQMgAADWBQAgrAIAANcFACCwAgAAKQAgAyAAAOoDACCsAgAA6wMAILACAABfACADIAAA1AUAIKwCAADVBQAgsAIAAAUAIBEHAADOBAAgEQAAzwQAIBMAANAEACDPAQEAAAAB2AFAAAAAAdkBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIQAAAAAQIAAAAFACAgAADNBAAgAwAAAAUAICAAAM0EACAhAACPBAAgARkAANMFADAWBwAA1QIAIBEAAK0DACASAADDAgAgEwAArgMAIMwBAACpAwAwzQEAAAMAEM4BAACpAwAwzwEBAAAAAdgBQADCAgAh2QFAAMICACH5AQEAzwIAIfoBAQDPAgAh-wEBAM8CACH8AQEAzwIAIf0BAQDAAgAh_gEIAKoDACH_AQgAqgMAIYACAgCrAwAhgQIBAMACACGCAgEAwAIAIYMCAQDPAgAhhAIQAKwDACECAAAABQAgGQAAjwQAIAIAAACKBAAgGQAAiwQAIBLMAQAAiQQAMM0BAACKBAAQzgEAAIkEADDPAQEAzwIAIdgBQADCAgAh2QFAAMICACH5AQEAzwIAIfoBAQDPAgAh-wEBAM8CACH8AQEAzwIAIf0BAQDAAgAh_gEIAKoDACH_AQgAqgMAIYACAgCrAwAhgQIBAMACACGCAgEAwAIAIYMCAQDPAgAhhAIQAKwDACESzAEAAIkEADDNAQAAigQAEM4BAACJBAAwzwEBAM8CACHYAUAAwgIAIdkBQADCAgAh-QEBAM8CACH6AQEAzwIAIfsBAQDPAgAh_AEBAM8CACH9AQEAwAIAIf4BCACqAwAh_wEIAKoDACGAAgIAqwMAIYECAQDAAgAhggIBAMACACGDAgEAzwIAIYQCEACsAwAhDs8BAQCzAwAh2AFAALYDACHZAUAAtgMAIfoBAQCzAwAh-wEBALMDACH8AQEAswMAIf0BAQC0AwAh_gEIAIwEACH_AQgAjAQAIYACAgCNBAAhgQIBALQDACGCAgEAtAMAIYMCAQCzAwAhhAIQAI4EACEFsgIIAAAAAbUCCAAAAAG2AggAAAABtwIIAAAAAbgCCAAAAAEFsgICAAAAAbUCAgAAAAG2AgIAAAABtwICAAAAAbgCAgAAAAEFsgIQAAAAAbUCEAAAAAG2AhAAAAABtwIQAAAAAbgCEAAAAAERBwAAkAQAIBEAAJEEACATAACSBAAgzwEBALMDACHYAUAAtgMAIdkBQAC2AwAh-gEBALMDACH7AQEAswMAIfwBAQCzAwAh_QEBALQDACH-AQgAjAQAIf8BCACMBAAhgAICAI0EACGBAgEAtAMAIYICAQC0AwAhgwIBALMDACGEAhAAjgQAIQsgAADEBAAwIQAAyAQAMKwCAADFBAAwrQIAAMYEADCuAgAA3wMAMK8CAADfAwAwsAIAAN8DADCxAgAAxwQAILICAADfAwAwswIAAMkEADC0AgAA4gMAMAUgAADFBQAgIQAA0QUAIKwCAADGBQAgrQIAANAFACCwAgAAAQAgCyAAAJMEADAhAACYBAAwrAIAAJQEADCtAgAAlQQAMK4CAACXBAAwrwIAAJcEADCwAgAAlwQAMLECAACWBAAgsgIAAJcEADCzAgAAmQQAMLQCAACaBAAwCgUAAMEEACAGAADCBAAgBwAAwwQAIM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQIAAAApACAgAADABAAgAwAAACkAICAAAMAEACAhAACgBAAgARkAAM8FADAQAwAAmwMAIAUAAJwDACAGAACdAwAgBwAA1QIAIMwBAACXAwAwzQEAAAsAEM4BAACXAwAwzwEBAAAAAdcBAACaA_kBItgBQADCAgAh2QFAAMICACHzAQEAzwIAIfQBAQDPAgAh9gEAAJgD9gEi9wEQAJkDACGpAgAAlgMAIAIAAAApACAZAACgBAAgAgAAAJsEACAZAACcBAAgC8wBAACaBAAwzQEAAJsEABDOAQAAmgQAMM8BAQDPAgAh1wEAAJoD-QEi2AFAAMICACHZAUAAwgIAIfMBAQDPAgAh9AEBAM8CACH2AQAAmAP2ASL3ARAAmQMAIQvMAQAAmgQAMM0BAACbBAAQzgEAAJoEADDPAQEAzwIAIdcBAACaA_kBItgBQADCAgAh2QFAAMICACHzAQEAzwIAIfQBAQDPAgAh9gEAAJgD9gEi9wEQAJkDACEHzwEBALMDACHXAQAAnwT5ASLYAUAAtgMAIdkBQAC2AwAh9AEBALMDACH2AQAAnQT2ASL3ARAAngQAIQGyAgAAAPYBAgWyAhAAAAABtQIQAAAAAbYCEAAAAAG3AhAAAAABuAIQAAAAAQGyAgAAAPkBAgoFAAChBAAgBgAAogQAIAcAAKMEACDPAQEAswMAIdcBAACfBPkBItgBQAC2AwAh2QFAALYDACH0AQEAswMAIfYBAACdBPYBIvcBEACeBAAhCyAAALQEADAhAAC5BAAwrAIAALUEADCtAgAAtgQAMK4CAAC4BAAwrwIAALgEADCwAgAAuAQAMLECAAC3BAAgsgIAALgEADCzAgAAugQAMLQCAAC7BAAwByAAAK8EACAhAACyBAAgrAIAALAEACCtAgAAsQQAIK4CAAARACCvAgAAEQAgsAIAAHcAIAsgAACkBAAwIQAAqAQAMKwCAAClBAAwrQIAAKYEADCuAgAA3wMAMK8CAADfAwAwsAIAAN8DADCxAgAApwQAILICAADfAwAwswIAAKkEADC0AgAA4gMAMAkDAACBBAAgDgAAgAQAIA8AAK4EACDPAQEAAAAB1wEAAACjAgLYAUAAAAAB2QFAAAAAAfMBAQAAAAGNAgEAAAABAgAAAAkAICAAAK0EACADAAAACQAgIAAArQQAICEAAKsEACABGQAAzgUAMAIAAAAJACAZAACrBAAgAgAAAOMDACAZAACqBAAgBs8BAQCzAwAh1wEAAOUDowIi2AFAALYDACHZAUAAtgMAIfMBAQC0AwAhjQIBALMDACEJAwAA6QMAIA4AAOgDACAPAACsBAAgzwEBALMDACHXAQAA5QOjAiLYAUAAtgMAIdkBQAC2AwAh8wEBALQDACGNAgEAswMAIQUgAADJBQAgIQAAzAUAIKwCAADKBQAgrQIAAMsFACCwAgAA_wEAIAkDAACBBAAgDgAAgAQAIA8AAK4EACDPAQEAAAAB1wEAAACjAgLYAUAAAAAB2QFAAAAAAfMBAQAAAAGNAgEAAAABAyAAAMkFACCsAgAAygUAILACAAD_AQAgBs8BAQAAAAHYAUAAAAAB2QFAAAAAAfoBAQAAAAH9AQEAAAABmgIgAAAAAQIAAAB3ACAgAACvBAAgAwAAABEAICAAAK8EACAhAACzBAAgCAAAABEAIBkAALMEACDPAQEAswMAIdgBQAC2AwAh2QFAALYDACH6AQEAswMAIf0BAQCzAwAhmgIgAO8DACEGzwEBALMDACHYAUAAtgMAIdkBQAC2AwAh-gEBALMDACH9AQEAswMAIZoCIADvAwAhBM8BAQAAAAHYAUAAAAAB8QEBAAAAAfIBAQAAAAECAAAADwAgIAAAvwQAIAMAAAAPACAgAAC_BAAgIQAAvgQAIAEZAADIBQAwCQQAAIQDACDMAQAAowMAMM0BAAANABDOAQAAowMAMM8BAQAAAAHYAUAAwgIAIfABAQDPAgAh8QEBAM8CACHyAQEAzwIAIQIAAAAPACAZAAC-BAAgAgAAALwEACAZAAC9BAAgCMwBAAC7BAAwzQEAALwEABDOAQAAuwQAMM8BAQDPAgAh2AFAAMICACHwAQEAzwIAIfEBAQDPAgAh8gEBAM8CACEIzAEAALsEADDNAQAAvAQAEM4BAAC7BAAwzwEBAM8CACHYAUAAwgIAIfABAQDPAgAh8QEBAM8CACHyAQEAzwIAIQTPAQEAswMAIdgBQAC2AwAh8QEBALMDACHyAQEAswMAIQTPAQEAswMAIdgBQAC2AwAh8QEBALMDACHyAQEAswMAIQTPAQEAAAAB2AFAAAAAAfEBAQAAAAHyAQEAAAABCgUAAMEEACAGAADCBAAgBwAAwwQAIM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQQgAAC0BAAwrAIAALUEADCwAgAAuAQAMLECAAC3BAAgAyAAAK8EACCsAgAAsAQAILACAAB3ACAEIAAApAQAMKwCAAClBAAwsAIAAN8DADCxAgAApwQAIAkEAAD_AwAgDgAAgAQAIA8AAK4EACDPAQEAAAAB1wEAAACjAgLYAUAAAAAB2QFAAAAAAfABAQAAAAGNAgEAAAABAgAAAAkAICAAAMwEACADAAAACQAgIAAAzAQAICEAAMsEACABGQAAxwUAMAIAAAAJACAZAADLBAAgAgAAAOMDACAZAADKBAAgBs8BAQCzAwAh1wEAAOUDowIi2AFAALYDACHZAUAAtgMAIfABAQC0AwAhjQIBALMDACEJBAAA5wMAIA4AAOgDACAPAACsBAAgzwEBALMDACHXAQAA5QOjAiLYAUAAtgMAIdkBQAC2AwAh8AEBALQDACGNAgEAswMAIQkEAAD_AwAgDgAAgAQAIA8AAK4EACDPAQEAAAAB1wEAAACjAgLYAUAAAAAB2QFAAAAAAfABAQAAAAGNAgEAAAABEQcAAM4EACARAADPBAAgEwAA0AQAIM8BAQAAAAHYAUAAAAAB2QFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQgAAAAB_wEIAAAAAYACAgAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAhAAAAABBCAAAMQEADCsAgAAxQQAMLACAADfAwAwsQIAAMcEACADIAAAxQUAIKwCAADGBQAgsAIAAAEAIAQgAACTBAAwrAIAAJQEADCwAgAAlwQAMLECAACWBAAgCc8BAQAAAAHYAUAAAAAB2QFAAAAAAYUCAQAAAAGGAgEAAAABhwIBAAAAAYkCAAAAiQIDigIBAAAAAYsCAQAAAAECAAAApQEAICAAANEEACADAAAAFgAgIAAA0QQAICEAANUEACALAAAAFgAgGQAA1QQAIM8BAQCzAwAh2AFAALYDACHZAUAAtgMAIYUCAQCzAwAhhgIBALQDACGHAgEAtAMAIYkCAADWBIkCI4oCAQC0AwAhiwIBALQDACEJzwEBALMDACHYAUAAtgMAIdkBQAC2AwAhhQIBALMDACGGAgEAtAMAIYcCAQC0AwAhiQIAANYEiQIjigIBALQDACGLAgEAtAMAIQGyAgAAAIkCAwMgAADRBAAgrAIAANIEACCwAgAApQEAIAQgAACCBAAwrAIAAIMEADCwAgAAhgQAMLECAACFBAAgBCAAANsDADCsAgAA3AMAMLACAADfAwAwsQIAAN4DACAEIAAAygMAMKwCAADLAwAwsAIAAM4DADCxAgAAzQMAIAMgAADFAwAgrAIAAMYDACCwAgAAmAIAIAYJAAC5AwAghgIAAK8DACCHAgAArwMAIIkCAACvAwAgigIAAK8DACCLAgAArwMAIAAAAAYJAAC5AwAg0QEAAK8DACDSAQAArwMAINMBAACvAwAg1AEAAK8DACDVAQAArwMAIAAAAAUgAADABQAgIQAAwwUAIKwCAADBBQAgrQIAAMIFACCwAgAAKQAgAyAAAMAFACCsAgAAwQUAILACAAApACAAAAAAAAUgAAC7BQAgIQAAvgUAIKwCAAC8BQAgrQIAAL0FACCwAgAABQAgAyAAALsFACCsAgAAvAUAILACAAAFACAAAAAAAAUgAAC2BQAgIQAAuQUAIKwCAAC3BQAgrQIAALgFACCwAgAA_wEAIAMgAAC2BQAgrAIAALcFACCwAgAA_wEAIAAAAAUgAACxBQAgIQAAtAUAIKwCAACyBQAgrQIAALMFACCwAgAA_wEAIAMgAACxBQAgrAIAALIFACCwAgAA_wEAIAAAAAAAAAAABSAAAKwFACAhAACvBQAgrAIAAK0FACCtAgAArgUAILACAAApACADIAAArAUAIKwCAACtBQAgsAIAACkAIAQDAACgBQAgBQAAoQUAIAYAAKIFACAHAADeBAAgAAAAAAAFIAAApwUAICEAAKoFACCsAgAAqAUAIK0CAACpBQAgsAIAAAkAIAMgAACnBQAgrAIAAKgFACCwAgAACQAgBgMAAKAFACAEAACDBQAgDgAAowUAIA8AALkDACDwAQAArwMAIPMBAACvAwAgAAAAAAAAAAAFsgICAAAAAbUCAgAAAAG2AgIAAAABtwICAAAAAbgCAgAAAAELIAAAlgUAMCEAAJoFADCsAgAAlwUAMK0CAACYBQAwrgIAAIYEADCvAgAAhgQAMLACAACGBAAwsQIAAJkFACCyAgAAhgQAMLMCAACbBQAwtAIAAIkEADARBwAAzgQAIBIAAPMEACATAADQBAAgzwEBAAAAAdgBQAAAAAHZAUAAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQgAAAAB_wEIAAAAAYACAgAAAAGBAgEAAAABggIBAAAAAYQCEAAAAAECAAAABQAgIAAAngUAIAMAAAAFACAgAACeBQAgIQAAnQUAIAEZAACmBQAwAgAAAAUAIBkAAJ0FACACAAAAigQAIBkAAJwFACAOzwEBALMDACHYAUAAtgMAIdkBQAC2AwAh-QEBALMDACH6AQEAswMAIfsBAQCzAwAh_AEBALMDACH9AQEAtAMAIf4BCACMBAAh_wEIAIwEACGAAgIAjQQAIYECAQC0AwAhggIBALQDACGEAhAAjgQAIREHAACQBAAgEgAA8gQAIBMAAJIEACDPAQEAswMAIdgBQAC2AwAh2QFAALYDACH5AQEAswMAIfoBAQCzAwAh-wEBALMDACH8AQEAswMAIf0BAQC0AwAh_gEIAIwEACH_AQgAjAQAIYACAgCNBAAhgQIBALQDACGCAgEAtAMAIYQCEACOBAAhEQcAAM4EACASAADzBAAgEwAA0AQAIM8BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGEAhAAAAABBCAAAJYFADCsAgAAlwUAMLACAACGBAAwsQIAAJkFACALBwAA3gQAIBEAAKQFACASAAC5AwAgEwAApQUAIP0BAACvAwAg_gEAAK8DACD_AQAArwMAIIACAACvAwAggQIAAK8DACCCAgAArwMAIIQCAACvAwAgAAEEAACDBQAgAgwAAIsFACANAADfBAAgBAsAAN0EACD9AQAArwMAIKUCAACvAwAgpgIAAK8DACAADs8BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGEAhAAAAABCgMAAIEEACAEAAD_AwAgDwAArgQAIM8BAQAAAAHXAQAAAKMCAtgBQAAAAAHZAUAAAAAB8AEBAAAAAfMBAQAAAAGNAgEAAAABAgAAAAkAICAAAKcFACADAAAABwAgIAAApwUAICEAAKsFACAMAAAABwAgAwAA6QMAIAQAAOcDACAPAACsBAAgGQAAqwUAIM8BAQCzAwAh1wEAAOUDowIi2AFAALYDACHZAUAAtgMAIfABAQC0AwAh8wEBALQDACGNAgEAswMAIQoDAADpAwAgBAAA5wMAIA8AAKwEACDPAQEAswMAIdcBAADlA6MCItgBQAC2AwAh2QFAALYDACHwAQEAtAMAIfMBAQC0AwAhjQIBALMDACELAwAA7AQAIAUAAMEEACAHAADDBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAHzAQEAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQIAAAApACAgAACsBQAgAwAAAAsAICAAAKwFACAhAACwBQAgDQAAAAsAIAMAAOsEACAFAAChBAAgBwAAowQAIBkAALAFACDPAQEAswMAIdcBAACfBPkBItgBQAC2AwAh2QFAALYDACHzAQEAswMAIfQBAQCzAwAh9gEAAJ0E9gEi9wEQAJ4EACELAwAA6wQAIAUAAKEEACAHAACjBAAgzwEBALMDACHXAQAAnwT5ASLYAUAAtgMAIdkBQAC2AwAh8wEBALMDACH0AQEAswMAIfYBAACdBPYBIvcBEACeBAAhDQcAANkEACALAADYBAAgDQAA2gQAIBAAANsEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA_wEAICAAALEFACADAAAAggIAICAAALEFACAhAAC1BQAgDwAAAIICACAHAADCAwAgCwAAwQMAIA0AAMMDACAQAADEAwAgGQAAtQUAIM8BAQCzAwAh1wEAAL8D7QEi2AFAALYDACHZAUAAtgMAIeUBAQCzAwAh5gEBALQDACHoAQAAvQPoASLqAQAAvgPqASLrAQEAtAMAIQ0HAADCAwAgCwAAwQMAIA0AAMMDACAQAADEAwAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhDQcAANkEACAKAADXBAAgDQAA2gQAIBAAANsEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA_wEAICAAALYFACADAAAAggIAICAAALYFACAhAAC6BQAgDwAAAIICACAHAADCAwAgCgAAwAMAIA0AAMMDACAQAADEAwAgGQAAugUAIM8BAQCzAwAh1wEAAL8D7QEi2AFAALYDACHZAUAAtgMAIeUBAQCzAwAh5gEBALQDACHoAQAAvQPoASLqAQAAvgPqASLrAQEAtAMAIQ0HAADCAwAgCgAAwAMAIA0AAMMDACAQAADEAwAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhEgcAAM4EACARAADPBAAgEgAA8wQAIM8BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIQAAAAAQIAAAAFACAgAAC7BQAgAwAAAAMAICAAALsFACAhAAC_BQAgFAAAAAMAIAcAAJAEACARAACRBAAgEgAA8gQAIBkAAL8FACDPAQEAswMAIdgBQAC2AwAh2QFAALYDACH5AQEAswMAIfoBAQCzAwAh-wEBALMDACH8AQEAswMAIf0BAQC0AwAh_gEIAIwEACH_AQgAjAQAIYACAgCNBAAhgQIBALQDACGCAgEAtAMAIYMCAQCzAwAhhAIQAI4EACESBwAAkAQAIBEAAJEEACASAADyBAAgzwEBALMDACHYAUAAtgMAIdkBQAC2AwAh-QEBALMDACH6AQEAswMAIfsBAQCzAwAh_AEBALMDACH9AQEAtAMAIf4BCACMBAAh_wEIAIwEACGAAgIAjQQAIYECAQC0AwAhggIBALQDACGDAgEAswMAIYQCEACOBAAhCwMAAOwEACAGAADCBAAgBwAAwwQAIM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB8wEBAAAAAfQBAQAAAAH2AQAAAPYBAvcBEAAAAAECAAAAKQAgIAAAwAUAIAMAAAALACAgAADABQAgIQAAxAUAIA0AAAALACADAADrBAAgBgAAogQAIAcAAKMEACAZAADEBQAgzwEBALMDACHXAQAAnwT5ASLYAUAAtgMAIdkBQAC2AwAh8wEBALMDACH0AQEAswMAIfYBAACdBPYBIvcBEACeBAAhCwMAAOsEACAGAACiBAAgBwAAowQAIM8BAQCzAwAh1wEAAJ8E-QEi2AFAALYDACHZAUAAtgMAIfMBAQCzAwAh9AEBALMDACH2AQAAnQT2ASL3ARAAngQAIQrPAQEAAAAB2AFAAAAAAdkBQAAAAAH9AQEAAAABowIBAAAAAaQCAQAAAAGlAgEAAAABpgIBAAAAAacCIAAAAAGoAgIAAAABAgAAAAEAICAAAMUFACAGzwEBAAAAAdcBAAAAowIC2AFAAAAAAdkBQAAAAAHwAQEAAAABjQIBAAAAAQTPAQEAAAAB2AFAAAAAAfEBAQAAAAHyAQEAAAABDQoAANcEACALAADYBAAgDQAA2gQAIBAAANsEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA_wEAICAAAMkFACADAAAAggIAICAAAMkFACAhAADNBQAgDwAAAIICACAKAADAAwAgCwAAwQMAIA0AAMMDACAQAADEAwAgGQAAzQUAIM8BAQCzAwAh1wEAAL8D7QEi2AFAALYDACHZAUAAtgMAIeUBAQCzAwAh5gEBALQDACHoAQAAvQPoASLqAQAAvgPqASLrAQEAtAMAIQ0KAADAAwAgCwAAwQMAIA0AAMMDACAQAADEAwAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhBs8BAQAAAAHXAQAAAKMCAtgBQAAAAAHZAUAAAAAB8wEBAAAAAY0CAQAAAAEHzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAH0AQEAAAAB9gEAAAD2AQL3ARAAAAABAwAAAC8AICAAAMUFACAhAADSBQAgDAAAAC8AIBkAANIFACDPAQEAswMAIdgBQAC2AwAh2QFAALYDACH9AQEAtAMAIaMCAQCzAwAhpAIBALMDACGlAgEAtAMAIaYCAQC0AwAhpwIgAO8DACGoAgIAlAUAIQrPAQEAswMAIdgBQAC2AwAh2QFAALYDACH9AQEAtAMAIaMCAQCzAwAhpAIBALMDACGlAgEAtAMAIaYCAQC0AwAhpwIgAO8DACGoAgIAlAUAIQ7PAQEAAAAB2AFAAAAAAdkBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEIAAAAAf8BCAAAAAGAAgIAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIQAAAAARIRAADPBAAgEgAA8wQAIBMAANAEACDPAQEAAAAB2AFAAAAAAdkBQAAAAAH5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BCAAAAAH_AQgAAAABgAICAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCEAAAAAECAAAABQAgIAAA1AUAIAsDAADsBAAgBQAAwQQAIAYAAMIEACDPAQEAAAAB1wEAAAD5AQLYAUAAAAAB2QFAAAAAAfMBAQAAAAH0AQEAAAAB9gEAAAD2AQL3ARAAAAABAgAAACkAICAAANYFACANBwAA2QQAIAoAANcEACALAADYBAAgEAAA2wQAIM8BAQAAAAHXAQAAAO0BAtgBQAAAAAHZAUAAAAAB5QEBAAAAAeYBAQAAAAHoAQAAAOgBAuoBAAAA6gEC6wEBAAAAAQIAAAD_AQAgIAAA2AUAIAMAAACCAgAgIAAA2AUAICEAANwFACAPAAAAggIAIAcAAMIDACAKAADAAwAgCwAAwQMAIBAAAMQDACAZAADcBQAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhDQcAAMIDACAKAADAAwAgCwAAwQMAIBAAAMQDACDPAQEAswMAIdcBAAC_A-0BItgBQAC2AwAh2QFAALYDACHlAQEAswMAIeYBAQC0AwAh6AEAAL0D6AEi6gEAAL4D6gEi6wEBALQDACEJzwEBAAAAAdcBAAAAlAIC2AFAAAAAAdkBQAAAAAGNAgEAAAABjgIBAAAAAY8CCAAAAAGRAgAAAJECA5ICgAAAAAEDAAAAAwAgIAAA1AUAICEAAOAFACAUAAAAAwAgEQAAkQQAIBIAAPIEACATAACSBAAgGQAA4AUAIM8BAQCzAwAh2AFAALYDACHZAUAAtgMAIfkBAQCzAwAh-gEBALMDACH7AQEAswMAIfwBAQCzAwAh_QEBALQDACH-AQgAjAQAIf8BCACMBAAhgAICAI0EACGBAgEAtAMAIYICAQC0AwAhgwIBALMDACGEAhAAjgQAIRIRAACRBAAgEgAA8gQAIBMAAJIEACDPAQEAswMAIdgBQAC2AwAh2QFAALYDACH5AQEAswMAIfoBAQCzAwAh-wEBALMDACH8AQEAswMAIf0BAQC0AwAh_gEIAIwEACH_AQgAjAQAIYACAgCNBAAhgQIBALQDACGCAgEAtAMAIYMCAQCzAwAhhAIQAI4EACEDAAAACwAgIAAA1gUAICEAAOMFACANAAAACwAgAwAA6wQAIAUAAKEEACAGAACiBAAgGQAA4wUAIM8BAQCzAwAh1wEAAJ8E-QEi2AFAALYDACHZAUAAtgMAIfMBAQCzAwAh9AEBALMDACH2AQAAnQT2ASL3ARAAngQAIQsDAADrBAAgBQAAoQQAIAYAAKIEACDPAQEAswMAIdcBAACfBPkBItgBQAC2AwAh2QFAALYDACHzAQEAswMAIfQBAQCzAwAh9gEAAJ0E9gEi9wEQAJ4EACEGzwEBAAAAAdcBAAAAowIC2AFAAAAAAdkBQAAAAAHwAQEAAAAB8wEBAAAAAQsMAACKBQAgzwEBAAAAAdcBAAAAogIC2AFAAAAAAdkBQAAAAAGbAgEAAAABnAJAAAAAAZ0CQAAAAAGeAggAAAABnwIIAAAAAaACIAAAAAECAAAAXwAgIAAA5QUAIAMAAAAlACAgAADlBQAgIQAA6QUAIA0AAAAlACAMAACJBQAgGQAA6QUAIM8BAQCzAwAh1wEAAPADogIi2AFAALYDACHZAUAAtgMAIZsCAQCzAwAhnAJAALYDACGdAkAAtgMAIZ4CCADUAwAhnwIIANQDACGgAiAA7wMAIQsMAACJBQAgzwEBALMDACHXAQAA8AOiAiLYAUAAtgMAIdkBQAC2AwAhmwIBALMDACGcAkAAtgMAIZ0CQAC2AwAhngIIANQDACGfAggA1AMAIaACIADvAwAhCc8BAQAAAAHXAQAAAJQCAtgBQAAAAAHZAUAAAAABjAIBAAAAAY4CAQAAAAGPAggAAAABkQIAAACRAgOSAoAAAAABDQcAANkEACAKAADXBAAgCwAA2AQAIA0AANoEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA_wEAICAAAOsFACADAAAAggIAICAAAOsFACAhAADvBQAgDwAAAIICACAHAADCAwAgCgAAwAMAIAsAAMEDACANAADDAwAgGQAA7wUAIM8BAQCzAwAh1wEAAL8D7QEi2AFAALYDACHZAUAAtgMAIeUBAQCzAwAh5gEBALQDACHoAQAAvQPoASLqAQAAvgPqASLrAQEAtAMAIQ0HAADCAwAgCgAAwAMAIAsAAMEDACANAADDAwAgzwEBALMDACHXAQAAvwPtASLYAUAAtgMAIdkBQAC2AwAh5QEBALMDACHmAQEAtAMAIegBAAC9A-gBIuoBAAC-A-oBIusBAQC0AwAhAggAEAsGAgUHCgMIAA8RAAESAAgTKgQEAycCBAwEDiYLDwAIBQMAAgUQBQYSBgcTAwgABwEEAAQBBAAEAgUUAAcVAAYHGQMIAA4KFwkLGAINHQoQIQ0BCQAIAg4ACw8ACAMIAAwMAAMNHgoBDR8AAQkACAMHIwALIgANJAACBysAEywAAQstAAAAAAUIABUmABYnABcoABgpABkAAAAAAAUIABUmABYnABcoABgpABkDA1ACBE8EDwAIAwNXAgRWBA8ACAMIAB4oAB8pACAAAAADCAAeKAAfKQAgAQwAAwEMAAMFCAAlJgAmJwAnKAAoKQApAAAAAAAFCAAlJgAmJwAnKAAoKQApAQQABAEEAAQDCAAuKAAvKQAwAAAAAwgALigALykAMAIOAAsPAAgCDgALDwAIBQgANSYANicANygAOCkAOQAAAAAABQgANSYANicANygAOCkAOQEJAAgBCQAIAwgAPigAPykAQAAAAAMIAD4oAD8pAEACEQABEgAIAhEAARIACAUIAEUmAEYnAEcoAEgpAEkAAAAAAAUIAEUmAEYnAEcoAEgpAEkBAwACAQMAAgUIAE4mAE8nAFAoAFEpAFIAAAAAAAUIAE4mAE8nAFAoAFEpAFIBBAAEAQQABAMIAFcoAFgpAFkAAAADCABXKABYKQBZAAADCABeKABfKQBgAAAAAwgAXigAXykAYAEJAAgBCQAIAwgAZSgAZikAZwAAAAMIAGUoAGYpAGcUAgEVLgEWMQEXMgEYMwEaNQEbNxEcOBIdOgEePBEfPRMiPgEjPwEkQBEqQxQrRBosRQMtRgMuRwMvSAMwSQMxSwMyTREzThs0UgM1VBE2VRw3WAM4WQM5WhE6XR07XiE8YAs9YQs-Yws_ZAtAZQtBZwtCaRFDaiJEbAtFbhFGbyNHcAtIcQtJchFKdSRLdipMeAZNeQZOewZPfAZQfQZRfwZSgQERU4IBK1SEAQZVhgERVocBLFeIAQZYiQEGWYoBEVqNAS1bjgExXI8BCl2QAQpekQEKX5IBCmCTAQphlQEKYpcBEWOYATJkmgEKZZwBEWadATNnngEKaJ8BCmmgARFqowE0a6QBOmymAQltpwEJbqkBCW-qAQlwqwEJca0BCXKvARFzsAE7dLIBCXW0ARF2tQE8d7YBCXi3AQl5uAERersBPXu8AUF8vQECfb4BAn6_AQJ_wAECgAHBAQKBAcMBAoIBxQERgwHGAUKEAcgBAoUBygERhgHLAUOHAcwBAogBzQECiQHOARGKAdEBRIsB0gFKjAHTAQSNAdQBBI4B1QEEjwHWAQSQAdcBBJEB2QEEkgHbARGTAdwBS5QB3gEElQHgARGWAeEBTJcB4gEEmAHjAQSZAeQBEZoB5wFNmwHoAVOcAekBBZ0B6gEFngHrAQWfAewBBaAB7QEFoQHvAQWiAfEBEaMB8gFUpAH0AQWlAfYBEaYB9wFVpwH4AQWoAfkBBakB-gERqgH9AVarAf4BWqwBgAIIrQGBAgiuAYQCCK8BhQIIsAGGAgixAYgCCLIBigIRswGLAlu0AY0CCLUBjwIRtgGQAly3AZECCLgBkgIIuQGTAhG6AZYCXbsBlwJhvAGZAg29AZoCDb4BnAINvwGdAg3AAZ4CDcEBoAINwgGiAhHDAaMCYsQBpQINxQGnAhHGAagCY8cBqQINyAGqAg3JAasCEcoBrgJkywGvAmg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/index.ts
var import_dotenv = __toESM(require_main(), 1);
import path from "path";
import_dotenv.default.config({
  path: path.join(process.cwd(), ".env")
});
var config_default = {
  port: process.env.PORT || 8e3,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  payment_success_url: process.env.PAYMENT_SUCCESS_URL,
  payment_cancel_url: process.env.PAYMENT_CANCEL_URL,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_secret_key: process.env.CLOUDINARY_SECRET_KEY,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redis_user: process.env.REDIS_USER,
  redis_host: process.env.REDIS_HOST,
  redis_password: process.env.REDIS_PASSWORD,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER
};

// src/utilis/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
var jwtUtilis = {
  createToken,
  verifyToken
};

// src/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_secret_key
});

// src/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/modules/auth/auth.service.ts
import path2 from "path";

// src/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/modules/auth/auth.service.ts
var registerUserIntoDb = async (payload) => {
  const { email, password, role, firstName, lastName, phone, gender } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      },
      omit: {
        password: true
      }
    });
    const profile = await tx.profile.create({
      data: {
        firstName,
        lastName,
        phone,
        gender,
        userId: createUser.id
      }
    });
    return {
      id: createUser.id,
      email: createUser.email,
      role: createUser.role,
      profile
    };
  });
  return result;
};
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.password) {
    throw new Error("Please login with your Google account");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtilis.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expire_in
  );
  const refreshToken = jwtUtilis.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expire_in
  );
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};
var getMyProfileIntoDB = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true
    },
    omit: {
      password: true
    }
  });
  if (!result) {
    throw new Error("User not found!");
  }
  return result;
};
var googleLoginIntoDB = async (payload) => {
  let googleUser = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleUser = ticket.getPayload();
  } catch (error) {
    console.log("Google Verification Error:", error);
  }
  if (!googleUser || !googleUser.email) {
    throw new Error("Invalid Google token or email missing");
  }
  const email = googleUser.email;
  const googleId = googleUser.sub;
  const firstName = googleUser.given_name || googleUser.name || "GOOGLE USER";
  const lastName = googleUser.family_name || "";
  const picture = googleUser.picture;
  let user = await prisma.user.findUnique({
    where: { email }
  });
  if (user && user.authProvider === AuthProvider.CREDENTIAL) {
    throw new Error(
      "An account already exists with this email. Please login using your password."
    );
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: Role.TENANT,
        authProvider: AuthProvider.GOOGLE,
        googleId,
        profile: {
          create: {
            firstName,
            lastName,
            avatarUrl: picture
          }
        }
      }
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId,
        authProvider: AuthProvider.GOOGLE
      }
    });
  }
};
var updateProfileImgIntoDB = async (userId, buffer) => {
  if (!buffer) {
    throw new Error("File buffer is required!");
  }
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "profile_pictures"
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("No result returned from Cloudinary"));
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    }
  );
  const updatedProfile = await prisma.profile.update({
    where: {
      userId
    },
    data: {
      avatarUrl: cloudinaryResult.secure_url,
      avatarPublicId: cloudinaryResult.public_id
    }
  });
  return updatedProfile;
};
var forgotPasswordIntoDB = async (payload) => {
  const { email } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true
    }
  });
  if (!isUserExists) {
    throw new Error("User does not exists");
  }
  if (isUserExists.status === "SUSPENDED") {
    throw new Error("User is suspend");
  }
  if (isUserExists.googleId || isUserExists.authProvider === "GOOGLE") {
    throw new Error("Please login with email");
  }
  const otp = crypto.randomInt(1e5, 1e6).toString();
  const key = `forgot-password:${isUserExists.email}`;
  const expirationMinutes = 5;
  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationMinutes * 60
    }
  });
  const templatePath = path2.join(
    process.cwd(),
    "src/templates/forgot-password.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    name: `${isUserExists.profile?.firstName ?? ""} ${isUserExists.profile?.lastName ?? ""}`.trim(),
    otp,
    expirationMinutes
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExists.email,
    subject: "Forgot Password",
    html
  });
};
var resetPasswordIntoDB = async (payload) => {
  const { newPassword, email, otp } = payload;
  const key = `forgot-password:${email}`;
  const savedOtp = await redisClient.get(key);
  if (!savedOtp) {
    throw new Error("OTP has expired");
  }
  if (savedOtp !== otp) {
    throw new Error("Invalid otp");
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword
    }
  });
  await redisClient.del(key);
  const templatePath = path2.join(
    process.cwd(),
    "src/templates/reset-password-success.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    name: `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`.trim()
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: user.email,
    subject: "Reset Password",
    html
  });
};
var authService = {
  registerUserIntoDb,
  loginUserIntoDB,
  getMyProfileIntoDB,
  googleLoginIntoDB,
  updateProfileImgIntoDB,
  forgotPasswordIntoDB,
  resetPasswordIntoDB
};

// src/utilis/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/utilis/cookie.ts
var isProduction = process.env.Node_ENV === "production";
var cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax"
};
var ACCESS_COOKIE_MAX_AGE = 1e3 * 60 * 60 * 24;
var REFRESH_COOKIE_MAX_AGE = 1e3 * 60 * 60 * 24 * 30;

// src/modules/auth/auth.controller.ts
var registerUser = catchAsync(
  async (req, res, next) => {
    const payload = registerUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await authService.registerUserIntoDb(payload.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.CREATED,
      message: "User registered successful",
      data: result
    });
  }
);
var logoutUser = catchAsync(
  async (req, res, next) => {
    const cookieOptions2 = {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    };
    res.clearCookie("accessToken", cookieOptions2);
    res.clearCookie("refreshToken", cookieOptions2);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "User logout successful",
      data: null
    });
  }
);
var loginUser = catchAsync(
  async (req, res, next) => {
    const payload = loginUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const { accessToken, refreshToken, user } = await authService.loginUserIntoDB(payload.data);
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_COOKIE_MAX_AGE
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "User login successful",
      data: {
        user
      }
    });
  }
);
var getMyProfile = catchAsync(
  async (req, res, next) => {
    const id = req.user?.id;
    if (!id) {
      throw new Error("User not authenticated");
    }
    const result = await authService.getMyProfileIntoDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "User profile fetched successfully",
      data: result
    });
  }
);
var googleLogin = catchAsync(
  async (req, res, next) => {
    const payload = googleLoginSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await authService.googleLoginIntoDB(payload.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Google login successful",
      data: result
    });
  }
);
var updateProfileImg = catchAsync(
  async (req, res, next) => {
    const userId = req.user.id;
    const file = req.file;
    if (!file) {
      throw new Error("Please upload an image file");
    }
    const result = await authService.updateProfileImgIntoDB(
      userId,
      file.buffer
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Profile picture updated successfully",
      data: result
    });
  }
);
var forgotPassword = catchAsync(
  async (req, res, next) => {
    const payload = forgotPasswordSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await authService.forgotPasswordIntoDB(payload.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: `Password reset OTP send to your email successfully:${payload.data.email}`,
      data: result
    });
  }
);
var resetPassword = catchAsync(
  async (req, res, next) => {
    const payload = resetPasswordSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await authService.resetPasswordIntoDB(payload.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "Password reset successfully! ",
      data: result
    });
  }
);
var authController = {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  googleLogin,
  updateProfileImg,
  forgotPassword,
  resetPassword
};

// src/modules/auth/middleware.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    console.log("\u{1F525} AUTH MIDDLEWARE HIT");
    const token = req.cookies?.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new Error(
        "You are not logged in.Please log in to access this resource"
      );
    }
    const verifyToken2 = jwtUtilis.verifyToken(
      token,
      config_default.jwt_access_secret
    );
    console.log(verifyToken2, "token-verified");
    if (!verifyToken2) {
      throw new Error("Invalid token");
    }
    const { id, email, role } = verifyToken2;
    console.log("Token payload role:", role);
    console.log("Required roles for this route:", requiredRoles);
    console.log("Is role matched?:", requiredRoles.includes(role));
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new Error(
        "You are forbidden.You are not eligible to access this routes"
      );
    }
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = {
      id,
      role,
      email
    };
    next();
  });
};

// src/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({
  storage
});

// src/modules/auth/auth.routes.ts
var router = Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.getMyProfile
);
router.post("/google-login", authController.googleLogin);
router.patch(
  "/profile-img",
  upload.single("profileImg"),
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.updateProfileImg
);
router.post(
  "/forgot-password",
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.resetPassword
);
var authRouter = router;

// src/modules/property/property.router.ts
import { Router as Router2 } from "express";

// src/modules/property/property.validation.ts
import { z as z2 } from "zod";
var createPropertySchema = z2.object({
  categoryId: z2.string().uuid("Invalid category ID"),
  title: z2.string().min(3, "Property title must be at least 3 characters"),
  description: z2.string().optional(),
  address: z2.string().min(5, "Address must be at least 5 characters"),
  city: z2.string().min(2, "City must be at least 2 characters"),
  latitude: z2.number().optional(),
  longitude: z2.number().optional()
});
var propertySortEnum = z2.enum(["latest", "oldest"]);
var getAllPropertiesQuerySchema = z2.object({
  page: z2.coerce.number().int().positive().default(1),
  limit: z2.coerce.number().int().positive().max(100).default(12),
  search: z2.string().optional(),
  categoryId: z2.string().uuid("Invalid category ID").optional(),
  city: z2.string().optional(),
  address: z2.string().optional(),
  category: z2.string().optional(),
  sort: propertySortEnum.optional().default("latest")
});
var updatePropertySchema = z2.object({
  categoryId: z2.string().uuid("Invalid category ID").optional(),
  title: z2.string().min(3, "Property title must be at least 3 characters").optional(),
  description: z2.string().optional(),
  address: z2.string().min(5, "Address must be at least 5 characters").optional(),
  city: z2.string().min(2, "City must be at least 2 characters").optional()
});

// src/modules/property/property.service.ts
var createPropertyIntoDb = async (payload, ownerId) => {
  const { categoryId, title, description, address, city, latitude, longitude } = payload;
  const result = await prisma.property.create({
    data: {
      ownerId,
      categoryId,
      title,
      description,
      address,
      city,
      latitude,
      longitude
    },
    include: {
      category: true
    }
  });
  return result;
};
var getAllPropertiesIntoDb = async (payload) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    category,
    city,
    sort = "latest"
  } = payload;
  const skip = (page - 1) * limit;
  const where = {};
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        address: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (category) {
    where.category = { slug: category };
  }
  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive"
    };
  }
  const properties = await prisma.property.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: sort === "latest" ? "desc" : "asc"
    },
    include: {
      category: true,
      rooms: true
    }
  });
  const total = await prisma.property.count({
    where
  });
  const totalPage = Math.ceil(total / limit);
  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPage
    }
  };
};
var getSinglePropertyIntoDb = async (id) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      rooms: {
        include: {
          images: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Property does not exist");
  }
  return result;
};
var updatePropertyIntoDB = async (id, payload, ownerId) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id }
  });
  if (!isPropertyExists) {
    throw new Error("Property does not exists");
  }
  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }
  const result = await prisma.property.update({
    where: { id },
    data: {
      ...payload
    },
    include: {
      category: true
    }
  });
  return result;
};
var deletePropertyIntoDB = async (id, ownerId) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id }
  });
  if (!isPropertyExists) {
    throw new Error("Property does not exist");
  }
  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized to delete this property!");
  }
  const result = await prisma.property.delete({
    where: { id }
  });
  return result;
};
var uploadPropertyImgIntoDB = async (id, ownerId, buffer) => {
  const isPropertyExists = await prisma.property.findUnique({
    where: { id }
  });
  if (!isPropertyExists) {
    throw new Error("Property does not exist");
  }
  if (isPropertyExists.ownerId !== ownerId) {
    throw new Error("You are not authorized to upload Image");
  }
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    }
  );
  const updateProperty2 = await prisma.property.update({
    where: { id },
    data: {
      propertyImg: cloudinaryResult.secure_url,
      propertyImgPublicId: cloudinaryResult.public_id
    }
  });
  if (isPropertyExists.propertyImgPublicId) {
    try {
      await cloudinary.uploader.destroy(isPropertyExists.propertyImgPublicId);
    } catch (error) {
      console.error("Failed to delete old property image:", error);
    }
  }
  return updateProperty2;
};
var propertyService = {
  createPropertyIntoDb,
  getAllPropertiesIntoDb,
  getSinglePropertyIntoDb,
  updatePropertyIntoDB,
  deletePropertyIntoDB,
  uploadPropertyImgIntoDB
};

// src/modules/property/property.controller.ts
import httpStatus3 from "http-status";
var createProperty = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const payload = createPropertySchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await propertyService.createPropertyIntoDb(
      payload.data,
      ownerId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.CREATED,
      message: "Property created successfully",
      data: result
    });
  }
);
var getAllProperties = catchAsync(
  async (req, res, next) => {
    const query = getAllPropertiesQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new Error(query.error.message);
    }
    const result = await propertyService.getAllPropertiesIntoDb(query.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Properties retrieved successfully",
      data: result
    });
  }
);
var getSingleProperty = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await propertyService.getSinglePropertyIntoDb(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Single properties retrieved successfully",
      data: result
    });
  }
);
var updateProperty = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const ownerId = req.user.id;
    const payload = updatePropertySchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await propertyService.updatePropertyIntoDB(
      id,
      payload.data,
      ownerId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Property updated successfully",
      data: result
    });
  }
);
var deleteProperty = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const ownerId = req.user.id;
    const result = await propertyService.deletePropertyIntoDB(
      id,
      ownerId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Property deleted successfully",
      data: result
    });
  }
);
var uploadPropertyImg = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const ownerId = req.user.id;
    const file = req.file;
    const result = await propertyService.uploadPropertyImgIntoDB(
      id,
      ownerId,
      file.buffer
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Images uploaded successfully",
      data: result
    });
  }
);
var propertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImg
};

// src/modules/property/property.router.ts
var router2 = Router2();
router2.post(
  "/",
  auth(Role.OWNER, Role.ADMIN),
  propertyController.createProperty
);
router2.get("/", propertyController.getAllProperties);
router2.get("/:id", propertyController.getSingleProperty);
router2.patch(
  "/:id/image",
  auth(Role.OWNER, Role.ADMIN),
  upload.single("propertyImg"),
  auth(Role.OWNER),
  propertyController.updateProperty
);
var propertyRoutes = router2;

// src/modules/room/room.routes.ts
import { Router as Router3 } from "express";

// src/modules/room/room.validation.ts
import { z as z3 } from "zod";
var createRoomSchema = z3.object({
  propertyId: z3.string().uuid("Invalid property ID"),
  roomNumber: z3.string().min(1, "Room number is required"),
  roomType: z3.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]),
  baseRent: z3.coerce.number().positive("Base rent must be greater than 0")
});
var updateRoomSchema = z3.object({
  roomNumber: z3.string().min(1, "Room number is required").optional(),
  roomType: z3.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]).optional(),
  baseRent: z3.coerce.number().positive("Base rent must be greater than 0").optional(),
  status: z3.enum(RoomStatus).optional()
});

// src/modules/room/room.service.ts
var createRoomIntoDB = async (ownerId, payload) => {
  const { propertyId, roomNumber, roomType, baseRent } = payload;
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId
    }
  });
  if (!property) {
    throw new Error("Property does not exist");
  }
  if (property.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }
  const result = await prisma.room.create({
    data: {
      propertyId,
      roomNumber,
      roomType,
      baseRent
    }
  });
  return result;
};
var getAllRoomIntoDB = async (query) => {
  const {
    propertyId,
    roomNumber,
    roomType,
    search,
    status,
    page = 1,
    limit = 10,
    minRent,
    maxRent,
    sortOrder = "asc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const where = {};
  if (roomType) {
    where.roomType = roomType;
  }
  if (status) {
    where.status = status;
  }
  if (propertyId) {
    where.propertyId = propertyId;
  }
  if (roomNumber) {
    where.roomNumber = {
      contains: roomNumber,
      mode: "insensitive"
    };
  }
  if (minRent || maxRent) {
    where.baseRent = {};
    if (minRent) {
      where.baseRent.gte = Number(minRent);
    }
    if (maxRent) {
      where.baseRent.lte = Number(maxRent);
    }
  }
  if (search) {
    where.OR = [
      { roomNumber: { contains: search, mode: "insensitive" } },
      { property: { title: { contains: search, mode: "insensitive" } } },
      { property: { city: { contains: search, mode: "insensitive" } } },
      { property: { address: { contains: search, mode: "insensitive" } } }
    ];
  }
  const total = await prisma.room.count({ where });
  const totalPages = Math.ceil(total / limitNumber);
  const room = await prisma.room.findMany({
    where,
    take: limitNumber,
    skip,
    orderBy: {
      baseRent: sortOrder
    },
    include: {
      images: true,
      property: true
    }
  });
  return {
    meta: {
      limitNumber,
      totalPages,
      pageNumber,
      total
    },
    data: room
  };
};
var getSingleRoomIntoDB = async (id) => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      property: true,
      images: true
    }
  });
  if (!result) {
    throw new Error("Room doest not exist");
  }
  return result;
};
var updateRoomIntoDB = async (payload, ownerId, roomId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: true,
      images: true
    }
  });
  if (!room) {
    throw new Error("Room does not exist");
  }
  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }
  const updateRoom2 = await prisma.room.update({
    where: { id: roomId },
    data: payload
  });
  return updateRoom2;
};
var deleteRoomIntoDB = async (roomId, ownerId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { property: true }
  });
  if (!room) {
    throw new Error("Room not found");
  }
  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to delete this room");
  }
  const deletedRoom = await prisma.room.delete({
    where: { id: roomId }
  });
  return deletedRoom;
};
var uploadRoomImgIntoDB = async (id, ownerId, buffer) => {
  const isRoomExists = await prisma.room.findUnique({
    where: { id },
    include: {
      property: true
    }
  });
  if (!isRoomExists) {
    throw new Error("Room does not exist");
  }
  if (isRoomExists.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to upload image");
  }
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    }
  );
  const updateRoomImg = await prisma.roomImage.update({
    where: { id },
    data: {
      imageUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id
    }
  });
  return updateRoomImg;
};
var roomService = {
  createRoomIntoDB,
  getAllRoomIntoDB,
  getSingleRoomIntoDB,
  updateRoomIntoDB,
  deleteRoomIntoDB,
  uploadRoomImgIntoDB
};

// src/modules/room/room.controller.ts
import httpStatus4 from "http-status";
var createRoom = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const payload = createRoomSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await roomService.createRoomIntoDB(
      ownerId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.CREATED,
      message: "Room created successfully",
      data: result
    });
  }
);
var getAllRoom = catchAsync(
  async (req, res, next) => {
    const result = await roomService.getAllRoomIntoDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Room fetched successfully",
      data: result
    });
  }
);
var getSingleRoom = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await roomService.getSingleRoomIntoDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Room fetched successfully",
      data: result
    });
  }
);
var updateRoom = catchAsync(
  async (req, res, next) => {
    const payload = await updateRoomSchema.safeParse(req.body);
    const ownerId = req.user.id;
    const roomId = req.params;
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await roomService.updateRoomIntoDB(
      payload.data,
      ownerId,
      roomId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Room updated successfully",
      data: result
    });
  }
);
var deleteRoom = catchAsync(
  async (req, res, next) => {
    const roomId = req.params;
    const ownerId = req.user.id;
    const result = await roomService.deleteRoomIntoDB(roomId, ownerId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Room deleted successfully",
      data: result
    });
  }
);
var uploadRoomImg = catchAsync(
  async (req, res, next) => {
    const roomId = req.params;
    const ownerId = req.user.id;
    const file = req.file;
    if (!req.file) {
      throw new Error("Please upload an image file");
    }
    const result = await roomService.updateRoomIntoDB(
      roomId,
      ownerId,
      file.buffer
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Room image uploaded successfully",
      data: result
    });
  }
);
var roomController = {
  createRoom,
  getAllRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImg
};

// src/modules/room/room.routes.ts
var router3 = Router3();
router3.post("/", roomController.createRoom);
router3.get("/", roomController.getAllRoom);
router3.get("/:id", roomController.getSingleRoom);
router3.patch("/:id", roomController.updateRoom);
router3.delete("/:id", roomController.deleteRoom);
router3.patch("/:id/image", upload.single("roomImg"), roomController.uploadRoomImg);
var roomRoutes = router3;

// src/modules/listing/listing.routes.ts
import { Router as Router4 } from "express";

// src/modules/listing/listning.validation.ts
import { z as z4 } from "zod";
var createListingSchema = z4.object({
  roomId: z4.string().uuid("Invalid room ID"),
  title: z4.string().min(3, "Listing title must be at least 3 characters"),
  description: z4.string().min(10, "Description must be at least 10 characters")
});
var updateListingSchema = z4.object({
  title: z4.string().min(3, "Listing title must be at least 3 characters").optional(),
  description: z4.string().min(10, "Description must be at least 10 characters").optional(),
  isPublished: z4.boolean().optional()
});

// src/modules/listing/listing.controller.ts
import httpStatus5 from "http-status";

// src/modules/listing/listing.service.ts
var createListingIntoDB = async (ownerId, payload) => {
  const { roomId, title, description } = payload;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: true
    }
  });
  if (!room) {
    throw new Error("Room does not exist");
  }
  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to create listing");
  }
  const existListing = await prisma.listing.findUnique({
    where: { id: roomId }
  });
  if (existListing) {
    throw new Error("This room already has a listing");
  }
  const createListing2 = await prisma.listing.create({
    data: {
      title,
      description,
      roomId
    }
  });
  return createListing2;
};
var getAllListingIntoDB = async (query) => {
  const {
    roomType,
    status,
    page = 1,
    limit = 10,
    minRent,
    maxRent,
    search,
    sortOrder = "asc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const where = {};
  if (roomType || status || minRent || maxRent) {
    where.room = {};
    if (roomType) {
      where.room.roomType = roomType;
    }
    if (status) {
      where.room.status = status;
    }
    if (minRent || maxRent) {
      where.room.baseRent = {};
      if (minRent) {
        where.room.baseRent.gte = Number(minRent);
      }
      if (maxRent) {
        where.room.baseRent.lte = Number(maxRent);
      }
    }
  }
  if (search) {
    where.OR = [
      // Listing title
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      // Listing description
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      },
      // Property title
      {
        room: {
          property: {
            title: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      },
      // Property city
      {
        room: {
          property: {
            city: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      },
      // Property address
      {
        room: {
          property: {
            address: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      }
    ];
  }
  const order = sortOrder === "desc" ? "desc" : "asc";
  const total = await prisma.listing.count({
    where
  });
  const totalPages = Math.ceil(total / limitNumber);
  const listings = await prisma.listing.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: {
      room: {
        baseRent: order
      }
    },
    include: {
      room: true
    }
  });
  return {
    meta: {
      pageNumber,
      limitNumber,
      totalPages,
      total
    },
    data: listings
  };
};
var getSingleListingIntoDB = async (id) => {
  const result = await prisma.listing.findUnique({
    where: { id },
    include: {
      room: {
        include: {
          images: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Listing not found");
  }
  return result;
};
var updateListingIntoDB = async (ownerId, listingId, payload) => {
  const isListingExists = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      room: {
        include: {
          property: true
        }
      }
    }
  });
  if (!isListingExists) {
    throw new Error("Listing does not exist");
  }
  if (isListingExists.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to update this listing");
  }
  const result = await prisma.listing.update({
    where: { id: listingId },
    data: {
      ...payload
    }
  });
  return result;
};
var deleteListingIntoDB = async (ownerId, listingId) => {
  const isListingExists = await prisma.listing.findUnique({
    where: {
      id: listingId
    },
    include: {
      room: {
        include: {
          property: true
        }
      }
    }
  });
  if (!isListingExists) {
    throw new Error("Listing does not exist");
  }
  if (isListingExists.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to delete this listing");
  }
  ;
  const deletedListing = await prisma.listing.delete({
    where: { id: listingId }
  });
  return deletedListing;
};
var listingService = {
  createListingIntoDB,
  getAllListingIntoDB,
  getSingleListingIntoDB,
  updateListingIntoDB,
  deleteListingIntoDB
};

// src/modules/listing/listing.controller.ts
var createListing = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const payload = createListingSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await listingService.createListingIntoDB(
      ownerId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.CREATED,
      message: "Listing created successfully",
      data: result
    });
  }
);
var getAllListing = catchAsync(
  async (req, res, next) => {
    const query = req.query;
    const result = await listingService.getAllListingIntoDB(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Listings fetched successfully",
      data: result
    });
  }
);
var getSingleListing = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await listingService.getSingleListingIntoDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Listing fetched successfully",
      data: result
    });
  }
);
var updateListing = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user.id;
    const { id } = req.params;
    const payload = await updateListingSchema.safeParse(req.body);
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const result = await listingService.updateListingIntoDB(
      ownerId,
      id,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Listing updated successfully",
      data: result
    });
  }
);
var deleteListing = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user.id;
    const listingId = req.params;
    const result = await listingService.deleteListingIntoDB(ownerId, listingId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Listing deleted successfully",
      data: result
    });
  }
);
var listingController = {
  createListing,
  getAllListing,
  getSingleListing,
  updateListing,
  deleteListing
};

// src/modules/listing/listing.routes.ts
var router4 = Router4();
router4.post("/", auth(Role.OWNER), listingController.createListing);
router4.get("/", listingController.getAllListing);
router4.get("/:id", listingController.getSingleListing);
router4.patch("/:id", listingController.updateListing);
router4.delete("/:id", listingController.deleteListing);
var listingRoutes = router4;

// src/modules/application/application.routes.ts
import { Router as Router5 } from "express";

// src/modules/application/application.validation.ts
import { z as z5 } from "zod";
var createApplicationSchema = z5.object({
  listingId: z5.string().uuid("Invalid listing ID"),
  type: z5.enum(["room", "property"])
});
var updateApplicationSchema = z5.object({
  status: z5.enum(["CANCELLED"])
});
var updateApplicationByOwnerSchema = z5.object({
  status: z5.enum(["APPROVED", "REJECTED"])
});

// src/modules/application/application.service.ts
var createApplicationIntoDB = async (tenantId, payload) => {
  const { listingId, type } = payload;
  let roomId = null;
  let propertyId = null;
  if (type === "room") {
    const room = await prisma.room.findUnique({ where: { id: listingId } });
    if (!room) throw new Error("Room does not exist");
    if (room.status !== RoomStatus.AVAILABLE)
      throw new Error("This room is not available");
    roomId = room.id;
    propertyId = room.propertyId;
  } else {
    const property = await prisma.property.findUnique({
      where: { id: listingId }
    });
    if (!property) throw new Error("Property does not exist");
    propertyId = property.id;
  }
  const isApplicationExists = await prisma.application.findFirst({
    where: {
      tenantId,
      ...roomId ? { roomId } : { propertyId }
    }
  });
  if (isApplicationExists)
    throw new Error("You have already applied for this listing");
  const result = await prisma.application.create({
    data: {
      tenantId,
      roomId,
      propertyId
    },
    include: { room: true, property: true }
  });
  return result;
};
var getApplicationIntoDB = async (userId, role) => {
  let whereClause = {};
  if (role === "TENANT") {
    whereClause = { tenantId: userId };
  } else if (role === "OWNER") {
    whereClause = { room: { property: { ownerId: userId } } };
  }
  const result = await prisma.application.findMany({
    where: whereClause,
    include: {
      tenant: {
        include: {
          profile: true
        }
      },
      room: {
        include: {
          property: true
        }
      },
      property: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getSingleApplicationIntoDB = async (tenantId, applicationId) => {
  const result = await prisma.application.findFirst({
    where: {
      tenantId,
      id: applicationId
    },
    include: {
      room: {
        include: {
          property: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Application not found");
  }
  return result;
};
var updateApplicationIntoDB = async (tenantId, applicationId, payload) => {
  const application = await prisma.application.findFirst({
    where: {
      tenantId,
      id: applicationId
    }
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== "PENDING") {
    throw new Error("Only pending application can be cancelled");
  }
  const result = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: payload.status
    }
  });
  return result;
};
var deleteApplicationIntoDB = async (tenantId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      tenantId
    }
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== "PENDING") {
    throw new Error("Only pending application can be deleted");
  }
  const result = await prisma.application.delete({
    where: {
      id: applicationId
    }
  });
  return result;
};
var updateApplicationStatusByOwnerIntoDB = async (userId, role, applicationId, payload) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      room: { include: { property: true } },
      property: true
    }
  });
  if (!application) throw new Error("Application not found");
  if (role !== "ADMIN") {
    const ownerId = application.room?.property?.ownerId || application.property?.ownerId;
    if (ownerId !== userId) throw new Error("You are not authorized");
  }
  if (application.status !== "PENDING") {
    throw new Error("Only pending applications can be processed");
  }
  const result = await prisma.application.update({
    where: { id: applicationId },
    data: { status: payload.status }
  });
  if (payload.status === "APPROVED") {
    const rentAmount = application.room ? Number(application.room.baseRent) : Number(application.property?.fullRent || 0);
    const securityDeposit = rentAmount * 2;
    const lease = await prisma.lease.create({
      data: {
        applicationId: application.id,
        monthlyRent: rentAmount,
        securityDeposit,
        startDate: /* @__PURE__ */ new Date(),
        endDate: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)),
        status: "ACTIVE",
        isSigned: true
      }
    });
    await prisma.payment.create({
      data: {
        leaseId: lease.id,
        tenantId: application.tenantId,
        amount: rentAmount,
        transactionId: `txn_${Date.now()}`,
        status: "PENDING",
        paymentMethod: "CREDIT_CARD"
      }
    });
  }
  return result;
};
var applicationService = {
  createApplicationIntoDB,
  getApplicationIntoDB,
  getSingleApplicationIntoDB,
  updateApplicationIntoDB,
  deleteApplicationIntoDB,
  updateApplicationStatusByOwnerIntoDB
};

// src/modules/application/application.controller.ts
import httpStatus6 from "http-status";
var createApplication = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user.id;
    const payload = createApplicationSchema.safeParse(req.body);
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await applicationService.createApplicationIntoDB(
      tenantId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "Application submitted successfully",
      data: result
    });
  }
);
var getApplication = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const result = await applicationService.getApplicationIntoDB(userId, role);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Application retrieved successfully",
      data: result
    });
  }
);
var getSingleApplication = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    const applicationId = req.params;
    const result = await applicationService.getSingleApplicationIntoDB(
      tenantId,
      applicationId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Application retrieved  successfully",
      data: result
    });
  }
);
var updateApplication = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    const applicationId = req.params.id;
    const payload = updateApplicationSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await applicationService.updateApplicationIntoDB(
      tenantId,
      applicationId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Application updated successfully",
      data: result
    });
  }
);
var deleteApplication = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    const applicationId = req.params.id;
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }
    await applicationService.deleteApplicationIntoDB(applicationId, tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Application deleted successfully",
      data: null
    });
  }
);
var updateApplicationStatusByOwner = catchAsync(
  async (req, res) => {
    const ownerId = req.user?.id;
    const role = req.user?.role;
    const applicationId = req.params.id;
    const payload = updateApplicationByOwnerSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await applicationService.updateApplicationStatusByOwnerIntoDB(
      ownerId,
      role,
      applicationId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Application status updated successfully",
      data: result
    });
  }
);
var applicationController = {
  createApplication,
  getApplication,
  getSingleApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatusByOwner
};

// src/modules/application/application.routes.ts
var router5 = Router5();
router5.post("/", auth(), applicationController.createApplication);
router5.get(
  "/",
  auth(Role.OWNER, Role.TENANT, Role.ADMIN),
  applicationController.getApplication
);
router5.get("/:id", applicationController.getSingleApplication);
router5.patch(
  "/:id",
  auth(Role.OWNER, Role.ADMIN),
  applicationController.updateApplication
);
router5.delete(
  "/:id",
  auth(Role.ADMIN, Role.OWNER),
  applicationController.deleteApplication
);
router5.patch(
  "/:id/status",
  auth(Role.OWNER, Role.ADMIN),
  applicationController.updateApplicationStatusByOwner
);
var applicationRoutes = router5;

// src/modules/identityVerification/verification.routes.ts
import { Router as Router6 } from "express";

// src/modules/identityVerification/verification.validation.ts
import { z as z6 } from "zod";
var createIdentityVerificationSchema = z6.object({
  nidNumber: z6.string().min(10, "NID number must be at least 10 characters").max(20, "NID number must not exceed 20 characters")
});

// src/lib/cloudinaryUpload.ts
var uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload failed"));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
};

// src/modules/identityVerification/verification.service.ts
var verifyIdentityIntoDB = async (userId, payload, nidFront, nidBack) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      identityVerification: true
    }
  });
  if (!user) {
    throw new Error("User account not found");
  }
  if (user.status === "BLOCKED") {
    throw new Error("User is bolocked");
  }
  if (user.status === "DELETED") {
    throw new Error("User is deleted");
  }
  if (user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  }
  const isExistsNid = await prisma.identityVerification.findUnique({
    where: { nidNumber: payload.nidNumber }
  });
  if (isExistsNid && isExistsNid.userId == userId) {
    throw new Error(
      "This NID number is already associated with another account"
    );
  }
  const fontUpload = await uploadToCloudinary(
    nidFront.buffer,
    "nestora/identity-verifications"
  );
  const backUpload = await uploadToCloudinary(
    nidBack.buffer,
    "nestora/identity-verifications"
  );
  if (!fontUpload?.secure_url || !backUpload?.secure_url) {
    throw new Error("Failed to upload NID images. Please try again.");
  }
  const result = await prisma.identityVerification.upsert({
    where: { userId },
    update: {
      nidNumber: payload.nidNumber,
      nidFrontUrl: fontUpload.secure_url,
      nidFrontPublicId: fontUpload.public_id,
      nidBackUrl: backUpload.secure_url,
      nidBackPublicId: backUpload.public_id,
      status: VerificationStatus.PENDING
    },
    create: {
      userId,
      nidNumber: payload.nidNumber,
      nidFrontUrl: fontUpload.secure_url,
      nidFrontPublicId: fontUpload.public_id,
      nidBackUrl: backUpload.secure_url,
      nidBackPublicId: backUpload.public_id,
      status: VerificationStatus.PENDING
    }
  });
  return result;
};
var getMyVerificationIntoDB = async (userId) => {
  const result = await prisma.identityVerification.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });
  return result;
};
var getPendingVerificationIntoDB = async () => {
  const result = await prisma.identityVerification.findMany({
    where: {
      status: "PENDING"
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true
            }
          }
        }
      }
    }
  });
  return result;
};
var updateVarificationStatusIntoDB = async (id, status) => {
  const verification = await prisma.identityVerification.findUnique({
    where: { id }
  });
  if (!verification) {
    throw new Error("Verification record not found");
  }
  if (verification.status !== VerificationStatus.PENDING) {
    throw new Error("Verification has already been processed");
  }
  const result = await prisma.identityVerification.update({
    where: { id },
    data: { status }
  });
  return result;
};
var verificationService = {
  verifyIdentityIntoDB,
  getMyVerificationIntoDB,
  getPendingVerificationIntoDB,
  updateVarificationStatusIntoDB
};

// src/modules/identityVerification/verification.controller.ts
import httpStatus7 from "http-status";
var verifyIdentity = catchAsync(
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User is not authenticated");
      }
      const payload = createIdentityVerificationSchema.safeParse(req.body || {});
      if (!payload.success) {
        console.error("\u{1F525} ZOD VALIDATION ERROR:", payload.error.format());
        throw new Error("Invalid request body data");
      }
      const files = req.files;
      const nidFront = files?.nidFront?.[0];
      const nidBack = files?.nidBack?.[0];
      if (!nidFront || !nidBack) {
        console.error("\u{1F525} FILE MISSING:", { nidFront: !!nidFront, nidBack: !!nidBack });
        throw new Error("Both NID images (nidFront and nidBack) are required");
      }
      const result = await verificationService.verifyIdentityIntoDB(
        userId,
        payload.data,
        nidFront,
        nidBack
      );
      sendResponse(res, {
        success: true,
        statusCode: httpStatus7.CREATED,
        message: "Identity verification submitted successfully",
        data: result
      });
    } catch (error) {
      console.error("\u{1F525} IDENTITY VERIFICATION FAILED:", error);
      throw error;
    }
  }
);
var getMyVerification = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const result = await verificationService.getMyVerificationIntoDB(
      userId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "My identity verification status retrieved successfully",
      data: result
    });
  }
);
var getPendingVerification = catchAsync(
  async (req, res, next) => {
    const result = await verificationService.getPendingVerificationIntoDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Pending verifications retrieved successfully",
      data: result
    });
  }
);
var updateVarificationStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await verificationService.updateVarificationStatusIntoDB(
      id,
      status
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: `Identity verification ${status.toLowerCase()} successfully`,
      data: result
    });
  }
);
var verificationController = {
  verifyIdentity,
  getMyVerification,
  getPendingVerification,
  updateVarificationStatus
};

// src/modules/identityVerification/verification.routes.ts
var router6 = Router6();
router6.post(
  "/",
  auth(Role.OWNER, Role.ADMIN, Role.TENANT, Role.MANAGER),
  upload.fields([
    {
      name: "nidFront",
      maxCount: 1
    },
    {
      name: "nidBack",
      maxCount: 1
    }
  ]),
  verificationController.verifyIdentity
);
router6.get("/me", auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT), verificationController.getMyVerification);
router6.get("/pending-list", auth(Role.ADMIN, Role.OWNER), verificationController.getPendingVerification);
router6.patch("/:id/status", auth(Role.ADMIN, Role.OWNER), verificationController.updateVarificationStatus);
var nidVerificationRoutes = router6;

// src/modules/lease/lease.router.ts
import { Router as Router7 } from "express";

// src/modules/lease/lease.validation.ts
import { z as z7 } from "zod";
var createLeaseSchema = z7.object({
  applicationId: z7.string().uuid("Invalid application ID"),
  startDate: z7.string().datetime("Invalid start date"),
  endDate: z7.string().datetime("Invalid end date"),
  monthlyRent: z7.number().positive("Monthly rent must be greater than 0"),
  securityDeposit: z7.number().nonnegative("Security deposit cannot be negative")
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
});
var updateLeaseSchema = z7.object({
  startDate: z7.string().datetime("Invalid start date").optional(),
  endDate: z7.string().datetime("Invalid end date").optional(),
  monthlyRent: z7.number().positive("Monthly rent must be greater than 0").optional(),
  securityDeposit: z7.number().nonnegative("Security deposit cannot be negative").optional()
});

// src/modules/lease/lease.service.ts
var createLeaseIntoDB = async (ownerId, payload) => {
  const application = await prisma.application.findUnique({
    where: {
      id: payload.applicationId
    },
    include: {
      room: {
        include: {
          property: true
        }
      },
      lease: true
    }
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== ApplicationStatus.APPROVED) {
    throw new Error("Lease can only be created for an approved application");
  }
  if (application.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to create this lease");
  }
  if (application.lease) {
    throw new Error("A lease already exists for this application");
  }
  const result = await prisma.lease.create({
    data: {
      applicationId: payload.applicationId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      monthlyRent: payload.monthlyRent,
      securityDeposit: payload.securityDeposit
    }
  });
  return result;
};
var getAllLeaseIntoDB = async () => {
  const result = await prisma.lease.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getSingleLeaseIntoDB = async (id) => {
  const result = await prisma.lease.findUnique({
    where: {
      id
    },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true
            }
          },
          tenant: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });
  return result;
};
var updateLeaseIntoDB = async (ownerId, leaseId, payload) => {
  const lease = await prisma.lease.findUnique({
    where: {
      id: leaseId
    },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true
            }
          }
        }
      }
    }
  });
  if (!lease) {
    throw new Error("Lease not found");
  }
  if (lease.application.room.property.ownerId !== ownerId) {
    throw new Error("You are not allowed to update this lease");
  }
  if (lease.isSigned) {
    throw new Error("Singed lease can not be update");
  }
  const updateData = {
    ...payload
  };
  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }
  if (payload.startDate || payload.endDate) {
    const startDate = payload.startDate ? new Date(payload.startDate) : lease.startDate;
    const endDate = payload.endDate ? new Date(payload.endDate) : lease.endDate;
    if (endDate <= startDate) {
      throw new Error("End date must be after start date");
    }
  }
  return prisma.lease.update({
    where: { id: leaseId },
    data: updateData
  });
};
var terminateLeaseIntoDB = async (ownerId, leaseId) => {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true
            }
          }
        }
      }
    }
  });
  if (!lease) {
    throw new Error("Lease not found");
  }
  if (lease.application.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to terminate this lease");
  }
  if (lease.status === "TERMINATED") {
    throw new Error("Lease is already terminated");
  }
  return prisma.lease.update({
    where: { id: leaseId },
    data: {
      status: "TERMINATED"
    }
  });
};
var signLeaseIntoDB = async (tenantId, leaseId) => {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      application: true
    }
  });
  if (!lease) {
    throw new Error("Lease not found");
  }
  if (lease.application.tenantId !== tenantId) {
    throw new Error("You are not authorized to sign this lease");
  }
  if (lease.isSigned) {
    throw new Error("Lease already signed");
  }
  return prisma.lease.update({
    where: { id: leaseId },
    data: {
      isSigned: true
    }
  });
};
var getMyLeaseIntoDB = async (tenantId) => {
  const lease = await prisma.lease.findFirst({
    where: {
      status: LeaseStatus.ACTIVE,
      application: {
        tenantId
      }
    },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true
            }
          }
        }
      }
    }
  });
  if (!lease) {
    throw new Error("No active lease found");
  }
  return lease;
};
var leaseService = {
  createLeaseIntoDB,
  getAllLeaseIntoDB,
  getSingleLeaseIntoDB,
  updateLeaseIntoDB,
  terminateLeaseIntoDB,
  signLeaseIntoDB,
  getMyLeaseIntoDB
};

// src/modules/lease/lease.controller.ts
import httpStatus8 from "http-status";
var createLease = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const payload = createLeaseSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await leaseService.createLeaseIntoDB(ownerId, payload.data);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.CREATED,
      message: "Lease created successfully",
      data: result
    });
  }
);
var getAllLease = catchAsync(
  async (req, res, next) => {
    const result = await leaseService.getAllLeaseIntoDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Lease fetched successfully",
      data: result
    });
  }
);
var getSingleLease = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await leaseService.getSingleLeaseIntoDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Lease fetched successfully",
      data: result
    });
  }
);
var updateLease = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    const leaseId = req.params.id;
    const payload = updateLeaseSchema.safeParse(req.body);
    const result = await leaseService.updateLeaseIntoDB(
      ownerId,
      leaseId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Lease fetched successfully",
      data: result
    });
  }
);
var terminateLease = catchAsync(
  async (req, res, next) => {
    const ownerId = req.user?.id;
    const leaseId = req.params.id;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }
    const result = await leaseService.terminateLeaseIntoDB(ownerId, leaseId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Lease terminate successfully",
      data: result
    });
  }
);
var signLease = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    const leaseId = req.params.id;
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }
    const result = await leaseService.signLeaseIntoDB(tenantId, leaseId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Lease signed successfully",
      data: result
    });
  }
);
var getMyLease = catchAsync(async (req, res, next) => {
  const tenantId = req.user.id;
  const result = await leaseService.getMyLeaseIntoDB(tenantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My lease retrieved successfully",
    data: result
  });
});
var leaseController = {
  createLease,
  getAllLease,
  getSingleLease,
  updateLease,
  terminateLease,
  signLease,
  getMyLease
};

// src/modules/lease/lease.router.ts
var router7 = Router7();
router7.post("/", auth(Role.OWNER), leaseController.createLease);
router7.get("/", auth(Role.ADMIN), leaseController.getAllLease);
router7.get(
  "/:id",
  auth(Role.OWNER, Role.ADMIN),
  leaseController.getSingleLease
);
router7.patch(
  "/:id",
  auth(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.TENANT),
  leaseController.updateLease
);
router7.patch(
  "/:id/terminate",
  auth(Role.OWNER, Role.OWNER),
  leaseController.terminateLease
);
router7.patch("/:id/sign", auth(Role.TENANT), leaseController.signLease);
router7.get("/my-lease", auth(Role.TENANT), leaseController.getMyLease);
var leaseRoutes = router7;

// src/modules/payments/payments.routes.ts
import { Router as Router8 } from "express";

// src/modules/payments/payments.validation.ts
import { z as z8 } from "zod";
var createPaymentSchema = z8.object({
  leaseId: z8.string().uuid("Invalid lease ID")
});

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/modules/payments/payments.service.ts
var createPaymentsIntoDB = async (tenantId, payload) => {
  const { leaseId } = payload;
  const lease = await prisma.lease.findUnique({
    where: {
      id: leaseId
    },
    include: {
      application: true,
      payments: true
    }
  });
  if (!lease) {
    throw new Error("Lease not found");
  }
  if (lease.application.tenantId !== tenantId) {
    throw new Error("You are not authorized to make this payment");
  }
  if (!lease.isSigned) {
    throw new Error("Lease must be signed before making payment");
  }
  if (lease.status === "TERMINATED") {
    throw new Error("Cannot make payment for a terminated lease");
  }
  const completedPayment = lease.payments.find(
    (payment) => payment.status === PaymentStatus.COMPLETED
  );
  if (completedPayment) {
    throw new Error("Payment has already been completed for this lease");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Nestora Rent"
          },
          unit_amount: Math.round(lease.monthlyRent * 100)
        },
        quantity: 1
      }
    ],
    // success_url: `http://localhost:3001/dashboard/tenant/payments/success?sessionId={CHECKOUT_SESSION_ID}`,
    // cancel_url: `http://localhost:3001/dashboard/tenant/payments/cancel?leaseId=${lease.id}`,
    success_url: `https://nestora-f.vercel.app/dashboard/tenant/payments/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://nestora-f.vercel.app/dashboard/tenant/payments/cancel?leaseId=${lease.id}`,
    metadata: {
      leaseId: lease.id,
      tenantId
    }
  });
  await prisma.payment.upsert({
    where: {
      leaseId: lease.id
    },
    update: {
      transactionId: session.id,
      paymentData: {
        checkoutUrl: session.url,
        sessionId: session.id,
        currency: session.currency || "USD",
        paymentStatus: session.payment_status
      }
    },
    create: {
      leaseId: lease.id,
      amount: lease.monthlyRent,
      tenantId,
      transactionId: session.id,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
      paymentData: {
        checkoutUrl: session.url,
        sessionId: session.id,
        currency: session.currency || "USD",
        paymentStatus: session.payment_status
      }
    }
  });
  return {
    url: session.url
  };
};
var handleWebhookIntoDB = async (payload, signature) => {
  try {
    console.log("\u{1F525} WEBHOOK START");
    const endpointSecret = config_default.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
    console.log("\u{1F525} EVENT TYPE:", event.type);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("\u{1F525} SESSION ID:", session.id);
        console.log("\u{1F525} METADATA:", session.metadata);
        const leaseId = session.metadata?.leaseId;
        console.log("\u{1F525} LEASE ID:", leaseId);
        if (leaseId) {
          await prisma.payment.update({
            where: {
              leaseId
            },
            data: {
              status: PaymentStatus.COMPLETED,
              transactionId: session.payment_intent,
              paymentData: {
                checkUrl: session.url,
                sessionId: session.id,
                currency: session.currency || "usd",
                paymentStatus: session.payment_status
              }
            }
          });
          console.log("\u{1F525} PAYMENT UPDATED");
        }
        break;
      }
    }
    console.log("\u{1F525} WEBHOOK SUCCESS");
  } catch (error) {
    console.error("\u{1F525}\u{1F525} WEBHOOK ERROR:", error);
    throw error;
  }
};
var getMyPaymentIntoDB = async (tenantId) => {
  const payments = await prisma.payment.findMany({
    where: {
      tenantId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return payments;
};
var paymentService = {
  createPaymentsIntoDB,
  handleWebhookIntoDB,
  getMyPaymentIntoDB
};

// src/modules/payments/payments.controller.ts
import httpStatus9 from "http-status";
var createPayment = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    const payload = createPaymentSchema.safeParse(req.body);
    const result = await paymentService.createPaymentsIntoDB(
      tenantId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Payment session created successfully",
      data: result
    });
  }
);
var handleWebhook = catchAsync(
  async (req, res, next) => {
    const event = req.body;
    const signature = req.headers["stripe-signature"];
    const result = await paymentService.handleWebhookIntoDB(
      event,
      signature
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Webhook processed successfully",
      data: result
    });
  }
);
var getMyPayment = catchAsync(async (req, res, next) => {
  const tenantId = req.user?.id;
  const result = await paymentService.getMyPaymentIntoDB(tenantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My payments retrieved successfully",
    data: result
  });
});
var paymentController = {
  createPayment,
  handleWebhook,
  getMyPayment
};

// src/modules/payments/payments.routes.ts
var router8 = Router8();
router8.post("/", auth(Role.TENANT), paymentController.createPayment);
router8.post("/webhook", paymentController.handleWebhook);
router8.get("/", auth(Role.TENANT), paymentController.getMyPayment);
var paymentRoutes = router8;

// src/modules/propertyCategory/propertyCategory.routes.ts
import { Router as Router9 } from "express";

// src/modules/propertyCategory/propertyCategory.validation.ts
import { z as z9 } from "zod";
var createPropertyCategorySchema = z9.object({
  name: z9.string().min(2, "Category name must be at least 2 characters"),
  slug: z9.string().min(2, "Slug must be at least 2 characters").regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only"
  ),
  description: z9.string().optional(),
  isActive: z9.boolean().optional(),
  sortOrder: z9.number().int().nonnegative().optional()
});
var updatePropertyCategorySchema = z9.object({
  name: z9.string().min(2, "Category name must be at least 2 characters").optional(),
  slug: z9.string().min(2, "Slug must be at least 2 characters").regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only"
  ).optional(),
  description: z9.string().optional(),
  isActive: z9.boolean().optional(),
  sortOrder: z9.number().int().nonnegative().optional()
});

// src/modules/propertyCategory/propertyCategory.service.ts
var createPropertyCategoryIntoDB = async (payload) => {
  const { name, slug, description, isActive, sortOrder } = payload;
  const result = await prisma.propertyCategory.create({
    data: {
      name,
      slug,
      description,
      isActive,
      sortOrder
    }
  });
  return result;
};
var getAllPropertyCategoryIntoDB = async () => {
  const result = await prisma.propertyCategory.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      properties: true
    }
  });
  return result;
};
var getPropertyCategoryByIdIntoDB = async (id) => {
  const result = await prisma.propertyCategory.findUnique({
    where: { id },
    include: {
      properties: true
    }
  });
  if (!result) {
    throw new Error("Property category not found");
  }
  return result;
};
var updatePropertyCategoryIntoDB = async (id, payload) => {
  const isPropertyCategoryExists = await prisma.propertyCategory.findUnique({
    where: { id }
  });
  if (!isPropertyCategoryExists) {
    throw new Error("Property category does not exist");
  }
  const updatePropertyCategory2 = await prisma.propertyCategory.update({
    where: { id },
    data: {
      ...payload
    }
  });
  return updatePropertyCategory2;
};
var deletePropertyCategoryIntoDB = async (id) => {
  const isCategoryExists = await prisma.propertyCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          properties: true
        }
      }
    }
  });
  if (!isCategoryExists) {
    throw new Error("Category does not exist");
  }
  if (isCategoryExists._count.properties > 0) {
    throw new Error("Cannot delete category because properties exist");
  }
  const deleteCategory = await prisma.propertyCategory.delete({
    where: { id }
  });
  return deleteCategory;
};
var updatePropertyCategoryImageIntoDB = async (id, buffer) => {
  const isCategoryExists = await prisma.propertyCategory.findUnique({
    where: { id }
  });
  if (!isCategoryExists) {
    throw new Error("Category does not exist");
  }
  if (isCategoryExists.categoryImgPublicId) {
    await cloudinary.uploader.destroy(isCategoryExists.categoryImgPublicId);
  }
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "property-categories",
          resource_type: "auto"
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
            return reject(new Error("Cloudinary upload failed"));
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    }
  );
  const updatedCategory = await prisma.propertyCategory.update({
    where: { id },
    data: {
      categoryImg: cloudinaryResult.secure_url,
      categoryImgPublicId: cloudinaryResult.public_id
    }
  });
  return updatedCategory;
};
var propertyCategoryService = {
  createPropertyCategoryIntoDB,
  getAllPropertyCategoryIntoDB,
  getPropertyCategoryByIdIntoDB,
  updatePropertyCategoryIntoDB,
  deletePropertyCategoryIntoDB,
  updatePropertyCategoryImageIntoDB
};

// src/modules/propertyCategory/propertyCategory.controller.ts
import httpStatus10 from "http-status";
var createPropertyCategory = catchAsync(
  async (req, res, next) => {
    const payload = createPropertyCategorySchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await propertyCategoryService.createPropertyCategoryIntoDB(
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.CREATED,
      message: "Property category created successfully",
      data: result
    });
  }
);
var getAllPropertyCategory = catchAsync(
  async (req, res, next) => {
    const result = await propertyCategoryService.getAllPropertyCategoryIntoDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Property category fetched successfully",
      data: result
    });
  }
);
var getPropertyCategoryById = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await propertyCategoryService.getPropertyCategoryByIdIntoDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Single property category fetched successfully",
      data: result
    });
  }
);
var updatePropertyCategory = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = updatePropertyCategorySchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await propertyCategoryService.updatePropertyCategoryIntoDB(
      id,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Property category updated successfully",
      data: result
    });
  }
);
var deletePropertyCategory = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await propertyCategoryService.deletePropertyCategoryIntoDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Property category deleted successfully",
      data: result
    });
  }
);
var updatePropertyCategoryImage = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      throw new Error("Category image is required");
    }
    const result = await propertyCategoryService.updatePropertyCategoryImageIntoDB(
      id,
      file.buffer
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Property category Img updated successfully",
      data: result
    });
  }
);
var propertyCategoryController = {
  createPropertyCategory,
  getAllPropertyCategory,
  getPropertyCategoryById,
  updatePropertyCategory,
  deletePropertyCategory,
  updatePropertyCategoryImage
};

// src/modules/propertyCategory/propertyCategory.routes.ts
var router9 = Router9();
router9.post("/", propertyCategoryController.createPropertyCategory);
router9.get("/", propertyCategoryController.getAllPropertyCategory);
router9.get("/:id", propertyCategoryController.getPropertyCategoryById);
router9.patch("/:id", propertyCategoryController.updatePropertyCategory);
router9.delete("/:id", propertyCategoryController.deletePropertyCategory);
router9.patch(
  "/:id/image",
  upload.single("categoryImg"),
  propertyCategoryController.updatePropertyCategoryImage
);
var propertyCategoryRoutes = router9;

// src/modules/dashboard/dashboard.routes.ts
import { Router as Router10 } from "express";

// src/modules/dashboard/dashboard.service.ts
var getTenantDashboardOverviewIntoDB = async (tenantId) => {
  const activeLease = await prisma.lease.findFirst({
    where: {
      status: LeaseStatus.ACTIVE,
      application: {
        tenantId
      }
    },
    select: {
      id: true,
      monthlyRent: true,
      startDate: true,
      endDate: true,
      isSigned: true
    }
  });
  const [totalPayments, completedPayments, pendingPayments] = await Promise.all(
    [
      prisma.payment.count({
        where: {
          tenantId
        }
      }),
      prisma.payment.count({
        where: {
          tenantId,
          status: PaymentStatus.COMPLETED
        }
      }),
      prisma.payment.count({
        where: {
          tenantId,
          status: PaymentStatus.PENDING
        }
      })
    ]
  );
  return {
    activeLease,
    monthlyRent: activeLease?.monthlyRent || 0,
    totalPayments,
    completedPayments,
    pendingPayments
  };
};
var getAdminDashboardOverviewIntoDB = async () => {
  const [
    totalUsers,
    totalProperties,
    totalListings,
    pendingApplications,
    activeLeases,
    completedPayments,
    pendingNidVerifications
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.listing.count(),
    prisma.application.count({
      where: {
        status: ApplicationStatus.PENDING
      }
    }),
    prisma.lease.count({
      where: {
        status: LeaseStatus.ACTIVE
      }
    }),
    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED
      }
    }),
    prisma.identityVerification.count({
      where: {
        status: VerificationStatus.PENDING
      }
    })
  ]);
  return {
    totalUsers,
    totalProperties,
    totalListings,
    pendingApplications,
    activeLeases,
    completedPayments,
    pendingNidVerifications
  };
};
var getOwnerDashboardOverviewIntoDB = async (ownerId) => {
  const [
    totalProperties,
    totalListings,
    totalApplications,
    pendingApplications,
    activeLeases,
    completedPayments
  ] = await Promise.all([
    prisma.property.count({
      where: {
        ownerId
      }
    }),
    prisma.listing.count({
      where: {
        room: {
          property: {
            ownerId
          }
        }
      }
    }),
    prisma.application.count({
      where: {
        room: {
          property: {
            ownerId
          }
        }
      }
    }),
    prisma.application.count({
      where: {
        status: ApplicationStatus.PENDING,
        room: {
          property: {
            ownerId
          }
        }
      }
    }),
    prisma.lease.count({
      where: {
        status: LeaseStatus.ACTIVE,
        application: {
          room: {
            property: {
              ownerId
            }
          }
        }
      }
    }),
    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED,
        lease: {
          application: {
            room: {
              property: {
                ownerId
              }
            }
          }
        }
      }
    })
  ]);
  return {
    totalProperties,
    totalListings,
    totalApplications,
    pendingApplications,
    activeLeases,
    completedPayments
  };
};
var getAllUsersIntoDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var dashboardService = {
  getTenantDashboardOverviewIntoDB,
  getAdminDashboardOverviewIntoDB,
  getOwnerDashboardOverviewIntoDB,
  getAllUsersIntoDB
};

// src/modules/dashboard/dashboard.controller.ts
var getTenantDashboardOverview = catchAsync(
  async (req, res) => {
    const tenantId = req.user.id;
    const result = await dashboardService.getTenantDashboardOverviewIntoDB(tenantId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard overview retrieved successfully",
      data: result
    });
  }
);
var getAdminDashboardOverview = catchAsync(async (req, res, next) => {
  const result = await dashboardService.getAdminDashboardOverviewIntoDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin overview retrieved successfully",
    data: result
  });
});
var getOwnerDashboardOverview = catchAsync(
  async (req, res) => {
    const ownerId = req.user.id;
    const result = await dashboardService.getOwnerDashboardOverviewIntoDB(ownerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Owner dashboard overview retrieved successfully",
      data: result
    });
  }
);
var getAllUsers = catchAsync(async (req, res, next) => {
  const result = await dashboardService.getAllUsersIntoDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users fetched successfully",
    data: result
  });
});
var dashboardController = {
  getTenantDashboardOverview,
  getAdminDashboardOverview,
  getOwnerDashboardOverview,
  getAllUsers
};

// src/modules/dashboard/dashboard.routes.ts
var router10 = Router10();
router10.get(
  "/tenant-overview",
  auth(Role.TENANT),
  dashboardController.getTenantDashboardOverview
);
router10.get(
  "/admin-overview",
  auth(Role.ADMIN),
  dashboardController.getAdminDashboardOverview
);
router10.get(
  "/owner-overview",
  auth(Role.ADMIN, Role.OWNER),
  dashboardController.getOwnerDashboardOverview
);
router10.get("/users", auth(Role.ADMIN), dashboardController.getAllUsers);
var dashboardRoutes = router10;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://nestora-f.vercel.app",
      "nestora-f.vercel.app",
      "https://nestora-f.vercel.app"
    ],
    credentials: true
  })
);
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Housing and Rental Platform");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/property-categories", propertyCategoryRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/listing", listingRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/verification", nidVerificationRoutes);
app.use("/api/v1/lease", leaseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 8e3;
async function main() {
  try {
    app_default.listen(PORT, () => {
      console.log(`Assignment 6 is running ${PORT}`);
    });
    await redisClient.connect();
    console.log("Redis connected successfully");
    await transporter.verify();
    console.log("Nodemailer connected successfully");
  } catch (error) {
    console.log(error);
  }
}
main();
//# sourceMappingURL=server.js.map