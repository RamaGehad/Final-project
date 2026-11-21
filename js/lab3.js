/*
 * Lab 3 - Business Logic Flaw: trusting the quantity (CWE-840)
 *
 * checkoutVulnerable / checkoutFixed are the real logic of the lab.
 * The shop, the product and the prices are invented. Nothing is sent anywhere.
 */

const PRICE = 25;       // dollars per item (fake shop)
const MAX_QTY = 10;     // the most one customer may order at once

// ---- VULNERABLE version ----
function checkoutVulnerable(quantity) {
  // quantity comes straight from the request body
  const total = PRICE * quantity;

  return { status: 'accepted', total };
}

// ---- FIXED version ----
function checkoutFixed(quantity) {
  // Number.isInteger is false for strings, booleans, null, NaN and decimals
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
    return { status: 'rejected' };
  }
  const total = PRICE * quantity;
  return { status: 'accepted', total };
}

function money(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toFixed(2);
}

// One request against the fake shop.
function runLab3(payload, mode) {
  const checkout = mode === 'fixed' ? checkoutFixed : checkoutVulnerable;

  let body;
  try {
    body = JSON.parse(payload.value);
  } catch (e) {
    return { status: 'neutral', title: 'Invalid JSON', lines: [String(e.message)] };
  }

  const res = checkout(body.quantity);

  const lines = [
    'Shop         : Headphones, ' + money(PRICE) + ' each',
    'Request body : ' + payload.value,
    'Server answer: ' + res.status,
  ];

  if (res.status === 'rejected') {
    lines.push('', 'The server only accepts a whole number from 1 to ' + MAX_QTY + '.');
    return { status: 'good', title: 'BLOCKED - the order was refused', lines };
  }

  lines.push('Order total  : ' + money(res.total));

  if (res.total < 0) {
    lines.push('', 'The total is negative. The shop would owe the customer ' + money(-res.total) + ' for items never bought.');
    return { status: 'bad', title: 'ATTACK WORKED - the shop pays the customer', lines };
  }
  if (res.total === 0) {
    lines.push('', 'The order was accepted for free.');
    return { status: 'bad', title: 'ATTACK WORKED - a free order', lines };
  }
  lines.push('', 'Normal order. The total is correct.');
  return { status: 'neutral', title: 'Normal order - works as expected', lines };
}

// The code shown on the page lives below, as arrays of lines, and lab-ui.js draws it
// (same viewer and same highlight style as Labs 1 and 2).
// Keep it identical to checkoutVulnerable / checkoutFixed above.
if (typeof document !== 'undefined') {
  LabUI.init({
    vulnerable: {
      code: [
        '// Server code for POST /api/checkout',
        'const PRICE = 25;   // dollars per item',
        '',
        'function checkout(quantity) {',
        '  // quantity comes straight from the request body',
        '  const total = PRICE * quantity;',
        '',
        "  return { status: 'accepted', total };",
        '}',
      ],
      hot: 5,
      why: 'The server multiplies by whatever number it receives. It never asks "does this quantity make sense?", so -5 or 0 is treated like a normal order.',
    },
    fixed: {
      code: [
        '// Server code for POST /api/checkout',
        'const PRICE = 25;   // dollars per item',
        '',
        'function checkout(quantity) {',
        '  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {',
        "    return { status: 'rejected' };",
        '  }',
        '  const total = PRICE * quantity;',
        "  return { status: 'accepted', total };",
        '}',
      ],
      hot: 4,
      why: 'The server checks the number first: it must be a whole number from 1 to 10. Anything else is refused before any price is calculated. The check must run on the server, because the browser form can be bypassed.',
    },
    payloads: [
      { label: 'Buy 2 items', value: '{"quantity": 2}', hint: 'A normal order. Works in both versions.', attack: false },
      { label: 'Attack: quantity -5', value: '{"quantity": -5}', hint: 'A negative number turns the price negative.', attack: true },
      { label: 'Attack: quantity 0', value: '{"quantity": 0}', hint: 'Zero items gives a total of $0.', attack: true },
    ],
    run: runLab3,
  });
}

if (typeof module !== 'undefined') module.exports = { runLab3, checkoutVulnerable, checkoutFixed };
