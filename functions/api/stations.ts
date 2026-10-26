export async function onRequest() {
  const targetUrl = `https://gdebenz.ru/api/stations?lat1=56.20&lon1=43.80&lat2=56.38&lon2=44.16&_=${Date.now()}`;
  const googleBackup = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_nocache=${Date.now()}`;

  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://gdebenz.ru/",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  try {
    const res = await fetch(targetUrl, { headers });
    let stations: any[] = [];

    if (res.ok) {
      stations = await res.json();
    } else {
      const bRes = await fetch(googleBackup, { redirect: "follow" });
      stations = await bRes.json();
    }

    if (!Array.isArray(stations)) {
      return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    // Для целевых АЗС запрашиваем самую свежую отметку водителя напрямую
    const targetOsmIds = [
      "2479390676", "1674764865", "13947402184", "599191712", "1731947616",
      "1942823075", "1658293594", "1673731750", "usr_UtHRpk4hluU", "3043826790",
      "1706992430", "4748992371", "12960097557", "usr__IZ5Ams1XlM", "usr_tzWzTV6gNxU",
      "usr_eec8C6Wd3Ek", "1585250197", "968431748", "1979549015", "428600249",
      "1873946701", "503595021", "10108987158", "1839076936", "472059201",
      "1188839960", "965102137", "4221673408"
    ];

    const matchedStations = stations.filter((s: any) => targetOsmIds.includes(String(s.osm_id)));

    await Promise.all(
      matchedStations.map(async (s: any) => {
        try {
          const cRes = await fetch(`https://gdebenz.ru/api/comments/${s.osm_id}/recent?limit=2&_=${Date.now()}`, { headers });
          if (cRes.ok) {
            const comments = await cRes.json();
            if (Array.isArray(comments) && comments.length > 0) {
              const latest = comments[0];
              s.detail = latest.detail || "";
              s.last_driver_at = latest.created_at || s.last_driver_at;
              s.last_at = latest.created_at || s.last_at;
              if (latest.status) s.status = latest.status;
            }
          }
        } catch {
          // Игнорируем единичные сбои
        }
      })
    );

    return new Response(JSON.stringify(stations), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  } catch (err) {
    const bRes = await fetch(googleBackup, { redirect: "follow" });
    const data = await bRes.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}