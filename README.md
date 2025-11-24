
# 🌌 Prayush Giri - Creative Developer Portfolio

A high-performance, immersive 3D portfolio website built to showcase software engineering skills through cutting-edge web technologies. This project merges robust backend logic concepts with a visually striking, interactive frontend.

![Portfolio Preview](https://ibb.co/V83C0DT)

## 🚀 Live Demo
**[https://prayushgiri.com](https://prayushgiri.com)**

---

## ✨ Key Features

### 🎨 Immersive 3D Experience
- **Global 3D Background**: A persistent React Three Fiber scene featuring a custom-shader **Black Hole** and a starry universe that transitions seamlessly between sections.
- **Interactive Grid**: A mouse-reactive dot grid that ripples and connects like a neural network.
- **Aceternity Aesthetics**: Custom implementations of modern UI trends like "Sparkles Horizon", "Moving Borders", and "Glassmorphism".

### ⚡ Advanced Animations
- **GSAP & ScrollTrigger**: High-performance scroll-driven animations (Text Reveals, Pinning).
- **Framer Motion**: Smooth layout transitions, shared element expansions (Project Modals), and spring physics (3D Tilt Cards).
- **Lenis Scroll**: buttery smooth, inertia-based scrolling for a premium feel.
- **Text Effects**: Custom "Scramble Text" for hacker-style headers and "Text Reveal" for cinematic readability.

### 🛠️ Interactive Components
- **Holographic Project Gallery**: An infinite, auto-scrolling horizontal carousel with 3D tilt effects. Click to expand into a focused modal view.
- **3D Skills Sphere**: A revolving tag cloud of skills that responds to mouse velocity.
- **AI Assistant**: A fully integrated **Gemini AI** chatbot trained on my professional resume to answer recruiter questions in real-time.

---

## 🏗️ Tech Stack

**Core:**
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS**

**3D & Graphics:**
- **Three.js**
- **@react-three/fiber** (R3F)
- **@react-three/drei**
- **GLSL Shaders** (Custom Black Hole & Noise)

**Animation:**
- **GSAP** (GreenSock) + ScrollTrigger
- **Framer Motion**
- **Lenis** (Smooth Scroll)

**AI:**
- **Google Gemini API** (`@google/genai`)

**Deployment:**
- **Google Cloud Platform (GCP)**
- **Nginx**
- **Certbot (SSL)**

---

## 📂 Project Structure

```
/src
├── components/
│   ├── About.tsx        # 3D Rotating Skills Sphere
│   ├── AIChat.tsx       # Gemini AI Chatbot Interface
│   ├── Background.tsx   # Global R3F Scene (Black Hole, Stars)
│   ├── Contact.tsx      # Aceternity Horizon & Sparkles
│   ├── Experience.tsx   # Responsive Timeline (Mobile) / 3D Wheel (Desktop)
│   ├── Hero.tsx         # Landing View
│   ├── Loader.tsx       # Asset Loading Manager & Intro Animation
│   ├── Navbar.tsx       # Floating Navigation
│   ├── Projects.tsx     # Infinite Scroll Gallery & Modals
│   ├── ScrambleText.tsx # Glitch Text Effect Component
│   ├── Sparkles.tsx     # Particle System Component
│   └── TextReveal.tsx   # GSAP Scroll Text Reveal
├── services/
│   └── geminiService.ts # AI Logic & System Prompt
├── types.ts             # TypeScript Interfaces
├── App.tsx              # Main Layout & Scroll Sync
└── main.tsx             # Entry Point
```

---

## 🛠️ Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Prayush09/Portfolio.git
    cd Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```

4.  **Run locally:**
    ```bash
    npm run dev
    ```

---

## 🌍 Deployment Guide (GCP VM + Nginx)

This project is deployed on a raw Linux VM on Google Cloud Platform.

### 1. Build
Generate the static production build:
```bash
npm run build
```
*(This creates a `dist/` folder)*

### 2. Upload to Server
Use `gcloud` to securely transfer files (handles SSH keys automatically):
```bash
gcloud compute scp --recurse dist/* user@instance-name:~/portfolio-build --zone=us-central1-a
```

### 3. Server Configuration (Nginx)
SSH into the VM and move files to the web root:
```bash
# Move files
sudo cp -r ~/portfolio-build/* /var/www/prayushgiri.com/html/

# Set Permissions
sudo chown -R $USER:$USER /var/www/prayushgiri.com/html
sudo chmod -R 755 /var/www/prayushgiri.com
```

**Nginx Config (`/etc/nginx/sites-available/prayushgiri.com`):**
```nginx
server {
    listen 80;
    server_name prayushgiri.com www.prayushgiri.com;
    root /var/www/prayushgiri.com/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # Critical for React Router
    }
}
```

### 4. SSL (HTTPS)
Secure the site using Certbot:
```bash
sudo certbot --nginx -d prayushgiri.com -d www.prayushgiri.com
```

---

## 📜 Implementation Journey (Changelog)

This portfolio evolved through several iterations to reach its current state:

1.  **The Foundation**: Started with a clean React/Vite setup using Tailwind for styling.
2.  **The "Flow"**: Implemented a "Singular Flow" concept where sections blend into each other.
3.  **3D Integration**: Replaced static backgrounds with a live, interactive **Three.js** scene.
    *   *Challenge*: Performance & Asset Loading.
    *   *Solution*: Implemented a custom `Loader` with `useProgress` and `Suspense` to ensure 3D assets are ready before reveal.
4.  **Scroll Overhaul**:
    *   Initial attempts with standard scroll snapping felt rigid.
    *   Implemented **Lenis** for smooth inertia scrolling, synced with GSAP.
5.  **Interactive Galleries**:
    *   **Projects**: Moved from a static grid to a 3D Horizontal Infinite Scroll. Solved layout bugs by using unique IDs (`layoutId`) for Framer Motion shared transitions.
    *   **Experience**: Built a responsive system (3D Wheel for desktop, Vertical Timeline for mobile).
6.  **Aceternity Polish**:
    *   Refined the **Contact** section with the popular "Sparkles Horizon" and "Background Boxes" effects, custom-built for this project without external library dependencies.

---

## 📬 Contact

- **Email**: prayushgiri@gmail.com
- **GitHub**: [Prayush09](https://github.com/Prayush09)
- **LinkedIn**: [Prayush Giri](https://linkedin.com/in/prayush-giri)

