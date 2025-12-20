<div align="center">

  <h1>KEC Expense Tracker</h1>
  <p>A modern, responsive expense tracker dashboard built with React and powered by Firebase/Firestore for real-time data synchronization across all devices.</p>
</div>

---

## 🚀 Key Features

This application provides a robust and secure way to manage personal finances, focusing on a clean, modern user experience.

* **Firebase Authentication:** Secure user registration and login functionality.
* **Real-time Database:** Expenses are stored in **Firestore** for immediate synchronization across devices and sessions.
* **User-Specific Data:** Each user's data is isolated and secured by Firebase Security Rules, ensuring users only access their own expenses.
* **Dashboard Analytics:** A visual overview of spending, including total expenses, monthly totals, and a spending breakdown by category, displayed in a modern Bento Grid format.
* **Transaction Management:** A dedicated page for viewing, searching, filtering, adding, editing, and deleting transactions (CRUD operations).
* **Offline Support:** Works offline with Firebase caching.
* **Automatic Sample Data:** New users are automatically provided with sample expenses to get started immediately..

---

## 🛠️ Technology Stack

The Expense Tracker is built using a modern, performant frontend stack.

* **Frontend:** [React (v19.2.1)](./package.json)
* **Language:** [TypeScript (v~5.8.2)](./package.json)
* **Styling:** [Tailwind CSS (v4.1.17)](./package.json) with [PostCSS & Autoprefixer](./postcss.config.js)
* **Animations:** [Framer Motion (v12.23.26)](./package.json)
* **Charting:** [Recharts (v3.5.1)](./package.json) and custom built components.
* **Icons:** [Lucide React (v0.559.0)](./package.json)
* **Bundler:** [Vite (v6.2.0)](./package.json)

### ☁️ Backend & Data

* **Database:** [Google Firestore](./FIRESTORE_SETUP.md)
* **Authentication:** [Firebase Auth](./services/firebase.ts)
* **API:** Hybrid API implementation that attempts Firestore first, with a fallback to LocalStorage for development or if Firestore is unavailable.

---

## 🗄️ Database Structure

The `expenses` collection in Firestore uses the following schema to ensure structured, user-specific data storage:

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | The ID of the user who owns the expense. Used for security. |
| `amount` | `number` | The monetary value of the expense. |
| `category` | `string` | The spending category (e.g., Food, Transport, Utilities). |
| `note` | `string` | A brief description of the expense. |
| `date` | `Timestamp` | The date the expense occurred. |
| `createdAt` | `Timestamp` | Server timestamp for when the expense record was created. |

The core API functions interacting with this structure are:
* `getExpenses(userId)`: Fetch user's expenses.
* `addExpense(data)`: Create new expense.
* `updateExpense(id, data)`: Update existing expense.
* `deleteExpense(id)`: Delete expense.

---

## ⚙️ Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

* Node.js (LTS version recommended)
* A Firebase project is required for full functionality.

### 1. Local Run

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set the API Key:** Create a file named `.env.local` in the root directory and add your Gemini API key (as specified in your `vite.config.ts`).
    ```
    # .env.local
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
3.  **Run the app:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3002/`.

### 2. Firebase/Firestore Setup

For persistent, secure data sync, you must set up your Firebase project:

1.  **Enable Firestore in Firebase Console**:
    * Go to your [Firebase Console](https://console.firebase.google.com/) and select your project (`expense-tracker-bb74c` as per `services/firebase.ts`).
    * Click **"Firestore Database"** in the left sidebar.
    * Click **"Create database"** and choose **"Start in test mode"**.
    * Select your preferred location.

2.  **Update Security Rules**:
    * In the Firestore Console, navigate to the **"Rules"** tab.
    * Replace the default rules with the content from your `firestore.rules` file to ensure users can only access their own data:
        ```firestore
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Users can only access their own expenses
            match /expenses/{expenseId} {
              allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
              allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
            }
            
            // Deny all other access
            match /{document=**} {
              allow read, write: if false;
            }
          }
        }
        ```
    * Click **"Publish"**.

3.  **Verify Firebase Configuration:**
    The Firebase configuration is already set up in [`services/firebase.ts`](./services/firebase.ts):
    ```typescript
    const firebaseConfig = {
      apiKey: "AIzaSyCHURDfk5mr-STW83asOwVrqFGAa-wZjMA", // Placeholder API Key
      authDomain: "expense-tracker-bb74c.firebaseapp.com",
      projectId: "expense-tracker-bb74c",
      // ... other fields
    };
    ```

---

## 💻 Usage

Once the app is running:

1.  **Authentication:** You will be redirected to the modern sign-in/sign-up page (`ModernAuthPage.tsx`). Register a new user with an email and password.
2.  **Dashboard:** After logging in, you will land on the **Overview** (Dashboard) tab, which displays visual analytics and summary statistics of your expenses.
3.  **Transactions:** Switch to the **Transactions** tab to manage individual expenses, including filtering, searching, editing, and deleting. New users will see sample data automatically.
