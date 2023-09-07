import { authMiddleware } from "@clerk/nextjs";
import { NextMiddleware } from "next/server";

const p: NextMiddleware = (params, event) => {
  console.log(params.url);
  // Добавяме допълнителна проверка за новия път /api/events/get
   if (!params.url.endsWith('/api/events/set_arrived') ) {
    return authMiddleware({})(params, event);
  }
  //return authMiddleware({})(params, event);
}

export default p;
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};