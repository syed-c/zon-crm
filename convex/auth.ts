import { convexAuth } from "@convex-dev/auth/server";
import { SMTPOTP } from "./SMTPOTP";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [SMTPOTP],
});