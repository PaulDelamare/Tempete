/**
 * @openapi
 * components:
 *   schemas:
 *     EmailAlertResult:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Adresse email de l'utilisateur
 *         event:
 *           type: string
 *           description: Nom de l'événement
 *         minutesLeft:
 *           type: number
 *           description: Minutes restantes avant le début de l'événement
 *         status:
 *           type: string
 *           enum: [sent, error]
 *           description: Statut de l'envoi de l'email
 *         error:
 *           type: string
 *           description: Message d'erreur si l'envoi a échoué
 *     
 *     EmailAlertResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indique si l'opération s'est bien déroulée
 *         emailsSent:
 *           type: number
 *           description: Nombre d'emails envoyés avec succès
 *         totalAlerts:
 *           type: number
 *           description: Nombre total d'alertes vérifiées
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmailAlertResult'
 *           description: Détails de chaque alerte traitée
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Horodatage de l'exécution
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/sendEmail';



/**
 * @openapi
 * /api/email-alert/send-alert:
 *   get:
 *     summary: Déclenche l'envoi des alertes email pour les événements à venir
 *     description: |
 *       Vérifie toutes les alertes email et envoie des notifications aux utilisateurs
 *       pour les événements qui commencent dans les 30 minutes à 1 heure.
 *       Cette route est conçue pour être appelée par un serveur cron.
 *     tags:
 *       - Email Alerts
 *     responses:
 *       200:
 *         description: Alertes traitées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailAlertResponse'
 *             example:
 *               success: true
 *               emailsSent: 2
 *               totalAlerts: 5
 *               results:
 *                 - email: "user@example.com"
 *                   event: "Concert Metal"
 *                   minutesLeft: 45
 *                   status: "sent"
 *                 - email: "admin@example.com"
 *                   event: "Festival Rock"
 *                   minutesLeft: 35
 *                   status: "sent"
 *               timestamp: "2025-08-21T15:30:00.000Z"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 *                 details:
 *                   type: string
 *                   description: Détails de l'erreur
 */
export async function GET(request: NextRequest) {
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



        let emailsSent = 0;
        const results = [];

        for (const alert of alerts) {
            if (alert.event && alert.event.status === 'published') {
                const eventStart = new Date(alert.event.datestart);
                const now = new Date();
                const timeDiff = eventStart.getTime() - now.getTime();
                const minutesDiff = timeDiff / (1000 * 60);



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

                        console.info(`✅ Email envoyé à ${alert.email} pour l'événement "${alert.event.name}"`);
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
