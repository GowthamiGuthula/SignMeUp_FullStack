# SignMeUp

SignMeUp is a full-stack event management platform where organizers can create and manage events — workshops, meetups, competitions, socials, and more — while attendees browse upcoming events and RSVP in just a few clicks. Organizers get a personalized dashboard to track their events and see who's coming, while a simple, no-login RSVP flow keeps the barrier to entry low for guests. Under the hood, a React single-page app talks to a Java/Spring Boot REST API backed by MySQL, with event cover photos either uploaded directly or automatically pulled from Unsplash based on the event's category and name.

## Technologies Used

**Frontend**
- React 19 (functional components + hooks)
- React Router 7
- Vite 8 (dev server & build tooling)
- ESLint
- Plain CSS (per-component stylesheets, Flexbox/Grid layouts, responsive breakpoints)

**Backend**
- Java 21
- Spring Boot 3.5 (Spring Web, Spring Data JPA, Spring Security, Spring Validation)
- Hibernate / JPA (ORM)
- MySQL 8
- Maven

**Integrations**
- [Unsplash API](https://unsplash.com/developers) — automatic cover photos for events that don't have an uploaded image

## Installation

### Prerequisites
- [Java 21 JDK](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (or use the included `mvnw` wrapper)
- [Node.js](https://nodejs.org/) 18+ and npm
- [MySQL](https://dev.mysql.com/downloads/) 8+, running locally

### 1. Clone the repo
```bash
git clone <repo-url>
cd SignMeUp_FullStack
```

### 2. Set up the database
Create the `signmeup` database. You can either let Hibernate create the schema automatically (see step 3), or run the provided script to create the schema **and** seed it with sample data:
```bash
mysql -u root -p < database/init.sql
```
By default the backend expects a MySQL user `root` with password `root` on `localhost:3306`. Update `java-spring-boot-back-end-app/src/main/resources/application.properties` if your local setup differs.

### 3. Run the backend
```bash
cd java-spring-boot-back-end-app
mvn spring-boot:run
```
The API starts on `http://localhost:8080`. `spring.jpa.hibernate.ddl-auto=update` means the schema will also be created/updated automatically on startup if you skipped step 2's script.

Optional: to enable live Unsplash search results (instead of the built-in fallback photos), get a free access key from [unsplash.com/developers](https://unsplash.com/developers) and set it before starting the backend:
```bash
export UNSPLASH_ACCESS_KEY=your-key-here   # macOS/Linux
$env:UNSPLASH_ACCESS_KEY="your-key-here"   # Windows PowerShell
```

### 4. Run the frontend
In a separate terminal:
```bash
cd react-front-end-app
npm install
npm run dev
```
The app starts on `http://localhost:5173` and proxies `/api` requests to the backend on port 8080.

### 5. Open the app
Visit `http://localhost:5173` in your browser, register an account, and start creating events.

## Wireframes

Wireframes for the app's key screens (home, events list, event detail, add/edit event, auth) are available here:
[Figma board — SignMeUp wireframes](https://www.figma.com/board/aWwKIo3rEqmdwCLi4e8Mzw/SingMeUp?node-id=0-1&t=PxtWt6Jo3sdg3Xgp-1)

## ER Diagram

[View the ER diagram](https://drive.google.com/file/d/1c4u7T2cQtoehBBCEgVmdXSwZUIhq7ZHQ/view?usp=drive_link)

The schema covers `users`, `roles` (many-to-many via `user_roles`), `events`, `rsvps`, `event_invitations`, `guest_access_tokens`, and `contact_messages`. See [`database/init.sql`](database/init.sql) for the full table definitions and sample seed data.

## Unsolved Problems & Future Features
- **Private events & invitations are modeled but not wired up.** The `Event.visibility` field and `event_invitations` table support invite-only events, and the repository layer already has queries for "events visible to a given user," but the current `EventController`/`EventService` don't yet apply that filtering — `GET /api/events` returns every event regardless of visibility.
- **Guest access tokens are unused.** The `guest_access_tokens` table was designed to let a non-account-holder manage their own RSVP via a emailed link/token, but no endpoint issues or validates these tokens yet.
- **No automated test coverage.** The backend has only the default Spring Boot context-load test, and there are no frontend unit/integration tests yet. Testing so far has been manual, in the browser.
- **No email notifications.** RSVP confirmations, event reminders, and invitation emails are not sent — everything happens synchronously in the UI.
- **No pagination or filtering beyond a basic text search** on the events list, which could become slow with a large number of events.
- **Uploaded images aren't cropped/resized client-side**, so very large photos are uploaded as-is (capped at 5MB) rather than optimized before upload.
