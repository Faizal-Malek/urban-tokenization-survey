import { Questionnaire } from "@/components/Questionnaire";

const QuestionnaireHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#bfbf00]/40">
      {/* Modern Navigation Bar */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-[#fffbe6]/90 rounded-xl shadow flex items-center justify-between px-8 py-4 border border-yellow-100">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-gray-900">UIT Survey</span>
        </div>
        <a 
          href="/admin" 
          className="bg-white px-5 py-2 rounded-md shadow text-black font-semibold hover:bg-gray-100 transition"
        >
          Admin Login
        </a>
      </nav>
      <main className="container mx-auto px-4 py-8 mt-28">
        <Questionnaire />
      </main>
      
      <footer className="bg-black border-t border-brand-yellow/20 p-4 text-center text-sm text-brand-yellow">
        <p>© 2025 Urban Infrastructure Research Initiative</p>
      </footer>
    </div>
  );
};

export default QuestionnaireHome;
