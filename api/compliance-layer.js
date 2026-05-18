function addLegalLinks(out) {
  if (out.indexOf('pi-legal-links') !== -1) return out;
  var links = '<div id="pi-legal-links"><span>Ressources :</span> <a href="/a-propos">A propos</a> <a href="/formation-marches-publics-martinique">Formation</a> <a href="/entites-publiques">Entites publiques</a> <a href="/entreprises-privees">Entreprises privees</a> <a href="/insights">Insights</a> <a href="/outils-gratuits">Outils gratuits</a> <span>Juridique :</span> <a href="/mentions-legales">Mentions legales</a> <a href="/conditions-generales-prestations-services">CGPS</a> <a href="/politique-confidentialite">Confidentialite</a> <a href="/politique-cookies">Cookies</a> <a href="/deontologie">Deontologie</a></div>';
  return out.replace('</body>', links + '</body>');
}

function addStyle(out) {
  if (out.indexOf('pi-compliance-style') !== -1) return out;
  var style = '<style id="pi-compliance-style">#cookie-banner{display:none!important}#pi-legal-links{max-width:1180px;margin:0 auto;padding:18px 24px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;font-size:13px;background:#07172D;color:rgba(255,255,255,.68)}#pi-legal-links a{color:#C9A84C;text-decoration:none;font-weight:700}#pi-legal-links span{color:#fff;font-weight:800}.pi-form-legal{font-size:12px;line-height:1.55;color:#6B7080;margin-top:12px}.pi-cookie-box{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;background:#0F2342;color:white;border:1px solid #C9A84C;border-radius:14px;padding:14px;display:flex;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 20px 60px rgba(0,0,0,.25)}.pi-cookie-box p{margin:0;font-size:13px;line-height:1.45;color:rgba(255,255,255,.78)}.pi-cookie-box a{border:1px solid rgba(255,255,255,.35);color:white;border-radius:999px;padding:8px 12px;font-weight:700;text-decoration:none;font-size:12px}.pi-cookie-box a:last-child{background:#C9A84C;color:#0F2342;border-color:#C9A84C}.pi-mobile-fallback{display:none}.pi-conversion-note{background:#fff9ec;border-left:4px solid #C9A84C;border-radius:12px;padding:14px 16px;margin:18px auto;font-size:14px;line-height:1.6;color:#0F2342;max-width:920px}#splash-tagline{white-space:normal!important;text-align:center!important;line-height:1.7!important;max-width:760px!important;width:min(86vw,760px)!important;color:rgba(255,255,255,.52)!important}.hero-subtitle{max-width:720px!important}.hero-title-balanced{max-width:760px!important}.hero-title-balanced em{color:#C9A84C!important;font-style:italic!important}@media(max-width:768px){.pi-cookie-box{position:static;margin:12px;flex-direction:column;align-items:flex-start}.pi-mobile-fallback{display:block;position:fixed;right:18px;top:14px;z-index:10050}.pi-mobile-fallback summary{list-style:none;background:#C9A84C;color:#0F2342;border-radius:4px;padding:8px 12px;font-weight:800;cursor:pointer}.pi-mobile-fallback summary::-webkit-details-marker{display:none}.pi-mobile-fallback div{position:fixed;left:0;right:0;top:58px;background:#0F2342;padding:24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,.32)}.pi-mobile-fallback a{color:#fff;text-decoration:none;font-size:18px;font-family:Georgia,serif}.pi-mobile-fallback a:hover{color:#C9A84C}}</style>';
  return out.replace('</head>', style + '</head>');
}

function simplifyHeaderLinks(out) {
  out = out.replace(/(<ul class="nav-links">)([\s\S]*?)(<\/ul>)/i, function(m, open, body, close) {
    body = body
      .replace(/\s*<li><a href="\/entites-publiques"[^>]*>[^<]*<\/a><\/li>/gi, '')
      .replace(/\s*<li><a href="\/entreprises-privees"[^>]*>[^<]*<\/a><\/li>/gi, '')
      .replace(/\s*<li><a href="\/a-propos"[^>]*>[^<]*<\/a><\/li>/gi, '')
      .replace(/\s*<li><a href="\/faq"[^>]*>[^<]*<\/a><\/li>/gi, '');
    if (body.indexOf('/formation-marches-publics-martinique') === -1) {
      body = body.replace(/(<li><a href="\/services"[^>]*>Services<\/a><\/li>)/i, '$1\n        <li><a href="/formation-marches-publics-martinique">Formation</a></li>');
    }
    return open + body + close;
  });
  out = out.replace(/(<div class="mobile-menu"[\s\S]*?>)([\s\S]*?)(<\/div>)/i, function(m, open, body, close) {
    if (body.indexOf('/entites-publiques') === -1) body += '<a href="/entites-publiques" onclick="toggleMenu()">Entites publiques</a>';
    if (body.indexOf('/entreprises-privees') === -1) body += '<a href="/entreprises-privees" onclick="toggleMenu()">Entreprises privees</a>';
    if (body.indexOf('/formation-marches-publics-martinique') === -1) body += '<a href="/formation-marches-publics-martinique" onclick="toggleMenu()">Formation</a>';
    if (body.indexOf('/a-propos') === -1) body += '<a href="/a-propos" onclick="toggleMenu()">A propos</a>';
    return open + body + close;
  });
  return out.replace(/href="\/#insights"/g, 'href="/insights"');
}

