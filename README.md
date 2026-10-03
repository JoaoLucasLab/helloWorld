# ApplyFlow | Future Job Tracker

This project is designed for people who are actively searching for jobs. It helps users track job applications, organize company details, and manage the status of each opportunity in one place.

Each user signs in to their own account, and their applications are saved in Firebase Firestore, so they stay available after a refresh and on any device.

## Features

* Create an account with email and password or sign in with Google, plus a "Forgot password?" reset flow
* Add, edit, and delete job applications (company, status, job link, date, and description)
* Sort the applications table by company, status, or application date
* Color-coded statuses: Interested, Applied, Interview, Offer, and Rejected
* Dashboard with totals per status and an "Applications by status" chart
* Greeting that changes with the time of day (morning, afternoon, or evening)
* Profile page with your name, email, sign-in method, and an editable profile photo
* Sidebar shortcuts to your LinkedIn, GitHub, Portfolio, LeetCode, or any other website
* Security rules so each user can only see and change their own data

## Instructions for Build and Use

Steps to build and/or run the software:

1. Open a terminal in the project folder and install dependencies: `npm install`
2. Create a project in the [Firebase console](https://console.firebase.google.com) and set it up:
   * **Authentication → Sign-in method:** enable **Email/Password** and **Google**
   * **Firestore Database:** create a database
   * **Firestore Database → Rules:** paste the contents of `firestore.rules` and click **Publish**
3. Register a web app under **Project settings → General → Your apps**, then copy `.env.example` to `.env.local` and fill in the values from its `firebaseConfig`
4. Start the development server: `npm run dev`
5. Open the local URL shown in the terminal (usually http://localhost:3000) to use the app
6. To create a production build, run: `npm run build`
7. To run the production version locally, use: `npm run start`

Instructions for using the software:

1. Create an account (or continue with Google) on the sign-up page
2. On the dashboard, use **Add an application** to save a company where you want to work, with the job link, date, description, and status
3. As the process moves forward, click **Edit** on the application to update its status (for example, from Applied to Interview)
4. Click a column header (Company, Status, or Applied) to sort the table
5. Use **Add section** in the sidebar to save shortcuts to your LinkedIn, GitHub, Portfolio, LeetCode, or another website
6. Open **Profile** to see your account details and change your profile photo

## Project Structure

* `app/` – pages: dashboard (`/`), `/profile`, `/login`, `/signup`, and `/forgot-password`
* `components/` – UI pieces such as the application form, table, chart, sidebar shortcuts, and popups
* `hooks/` and `context/` – React state, such as the signed-in user and the list of applications
* `services/` – the only code that reads and writes Firestore
* `lib/` – Firebase setup and small helper functions
* `types/` – TypeScript types for applications and shortcuts
* `firestore.rules` – Firestore security rules (paste them into the Firebase console)

All of a user's data is stored under their account in Firestore:

```
users/{uid}                     profile (name, email, photo)
users/{uid}/applications/{id}   job applications
users/{uid}/shortcuts/{id}      sidebar shortcuts
```

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* Node.js 20 or newer
* Next.js 16.3.5
* React 19.2.8
* React DOM 19.2.8
* Firebase JavaScript SDK 12 (Authentication and Cloud Firestore)
* TypeScript 5
* Tailwind CSS 4
* A Firebase project (the free Spark plan is enough)

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [NextJS](https://nextjs.org)
* [React](https://react.dev)
* [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
* [Cloud Firestore](https://firebase.google.com/docs/firestore)
* [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [x] Create additional pages for the dashboard, and the other one to add the jobs
* [x] Connect the app to a database to store job entries persistently
* [x] Improve the overall layout and user experience with a cleaner design
* [x] Test the app for usability and functionality before release
