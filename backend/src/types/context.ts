import type { DotCoRole } from "@dotco/contracts";

export type AuthenticatedUser = {
  userId: string;
  email?: string;
  roles: DotCoRole[];
  tokenUse: "access" | "id";
};

export type AppBindings = {
  Variables: {
    requestId: string;
    user?: AuthenticatedUser;
  };
};
