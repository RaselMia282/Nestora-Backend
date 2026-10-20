
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
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
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path3 = require("path");
    var os = require("os");
    var crypto2 = require("crypto");
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
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports2, module2) {
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
    module2.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
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
var import_express11 = __toESM(require("express"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/config/index.ts
var import_dotenv = __toESM(require_main(), 1);
var import_path = __toESM(require("path"), 1);
import_dotenv.default.config({
  path: import_path.default.join(process.cwd(), ".env")
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

// src/modules/auth/auth.routes.ts
var import_express = require("express");

// src/modules/auth/auth.controller.ts
var import_http_status2 = __toESM(require("http-status"), 1);

// src/utilis/catchAsync.ts
var import_http_status = __toESM(require("http-status"), 1);
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(import_http_status.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: import_http_status.default.INTERNAL_SERVER_ERROR,
        message: "",
        error: error.message
      });
    }
  };
};

// src/modules/auth/auth.validation.ts
var import_zod = __toESM(require("zod"), 1);

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
var registerUserSchema = import_zod.default.object({
  firstName: import_zod.default.string().min(2),
  lastName: import_zod.default.string().optional(),
  email: import_zod.default.string().email("Invalid email"),
  password: import_zod.default.string().min(6, "password atleast must be 6 characters or long"),
  phone: import_zod.default.string().optional(),
  gender: import_zod.default.enum(Gender).optional(),
  role: import_zod.default.enum([Role.TENANT, Role.ADMIN, Role.MANAGER, Role.OWNER]).default(Role.TENANT)
});
var loginUserSchema = import_zod.default.object({
  email: import_zod.default.string().email("Invalid email"),
  password: import_zod.default.string().min(6, "password atleast must be 6 characters or long")
});
var googleLoginSchema = import_zod.default.object({
  idToken: import_zod.default.string().min(1),
  required_error: "Google ID Token is required"
});
var forgotPasswordSchema = import_zod.default.object({
  email: import_zod.default.string().email("Invalid email")
});
var resetPasswordSchema = import_zod.default.object({
  email: import_zod.default.string({
    message: "Email is required"
  }).email("Invalid email address"),
  newPassword: import_zod.default.string({
    message: "Password is required"
  }).min(6, "Password must be at least 6 characters long"),
  otp: import_zod.default.string({
    message: "OTP is required"
  }).length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain numbers only")
});

// src/modules/auth/auth.service.ts
var import_ejs = __toESM(require("ejs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

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
var import_adapter_pg = require("@prisma/adapter-pg");

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"), 1);
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model PropertyCategory {\n  id                  String   @id @default(uuid())\n  name                String   @unique\n  slug                String   @unique\n  description         String?\n  categoryImg         String?\n  categoryImgPublicId String?\n  isActive            Boolean  @default(true)\n  sortOrder           Int      @default(0)\n  createdAt           DateTime @default(now())\n  updatedAt           DateTime @updatedAt\n\n  properties Property[]\n\n  @@map("property_categories")\n}\n\nmodel Application {\n  id        String            @id @default(uuid())\n  roomId    String\n  tenantId  String\n  status    ApplicationStatus @default(PENDING)\n  createdAt DateTime          @default(now())\n  updatedAt DateTime          @updatedAt\n\n  room   Room   @relation(fields: [roomId], references: [id], onDelete: Cascade)\n  tenant User   @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n  lease  Lease?\n\n  @@index([roomId])\n  @@index([tenantId])\n  @@index([status])\n  @@map("applications")\n}\n\nenum Role {\n  OWNER\n  TENANT\n  MANAGER\n\n  ADMIN\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum RoomStatus {\n  AVAILABLE\n  RESERVED\n  OCCUPIED\n}\n\nenum ApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  SUSPENDED\n  DELETED\n}\n\nenum PropertyType {\n  APARTMENT\n  HOUSE\n  CONDO\n  VILLA\n  TOWNHOUSE\n  DUPLEX\n}\n\nenum RoomType {\n  SINGLE\n  DOUBLE\n  MASTER\n  SHARED\n}\n\nenum VerificationStatus {\n  PENDING\n  VERIFIED\n  REJECTED\n}\n\nenum LeaseStatus {\n  ACTIVE\n  TERMINATED\n}\n\nenum PaymentMethod {\n  CREDIT_CARD\n  SSLCOMMERZ\n  BKASH\n\n  CASH_ON_DELIVERY\n  STRIPE\n}\n\nmodel Lease {\n  id              String      @id @default(uuid())\n  applicationId   String      @unique\n  startDate       DateTime\n  endDate         DateTime\n  monthlyRent     Float\n  securityDeposit Float\n  isSigned        Boolean     @default(false)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n  status          LeaseStatus @default(ACTIVE)\n  application     Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)\n  payments        Payment[]\n\n  @@map("leases")\n}\n\nmodel Listing {\n  id          String   @id @default(uuid())\n  roomId      String   @unique\n  title       String\n  description String\n  isPublished Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  @@map("listings")\n}\n\nmodel Payment {\n  id            String @id @default(uuid())\n  leaseId       String @unique\n  tenantId      String\n  transactionId String @unique\n  amount        Float\n\n  paymentMethod PaymentMethod?\n  paymentData   Json?\n  status        PaymentStatus  @default(PENDING)\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n\n  lease  Lease @relation(fields: [leaseId], references: [id], onDelete: Cascade)\n  tenant User  @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  @@map("payments")\n}\n\nmodel Profile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  firstName      String\n  lastName       String?\n  phone          String?\n  gender         Gender?\n  avatarUrl      String?\n  avatarPublicId String?\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("profiles")\n}\n\nmodel Property {\n  id          String  @id @default(uuid())\n  ownerId     String\n  title       String\n  address     String\n  city        String\n  description String? @db.Text\n\n  propertyImg         String?\n  propertyImgPublicId String?\n  categoryId          String\n  createdAt           DateTime @default(now())\n  updatedAt           DateTime @updatedAt\n\n  category PropertyCategory @relation(fields: [categoryId], references: [id])\n  owner    User             @relation(fields: [ownerId], references: [id], onDelete: Cascade)\n  rooms    Room[]\n\n  @@index([ownerId])\n  @@index([city])\n  @@map("properties")\n}\n\nmodel Room {\n  id         String     @id @default(uuid())\n  propertyId String\n  roomNumber String\n  roomType   RoomType\n  baseRent   Decimal    @db.Decimal(10, 2)\n  status     RoomStatus @default(AVAILABLE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  property     Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n  images       RoomImage[]\n  listing      Listing?\n  applications Application[]\n\n  @@unique([propertyId, roomNumber])\n  @@index([propertyId])\n  @@map("rooms")\n}\n\nmodel RoomImage {\n  id        String   @id @default(uuid())\n  roomId    String\n  imageUrl  String\n  publicId  String\n  createdAt DateTime @default(now())\n\n  room Room @relation(fields: [roomId], references: [id], onDelete: Cascade)\n\n  @@index([roomId])\n  @@map("room_images")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id    String @id @default(uuid())\n  email String @unique\n\n  password             String?\n  role                 Role                  @default(TENANT)\n  authProvider         AuthProvider          @default(CREDENTIAL)\n  googleId             String?               @unique\n  createdAt            DateTime              @default(now())\n  updatedAt            DateTime              @updatedAt\n  status               UserStatus            @default(ACTIVE)\n  profile              Profile?\n  properties           Property[]\n  applications         Application[]\n  payments             Payment[]\n  identityVerification IdentityVerification?\n\n  @@map("users")\n}\n\nmodel IdentityVerification {\n  id               String             @id @default(uuid())\n  userId           String             @unique\n  nidNumber        String?            @unique\n  nidFrontUrl      String?\n  nidFrontPublicId String?\n  nidBackUrl       String?\n  nidBackPublicId  String?\n  status           VerificationStatus @default(PENDING)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([status])\n  @@map("identity_verifications")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"PropertyCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"categoryImg","kind":"scalar","type":"String"},{"name":"categoryImgPublicId","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToPropertyCategory"}],"dbName":"property_categories","schema":null},"Application":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ApplicationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"ApplicationToRoom"},{"name":"tenant","kind":"object","type":"User","relationName":"ApplicationToUser"},{"name":"lease","kind":"object","type":"Lease","relationName":"ApplicationToLease"}],"dbName":"applications","schema":null},"Lease":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicationId","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"monthlyRent","kind":"scalar","type":"Float"},{"name":"securityDeposit","kind":"scalar","type":"Float"},{"name":"isSigned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"LeaseStatus"},{"name":"application","kind":"object","type":"Application","relationName":"ApplicationToLease"},{"name":"payments","kind":"object","type":"Payment","relationName":"LeaseToPayment"}],"dbName":"leases","schema":null},"Listing":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"ListingToRoom"}],"dbName":"listings","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"leaseId","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentData","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"lease","kind":"object","type":"Lease","relationName":"LeaseToPayment"},{"name":"tenant","kind":"object","type":"User","relationName":"PaymentToUser"}],"dbName":"payments","schema":null},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"firstName","kind":"scalar","type":"String"},{"name":"lastName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"avatarPublicId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"}],"dbName":"profiles","schema":null},"Property":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"propertyImg","kind":"scalar","type":"String"},{"name":"propertyImgPublicId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"PropertyCategory","relationName":"PropertyToPropertyCategory"},{"name":"owner","kind":"object","type":"User","relationName":"PropertyToUser"},{"name":"rooms","kind":"object","type":"Room","relationName":"PropertyToRoom"}],"dbName":"properties","schema":null},"Room":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"roomNumber","kind":"scalar","type":"String"},{"name":"roomType","kind":"enum","type":"RoomType"},{"name":"baseRent","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"RoomStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToRoom"},{"name":"images","kind":"object","type":"RoomImage","relationName":"RoomToRoomImage"},{"name":"listing","kind":"object","type":"Listing","relationName":"ListingToRoom"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToRoom"}],"dbName":"rooms","schema":null},"RoomImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"roomId","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"room","kind":"object","type":"Room","relationName":"RoomToRoomImage"}],"dbName":"room_images","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToUser"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"identityVerification","kind":"object","type":"IdentityVerification","relationName":"IdentityVerificationToUser"}],"dbName":"users","schema":null},"IdentityVerification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"nidNumber","kind":"scalar","type":"String"},{"name":"nidFrontUrl","kind":"scalar","type":"String"},{"name":"nidFrontPublicId","kind":"scalar","type":"String"},{"name":"nidBackUrl","kind":"scalar","type":"String"},{"name":"nidBackPublicId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"VerificationStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"IdentityVerificationToUser"}],"dbName":"identity_verifications","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","category","user","profile","properties","property","room","images","listing","applications","_count","tenant","application","lease","payments","identityVerification","owner","rooms","PropertyCategory.findUnique","PropertyCategory.findUniqueOrThrow","PropertyCategory.findFirst","PropertyCategory.findFirstOrThrow","PropertyCategory.findMany","data","PropertyCategory.createOne","PropertyCategory.createMany","PropertyCategory.createManyAndReturn","PropertyCategory.updateOne","PropertyCategory.updateMany","PropertyCategory.updateManyAndReturn","create","update","PropertyCategory.upsertOne","PropertyCategory.deleteOne","PropertyCategory.deleteMany","having","_avg","_sum","_min","_max","PropertyCategory.groupBy","PropertyCategory.aggregate","Application.findUnique","Application.findUniqueOrThrow","Application.findFirst","Application.findFirstOrThrow","Application.findMany","Application.createOne","Application.createMany","Application.createManyAndReturn","Application.updateOne","Application.updateMany","Application.updateManyAndReturn","Application.upsertOne","Application.deleteOne","Application.deleteMany","Application.groupBy","Application.aggregate","Lease.findUnique","Lease.findUniqueOrThrow","Lease.findFirst","Lease.findFirstOrThrow","Lease.findMany","Lease.createOne","Lease.createMany","Lease.createManyAndReturn","Lease.updateOne","Lease.updateMany","Lease.updateManyAndReturn","Lease.upsertOne","Lease.deleteOne","Lease.deleteMany","Lease.groupBy","Lease.aggregate","Listing.findUnique","Listing.findUniqueOrThrow","Listing.findFirst","Listing.findFirstOrThrow","Listing.findMany","Listing.createOne","Listing.createMany","Listing.createManyAndReturn","Listing.updateOne","Listing.updateMany","Listing.updateManyAndReturn","Listing.upsertOne","Listing.deleteOne","Listing.deleteMany","Listing.groupBy","Listing.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Property.findUnique","Property.findUniqueOrThrow","Property.findFirst","Property.findFirstOrThrow","Property.findMany","Property.createOne","Property.createMany","Property.createManyAndReturn","Property.updateOne","Property.updateMany","Property.updateManyAndReturn","Property.upsertOne","Property.deleteOne","Property.deleteMany","Property.groupBy","Property.aggregate","Room.findUnique","Room.findUniqueOrThrow","Room.findFirst","Room.findFirstOrThrow","Room.findMany","Room.createOne","Room.createMany","Room.createManyAndReturn","Room.updateOne","Room.updateMany","Room.updateManyAndReturn","Room.upsertOne","Room.deleteOne","Room.deleteMany","Room.groupBy","Room.aggregate","RoomImage.findUnique","RoomImage.findUniqueOrThrow","RoomImage.findFirst","RoomImage.findFirstOrThrow","RoomImage.findMany","RoomImage.createOne","RoomImage.createMany","RoomImage.createManyAndReturn","RoomImage.updateOne","RoomImage.updateMany","RoomImage.updateManyAndReturn","RoomImage.upsertOne","RoomImage.deleteOne","RoomImage.deleteMany","RoomImage.groupBy","RoomImage.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","IdentityVerification.findUnique","IdentityVerification.findUniqueOrThrow","IdentityVerification.findFirst","IdentityVerification.findFirstOrThrow","IdentityVerification.findMany","IdentityVerification.createOne","IdentityVerification.createMany","IdentityVerification.createManyAndReturn","IdentityVerification.updateOne","IdentityVerification.updateMany","IdentityVerification.updateManyAndReturn","IdentityVerification.upsertOne","IdentityVerification.deleteOne","IdentityVerification.deleteMany","IdentityVerification.groupBy","IdentityVerification.aggregate","AND","OR","NOT","id","userId","nidNumber","nidFrontUrl","nidFrontPublicId","nidBackUrl","nidBackPublicId","VerificationStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","email","password","Role","role","AuthProvider","authProvider","googleId","UserStatus","every","some","none","roomId","imageUrl","publicId","propertyId","roomNumber","RoomType","roomType","baseRent","RoomStatus","ownerId","title","address","city","description","propertyImg","propertyImgPublicId","categoryId","firstName","lastName","phone","Gender","gender","avatarUrl","avatarPublicId","leaseId","tenantId","transactionId","amount","PaymentMethod","paymentMethod","paymentData","PaymentStatus","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","isPublished","applicationId","startDate","endDate","monthlyRent","securityDeposit","isSigned","LeaseStatus","ApplicationStatus","name","slug","categoryImg","categoryImgPublicId","isActive","sortOrder","propertyId_roomNumber","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "wgVmsAEOBgAAzAIAIMwBAACEAwAwzQEAACsAEM4BAACEAwAwzwEBAAAAAdgBQAC6AgAh2QFAALoCACH9AQEAuAIAIZ8CAQAAAAGgAgEAAAABoQIBALgCACGiAgEAuAIAIaMCIADzAgAhpAICAIUDACEBAAAAAQAgEQMAAJgDACASAAC7AgAgEwAAmQMAIMwBAACXAwAwzQEAAAMAEM4BAACXAwAwzwEBAMcCACHYAUAAugIAIdkBQAC6AgAh-QEBAMcCACH6AQEAxwIAIfsBAQDHAgAh_AEBAMcCACH9AQEAuAIAIf4BAQC4AgAh_wEBALgCACGAAgEAxwIAIQYDAAD9BAAgEgAApAMAIBMAAP4EACD9AQAAmgMAIP4BAACaAwAg_wEAAJoDACARAwAAmAMAIBIAALsCACATAACZAwAgzAEAAJcDADDNAQAAAwAQzgEAAJcDADDPAQEAAAAB2AFAALoCACHZAUAAugIAIfkBAQDHAgAh-gEBAMcCACH7AQEAxwIAIfwBAQDHAgAh_QEBALgCACH-AQEAuAIAIf8BAQC4AgAhgAIBAMcCACEDAAAAAwAgAQAABAAwAgAABQAgDgQAALsCACDMAQAA4AIAMM0BAAAHABDOAQAA4AIAMM8BAQDHAgAh0AEBAMcCACHYAUAAugIAIdkBQAC6AgAhgQIBAMcCACGCAgEAuAIAIYMCAQC4AgAhhQIAAOEChQIjhgIBALgCACGHAgEAuAIAIQEAAAAHACADAAAAAwAgAQAABAAwAgAABQAgDAgAAPQCACANAAC7AgAgDwAAlgMAIMwBAACUAwAwzQEAAAoAEM4BAACUAwAwzwEBAMcCACHXAQAAlQOfAiLYAUAAugIAIdkBQAC6AgAh8AEBAMcCACGJAgEAxwIAIQMIAADcBAAgDQAApAMAIA8AAPwEACAMCAAA9AIAIA0AALsCACAPAACWAwAgzAEAAJQDADDNAQAACgAQzgEAAJQDADDPAQEAAAAB1wEAAJUDnwIi2AFAALoCACHZAUAAugIAIfABAQDHAgAhiQIBAMcCACEDAAAACgAgAQAACwAwAgAADAAgCQgAAPQCACDMAQAAkwMAMM0BAAAOABDOAQAAkwMAMM8BAQDHAgAh2AFAALoCACHwAQEAxwIAIfEBAQDHAgAh8gEBAMcCACEBCAAA3AQAIAkIAAD0AgAgzAEAAJMDADDNAQAADgAQzgEAAJMDADDPAQEAAAAB2AFAALoCACHwAQEAxwIAIfEBAQDHAgAh8gEBAMcCACEDAAAADgAgAQAADwAwAgAAEAAgCwgAAPQCACDMAQAA8gIAMM0BAAASABDOAQAA8gIAMM8BAQDHAgAh2AFAALoCACHZAUAAugIAIfABAQDHAgAh-gEBAMcCACH9AQEAxwIAIZYCIADzAgAhAQAAABIAIAMAAAAKACABAAALADACAAAMACABAAAADgAgAQAAAAoAIA8OAAD8AgAgEAAAzgIAIMwBAAD5AgAwzQEAABcAEM4BAAD5AgAwzwEBAMcCACHXAQAA-wKeAiLYAUAAugIAIdkBQAC6AgAhlwIBAMcCACGYAkAAugIAIZkCQAC6AgAhmgIIAPoCACGbAggA-gIAIZwCIADzAgAhAQAAABcAIA8NAAC7AgAgDwAAkgMAIMwBAACOAwAwzQEAABkAEM4BAACOAwAwzwEBAMcCACHXAQAAkQOQAiLYAUAAugIAIdkBQAC6AgAhiAIBAMcCACGJAgEAxwIAIYoCAQDHAgAhiwIIAPoCACGNAgAAjwONAiOOAgAAkAMAIAQNAACkAwAgDwAA_AQAII0CAACaAwAgjgIAAJoDACAPDQAAuwIAIA8AAJIDACDMAQAAjgMAMM0BAAAZABDOAQAAjgMAMM8BAQAAAAHXAQAAkQOQAiLYAUAAugIAIdkBQAC6AgAhiAIBAAAAAYkCAQDHAgAhigIBAAAAAYsCCAD6AgAhjQIAAI8DjQIjjgIAAJADACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAABkAIAMAAAAZACABAAAaADACAAAbACAOBAAAuwIAIMwBAAC3AgAwzQEAAB8AEM4BAAC3AgAwzwEBAMcCACHQAQEAxwIAIdEBAQC4AgAh0gEBALgCACHTAQEAuAIAIdQBAQC4AgAh1QEBALgCACHXAQAAuQLXASLYAUAAugIAIdkBQAC6AgAhAQAAAB8AIAEAAAADACABAAAACgAgAQAAABkAIA8HAACLAwAgCQAAjAMAIAoAAI0DACALAADNAgAgzAEAAIcDADDNAQAAJAAQzgEAAIcDADDPAQEAxwIAIdcBAACKA_kBItgBQAC6AgAh2QFAALoCACHzAQEAxwIAIfQBAQDHAgAh9gEAAIgD9gEi9wEQAIkDACEEBwAA-QQAIAkAAPoEACAKAAD7BAAgCwAAuQQAIBAHAACLAwAgCQAAjAMAIAoAAI0DACALAADNAgAgzAEAAIcDADDNAQAAJAAQzgEAAIcDADDPAQEAAAAB1wEAAIoD-QEi2AFAALoCACHZAUAAugIAIfMBAQDHAgAh9AEBAMcCACH2AQAAiAP2ASL3ARAAiQMAIaUCAACGAwAgAwAAACQAIAEAACUAMAIAACYAIAEAAAAkACABAAAAAwAgAQAAAAEAIA4GAADMAgAgzAEAAIQDADDNAQAAKwAQzgEAAIQDADDPAQEAxwIAIdgBQAC6AgAh2QFAALoCACH9AQEAuAIAIZ8CAQDHAgAhoAIBAMcCACGhAgEAuAIAIaICAQC4AgAhowIgAPMCACGkAgIAhQMAIQQGAAC4BAAg_QEAAJoDACChAgAAmgMAIKICAACaAwAgAwAAACsAIAEAACwAMAIAAAEAIAMAAAArACABAAAsADACAAABACADAAAAKwAgAQAALAAwAgAAAQAgCwYAAPgEACDPAQEAAAAB2AFAAAAAAdkBQAAAAAH9AQEAAAABnwIBAAAAAaACAQAAAAGhAgEAAAABogIBAAAAAaMCIAAAAAGkAgIAAAABARkAADAAIArPAQEAAAAB2AFAAAAAAdkBQAAAAAH9AQEAAAABnwIBAAAAAaACAQAAAAGhAgEAAAABogIBAAAAAaMCIAAAAAGkAgIAAAABARkAADIAMAEZAAAyADALBgAA7gQAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIf0BAQCfAwAhnwIBAJ4DACGgAgEAngMAIaECAQCfAwAhogIBAJ8DACGjAiAA2QMAIaQCAgDtBAAhAgAAAAEAIBkAADUAIArPAQEAngMAIdgBQAChAwAh2QFAAKEDACH9AQEAnwMAIZ8CAQCeAwAhoAIBAJ4DACGhAgEAnwMAIaICAQCfAwAhowIgANkDACGkAgIA7QQAIQIAAAArACAZAAA3ACACAAAAKwAgGQAANwAgAwAAAAEAICAAADAAICEAADUAIAEAAAABACABAAAAKwAgCAwAAOgEACAmAADpBAAgJwAA7AQAICgAAOsEACApAADqBAAg_QEAAJoDACChAgAAmgMAIKICAACaAwAgDcwBAACBAwAwzQEAAD4AEM4BAACBAwAwzwEBAKkCACHYAUAArAIAIdkBQACsAgAh_QEBAKoCACGfAgEAqQIAIaACAQCpAgAhoQIBAKoCACGiAgEAqgIAIaMCIADvAgAhpAICAIIDACEDAAAAKwAgAQAAPQAwJQAAPgAgAwAAACsAIAEAACwAMAIAAAEAIAEAAAAMACABAAAADAAgAwAAAAoAIAEAAAsAMAIAAAwAIAMAAAAKACABAAALADACAAAMACADAAAACgAgAQAACwAwAgAADAAgCQgAAOkDACANAACTBAAgDwAA6gMAIM8BAQAAAAHXAQAAAJ8CAtgBQAAAAAHZAUAAAAAB8AEBAAAAAYkCAQAAAAEBGQAARgAgBs8BAQAAAAHXAQAAAJ8CAtgBQAAAAAHZAUAAAAAB8AEBAAAAAYkCAQAAAAEBGQAASAAwARkAAEgAMAkIAADSAwAgDQAAkQQAIA8AANMDACDPAQEAngMAIdcBAADQA58CItgBQAChAwAh2QFAAKEDACHwAQEAngMAIYkCAQCeAwAhAgAAAAwAIBkAAEsAIAbPAQEAngMAIdcBAADQA58CItgBQAChAwAh2QFAAKEDACHwAQEAngMAIYkCAQCeAwAhAgAAAAoAIBkAAE0AIAIAAAAKACAZAABNACADAAAADAAgIAAARgAgIQAASwAgAQAAAAwAIAEAAAAKACADDAAA5QQAICgAAOcEACApAADmBAAgCcwBAAD9AgAwzQEAAFQAEM4BAAD9AgAwzwEBAKkCACHXAQAA_gKfAiLYAUAArAIAIdkBQACsAgAh8AEBAKkCACGJAgEAqQIAIQMAAAAKACABAABTADAlAABUACADAAAACgAgAQAACwAwAgAADAAgDw4AAPwCACAQAADOAgAgzAEAAPkCADDNAQAAFwAQzgEAAPkCADDPAQEAAAAB1wEAAPsCngIi2AFAALoCACHZAUAAugIAIZcCAQAAAAGYAkAAugIAIZkCQAC6AgAhmgIIAPoCACGbAggA-gIAIZwCIADzAgAhAQAAAFcAIAEAAABXACACDgAA5AQAIBAAALoEACADAAAAFwAgAQAAWgAwAgAAVwAgAwAAABcAIAEAAFoAMAIAAFcAIAMAAAAXACABAABaADACAABXACAMDgAA4wQAIBAAAOcDACDPAQEAAAAB1wEAAACeAgLYAUAAAAAB2QFAAAAAAZcCAQAAAAGYAkAAAAABmQJAAAAAAZoCCAAAAAGbAggAAAABnAIgAAAAAQEZAABeACAKzwEBAAAAAdcBAAAAngIC2AFAAAAAAdkBQAAAAAGXAgEAAAABmAJAAAAAAZkCQAAAAAGaAggAAAABmwIIAAAAAZwCIAAAAAEBGQAAYAAwARkAAGAAMAwOAADiBAAgEAAA2wMAIM8BAQCeAwAh1wEAANoDngIi2AFAAKEDACHZAUAAoQMAIZcCAQCeAwAhmAJAAKEDACGZAkAAoQMAIZoCCAC_AwAhmwIIAL8DACGcAiAA2QMAIQIAAABXACAZAABjACAKzwEBAJ4DACHXAQAA2gOeAiLYAUAAoQMAIdkBQAChAwAhlwIBAJ4DACGYAkAAoQMAIZkCQAChAwAhmgIIAL8DACGbAggAvwMAIZwCIADZAwAhAgAAABcAIBkAAGUAIAIAAAAXACAZAABlACADAAAAVwAgIAAAXgAgIQAAYwAgAQAAAFcAIAEAAAAXACAFDAAA3QQAICYAAN4EACAnAADhBAAgKAAA4AQAICkAAN8EACANzAEAAPUCADDNAQAAbAAQzgEAAPUCADDPAQEAqQIAIdcBAAD2Ap4CItgBQACsAgAh2QFAAKwCACGXAgEAqQIAIZgCQACsAgAhmQJAAKwCACGaAggA4wIAIZsCCADjAgAhnAIgAO8CACEDAAAAFwAgAQAAawAwJQAAbAAgAwAAABcAIAEAAFoAMAIAAFcAIAsIAAD0AgAgzAEAAPICADDNAQAAEgAQzgEAAPICADDPAQEAAAAB2AFAALoCACHZAUAAugIAIfABAQAAAAH6AQEAxwIAIf0BAQDHAgAhlgIgAPMCACEBAAAAbwAgAQAAAG8AIAEIAADcBAAgAwAAABIAIAEAAHIAMAIAAG8AIAMAAAASACABAAByADACAABvACADAAAAEgAgAQAAcgAwAgAAbwAgCAgAANsEACDPAQEAAAAB2AFAAAAAAdkBQAAAAAHwAQEAAAAB-gEBAAAAAf0BAQAAAAGWAiAAAAABARkAAHYAIAfPAQEAAAAB2AFAAAAAAdkBQAAAAAHwAQEAAAAB-gEBAAAAAf0BAQAAAAGWAiAAAAABARkAAHgAMAEZAAB4ADAICAAA2gQAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfABAQCeAwAh-gEBAJ4DACH9AQEAngMAIZYCIADZAwAhAgAAAG8AIBkAAHsAIAfPAQEAngMAIdgBQAChAwAh2QFAAKEDACHwAQEAngMAIfoBAQCeAwAh_QEBAJ4DACGWAiAA2QMAIQIAAAASACAZAAB9ACACAAAAEgAgGQAAfQAgAwAAAG8AICAAAHYAICEAAHsAIAEAAABvACABAAAAEgAgAwwAANcEACAoAADZBAAgKQAA2AQAIArMAQAA7gIAMM0BAACEAQAQzgEAAO4CADDPAQEAqQIAIdgBQACsAgAh2QFAAKwCACHwAQEAqQIAIfoBAQCpAgAh_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-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAEBGQAAugEAIAvPAQEAAAAB2AFAAAAAAdkBQAAAAAH5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQEZAAC8AQAwARkAALwBADAOAwAA9gMAIBIAAMsEACATAAD3AwAgzwEBAJ4DACHYAUAAoQMAIdkBQAChAwAh-QEBAJ4DACH6AQEAngMAIfsBAQCeAwAh_AEBAJ4DACH9AQEAnwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAngMAIQIAAAAFACAZAAC_AQAgC88BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfkBAQCeAwAh-gEBAJ4DACH7AQEAngMAIfwBAQCeAwAh_QEBAJ8DACH-AQEAnwMAIf8BAQCfAwAhgAIBAJ4DACECAAAAAwAgGQAAwQEAIAIAAAADACAZAADBAQAgAwAAAAUAICAAALoBACAhAAC_AQAgAQAAAAUAIAEAAAADACAGDAAAyAQAICgAAMoEACApAADJBAAg_QEAAJoDACD-AQAAmgMAIP8BAACaAwAgDswBAADbAgAwzQEAAMgBABDOAQAA2wIAMM8BAQCpAgAh2AFAAKwCACHZAUAArAIAIfkBAQCpAgAh-gEBAKkCACH7AQEAqQIAIfwBAQCpAgAh_QEBAKoCACH-AQEAqgIAIf8BAQCqAgAhgAIBAKkCACEDAAAAAwAgAQAAxwEAMCUAAMgBACADAAAAAwAgAQAABAAwAgAABQAgAQAAACYAIAEAAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACAMBwAAxwQAIAkAAKYEACAKAACnBAAgCwAAqAQAIM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB8wEBAAAAAfQBAQAAAAH2AQAAAPYBAvcBEAAAAAEBGQAA0AEAIAjPAQEAAAAB1wEAAAD5AQLYAUAAAAAB2QFAAAAAAfMBAQAAAAH0AQEAAAAB9gEAAAD2AQL3ARAAAAABARkAANIBADABGQAA0gEAMAwHAADGBAAgCQAAhgQAIAoAAIcEACALAACIBAAgzwEBAJ4DACHXAQAAhAT5ASLYAUAAoQMAIdkBQAChAwAh8wEBAJ4DACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhAgAAACYAIBkAANUBACAIzwEBAJ4DACHXAQAAhAT5ASLYAUAAoQMAIdkBQAChAwAh8wEBAJ4DACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhAgAAACQAIBkAANcBACACAAAAJAAgGQAA1wEAIAMAAAAmACAgAADQAQAgIQAA1QEAIAEAAAAmACABAAAAJAAgBQwAAMEEACAmAADCBAAgJwAAxQQAICgAAMQEACApAADDBAAgC8wBAADRAgAwzQEAAN4BABDOAQAA0QIAMM8BAQCpAgAh1wEAANQC-QEi2AFAAKwCACHZAUAArAIAIfMBAQCpAgAh9AEBAKkCACH2AQAA0gL2ASL3ARAA0wIAIQMAAAAkACABAADdAQAwJQAA3gEAIAMAAAAkACABAAAlADACAAAmACABAAAAEAAgAQAAABAAIAMAAAAOACABAAAPADACAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAYIAADABAAgzwEBAAAAAdgBQAAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAEBGQAA5gEAIAXPAQEAAAAB2AFAAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAQEZAADoAQAwARkAAOgBADAGCAAAvwQAIM8BAQCeAwAh2AFAAKEDACHwAQEAngMAIfEBAQCeAwAh8gEBAJ4DACECAAAAEAAgGQAA6wEAIAXPAQEAngMAIdgBQAChAwAh8AEBAJ4DACHxAQEAngMAIfIBAQCeAwAhAgAAAA4AIBkAAO0BACACAAAADgAgGQAA7QEAIAMAAAAQACAgAADmAQAgIQAA6wEAIAEAAAAQACABAAAADgAgAwwAALwEACAoAAC-BAAgKQAAvQQAIAjMAQAA0AIAMM0BAAD0AQAQzgEAANACADDPAQEAqQIAIdgBQACsAgAh8AEBAKkCACHxAQEAqQIAIfIBAQCpAgAhAwAAAA4AIAEAAPMBADAlAAD0AQAgAwAAAA4AIAEAAA8AMAIAABAAIBEFAADLAgAgBgAAzAIAIAsAAM0CACAQAADOAgAgEQAAzwIAIMwBAADGAgAwzQEAAPoBABDOAQAAxgIAMM8BAQAAAAHXAQAAygLtASLYAUAAugIAIdkBQAC6AgAh5QEBAAAAAeYBAQC4AgAh6AEAAMgC6AEi6gEAAMkC6gEi6wEBAAAAAQEAAAD3AQAgAQAAAPcBACARBQAAywIAIAYAAMwCACALAADNAgAgEAAAzgIAIBEAAM8CACDMAQAAxgIAMM0BAAD6AQAQzgEAAMYCADDPAQEAxwIAIdcBAADKAu0BItgBQAC6AgAh2QFAALoCACHlAQEAxwIAIeYBAQC4AgAh6AEAAMgC6AEi6gEAAMkC6gEi6wEBALgCACEHBQAAtwQAIAYAALgEACALAAC5BAAgEAAAugQAIBEAALsEACDmAQAAmgMAIOsBAACaAwAgAwAAAPoBACABAAD7AQAwAgAA9wEAIAMAAAD6AQAgAQAA-wEAMAIAAPcBACADAAAA-gEAIAEAAPsBADACAAD3AQAgDgUAALIEACAGAACzBAAgCwAAtAQAIBAAALUEACARAAC2BAAgzwEBAAAAAdcBAAAA7QEC2AFAAAAAAdkBQAAAAAHlAQEAAAAB5gEBAAAAAegBAAAA6AEC6gEAAADqAQLrAQEAAAABARkAAP8BACAJzwEBAAAAAdcBAAAA7QEC2AFAAAAAAdkBQAAAAAHlAQEAAAAB5gEBAAAAAegBAAAA6AEC6gEAAADqAQLrAQEAAAABARkAAIECADABGQAAgQIAMA4FAACrAwAgBgAArAMAIAsAAK0DACAQAACuAwAgEQAArwMAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQIAAAD3AQAgGQAAhAIAIAnPAQEAngMAIdcBAACqA-0BItgBQAChAwAh2QFAAKEDACHlAQEAngMAIeYBAQCfAwAh6AEAAKgD6AEi6gEAAKkD6gEi6wEBAJ8DACECAAAA-gEAIBkAAIYCACACAAAA-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_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-QEI4QEAANUC-QEiBNoBAAAA-QEC2wEAAAD5AQjcAQAAAPkBCOEBAADWAvkBIg0MAACuAgAgJgAA2AIAICcAANgCACAoAADYAgAgKQAA2AIAINoBEAAAAAHbARAAAAAE3AEQAAAABN0BEAAAAAHeARAAAAAB3wEQAAAAAeABEAAAAAHhARAA1wIAIQjaARAAAAAB2wEQAAAABNwBEAAAAATdARAAAAAB3gEQAAAAAd8BEAAAAAHgARAAAAAB4QEQANgCACEHDAAArgIAICgAANoCACApAADaAgAg2gEAAAD2AQLbAQAAAPYBCNwBAAAA9gEI4QEAANkC9gEiBNoBAAAA9gEC2wEAAAD2AQjcAQAAAPYBCOEBAADaAvYBIg7MAQAA2wIAMM0BAADIAQAQzgEAANsCADDPAQEAqQIAIdgBQACsAgAh2QFAAKwCACH5AQEAqQIAIfoBAQCpAgAh-wEBAKkCACH8AQEAqQIAIf0BAQCqAgAh_gEBAKoCACH_AQEAqgIAIYACAQCpAgAhDcwBAADcAgAwzQEAALIBABDOAQAA3AIAMM8BAQCpAgAh0AEBAKkCACHYAUAArAIAIdkBQACsAgAhgQIBAKkCACGCAgEAqgIAIYMCAQCqAgAhhQIAAN0ChQIjhgIBAKoCACGHAgEAqgIAIQcMAACzAgAgKAAA3wIAICkAAN8CACDaAQAAAIUCA9sBAAAAhQIJ3AEAAACFAgnhAQAA3gKFAiMHDAAAswIAICgAAN8CACApAADfAgAg2gEAAACFAgPbAQAAAIUCCdwBAAAAhQIJ4QEAAN4ChQIjBNoBAAAAhQID2wEAAACFAgncAQAAAIUCCeEBAADfAoUCIw4EAAC7AgAgzAEAAOACADDNAQAABwAQzgEAAOACADDPAQEAxwIAIdABAQDHAgAh2AFAALoCACHZAUAAugIAIYECAQDHAgAhggIBALgCACGDAgEAuAIAIYUCAADhAoUCI4YCAQC4AgAhhwIBALgCACEE2gEAAACFAgPbAQAAAIUCCdwBAAAAhQIJ4QEAAN8ChQIjDcwBAADiAgAwzQEAAJoBABDOAQAA4gIAMM8BAQCpAgAh1wEAAOYCkAIi2AFAAKwCACHZAUAArAIAIYgCAQCpAgAhiQIBAKkCACGKAgEAqQIAIYsCCADjAgAhjQIAAOQCjQIjjgIAAOUCACANDAAArgIAICYAAO0CACAnAADtAgAgKAAA7QIAICkAAO0CACDaAQgAAAAB2wEIAAAABNwBCAAAAATdAQgAAAAB3gEIAAAAAd8BCAAAAAHgAQgAAAAB4QEIAOwCACEHDAAAswIAICgAAOsCACApAADrAgAg2gEAAACNAgPbAQAAAI0CCdwBAAAAjQIJ4QEAAOoCjQIjDwwAALMCACAoAADpAgAgKQAA6QIAINoBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAHgAYAAAAAB4QGAAAAAAZACAQAAAAGRAgEAAAABkgIBAAAAAZMCgAAAAAGUAoAAAAABlQKAAAAAAQcMAACuAgAgKAAA6AIAICkAAOgCACDaAQAAAJACAtsBAAAAkAII3AEAAACQAgjhAQAA5wKQAiIHDAAArgIAICgAAOgCACApAADoAgAg2gEAAACQAgLbAQAAAJACCNwBAAAAkAII4QEAAOcCkAIiBNoBAAAAkAIC2wEAAACQAgjcAQAAAJACCOEBAADoApACIgzaAYAAAAAB3QGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAeEBgAAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAGTAoAAAAABlAKAAAAAAZUCgAAAAAEHDAAAswIAICgAAOsCACApAADrAgAg2gEAAACNAgPbAQAAAI0CCdwBAAAAjQIJ4QEAAOoCjQIjBNoBAAAAjQID2wEAAACNAgncAQAAAI0CCeEBAADrAo0CIw0MAACuAgAgJgAA7QIAICcAAO0CACAoAADtAgAgKQAA7QIAINoBCAAAAAHbAQgAAAAE3AEIAAAABN0BCAAAAAHeAQgAAAAB3wEIAAAAAeABCAAAAAHhAQgA7AIAIQjaAQgAAAAB2wEIAAAABNwBCAAAAATdAQgAAAAB3gEIAAAAAd8BCAAAAAHgAQgAAAAB4QEIAO0CACEKzAEAAO4CADDNAQAAhAEAEM4BAADuAgAwzwEBAKkCACHYAUAArAIAIdkBQACsAgAh8AEBAKkCACH6AQEAqQIAIf0BAQCpAgAhlgIgAO8CACEFDAAArgIAICgAAPECACApAADxAgAg2gEgAAAAAeEBIADwAgAhBQwAAK4CACAoAADxAgAgKQAA8QIAINoBIAAAAAHhASAA8AIAIQLaASAAAAAB4QEgAPECACELCAAA9AIAIMwBAADyAgAwzQEAABIAEM4BAADyAgAwzwEBAMcCACHYAUAAugIAIdkBQAC6AgAh8AEBAMcCACH6AQEAxwIAIf0BAQDHAgAhlgIgAPMCACEC2gEgAAAAAeEBIADxAgAhEQcAAIsDACAJAACMAwAgCgAAjQMAIAsAAM0CACDMAQAAhwMAMM0BAAAkABDOAQAAhwMAMM8BAQDHAgAh1wEAAIoD-QEi2AFAALoCACHZAUAAugIAIfMBAQDHAgAh9AEBAMcCACH2AQAAiAP2ASL3ARAAiQMAIaYCAAAkACCnAgAAJAAgDcwBAAD1AgAwzQEAAGwAEM4BAAD1AgAwzwEBAKkCACHXAQAA9gKeAiLYAUAArAIAIdkBQACsAgAhlwIBAKkCACGYAkAArAIAIZkCQACsAgAhmgIIAOMCACGbAggA4wIAIZwCIADvAgAhBwwAAK4CACAoAAD4AgAgKQAA-AIAINoBAAAAngIC2wEAAACeAgjcAQAAAJ4CCOEBAAD3Ap4CIgcMAACuAgAgKAAA-AIAICkAAPgCACDaAQAAAJ4CAtsBAAAAngII3AEAAACeAgjhAQAA9wKeAiIE2gEAAACeAgLbAQAAAJ4CCNwBAAAAngII4QEAAPgCngIiDw4AAPwCACAQAADOAgAgzAEAAPkCADDNAQAAFwAQzgEAAPkCADDPAQEAxwIAIdcBAAD7Ap4CItgBQAC6AgAh2QFAALoCACGXAgEAxwIAIZgCQAC6AgAhmQJAALoCACGaAggA-gIAIZsCCAD6AgAhnAIgAPMCACEI2gEIAAAAAdsBCAAAAATcAQgAAAAE3QEIAAAAAd4BCAAAAAHfAQgAAAAB4AEIAAAAAeEBCADtAgAhBNoBAAAAngIC2wEAAACeAgjcAQAAAJ4CCOEBAAD4Ap4CIg4IAAD0AgAgDQAAuwIAIA8AAJYDACDMAQAAlAMAMM0BAAAKABDOAQAAlAMAMM8BAQDHAgAh1wEAAJUDnwIi2AFAALoCACHZAUAAugIAIfABAQDHAgAhiQIBAMcCACGmAgAACgAgpwIAAAoAIAnMAQAA_QIAMM0BAABUABDOAQAA_QIAMM8BAQCpAgAh1wEAAP4CnwIi2AFAAKwCACHZAUAArAIAIfABAQCpAgAhiQIBAKkCACEHDAAArgIAICgAAIADACApAACAAwAg2gEAAACfAgLbAQAAAJ8CCNwBAAAAnwII4QEAAP8CnwIiBwwAAK4CACAoAACAAwAgKQAAgAMAINoBAAAAnwIC2wEAAACfAgjcAQAAAJ8CCOEBAAD_Ap8CIgTaAQAAAJ8CAtsBAAAAnwII3AEAAACfAgjhAQAAgAOfAiINzAEAAIEDADDNAQAAPgAQzgEAAIEDADDPAQEAqQIAIdgBQACsAgAh2QFAAKwCACH9AQEAqgIAIZ8CAQCpAgAhoAIBAKkCACGhAgEAqgIAIaICAQCqAgAhowIgAO8CACGkAgIAggMAIQ0MAACuAgAgJgAA7QIAICcAAK4CACAoAACuAgAgKQAArgIAINoBAgAAAAHbAQIAAAAE3AECAAAABN0BAgAAAAHeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAgwMAIQ0MAACuAgAgJgAA7QIAICcAAK4CACAoAACuAgAgKQAArgIAINoBAgAAAAHbAQIAAAAE3AECAAAABN0BAgAAAAHeAQIAAAAB3wECAAAAAeABAgAAAAHhAQIAgwMAIQ4GAADMAgAgzAEAAIQDADDNAQAAKwAQzgEAAIQDADDPAQEAxwIAIdgBQAC6AgAh2QFAALoCACH9AQEAuAIAIZ8CAQDHAgAhoAIBAMcCACGhAgEAuAIAIaICAQC4AgAhowIgAPMCACGkAgIAhQMAIQjaAQIAAAAB2wECAAAABNwBAgAAAATdAQIAAAAB3gECAAAAAd8BAgAAAAHgAQIAAAAB4QECAK4CACEC8wEBAAAAAfQBAQAAAAEPBwAAiwMAIAkAAIwDACAKAACNAwAgCwAAzQIAIMwBAACHAwAwzQEAACQAEM4BAACHAwAwzwEBAMcCACHXAQAAigP5ASLYAUAAugIAIdkBQAC6AgAh8wEBAMcCACH0AQEAxwIAIfYBAACIA_YBIvcBEACJAwAhBNoBAAAA9gEC2wEAAAD2AQjcAQAAAPYBCOEBAADaAvYBIgjaARAAAAAB2wEQAAAABNwBEAAAAATdARAAAAAB3gEQAAAAAd8BEAAAAAHgARAAAAAB4QEQANgCACEE2gEAAAD5AQLbAQAAAPkBCNwBAAAA-QEI4QEAANYC-QEiEwMAAJgDACASAAC7AgAgEwAAmQMAIMwBAACXAwAwzQEAAAMAEM4BAACXAwAwzwEBAMcCACHYAUAAugIAIdkBQAC6AgAh-QEBAMcCACH6AQEAxwIAIfsBAQDHAgAh_AEBAMcCACH9AQEAuAIAIf4BAQC4AgAh_wEBALgCACGAAgEAxwIAIaYCAAADACCnAgAAAwAgA-0BAAAOACDuAQAADgAg7wEAAA4AIA0IAAD0AgAgzAEAAPICADDNAQAAEgAQzgEAAPICADDPAQEAxwIAIdgBQAC6AgAh2QFAALoCACHwAQEAxwIAIfoBAQDHAgAh_QEBAMcCACGWAiAA8wIAIaYCAAASACCnAgAAEgAgDw0AALsCACAPAACSAwAgzAEAAI4DADDNAQAAGQAQzgEAAI4DADDPAQEAxwIAIdcBAACRA5ACItgBQAC6AgAh2QFAALoCACGIAgEAxwIAIYkCAQDHAgAhigIBAMcCACGLAggA-gIAIY0CAACPA40CI44CAACQAwAgBNoBAAAAjQID2wEAAACNAgncAQAAAI0CCeEBAADrAo0CIwzaAYAAAAAB3QGAAAAAAd4BgAAAAAHfAYAAAAAB4AGAAAAAAeEBgAAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAGTAoAAAAABlAKAAAAAAZUCgAAAAAEE2gEAAACQAgLbAQAAAJACCNwBAAAAkAII4QEAAOgCkAIiEQ4AAPwCACAQAADOAgAgzAEAAPkCADDNAQAAFwAQzgEAAPkCADDPAQEAxwIAIdcBAAD7Ap4CItgBQAC6AgAh2QFAALoCACGXAgEAxwIAIZgCQAC6AgAhmQJAALoCACGaAggA-gIAIZsCCAD6AgAhnAIgAPMCACGmAgAAFwAgpwIAABcAIAkIAAD0AgAgzAEAAJMDADDNAQAADgAQzgEAAJMDADDPAQEAxwIAIdgBQAC6AgAh8AEBAMcCACHxAQEAxwIAIfIBAQDHAgAhDAgAAPQCACANAAC7AgAgDwAAlgMAIMwBAACUAwAwzQEAAAoAEM4BAACUAwAwzwEBAMcCACHXAQAAlQOfAiLYAUAAugIAIdkBQAC6AgAh8AEBAMcCACGJAgEAxwIAIQTaAQAAAJ8CAtsBAAAAnwII3AEAAACfAgjhAQAAgAOfAiIRDgAA_AIAIBAAAM4CACDMAQAA-QIAMM0BAAAXABDOAQAA-QIAMM8BAQDHAgAh1wEAAPsCngIi2AFAALoCACHZAUAAugIAIZcCAQDHAgAhmAJAALoCACGZAkAAugIAIZoCCAD6AgAhmwIIAPoCACGcAiAA8wIAIaYCAAAXACCnAgAAFwAgEQMAAJgDACASAAC7AgAgEwAAmQMAIMwBAACXAwAwzQEAAAMAEM4BAACXAwAwzwEBAMcCACHYAUAAugIAIdkBQAC6AgAh-QEBAMcCACH6AQEAxwIAIfsBAQDHAgAh_AEBAMcCACH9AQEAuAIAIf4BAQC4AgAh_wEBALgCACGAAgEAxwIAIRAGAADMAgAgzAEAAIQDADDNAQAAKwAQzgEAAIQDADDPAQEAxwIAIdgBQAC6AgAh2QFAALoCACH9AQEAuAIAIZ8CAQDHAgAhoAIBAMcCACGhAgEAuAIAIaICAQC4AgAhowIgAPMCACGkAgIAhQMAIaYCAAArACCnAgAAKwAgA-0BAAAkACDuAQAAJAAg7wEAACQAIAAAAAABrgIBAAAAAQGuAgEAAAABAa4CAAAA1wECAa4CQAAAAAEFIAAAvgUAICEAAMEFACCoAgAAvwUAIKkCAADABQAgrAIAAPcBACADIAAAvgUAIKgCAAC_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_AwAhnAIgANkDACEKEAAA2wMAIM8BAQCeAwAh1wEAANoDngIi2AFAAKEDACHZAUAAoQMAIZgCQAChAwAhmQJAAKEDACGaAggAvwMAIZsCCAC_AwAhnAIgANkDACEBrgIgAAAAAQGuAgAAAJ4CAgsgAADcAwAwIQAA4AMAMKgCAADdAwAwqQIAAN4DADCqAgAAuQMAMKsCAAC5AwAwrAIAALkDADCtAgAA3wMAIK4CAAC5AwAwrwIAAOEDADCwAgAAvAMAMAoNAADmAwAgzwEBAAAAAdcBAAAAkAIC2AFAAAAAAdkBQAAAAAGJAgEAAAABigIBAAAAAYsCCAAAAAGNAgAAAI0CA44CgAAAAAECAAAAGwAgIAAA5QMAIAMAAAAbACAgAADlAwAgIQAA4wMAIAEZAACzBQAwAgAAABsAIBkAAOMDACACAAAAvQMAIBkAAOIDACAJzwEBAJ4DACHXAQAAwQOQAiLYAUAAoQMAIdkBQAChAwAhiQIBAJ4DACGKAgEAngMAIYsCCAC_AwAhjQIAAMADjQIjjgKAAAAAAQoNAADkAwAgzwEBAJ4DACHXAQAAwQOQAiLYAUAAoQMAIdkBQAChAwAhiQIBAJ4DACGKAgEAngMAIYsCCAC_AwAhjQIAAMADjQIjjgKAAAAAAQUgAACuBQAgIQAAsQUAIKgCAACvBQAgqQIAALAFACCsAgAA9wEAIAoNAADmAwAgzwEBAAAAAdcBAAAAkAIC2AFAAAAAAdkBQAAAAAGJAgEAAAABigIBAAAAAYsCCAAAAAGNAgAAAI0CA44CgAAAAAEDIAAArgUAIKgCAACvBQAgrAIAAPcBACAEIAAA3AMAMKgCAADdAwAwrAIAALkDADCtAgAA3wMAIAcIAADpAwAgDwAA6gMAIM8BAQAAAAHXAQAAAJ8CAtgBQAAAAAHZAUAAAAAB8AEBAAAAAQMgAACsBQAgqAIAAK0FACCsAgAAJgAgAyAAANQDACCoAgAA1QMAIKwCAABXACAMAwAAqgQAIBMAAKsEACDPAQEAAAAB2AFAAAAAAdkBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABAgAAAAUAICAAAKkEACADAAAABQAgIAAAqQQAICEAAPUDACABGQAAqwUAMBEDAACYAwAgEgAAuwIAIBMAAJkDACDMAQAAlwMAMM0BAAADABDOAQAAlwMAMM8BAQAAAAHYAUAAugIAIdkBQAC6AgAh-QEBAMcCACH6AQEAxwIAIfsBAQDHAgAh_AEBAMcCACH9AQEAuAIAIf4BAQC4AgAh_wEBALgCACGAAgEAxwIAIQIAAAAFACAZAAD1AwAgAgAAAPMDACAZAAD0AwAgDswBAADyAwAwzQEAAPMDABDOAQAA8gMAMM8BAQDHAgAh2AFAALoCACHZAUAAugIAIfkBAQDHAgAh-gEBAMcCACH7AQEAxwIAIfwBAQDHAgAh_QEBALgCACH-AQEAuAIAIf8BAQC4AgAhgAIBAMcCACEOzAEAAPIDADDNAQAA8wMAEM4BAADyAwAwzwEBAMcCACHYAUAAugIAIdkBQAC6AgAh-QEBAMcCACH6AQEAxwIAIfsBAQDHAgAh_AEBAMcCACH9AQEAuAIAIf4BAQC4AgAh_wEBALgCACGAAgEAxwIAIQrPAQEAngMAIdgBQAChAwAh2QFAAKEDACH6AQEAngMAIfsBAQCeAwAh_AEBAJ4DACH9AQEAnwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAngMAIQwDAAD2AwAgEwAA9wMAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfoBAQCeAwAh-wEBAJ4DACH8AQEAngMAIf0BAQCfAwAh_gEBAJ8DACH_AQEAnwMAIYACAQCeAwAhBSAAAJ4FACAhAACpBQAgqAIAAJ8FACCpAgAAqAUAIKwCAAABACALIAAA-AMAMCEAAP0DADCoAgAA-QMAMKkCAAD6AwAwqgIAAPwDADCrAgAA_AMAMKwCAAD8AwAwrQIAAPsDACCuAgAA_AMAMK8CAAD-AwAwsAIAAP8DADAKCQAApgQAIAoAAKcEACALAACoBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAH0AQEAAAAB9gEAAAD2AQL3ARAAAAABAgAAACYAICAAAKUEACADAAAAJgAgIAAApQQAICEAAIUEACABGQAApwUAMBAHAACLAwAgCQAAjAMAIAoAAI0DACALAADNAgAgzAEAAIcDADDNAQAAJAAQzgEAAIcDADDPAQEAAAAB1wEAAIoD-QEi2AFAALoCACHZAUAAugIAIfMBAQDHAgAh9AEBAMcCACH2AQAAiAP2ASL3ARAAiQMAIaUCAACGAwAgAgAAACYAIBkAAIUEACACAAAAgAQAIBkAAIEEACALzAEAAP8DADDNAQAAgAQAEM4BAAD_AwAwzwEBAMcCACHXAQAAigP5ASLYAUAAugIAIdkBQAC6AgAh8wEBAMcCACH0AQEAxwIAIfYBAACIA_YBIvcBEACJAwAhC8wBAAD_AwAwzQEAAIAEABDOAQAA_wMAMM8BAQDHAgAh1wEAAIoD-QEi2AFAALoCACHZAUAAugIAIfMBAQDHAgAh9AEBAMcCACH2AQAAiAP2ASL3ARAAiQMAIQfPAQEAngMAIdcBAACEBPkBItgBQAChAwAh2QFAAKEDACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhAa4CAAAA9gECBa4CEAAAAAGxAhAAAAABsgIQAAAAAbMCEAAAAAG0AhAAAAABAa4CAAAA-QECCgkAAIYEACAKAACHBAAgCwAAiAQAIM8BAQCeAwAh1wEAAIQE-QEi2AFAAKEDACHZAUAAoQMAIfQBAQCeAwAh9gEAAIIE9gEi9wEQAIMEACELIAAAmQQAMCEAAJ4EADCoAgAAmgQAMKkCAACbBAAwqgIAAJ0EADCrAgAAnQQAMKwCAACdBAAwrQIAAJwEACCuAgAAnQQAMK8CAACfBAAwsAIAAKAEADAHIAAAlAQAICEAAJcEACCoAgAAlQQAIKkCAACWBAAgqgIAABIAIKsCAAASACCsAgAAbwAgCyAAAIkEADAhAACNBAAwqAIAAIoEADCpAgAAiwQAMKoCAADKAwAwqwIAAMoDADCsAgAAygMAMK0CAACMBAAgrgIAAMoDADCvAgAAjgQAMLACAADNAwAwBw0AAJMEACAPAADqAwAgzwEBAAAAAdcBAAAAnwIC2AFAAAAAAdkBQAAAAAGJAgEAAAABAgAAAAwAICAAAJIEACADAAAADAAgIAAAkgQAICEAAJAEACABGQAApgUAMAIAAAAMACAZAACQBAAgAgAAAM4DACAZAACPBAAgBc8BAQCeAwAh1wEAANADnwIi2AFAAKEDACHZAUAAoQMAIYkCAQCeAwAhBw0AAJEEACAPAADTAwAgzwEBAJ4DACHXAQAA0AOfAiLYAUAAoQMAIdkBQAChAwAhiQIBAJ4DACEFIAAAoQUAICEAAKQFACCoAgAAogUAIKkCAACjBQAgrAIAAPcBACAHDQAAkwQAIA8AAOoDACDPAQEAAAAB1wEAAACfAgLYAUAAAAAB2QFAAAAAAYkCAQAAAAEDIAAAoQUAIKgCAACiBQAgrAIAAPcBACAGzwEBAAAAAdgBQAAAAAHZAUAAAAAB-gEBAAAAAf0BAQAAAAGWAiAAAAABAgAAAG8AICAAAJQEACADAAAAEgAgIAAAlAQAICEAAJgEACAIAAAAEgAgGQAAmAQAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfoBAQCeAwAh_QEBAJ4DACGWAiAA2QMAIQbPAQEAngMAIdgBQAChAwAh2QFAAKEDACH6AQEAngMAIf0BAQCeAwAhlgIgANkDACEEzwEBAAAAAdgBQAAAAAHxAQEAAAAB8gEBAAAAAQIAAAAQACAgAACkBAAgAwAAABAAICAAAKQEACAhAACjBAAgARkAAKAFADAJCAAA9AIAIMwBAACTAwAwzQEAAA4AEM4BAACTAwAwzwEBAAAAAdgBQAC6AgAh8AEBAMcCACHxAQEAxwIAIfIBAQDHAgAhAgAAABAAIBkAAKMEACACAAAAoQQAIBkAAKIEACAIzAEAAKAEADDNAQAAoQQAEM4BAACgBAAwzwEBAMcCACHYAUAAugIAIfABAQDHAgAh8QEBAMcCACHyAQEAxwIAIQjMAQAAoAQAMM0BAAChBAAQzgEAAKAEADDPAQEAxwIAIdgBQAC6AgAh8AEBAMcCACHxAQEAxwIAIfIBAQDHAgAhBM8BAQCeAwAh2AFAAKEDACHxAQEAngMAIfIBAQCeAwAhBM8BAQCeAwAh2AFAAKEDACHxAQEAngMAIfIBAQCeAwAhBM8BAQAAAAHYAUAAAAAB8QEBAAAAAfIBAQAAAAEKCQAApgQAIAoAAKcEACALAACoBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAH0AQEAAAAB9gEAAAD2AQL3ARAAAAABBCAAAJkEADCoAgAAmgQAMKwCAACdBAAwrQIAAJwEACADIAAAlAQAIKgCAACVBAAgrAIAAG8AIAQgAACJBAAwqAIAAIoEADCsAgAAygMAMK0CAACMBAAgDAMAAKoEACATAACrBAAgzwEBAAAAAdgBQAAAAAHZAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQMgAACeBQAgqAIAAJ8FACCsAgAAAQAgBCAAAPgDADCoAgAA-QMAMKwCAAD8AwAwrQIAAPsDACAJzwEBAAAAAdgBQAAAAAHZAUAAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhQIAAACFAgOGAgEAAAABhwIBAAAAAQIAAACdAQAgIAAArAQAIAMAAAAHACAgAACsBAAgIQAAsAQAIAsAAAAHACAZAACwBAAgzwEBAJ4DACHYAUAAoQMAIdkBQAChAwAhgQIBAJ4DACGCAgEAnwMAIYMCAQCfAwAhhQIAALEEhQIjhgIBAJ8DACGHAgEAnwMAIQnPAQEAngMAIdgBQAChAwAh2QFAAKEDACGBAgEAngMAIYICAQCfAwAhgwIBAJ8DACGFAgAAsQSFAiOGAgEAnwMAIYcCAQCfAwAhAa4CAAAAhQIDAyAAAKwEACCoAgAArQQAIKwCAACdAQAgBCAAAOsDADCoAgAA7AMAMKwCAADvAwAwrQIAAO4DACAEIAAAxgMAMKgCAADHAwAwrAIAAMoDADCtAgAAyQMAIAQgAAC1AwAwqAIAALYDADCsAgAAuQMAMK0CAAC4AwAgAyAAALADACCoAgAAsQMAIKwCAACQAgAgBgQAAKQDACCCAgAAmgMAIIMCAACaAwAghQIAAJoDACCGAgAAmgMAIIcCAACaAwAgAAAABgQAAKQDACDRAQAAmgMAINIBAACaAwAg0wEAAJoDACDUAQAAmgMAINUBAACaAwAgAAAABSAAAJkFACAhAACcBQAgqAIAAJoFACCpAgAAmwUAIKwCAAAmACADIAAAmQUAIKgCAACaBQAgrAIAACYAIAAAAAAABSAAAJQFACAhAACXBQAgqAIAAJUFACCpAgAAlgUAIKwCAAAFACADIAAAlAUAIKgCAACVBQAgrAIAAAUAIAAAAAUgAACPBQAgIQAAkgUAIKgCAACQBQAgqQIAAJEFACCsAgAA9wEAIAMgAACPBQAgqAIAAJAFACCsAgAA9wEAIAAAAAUgAACKBQAgIQAAjQUAIKgCAACLBQAgqQIAAIwFACCsAgAA9wEAIAMgAACKBQAgqAIAAIsFACCsAgAA9wEAIAAAAAAAAAAABSAAAIUFACAhAACIBQAgqAIAAIYFACCpAgAAhwUAIKwCAAAmACADIAAAhQUAIKgCAACGBQAgrAIAACYAIAQHAAD5BAAgCQAA-gQAIAoAAPsEACALAAC5BAAgAAAAAAAFIAAAgAUAICEAAIMFACCoAgAAgQUAIKkCAACCBQAgrAIAAAwAIAMgAACABQAgqAIAAIEFACCsAgAADAAgAwgAANwEACANAACkAwAgDwAA_AQAIAAAAAAAAAAABa4CAgAAAAGxAgIAAAABsgICAAAAAbMCAgAAAAG0AgIAAAABCyAAAO8EADAhAADzBAAwqAIAAPAEADCpAgAA8QQAMKoCAADvAwAwqwIAAO8DADCsAgAA7wMAMK0CAADyBAAgrgIAAO8DADCvAgAA9AQAMLACAADyAwAwDBIAAMwEACATAACrBAAgzwEBAAAAAdgBQAAAAAHZAUAAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQIAAAAFACAgAAD3BAAgAwAAAAUAICAAAPcEACAhAAD2BAAgARkAAP8EADACAAAABQAgGQAA9gQAIAIAAADzAwAgGQAA9QQAIArPAQEAngMAIdgBQAChAwAh2QFAAKEDACH5AQEAngMAIfoBAQCeAwAh-wEBAJ4DACH8AQEAngMAIf0BAQCfAwAh_gEBAJ8DACH_AQEAnwMAIQwSAADLBAAgEwAA9wMAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfkBAQCeAwAh-gEBAJ4DACH7AQEAngMAIfwBAQCeAwAh_QEBAJ8DACH-AQEAnwMAIf8BAQCfAwAhDBIAAMwEACATAACrBAAgzwEBAAAAAdgBQAAAAAHZAUAAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQQgAADvBAAwqAIAAPAEADCsAgAA7wMAMK0CAADyBAAgBgMAAP0EACASAACkAwAgEwAA_gQAIP0BAACaAwAg_gEAAJoDACD_AQAAmgMAIAABCAAA3AQAIAIOAADkBAAgEAAAugQAIAQGAAC4BAAg_QEAAJoDACChAgAAmgMAIKICAACaAwAgAArPAQEAAAAB2AFAAAAAAdkBQAAAAAH5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABCAgAAOkDACANAACTBAAgzwEBAAAAAdcBAAAAnwIC2AFAAAAAAdkBQAAAAAHwAQEAAAABiQIBAAAAAQIAAAAMACAgAACABQAgAwAAAAoAICAAAIAFACAhAACEBQAgCgAAAAoAIAgAANIDACANAACRBAAgGQAAhAUAIM8BAQCeAwAh1wEAANADnwIi2AFAAKEDACHZAUAAoQMAIfABAQCeAwAhiQIBAJ4DACEICAAA0gMAIA0AAJEEACDPAQEAngMAIdcBAADQA58CItgBQAChAwAh2QFAAKEDACHwAQEAngMAIYkCAQCeAwAhCwcAAMcEACAJAACmBAAgCwAAqAQAIM8BAQAAAAHXAQAAAPkBAtgBQAAAAAHZAUAAAAAB8wEBAAAAAfQBAQAAAAH2AQAAAPYBAvcBEAAAAAECAAAAJgAgIAAAhQUAIAMAAAAkACAgAACFBQAgIQAAiQUAIA0AAAAkACAHAADGBAAgCQAAhgQAIAsAAIgEACAZAACJBQAgzwEBAJ4DACHXAQAAhAT5ASLYAUAAoQMAIdkBQAChAwAh8wEBAJ4DACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhCwcAAMYEACAJAACGBAAgCwAAiAQAIM8BAQCeAwAh1wEAAIQE-QEi2AFAAKEDACHZAUAAoQMAIfMBAQCeAwAh9AEBAJ4DACH2AQAAggT2ASL3ARAAgwQAIQ0GAACzBAAgCwAAtAQAIBAAALUEACARAAC2BAAgzwEBAAAAAdcBAAAA7QEC2AFAAAAAAdkBQAAAAAHlAQEAAAAB5gEBAAAAAegBAAAA6AEC6gEAAADqAQLrAQEAAAABAgAAAPcBACAgAACKBQAgAwAAAPoBACAgAACKBQAgIQAAjgUAIA8AAAD6AQAgBgAArAMAIAsAAK0DACAQAACuAwAgEQAArwMAIBkAAI4FACDPAQEAngMAIdcBAACqA-0BItgBQAChAwAh2QFAAKEDACHlAQEAngMAIeYBAQCfAwAh6AEAAKgD6AEi6gEAAKkD6gEi6wEBAJ8DACENBgAArAMAIAsAAK0DACAQAACuAwAgEQAArwMAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQ0FAACyBAAgCwAAtAQAIBAAALUEACARAAC2BAAgzwEBAAAAAdcBAAAA7QEC2AFAAAAAAdkBQAAAAAHlAQEAAAAB5gEBAAAAAegBAAAA6AEC6gEAAADqAQLrAQEAAAABAgAAAPcBACAgAACPBQAgAwAAAPoBACAgAACPBQAgIQAAkwUAIA8AAAD6AQAgBQAAqwMAIAsAAK0DACAQAACuAwAgEQAArwMAIBkAAJMFACDPAQEAngMAIdcBAACqA-0BItgBQAChAwAh2QFAAKEDACHlAQEAngMAIeYBAQCfAwAh6AEAAKgD6AEi6gEAAKkD6gEi6wEBAJ8DACENBQAAqwMAIAsAAK0DACAQAACuAwAgEQAArwMAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQ0DAACqBAAgEgAAzAQAIM8BAQAAAAHYAUAAAAAB2QFAAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABAgAAAAUAICAAAJQFACADAAAAAwAgIAAAlAUAICEAAJgFACAPAAAAAwAgAwAA9gMAIBIAAMsEACAZAACYBQAgzwEBAJ4DACHYAUAAoQMAIdkBQAChAwAh-QEBAJ4DACH6AQEAngMAIfsBAQCeAwAh_AEBAJ4DACH9AQEAnwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAngMAIQ0DAAD2AwAgEgAAywQAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIfkBAQCeAwAh-gEBAJ4DACH7AQEAngMAIfwBAQCeAwAh_QEBAJ8DACH-AQEAnwMAIf8BAQCfAwAhgAIBAJ4DACELBwAAxwQAIAoAAKcEACALAACoBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAHzAQEAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQIAAAAmACAgAACZBQAgAwAAACQAICAAAJkFACAhAACdBQAgDQAAACQAIAcAAMYEACAKAACHBAAgCwAAiAQAIBkAAJ0FACDPAQEAngMAIdcBAACEBPkBItgBQAChAwAh2QFAAKEDACHzAQEAngMAIfQBAQCeAwAh9gEAAIIE9gEi9wEQAIMEACELBwAAxgQAIAoAAIcEACALAACIBAAgzwEBAJ4DACHXAQAAhAT5ASLYAUAAoQMAIdkBQAChAwAh8wEBAJ4DACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhCs8BAQAAAAHYAUAAAAAB2QFAAAAAAf0BAQAAAAGfAgEAAAABoAIBAAAAAaECAQAAAAGiAgEAAAABowIgAAAAAaQCAgAAAAECAAAAAQAgIAAAngUAIATPAQEAAAAB2AFAAAAAAfEBAQAAAAHyAQEAAAABDQUAALIEACAGAACzBAAgEAAAtQQAIBEAALYEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA9wEAICAAAKEFACADAAAA-gEAICAAAKEFACAhAAClBQAgDwAAAPoBACAFAACrAwAgBgAArAMAIBAAAK4DACARAACvAwAgGQAApQUAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQ0FAACrAwAgBgAArAMAIBAAAK4DACARAACvAwAgzwEBAJ4DACHXAQAAqgPtASLYAUAAoQMAIdkBQAChAwAh5QEBAJ4DACHmAQEAnwMAIegBAACoA-gBIuoBAACpA-oBIusBAQCfAwAhBc8BAQAAAAHXAQAAAJ8CAtgBQAAAAAHZAUAAAAABiQIBAAAAAQfPAQEAAAAB1wEAAAD5AQLYAUAAAAAB2QFAAAAAAfQBAQAAAAH2AQAAAPYBAvcBEAAAAAEDAAAAKwAgIAAAngUAICEAAKoFACAMAAAAKwAgGQAAqgUAIM8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIf0BAQCfAwAhnwIBAJ4DACGgAgEAngMAIaECAQCfAwAhogIBAJ8DACGjAiAA2QMAIaQCAgDtBAAhCs8BAQCeAwAh2AFAAKEDACHZAUAAoQMAIf0BAQCfAwAhnwIBAJ4DACGgAgEAngMAIaECAQCfAwAhogIBAJ8DACGjAiAA2QMAIaQCAgDtBAAhCs8BAQAAAAHYAUAAAAAB2QFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAYACAQAAAAELBwAAxwQAIAkAAKYEACAKAACnBAAgzwEBAAAAAdcBAAAA-QEC2AFAAAAAAdkBQAAAAAHzAQEAAAAB9AEBAAAAAfYBAAAA9gEC9wEQAAAAAQIAAAAmACAgAACsBQAgDQUAALIEACAGAACzBAAgCwAAtAQAIBEAALYEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA9wEAICAAAK4FACADAAAA-gEAICAAAK4FACAhAACyBQAgDwAAAPoBACAFAACrAwAgBgAArAMAIAsAAK0DACARAACvAwAgGQAAsgUAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQ0FAACrAwAgBgAArAMAIAsAAK0DACARAACvAwAgzwEBAJ4DACHXAQAAqgPtASLYAUAAoQMAIdkBQAChAwAh5QEBAJ4DACHmAQEAnwMAIegBAACoA-gBIuoBAACpA-oBIusBAQCfAwAhCc8BAQAAAAHXAQAAAJACAtgBQAAAAAHZAUAAAAABiQIBAAAAAYoCAQAAAAGLAggAAAABjQIAAACNAgOOAoAAAAABAwAAACQAICAAAKwFACAhAAC2BQAgDQAAACQAIAcAAMYEACAJAACGBAAgCgAAhwQAIBkAALYFACDPAQEAngMAIdcBAACEBPkBItgBQAChAwAh2QFAAKEDACHzAQEAngMAIfQBAQCeAwAh9gEAAIIE9gEi9wEQAIMEACELBwAAxgQAIAkAAIYEACAKAACHBAAgzwEBAJ4DACHXAQAAhAT5ASLYAUAAoQMAIdkBQAChAwAh8wEBAJ4DACH0AQEAngMAIfYBAACCBPYBIvcBEACDBAAhBc8BAQAAAAHXAQAAAJ8CAtgBQAAAAAHZAUAAAAAB8AEBAAAAAQsOAADjBAAgzwEBAAAAAdcBAAAAngIC2AFAAAAAAdkBQAAAAAGXAgEAAAABmAJAAAAAAZkCQAAAAAGaAggAAAABmwIIAAAAAZwCIAAAAAECAAAAVwAgIAAAuAUAIAMAAAAXACAgAAC4BQAgIQAAvAUAIA0AAAAXACAOAADiBAAgGQAAvAUAIM8BAQCeAwAh1wEAANoDngIi2AFAAKEDACHZAUAAoQMAIZcCAQCeAwAhmAJAAKEDACGZAkAAoQMAIZoCCAC_AwAhmwIIAL8DACGcAiAA2QMAIQsOAADiBAAgzwEBAJ4DACHXAQAA2gOeAiLYAUAAoQMAIdkBQAChAwAhlwIBAJ4DACGYAkAAoQMAIZkCQAChAwAhmgIIAL8DACGbAggAvwMAIZwCIADZAwAhCc8BAQAAAAHXAQAAAJACAtgBQAAAAAHZAUAAAAABiAIBAAAAAYoCAQAAAAGLAggAAAABjQIAAACNAgOOAoAAAAABDQUAALIEACAGAACzBAAgCwAAtAQAIBAAALUEACDPAQEAAAAB1wEAAADtAQLYAUAAAAAB2QFAAAAAAeUBAQAAAAHmAQEAAAAB6AEAAADoAQLqAQAAAOoBAusBAQAAAAECAAAA9wEAICAAAL4FACADAAAA-gEAICAAAL4FACAhAADCBQAgDwAAAPoBACAFAACrAwAgBgAArAMAIAsAAK0DACAQAACuAwAgGQAAwgUAIM8BAQCeAwAh1wEAAKoD7QEi2AFAAKEDACHZAUAAoQMAIeUBAQCeAwAh5gEBAJ8DACHoAQAAqAPoASLqAQAAqQPqASLrAQEAnwMAIQ0FAACrAwAgBgAArAMAIAsAAK0DACAQAACuAwAgzwEBAJ4DACHXAQAAqgPtASLYAUAAoQMAIdkBQAChAwAh5QEBAJ4DACHmAQEAnwMAIegBAACoA-gBIuoBAACpA-oBIusBAQCfAwAhAgYGAgwAEAQDAAEMAA8SAAMTJwYGBQgEBgkCCw0FDAAOEB4LESANAQQAAwMIAAYNAAMPGAoFBwACCREHChMICxQFDAAJAQgABgEIAAYCCRUACxYAAwwADA4ABRAcCwINAAMPAAoBEB0AAQQAAwMGIQALIgAQIwABEygAAQYpAAAAAAUMABUmABYnABcoABgpABkAAAAAAAUMABUmABYnABcoABgpABkCCAAGDQADAggABg0AAwMMAB4oAB8pACAAAAADDAAeKAAfKQAgAQ4ABQEOAAUFDAAlJgAmJwAnKAAoKQApAAAAAAAFDAAlJgAmJwAnKAAoKQApAQgABgEIAAYDDAAuKAAvKQAwAAAAAwwALigALykAMAINAAMPAAoCDQADDwAKBQwANSYANicANygAOCkAOQAAAAAABQwANSYANicANygAOCkAOQEEAAMBBAADAwwAPigAPykAQAAAAAMMAD4oAD8pAEACAwABEgADAgMAARIAAwMMAEUoAEYpAEcAAAADDABFKABGKQBHAQcAAgEHAAIFDABMJgBNJwBOKABPKQBQAAAAAAAFDABMJgBNJwBOKABPKQBQAQgABgEIAAYDDABVKABWKQBXAAAAAwwAVSgAVikAVwAAAwwAXCgAXSkAXgAAAAMMAFwoAF0pAF4BBAADAQQAAwMMAGMoAGQpAGUAAAADDABjKABkKQBlFAIBFSoBFi0BFy4BGC8BGjEBGzMRHDQSHTYBHjgRHzkTIjoBIzsBJDwRKj8UK0AaLEEFLUIFLkMFL0QFMEUFMUcFMkkRM0obNEwFNU4RNk8cN1AFOFEFOVIROlUdO1YhPFgKPVkKPlsKP1wKQF0KQV8KQmERQ2IiRGQKRWYRRmcjR2gKSGkKSWoRSm0kS24qTHAITXEITnMIT3QIUHUIUXcIUnkRU3orVHwIVX4RVn8sV4ABCFiBAQhZggERWoUBLVuGATFchwELXYgBC16JAQtfigELYIsBC2GNAQtijwERY5ABMmSSAQtllAERZpUBM2eWAQtolwELaZgBEWqbATRrnAE6bJ4BBG2fAQRuoQEEb6IBBHCjAQRxpQEEcqcBEXOoATt0qgEEdawBEXatATx3rgEEeK8BBHmwARF6swE9e7QBQXy1AQJ9tgECfrcBAn-4AQKAAbkBAoEBuwECggG9ARGDAb4BQoQBwAEChQHCARGGAcMBQ4cBxAECiAHFAQKJAcYBEYoByQFEiwHKAUiMAcsBBo0BzAEGjgHNAQaPAc4BBpABzwEGkQHRAQaSAdMBEZMB1AFJlAHWAQaVAdgBEZYB2QFKlwHaAQaYAdsBBpkB3AERmgHfAUubAeABUZwB4QEHnQHiAQeeAeMBB58B5AEHoAHlAQehAecBB6IB6QERowHqAVKkAewBB6UB7gERpgHvAVOnAfABB6gB8QEHqQHyARGqAfUBVKsB9gFYrAH4AQOtAfkBA64B_AEDrwH9AQOwAf4BA7EBgAIDsgGCAhGzAYMCWbQBhQIDtQGHAhG2AYgCWrcBiQIDuAGKAgO5AYsCEboBjgJbuwGPAl-8AZECDb0BkgINvgGUAg2_AZUCDcABlgINwQGYAg3CAZoCEcMBmwJgxAGdAg3FAZ8CEcYBoAJhxwGhAg3IAaICDckBowIRygGmAmLLAacCZg"
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
var runtime2 = __toESM(require("@prisma/client/runtime/client"), 1);
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
var adapter = new import_adapter_pg.PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utilis/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var createToken = (payload, secret, expiresIn) => {
  const token = import_jsonwebtoken.default.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  return import_jsonwebtoken.default.verify(token, secret);
};
var jwtUtilis = {
  createToken,
  verifyToken
};

