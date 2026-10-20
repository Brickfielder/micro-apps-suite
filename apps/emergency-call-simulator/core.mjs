export const SERVICES = ['ambulance', 'police', 'fire', 'coastguard'];
const transitions = {
  ready: ['home', 'safety'], home: ['dialler', 'error', 'ended', 'safety'], dialler: ['home', 'connecting', 'ended', 'safety'],
  connecting: ['selecting', 'questioning', 'error', 'ended', 'safety'],
  selecting: ['transferring', 'error', 'ended', 'safety'],
  transferring: ['questioning', 'error', 'ended', 'safety'],
  questioning: ['transferring', 'concluding', 'error', 'ended', 'safety'],
  concluding: ['ended', 'error', 'safety'], error: ['connecting', 'ended', 'safety'],
  ended: ['ready', 'safety'], safety: ['ready'],
};
export function transition(session, next) {
  if (!transitions[session.phase]?.includes(next)) throw new Error(`Invalid transition: ${session.phase} → ${next}`);
  session.phase = next;
}
export function newSession(scenario, settings, now = performance.now()) {
  return {
    phase: 'ready', scenarioId: scenario.id, settings: {...settings}, presentedAt: now,
    startedAt: null, endedAt: null, dialAttempts: [], serviceChoices: [], details: {},
    transcript: [], latencies: [], prompts: [], clarifications: [], changes: [],
    completed: false, completionObserved: false, reason: '', pausedMs: 0, overrides: {},
    ratings: {communication: 'Not assessed', comprehension: 'Not assessed'},
  };
}
export function dial(session, number, now = performance.now()) {
  session.dialAttempts.push({number, at: now});
  if (session.phase !== 'dialler' || number !== '999') return false;
  session.startedAt = now;
  transition(session, 'connecting');
  return true;
}
export function criteriaFor(scenario, difficulty) {
  return scenario.criteria.filter(c => difficulty !== 'easy' || c.easy);
}
const normalise = text => String(text).toLowerCase().replace(/[^a-z0-9]/g, '');
export function recordDetails(session, scenario, observations) {
  const allowed = new Set(scenario.criteria.map(c => c.id));
  const evidenceText = normalise(session.transcript.filter(t => t.role === 'caller').map(t => t.text).join(' '));
  let accepted = 0;
  for (const item of observations || []) {
    if (!allowed.has(item.id) || !['provided', 'partial', 'unknown'].includes(item.status)) continue;
    if (typeof item.evidence !== 'string' || item.evidence.length < 2 || item.evidence.length > 500) continue;
    if (!evidenceText.includes(normalise(item.evidence))) continue;
    session.details[item.id] = {status: item.status, evidence: item.evidence, source: 'AI provisional'};
    accepted++;
  }
  return accepted;
}
export function completionReady(session, scenario) {
  return session.serviceChoices.at(-1) === scenario.service &&
    criteriaFor(scenario, session.settings.difficulty).every(c => session.details[c.id]?.status === 'provided');
}
export function summary(session, scenario) {
  const required = criteriaFor(scenario, session.settings.difficulty);
  const details = required.map(c => ({...c, ...session.details[c.id],
    status: session.overrides[c.id] || session.details[c.id]?.status || 'not_observed',
    source: session.overrides[c.id] ? 'Clinician override' : 'AI provisional'}));
  return {
    schemaVersion: 1, scenarioId: scenario.id, scenario: scenario.name, settings: session.settings,
    reason: session.reason, completed: session.completed,
    dialling: {attempts: session.dialAttempts, firstAttemptCorrect: session.dialAttempts[0]?.number === '999'},
    initiationSeconds: session.startedAt === null ? null : (session.startedAt - session.presentedAt) / 1000,
    durationSeconds: session.startedAt === null ? 0 : Math.max(0, ((session.endedAt ?? performance.now()) - session.startedAt - session.pausedMs) / 1000),
    serviceChoices: session.serviceChoices, correctService: session.serviceChoices.at(-1) === scenario.service,
    details, completeness: {provided: details.filter(d => d.status === 'provided').length, total: details.length},
    responseLatencies: session.latencies, clarifications: session.clarifications, assistance: session.prompts,
    ratings: session.ratings, changes: session.changes,
    measurementNote: 'Descriptive practice observations, not a validated neuropsychological score. AI observations require clinician review. Latency uses browser receipt times of actual audio events; it is an estimate, not a speech-ability rating.',
    instructionComprehensionNote: 'First-aid comprehension is not assessed: no clinician-approved first-aid protocol is enabled.',
  };
}
