export async function onRequest() {
  const googleApiUrl = `https://script.google.com/macros/s/AKfycbyUPXLErRCVsppYkzCeAuCNFoYPq_I8DqMI48pE5XOa_odGWhPOYZE5wOLZeqvohKfe/exec?_t=${Date.now()}`;

  try {
    const res = await fetch(googleApiUrl, { redirect: "follow" });
    const data = await res.text();
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}