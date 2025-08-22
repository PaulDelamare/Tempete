const cron = require('node-cron');

async function triggerEmailAlerts() {
    try {
        console.log('🔄 Déclenchement des alertes email...', new Date().toLocaleString('fr-FR'));
        
        const response = await fetch('http://localhost:3000/api/email-alert/send-alert', {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ API appelée avec succès : ${data.emailsSent} emails envoyés sur ${data.totalAlerts} alertes`);
        } else {
            console.error(`❌ Erreur API (${response.status}):`, await response.text());
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'appel API:', error instanceof Error ? error.message : 'Unknown error');
    }
}

function startCron() {
    console.log('🚀 Démarrage du serveur cron...');
    
    // Vérifier toutes les 5 minutes
    cron.schedule('*/5 * * * *', triggerEmailAlerts, {
        timezone: "Europe/Paris"
    });
    
    console.log('⏰ Cron programmé : toutes les 5 minutes');
    console.log('🌍 Fuseau : Europe/Paris');
    
    // Test initial
    console.log('\n🧪 Test initial...');
    triggerEmailAlerts();
    
    console.log('🎯 Serveur cron démarré !\n');
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur cron...');
    process.exit(0);
});

startCron();
