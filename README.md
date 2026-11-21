# Ghurir Security Sandbox

Final project for 42 Amman. An interactive sandbox website with three hands-on security labs. In each lab the visitor reads the vulnerable code, presses a payload to see the attack work, then switches to the fixed version and watches the same payload get blocked.

**Live site:** https://github.com/RamaGehad/Final-project.git

## Team

| # | Name |
|---|------|
| 1 | Zaineh Al-momani |
| 2 | Rama Obeidat |
| 3 | Mariam Sawalha |
| 4 | Dana Rababah |
| 5 | Roa'a Al-rabie |

## Chosen vulnerabilities

| Lab | Vulnerability | CWE | Difficulty | Idea in one sentence |
|-----|---------------|-----|------------|----------------------|
| 1 | Prototype Pollution | CWE-1321 | Challenge (hard) | Merging user JSON into an object lets the special key `__proto__` change every object in the app. |
| 2 | Open Redirect | CWE-601 | Medium | A login link with `?next=...` sends the user to any outside site the attacker chooses. |
| 3 | Business Logic Flaw (negative quantity) | CWE-840 (to be confirmed with staff, CWE-20 as an alternative) | Easy | A shopping cart accepts a quantity of `-5`, so the total becomes negative. |

None of these are on the course's excluded list (XSS, CSRF, SSTI, XXE, SSRF, LFI/RFI/Path Traversal, Insecure Deserialization, Padding Oracle).

## How each lab works

Every lab page uses the same six sections:

1. **What it is**: a short explanation with the OWASP category and CWE number.
2. **The line**: realistic code with the single risky line highlighted and explained.
3. **Try it**: 2 to 3 payload buttons whose effect appears on the page.
4. **Why it matters**: the damage in simple words, with a real incident where possible.
5. **The fix**: the corrected code with the fix highlighted, plus a **Vulnerable / Fixed** switch so the same payload is blocked.
6. **Sources**: links used for the lab.

## Rules we follow

- Plain HTML, CSS and JavaScript only. No backend, no login, no database.
- Everything is a simulation running in the browser on invented data.
- Demo domains use `.example` (reserved, never a real site). No real passwords, personal data or company logos.
- 5 pages at most: home page plus the three labs.
- Each lab stays under 400 words of text (code not counted).

## Planned structure

```
index.html        home page
lab1.html         Prototype Pollution
lab2.html         Open Redirect
lab3.html         Business Logic
css/style.css     one design shared by all pages
js/lab-ui.js      shared code: code viewer, payload buttons, Vulnerable/Fixed switch
js/lab1.js        logic of lab 1
js/lab2.js        logic of lab 2
js/lab3.js        logic of lab 3
```

## Plan

| Date | Goal |
|------|------|
| 16 Nov | Choose vulnerabilities, get staff approval, create repo, split roles |
| 17-18 Nov | Build shared design, then the three labs in parallel |
| 19 Nov | Merge everything and deploy on GitHub Pages |
| 20 Nov | Test every lab on the live link, fix bugs, shorten texts |
| 21 Nov | Final check and submit before 11:59 PM |
| 22 Nov | Presentation |

## Run locally

Open `index.html` in a browser. Nothing to install.
