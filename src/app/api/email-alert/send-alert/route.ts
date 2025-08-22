import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/sendEmail';

export async function GET(request: NextRequest) {
    try {
        console.log('🔄 Déclenchement des alertes email depuis le serveur cron...');

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

        console.log(`📧 ${alerts.length} alertes trouvées`);

        let emailsSent = 0;
        const results = [];

        // Traiter chaque alerte
        for (const alert of alerts) {
            if (alert.event && alert.event.status === 'published') {
                const eventStart = new Date(alert.event.datestart);
                const now = new Date();
                const timeDiff = eventStart.getTime() - now.getTime();
                const minutesDiff = timeDiff / (1000 * 60);

                console.log(`⏰ Événement "${alert.event.name}" commence dans ${Math.round(minutesDiff)} minutes`);

                // Si l'événement commence dans 30 minutes à 1 heure
                if (minutesDiff >= 30 && minutesDiff <= 60) {
                    try {
                        await sendEmail(
                            alert.email,
                            "no-reply@tempete.com",
                            `🚨 ALERTE : ${alert.event.name} commence dans ${Math.round(minutesDiff)} minutes !`,
                            "eventReminder/event-reminder",
                            {
                                eventName: alert.event.name,
                                eventStart: eventStart.toLocaleString('fr-FR'),
                                minutesLeft: Math.round(minutesDiff),
                                userEmail: alert.email
                            }
                        );

                        emailsSent++;
                        results.push({
                            email: alert.email,
                            event: alert.event.name,
                            minutesLeft: Math.round(minutesDiff),
                            status: 'sent'
                        });

                        console.log(`✅ Email envoyé à ${alert.email} pour l'événement "${alert.event.name}"`);
                    } catch (error) {
                        results.push({
                            email: alert.email,
                            event: alert.event.name,
                            minutesLeft: Math.round(minutesDiff),
                            status: 'error',
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });

                        console.error(`❌ Erreur envoi email à ${alert.email}:`, error);
                    }
                }
            }
        }

        console.log(`🎯 Résumé : ${emailsSent} emails envoyés sur ${alerts.length} alertes vérifiées`);

        return NextResponse.json({
            success: true,
            emailsSent,
            totalAlerts: alerts.length,
            results,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur API send-alert:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
