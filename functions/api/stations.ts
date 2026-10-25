export async function onRequest() {
  const targetUrl = "https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200";
  const googleBackup = "https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec";

  try {
    // 1. Пробуем забрать данные напрямую у ГдеБЕНЗ с сервера Cloudflare
    let res = await fetch(targetUrl, { headers: { "Accept": "application/json" } });

    // 2. Если ГдеБЕНЗ сбоит — забираем через ваш Google Script
    if (!res.ok) {
      res = await fetch(googleBackup, { redirect: "follow" });
    }

    const data = await res.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    // Резервная попытка через Google Script при ошибке сети
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