// src/lib/googleAuth.ts
var import_google_auth_library = require("google-auth-library");
var googleClient = new import_google_auth_library.OAuth2Client({
  client_id: config_default.google_client_id
});

// src/lib/cloudinary.ts
var import_cloudinary = require("cloudinary");
import_cloudinary.v2.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_secret_key
});

// src/lib/redis.ts
var import_redis = require("redis");
var redisClient = (0, import_redis.createClient)({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/modules/auth/auth.service.ts
var import_path2 = __toESM(require("path"), 1);

// src/lib/nodemailer.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var transporter = import_nodemailer.default.createTransport({
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
  const hashedPassword = await import_bcryptjs.default.hash(
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
  const isPasswordMatched = await import_bcryptjs.default.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("incorrect password");
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
    refreshToken
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
      const uploadStream = import_cloudinary.v2.uploader.upload_stream(
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
  const otp = import_crypto.default.randomInt(1e5, 1e6).toString();
  const key = `forgot-password:${isUserExists.email}`;
  const expirationMinutes = 5;
  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationMinutes * 60
    }
  });
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/templates/forgot-password.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
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
  const hashedPassword = await import_bcryptjs.default.hash(
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
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/templates/reset-password-success.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
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
      statusCode: import_http_status2.default.CREATED,
      message: "User registered successful",
      data: result
    });
  }
);
var loginUser = catchAsync(
  async (req, res, next) => {
    const payload = loginUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const { accessToken, refreshToken } = await authService.loginUserIntoDB(
      payload.data
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1e3 * 60 * 60 * 24
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1e3 * 60 * 60 * 24 * 30
    });
    sendResponse(res, {
      success: true,
      statusCode: import_http_status2.default.OK,
      message: "User login successful",
      data: {
        accessToken,
        refreshToken
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
      statusCode: import_http_status2.default.OK,
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
      statusCode: import_http_status2.default.OK,
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
      statusCode: import_http_status2.default.OK,
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
      statusCode: import_http_status2.default.OK,
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
      statusCode: import_http_status2.default.OK,
      message: "Password reset successfully! ",
      data: result
    });
  }
);
var authController = {
  registerUser,
  loginUser,
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
var import_multer = __toESM(require("multer"), 1);
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({
  storage
});

// src/modules/auth/auth.routes.ts
var router = (0, import_express.Router)();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
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
router.post("/forgot-password", auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT), authController.forgotPassword);
router.post("/reset-password", auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT), authController.resetPassword);
var authRouter = router;

