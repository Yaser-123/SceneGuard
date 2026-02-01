# SceneGuard 🎬

**AI-Powered Production Feasibility Analysis for Film Pre-Production**

SceneGuard helps film production teams evaluate scene feasibility before shooting begins. It analyzes scenes for safety risks, logistics complexity, budget pressure, and technical challenges—giving you clear, actionable insights to make better production decisions.

---

## 🚀 What You'll Need Before Starting

Before you can run this project on your computer, you'll need to install a few free tools. Don't worry—these are one-time installations!

### 1. **Node.js** (The engine that runs the app)
- **What it is:** Software that lets you run JavaScript on your computer
- **Download:** Go to [nodejs.org](https://nodejs.org)
- **Which version:** Download the **LTS** version (the green button)
- **How to install:** 
  - Windows: Double-click the downloaded file and follow the installer
  - Mac: Double-click the `.pkg` file and follow the installer
  - **Verify it worked:** Open a terminal/command prompt and type:
    ```bash
    node --version
    ```
    You should see something like `v20.11.0` (the exact number doesn't matter, as long as it's above v18)

### 2. **Git** (To download the project code)
- **What it is:** A tool that helps you download and manage code from GitHub
- **Download:** Go to [git-scm.com](https://git-scm.com)
- **How to install:** 
  - Windows: Download the installer and keep clicking "Next" (default settings are fine)
  - Mac: Git is usually already installed. If not, download from the website above
  - **Verify it worked:** Open a terminal/command prompt and type:
    ```bash
    git --version
    ```
    You should see something like `git version 2.43.0`

### 3. **A Code Editor** (To view and edit the code)
- **Recommended:** [Visual Studio Code](https://code.visualstudio.com) (it's free!)
- **Why:** It's beginner-friendly and works on Windows, Mac, and Linux
- **How to install:** Download from the website and run the installer

### 4. **API Keys** (These make the AI features work)
You'll need **free** accounts for these services:

- **Gemini API Key** (for AI analysis):
  - Go to [ai.google.dev](https://ai.google.dev)
  - Click "Get API Key" → Sign in with Google → Create a new API key
  - Copy the key (looks like: `AIzaSy...`)

- **Clerk Keys** (for user login):
  - Go to [clerk.com](https://clerk.com)
  - Sign up for free → Create a new application
  - Copy the **Publishable Key** and **Secret Key** from the dashboard

- **Weather API Key** (for weather feasibility):
  - Go to [visualcrossing.com](https://www.visualcrossing.com/weather-api)
  - Sign up for the free tier (1000 requests/day)
  - Copy your API key

- **Database** (for storing analysis history):
  - Go to [neon.tech](https://neon.tech)
  - Sign up for free → Create a new project
  - Copy the **connection string** (looks like: `postgresql://...`)

---

## 📥 Step 1: Download the Project

1. **Open your terminal/command prompt:**
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `terminal`, press Enter

2. **Navigate to where you want to save the project:**
   ```bash
   cd Desktop
   ```
   (This will save it to your Desktop. You can choose a different folder if you prefer)

3. **Download the project from GitHub:**
   ```bash
   git clone https://github.com/Yaser-123/SceneGuard.git
   ```

4. **Go into the project folder:**
   ```bash
   cd SceneGuard
   ```

---

## ⚙️ Step 2: Set Up Your API Keys

1. **Create a special file for your API keys:**
   
   In the project folder, create a new file called `.env.local`
   
   - **Easy way:** Right-click in the folder → New → Text Document → Name it `.env.local` (make sure to delete the `.txt` extension!)
   - **Or use your code editor:** Open VS Code → File → New File → Save As → `.env.local`

2. **Copy this template into the `.env.local` file:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   WEATHER_API_KEY=your_weather_api_key_here
   DATABASE_URL=your_neon_database_url_here
   ```

3. **Replace the placeholders with your actual API keys:**
   - Replace `your_clerk_publishable_key_here` with the key you copied from Clerk (starts with `pk_`)
   - Replace `your_clerk_secret_key_here` with the secret key from Clerk (starts with `sk_`)
   - Replace `your_gemini_api_key_here` with your Gemini API key (starts with `AIza`)
   - Replace `your_weather_api_key_here` with your Visual Crossing API key
   - Replace `your_neon_database_url_here` with your Neon database connection string (starts with `postgresql://`)

4. **Save the file**

---

## 📦 Step 3: Install Dependencies

"Dependencies" are like building blocks that the app needs to work. Don't worry—this is automatic!

1. **Make sure you're still in the SceneGuard folder** (you should see a message showing the folder path)

2. **Run this command:**
   ```bash
   npm install
   ```

3. **Wait for it to finish** (this might take 1-3 minutes the first time)
   - You'll see a lot of text scrolling by—this is normal!
   - When it's done, you'll see your folder path again

---

## ▶️ Step 4: Run the Project

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **You'll see a message like:**
   ```
   ✓ Ready in 2.5s
   ○ Local: http://localhost:3000
   ```

3. **Open your web browser and go to:**
   ```
   http://localhost:3000
   ```

4. **You should see SceneGuard running!** 🎉

---

## 🛑 How to Stop the App

When you're done testing:

1. **Go back to your terminal/command prompt**
2. **Press `Ctrl + C`** (Windows/Mac/Linux)
3. **Type `Y` if it asks "Terminate batch job?"**

---

## 🔧 Common Issues & Solutions

### "Command not found: npm"
**Problem:** Node.js isn't installed or not in your system path  
**Solution:** 
- Restart your terminal/command prompt after installing Node.js
- If that doesn't work, reinstall Node.js from [nodejs.org](https://nodejs.org)

### "Port 3000 is already in use"
**Problem:** Another app is using port 3000  
**Solution:** 
- Stop the other app, or
- Change the port by editing `package.json`: find `"dev": "next dev"` and change it to `"dev": "next dev -p 3001"`

### "Module not found" errors
**Problem:** Dependencies didn't install correctly  
**Solution:** 
```bash
rm -rf node_modules
npm install
```
(On Windows, manually delete the `node_modules` folder, then run `npm install`)

### "Invalid API key" when using the app
**Problem:** Your `.env.local` file has incorrect API keys  
**Solution:** 
- Double-check that you copied the full API keys (no extra spaces)
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
- Restart the app after changing the `.env.local` file

### "Database connection failed"
**Problem:** Your Neon database URL is incorrect or the database is sleeping  
**Solution:** 
- Check that you copied the full connection string from Neon
- Go to your Neon dashboard and make sure the project is active (free tier databases sleep after inactivity)

---

## 📚 Project Structure

Here's what's in the project (you don't need to understand this to run it, but it's helpful to know):

```
SceneGuard/
├── app/                    # Main application pages
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Analysis dashboard
│   └── api/               # Backend API routes
├── components/            # Reusable UI components
├── lib/                   # Analysis logic (risk, cost, weather)
├── public/                # Images and static files
├── .env.local            # Your API keys (YOU CREATE THIS)
├── package.json          # Project dependencies
└── README.md             # This file!
```

---

## 🚀 Deploying to Vercel (Make it Live!)

Want to share your app with others? Deploy it for free on Vercel:

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push
   ```

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "Import Project"** → Select your GitHub repository

4. **Add your environment variables:**
   - Go to project Settings → Environment Variables
   - Add each variable from your `.env.local` file

5. **Click Deploy** → Your app will be live in ~2 minutes!

---

## 🤝 Contributing

Found a bug? Have a feature idea? Contributions are welcome!

1. **Fork the repository** (click "Fork" on GitHub)
2. **Create a new branch:**
   ```bash
   git checkout -b my-feature
   ```
3. **Make your changes**
4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add my feature"
   git push origin my-feature
   ```
5. **Open a Pull Request** on GitHub

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Need Help?

- **GitHub Issues:** [Report a bug or ask a question](https://github.com/Yaser-123/SceneGuard/issues)
- **Documentation:** See `HACKATHON_DOCUMENTATION.md` for technical details

---

## 🙏 Acknowledgments

Built with:
- [Next.js 16](https://nextjs.org) - React framework
- [Gemini AI](https://ai.google.dev) - Scene analysis
- [Clerk](https://clerk.com) - User authentication
- [Neon](https://neon.tech) - Serverless Postgres database
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

**Made with ❤️ for film production teams everywhere**
