const baseHandler = require('./render-page-postprocess');

function restoreSplash(html) {
  let output = String(html || '');

  // Le renderer consolidé masquait historiquement le splash pour corriger des blocages de clic.
  // Sur la page d'accueil, on restaure l'écran d'introduction animé et on laisse son script gérer la sortie.
  output = output.replace(
    /#splash\{display:none!important;visibility:hidden!important;pointer-events:none!important\}/g,
    '#splash{display:flex;visibility:visible;pointer-events:all}'
  );

  // Sécurise la règle du splash : l'ancien CSS visait #nav alors que la navigation réelle est #navbar.
  output = output.replace(
    /body\.splash-active #nav,/g,
    'body.splash-active #navbar,'
  );

  // Si l'utilisateur recharge une session ancienne, on évite qu'un splash masqué par sessionStorage reste bloquant.
  output = output.replace(
    "document.getElementById('splash').style.display = 'none';",
    "var existingSplash = document.getElementById('splash'); if (existingSplash) existingSplash.style.display = 'none';"
  );

  return output;
}

module.exports = async function handler(req, res) {
  const originalEnd = res.end.bind(res);

  res.end = function patchedEnd(chunk, encoding, callback) {
    try {
      const contentType = typeof res.getHeader === 'function' ? String(res.getHeader('Content-Type') || '') : '';
      const body = Buffer.isBuffer(chunk) ? chunk.toString(encoding || 'utf8') : String(chunk || '');
      if (res.statusCode === 200 && contentType.includes('text/html') && body.includes('id="splash"')) {
        return originalEnd(restoreSplash(body), encoding, callback);
      }
      return originalEnd(chunk, encoding, callback);
    } catch (error) {
      return originalEnd(chunk, encoding, callback);
    }
  };

  return baseHandler(req, res);
};
