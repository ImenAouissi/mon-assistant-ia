# Mon Assistant IA — Frontend

Interface React moderne pour l'assistant IA Groq.

## Fonctionnalités

- **Conversation multi-tours** avec historique complet envoyé à chaque requête
- **Thème clair / sombre** avec détection automatique de la préférence système
- **Sessions multiples** — créer, supprimer, basculer entre les conversations
- **Rendu Markdown** — réponses avec code, listes, tableaux formatés
- **Indicateur de frappe** — animation pendant que l'IA génère
- **Compteur de tokens** — affiché sur chaque réponse
- **Suggestions** — exemples de messages pour démarrer rapidement

## Prérequis

- Node.js 18+
- Le backend en cours d'exécution sur `http://localhost:3000`

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. (Optionnel) Modifier l'URL du backend dans .env
# VITE_API_BASE=http://localhost:3000

# 4. Lancer en développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

## Build production

```bash
npm run build
npm run preview
```

## Structure du projet

```
src/
├── components/
│   ├── ChatWindow.jsx   # Zone de chat principale
│   ├── Message.jsx      # Affichage d'un message (avec Markdown)
│   ├── InputBar.jsx     # Barre de saisie
│   └── Sidebar.jsx      # Liste des sessions
├── hooks/
│   └── useConversation.js  # Logique d'état et appels API
├── App.jsx              # Composant racine + gestion du thème
├── main.jsx             # Point d'entrée
└── index.css            # Variables CSS + styles globaux
```

## Configuration CORS du backend

Assurez-vous que votre `app.js` backend autorise les requêtes du frontend :

```js
const cors = require('cors')
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000']
}))
```

## Routes API utilisées

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/conversation` | POST | Conversation multi-tours |

Corps de la requête :
```json
{
  "messages": [
    { "role": "user", "content": "Bonjour" },
    { "role": "assistant", "content": "Bonjour ! Comment puis-je vous aider ?" },
    { "role": "user", "content": "Explique-moi React" }
  ]
}
```
