function addLegalLinks(out) {
  if (out.indexOf('pi-legal-links') !== -1) return out;
  var links = '<div id="pi-legal-links"><a href="/mentions-legales">Mentions legales</a> <a href="/conditions-generales-prestations-services">CGPS</a> <a href="/politique-confidentialite">Confidentialite</a> <a href="/politique-cookies">Cookies</a> <a href="/deontologie">Deontologie</a></div>';
  return out.replace('</body>', links + '</body>');
}

function addStyle(out) {
  if (out.indexOf('pi-compliance-style') !== -1) return out;
  var style = '<style id="pi-compliance-style">#pi-legal-links{max-width:1180px;margin:0 auto;padding:18px 24px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;font-size:13px;background:#07172D}#pi-legal-links a{color:#C9A84C;text-decoration:none;font-weight:700}#pi-legal-links a:hover{text-decoration:underline}.pi-form-legal{font-size:12px;line-height:1.55;color:#6B7080;margin-top:12px}.pi-form-legal a{font-weight:700}</style>';
  return out.replace('</head>', style + '</head>');
}

function addFormNotice(out) {
  if (out.indexOf('pi-form-legal') !== -1) return out;
  var notice = '<p class="pi-form-legal">Les informations transmises sont traitees pour repondre a votre demande. Les prestations reposent sur une obligation de moyens. Consultez les <a href="/conditions-generales-prestations-services">CGPS</a>, la <a href="/politique-confidentialite">Confidentialite</a> et la <a href="/deontologie">Deontologie</a>.</p>';
  return out.replace(/(<button[^>]*type=["']submit["'][\s\S]*?<\/button>)/i, '$1' + notice);
}

function applyComplianceLayer(html) {
  var out = String(html || '');
  out = addStyle(out);
  out = addFormNotice(out);
  out = addLegalLinks(out);
  return out;
}

module.exports = { applyComplianceLayer };
