// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
//import { authOptions } from "./authOptions"; el de google
import { authOptions } from "./authOptionsCredencial";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
