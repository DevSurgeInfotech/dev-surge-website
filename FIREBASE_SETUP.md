# Setting Up Your Real Student Portal (Firebase)

Ready to make your Student Portal fully functional? Follow these exact steps to connect it to Google's Firebase backend. This is free and powerful.

### Step 1: Create a Firebase Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  Click **"Add project"**.
3.  Name it: `DevSurgePortal` (or similar).
4.  Disable Google Analytics for now (keeps it simpler).
5.  Click **"Create project"**.

### Step 2: Register Your Web App
1.  Once inside your project dashboard, click the **Web icon** (`</>`) in the center to add an app.
2.  App nickname: `DevSurgeWeb`.
3.  Click **"Register app"**.
4.  **Copy the `firebaseConfig` object** shown in the code block. It looks like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "devsurgeportal.firebaseapp.com",
      projectId: "devsurgeportal",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    };
    ```

### Step 3: Enable Authentication
1.  In the left sidebar, click **Build > Authentication**.
2.  Click **"Get started"**.
3.  Select **"Email/Password"** from the Sign-in method list.
4.  Toggle **Enable** to ON.
5.  Click **Save**.

### Step 4: Paste Your Keys
1.  Open the file `e:\ANTIGRAVITY\NewApp\firebase-config.js` in your editor.
2.  Replace the placeholder values with the keys you copied in Step 2.
3.  Save the file.

### Step 5: Test It!
1.  Open your website.
2.  Go to the **PORTAL** tab.
3.  Click **"New here? Create an account"**.
4.  Enter your Name, Email, and Password.
5.  Click **"Create Account"**.
6.  You should be logged in instantly!
7.  Check your Firebase Console > Authentication > Users tab to see your new user record!

### Troubleshooting
*   **Issues with CORS?** If running locally, simply opening the file in Chrome might block Firebase. Use a local server (e.g., via VS Code Live Server extension).
*   **Permissions?** Ensure you enabled Email/Password sign-in in the Firebase console.
