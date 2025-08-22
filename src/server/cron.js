const cron = require('node-cron');

async function triggerEmailAlerts() {
    try {
        console.log('🔄 Déclenchement des alertes email...', new Date().toLocaleString('fr-FR'));
        
        const response = await fetch('http://localhost:3000/api/email-alert/send-alert', {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            console.info(`✅ API appelée avec succès : ${data.emailsSent} emails envoyés sur ${data.totalAlerts} alertes`);
        } else {
            console.error(`❌ Erreur API (${response.status}):`, await response.text());
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'appel API:', error instanceof Error ? error.message : 'Unknown error');
    }
}

function startCron() {
    // Vérifier toutes les 30 minutes
    cron.schedule('*/30 * * * *', triggerEmailAlerts, {
        timezone: "Europe/Paris"
    });
    
    // Test initial
    triggerEmailAlerts();
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    process.exit(0);
});

startCron();
