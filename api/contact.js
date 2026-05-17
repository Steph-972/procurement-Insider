function sanitize(value) {
  return String(value || '').trim();
}

function escapeHtml(value) {
  return sanitize(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizePhoneForWhatsapp(value) {
  const digits = sanitize(value).replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  return digits;
}

async function brevoRequest(path, payload, headers) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  let body = null;
  try { body = await response.json(); } catch (_) {}

  if (!response.ok) {
    const message = body?.message || body?.error || `Brevo HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return body;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BREVO_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_KEY) {
    console.error('Contact API configuration error: BREVO_API_KEY missing');
    return res.status(500).json({
      error: 'Configuration email manquante',
      publicMessage: 'Le formulaire est temporairement indisponible. Merci d’écrire directement à loeildelacheteur@gmail.com ou par WhatsApp.'
    });
  }

  const prenom = sanitize(req.body?.prenom);
  const nom = sanitize(req.body?.nom);
  const email = sanitize(req.body?.email).toLowerCase();
  const telephone = sanitize(req.body?.telephone);
  const organisation = sanitize(req.body?.organisation);
  const profil = sanitize(req.body?.profil || 'non renseigné');
  const sujet = sanitize(req.body?.sujet);
  const message = sanitize(req.body?.message);

  if (!prenom || !nom || !email || !sujet || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide' });
  }

  const safe = {
    prenom: escapeHtml(prenom),
    nom: escapeHtml(nom),
    email: escapeHtml(email),
    telephone: escapeHtml(telephone),
    organisation: escapeHtml(organisation),
    profil: escapeHtml(profil),
    sujet: escapeHtml(sujet),
    messageHtml: escapeHtml(message).replace(/\n/g, '<br>')
  };

  const whatsappPhone = normalizePhoneForWhatsapp(telephone);

  const headers = {
    'api-key': BREVO_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    const contactAttributes = {
      PRENOM: prenom,
      NOM: nom,
      COMPANY: organisation || '',
      PROFIL_LEAD: profil || 'non renseigné',
      SOURCE: 'formulaire-contact-site'
    };

    // Brevo peut refuser certains formats SMS selon la configuration du compte.
    // On évite donc de bloquer l’envoi email si le numéro n’est pas strictement compatible.
    if (telephone) contactAttributes.TELEPHONE = telephone;

    try {
      await brevoRequest('/contacts', {
        email,
        attributes: contactAttributes,
        listIds: [2],
        updateEnabled: true
      }, headers);
    } catch (contactError) {
      console.warn('Brevo contact upsert failed, continuing email send:', contactError.message);
    }

    await brevoRequest('/smtp/email', {
      sender: { name: 'Procurement Insider — Site Web', email: 'loeildelacheteur@gmail.com' },
      to: [{ email: 'loeildelacheteur@gmail.com', name: 'Stéphane Loudoux' }],
      replyTo: { email, name: `${prenom} ${nom}` },
      subject: `📬 Nouveau message — ${sujet} (${prenom} ${nom})`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2342;padding:1.5rem 2rem">
          <div style="color:#C9A84C;font-size:1.2rem;font-weight:900;letter-spacing:1px">PROCUREMENT INSIDER</div>
          <div style="color:rgba(255,255,255,0.7);font-size:0.75rem;letter-spacing:3px;margin-top:2px">NOUVEAU MESSAGE SITE WEB</div>
        </div>
        <div style="background:white;padding:2rem">
          <h2 style="color:#0F2342;margin-bottom:1.5rem">Nouveau message reçu</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem;width:140px">De</td><td style="padding:.6rem 0;font-weight:600;color:#0F2342">${safe.prenom} ${safe.nom}</td></tr>
            <tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem">Email</td><td style="padding:.6rem 0"><a href="mailto:${safe.email}" style="color:#1A3A6B">${safe.email}</a></td></tr>
            ${telephone ? `<tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem">Téléphone</td><td style="padding:.6rem 0"><a href="tel:${safe.telephone}" style="color:#1A3A6B">${safe.telephone}</a></td></tr>` : ''}
            ${organisation ? `<tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem">Organisation</td><td style="padding:.6rem 0">${safe.organisation}</td></tr>` : ''}
            <tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem">Profil</td><td style="padding:.6rem 0">${safe.profil}</td></tr>
            <tr style="border-bottom:1px solid #E8EBF0"><td style="padding:.6rem 0;color:#6B7080;font-size:.85rem">Objet</td><td style="padding:.6rem 0;font-weight:600;color:#C9A84C">${safe.sujet}</td></tr>
          </table>
          <div style="margin-top:1.5rem;background:#F8F5EF;border-left:3px solid #C9A84C;padding:1rem 1.25rem">
            <p style="color:#0F2342;line-height:1.7;margin:0">${safe.messageHtml}</p>
          </div>
          <div style="margin-top:1.5rem">
            <a href="mailto:${safe.email}?subject=RE: ${encodeURIComponent(sujet)}" style="background:#0F2342;color:white;padding:.75rem 1.5rem;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block">Répondre à ${safe.prenom}</a>
            ${whatsappPhone ? `<a href="https://wa.me/${whatsappPhone}" style="background:#25D366;color:white;padding:.75rem 1.5rem;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block;margin-left:.5rem">WhatsApp</a>` : ''}
          </div>
        </div>
        <div style="background:#0F2342;padding:1rem 2rem;text-align:center">
          <p style="color:rgba(255,255,255,0.5);font-size:.75rem;margin:0">Procurement Insider · loeildelacheteur@gmail.com · +596 696 266 231</p>
        </div>
      </div>`
    }, headers);

    await brevoRequest('/smtp/email', {
      sender: { name: 'Stéphane Loudoux — Procurement Insider', email: 'loeildelacheteur@gmail.com' },
      to: [{ email, name: `${prenom} ${nom}` }],
      subject: 'Votre message a bien été reçu — Procurement Insider',
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#F8F5EF;padding:0">
        <div style="background:#0F2342;padding:1.7rem 2rem;border-bottom:4px solid #C9A84C">
          <div style="color:#FFFFFF;font-size:1.15rem;font-weight:900;letter-spacing:1.2px">PROCUREMENT INSIDER</div>
          <div style="color:#C9A84C;font-size:0.72rem;letter-spacing:3px;margin-top:4px;text-transform:uppercase">L'ŒIL DE L'ACHETEUR</div>
        </div>
        <div style="background:white;padding:2.1rem 2rem">
          <p style="color:#C9A84C;font-size:.75rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 .7rem">Message bien reçu</p>
          <h2 style="color:#0F2342;margin:0 0 1rem;font-size:1.45rem;line-height:1.3">Bonjour ${safe.prenom},</h2>
          <p style="color:#333;line-height:1.75;margin:0 0 1.15rem">Merci pour votre message. Je l’ai bien reçu et je vais en prendre connaissance personnellement afin d’identifier les premiers points d’attention : nature du besoin, niveau d’urgence, procédure concernée, documents disponibles et éventuels risques à sécuriser.</p>
          <p style="color:#333;line-height:1.75;margin:0 0 1.15rem">Je reviens généralement vers vous <strong style="color:#0F2342">sous 48h ouvrées</strong> avec une première lecture de votre situation.</p>
          <div style="background:#F8F5EF;border-left:4px solid #C9A84C;padding:1rem 1.15rem;margin:1.4rem 0">
            <p style="color:#0F2342;line-height:1.65;margin:0"><strong>Échéance courte ?</strong><br>Si votre demande concerne un dépôt d’offre, une procédure en cours ou un délai rapproché, vous pouvez me contacter directement par téléphone ou WhatsApp au <strong>+596 696 266 231</strong>.</p>
          </div>
          <p style="color:#333;line-height:1.75;margin:0 0 1.15rem">Les éléments transmis sont traités de manière confidentielle. L’accompagnement proposé par Procurement Insider vise à renforcer la clarté, la cohérence et la sécurité de vos démarches en commande publique, sans promesse d’attribution ni garantie de résultat.</p>
          <div style="margin:1.5rem 0 1.2rem">
            <a href="https://wa.me/596696266231" style="background:#25D366;color:white;padding:.85rem 1.35rem;border-radius:5px;text-decoration:none;font-weight:700;display:inline-block;margin-right:.6rem">Écrire sur WhatsApp</a>
            <a href="mailto:loeildelacheteur@gmail.com" style="background:#0F2342;color:white;padding:.85rem 1.35rem;border-radius:5px;text-decoration:none;font-weight:700;display:inline-block">Envoyer un email</a>
          </div>
          <p style="color:#6B7080;font-size:.92rem;line-height:1.65;margin:1.4rem 0 0">Cordialement,<br><strong style="color:#0F2342">Stéphane Loudoux</strong><br>Procurement Insider — L’Œil de l’Acheteur<br>Conseil en marchés publics, stratégie achat et commande publique<br>Martinique & Antilles françaises<br><a href="mailto:loeildelacheteur@gmail.com" style="color:#1A3A6B">loeildelacheteur@gmail.com</a> · <a href="tel:+596696266231" style="color:#1A3A6B">+596 696 266 231</a></p>
        </div>
        <div style="background:#07172D;padding:1rem 2rem;text-align:center">
          <p style="color:rgba(255,255,255,0.55);font-size:.75rem;margin:0;line-height:1.5">Procurement Insider · Conseil, méthode et structuration des dossiers · Aucune promesse d’attribution</p>
        </div>
      </div>`
    }, headers);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Brevo email send error:', err.message, err.details || '');
    return res.status(502).json({
      error: 'Erreur envoi email',
      publicMessage: 'Le formulaire est temporairement indisponible. Merci d’écrire directement à loeildelacheteur@gmail.com ou par WhatsApp.'
    });
  }
}
