
const LabUI = {
    init: function (config) {
        let mode = 'vulnerable';
        let selectedPayload = null;

        const vulnCode = document.getElementById('code-vuln');
        const fixedCode = document.getElementById('code-fixed');
        const vulnWhy = document.getElementById('why-vuln');
        const fixedWhy = document.getElementById('why-fixed');
        const payloadContainer = document.getElementById('payloads');
        const output = document.getElementById('output');
        const modeButtons = document.querySelectorAll('.mode-btn');
        const runFixed = document.getElementById('run-fixed');

        // Display code and highlight the important line
        function displayCode(element, code, hot, fixed) {
            element.replaceChildren();

            code.forEach(function (line, index) {
                const span = document.createElement('span');

                span.className = 'code-line';

                if (index === hot) {
                    span.classList.add(fixed ? 'fixed-hot' : 'hot');
                }

                span.textContent = line || ' ';
                element.appendChild(span);
            });
        }

        // Display the lab code and explanations
        displayCode(
            vulnCode,
            config.vulnerable.code,
            config.vulnerable.hot,
            false
        );

        displayCode(
            fixedCode,
            config.fixed.code,
            config.fixed.hot,
            true
        );

        vulnWhy.textContent = config.vulnerable.why;
        fixedWhy.textContent = config.fixed.why;

        // Display the payload buttons
        config.payloads.forEach(function (payload) {
            const button = document.createElement('button');

            button.type = 'button';
            button.className = 'payload-btn';
            button.textContent = payload.label;

            button.addEventListener('click', function () {
                selectedPayload = payload;

                document.querySelectorAll('.payload-btn').forEach(
                    function (btn) {
                        btn.classList.remove('selected');
                    }
                );

                button.classList.add('selected');
                runPayload();
            });

            payloadContainer.appendChild(button);
        });

        // Execute the selected payload
        function runPayload() {
            if (!selectedPayload)
                return;

            const result = config.run(selectedPayload, mode);

            output.replaceChildren();
            output.className = 'out ' + result.status;

            const title = document.createElement('h3');
            title.textContent = result.title;
            output.appendChild(title);

            const details = document.createElement('pre');
            details.textContent = result.lines.join('\n');
            output.appendChild(details);
        }

        // Change between Vulnerable and Fixed
        function changeMode(newMode) {
            mode = newMode;

            modeButtons.forEach(function (button) {
                const active = button.dataset.mode === mode;

                button.setAttribute(
                    'aria-pressed',
                    String(active)
                );
            });

            runPayload();
        }

        modeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                changeMode(button.dataset.mode);
            });
        });

        // Run the previously selected payload in Fixed mode
        runFixed.addEventListener('click', function () {
            changeMode('fixed');
        });
    }
};

window.LabUI = LabUI;
