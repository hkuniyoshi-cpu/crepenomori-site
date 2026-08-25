// Cloudflare Pages Function
// /sitemap.xml をリクエスト時に GAS の ?sitemap=1 エンドポイントから XML を取得して返す
// GAS の /exec は 302 リダイレクトするため redirect: 'follow' が必須
// エッジで 1 時間キャッシュ

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzJow81oIeb8Sb2xv4ZtHFB3BuyIJGtN5tBxxIlPtfJQ54j_iSjatsbiUjRe3LYEJAjYQ/exec';

export async function onRequest(context) {
  try {
    const upstream = await fetch(GAS_URL + '?sitemap=1', {
      redirect: 'follow',
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!upstream.ok) {
      return new Response('sitemap upstream error: ' + upstream.status, { status: 502 });
    }
    const xml = await upstream.text();
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    return new Response('sitemap error: ' + err.message, { status: 500 });
  }
}
