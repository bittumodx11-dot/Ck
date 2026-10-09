# SnapDoc Tools — Free Web Application

সম্পূর্ণ ফ্রি অনলাইন ইমেজ, ডকুমেন্ট ও পিডিএফ প্রসেসিং ওয়েব অ্যাপ্লিকেশন (React, TypeScript, Vite, Tailwind CSS)।

---

## 🚀 How to Run Locally (কম্পিউটারে চালানোর নিয়ম)

1. **প্রয়োজনীয় সফটওয়্যার:**
   - [Node.js (v18 বা তার বেশি)](https://nodejs.org/) ইনস্টল থাকতে হবে।

2. **ডিপেন্ডেন্সি ইনস্টল করুন:**
   ```bash
   npm install
   ```

3. **লোকাল সার্ভার চালু করুন:**
   ```bash
   npm run dev
   ```
   এরপর ব্রাউজারে `http://localhost:3000` খুলুন।

4. **প্রোডাকশন বিল্ড তৈরি করুন:**
   ```bash
   npm run build
   ```
   বিল্ড ফাইলগুলো `dist/` ফোল্ডারে তৈরি হবে।

---

## 🌐 Deploy to Cloudflare Pages (ফ্রি লাইভ ওয়েবসাইট)

1. আপনার কোড **GitHub**-এ পুশ করুন।
2. [Cloudflare Dashboard](https://dash.cloudflare.com) এ লগইন করুন।
3. **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git** সিলেক্ট করুন।
4. বিল্ড সেটিংস দিন:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Save and Deploy** এ ক্লিক করলেই ১ মিনিটে আপনার ওয়েবসাইট আজীবনের জন্য ফ্রি লাইভ হয়ে যাবে!
