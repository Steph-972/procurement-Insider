const baseRenderer = require('./render-page-v2.js');

function refineServicesPage(html, file) {
  if (file !== 'services.html' || typeof html !== 'string' || !html.includes('<html')) return html;

  const css = `
<style id="services-spacing-alignment-fix">
/* Page Services — correction rythme, respiration et alignement */
.page-hero > .container + div {
  margin-top: clamp(1.75rem, 3vw, 2.6rem) !important;
}
.page-hero .hero-tabs {
  margin-bottom: 0 !important;
}
.container:has(> .agency-service-links) {
  padding-bottom: clamp(1rem, 2vw, 1.75rem) !important;
}
.container:has(> .agency-service-links) .agency-title {
  margin-bottom: 0.5rem !important;
}
.container:has(> .agency-service-links) .agency-service-links {
  margin-top: 1.35rem !important;
}
.services-section {
  padding-top: clamp(2rem, 3.5vw, 3rem) !important;
}
.services-grid {
  align-items: stretch !important;
}
.service-col {
  display: flex !important;
  flex-direction: column !important;
}
.service-list {
  flex: 1 1 auto !important;
}
.service-offer {
  margin-top: auto !important;
  min-height: 205px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
}
.service-offer .btn-offer {
  margin-top: auto !important;
  width: fit-content !important;
}
@media (max-width: 768px) {
  .page-hero > .container + div {
    margin-top: 1.35rem !important;
  }
  .container:has(> .agency-service-links) {
    padding-bottom: 1rem !important;
  }
  .services-section {
    padding-top: 1.6rem !important;
  }
  .service-offer {
    min-height: 0 !important;
  }
}
</style>`;

  html = html
    .replace(/<div class="container" style="padding-bottom:clamp\(3rem,5vw,5rem\)">/g,
      '<div class="container service-quick-entry" style="padding-bottom:clamp(1rem,2vw,1.75rem)">')
    .replace(/<section class="services-section">/g,
      '<section class="services-section services-section-tight">');

  return html.includes('services-spacing-alignment-fix')
    ? html
    : html.replace('</head>', `${css}\n</head>`);
}

module.exports = async function handler(req, res) {
  const chunks = [];
  const originalWrite = res.write ? res.write.bind(res) : null;
  const originalEnd = res.end.bind(res);

  if (originalWrite) {
    res.write = function patchedWrite(chunk, encoding, callback) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding || 'utf8'));
      if (typeof callback === 'function') callback();
      return true;
    };
  }

  res.end = function patchedEnd(chunk, encoding, callback) {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding || 'utf8'));
    const body = Buffer.concat(chunks).toString('utf8');
    const file = req.query && req.query.file;
    const contentType = String(res.getHeader('Content-Type') || res.getHeader('content-type') || '');
    const output = contentType.includes('text/html') || body.trim().startsWith('<!DOCTYPE html') || body.trim().startsWith('<html')
      ? refineServicesPage(body, file)
      : body;
    return originalEnd(output, 'utf8', callback);
  };

  return baseRenderer(req, res);
};
