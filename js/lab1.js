/*
 * Lab 1 - Prototype Pollution (CWE-1321)
 *
 * The two merge functions below are the real logic of the lab.
 * mergeVulnerable = the bug, mergeFixed = the fix.
 * The code shown on the page is a copy of these functions.
 */

// ---- VULNERABLE version ----
function mergeVulnerable(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = mergeVulnerable(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ---- FIXED version ----
function mergeFixed(target, source) {
  for (const key in source) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = mergeFixed(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Runs one request against the "settings page" simulation.
function runLab1(payload, mode) {
  const merge = mode === 'fixed' ? mergeFixed : mergeVulnerable;
  const mySettings = { theme: 'light' };

  let data;
  try {
    data = JSON.parse(payload.value);
  } catch (e) {
    return { status: 'neutral', title: 'Invalid JSON', lines: [String(e.message)] };
  }

  let polluted = false;
  try {
    merge(mySettings, data);
    // A brand-new visitor object that never touched the settings page.
    const newVisitor = {};
    polluted = newVisitor.isAdmin === true;
  } finally {
    // Safety: always clean up so the demo never stays polluted.
    delete Object.prototype.isAdmin;
  }

  const lines = [
    'Request body : ' + payload.value,
    'My settings  : ' + JSON.stringify(mySettings),
    'New visitor  : {}   ->   newVisitor.isAdmin = ' + (polluted ? 'true' : 'undefined'),
  ];

  if (polluted) {
    lines.push('', 'Every object in the app now has isAdmin = true.');
    return { status: 'bad', title: 'ATTACK WORKED - an ordinary visitor became admin', lines };
  }
  if (payload.attack) {
    lines.push('', 'The dangerous key was skipped. Nothing was polluted.');
    return { status: 'good', title: 'BLOCKED - the attack did nothing', lines };
  }
  lines.push('', 'Normal request. Only my own settings changed.');
  return { status: 'neutral', title: 'Normal request - works as expected', lines };
}

if (typeof document !== 'undefined') {
  LabUI.init({
    vulnerable: {
      code: [
        'function mergeSettings(target, source) {',
        '  for (const key in source) {',
        "    if (typeof source[key] === 'object' && source[key] !== null) {",
        '      target[key] = mergeSettings(target[key] || {}, source[key]);',
        '    } else {',
        '      target[key] = source[key];',
        '    }',
        '  }',
        '  return target;',
        '}',
        '',
        "// the user's settings arrive as JSON",
        'mergeSettings(mySettings, JSON.parse(request.body));',
      ],
      hot: 3,
      why: 'The function follows every key it is given, including the special key "__proto__". That key points to the shared parent of ALL objects, so the attacker ends up writing into every object in the app.',
    },
    fixed: {
      code: [
        'function mergeSettings(target, source) {',
        '  for (const key in source) {',
        "    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;",
        "    if (typeof source[key] === 'object' && source[key] !== null) {",
        '      target[key] = mergeSettings(target[key] || {}, source[key]);',
        '    } else {',
        '      target[key] = source[key];',
        '    }',
        '  }',
        '  return target;',
        '}',
        '',
        "// the user's settings arrive as JSON",
        'mergeSettings(mySettings, JSON.parse(request.body));',
      ],
      hot: 2,
      why: 'One extra line skips the three dangerous keys, so the attacker can never reach the shared parent object. Every other setting still merges normally.',
    },
    payloads: [
      { label: 'Change my theme', value: '{"theme":"dark"}', hint: 'A normal request. Works in both versions.', attack: false },
      { label: 'Attack: __proto__', value: '{"__proto__":{"isAdmin":true}}', hint: 'Tries to add isAdmin to every object.', attack: true },
      { label: 'Attack: constructor', value: '{"constructor":{"prototype":{"isAdmin":true}}}', hint: 'Same goal, different path. Fixes must block this one too.', attack: true },
    ],
    run: runLab1,
  });
}

if (typeof module !== 'undefined') module.exports = { runLab1, mergeVulnerable, mergeFixed };
