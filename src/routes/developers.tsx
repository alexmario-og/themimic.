import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old URL kept working: developers now live on the home page. */
export const Route = createFileRoute("/developers")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "team", statusCode: 301 });
  },
});
