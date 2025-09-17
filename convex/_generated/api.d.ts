/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as SMTPOTP from "../SMTPOTP.js";
import type * as auth from "../auth.js";
import type * as backlinks from "../backlinks.js";
import type * as basicEmailService from "../basicEmailService.js";
import type * as clients from "../clients.js";
import type * as content from "../content.js";
import type * as emailSender from "../emailSender.js";
import type * as emailService from "../emailService.js";
import type * as http from "../http.js";
import type * as kpis from "../kpis.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as rbac from "../rbac.js";
import type * as seedData from "../seedData.js";
import type * as seedDummyData from "../seedDummyData.js";
import type * as sendOTPEmail from "../sendOTPEmail.js";
import type * as seo from "../seo.js";
import type * as simpleAuth from "../simpleAuth.js";
import type * as simpleEmail from "../simpleEmail.js";
import type * as tasks from "../tasks.js";
import type * as testOTP from "../testOTP.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  SMTPOTP: typeof SMTPOTP;
  auth: typeof auth;
  backlinks: typeof backlinks;
  basicEmailService: typeof basicEmailService;
  clients: typeof clients;
  content: typeof content;
  emailSender: typeof emailSender;
  emailService: typeof emailService;
  http: typeof http;
  kpis: typeof kpis;
  notifications: typeof notifications;
  projects: typeof projects;
  rbac: typeof rbac;
  seedData: typeof seedData;
  seedDummyData: typeof seedDummyData;
  sendOTPEmail: typeof sendOTPEmail;
  seo: typeof seo;
  simpleAuth: typeof simpleAuth;
  simpleEmail: typeof simpleEmail;
  tasks: typeof tasks;
  testOTP: typeof testOTP;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
