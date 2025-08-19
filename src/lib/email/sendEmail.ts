// src/lib/email/sendEmail.ts
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

import { emailConfig } from "../../../config/email-config"; // adapte le chemin si besoin

interface EmailData {
    [key: string]: unknown;
}

/**
 * sendEmail adapté pour Next.js (templates placés dans /public/emails)
 *
 * Exige :
 *  - public/emails/layouts/header.hbs
 *  - public/emails/layouts/footer.hbs
 *  - public/emails/templates/<templateName>.hbs
 *
 * Utilisation: sendEmail("to@exemple.com", "no-reply@site.com", "Sujet", "reset-password", { name: "Toto" })
 */

const compiledTemplateCache = new Map<string, Handlebars.TemplateDelegate>();
const partialsRegistered = new Set<string>();
let helpersRegistered = false;

function readTemplateFile(filePath: string): string {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Template introuvable : ${filePath}`);
    }
    return fs.readFileSync(filePath, "utf8");
}

function registerHelpersOnce() {
    if (helpersRegistered) return;

    // Exemples de helpers ; ajoute/enlève selon besoins
    handlebars.registerHelper("parseJSON", (context: string) => {
        try {
            return JSON.parse(String(context));
        } catch (err) {
            // renvoie un tableau vide pour éviter crash si on itère sur le résultat
            console.error("Erreur parseJSON helper:", err);
            return [];
        }
    });

    handlebars.registerHelper("uppercase", (str: string) => {
        return String(str || "").toUpperCase();
    });

    helpersRegistered = true;
}

export async function sendEmail(
    to: string,
    sender: string,
    subject: string,
    templateName: string,
    data: EmailData = {}
): Promise<void> {
    // racine du projet (Next.js)
    const rootPath = process.cwd();
    const basePublicEmails = path.join(rootPath, "public", "emails");

    const headerPath = path.join(basePublicEmails, "layouts", "header.hbs");
    const footerPath = path.join(basePublicEmails, "layouts", "footer.hbs");
    const templatePath = path.join(basePublicEmails, "templates", `${templateName}.hbs`);

    try {
        console.log(data)
        // vérifications
        const headerRaw = readTemplateFile(headerPath);
        const footerRaw = readTemplateFile(footerPath);
        const templateRaw = readTemplateFile(templatePath);

        // enregistre partials si pas déjà fait
        if (!partialsRegistered.has(headerPath)) {
            handlebars.registerPartial("header", headerRaw);
            partialsRegistered.add(headerPath);
        }
        if (!partialsRegistered.has(footerPath)) {
            handlebars.registerPartial("footer", footerRaw);
            partialsRegistered.add(footerPath);
        }

        // helpers
        registerHelpersOnce();

        // compile template (cache)
        let compiledTemplate = compiledTemplateCache.get(templatePath);
        if (!compiledTemplate) {
            compiledTemplate = handlebars.compile(templateRaw);
            compiledTemplateCache.set(templatePath, compiledTemplate);
        }

        // enrichis data avec URLs si dispo
        const mergedData: EmailData = {
            ...data,
            apiUrl: process.env.API_URL ?? "",
            siteUrl: process.env.SITE_URL ?? "",
        };

        // génération HTML
        const html = compiledTemplate(mergedData);

        // create transporter
        const transporter = nodemailer.createTransport(emailConfig);

        // plusieurs destinataires séparés par , possible
        const recipients = to.split(",").map((r) => r.trim()).filter(Boolean);
        if (recipients.length === 0) {
            throw new Error("Aucun destinataire fourni dans `to`.");
        }

        // envoie en parallèle
        await Promise.all(
            recipients.map((recipient) =>
                transporter.sendMail({
                    from: sender,
                    to: recipient,
                    subject,
                    html,
                })
            )
        );
    } catch (err) {
        // pour debuggage côté Next.js -> message franc et utile
        console.error("[sendEmail] erreur:", err);
        // rethrow pour que le caller sache que c'est en échec (API route renverra 500)
        throw err;
    }
}
