export async function onRequest() {
  const stationsUrl = `https://gdebenz.ru/api/stations?lat1=56.20&lon1=43.80&lat2=56.38&lon2=44.16&_=${Date.now()}`;
  const commentsUrl = `https://gdebenz.ru/api/comments?lat1=56.20&lon1=43.80&lat2=56.38&lon2=44.16&_=${Date.now()}`;
  const googleBackup = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_nocache=${Date.now()}`;

  const headers = {
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://gdebenz.ru/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  try {
    // Делаем всего ДВА параллельных запроса вместо 28!
    const [stationsRes, commentsRes] = await Promise.all([
      fetch(stationsUrl, { headers }),
      fetch(commentsUrl, { headers }).catch(() => null)
    ]);

    let stations: any[] = [];

    if (stationsRes && stationsRes.ok) {
      stations = await stationsRes.json();
    } else {
      const bRes = await fetch(googleBackup, { redirect: "follow" });
      stations = await bRes.json();
    }

    if (!Array.isArray(stations)) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Если удалось получить сводку комментариев, привязываем их к АЗС
    if (commentsRes && commentsRes.ok) {
      try {
        const commentsData = await commentsRes.json();
        // ГдеБЕНЗ может возвращать массив или объект со списком отметок
        const commentsList = Array.isArray(commentsData) ? commentsData : (commentsData.comments || []);

        for (const c of commentsList) {
          const st = stations.find((s: any) => String(s.osm_id) === String(c.osm_id || c.station_id));
          if (st && (!st.last_driver_at || (c.created_at && c.created_at > st.last_driver_at))) {
            st.detail = c.detail || st.detail;
            st.last_driver_at = c.created_at;
            st.last_at = c.created_at;
            if (c.status) st.status = c.status;
          }
        }
      } catch {
        // Игнорируем ошибку разбора комментариев
      }
    }

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