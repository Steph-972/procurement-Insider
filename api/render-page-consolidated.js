// Renderer consolidé — étape 1
//
// Objectif : disposer d'un point d'entrée stable et testable pour remplacer
// progressivement render-page-postprocess, sans modifier la production tant que
// tous les contrôles page par page ne sont pas validés.
//
// À ce stade, on réutilise volontairement la couche post-traitée déjà validée
// en production. Les traitements seront ensuite déplacés un par un dans des
// normalizers dédiés, avec tests comparatifs après chaque déplacement.

module.exports = require('./render-page-postprocess');
