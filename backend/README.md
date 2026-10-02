# ChâTop Backend

API REST du portail de locations ChâTop, construite avec NestJS, Prisma et MySQL.

## Prerequis

- Node.js 22 LTS ou superieur
- npm
- MySQL 8+
- La base `chatop_db` creee avec `ressources/sql/schema.sql`

## Installation

Depuis le dossier `backend` :

```powershell
npm install
```

Creer ou completer le fichier `.env` :

```env
DATABASE_URL="mysql://root:MOT_DE_PASSE@localhost:3306/chatop_db"
JWT_SECRET="une-cle-secrete-longue-et-privee"
API_URL="http://localhost:3001"
```

Les secrets ne doivent jamais etre commites ou partages.

Prisma est configure pour MySQL. Pour synchroniser le schema Prisma avec une base existante :

```powershell
npx prisma db pull
npx prisma generate
```

## Lancer le backend

```powershell
npm run start:dev
```

L'API est disponible sur `http://localhost:3001`.

La documentation Swagger est disponible sur `http://localhost:3001/docs`.

## Routes

Les routes `register` et `login` sont publiques. Les autres routes necessitent un token JWT :

```http
Authorization: Bearer <token>
```

### Authentification

| Methode | Route                | Description                      |
| ------- | -------------------- | -------------------------------- |
| POST    | `/api/auth/register` | Creer un utilisateur             |
| POST    | `/api/auth/login`    | Se connecter et obtenir un token |
| GET     | `/api/auth/me`       | Obtenir l'utilisateur du token   |

### Locations

| Methode | Route              | Description                                    |
| ------- | ------------------ | ---------------------------------------------- |
| GET     | `/api/rentals`     | Lister les locations avec leur proprietaire    |
| GET     | `/api/rentals/:id` | Obtenir une location                           |
| POST    | `/api/rentals`     | Creer une location avec une image              |
| PUT     | `/api/rentals/:id` | Modifier une location dont on est proprietaire |

Les routes de creation et de modification utilisent `multipart/form-data` avec les champs `name`, `surface`, `price`, `description` et `picture`.

### Utilisateurs et messages

| Methode | Route           | Description                                         |
| ------- | --------------- | --------------------------------------------------- |
| GET     | `/api/user/:id` | Obtenir les informations publiques d'un utilisateur |
| POST    | `/api/messages` | Envoyer un message pour une location                |

## Architecture

```text
src/
├── auth/       # DTO, JWT, Passport, register, login et me
├── messages/   # DTO, controller et service des messages
├── prisma/     # connexion Prisma/MySQL
├── rentals/    # DTO, upload, locations et proprietaires
└── users/      # lecture des informations publiques utilisateur
```

Flux d'une requete :

```text
Controller -> Service -> PrismaService -> MySQL
```

Les DTO valident les entrees. Les mots de passe sont hashes avec Bcrypt et ne sont jamais renvoyes par l'API. Les erreurs principales sont `400`, `401`, `403` et `404`.

## Verification

```powershell
npm run build
npm run test
npm run test:e2e
```

Pour verifier les donnees dans MySQL Workbench :

```sql
USE chatop_db;
SELECT * FROM users;
SELECT * FROM rentals;
SELECT * FROM messages;
```
