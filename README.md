# Ghurir Security Sandbox

Final project for 42 Amman. An interactive sandbox website with three hands-on security labs. In each lab the visitor reads the vulnerable code, presses a payload to see the attack work, then switches to the fixed version and watches the same payload get blocked.

**Live site:**  https://ramagehad.github.io/Final-project/
**Repository:** https://github.com/RamaGehad/Final-project.git

## Team

| # | Name |
|---|------|
| 1 | Zaineh Al-momani |
| 2 | Rama Obeidat |
| 3 | Mariam Sawalha |
| 4 | Dana Rababah |
| 5 | Roa'a Al-rabie |

## The three labs

| Lab | Vulnerability | OWASP (2021) | CWE | Difficulty | Idea in one sentence |
|-----|---------------|--------------|-----|------------|----------------------|
| 1 | Prototype Pollution | A08 Software and Data Integrity Failures | CWE-1321 | Challenge | Merging user JSON into an object lets the special key `__proto__` change every object in the app. |
| 2 | Open Redirect | A01 Broken Access Control | CWE-601 | Medium | A login link with `?next=...` sends the user to any outside site the attacker chooses. |
| 3 | Business Logic Flaw (invalid quantity) | A04 Insecure Design | CWE-1284 | Easy | A shopping cart accepts a quantity of `-5`, so the total becomes negative. |

None of these are on the course's excluded list (XSS, CSRF, SSTI, XXE, SSRF, LFI/RFI/Path Traversal, Insecure Deserialization, Padding Oracle).

## How each lab works

Every lab page uses the same six sections:

1. **What it is**: a short explanation with the OWASP category and CWE number.
2. **The line**: realistic code with the single risky line highlighted and explained.
3. **Try it**: 3 payload buttons (one normal, two attacks) whose effect appears on the page.
4. **Why it matters**: the damage in simple words, with a real incident.
5. **The fix**: the corrected code with the fix highlighted, plus a **Vulnerable / Fixed** switch so the same payload is blocked.
6. **Sources**: links used for the lab.

## Rules we follow

- Plain HTML, CSS and JavaScript only. No backend, no login, no database.
- Everything is a simulation running in the browser on invented data. Nothing attacks a real site.
- Demo domains use `.example` (reserved, never a real site). No real passwords, personal data or company logos.
- 4 pages: the home page plus the three labs.
- Each lab stays under 400 words of text (code not counted).

## Project structure

​```
index.html        home page
lab1.html         Prototype Pollution
lab2.html         Open Redirect
lab3.html         Business Logic
css/style.css     one design shared by all pages
js/lab-ui.js      shared code: code viewer, payload buttons, Vulnerable/Fixed switch
js/lab1.js        logic of lab 1
js/lab2.js        logic of lab 2
js/lab3.js        logic of lab 3
​```

## Run locally

Open `index.html` in a browser. Nothing to install.