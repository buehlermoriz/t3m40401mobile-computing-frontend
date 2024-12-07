# Calendar App

A responsive Calendar App built with Vue, Vite, and Tailwind CSS, hosted on Firebase. This application allows users to manage events with an intuitive interface.

## Features

- Event creation, editing, and deletion
- Responsive design with Tailwind CSS
- Firebase Authentication
- Real-time database updates with Firebase Firestore
- Progressive Web App (PWA) support using `vite-plugin-pwa`

## Technologies Used

- **Vue.js**: Front-end framework for building user interfaces
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase**: Hosting, Authentication, and Firestore database
- **Cypress**: End-to-end and component testing
- **GitHub Actions**: Continuous Integration and Deployment (CI/CD)

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create a .env file in the root directory and add your Firebase and API credentials:
 
    VITE_FB_API_KEY=your_firebase_api_key
    VITE_FB_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FB_DATABASE_URL=your_firebase_database_url
    VITE_FB_PROJECT_ID=your_firebase_project_id
    VITE_FB_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FB_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FB_APP_ID=your_firebase_app_id
    VITE_MIDDLEWARE_URL=your_middleware_url
    VITE_API_USERNAME=your_api_username
    VITE_API_PASSWORD=your_api_password

3. **Running the App**:

### Development

   ```bash
   npm run dev
   ```
### Production & Deployment

Deployment is handled via GitHub Actions and Firebase Hosting. On every push to the main branch, the app is automatically built and deployed to Firebase.

To deploy manually:


   ```bash
   npm run build
   firebase deploy
   ```

## Project Structure

.
├── public              # Static assets <br>
├── src<br>
│   ├── assets          # Images and styles<br>
│   ├── components      # Vue components<br>
│   ├── views           # Page views<br>
│   ├── router          # Vue Router setup<br>
│   ├── store           # Vuex store<br>
│   ├── main.ts         # Entry point<br>
│   └── App.vue         # Root component<br>
├── tests               # Cypress tests<br>
├── package.json        # NPM scripts and dependencies<br>
├── firebase.json       # Firebase configuration<br>
└── vite.config.ts      # Vite configuration<br>

## Scripts

Key NPM scripts from package.json:

npm run dev: Start the development server<br>
npm run build: Type-check and build the app for production<br>
npm run preview: Locally preview the production build<br>
npm run test:e2e: Run end-to-end tests with Cypress<br>
npm run test:unit: Run component tests with Cypress<br>

## Dependencies

Vue.js<br>
Vite<br>
Tailwind CSS<br>
Firebase<br>
Vue Router<br>
Vuex<br>
Axios<br>
VeeValidate<br>
vite-plugin-pwa<br>

## Continuous Integration and Deployment
The app uses GitHub Actions for CI/CD. The workflow is defined in firebase-hosting-merge.yml. On every push to the main branch, the following steps are performed:

Checkout the repository<br>
Install dependencies<br>
Build the app with environment variables<br>
Deploy to Firebase Hosting<br>


## License
This project is licensed under the MIT License.

## Acknowledgments
Vue.js<br>
Vite<br>
Tailwind CSS<br>
Firebase<br>