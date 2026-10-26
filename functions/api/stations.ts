export async function onRequest() {
  const googleApiUrl = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_t=${Date.now()}`;
  const directUrl = `https://corsproxy.io/?url=https://gdebenz.ru/api/nearby?lat=56.3269&lon=44.0059&radius_km=25&limit=200&_t=${Date.now()}`;

  try {
    let res = await fetch(googleApiUrl, { redirect: "follow" });
    if (!res.ok) {
      res = await fetch(directUrl);
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
    try {
      const res = await fetch(directUrl);
      const data = await res.text();
      return new Response(data, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      });
    } catch (e) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
}