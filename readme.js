/*
npm init -y
npm install react react-dom @google/genai
npm install --save-dev typescript vite @vitejs/plugin-react @types/react @types/react-dom


Create the following three files in the root of your plant-identifier-app folder.
1. vite.config.ts (for Vite configuration)
code
TypeScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

2. tsconfig.json (for TypeScript configuration)
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

3. .gitignore (to keep your API key secret)
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*



Step 5: Add Your API Key (Very Important!)
Create one last file in the root of your project named .env.
Go to Google AI Studio to get your API key.
Add the following line to your .env file, replacing YOUR_API_KEY_HERE with the key you just copied.
code
Code
VITE_API_KEY=YOUR_API_KEY_HERE



Step 6: Run The App!
Open your package.json file and add the "scripts" section like so:
code
JSON
{
  "name": "plant-identifier-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google/genai": "^1.28.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.3.3"
  }
}





Now, in your VS Code terminal, run the final command:
code
Bash
npm run dev


Vite will start the server. You will see a message like Local: http://localhost:5173/.
Hold down Ctrl (or Cmd on Mac) and click the link in the terminal. Your Plant Identifier AI app will open in your browser, fully working
*/