const baseHandler = require('./render-page-postprocess');

function fixEnterprisePackCtas(html) {
  return String(html || '')
    .replace(/onclick=\"if\(window\.setFormMode\)setFormMode\('diagnostic'\);return false;\"/g, 'onclick="if(window.setFormMode){setFormMode(\'diagnostic\');}"')
    .replace(/href=\"#contact\"/g, 'href="/#contact"')
    .replace(/href=\"\/\#contact\" onclick=\"if\(window\.setFormMode\)setFormMode\('diagnostic'\);return false;\"/g, 'href="/#contact" onclick="if(window.setFormMode){setFormMode(\'diagnostic\');}"');
}

function hardenEnterpriseWording(html) {
  return String(html || '')
    .replace(/lisible, notée, défendable/gi, 'lisible, cohérente, défendable')
    .replace(/mieux noté — même à compétence égale/gi, 'plus facile à analyser — même à compétence égale')
    .replace(/systématiquement mieux noté/gi, 'généralement plus facile à analyser')
    .replace(/Amélioration de la notation potentielle/gi, 'Amélioration de la lisibilité au regard des critères')
    .replace(/mémoire technique structuré et optimisé/gi, 'mémoire technique structuré et clarifié')
    .replace(/optimisation de chaque critère/gi, 'traitement méthodique de chaque critère')
    .replace(/méthode claire, vérifiable et notée/gi, 'méthode claire, vérifiable et alignée sur les critères')
    .replace(/Un acheteur ne note pas une intention\. Il note un dossier\./gi, 'Un acheteur n’évalue pas une intention abstraite. Il évalue un dossier, des preuves et une méthode.')
    .replace(/Une offre techniquement excellente, mal structurée, perdra toujours face à une offre ordinaire, bien présentée\./gi, 'Une offre techniquement solide peut être pénalisée si elle est mal structurée ou difficile à lire.')
    .replace(/Garantissez-vous que je vais remporter le marché \?/gi, 'Garantissez-vous que je vais obtenir le marché ?')
    .replace(/<button class="faq-mini-q" onclick="toggleFaqMini\(this\)">Garantissez-vous que je vais obtenir le marché \?<span class="faq-mini-icon">\+<\/span><\/button>\s*<div class="faq-mini-a"><p>[\s\S]*?<\/p><\/div>/i, '<button class="faq-mini-q" onclick="toggleFaqMini(this)">Garantissez-vous que je vais obtenir le marché ?<span class="faq-mini-icon">+</span></button><div class="faq-mini-a"><p>Non. L’attribution appartient exclusivement à l’acheteur public. Mon intervention repose sur une obligation de moyens : structurer, clarifier, renforcer la cohérence du dossier et signaler les points de vigilance. Aucun résultat d’attribution, note, classement ou sélection ne peut être garanti.</p></div>')
    .replace(/Ce que je garantis, c'est un dossier structuré, valorisé, conforme aux attentes de l'acheteur\. Mes clients remportent significativement plus de marchés qu'avant notre travail ensemble\. Mais aucun résultat ne peut être contractuellement garanti\./gi, 'Non. L’attribution appartient exclusivement à l’acheteur public. Mon intervention repose sur une obligation de moyens : structurer, clarifier, renforcer la cohérence du dossier et signaler les points de vigilance. Aucun résultat d’attribution, note, classement ou sélection ne peut être garanti.')
    .replace(/mes clients remportent significativement plus de marchés qu'avant notre travail ensemble/gi, 'les dossiers accompagnés gagnent en lisibilité, cohérence et qualité de présentation')
    .replace(/remporter le marché/gi, 'obtenir le marché')
    .replace(/dossier complet et vérifié/gi, 'dossier complet et relu')
    .replace(/Détrompez-vous\. Les MAPA sous seuils sont accessibles — et très rentables\./gi, 'Les marchés à procédure adaptée peuvent être accessibles aux petites structures lorsqu’elles répondent aux exigences du dossier et valorisent correctement leurs moyens.');
}

module.exports = async function handler(req, res) {
  const originalEnd = res.end.bind(res);

  res.end = function patchedEnd(chunk, encoding, callback) {
    try {
      const contentType = typeof res.getHeader === 'function' ? String(res.getHeader('Content-Type') || '') : '';
      const body = Buffer.isBuffer(chunk) ? chunk.toString(encoding || 'utf8') : String(chunk || '');
      if (res.statusCode === 200 && contentType.includes('text/html') && body.includes('<html')) {
        return originalEnd(hardenEnterpriseWording(fixEnterprisePackCtas(body)), encoding, callback);
      }
      return originalEnd(chunk, encoding, callback);
    } catch (error) {
      return originalEnd(chunk, encoding, callback);
    }
  };

  return baseHandler(req, res);
};