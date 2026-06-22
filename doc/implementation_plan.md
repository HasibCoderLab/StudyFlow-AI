# ইমপ্লিমেন্টেশন প্ল্যান - প্রোডাকশন গ্রেড ব্যাকএন্ড রিফ্যাক্টরিং

এই প্ল্যানটিতে StudyFlow AI ব্যাকএন্ড কোডবেসকে একটি শক্তিশালী, নিরাপদ এবং রক্ষণাবেক্ষণযোগ্য প্রোডাকশন-রেডি সিস্টেমে রূপান্তর করার ধাপগুলো তুলে ধরা হয়েছে।

---

## ব্যবহারকারীর পর্যালোচনা প্রয়োজন (User Review Required)

> [!IMPORTANT]
> **নতুন ডিপেন্ডেন্সি (New Dependencies):** আমরা নিচের প্যাকেজগুলো ইন্সটল করব: `zod` (অনুরোধ ভ্যালিডেশন), `helmet` (সিকিউরিটি হেডার), `express-rate-limit` (ব্রুট-ফোর্স প্রতিরোধ), `express-mongo-sanitize` (NoSQL ইনজেকশন প্রতিরোধ), এবং `winston` (লগিং)।
> 
> **ডাটাবেজ ট্রানজেকশন (Transactions):** রেজিস্ট্রেশন প্রসেসের ডেটা ধারাবাহিকতা নিশ্চিত করতে আমরা MongoDB transactions ব্যবহার করব। এর জন্য MongoDB Replica Set সক্রিয় থাকতে হবে। লোকাল ডেভেলপমেন্টে যদি সিঙ্গেল ইনস্ট্যান্স থাকে, তবে আমরা একটি ফালব্যাক কনফিগারেশন রাখব যাতে এরর না আসে।

---

## প্রস্তাবিত পরিবর্তনসমূহ (Proposed Changes)

### ডিপেন্ডেন্সি (Dependencies)

#### [MODIFY] [package.json](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/package.json)
* `zod`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `winston` প্যাকেজগুলো ডিপেন্ডেন্সিতে যুক্ত করা হবে।

---

### কনফিগারেশন এবং ইউটিলিটি (Configuration & Utilities)

#### [NEW] [env.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/config/env.js)
* `zod` ব্যবহার করে এনভায়রনমেন্ট ভ্যারিয়েবল ভ্যালিডেটর তৈরি করা, যাতে কোনো জরুরি কনফিগারেশন বাদ পড়লে সার্ভার চালু হওয়ার আগেই সতর্ক করে।

#### [NEW] [logger.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/utils/logger.js)
* `winston` সেটআপ করা, যা প্রোডাকশনে কনসোল লগের পরিবর্তে ফাইলে (`logs/error.log` এবং `logs/combined.log`) স্ট্রাকচার্ড লগ রাইট করবে।

#### [NEW] [ApiError.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/utils/ApiError.js)
* কাস্টম অপারেশনাল এরর ক্লাস তৈরি করা, যা HTTP স্ট্যাটাস কোড সহ এরর হ্যান্ডল করবে।

#### [NEW] [catchAsync.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/utils/catchAsync.js)
* কন্ট্রোলারের `try-catch` ব্লকের পুনরাবৃত্তি দূর করতে একটি অ্যাসিনক্রোনাস হেল্পার র্যাপার ফাংশন তৈরি করা।

---

### সিকিউরিটি এবং মিডলওয়্যার (Security & Middlewares)

#### [NEW] [validate.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/middleware/validate.js)
* আগত রিকোয়েস্টের বডি, কুয়েরি এবং প্যারামস ভ্যালিড করার জন্য Zod স্কিমা মিডলওয়্যার তৈরি করা।

#### [MODIFY] [server.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/server.js)
* `helmet` সিকিউরিটি হেডার ইন্টিগ্রেট করা।
* `express-rate-limit` রেট লিমিটার ইন্টিগ্রেট করা।
* `express-mongo-sanitize` ইন্টিগ্রেট করা।
* গ্লোবাল এরর হ্যান্ডলার আপডেট করা যাতে প্রোডাকশন মোডে এররের স্ট্যাক ট্রেস হাইড থাকে।
* নতুন নিরাপদ এনভায়রনমেন্ট ফাইল ব্যবহার করে সার্ভার স্টার্ট করা।

---

### আর্কিটেকচার এবং সার্ভিস লেয়ার রিফ্যাক্টরিং (Architecture & Service Layer)

#### [NEW] [authValidator.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/validators/authValidator.js)
* ইউজার রেজিস্ট্রেশন এবং লগইনের জন্য Zod স্কিমা ডিফাইন করা।

#### [NEW] [authService.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/services/authService.js)
* রেজিস্ট্রেশন ও লগইনের মূল বিজনেস লজিক সার্ভিস ফাইলে নিয়ে যাওয়া।
* Mongoose Session ব্যবহার করে ডাটাবেজ ট্রানজেকশন ইমপ্লিমেন্ট করা (একই সাথে ইউজার, সাবজেক্ট ও চ্যাপ্টার তৈরির নিরাপত্তা নিশ্চিত করতে)।

#### [MODIFY] [authController.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/controllers/authController.js)
* `catchAsync` ব্যবহার করে কন্ট্রোলার রিফ্যাক্টর করা এবং সরাসরি ডেটাবেজ অপারেশনের বদলে সার্ভিস লেয়ার ব্যবহার করা।

#### [MODIFY] [auth.js](file:///d:/Coding/vibe-coding/StudyFlow-AI/backend/routes/auth.js)
* রেজিস্ট্রেশন এবং লগইন রাউটে Zod ভ্যালিডেশন মিডলওয়্যার যুক্ত করা।

---

## ভেরিফিকেশন প্ল্যান (Verification Plan)

### অটোমেটেড টেস্ট
- `npm run dev` দিয়ে সার্ভার রান করা এবং দেখা এনভায়রনমেন্ট চেকার ঠিকমতো কাজ করছে কিনা।
- `test_register.js` বা curl দিয়ে রেজিস্ট্রেশন এবং লগইনের সঠিকতা ও ভ্যালিডেশন চেক করা।

### ম্যানুয়াল ভেরিফিকেশন
- `/api/health` রাউটে ঘনঘন রিকোয়েস্ট পাঠিয়ে চেক করা রেট লিমিটার কাজ করছে কিনা।
- রেজিস্ট্রেশনের সময় ইচ্ছাকৃতভাবে কোনো এরর ঘটিয়ে দেখা ডাটাবেজ রোলব্যাক কাজ করছে কিনা (অর্থাৎ এরর এলে ইউজারও যাতে ক্রিয়েট না হয়)।
