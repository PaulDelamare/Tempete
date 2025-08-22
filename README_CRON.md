# ⏰ Serveur Cron Simple - Alertes Email

## 🎯 Ce que ça fait

Récupère **toutes les alertes email** de la table `MailAlert` **toutes les 30 minutes** et affiche les résultats dans la console.

## 🚀 Utilisation

### Démarrage simple
```bash
npm run cron
```

### Développement (avec rechargement automatique)
```bash
npm run dev:cron
```

## 📊 Sortie console

```
🚀 Démarrage du serveur cron...
✅ Base de données connectée
⏰ Cron programmé : toutes les 30 minutes
🌍 Fuseau : Europe/Paris

🧪 Test initial...
🔄 Récupération des alertes email... 15/01/2024, 14:30:00
📧 3 alertes trouvées:
1. user@example.com → Concert Metal
2. admin@site.com → Festival Rock
3. fan@music.com → Concert Jazz
✅ Terminé

🎯 Serveur cron démarré !

⏰ 14:30:00 - Exécution automatique...
🔄 Récupération des alertes email... 15/01/2024, 14:30:00
📧 3 alertes trouvées:
1. user@example.com → Concert Metal
2. admin@site.com → Festival Rock
3. fan@music.com → Concert Jazz
✅ Terminé

⏰ 15:00:00 - Exécution automatique...
🔄 Récupération des alertes email... 15/01/2024, 15:00:00
📧 3 alertes trouvées:
...
```

## 🛑 Arrêt

Appuyez sur `Ctrl+C` pour arrêter proprement le serveur.

## 📁 Fichiers

- `src/server/cron.js` - Serveur cron principal
- `package.json` - Scripts npm

## ⚡ Production

Pour la production, utilisez PM2 :

```bash
# Installer PM2
npm install -g pm2

# Démarrer en arrière-plan
pm2 start src/server/cron.js --name email-cron

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs email-cron
```

## 🎯 C'est tout !

**Simple, fonctionnel, côté serveur.** 🎉
