const cron = require('node-cron');
const { PrismaClient } = require('../generated/prisma');
const { sendEmail } = require('../lib/email/sendEmail');

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

        // Traiter les alertes en parallèle
        const emailPromises = alerts.map(async (alert) => {
            if (alert.event && alert.event.status === 'published') {
                const eventStart = new Date(alert.event.datestart);
                const now = new Date();
                const timeDiff = eventStart.getTime() - now.getTime();
                const minutesDiff = timeDiff / (1000 * 60);

                // Si l'événement commence dans 30 minutes à 1 heure
                if (minutesDiff >= 30 && minutesDiff <= 60) {
                    try {
                        // Envoyer l'email d'alerte
                        await sendEmail(
                            alert.email,
                            "no-reply@tempete.com",
                            `🚨 ALERTE : ${alert.event.name} commence dans ${Math.round(minutesDiff)} minutes !`,
                            "event-reminder",
                            {
                                eventName: alert.event.name,
                                eventStart: eventStart.toLocaleString('fr-FR'),
                                minutesLeft: Math.round(minutesDiff),
                                userEmail: alert.email
                            }
                        );

                        console.log(`✅ Email envoyé à ${alert.email} pour l'événement "${alert.event.name}"`);
                    } catch (error) {
                        console.error(`❌ Erreur envoi email à ${alert.email}:`, error.message);
                    }
                }
            }
        });

        // Attendre que tous les emails soient traités
        await Promise.all(emailPromises);

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
