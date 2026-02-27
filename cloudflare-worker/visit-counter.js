/**
 * Beyond Paralysis — Visit Counter Worker
 *
 * SETUP:
 * 1. Create a KV namespace called VISIT_COUNTER in Cloudflare dashboard
 * 2. Bind it to this worker as variable name: COUNTER
 * 3. Deploy this worker
 * 4. Add a route: beyondparalysis.uk/api/visit* → this worker
 *
 * KV keys used:
 *   "total"        — all-time visit count
 *   "daily_YYYY-MM-DD" — visits for that UTC date (UK midnight = UTC midnight in winter)
 */

export default {
  async fetch(request, env) {
    // CORS — allow requests from the site
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://beyondparalysis.uk',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // GET /api/visit — increment and return counts
    if (request.method === 'GET' && url.pathname === '/api/visit') {
      // Today's date key in UK time (UTC in winter, UTC+1 in summer)
      const now = new Date();
      // UK offset: UTC+0 (Oct–Mar) or UTC+1 (Mar–Oct) — approximate with Europe/London
      const ukDate = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now);
      // ukDate is "DD/MM/YYYY" — convert to YYYY-MM-DD for key
      const [day, month, year] = ukDate.split('/');
      const dailyKey = `daily_${year}-${month}-${day}`;

      // Read current values (parallel)
      const [totalStr, dailyStr] = await Promise.all([
        env.COUNTER.get('total'),
        env.COUNTER.get(dailyKey),
      ]);

      const newTotal = (parseInt(totalStr || '0', 10)) + 1;
      const newDaily = (parseInt(dailyStr || '0', 10)) + 1;

      // Write new values (parallel) — daily key expires after 48h automatically
      await Promise.all([
        env.COUNTER.put('total', String(newTotal)),
        env.COUNTER.put(dailyKey, String(newDaily), { expirationTtl: 172800 }),
      ]);

      return new Response(JSON.stringify({ total: newTotal, today: newDaily }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
