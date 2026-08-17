import { FastifyInstance } from "fastify";
import { db } from "../db";
import { urls, clicks } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import UAParser from "ua-parser-js";
import { format, subDays, startOfDay } from "date-fns";

export async function analyticsRoutes(server: FastifyInstance) {
  server.get(
    "/api/urls/:code/analytics",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      const { code } = request.params as { code: string };
      const userId = (request.user as any)?.id;

      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      // Verify the user owns the URL
      const [urlRecord] = await db
        .select()
        .from(urls)
        .where(and(eq(urls.shortCode, code), eq(urls.userId, userId)))
        .limit(1);

      if (!urlRecord) {
        return reply.status(404).send({ error: "URL not found or not owned by user" });
      }

      // Fetch all clicks for this URL
      const urlClicks = await db
        .select()
        .from(clicks)
        .where(eq(clicks.urlId, urlRecord.id))
        .orderBy(desc(clicks.clickedAt));

      // Aggregate data
      const now = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(now, 6 - i); // 6 days ago to today
        return format(d, "MMM dd");
      });

      const clicksByDate: Record<string, number> = {};
      last7Days.forEach(day => clicksByDate[day] = 0);

      const referrersCount: Record<string, number> = {};
      const browsersCount: Record<string, number> = {};
      const osCount: Record<string, number> = {};

      const parser = new UAParser();

      urlClicks.forEach((click) => {
        // 1. Timeline
        if (click.clickedAt) {
          const clickDate = format(new Date(click.clickedAt), "MMM dd");
          if (clicksByDate[clickDate] !== undefined) {
            clicksByDate[clickDate]++;
          }
        }

        // 2. Referrers
        const ref = click.referrer || "Direct";
        let domain = ref;
        try {
          if (ref !== "Direct") {
             const urlObj = new URL(ref);
             domain = urlObj.hostname.replace("www.", "");
          }
        } catch (e) {
          // Invalid URL, fallback to raw referrer string
        }
        referrersCount[domain] = (referrersCount[domain] || 0) + 1;

        // 3. Devices/Browsers
        if (click.userAgent) {
          parser.setUA(click.userAgent);
          const browser = parser.getBrowser().name || "Unknown";
          const os = parser.getOS().name || "Unknown";
          
          browsersCount[browser] = (browsersCount[browser] || 0) + 1;
          osCount[os] = (osCount[os] || 0) + 1;
        } else {
          browsersCount["Unknown"] = (browsersCount["Unknown"] || 0) + 1;
          osCount["Unknown"] = (osCount["Unknown"] || 0) + 1;
        }
      });

      // Format for recharts
      const timeline = last7Days.map(date => ({
        date,
        clicks: clicksByDate[date],
      }));

      const topReferrers = Object.entries(referrersCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      const topBrowsers = Object.entries(browsersCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
        
      const topOs = Object.entries(osCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      return {
        url: urlRecord,
        totalClicks: urlClicks.length,
        timeline,
        topReferrers,
        topBrowsers,
        topOs,
      };
    }
  );
}
