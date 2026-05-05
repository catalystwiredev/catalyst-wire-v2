import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id:           string;
    plan:         string;
    plan_status:  string;
  }
  interface Session {
    user: {
      id:           string;
      email:        string;
      name:         string | null;
      plan:         string;
      plan_status:  string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:           string;
    plan:         string;
    plan_status:  string;
  }
}
