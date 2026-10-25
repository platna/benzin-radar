export async function onRequest() {
  // Добавляем генератор случайного числа (Date.now), чтобы Cloudflare и ГдеБЕНЗ не могли отдать старый кэш!
  const targetUrl = `https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200&_nocache=${Date.now()}`;
  const googleBackup = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_nocache=${Date.now()}`;

  try {
    let res = await fetch(targetUrl, { 
      headers: { 
        "Accept": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate" 
      } 
    });

    if (!res.ok) {
      res = await fetch(googleBackup, { redirect: "follow" });
    }

    const data = await res.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store" // Запрещаем браузеру кэшировать ответ сервера
      }
    });
  } catch (err) {
    const res = await fetch(googleBackup, { redirect: "follow" });
    const data = await res.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      }
    });
  }
}