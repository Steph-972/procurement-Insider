function addLegalLinks(out) {
  if (out.indexOf('pi-legal-links') !== -1) return out;
  var links = '<div id="pi-legal-links"><span>Ressources :</span> <a href="/a-propos">A propos</a> <a href="/formation-marches-publics-martinique">Formation</a> <a href="/entites-publiques">Entites publiques</a> <a href="/entreprises-privees">Entreprises privees</a> <a href="/insights">Insights</a> <a href="/outils-gratuits">Outils gratuits</a> <span>Juridique :</span> <a href="/mentions-legales">Mentions legales</a> <a href="/conditions-generales-prestations-services">CGPS</a> <a href="/politique-confidentialite">Confidentialite</a> <a href="/politique-cookies">Cookies</a> <a href="/deontologie">Deontologie</a></div>';
  return out.replace('</body>', links + '</body>');
}

function addStyle(out) {
  if (out.indexOf('pi-compliance-style') !== -1) return out;
  var style = '<style id="pi-compliance-style">#cookie-banner{display:none!important}#pi-legal-links{max-width:1180px;margin:0 auto;padding:18px 24px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;font-size:13px;background:#07172D;color:rgba(255,255,255,.68)}#pi-legal-links a{color:#C9A84C;text-decoration:none;font-weight:700}#pi-legal-links span{color:#fff;font-weight:800}.pi-form-legal{font-size:12px;line-height:1.55;color:#6B7080;margin-top:12px}.pi-cookie-box{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;background:#0F2342;color:white;border:1px solid #C9A84C;border-radius:14px;padding:14px;display:none;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 20px 60px rgba(0,0,0,.25)}.pi-cookie-box[data-visible="true"]{display:flex}.pi-cookie-box p{margin:0;font-size:13px;line-height:1.45;color:rgba(255,255,255,.78)}.pi-cookie-box .pi-cookie-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end}.pi-cookie-box button,.pi-cookie-box a{border:1px solid rgba(255,255,255,.35);background:transparent;color:white;border-radius:999px;padding:8px 12px;font-weight:700;text-decoration:none;font-size:12px;cursor:pointer;font-family:inherit;line-height:1}.pi-cookie-box button:hover,.pi-cookie-box a:hover{border-color:#C9A84C;color:#C9A84C}.pi-cookie-box button.pi-cookie-primary{background:#C9A84C;color:#0F2342;border-color:#C9A84C}.pi-cookie-box button.pi-cookie-primary:hover{background:#E8C96A;color:#0F2342}.pi-mobile-fallback{display:none}.pi-conversion-note{background:#fff9ec;border-left:4px solid #C9A84C;border-radius:12px;padding:14px 16px;margin:18px auto;font-size:14px;line-height:1.6;color:#0F2342;max-width:920px}#splash-tagline{white-space:normal!important;text-align:center!important;line-height:1.7!important;max-width:760px!important;width:min(86vw,760px)!important;color:rgba(255,255,255,.52)!important}.hero-subtitle{max-width:720px!important}.hero-title-balanced{max-width:760px!important}.hero-title-balanced em{color:#C9A84C!important;font-style:italic!important}@media(max-width:768px){.pi-cookie-box{position:static;margin:12px;flex-direction:column;align-items:flex-start}.pi-cookie-box[data-visible="true"]{display:flex}.pi-cookie-box .pi-cookie-actions{justify-content:flex-start}.pi-mobile-fallback{display:block;position:fixed;right:18px;top:14px;z-index:10050}.pi-mobile-fallback summary{list-style:none;background:#C9A84C;color:#0F2342;border-radius:4px;padding:8px 12px;font-weight:800;cursor:pointer}.pi-mobile-fallback summary::-webkit-details-marker{display:none}.pi-mobile-fallback div{position:fixed;left:0;right:0;top:58px;background:#0F2342;padding:24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,.32)}.pi-mobile-fallback a{color:#fff;text-decoration:none;font-size:18px;font-family:Georgia,serif}.pi-mobile-fallback a:hover{color:#C9A84C}}</style>';
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
    .replace(/Je veux être accompagné/g, 'Demander un accompagnement')
    .replace(/Optimiser mon mémoire/g, 'Faire relire mon mémoire technique')
    .replace(/Parler de mon dossier/g, 'Présenter mon dossier')
    .replace(/Sécuriser mon DCE/g, 'Sécuriser ma procédure');
}

