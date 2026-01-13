# 🌿 BreathNew - AI Quit Smoking Companion

**BreathNew** is a modern, scientifically-informed web application designed to help users quit smoking. Powered by **Google Gemini API**, it features an intelligent AI coach, real-time health recovery tracking, financial savings calculations, and interactive craving management tools.

![BreathNew Preview](https://placehold.co/1200x600/10b981/ffffff?text=BreathNew+App+Preview)

## ✨ Features

*   **🤖 AI Coach (Gemini Powered):**
    *   **Chat:** A supportive conversational agent that offers advice, distractions, and motivation.
    *   **Audio Tips:** Generates spoken motivational tips using Gemini TTS (Text-to-Speech) to help users ride out cravings.
    *   **Context Aware:** The AI knows your name, quit date, and savings to provide personalized encouragement.
*   **📊 Smart Dashboard:**
    *   Real-time tracking of days, hours, and minutes smoke-free.
    *   Calculates money saved and cigarettes avoided.
    *   Estimates life regained based on health data.
*   **❤️ Health Timeline:**
    *   Visualizes body recovery milestones (e.g., Blood Pressure normalization, Nicotine clearing).
    *   Progress bars show how close you are to the next health achievement.
*   **🧘 Craving Timer:**
    *   A dedicated 5-minute timer with breathing exercises to help users survive sudden urges (based on the "surfing the urge" technique).
    *   Manage custom coping tips.
*   **🏆 Achievements System:** Unlock badges for milestones like "First 24 Hours", "Wealth Builder", and "Craving Crusher".
*   **🌐 Multi-language Support:** Fully localized for **English** and **Chinese (Simplified)**.
*   **💎 Freemium Model:** Integration ready for Stripe payment links to unlock Pro features (Unlimited chat, full health timeline).

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **Models Used:** 
    *   `gemini-3-flash-preview` (Chat & Logic)
    *   `gemini-2.5-flash-preview-tts` (Text-to-Speech)
*   **Persistence:** LocalStorage (No backend required for MVP)

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or higher)
2.  **Google Gemini API Key** (Get one for free at [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/breathnew.git
    cd breathnew
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and visit `http://localhost:5173`.

## 💰 Monetization Setup (Optional)

This app supports a "Pro" tier using **Stripe Payment Links** (No backend code required).

1.  Go to [Stripe Dashboard](https://dashboard.stripe.com/) -> **Product Catalog**.
2.  Create two products: "Monthly Subscription" and "Yearly Subscription".
3.  Create a **Payment Link** for each.
4.  **Crucial Step:** In the Payment Link settings, set the "After payment" redirect URL to:
    *   `https://your-deployed-domain.com/?payment_success=true`
5.  Update `constants.ts` in the project:
    ```typescript
    export const PAYMENT_CONFIG = {
      monthlyUrl: "https://buy.stripe.com/your_monthly_link_id",
      yearlyUrl: "https://buy.stripe.com/your_yearly_link_id",
    };
    ```

## 📦 Deployment

This project is optimized for deployment on **Vercel** or **Netlify**.

1.  Push your code to GitHub.
2.  Import the repository into Vercel.
3.  **Important:** Add your `API_KEY` in the Vercel Project Settings > Environment Variables.
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.