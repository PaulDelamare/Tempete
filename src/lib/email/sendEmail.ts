import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

import { emailConfig } from "@/config/email-config";

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

    handlebars.registerHelper("parseJSON", (context: string) => {
        try {
            return JSON.parse(String(context));
        } catch (err) {
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
    const rootPath = process.cwd();
    const basePublicEmails = path.join(rootPath, "public", "emails");

    const headerPath = path.join(basePublicEmails, "layouts", "header.hbs");
    const footerPath = path.join(basePublicEmails, "layouts", "footer.hbs");
    const templatePath = path.join(basePublicEmails, "templates", `${templateName}.hbs`);

    try {
        const headerRaw = readTemplateFile(headerPath);
        const footerRaw = readTemplateFile(footerPath);
        const templateRaw = readTemplateFile(templatePath);

        if (!partialsRegistered.has(headerPath)) {
            handlebars.registerPartial("header", headerRaw);
            partialsRegistered.add(headerPath);
        }
        if (!partialsRegistered.has(footerPath)) {
            handlebars.registerPartial("footer", footerRaw);
            partialsRegistered.add(footerPath);
        }

        registerHelpersOnce();

        let compiledTemplate = compiledTemplateCache.get(templatePath);
        if (!compiledTemplate) {
            compiledTemplate = handlebars.compile(templateRaw);
            compiledTemplateCache.set(templatePath, compiledTemplate);
        }

        const mergedData: EmailData = {
            ...data,
            apiUrl: process.env.API_URL ?? "",
            siteUrl: process.env.SITE_URL ?? "",
        };

        const html = compiledTemplate(mergedData);

        const transporter = nodemailer.createTransport(emailConfig);

        const recipients = to.split(",").map((r) => r.trim()).filter(Boolean);
        if (recipients.length === 0) {
            throw new Error("Aucun destinataire fourni dans `to`.");
        }

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
        console.error("[sendEmail] erreur:", err);
        throw err;
    }
}
