export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 同網域其實不用，先放著也可
  res.status(200).json({
    ok: true,
    ts: Date.now(),
    ua: req.headers['user-agent'] || ''
  });
}
