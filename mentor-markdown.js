/**
 * Markdown léger pour les réponses coach (sans dépendance externe).
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return s;
}

/**
 * @param {string[]} lines lignes non vides (sans titres markdown)
 * @returns {string[]}
 */
function renderLineBlock(lines) {
  if (!lines.length) return [];

  const trimmed = lines.map((l) => l.trim()).filter(Boolean);
  if (!trimmed.length) return [];

  const first = trimmed[0];

  if (/^[-*]\s+/.test(first) && trimmed.every((l) => /^[-*]\s+/.test(l))) {
    const items = trimmed
      .map((l) => `<li>${inlineFormat(l.replace(/^[-*]\s+/, ''))}</li>`)
      .join('');
    return [`<ul class="mentor-md__ul">${items}</ul>`];
  }

  if (/^\d+\.\s+/.test(first) && trimmed.every((l) => /^\d+\.\s+/.test(l))) {
    const items = trimmed
      .map((l) => `<li>${inlineFormat(l.replace(/^\d+\.\s+/, ''))}</li>`)
      .join('');
    return [`<ol class="mentor-md__ol">${items}</ol>`];
  }

  const para = trimmed.map((l) => inlineFormat(l)).join('<br />');
  return [`<p class="mentor-md__p">${para}</p>`];
}

/**
 * @param {string} block
 * @returns {string[]}
 */
function renderBlock(block) {
  const lines = block.split('\n').map((l) => l.trimEnd());
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]?.trim() ?? '';
    if (!line) {
      i += 1;
      continue;
    }

    const mdHeading = line.match(/^(#{1,4})\s+(.+)$/);
    if (mdHeading) {
      const level = Math.min(4, mdHeading[1].length);
      out.push(
        `<h${level} class="mentor-md__h">${inlineFormat(mdHeading[2])}</h${level}>`,
      );
      i += 1;
      const body = [];
      while (i < lines.length) {
        const next = lines[i]?.trim() ?? '';
        if (!next) {
          i += 1;
          continue;
        }
        if (/^(#{1,4})\s+/.test(next) || /^\d+\)\s+/.test(next)) break;
        body.push(next);
        i += 1;
      }
      out.push(...renderLineBlock(body));
      continue;
    }

    const numberedHeading = line.match(/^(\d+)\)\s+(.+)$/);
    if (numberedHeading) {
      out.push(
        `<h3 class="mentor-md__h">${inlineFormat(numberedHeading[2])}</h3>`,
      );
      i += 1;
      const body = [];
      while (i < lines.length) {
        const next = lines[i]?.trim() ?? '';
        if (!next) {
          i += 1;
          continue;
        }
        if (/^(#{1,4})\s+/.test(next) || /^\d+\)\s+/.test(next)) break;
        body.push(next);
        i += 1;
      }
      out.push(...renderLineBlock(body));
      continue;
    }

    if (/^---+$/.test(line)) {
      out.push('<hr class="mentor-md__hr" />');
      i += 1;
      continue;
    }

    const chunk = [];
    while (i < lines.length) {
      const next = lines[i]?.trim() ?? '';
      if (!next) {
        i += 1;
        continue;
      }
      if (/^(#{1,4})\s+/.test(next) || /^\d+\)\s+/.test(next) || /^---+$/.test(next)) {
        break;
      }
      chunk.push(next);
      i += 1;
    }
    out.push(...renderLineBlock(chunk));
  }

  return out;
}

/**
 * @param {string} markdown
 * @returns {string} HTML sûr (sous-ensemble markdown)
 */
export function renderMentorMarkdown(markdown) {
  const raw = (markdown || '').trim();
  if (!raw) return '<p class="mentor-md__p">—</p>';

  const blocks = raw.split(/\n{2,}/);
  const out = [];

  for (const block of blocks) {
    out.push(...renderBlock(block));
  }

  return out.length ? out.join('\n') : '<p class="mentor-md__p">—</p>';
}

/**
 * Réponse coach sans paragraphe substantiel (titres seuls).
 * @param {string} text
 */
export function isHollowMentorAdvice(text) {
  const raw = (text || '').trim();
  if (raw.length < 40) return true;

  const withoutTitles = raw
    .replace(/^#{1,4}\s+.+$/gm, '')
    .replace(/^\d+\)\s+.+$/gm, '')
    .trim();

  const bodyLines = withoutTitles.split('\n').map((l) => l.trim()).filter(Boolean);
  const substantive = bodyLines.filter(
    (l) => l.length >= 45 || (l.length >= 20 && /[.!?;:)]/.test(l)),
  );

  return substantive.length === 0;
}