// src/modules/property/property.router.ts
var import_express2 = require("express");

// src/modules/property/property.validation.ts
var import_zod2 = require("zod");
var createPropertySchema = import_zod2.z.object({
  categoryId: import_zod2.z.string().uuid("Invalid category ID"),
  title: import_zod2.z.string().min(3, "Property title must be at least 3 characters"),
  description: import_zod2.z.string().optional(),
  address: import_zod2.z.string().min(5, "Address must be at least 5 characters"),
  city: import_zod2.z.string().min(2, "City must be at least 2 characters")
});
var propertySortEnum = import_zod2.z.enum(["latest", "oldest"]);
var getAllPropertiesQuerySchema = import_zod2.z.object({
  page: import_zod2.z.coerce.number().int().positive().default(1),
  limit: import_zod2.z.coerce.number().int().positive().max(100).default(12),
  search: import_zod2.z.string().optional(),
  categoryId: import_zod2.z.string().uuid("Invalid category ID").optional(),
  city: import_zod2.z.string().optional(),
  address: import_zod2.z.string().optional(),
  sort: propertySortEnum.optional().default("latest")
});
var updatePropertySchema = import_zod2.z.object({
  categoryId: import_zod2.z.string().uuid("Invalid category ID").optional(),
  title: import_zod2.z.string().min(3, "Property title must be at least 3 characters").optional(),
  description: import_zod2.z.string().optional(),
  address: import_zod2.z.string().min(5, "Address must be at least 5 characters").optional(),
  city: import_zod2.z.string().min(2, "City must be at least 2 characters").optional()
});