function addFallbackMobileMenu(out) {
  if (out.indexOf('pi-mobile-fallback') !== -1 || out.indexOf('mobile-menu') !== -1) return out;
  var menu = '<details class="pi-mobile-fallback"><summary>Menu</summary><div><a href="/services">Services</a><a href="/formation-marches-publics-martinique">Formation</a><a href="/outils-gratuits">Outils gratuits</a><a href="/insights">Insights</a><a href="/#contact">Contact</a><a href="/entites-publiques">Entites publiques</a><a href="/entreprises-privees">Entreprises privees</a><a href="/a-propos">A propos</a></div></details>';
  return out.replace('</body>', menu + '</body>');
}

function optimizeConversionCopy(out) {
  return String(out || '')
    .replace(/Diagnostic gratuit de votre besoin/g, 'Diagnostic gratuit')
    .replace(/Diagnostic gratuit/g, 'Diagnostic gratuit')
    .replace(/Demander un diagnostic gratuit/g, 'Demander un diagnostic')
    .replace(/Demander un diagnostic/g, 'Demander un diagnostic')
    .replace(/Optimiser mon mémoire/g, 'Faire relire mon mémoire technique')
    .replace(/Voir les offres/g, 'Comparer les accompagnements')
    .replace(/Recevoir la grille gratuite/g, 'Recevoir la grille MAPA gratuite')
    .replace(/Télécharger la grille/g, 'Recevoir la grille MAPA')
    .replace(/Envoyer ma demande/g, 'Envoyer ma demande confidentielle')
    .replace(/Réserver mon appel/g, 'Présenter mon besoin')
    .replace(/Prendre rendez-vous/g, 'Demander un échange de cadrage')
    .replace(/Parler de mon projet/g, 'Présenter mon contexte')
    .replace(/Je veux être accompagné/g, 'Demander un accompagnement');
}

