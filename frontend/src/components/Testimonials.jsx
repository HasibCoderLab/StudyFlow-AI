const testimonials = [
  {
    name: "Hasib",
    class: "HSC Student",
    quote: "StudyFlow AI completely changed how I prepare for exams. The AI study plans helped me cover my entire syllabus with time to spare. I went from stressed to confident.",
    rating: 5,
    initials: "H",
    color: "bg-primary-500",
  },
  {
    name: "Nusrat",
    class: "University Student, CSE",
    quote: "The quiz generator is incredible. It finds exactly the topics I'm weak at and drills them. My GPA improved from 3.2 to 3.7 in one semester.",
    rating: 5,
    initials: "N",
    color: "bg-accent-500",
  },
  {
    name: "Rafiq",
    class: "Medical Admission Aspirant",
    quote: "I was struggling to stay consistent. The streaks and gamification kept me going. 45-day streak and counting! The AI tutor is a lifesaver for tough topics.",
    rating: 5,
    initials: "R",
    color: "bg-purple-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-surface-50/50 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Loved by Students
          </h2>
          <p className="text-lg text-surface-500 dark:text-dark-300 max-w-2xl mx-auto">
            See what students like you are saying about StudyFlow AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative bg-white dark:bg-dark-800 rounded-2xl p-6 border border-surface-200 dark:border-dark-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <svg className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.165 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.611-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.165 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.611-2.917-1.179z" />
              </svg>

              <p className="text-sm text-surface-600 dark:text-dark-300 leading-relaxed mb-5">
                "{t.quote}"
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-surface-400 dark:text-dark-400">{t.class}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
