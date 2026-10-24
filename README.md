🛡️ SentinelFlow - System Security Audit & Kanban Dashboard
A modern desktop application built with Electron and Bash that automates Linux system security audits and visualizes vulnerabilities using an interactive Kanban board. The project provides an intuitive workflow to track and manage system hardening and remediation progress.

📌 Features

✅ Automated Linux Security Scans

✅ Interactive Kanban Drag & Drop Workflow

✅ Real-time Risk Severity Badging (Critique, Élevé, Moyen, Faible)

✅ Secure Electron IPC Architecture

✅ Native Shell Script Execution

✅ Dynamic Status Tracking (À traiter, En cours, Vérifié)

✅ Responsive and Clean UI Design

✅ Lightweight Desktop Integration

⚙️ Technologies Used

Electron 27

Node.js

Bash Scripting

HTML5 / CSS3

JavaScript (ES6)

🚀 Installation
Clone the repository
git clone https://github.com/Hajar-s1-dev/SentinelFlow.git
Go to the project directory
cd SentinelFlow
Install dependencies
npm install
Make the scanner script executable
chmod +x script/scanner.sh
Start the application
npm start

🔍 Audit Scope
The internal Bash scanner evaluates several key system security indicators, including:

SSH Configuration (PermitRootLogin check)

UFW Firewall Status

Open Network Ports Inspection

Root Privileges (UID 0 accounts verification)

Sensitive Directory Permissions

Pending System Updates (APT)

🏗️ Architecture
The application follows a secure multi-process Electron architecture.
User Interface (Renderer)
│
▼
IPC Communication
│
▼
Electron Main Process (Node.js)
│
▼
Bash Security Scanner Script
│
▼
JSON Data Parsed & Rendered to Kanban Board

💡 Future Improvements

Remote SSH Target Auditing

PDF / CSV Security Report Export

Custom Rule Configuration Editor

Automated Fix / Remediation Scripts

Database History Tracking

Computer Science Student | System Security & Full-Stack Developer