function patchHeroMessaging(out) {
  var heroTitle = '<h1 class="display hero-title hero-title-balanced">J’ai rédigé vos cahiers des charges.<br><em>Aujourd’hui, je renforce vos offres.</em></h1>';
  var heroSubtitle = '<p class="lead hero-subtitle hero-subtitle-agency">Des deux côtés de la table.<br>La même exigence de méthode.</p>';
  var guarantee = 'J’aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l’acheteur.';

  return String(out || '')
    .replace(/Conseil · Formation · Marchés Publics/g, 'Marchés publics. Dossiers plus lisibles. Procédures plus robustes.')
    .replace(/<div id="splash-tagline">[\s\S]*?<\/div>/i, '<div id="splash-tagline">Marchés publics. Dossiers plus lisibles. Procédures plus robustes.</div>')
    .replace(/<div class="hero-eyebrow label">[\s\S]*?<\/div>/i, '<div class="hero-eyebrow label">Commande publique — Martinique & Antilles</div>')
    .replace(/<h1 class="display hero-title(?: [^"]*)?">[\s\S]*?<\/h1>\s*<p class="lead hero-subtitle(?: [^"]*)?">[\s\S]*?<\/p>/i, heroTitle + heroSubtitle)
    .replace(/<p class="hero-guarantee-line">[\s\S]*?<\/p>/i, '<p class="hero-guarantee-line">' + guarantee + '</p>')
    .replace(/<p style="font-size:\.78rem;color:rgba\(255,255,255,\.45\);[\s\S]*?<\/p>/i, '<p class="hero-guarantee-line">' + guarantee + '</p>')
    .replace(/Analyser mon dossier/g, 'Présenter mon besoin')
    .replace(/Diagnostic gratuit 30 min/g, 'Présenter mon besoin')
    .replace(/Découvrir les services/g, 'Voir les accompagnements')
    .replace(/<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba\(255,255,255,.1\);border:1px solid rgba\(255,255,255,.18\);border-radius:20px;padding:.3rem .85rem;font-family:var\(--mono\);font-size:.68rem;letter-spacing:.05em;color:rgba\(255,255,255,.82\)"><strong style="color:var\(--gold\)">52\+<\/strong>&nbsp;dossiers<\/span>/g, '<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:.3rem .85rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.05em;color:rgba(255,255,255,.82)"><strong style="color:var(--gold)">4</strong>&nbsp;axes</span>')
    .replace(/<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba\(255,255,255,.1\);border:1px solid rgba\(255,255,255,.18\);border-radius:20px;padding:.3rem .85rem;font-family:var\(--mono\);font-size:.68rem;letter-spacing:.05em;color:rgba\(255,255,255,.82\)"><strong style="color:var\(--gold\)">93%<\/strong>&nbsp;satisfaction<\/span>/g, '<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:.3rem .85rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.05em;color:rgba(255,255,255,.82)"><strong style="color:var(--gold)">0</strong>&nbsp;promesse d’attribution</span>')
    .replace(/J'aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l'acheteur\./g, guarantee)
    .replace(/J’aide à structurer des dossiers plus lisibles et des procédures plus robustes, dans le respect des règles applicables et d’un cadre déontologique strict\./g, guarantee)
    .replace(/J’aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l’acheteur, sans jamais garantir l’attribution\./g, guarantee)
    .replace(/Je m'engage sur la qualité de mes conseils et de mes méthodes\. Jamais sur l'attribution d'un marché — c'est une décision qui appartient exclusivement à l'acheteur public\./g, guarantee);
}

function patchHardcodedStats(out) {
  return String(out || '')
    .replace(/data-val="52" data-suffix="\+">52\+<\/div>\s*<div class="stat-lbl">Dossiers analysés<\/div>/g, 'data-val="4" data-suffix="">4</div><div class="stat-lbl">Axes d’accompagnement</div>')
    .replace(/data-val="93" data-suffix="%">93%<\/div>\s*<div class="stat-lbl">(?:Retours satisfaits|Satisfaction clients)<\/div>/g, 'data-val="7" data-suffix="">7</div><div class="stat-lbl">Modules pratiques</div>')
    .replace(/data-val="4" data-suffix="">4<\/div>\s*<div class="stat-lbl">(?:Missions publiques|Collectivités accompagnées)<\/div>/g, 'data-val="1" data-suffix="">1</div><div class="stat-lbl">Cadre déontologique strict</div>')
    .replace(/data-val="7" data-suffix="">7<\/div>\s*<div class="stat-lbl">(?:Sessions terrain|Formations dispensées)<\/div>/g, 'data-val="0" data-suffix="">0</div><div class="stat-lbl">Promesse d’attribution</div>')
    .replace(/>52\+<\/div>\s*<div class="stat-lbl">Dossiers analysés<\/div>/g, '>4</div><div class="stat-lbl">Axes d’accompagnement</div>')
    .replace(/>93%<\/div>\s*<div class="stat-lbl">(?:Retours satisfaits|Satisfaction clients)<\/div>/g, '>7</div><div class="stat-lbl">Modules pratiques</div>');
}

function addConversionNote(out) {
  if (out.indexOf('pi-conversion-note') !== -1) return out;
  if (out.indexOf('id="contact"') === -1 && out.indexOf('id="lead-form"') === -1) return out;
  var note = '<div class="pi-conversion-note"><strong>Avant toute mission :</strong> un premier échange permet de cadrer votre besoin, vérifier les délais, identifier les documents disponibles et écarter toute incompatibilité déontologique. L’accompagnement repose toujours sur une obligation de moyens.</div>';
  return out.replace(/(<section[^>]*id="contact"[\s\S]*?>)/i, '$1' + note).replace(/(<form[^>]*id="lead-form"[\s\S]*?>)/i, note + '$1');
}

function addFormNotice(out) {
  if (out.indexOf('pi-form-legal') !== -1) return out;
  var notice = '<p class="pi-form-legal">Les informations transmises sont traitees pour repondre a votre demande. Les prestations reposent sur une obligation de moyens. Consultez les <a href="/conditions-generales-prestations-services">CGPS</a>, la <a href="/politique-confidentialite">Confidentialite</a> et la <a href="/deontologie">Deontologie</a>.</p>';
  out = out.replace(/(<button[^>]*type=["']submit["'][\s\S]*?<\/button>)/i, '$1' + notice);
  out = out.replace(/(<button[^>]*class=["'][^"']*btn-submit-tool[^"']*["'][\s\S]*?<\/button>)/i, '$1' + notice);
  return out;
}

function addCookieBox(out) {
  if (out.indexOf('pi-cookie-box') !== -1) return out;
  var box = '<div class="pi-cookie-box"><p>Cookies necessaires au fonctionnement du site. Pour les autres cookies, vous pouvez accepter, refuser ou personnaliser vos choix.</p><div><a href="/politique-cookies#preferences">Tout refuser</a><a href="/politique-cookies#preferences">Personnaliser</a><a href="/politique-cookies#preferences">Tout accepter</a></div></div>';
  return out.replace('</body>', box + '</body>');
}

function applyComplianceLayer(html) {
  var out = String(html || '');
  out = addStyle(out);
  out = simplifyHeaderLinks(out);
  out = addFallbackMobileMenu(out);
  out = optimizeConversionCopy(out);
  out = patchHeroMessaging(out);
  out = patchHardcodedStats(out);
  out = addConversionNote(out);
  out = addFormNotice(out);
  out = addLegalLinks(out);
  out = addCookieBox(out);
  return out;
}

module.exports = { applyComplianceLayer };
