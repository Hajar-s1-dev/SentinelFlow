const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Communication IPC avec le script Bash
ipcMain.handle('run-security-scan', async () => {
    return new Promise((resolve) => {
        const scriptPath = path.join(__dirname, 'script', 'scanner.sh');

        exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur d'exécution: ${error}`);
                resolve([
                    { 
                        risque: "Erreur d'exécution du script", 
                        gravite: "Critique", 
                        recommandation: "Vérifier les permissions du script avec chmod +x", 
                        statut: "À traiter" 
                    }
                ]);
                return;
            }

            try {
                // Lecture et conversion du retour JSON du script
                const scanResults = JSON.parse(stdout.trim());
                resolve(scanResults);
            } catch (parseError) {
                console.error("Erreur de lecture JSON:", parseError);
                console.log("Sortie brute du script:", stdout);
                resolve([
                    { 
                        risque: "Erreur de formatage des données", 
                        gravite: "Moyen", 
                        recommandation: "Vérifier que le script Bash renvoie un JSON valide", 
                        statut: "À traiter" 
                    }
                ]);
            }
        });
    });
});
