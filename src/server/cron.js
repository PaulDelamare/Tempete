const cron = require('node-cron');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();


async function fetchEmailAlerts() {
    try {
        const alerts = await prisma.mailAlert.findMany({
            include: {
                event: {
                    select: {
                        name: true,
                        datestart: true,
                        status: true
                    }
                }
            }
        });

        alerts.forEach(alert => {
            if (alert.event && alert.event.status === 'published') {
                const eventStart = new Date(alert.event.datestart);
                const now = new Date();
                const timeDiff = eventStart.getTime() - now.getTime();
                const minutesDiff = timeDiff / (1000 * 60);

                // Si l'événement commence dans 30 minutes à 1 heure
                console.log("time diff : ", minutesDiff);
                console.log("event : ", alert.event);
                if (minutesDiff >= 30 && minutesDiff <= 60) {
                    console.log(`🚨 ALERTE : Événement "${alert.event.name}" commence dans ${Math.round(minutesDiff)} minutes !`);
                    console.log(`📧 Email: ${alert.email}`);
                    console.log(`⏰ Heure de début: ${eventStart.toLocaleString('fr-FR')}`);
                    console.log('---');
                }
            }
        });

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}


async function startCron() {
    try {
        await prisma.$connect();
    } catch (error) {
        console.error('❌ Erreur DB:', error.message);
        process.exit(1);
    }

    // 30mn
    cron.schedule('*/5 * * * * *', fetchEmailAlerts, {
        timezone: "Europe/Paris"
    });

    await fetchEmailAlerts();
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

startCron();
