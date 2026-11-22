

# E-Learning Platform

[![Version Frontend](https://img.shields.io/badge/frontend_version-0.1.0-blue.svg)](#)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](#)
<!-- Emplacement pour badges CI/CD, couverture de tests et licence (À compléter : voir section Notes pour compléter) -->

Plateforme web d'apprentissage en ligne (*Learning Management System* - LMS) fullstack avec architecture découplée, comprenant une API REST Java Spring Boot et une interface utilisateur web réactive construite avec Next.js et Tailwind CSS.

---

## Sommaire

- [Description courte](#description-courte)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Captures d'écran ou démonstration](#captures-décran-ou-démonstration)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration / variables d'environnement](#configuration--variables-denvironnement)
- [Démarrage du projet](#démarrage-du-projet)
- [Utilisation](#utilisation)
  - [Comptes de test préconfigurés](#comptes-de-test-préconfigurés)
  - [API REST et Endpoints principaux](#api-rest-et-endpoints-principaux)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Licence](#licence)
- [Auteurs / contacts](#auteurs--contacts)
- [Ressources utiles](#ressources-utiles)
- [Notes pour compléter](#notes-pour-compléter)

---

## Description courte

La plateforme permet la gestion et le suivi de formations en ligne avec prise en charge de contenus vidéo, de quiz d'évaluation, de certificats et d'abonnements. Elle intègre un contrôle d'accès basé sur les rôles (Étudiant, Enseignant/Formateur, Administrateur).

---

## Fonctionnalités principales

### Espace Étudiant (`STUDENT`)
- **Catalogue et inscription** : consultation des cours disponibles par catégorie et niveau, inscription aux cours.
- **Lecteur vidéo pédagogique** : lecteur vidéo interactif avec calcul et enregistrement de la progression de visionnage (leçon validée à 90 %).
- **Évaluations et quiz** : passage des quiz associés aux modules et calcul des résultats.
- **Suivi et certificats** : tableau de bord de progression et génération/téléchargement de certificats d'achèvement.
- **Abonnements et paiement** : souscription aux plans d'abonnement avec intégration de paiement (simulation).

### Espace Enseignant / Formateur (`PROFESSOR` / `TRAINER`)
- **Gestion des cours** : création, modification et suppression de cours.
- **Gestion pédagogique** : structuration des formations en modules et en leçons vidéo (liens YouTube ou fichiers multimédias).
- **Suivi des inscriptions** : visualisation des étudiants inscrits et consultation des statistiques associées.

### Espace Administrateur (`ADMIN`)
- **Tableau de bord global** : indicateurs clés (nombre d'utilisateurs, cours publiés, inscriptions totales, revenus).
- **Gestion des utilisateurs** : affichage de la liste complète, activation, modification et blocage de comptes.
- **Supervision du catalogue** : audit et modération des cours et modules.

### Sécurité et Architecture
- **Authentification sans état** : émission et validation de jetons JWT (JSON Web Tokens).
- **Contrôle d'accès par rôle (RBAC)** : sécurisation des routes côté backend (Spring Security) et côté frontend (middleware et composants protégés).

---

## Captures d'écran ou démonstration

L'interface web est accessible via le navigateur après démarrage du serveur frontend à l'adresse `http://localhost:3000`.

```
+-----------------------------------------------------------------------+
|  [Emplacement pour capture d'écran : Page d'accueil / Landing page]   |
|  ./docs/screenshots/landing-page.png                                  |
+-----------------------------------------------------------------------+
|  [Emplacement pour capture d'écran : Lecteur vidéo de cours]          |
|  ./docs/screenshots/video-player.png                                  |
+-----------------------------------------------------------------------+
|  [Emplacement pour capture d'écran : Tableau de bord Administrateur]  |
|  ./docs/screenshots/admin-dashboard.png                               |
+-----------------------------------------------------------------------+
```

---

## Prérequis

Pour installer et exécuter le projet localement, les outils suivants sont requis :

- **Java Development Kit (JDK)** : Version 17
- **Apache Maven** : Version 3.8 ou supérieure (ou utilisation du wrapper `mvnw`)
- **Node.js** : Version 18.x ou 20.x (compatible également avec Bun)
- **Gestionnaire de paquets Node** : `npm` (inclus avec Node.js)
- **Base de données relationnelle** : MySQL 8.x en cours d'exécution sur le port `3306`

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/haythem9833/Projet-d-integration.git
cd Projet-d-integration
```

### 2. Préparation de la base de données MySQL

Créer une base de données nommée `elearning` dans votre instance MySQL locale :

```sql
CREATE DATABASE elearning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Injecter les données de test initiales (utilisateurs et cours) situées dans le dossier backend :

```bash
mysql -u root -p elearning < backend/seed_users.sql
mysql -u root -p elearning < backend/seed_test_courses.sql
```

> **Remarque importante sur le schéma** : La propriété Hibernate du backend est configurée sur `ddl-auto: validate`. Si les tables ne sont pas préalablement créées par vos scripts SQL, basculez temporairement cette valeur sur `update` dans `backend/src/main/resources/application.yaml` lors du premier démarrage.

### 3. Installation des dépendances du Backend

```bash
cd backend
mvn clean install -DskipTests
cd ..
```

### 4. Installation des dépendances du Frontend

```bash
cd frontend
npm install
cd ..
```

---

## Configuration / variables d'environnement

### Backend (`backend/src/main/resources/application.yaml`)

Le backend charge sa configuration depuis le fichier [application.yaml](./backend/src/main/resources/application.yaml). Les paramètres par défaut sont :

```yaml
server:
  port: 8082

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC
    username: root
    password:
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    database-platform: org.hibernate.dialect.MySQLDialect

app:
  jwt:
    secret: myVeryLongSecretKeyThatIsAtLeast256BitsLongForHS256AlgorithmSecurityCompliance123456789012345678901234567890

stripe:
  api:
    key: ${STRIPE_API_KEY:sk_test_your_test_key_here}
```

Variables d'environnement optionnelles pour le backend :
- `STRIPE_API_KEY` : Clé d'API secrète Stripe (valeur par défaut de test fournie).

### Frontend (`frontend/.env.local`)

Créer un fichier `.env.local` dans le répertoire `frontend` à partir du fichier modèle [frontend/.env.example](./frontend/.env.example) :

```bash
cd frontend
cp .env.example .env.local
```

Contenu requis dans `frontend/.env.local` :

```env
# Aligner l'URL sur le port effectif du backend (8082)
NEXT_PUBLIC_API_URL=http://localhost:8082/api
NEXT_PUBLIC_APP_NAME=E-Learning Platform
```

---

## Démarrage du projet

### 1. Démarrer le Backend (Spring Boot)

Depuis la racine du projet :

```bash
cd backend
mvn spring-boot:run
```

Le serveur backend écoute par défaut sur le port **`8082`** : `http://localhost:8082`.

### 2. Démarrer le Frontend (Next.js)

Dans un second terminal :

```bash
cd frontend
npm run dev
```

L'application web est accessible sur le port **`3000`** : `http://localhost:3000`.

---

## Utilisation

### Comptes de test préconfigurés

Les comptes suivants sont créés lors de l'exécution du script [backend/seed_users.sql](./backend/seed_users.sql) :

| Rôle | Adresse e-mail | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@example.com` | `password123` |
| **Professeur / Formateur** | `professor@example.com` | `password123` |
| **Étudiant** | `student@example.com` | `password123` |

### API REST et Endpoints principaux

L'URL de base de l'API est `http://localhost:8082/api`.

#### 1. Authentification
- `POST /api/auth/login` : Connexion et récupération du jeton JWT.
- `POST /api/auth/signup` : Inscription d'un nouvel utilisateur.
- `POST /api/auth/logout` : Déconnexion.
- `GET /api/auth/users` : Liste des utilisateurs.

**Exemple de requête : Connexion**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

**Exemple de réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### 2. Cours
- `GET /api/courses` : Liste de tous les cours.
- `GET /api/courses/{id}` : Détails d'un cours avec ses modules et leçons.
- `POST /api/courses` : Création d'un cours (Rôle `TRAINER` ou `ADMIN` requis).
- `PUT /api/courses/{id}` : Mise à jour d'un cours.
- `DELETE /api/courses/{id}` : Suppression d'un cours.

**Exemple de requête : Créer un cours**
```bash
curl -X POST http://localhost:8082/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_TOKEN_JWT>" \
  -d '{
    "title": "Introduction à TypeScript",
    "description": "Apprendre les bases du typage statique moderne",
    "category": "Development",
    "level": "Beginner",
    "price": 49.99
  }'
```

#### 3. Modules et Leçons
- `POST /api/modules` : Ajout d'un module à un cours.
- `PUT /api/modules/{id}` : Modification d'un module.
- `DELETE /api/modules/{id}` : Suppression d'un module.
- `POST /api/lessons` : Création d'une leçon avec support d'URL vidéo.
- `POST /api/video-progress` : Mise à jour de la progression de lecture d'une vidéo.

#### 4. Inscriptions et Certificats
- `POST /api/enrollments` : Inscription d'un étudiant à un cours.
- `GET /api/enrollments/my-courses` : Liste des cours suivis par l'étudiant connecté.
- `GET /api/certificates` : Liste des certificats obtenus.
- `GET /api/certificates/{id}` : Détail et export d'un certificat.

#### 5. Paiements et Abonnements
- `GET /api/payments/plans` : Liste des plans d'abonnement disponibles.
- `POST /api/payments/process` : Traitement du paiement (actuellement simulé côté service).

#### 6. Administration
- `GET /api/admin/stats` : Statistiques globales de la plateforme.
- `PUT /api/admin/users/{id}/block` : Blocage ou déblocage d'un compte utilisateur.

Pour la liste exhaustive des endpoints, consulter le document de référence [backend/API_ENDPOINTS.md](./backend/API_ENDPOINTS.md).

---

## Tests

### Tests Backend

- **Tests unitaires et d'intégration automatisés** : À compléter (aucun fichier de test Java n'est actuellement présent dans `backend/src/test/java`).
- **Tests manuels et scripts de validation** :
  Des scripts de vérification sont disponibles dans le dossier `backend` :
  - Procédure détaillée : [backend/MANUAL_TEST_GUIDE.md](./backend/MANUAL_TEST_GUIDE.md)
  - Script bash : `./backend/test_multiple_quizzes.sh`
  - Script PowerShell : `./backend/test_multiple_quizzes.ps1`

### Tests Frontend

Le frontend dispose des scripts d'analyse statique et de typage suivants :

```bash
cd frontend

# Vérification du typage TypeScript
npm run type-check

# Analyse statique du code (ESLint)
npm run lint
```

- **Tests unitaires et end-to-end frontend (Jest / Vitest / Playwright)** : À compléter (non configurés dans `package.json`).

---

## Structure du projet

```
Projet-d-integration/
├── backend/                                # API REST Spring Boot (Java 17)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/back/
│   │   │   │   ├── config/                # Configurations (Sécurité, CORS, WebMvc)
│   │   │   │   ├── controller/            # Contrôleurs REST (Auth, Course, Admin, etc.)
│   │   │   │   ├── dto/                   # Objets de transfert de données (Request/Response)
│   │   │   │   ├── entity/                # Entités JPA (User, Course, Module, Lesson, etc.)
│   │   │   │   ├── exception/             # Gestionnaires d'erreurs et exceptions
│   │   │   │   ├── repository/            # Interfaces Spring Data JPA
│   │   │   │   ├── security/              # Filtres JWT et providers d'authentification
│   │   │   │   └── service/               # Logique métier (Payment, Course, User, etc.)
│   │   │   └── resources/
│   │   │       ├── application.yaml       # Configuration principale de l'application
│   │   │       └── db/migration/          # Scripts de migration de structure SQL
│   │   └── test/
│   │       └── resources/                 # Configuration des tests
│   ├── API_ENDPOINTS.md                   # Documentation complète des endpoints REST
│   ├── MANUAL_TEST_GUIDE.md               # Guide d'exécution des tests manuels
│   ├── pom.xml                            # Dépendances et plugins Maven
│   ├── seed_users.sql                     # Données initiales des utilisateurs de test
│   └── seed_test_courses.sql              # Données initiales des cours et leçons
│
└── frontend/                               # Application Web Next.js (TypeScript)
    ├── src/
    │   ├── app/                           # Routes de l'App Router Next.js
    │   │   ├── (auth)/                    # Pages login et register
    │   │   ├── admin/                     # Dashboard, gestion utilisateurs, cours, rapports
    │   │   ├── professor/                 # Dashboard formateur, création/édition de cours
    │   │   ├── student/                   # Dashboard étudiant, leçons vidéo, quiz, certificats
    │   │   ├── layout.tsx                 # Layout racine
    │   │   └── page.tsx                   # Page d'accueil (Landing page)
    │   ├── components/                    # Composants React réutilisables
    │   │   ├── ui/                        # Composants d'interface (boutons, formulaires, etc.)
    │   │   ├── LandingPage.tsx            # Composant de présentation
    │   │   └── VideoPlayer.tsx            # Lecteur vidéo personnalisé
    │   ├── hooks/                         # Hooks React personnalisés (use-toast, etc.)
    │   ├── lib/
    │   │   ├── api.ts                     # Client HTTP et fonctions d'appel API
    │   │   ├── types.ts                   # Définitions des types TypeScript
    │   │   └── utils.ts                   # Utilitaires CSS et helpers
    │   └── store/
    │       └── auth.ts                    # Gestion de l'état d'authentification (Zustand)
    ├── .env.example                       # Modèle de variables d'environnement
    ├── package.json                       # Dépendances et scripts npm
    ├── tailwind.config.ts                 # Configuration de Tailwind CSS
    └── tsconfig.json                      # Configuration du compilateur TypeScript
```

---

## Technologies utilisées

### Backend
- **Langage** : Java 17
- **Framework principal** : Spring Boot 4.0.5
- **Modules Spring** :
  - Spring Boot Starter WebMVC (API REST)
  - Spring Boot Starter Data JPA (Persistance relationnelle)
  - Spring Boot Starter Security (Contrôle d'accès et sécurité)
- **Authentification & Sécurité** : JJWT (Java JWT v0.11.5)
- **Validation** : Hibernate Validator / Jakarta Validation API
- **Base de données & ORM** : MySQL (Driver `mysql-connector-j`), Hibernate ORM
- **Utilitaires** : Lombok, JavaFaker, Jackson Databind
- **Outil de build** : Apache Maven

### Frontend
- **Framework principal** : Next.js 16.1.1 (React 19)
- **Langage** : TypeScript 5
- **Styling** : Tailwind CSS 4, PostCSS
- **Composants d'interface** : Radix UI / shadcn/ui, Lucide React
- **Gestion de l'état** : Zustand
- **Requêtes & Cache** : TanStack Query (React Query v5)
- **Formulaires et Validation** : React Hook Form, Zod
- **Notifications** : Sonner

---

## Déploiement

À compléter.

Le projet ne dispose pas actuellement de conteneurisation (`Dockerfile`, `docker-compose.yml`) ni de pipeline d'intégration/déploiement continu (`.github/workflows`).

### Instructions de build pour la production

#### 1. Backend (Génération du fichier JAR)
```bash
cd backend
mvn clean package -DskipTests
# Le binaire exécutable est généré sous backend/target/back-0.0.1-SNAPSHOT.jar
java -jar target/back-0.0.1-SNAPSHOT.jar
```

#### 2. Frontend (Génération du build statique / SSR Next.js)
```bash
cd frontend
npm run build
npm start
```

---

## Contribution

Les contributions au projet s'effectuent via les étapes suivantes :

1. Créer une branche pour la fonctionnalité ou le correctif :
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```
2. Appliquer les modifications en respectant les standards de code et de typage :
   - Frontend : valider avec `npm run lint` et `npm run type-check`.
   - Backend : valider la compilation avec `mvn clean compile`.
3. Commiter les changements avec un message explicite :
   ```bash
   git commit -m "feat: ajout du support des descriptions multilingues"
   ```
4. Pousser la branche sur le dépôt distant :
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```
5. Ouvrir une *Pull Request* décrivant les changements apportés.

---

## Licence

À compléter.

Aucun fichier de licence officiel (`LICENSE` ou `LICENSE.md`) n'est présent à la racine du projet, et les descripteurs de paquets (`backend/pom.xml` et `frontend/package.json`) ne définissent aucune licence explicite (`private: true`).

---

## Auteurs / contacts

- **Auteur principal** : Haythem Fadhlaoui ([haythemfadhlaoui5@gmail.com](mailto:haythemfadhlaoui5@gmail.com))
- **Dépôt du projet** : [https://github.com/haythem9833/Projet-d-integration.git](https://github.com/haythem9833/Projet-d-integration.git)

---

## Ressources utiles

### Documentation interne
- [Documentation des Endpoints REST](./backend/API_ENDPOINTS.md)
- [Guide de test manuel](./backend/MANUAL_TEST_GUIDE.md)
- [Architecture et fonctionnalités vidéo](./frontend/VIDEO_FEATURES.md)
- [Résumé de l'architecture frontend](./frontend/PROJECT_SUMMARY.md)
- [Guide d'intégration Stripe](./backend/STRIPE_INTEGRATION_GUIDE.md)

### Liens externes
- [Documentation officielle Spring Boot](https://spring.io/projects/spring-boot)
- [Documentation officielle Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Lucide Icons](https://lucide.dev)

---

## Notes pour compléter

Les éléments suivants sont absents du code ou incertains et doivent être complétés par l'équipe de développement :

1. **Licence du projet** : Ajouter un fichier `LICENSE` (MIT, Apache 2.0, Propriétaire, etc.) et renseigner le champ `<licenses>` dans `backend/pom.xml`.
2. **Harmonisation des numéros de port** : Corriger l'incohérence entre `backend/src/main/resources/application.yaml` (port `8082`), `frontend/.env.example` (qui indique le port `8081`) et certaines documentations qui mentionnent `8080`.
3. **Schéma initial de base de données** : Le fichier `backend/lms_schema.sql` est actuellement vide (0 octet). Il est nécessaire d'y insérer le script DDL complet de création des tables (`users`, `course`, `modules`, `lessons`, `quizzes`, `payments`, etc.) afin de permettre un déploiement fiable sans dépendre de l'historique d'une base existante.
4. **Intégration Stripe effective** : Le fichier `backend/STRIPE_INTEGRATION_GUIDE.md` documente une intégration Stripe, mais le code de `backend/src/main/java/com/example/back/controller/PaymentController.java` simule le paiement sans appel au SDK Stripe (`stripe-java` n'est pas déclaré dans `backend/pom.xml`). Ajouter la dépendance Maven et implémenter la clé d'API si le paiement réel doit être activé.
5. **Couverture de tests automatisés** :
   - Écrire des tests unitaires et d'intégration JUnit / Spring Boot Test dans `backend/src/test/java`.
   - Configurer un framework de test frontend (Vitest / Jest / Playwright) et ajouter les scripts correspondants dans `frontend/package.json`.
6. **Conteneurisation et CI/CD** : Ajouter un `Dockerfile` pour le backend, un `Dockerfile` pour le frontend, un fichier `docker-compose.yml` orchestrant l'application avec MySQL, ainsi que des workflows d'intégration continue (`.github/workflows/ci.yml`).
