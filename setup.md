# StudyFlow AI Deployment Guide (Vercel & Render)

এই নির্দেশিকায় StudyFlow AI অ্যাপ্লিকেশনের Frontend (Vercel-এ) এবং Backend (Render-এ) কীভাবে সম্পূর্ণভাবে ডিপ্লয় করবেন তা ধাপে ধাপে আলোচনা করা হয়েছে।

---

## সূচিপত্র (Table of Contents)
1. [প্রয়োজনীয় প্রস্তুতি (Prerequisites)](#১-প্রয়োজনীয়-প্রস্তুতি-prerequisites)
2. [ব্যাকএন্ড প্রস্তুতি ও কোড পরিবর্তন (Backend Setup & Code Changes)](#২-ব্যাকএন্ড-প্রস্তুতি-ও-কোড-পরিবর্তন-backend-setup--code-changes)
3. [রেন্ডার-এ ব্যাকএন্ড ডিপ্লয়মেন্ট (Backend Deployment on Render)](#৩-রেন্ডার-এ-ব্যাকএন্ড-ডিপ্লয়মেন্ট-backend-deployment-on-render)
4. [ফ্রন্টএন্ড প্রস্তুতি ও কোড পরিবর্তন (Frontend Setup & Code Changes)](#৪-ফ্রন্টএন্ড-প্রস্তুতি-ও-কোড-পরিবর্তন-frontend-setup--code-changes)
5. [ভার্সেল-এ ফ্রন্টএন্ড ডিপ্লয়মেন্ট (Frontend Deployment on Vercel)](#৫-ভার্সেল-এ-ফ্রন্টএন্ড-ডিপ্লয়মেন্ট-frontend-deployment-on-vercel)
6. [সাধারণ সমস্যা ও সমাধান (Troubleshooting)](#৬-সাধারণ-সমস্যা-ও-সমাধান-troubleshooting)

---

## ১. প্রয়োজনীয় প্রস্তুতি (Prerequisites)
ডিপ্লয়মেন্ট শুরু করার আগে আপনার নিম্নলিখিত জিনিসগুলো প্রস্তুত থাকতে হবে:
- একটি সচল **GitHub Repository** যেখানে আপনার প্রোজেক্টের কোড পুশ করা আছে।
- **MongoDB Atlas** ডাটাবেস ক্লাস্টার এবং এর সংযোগের জন্য Connection URI।
- **Gemini API Key** (AI চ্যাট ও ফিচারের জন্য)।
- **Render** এবং **Vercel**-এ অ্যাকাউন্ট।

---

## ২. ব্যাকএন্ড প্রস্তুতি ও কোড পরিবর্তন (Backend Setup & Code Changes)

রেন্ডার (Render) বা অন্য যেকোনো প্রোডাকশন সার্ভারে ব্যাকএন্ড রান করার আগে আমাদের কোডে ছোট কিছু পরিবর্তন করতে হবে।

### ক. `backend/package.json` আপডেট করা
বর্তমানে ব্যাকএন্ডের `start` স্ক্রিপ্টে `--env-file=.env` ফ্ল্যাগ ব্যবহার করা হয়েছে:
`"start": "node --env-file=.env server.js"`

**সমস্যা:** রেন্ডার-এ সরাসরি এনভায়রনমেন্ট ভেরিয়েবল ইনজেক্ট করা হয়। সেখানে কোনো শারীরিক `.env` ফাইল না থাকায় এই কমান্ডটি ত্রুটি (Error) দেখাবে এবং ডিপ্লয়মেন্ট ব্যর্থ হবে।

**সমাধান:** `backend/package.json` ফাইলের স্ক্রিপ্টগুলো নিচের মতো করে পরিবর্তন করুন:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --env-file=.env --watch server.js"
}
```
*ব্যাখ্যা: লোকাল ডেভেলপমেন্টের সময় `npm run dev` ব্যবহার করলে এটি `.env` ফাইল লোড করবে, কিন্তু প্রোডাকশনে `npm start` রান করলে সরাসরি রেন্ডারের এনভায়রনমেন্ট ভেরিয়েবল থেকে ডেটা নেওয়া হবে।*

### খ. `backend/server.js` এ CORS কনফিগারেশন আপডেট করা
বর্তমানে ব্যাকএন্ডের CORS পলিসিতে শুধুমাত্র লোকালহোস্টের অরিজিনগুলো অনুমতি দেওয়া আছে। ফ্রন্টএন্ড থেকে রিকোয়েস্ট সফলভাবে রিসিভ করার জন্য আমাদের এটিকে ডাইনামিক করতে হবে।

`backend/server.js` ফাইলে CORS ব্লকে নিচের কোডটি ব্যবহার করুন:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL, // এটি প্রোডাকশনে আপনার Vercel ফ্রন্টএন্ড ইউআরএল গ্রহণ করবে
    ].filter(Boolean),
    credentials: true,
  })
);
```

---

## ৩. রেন্ডার-এ ব্যাকএন্ড ডিপ্লয়মেন্ট (Backend Deployment on Render)

1. **Render Dashboard**-এ লগইন করুন (dashboard.render.com)।
2. **New +** বাটনে ক্লিক করে **Web Service** সিলেক্ট করুন।
3. আপনার GitHub অ্যাকাউন্টটি কানেক্ট করে StudyFlow AI রিপোজিটরিটি সিলেক্ট করুন।
4. কনফিগারেশন পেজে নিচের সেটিংসগুলো প্রদান করুন:
   - **Name**: `studyflow-ai-backend` (বা আপনার সুবিধামতো নাম)
   - **Runtime**: `Node`
   - **Region**: আপনার সবচেয়ে কাছের কোনো রিজিওন সিলেক্ট করুন (যেমন: Singapore বা Oregon)।
   - **Branch**: আপনার মেইন ব্রাঞ্চ (যেমন: `main` বা `master`)।
   - **Root Directory**: `backend` (খুবই গুরুত্বপূর্ণ! যেহেতু প্রোজেক্টে মনোরেপো স্ট্রাকচার রয়েছে)।
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Environment Variables (এনভায়রনমেন্ট ভেরিয়েবল)** সেকশনে ক্লিক করে নিচের কী এবং মানগুলো যুক্ত করুন:
   - `MONGO_URI`: আপনার MongoDB Atlas connection string।
   - `JWT_SECRET`: একটি দীর্ঘ এবং সুরক্ষিত র্যান্ডম টেক্সট।
   - `JWT_ACCESS_SECRET`: আরেকটি দীর্ঘ এবং সুরক্ষিত র্যান্ডম টেক্সট।
   - `JWT_REFRESH_SECRET`: রিফ্রেশ টোকেনের জন্য আরেকটি দীর্ঘ এবং সুরক্ষিত র্যান্ডম টেক্সট।
   - `GEMINI_API_KEY`: আপনার গুগল জেমিনি এপিআই কি।
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Render স্বয়ংক্রিয়ভাবে এই পোর্টটি ম্যাপ করে নেবে)
   - `FRONTEND_URL`: আপনার Vercel অ্যাপ্লিকেশনের লাইভ URL (এটি আপনি Vercel-এ ডিপ্লয় করার পর আপডেট করে নিতে পারবেন)।

6. সর্বশেষে নিচের **Deploy Web Service** বাটনে ক্লিক করুন। আপনার ব্যাকএন্ডের বিল্ড প্রসেস শুরু হবে এবং লাইভ হয়ে গেলে আপনি একটি ইউআরএল পাবেন (যেমন: `https://studyflow-ai-backend.onrender.com`)।

---

## ৪. ফ্রন্টএন্ড প্রস্তুতি ও কোড পরিবর্তন (Frontend Setup & Code Changes)

ভার্সেল-এ (Vercel) ফ্রন্টএন্ড ডিপ্লয় করার জন্য এপিআই সার্ভার ইউআরএল ডাইনামিক করা এবং সিঙ্গেল পেজ অ্যাপ্লিকেশন (SPA) রাউটিং সমস্যার সমাধান করতে হবে।

### ক. `frontend/src/api/axios.js` আপডেট করা
বর্তমানে বেস ইউআরএল লোকালহোস্টে হার্ডকোড করা আছে:
`baseURL: "http://localhost:5000/api/v1"`

প্রোডাকশন এবং লোকাল উভয় এনভায়রনমেন্টে নির্বিঘ্নে কাজ করার জন্য এটিকে নিচের কোড দিয়ে পরিবর্তন করুন:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: { "Content-Type": "application/json" },
});
```

### খ. `vercel.json` কনফিগারেশন তৈরি করা
রিয়্যাক্ট রাউটার (React Router) বা ক্লায়েন্ট সাইড রাউটিং অ্যাপগুলো যখন Vercel-এ রিফ্রেশ করা হয়, তখন অনেক সময় **404 Not Found** এরর দেখায়। এটি সমাধান করার জন্য `frontend/` ডিরেক্টরির ভেতরে একটি নতুন ফাইল তৈরি করতে হবে।

`frontend/vercel.json` নামে একটি ফাইল তৈরি করুন এবং নিচের কোডটি লিখুন:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## ৫. ভার্সেল-এ ফ্রন্টএন্ড ডিপ্লয়মেন্ট (Frontend Deployment on Vercel)

1. **Vercel Dashboard**-এ যান (vercel.com)।
2. **Add New** বাটনে ক্লিক করে **Project** সিলেক্ট করুন।
3. আপনার StudyFlow AI এর GitHub রিপোজিটরিটি ইম্পোর্ট (Import) করুন।
4. কনফিগারেশন পেজে নিচের সেটিংগুলো সেট করুন:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (ডান পাশের 'Edit' বাটনে ক্লিক করে `frontend` ফোল্ডারটি সিলেক্ট করুন এবং 'Continue' দিন)।
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** সেকশনটি প্রসারিত করে নিচের ভেরিয়েবলটি যুক্ত করুন:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api/v1` (এখানে আপনার রেন্ডার ব্যাকএন্ডের আসল লাইভ ইউআরএলটি দিন)

6. এবার **Deploy** বাটনে ক্লিক করুন। কিছুক্ষণ পর আপনার ফ্রন্টএন্ড সাকসেসফুলি ডিপ্লয় হয়ে যাবে এবং আপনি একটি ডোমেইন ইউআরএল পাবেন (যেমন: `https://studyflow-ai.vercel.app`)।

### গুরুত্বপূর্ণ পরবর্তী ধাপ:
আপনার ফ্রন্টএন্ড লাইভ ইউআরএলটি কপি করুন। তারপর **Render Dashboard**-এ গিয়ে আপনার ব্যাকএন্ড সার্ভারের এনভায়রনমেন্ট ভেরিয়েবল সেকশনে যান। সেখানে `FRONTEND_URL` এর মান হিসেবে এই Vercel ইউআরএলটি (যেমন: `https://studyflow-ai.vercel.app`) বসিয়ে সেভ করুন এবং ব্যাকএন্ডটি পুনরায় রিডিপ্লয় (Redeploy) করুন। এর ফলে CORS-এর কোনো সমস্যা থাকবে না।

---

## ৬. সাধারণ সমস্যা ও সমাধান (Troubleshooting)

### সমস্যা ১: MongoDB Connection Error
- **কারণ:** MongoDB Atlas-এ আইপি অ্যাক্সেস লিস্ট করা না থাকলে সার্ভার কানেক্ট হতে পারে না।
- **সমাধান:** MongoDB Atlas ড্যাশবোর্ডে যান -> **Network Access** সিলেক্ট করুন -> **Add IP Address**-এ ক্লিক করে `0.0.0.0/0` (Allow access from anywhere) অ্যাড করুন এবং কনফার্ম করুন।

### সমস্যা ২: প্রথমবার পেজ লোড হতে অনেক সময় নেওয়া (Cold Start)
- **কারণ:** Render-এর ফ্রি টায়ার (Free Tier) ব্যবহারের কারণে যদি ১৫ মিনিট কোনো রিকোয়েস্ট না আসে, তবে সার্ভারটি স্লিপিং মোডে চলে যায়। পরবর্তী যেকোনো রিকোয়েস্টে সার্ভার আবার সচল হতে ৫০-৬০ সেকেন্ড সময় নিতে পারে।
- **সমাধান:** এটি ফ্রি টায়ারের একটি স্বাভাবিক বৈশিষ্ট্য। প্রোডাকশনে নিরবচ্ছিন্ন সার্ভিসের জন্য Render-এর পেইড টায়ারে আপগ্রেড করতে পারেন, অথবা Cron Job ব্যবহার করে প্রতি ১০ মিনিটে একবার সার্ভারের `/health` এন্ডপয়েন্টে পিং করতে পারেন।

### সমস্যা ৩: Axios-এ নেটওয়ার্ক এরর বা CORS Blocked
- **কারণ:** ব্যাকএন্ডের `FRONTEND_URL` বানানে ভুল অথবা ব্রাউজারের ক্যাশ সমস্যা।
- **সমাধান:** নিশ্চিত হোন যে Render-এ যুক্ত করা `FRONTEND_URL`-এর শেষে কোনো অতিরিক্ত স্ল্যাশ `/` নেই (যেমন: `https://studyflow-ai.vercel.app` হবে, `https://studyflow-ai.vercel.app/` নয়)।

### সমস্যা ৪: `npm error enoent Could not read package.json` (Build Failed)
- **কারণ:** Render-এ ডিপ্লয় করার সময় ডিফল্ট **Root Directory** কনফিগারেশন সেট করা না থাকলে, Render রিপোজিটরির একদম রুট ফোল্ডারে `package.json` ফাইল খোঁজার চেষ্টা করে। কিন্তু এটি একটি Monorepo স্ট্রাকচার হওয়ায় ব্যাকএন্ডের `package.json` ফাইলটি `backend` ফোল্ডারের ভেতরে অবস্থিত।
- **সমাধান:**
  1. Render Dashboard-এ প্রবেশ করুন এবং আপনার Web Service-টি সিলেক্ট করুন।
  2. বাম পাশের সাইডবার থেকে **Settings** অপশনে যান।
  3. স্ক্রোল করে **Root Directory** ফিল্ডটি খুঁজুন।
  4. এর মান হিসেবে `backend` লিখে সেভ করুন।
  5. এরপর পেজের ওপরের ডান কোণায় **Manual Deploy** বাটন থেকে **Clear Build Cache and Deploy** সিলেক্ট করে পুনরায় ডিপ্লয় করুন।
