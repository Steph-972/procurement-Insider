const baseHandler = require('./render-page-postprocess');

function complianceHubBlock() {
  return `<!-- CONFORMITÉ — HUB JURIDIQUE -->
<section id="legal" class="pi-compliance-hub" style="background:#F8F5EF;padding:clamp(3.5rem,6vw,5.5rem) 0;">
  <div class="container">
    <div style="text-align:center;max-width:760px;margin:0 auto 2.5rem;">
      <span class="label" style="color:var(--gold);display:block;margin-bottom:.7rem;">Conformité</span>
      <span class="accent-line accent-line-center"></span>
      <h2 class="h1" style="margin-bottom:1rem;">Un cadre juridique clair pour chaque mission.</h2>
      <p style="color:var(--gray);font-size:.98rem;line-height:1.75;margin:0 auto;max-width:650px;">
        Procurement Insider intervient dans un cadre strict : obligation de moyens, confidentialité,
        prévention des conflits d’intérêts et absence de garantie d’attribution d’un marché public.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;max-width:980px;margin:0 auto;">
      <a href="/mentions-legales" style="display:block;background:#fff;border:1px solid rgba(15,35,66,.10);border-radius:14px;padding:1.35rem 1.45rem;text-decoration:none;color:inherit;box-shadow:0 18px 45px rgba(15,35,66,.06);">
        <span style="font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;">Informations légales</span>
        <h3 style="font-family:var(--serif);font-size:1.18rem;color:var(--navy);margin:.55rem 0 .45rem;">Mentions légales</h3>
        <p style="font-size:.86rem;color:var(--gray);line-height:1.6;margin:0;">Éditeur, hébergeur, responsabilité, propriété intellectuelle et informations de contact.</p>
      </a>

      <a href="/conditions-generales-prestations-services" style="display:block;background:#fff;border:1px solid rgba(15,35,66,.10);border-radius:14px;padding:1.35rem 1.45rem;text-decoration:none;color:inherit;box-shadow:0 18px 45px rgba(15,35,66,.06);">
        <span style="font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;">Prestations</span>
        <h3 style="font-family:var(--serif);font-size:1.18rem;color:var(--navy);margin:.55rem 0 .45rem;">CGPS</h3>
        <p style="font-size:.86rem;color:var(--gray);line-height:1.6;margin:0;">Conditions applicables aux devis, missions, livrables, paiements, confidentialité et responsabilités.</p>
      </a>

      <a href="/politique-confidentialite" style="display:block;background:#fff;border:1px solid rgba(15,35,66,.10);border-radius:14px;padding:1.35rem 1.45rem;text-decoration:none;color:inherit;box-shadow:0 18px 45px rgba(15,35,66,.06);">
        <span style="font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;">RGPD</span>
        <h3 style="font-family:var(--serif);font-size:1.18rem;color:var(--navy);margin:.55rem 0 .45rem;">Confidentialité</h3>
        <p style="font-size:.86rem;color:var(--gray);line-height:1.6;margin:0;">Données collectées, finalités, durées de conservation, droits RGPD et gestion des cookies.</p>
      </a>

      <a href="/deontologie" style="display:block;background:#0F2342;border:1px solid rgba(201,168,76,.35);border-radius:14px;padding:1.35rem 1.45rem;text-decoration:none;color:#fff;box-shadow:0 18px 45px rgba(15,35,66,.12);">
        <span style="font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#C9A84C;font-weight:700;">Éthique</span>
        <h3 style="font-family:var(--serif);font-size:1.18rem;color:#fff;margin:.55rem 0 .45rem;">Déontologie</h3>
        <p style="font-size:.86rem;color:rgba(255,255,255,.68);line-height:1.6;margin:0;">Prévention des conflits d’intérêts, impartialité, confidentialité et limites d’intervention.</p>
      </a>
    </div>

    <p style="text-align:center;color:var(--gray);font-size:.78rem;line-height:1.65;margin:1.4rem auto 0;max-width:760px;font-family:var(--mono);">
      Les informations juridiques sont progressivement consolidées. Les mentions légales sont publiées ; les autres pages dédiées sont en cours de finalisation.
    </p>
  </div>
</section>

`;
}

function replaceInlineLegalBlock(html) {
  let output = String(html || '');

  // Supprime l’ancien accordéon juridique inline de la page d’accueil, devenu contradictoire
  // avec les pages légales dédiées, puis le remplace par un hub de conformité sobre.
  output = output.replace(
    /<!-- MENTIONS LÉGALES & RGPD -->[\s\S]*?<!-- FAQ CTA BAND -->/,
    complianceHubBlock() + '<!-- FAQ CTA BAND -->'
  );

  // Variante de sécurité si l’encodage ou les commentaires évoluent dans le post-traitement.
  output = output.replace(
    /<section id="legal">[\s\S]*?<\/section>\s*\n\s*<section id="faq"/,
    complianceHubBlock() + '<section id="faq"'
  );

  return output;
}

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

  output = replaceInlineLegalBlock(output);

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
