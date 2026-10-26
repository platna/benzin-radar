export async function onRequest() {
  // Прямоугольник координат, строго покрывающий Нагорную часть и Ленинский район НН:
  // lat1: 56.22 (юг, Ждановский/Ларина), lon1: 43.82 (запад, Ленинский район)
  // lat2: 56.38 (север, Верхние Печеры/Волга), lon2: 44.15 (восток, Кстово/Казанское шоссе)
  const targetUrl = `https://gdebenz.ru/api/stations?lat1=56.22&lon1=43.82&lat2=56.38&lon2=44.15&_=${Date.now()}`;
  const googleBackup = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_nocache=${Date.now()}`;

  const browserHeaders = {
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://gdebenz.ru/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  try {
    let res = await fetch(targetUrl, { 
      headers: browserHeaders 
    });

    if (!res.ok) {
      res = await fetch(googleBackup, { redirect: "follow" });
    }

    const data = await res.text();
    return new Response(data, {
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
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  }
}