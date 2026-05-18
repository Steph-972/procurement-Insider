function applyComplianceLayer(html) {
  var out = String(html || '');
  if (out.indexOf('pi-legal-links') === -1) {
    var links = '<div id="pi-legal-links"><a href="/mentions-legales">Mentions legales</a> <a href="/conditions-generales-prestations-services">CGPS</a> <a href="/politique-confidentialite">Confidentialite</a> <a href="/politique-cookies">Cookies</a> <a href="/deontologie">Deontologie</a></div>';
    out = out.replace('</body>', links + '</body>');
  }
  return out;
}

module.exports = { applyComplianceLayer };
