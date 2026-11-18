/*
 * Lab 2 - Open Redirect (CWE-601)
 *
 * afterLoginVulnerable / afterLoginFixed are the real logic of the lab.
 * The "browser" is a fake object, so the page never really leaves the site.
 * Domains ending in .example are reserved for demos and never point to a real site.
 */

const SITE = 'https://shop.example';

function showMessage() { /* demo stub: would show "Welcome back!" */ }

// ---- VULNERABLE version ----
function afterLoginVulnerable(search, browser) {
  const params = new URLSearchParams(search);
  const next = params.get('next') || '/account';

  // remember where the user wanted to go
  browser.location.href = next;
  showMessage('Welcome back!');
}

// ---- FIXED version ----
function afterLoginFixed(search, browser) {
  const params = new URLSearchParams(search);
  const wanted = params.get('next') || '/account';
  const target = new URL(wanted, 'https://shop.example');

  // only stay on our own site, otherwise go home
  const safe = target.origin === 'https://shop.example';
  browser.location.href = safe ? target.pathname + target.search : '/account';
  showMessage('Welcome back!');
}

// The visitor "clicks" a login link; we show where the browser would end up.
function runLab2(payload, mode) {
  const afterLogin = mode === 'fixed' ? afterLoginFixed : afterLoginVulnerable;
  const browser = { location: { href: '' } };           // fake browser
  const search = new URL(payload.value).search;         // the "?next=..." part

  afterLogin(search, browser);

  const landing = new URL(browser.location.href, SITE); // where the browser really lands
  const stayed = landing.origin === SITE;

  const lines = [
    'Link clicked  : ' + payload.value,
    'Browser goes  : ' + landing.href,
    'Site          : ' + landing.host + (stayed ? '   (our own site)' : '   (ANOTHER SITE!)'),
  ];

  if (!stayed) {
    lines.push('', 'The user logged in on the real shop, then landed on a site the attacker controls.');
    return { status: 'bad', title: 'ATTACK WORKED - user sent to another site', lines };
  }
  if (payload.attack) {
    lines.push('', 'The outside address was rejected. The user goes to a safe default page.');
    return { status: 'good', title: 'BLOCKED - user stays on our site', lines };
  }
  lines.push('', 'Normal link. The user goes where they wanted.');
  return { status: 'neutral', title: 'Normal link - works as expected', lines };
}

if (typeof document !== 'undefined') {
  LabUI.init({
    vulnerable: {
      code: [
        '// Runs right after the user logs in successfully',
        'function afterLogin(search, browser) {',
        '  const params = new URLSearchParams(search);',
        "  const next = params.get('next') || '/account';",
        '',
        '  // remember where the user wanted to go',
        '  browser.location.href = next;',
        "  showMessage('Welcome back!');",
        '}',
      ],
      hot: 6,
      why: 'The "next" value comes from the link, so anyone can write it. The code sends the user there without checking that it is still our own site.',
    },
    fixed: {
      code: [
        'function afterLogin(search, browser) {',
        '  const params = new URLSearchParams(search);',
        "  const wanted = params.get('next') || '/account';",
        "  const target = new URL(wanted, 'https://shop.example');",
        '',
        '  // only stay on our own site, otherwise go home',
        "  const safe = target.origin === 'https://shop.example';",
        "  browser.location.href = safe ? target.pathname + target.search : '/account';",
        "  showMessage('Welcome back!');",
        '}',
      ],
      hot: 6,
      why: 'The address is turned into a real URL first, then its site (origin) is compared with ours. A different site, including tricks like "//evil.example", is replaced by a safe page.',
    },
    payloads: [
      { label: 'Normal link', value: 'https://shop.example/login?next=/orders', hint: 'A real page on our own site.', attack: false },
      { label: 'Attack: full address', value: 'https://shop.example/login?next=https://evil.example/fake-login', hint: 'Looks like our link, ends on another site.', attack: true },
      { label: 'Attack: //trick', value: 'https://shop.example/login?next=//evil.example/fake-login', hint: 'No "https:" at all. Fools simple filters.', attack: true },
    ],
    run: runLab2,
  });
}

if (typeof module !== 'undefined') module.exports = { runLab2, afterLoginVulnerable, afterLoginFixed };