function patchHeroMessaging(out) {
  var heroTitle = '<h1 class="display hero-title hero-title-balanced"><span>Des offres plus lisibles.</span><em>Des procédures plus robustes.</em></h1>';
  var heroSubtitle = '<p class="lead hero-subtitle hero-subtitle-agency">Dix années au cœur de la commande publique m’ont donné une lecture que peu de prestataires possèdent : comprendre ce qu’un acheteur attend réellement au moment d’analyser une offre. Aujourd’hui, je transforme cette expérience terrain en méthode claire pour aider les entreprises à mieux répondre et les entités publiques à acheter plus juste.</p>';
  var guarantee = 'Je m’engage sur la qualité de mes conseils et de mes méthodes. Jamais sur l’attribution d’un marché — c’est une décision qui appartient exclusivement à l’acheteur public.';

  return String(out || '')
    .replace(/Marchés publics\. Dossiers plus lisibles\. Procédures plus robustes\./g, 'Clarifier. Structurer. Sécuriser.')
    .replace(/Conseil · Formation · Marchés Publics/g, 'Clarifier. Structurer. Sécuriser.')
    .replace(/<div id="splash-tagline">[\s\S]*?<\/div>/i, '<div id="splash-tagline">Clarifier. Structurer. Sécuriser.</div>')
    .replace(/<div class="hero-eyebrow label">[\s\S]*?<\/div>/i, '<div class="hero-eyebrow label">Conseil marchés publics — Martinique</div>')
    .replace(/<h1 class="display hero-title(?: [^"]*)?">[\s\S]*?<\/h1>\s*<p class="lead hero-subtitle(?: [^"]*)?">[\s\S]*?<\/p>/i, heroTitle + heroSubtitle)
    .replace(/<p class="hero-guarantee-line">[\s\S]*?<\/p>/i, '<p class="hero-guarantee-line">' + guarantee + '</p>')
    .replace(/<p style="font-size:\.78rem;color:rgba\(255,255,255,\.45\);[\s\S]*?<\/p>/i, '<p class="hero-guarantee-line">' + guarantee + '</p>')
    .replace(/Présenter mon besoin/g, 'Analyser mon dossier')
    .replace(/Diagnostic gratuit 30 min/g, 'Analyser mon dossier')
    .replace(/Découvrir les services/g, 'Voir les accompagnements')
    .replace(/<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba\(255,255,255,.1\);border:1px solid rgba\(255,255,255,.18\);border-radius:20px;padding:.3rem .85rem;font-family:var\(--mono\);font-size:.68rem;letter-spacing:.05em;color:rgba\(255,255,255,.82\)"><strong style="color:var\(--gold\)">52\+<\/strong>&nbsp;dossiers<\/span>/g, '<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:.3rem .85rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.05em;color:rgba(255,255,255,.82)"><strong style="color:var(--gold)">4</strong>&nbsp;axes</span>')
    .replace(/<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba\(255,255,255,.1\);border:1px solid rgba\(255,255,255,.18\);border-radius:20px;padding:.3rem .85rem;font-family:var\(--mono\);font-size:.68rem;letter-spacing:.05em;color:rgba\(255,255,255,.82\)"><strong style="color:var\(--gold\)">93%<\/strong>&nbsp;satisfaction<\/span>/g, '<span style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:.3rem .85rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.05em;color:rgba(255,255,255,.82)"><strong style="color:var(--gold)">3</strong>&nbsp;engagements clés</span>')
    .replace(/J'aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l'acheteur\./g, guarantee)
    .replace(/J’aide à structurer des dossiers plus lisibles et des procédures plus robustes, dans le respect des règles applicables et d’un cadre déontologique strict\./g, guarantee)
    .replace(/J’aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l’acheteur\./g, guarantee)
    .replace(/J’aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l’acheteur, sans jamais garantir l’attribution\./g, guarantee)
    .replace(/Je m'engage sur la qualité de mes conseils et de mes méthodes\. Jamais sur l'attribution d'un marché — c'est une décision qui appartient exclusivement à l'acheteur public\./g, guarantee);
}

function patchHardcodedStats(out) {
  return String(out || '')
    .replace(/data-val="52" data-suffix="\+">52\+<\/div>\s*<div class="stat-lbl">Dossiers analysés<\/div>/g, 'data-val="4" data-suffix="">4</div><div class="stat-lbl">Axes d’accompagnement</div>')
    .replace(/data-val="93" data-suffix="%">93%<\/div>\s*<div class="stat-lbl">(?:Retours satisfaits|Satisfaction clients)<\/div>/g, 'data-val="7" data-suffix="">7</div><div class="stat-lbl">Modules pratiques</div>')
    .replace(/data-val="4" data-suffix="">4<\/div>\s*<div class="stat-lbl">(?:Missions publiques|Collectivités accompagnées)<\/div>/g, 'data-val="1" data-suffix="">1</div><div class="stat-lbl">Cadre déontologique strict</div>')
    .replace(/data-val="7" data-suffix="">7<\/div>\s*<div class="stat-lbl">(?:Sessions terrain|Formations dispensées)<\/div>/g, 'data-val="3" data-suffix="">3</div><div class="stat-lbl">Engagements clés</div>')
    .replace(/data-val="0" data-suffix="">0<\/div>\s*<div class="stat-lbl">Promesse d’attribution<\/div>/g, 'data-val="3" data-suffix="">3</div><div class="stat-lbl">Engagements clés</div>')
    .replace(/>52\+<\/div>\s*<div class="stat-lbl">Dossiers analysés<\/div>/g, '>4</div><div class="stat-lbl">Axes d’accompagnement</div>')
    .replace(/>93%<\/div>\s*<div class="stat-lbl">(?:Retours satisfaits|Satisfaction clients)<\/div>/g, '>7</div><div class="stat-lbl">Modules pratiques</div>')
    .replace(/>0<\/div>\s*<div class="stat-lbl">Promesse d’attribution<\/div>/g, '>3</div><div class="stat-lbl">Engagements clés</div>');
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
  var box = '<div class="pi-cookie-box" id="pi-cookie-box" role="dialog" aria-live="polite" aria-label="Préférences cookies"><p>Cookies nécessaires au fonctionnement du site. Vous pouvez refuser ou accepter les cookies de mesure d’audience si ceux-ci sont activés ultérieurement.</p><div class="pi-cookie-actions"><button type="button" data-pi-cookie="reject">Tout refuser</button><a href="/politique-cookies#preferences">Gérer mes préférences</a><button type="button" class="pi-cookie-primary" data-pi-cookie="accept">Tout accepter</button></div></div><script id="pi-cookie-script">(function(){try{var key="pi_cookie_consent_v1";var box=document.getElementById("pi-cookie-box");if(!box)return;var saved=localStorage.getItem(key);if(!saved){box.setAttribute("data-visible","true");}box.addEventListener("click",function(e){var action=e.target&&e.target.getAttribute("data-pi-cookie");if(!action)return;localStorage.setItem(key,JSON.stringify({choice:action,date:new Date().toISOString()}));box.removeAttribute("data-visible");});window.piResetCookieConsent=function(){localStorage.removeItem(key);box.setAttribute("data-visible","true");};}catch(e){}})();</script>';
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