// src/modules/property/property.service.ts
var createPropertyIntoDb = async (payload, ownerId) => {
  const { categoryId, title, description, address, city } = payload;
  const result = await prisma.property.create({
    data: {
      ownerId,
      categoryId,
      title,
      description,
      address,
      city
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
      category: true
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
      category: true
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
      const uploadStream = import_cloudinary.v2.uploader.upload_stream(
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
      await import_cloudinary.v2.uploader.destroy(isPropertyExists.propertyImgPublicId);
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
var import_http_status3 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status3.default.CREATED,
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
      statusCode: import_http_status3.default.OK,
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
      statusCode: import_http_status3.default.OK,
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
      statusCode: import_http_status3.default.OK,
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
      statusCode: import_http_status3.default.OK,
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
      statusCode: import_http_status3.default.OK,
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
var router2 = (0, import_express2.Router)();
router2.post("/", auth(Role.OWNER, Role.ADMIN), propertyController.createProperty);
router2.get("/", propertyController.getAllProperties);
router2.get("/:id", propertyController.getSingleProperty);
router2.patch("/:id/image", auth(Role.OWNER), upload.single("propertyImg"), propertyController.updateProperty);
var propertyRoutes = router2;

// src/modules/room/room.routes.ts
var import_express3 = require("express");

// src/modules/room/room.validation.ts
var import_zod3 = require("zod");
var createRoomSchema = import_zod3.z.object({
  propertyId: import_zod3.z.string().uuid("Invalid property ID"),
  roomNumber: import_zod3.z.string().min(1, "Room number is required"),
  roomType: import_zod3.z.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]),
  baseRent: import_zod3.z.coerce.number().positive("Base rent must be greater than 0")
});
var updateRoomSchema = import_zod3.z.object({
  roomNumber: import_zod3.z.string().min(1, "Room number is required").optional(),
  roomType: import_zod3.z.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]).optional(),
  baseRent: import_zod3.z.coerce.number().positive("Base rent must be greater than 0").optional(),
  status: import_zod3.z.enum(RoomStatus).optional()
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
      const uploadStream = import_cloudinary.v2.uploader.upload_stream(
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
var import_http_status4 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status4.default.CREATED,
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
      statusCode: import_http_status4.default.OK,
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
      statusCode: import_http_status4.default.OK,
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
      statusCode: import_http_status4.default.OK,
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
      statusCode: import_http_status4.default.OK,
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
      statusCode: import_http_status4.default.OK,
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
var router3 = (0, import_express3.Router)();
router3.post("/", roomController.createRoom);
router3.get("/", roomController.getAllRoom);
router3.get("/:id", roomController.getSingleRoom);
router3.patch("/:id", roomController.updateRoom);
router3.delete("/:id", roomController.deleteRoom);
router3.patch("/:id/image", upload.single("roomImg"), roomController.uploadRoomImg);
var roomRoutes = router3;

// src/modules/listing/listing.routes.ts
var import_express4 = require("express");

// src/modules/listing/listning.validation.ts
var import_zod4 = require("zod");
var createListingSchema = import_zod4.z.object({
  roomId: import_zod4.z.string().uuid("Invalid room ID"),
  title: import_zod4.z.string().min(3, "Listing title must be at least 3 characters"),
  description: import_zod4.z.string().min(10, "Description must be at least 10 characters")
});
var updateListingSchema = import_zod4.z.object({
  title: import_zod4.z.string().min(3, "Listing title must be at least 3 characters").optional(),
  description: import_zod4.z.string().min(10, "Description must be at least 10 characters").optional(),
  isPublished: import_zod4.z.boolean().optional()
});

// src/modules/listing/listing.controller.ts
var import_http_status5 = __toESM(require("http-status"), 1);

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
      statusCode: import_http_status5.default.CREATED,
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
      statusCode: import_http_status5.default.OK,
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
      statusCode: import_http_status5.default.OK,
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
      statusCode: import_http_status5.default.OK,
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
      statusCode: import_http_status5.default.OK,
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
var router4 = (0, import_express4.Router)();
router4.post("/", auth(Role.OWNER), listingController.createListing);
router4.get("/", listingController.getAllListing);
router4.get("/:id", listingController.getSingleListing);
router4.patch("/:id", listingController.updateListing);
router4.delete("/:id", listingController.deleteListing);
var listingRoutes = router4;

// src/modules/application/application.routes.ts
var import_express5 = require("express");

// src/modules/application/application.validation.ts
var import_zod5 = require("zod");
var createApplicationSchema = import_zod5.z.object({
  listingId: import_zod5.z.string().uuid("Invalid listing ID")
});
var updateApplicationSchema = import_zod5.z.object({
  status: import_zod5.z.enum(["CANCELLED"])
});
var updateApplicationByOwnerSchema = import_zod5.z.object({
  status: import_zod5.z.enum(["APPROVED", "REJECTED"])
});

// src/modules/application/application.service.ts
var createApplicationIntoDB = async (tenantId, payload) => {
  const { listingId } = payload;
  const isListingExists = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      room: true
    }
  });
  if (!isListingExists) {
    throw new Error("Listing does not exist");
  }
  if (!isListingExists.isPublished) {
    throw new Error("This listing is not available");
  }
  if (isListingExists.room.status !== RoomStatus.AVAILABLE) {
    throw new Error("This room is not available for booking");
  }
  const isApplicationExists = await prisma.application.findFirst({
    where: { tenantId, roomId: isListingExists.roomId },
    include: {
      room: true
    }
  });
  if (isApplicationExists) {
    throw new Error("You have already applied for this room");
  }
  const result = await prisma.application.create({
    data: {
      tenantId,
      roomId: isListingExists.roomId
    },
    include: {
      room: true
    }
  });
  return result;
};
var getApplicationIntoDB = async (tenantId) => {
  const result = await prisma.application.findMany({
    where: { id: tenantId },
    include: {
      room: {
        include: {
          property: true
        }
      }
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
var updateApplicationStatusByOwnerIntoDB = async (ownerId, applicationId, payload) => {
  const application = await prisma.application.findUnique({
    where: {
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
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to update this application");
  }
  if (application.status !== "PENDING") {
    throw new Error("Only pending applications can be approved or rejected");
  }
  const result = await prisma.application.update({
    where: {
      id: applicationId
    },
    data: {
      status: payload.status
    }
  });
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
var import_http_status6 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status6.default.CREATED,
      message: "Application submitted successfully",
      data: result
    });
  }
);
var getApplication = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.id;
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }
    const result = await applicationService.getApplicationIntoDB(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: import_http_status6.default.OK,
      message: "Application retrieved  successfully",
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
      statusCode: import_http_status6.default.OK,
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
      statusCode: import_http_status6.default.OK,
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
      statusCode: import_http_status6.default.OK,
      message: "Application deleted successfully",
      data: null
    });
  }
);
var updateApplicationStatusByOwner = catchAsync(
  async (req, res) => {
    const ownerId = req.user?.id;
    const applicationId = req.params.id;
    const payload = updateApplicationByOwnerSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await applicationService.updateApplicationStatusByOwnerIntoDB(
      ownerId,
      applicationId,
      payload.data
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status6.default.OK,
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
var router5 = (0, import_express5.Router)();
router5.post("/", auth(), applicationController.createApplication);
router5.get("/", auth(Role.OWNER, Role.TENANT), applicationController.getApplication);
router5.get("/:id", applicationController.getSingleApplication);
router5.patch("/:id", auth(Role.OWNER), applicationController.updateApplication);
router5.delete("/:id", applicationController.deleteApplication);
router5.patch("/:id/status", auth(Role.OWNER), applicationController.updateApplicationStatusByOwner);
var applicationRoutes = router5;

// src/modules/identityVerification/verification.routes.ts
var import_express6 = require("express");

// src/modules/identityVerification/verification.validation.ts
var import_zod6 = require("zod");
var createIdentityVerificationSchema = import_zod6.z.object({
  nidNumber: import_zod6.z.string().min(10, "NID number must be at least 10 characters").max(20, "NID number must not exceed 20 characters")
});

// src/lib/cloudinaryUpload.ts
var uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = import_cloudinary.v2.uploader.upload_stream(
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
  if (user.identityVerification?.status === VerificationStatus.PENDING) {
    throw new Error("Your verification request is already pending approval");
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
var import_http_status7 = __toESM(require("http-status"), 1);
var verifyIdentity = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const payload = createIdentityVerificationSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const files = req.files;
    const nidFront = files.nidFront?.[0];
    const nidBack = files.nidBack?.[0];
    if (!nidFront || !nidBack) {
      throw new Error("Both nid images are required");
    }
    const result = await verificationService.verifyIdentityIntoDB(
      userId,
      payload.data,
      nidFront,
      nidBack
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status7.default.CREATED,
      message: "Identity verification submitted successfully",
      data: result
    });
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
      statusCode: import_http_status7.default.OK,
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
      statusCode: import_http_status7.default.OK,
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
      statusCode: import_http_status7.default.OK,
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
var router6 = (0, import_express6.Router)();
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
var import_express7 = require("express");

// src/modules/lease/lease.validation.ts
var import_zod7 = require("zod");
var createLeaseSchema = import_zod7.z.object({
  applicationId: import_zod7.z.string().uuid("Invalid application ID"),
  startDate: import_zod7.z.string().datetime("Invalid start date"),
  endDate: import_zod7.z.string().datetime("Invalid end date"),
  monthlyRent: import_zod7.z.number().positive("Monthly rent must be greater than 0"),
  securityDeposit: import_zod7.z.number().nonnegative("Security deposit cannot be negative")
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
});
var updateLeaseSchema = import_zod7.z.object({
  startDate: import_zod7.z.string().datetime("Invalid start date").optional(),
  endDate: import_zod7.z.string().datetime("Invalid end date").optional(),
  monthlyRent: import_zod7.z.number().positive("Monthly rent must be greater than 0").optional(),
  securityDeposit: import_zod7.z.number().nonnegative("Security deposit cannot be negative").optional()
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
var import_http_status8 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status8.default.CREATED,
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
      statusCode: import_http_status8.default.OK,
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
      statusCode: import_http_status8.default.OK,
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
      statusCode: import_http_status8.default.OK,
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
      statusCode: import_http_status8.default.OK,
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
      statusCode: import_http_status8.default.OK,
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
var router7 = (0, import_express7.Router)();
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
var import_express8 = require("express");

// src/modules/payments/payments.validation.ts
var import_zod8 = require("zod");
var createPaymentSchema = import_zod8.z.object({
  leaseId: import_zod8.z.string().uuid("Invalid lease ID")
});

// src/lib/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);
var stripe = new import_stripe.default(config_default.stripe_secret_key);

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
    //  line items
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Nestora Rent"
          },
          unit_amount: Math.round(lease.monthlyRent)
        },
        quantity: 1
      }
    ],
    success_url: `http://localhost:3001/payment/sucess?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3001/payment/cancel?leaseId=${lease.id}`,
    metadata: {
      leaseId: lease.id,
      tenantId
    }
  });
  await prisma.payment.create({
    data: {
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
var import_http_status9 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status9.default.OK,
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
      statusCode: import_http_status9.default.OK,
      message: "Webhook processed successfully",
      data: result
    });
  }
);
var getMyPayment = catchAsync(async (req, res, next) => {
  const tenantId = req.user.id;
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
var router8 = (0, import_express8.Router)();
router8.post("/", auth(Role.TENANT), paymentController.createPayment);
router8.post("/webhook", paymentController.handleWebhook);
router8.get("/", paymentController.getMyPayment);
var paymentRoutes = router8;

// src/modules/propertyCategory/propertyCategory.routes.ts
var import_express9 = require("express");

// src/modules/propertyCategory/propertyCategory.validation.ts
var import_zod9 = require("zod");
var createPropertyCategorySchema = import_zod9.z.object({
  name: import_zod9.z.string().min(2, "Category name must be at least 2 characters"),
  slug: import_zod9.z.string().min(2, "Slug must be at least 2 characters").regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only"
  ),
  description: import_zod9.z.string().optional(),
  isActive: import_zod9.z.boolean().optional(),
  sortOrder: import_zod9.z.number().int().nonnegative().optional()
});
var updatePropertyCategorySchema = import_zod9.z.object({
  name: import_zod9.z.string().min(2, "Category name must be at least 2 characters").optional(),
  slug: import_zod9.z.string().min(2, "Slug must be at least 2 characters").regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only"
  ).optional(),
  description: import_zod9.z.string().optional(),
  isActive: import_zod9.z.boolean().optional(),
  sortOrder: import_zod9.z.number().int().nonnegative().optional()
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
    await import_cloudinary.v2.uploader.destroy(isCategoryExists.categoryImgPublicId);
  }
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      const uploadStream = import_cloudinary.v2.uploader.upload_stream(
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
var import_http_status10 = __toESM(require("http-status"), 1);
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
      statusCode: import_http_status10.default.CREATED,
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
      statusCode: import_http_status10.default.OK,
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
      statusCode: import_http_status10.default.OK,
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
      statusCode: import_http_status10.default.OK,
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
      statusCode: import_http_status10.default.OK,
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
      statusCode: import_http_status10.default.OK,
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
var router9 = (0, import_express9.Router)();
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
var import_express10 = require("express");

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
var dashboardService = {
  getTenantDashboardOverviewIntoDB,
  getAdminDashboardOverviewIntoDB,
  getOwnerDashboardOverviewIntoDB
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
var dashboardController = {
  getTenantDashboardOverview,
  getAdminDashboardOverview,
  getOwnerDashboardOverview
};

// src/modules/dashboard/dashboard.routes.ts
var router10 = (0, import_express10.Router)();
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
var dashboardRoutes = router10;

// src/app.ts
var app = (0, import_express11.default)();
app.use(
  (0, import_cors.default)({
    origin: config_default.app_url,
    credentials: true
  })
);
app.use(import_express11.default.json());
app.use((0, import_cookie_parser.default)());
app.use("/api/payment/webhook", import_express11.default.raw({ type: "application/json" }));
app.use(
  import_express11.default.urlencoded({
    extended: true
  })
);
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
//# sourceMappingURL=server.cjs.map