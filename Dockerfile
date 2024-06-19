# Utiliser une image de base officielle de Node.js pour construire l'application
FROM node:14 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Utiliser une image de base nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build de l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port sur lequel l'application va tourner
EXPOSE 80

# Aucune commande de démarrage spécifique nécessaire pour nginx, il se lance par défautgfds