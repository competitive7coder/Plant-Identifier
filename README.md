# Plant Identifier AI

This is a web application that uses Google's Gemini AI to identify plants from user-uploaded photos. It's built with React, TypeScript, and Vite.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup and Installation

Follow these steps to get your development environment set up.

### Step 1: Clone or Download the Project

First, get the project files onto your local machine.

### Step 2: Install Dependencies

Open your terminal in the project's root directory and run the following command to install all the necessary packages:

```bash
npm install
```

### Step 3: Add Your Gemini API Key

You need to provide your own Google Gemini API key to run this application.

1.  If you don't have one, get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root directory of the project, create a new file named `.env`.
3.  Add the following line to the `.env` file, replacing `YOUR_API_KEY_HERE` with your actual key:

    ```
    VITE_API_KEY=YOUR_API_KEY_HERE
    ```

    _Note: The `.env` file is listed in `.gitignore`, so your key will not be accidentally committed to source control._

## Running the Application

Once the setup is complete, you can run the application locally.

1.  In your terminal, run the development server:

    ```bash
    npm run dev
    ```

2.  Vite will start the server and print a local URL to the console, usually `http://localhost:5173/`.

3.  Open this URL in your web browser to see the application running.

## Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run preview`: Serves the production build locally to preview it.
