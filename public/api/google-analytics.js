import { google } from "googleapis";

const ALLOWED_DAYS = [7, 30, 90];
const DEFAULT_HOSTNAME = "www.samuelezranas.codes";

function parseDays(input) {
  const numeric = Number.parseInt(String(input || "30"), 10);
  return ALLOWED_DAYS.includes(numeric) ? numeric : 30;
}

function getCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
      };
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON tidak valid (bukan JSON). ");
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Service account Google belum dikonfigurasi.");
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

function buildHostFilter(hostName) {
  return {
    filter: {
      fieldName: "hostName",
      stringFilter: {
        matchType: "EXACT",
        value: hostName,
      },
    },
  };
}

function toMetricNumber(row, index) {
  if (!row?.metricValues?.[index]?.value) {
    return 0;
  }
  const numeric = Number.parseInt(row.metricValues[index].value, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method tidak diizinkan." });
  }

  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return res.status(500).json({
        error: "GA4_PROPERTY_ID belum diatur di environment Vercel.",
      });
    }

    const hostName = process.env.GA_HOSTNAME || DEFAULT_HOSTNAME;
    const days = parseDays(req.query.days);
    const { clientEmail, privateKey } = getCredentials();

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({ version: "v1beta", auth });

    const [dailyReport, topPagesReport] = await Promise.all([
      analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "screenPageViews" }],
          orderBys: [{ dimension: { dimensionName: "date", orderType: "ALPHANUMERIC" } }],
          metricAggregations: ["TOTAL"],
          dimensionFilter: buildHostFilter(hostName),
        },
      }),
      analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          dimensionFilter: buildHostFilter(hostName),
          limit: 8,
        },
      }),
    ]);

    const dailyRows = dailyReport.data?.rows || [];
    const topPageRows = topPagesReport.data?.rows || [];
    const totals = dailyReport.data?.totals?.[0];

    const responseBody = {
      rangeLabel: `Last ${days} days`,
      summary: {
        sessions: toMetricNumber(totals, 0),
        users: toMetricNumber(totals, 1),
        pageViews: toMetricNumber(totals, 2),
      },
      daily: dailyRows.map((row) => ({
        date: row.dimensionValues?.[0]?.value || "",
        sessions: toMetricNumber(row, 0),
        users: toMetricNumber(row, 1),
        pageViews: toMetricNumber(row, 2),
      })),
      topPages: topPageRows.map((row) => ({
        pagePath: row.dimensionValues?.[0]?.value || "/",
        pageViews: toMetricNumber(row, 0),
      })),
    };

    return res.status(200).json(responseBody);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Terjadi kesalahan saat mengambil data Google Analytics.",
    });
  }
}
