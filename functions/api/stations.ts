export async function onRequest() {
  // Координаты Нижнего Новгорода
  const targetUrl = `https://gdebenz.ru/api/stations?lat1=56.22&lon1=43.82&lat2=56.38&lon2=44.15&_=${Date.now()}`;
  const googleBackup = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_nocache=${Date.now()}`;

  const browserHeaders = {
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://gdebenz.ru/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  try {
    let res = await fetch(targetUrl, { headers: browserHeaders });

    if (!res.ok) {
      res = await fetch(googleBackup, { redirect: "follow" });
      const backupData = await res.text();
      return new Response(backupData, { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    const stations = await res.json();
    if (!Array.isArray(stations)) {
      return new Response(JSON.stringify(stations), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    // Выбираем только целевые сети: Лукойл, Teboil, Газпромнефть
    const targetStations = stations.filter((s: any) => {
      const brand = (s.brand || s.name || "").toLowerCase();
      return brand.includes("лукойл") || brand.includes("lukoil") ||
             brand.includes("teboil") || brand.includes("тебойл") ||
             brand.includes("газпром") || brand.includes("gazprom");
    });

    // Параллельно подтягиваем самую свежую отметку водителя из ГдеБЕНЗ для каждой целевой АЗС
    await Promise.all(
      targetStations.map(async (s: any) => {
        if (!s.osm_id) return;
        try {
          const cRes = await fetch(`https://gdebenz.ru/api/comments/${s.osm_id}/recent?limit=3&_=${Date.now()}`, {
            headers: browserHeaders
          });
          if (cRes.ok) {
            const comments = await cRes.json();
            if (Array.isArray(comments) && comments.length > 0) {
              const latest = comments[0]; // Самая последняя отметка водителя!
              s.detail = latest.detail || s.detail || "";
              s.last_driver_at = latest.created_at || s.last_driver_at;
              s.last_at = latest.created_at || s.last_at;
              s.on_site = Boolean(latest.on_site);
              if (latest.status) s.status = latest.status;
            }
          }
        } catch {
          // Если комментарий не подгрузился, используем общие данные
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
    const res = await fetch(googleBackup, { redirect: "follow" });
    const data = await res.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}