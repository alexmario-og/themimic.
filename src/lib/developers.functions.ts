import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

/** Looks up Roblox avatars by user ID; a failed lookup just leaves the avatar empty. */
export const getAvatars = createServerFn({ method: "GET" })
  .inputValidator((ids: number[]) => ids.filter((n) => Number.isInteger(n) && n > 0).slice(0, 100))
  .handler(async ({ data: ids }) => {
    if (!ids.length) return {} as Record<string, string>;
    try {
      const res = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${ids.join(",")}&size=420x420&format=Png&isCircular=false`,
      );
      if (!res.ok) return {} as Record<string, string>;
      const body = (await res.json()) as { data?: { targetId: number; imageUrl?: string }[] };
      const out: Record<string, string> = {};
      for (const d of body.data ?? []) if (d.imageUrl) out[String(d.targetId)] = d.imageUrl;
      return out;
    } catch {
      return {} as Record<string, string>;
    }
  });

export const avatarsQuery = (ids: number[]) =>
  queryOptions({ queryKey: ["dev-avatars", ids.join(",")], queryFn: () => getAvatars({ data: ids }) });
