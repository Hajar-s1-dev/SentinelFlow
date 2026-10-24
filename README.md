🛡️ SentinelFlow
A Linux security scanner with a Kanban workflow for tracking and managing detected risks.

SentinelFlow is a desktop application built with Electron, JavaScript, HTML/CSS, and Bash. It runs a local security-check script on a Linux system, displays the results in a Kanban board, and helps users track each finding from To Do to In Progress and Verified.
Project status: Educational / prototype project. The current scanner performs a limited set of local configuration and system checks; it is not a complete security audit tool.

✨ Features
- One-click scan: Start the Bash security scan from the desktop interface.
- SSH configuration check: Inspect whether PermitRootLogin is explicitly set to yes.
- Firewall check: Check whether the UFW service is active.
- Listening ports: List local TCP/UDP listening ports for review.
- Root-privileged accounts: Check for accounts with UID 0.
- Home-directory permissions: Look for files writable by everyone within the first two directory levels of the current user's home directory.
- Pending package updates: Check for available upgrades on systems that use apt.
- Severity labels: Classify results as Critical, High, Medium, or Low.
- Kanban workflow: Drag findings between À traiter, En cours, and Vérifié.
- Desktop application: Use a local Electron window rather than a browser-hosted web app.
🧰 Tech stack
Technology	Role
Electron	Desktop application window and main process
JavaScript	UI interactions, scan request, and Kanban rendering
HTML / CSS	User interface and styling
Bash	Local Linux security checks
Node.js	Runtime used by Electron
IPC + contextBridge	Communication between the UI and Electron main process


📂 Project structure
The main files expected by the current code are:
SentinelFlow/
├── index.html
├── main.js
├── preload.js
├── renderer.js
├── package.json
└── script/
    └── scanner.sh
package-lock.json records the npm dependency tree. The script/ directory is important: main.js currently looks for the scanner at script/scanner.sh.
⚙️ Requirements
- A Linux system with Bash and the utilities used by the script.
- Node.js and npm.
- npm dependencies installed for the project.
- For the firewall check, systemctl and UFW are expected.
- For the package-update check, apt must be available.
- Some checks may return incomplete or misleading results if the script is run without suitable permissions.
The current script uses Linux-specific paths and commands, so it is intended for Linux rather than Windows or macOS.
🚀 Installation and launch
1. Clone or download this repository.
2. Open a terminal in the project root.
3. Install the dependencies:
   npm install
4. Make the scanner executable:
   chmod +x script/scanner.sh
5. Start the application:
   npm start
6. In the SentinelFlow window, click ▶ Lancer l'analyse to run the checks.
Important path check
The supplied scanner.sh file must be placed at:
script/scanner.sh
If it is stored somewhere else, update scriptPath in main.js to match its actual location.
🔄 How it works
1. The user clicks Lancer l'analyse in the desktop interface.
2. renderer.js requests a scan through the API exposed by preload.js.
3. preload.js sends the request to the Electron main process using IPC.
4. main.js runs scanner.sh with Bash.
5. The script prints scan results as JSON.
6. The application parses the JSON and renders each finding as a Kanban card.
7. The user can drag cards between the workflow columns to track remediation progress.
🧪 Checks performed by the current scanner
Check	What it looks for	Example recommendation
SSH	An explicit PermitRootLogin yes setting in sshd_config	Review the SSH configuration and disable direct root login where appropriate
UFW	Whether the UFW service is active	Review firewall requirements and enable UFW if appropriate
Listening ports	Locally listening TCP/UDP ports	Identify the services using each port and confirm they are needed
UID 0 accounts	Accounts with user ID 0	Investigate unexpected accounts with root-level privileges
Home permissions	World-writable files within two levels of $HOME	Review and restrict permissions where needed
Package updates	Packages listed as upgradeable by apt	Review updates and apply appropriate security patches


Important limitations of the current checks:
- The SSH check reads an explicit PermitRootLogin line from /etc/ssh/sshd_config; it does not fully resolve SSH defaults, included configuration files, or effective configuration.
- The listening-port check reports ports for review; an open/listening port is not automatically a vulnerability.
- The home-directory permission check is limited to two levels and can miss other files or permission issues.
- The package-update check relies on apt and does not itself install updates.
- Results are only as reliable as the checks and permissions available to the script.
🗂️ Kanban workflow
- À traiter: Findings that need attention.
- En cours: Findings currently being investigated or fixed.
- Vérifié: Findings considered resolved or checked.
The current drag-and-drop interface updates the displayed column and counts during the running session. Persistent storage of cards and their statuses across restarts is not implemented in the supplied code.
🔐 Security notes
- Run SentinelFlow only on systems you own or are authorized to assess.
- Review every recommendation before changing system configuration.
- Do not run the application with elevated privileges unless necessary and you understand the consequences.
- The scanner is intended for local checks; it does not provide continuous monitoring, automatic remediation, or a guarantee that a system is secure.
- The Electron application uses context isolation and disables Node integration in the renderer. Continue to keep privileged operations in the main process and expose only narrowly scoped APIs through the preload script.
🛠️ Current implementation notes
- main.js expects script/scanner.sh.
- The script's standard output must contain valid JSON for the UI to parse.
- The project currently contains a start script (npm start) for launching Electron.
- The Kanban card status is managed in the interface during the current session; the provided code does not save status changes to a database or file.
🔭 Possible future improvements
- Save scan history and Kanban status between sessions.
- Add a scan-in-progress indicator and clearer error messages in the UI.
- Improve JSON generation in Bash using a JSON tool such as jq, so special characters are escaped safely.
- Check the effective SSH configuration rather than only a single configuration line.
- Add timestamps, scan summaries, and filters by severity.
- Add tests for scanner output and error handling.
- Review Electron and dependency versions and update them as appropriate.
👩‍💻 Author
Created as a learning project to explore Linux security checks, Bash scripting, Electron desktop development, and risk tracking with a Kanban workflow.
