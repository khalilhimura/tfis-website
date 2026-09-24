/* Shared record and Jev rules. No network or UI side effects. */
window.SovmemCore = (() => {
  const types = ['claim', 'decision', 'correction'];
  const reviews = ['unreviewed', 'reviewed', 'needs-revision'];
  const fields = ['type', 'title', 'body', 'provenance', 'stop_rule', 'review_status'];
  const bounded = (n, max = 1) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max;
  function recordData(data) {
    if (!data || !types.includes(data.type) || !reviews.includes(data.review_status)) throw new Error('Invalid record type or review status.');
    const result = {};
    for (const field of fields) {
      if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`${field.replaceAll('_', ' ')} is required.`);
      result[field] = data[field].trim();
    }
    return result;
  }
  function storedRecord(record) {
    const data = recordData(record);
    if (typeof record.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(record.id)) throw new Error('Invalid record ID.');
    for (const field of ['created_at', 'updated_at']) {
      if (typeof record[field] !== 'string' || !Number.isFinite(Date.parse(record[field]))) throw new Error('Invalid record timestamp.');
    }
    const revisions = record.revisions ?? [];
    if (!Array.isArray(revisions) || revisions.some(r => !r || typeof r.reason !== 'string' || !Number.isFinite(Date.parse(r.timestamp)) || !Array.isArray(r.fields) || r.fields.some(f => !fields.includes(f)))) throw new Error('Invalid revision history.');
    return { ...record, ...data, revisions };
  }
  function payload(record) {
    const stop = record.stop_rule?.trim();
    return { title: record.title, body: record.body, declared_type: record.type, stop_rule: stop && stop.toLowerCase() !== 'none' ? stop : null, provenance: record.provenance || null };
  }
  function issues(evaluation, record) {
    if (!evaluation || evaluation.error) return ['Evaluation unavailable. Review this record before relying on it.'];
    const answers = evaluation.response?.answers;
    const concerns = [];
    const definitions = {
      record_type: ['choice', [...types, 'noise']],
      has_stop_rule: ['noul'],
      provenance_strength: ['score'],
      review_status: ['choice', ['ok', 'needs_revision', 'escalate']],
      load_risk: ['score']
    };
    for (const [id, [type, choices]] of Object.entries(definitions)) {
      const a = answers?.[id];
      const valid = a?.type === type && (type === 'noul' ? bounded(a.noul) : bounded(a.confidence) && (type === 'score' ? bounded(a.score, 2) : choices.includes(a.choice)));
      if (!valid) { concerns.push(`Missing or invalid ${id.replaceAll('_', ' ')} answer.`); continue; }
      if (type !== 'noul' && a.confidence < .75) concerns.push(`Low confidence for ${id.replaceAll('_', ' ')} (${Math.round(a.confidence * 100)}%).`);
      if (id === 'record_type' && (a.choice === 'noise' || a.choice !== record.type)) concerns.push(`Suggested record type: ${a.choice}; selected type: ${record.type}.`);
      if (id === 'has_stop_rule' && record.type === 'decision' && a.noul < .75) concerns.push(a.noul < .5 ? 'Decision is missing a clear stop rule.' : 'Decision stop rule is uncertain.');
      if (id === 'provenance_strength' && a.score < .5) concerns.push('Weak provenance: add a verifiable source.');
      if (id === 'review_status' && a.choice !== 'ok') concerns.push(a.choice === 'escalate' ? 'Jev recommends escalation to a person or system.' : 'Jev recommends revision.');
      if (id === 'load_risk' && a.score >= 1.5) concerns.push('High cognitive load risk.');
    }
    return concerns;
  }
  return { types, reviews, fields, bounded, recordData, storedRecord, payload, issues };
})();
