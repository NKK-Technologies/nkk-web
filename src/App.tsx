import { Rss } from 'lucide-react';
import { CountdownTimer } from './components/CountdownTimer';
import logoMain from './assets/logo_main@4x.png';
import './index.css';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-light/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center">
        {/* Top Indicators & Logo */}
        <div className="flex flex-col items-center mb-8 gap-8 animate-[float_8s_ease-in-out_infinite]">
          <div className="inline-block px-6 py-2 rounded-full glass-panel border-white/10">
            <span className="text-sm sm:text-base tracking-[0.2em] font-medium opacity-80 uppercase text-white">Coming Soon</span>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(0,136,204,0.2)]">
            <img
              src={logoMain}
              alt="NKK Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight mb-6 text-white">
          NKK <span className="text-brand-light font-light">tech</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We are crafting something extraordinary. A new standard of digital experience is on the horizon. Prepare for a revolution in technology.
        </p>

        <CountdownTimer />

        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative px-8 py-4 bg-white text-brand-dark rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <span className="relative z-10 flex items-center gap-2">Get Notified <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </button>
          <button className="px-8 py-4 rounded-full font-semibold text-lg text-white border border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 glass-panel">
            <Mail className="w-5 h-5" /> Contact Us
          </button>
        </div> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-500 flex justify-center items-center gap-6">
        <span>© 2026 NKK Technologies. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors"><Rss className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  );
}

export default App;
