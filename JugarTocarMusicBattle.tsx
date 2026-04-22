import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Gamepad2, 
  Trophy, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Piano,
  Guitar,
  Dribbble,
  BookOpen,
  Music2,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Question {
  id: number;
  sentence: string;
  translation: string;
  options: string[];
  correct: string;
  explanation: string;
}

// --- Data: 20 Questions (Jugar vs Tocar) ---

const QUESTIONS: Question[] = [
  { id: 1, sentence: "Yo ____ el piano cada mañana.", translation: "Ես ամեն առավոտ դաշնամուր եմ նվագում։", options: ["juego", "toco"], correct: "toco", explanation: "Երաժշտական գործիք նվագելու համար օգտագործվում է 'tocar':" },
  { id: 2, sentence: "A Pedro le gusta ____ al fútbol.", translation: "Պեդրոն սիրում է ֆուտբոլ խաղալ։", options: ["jugar", "tocar"], correct: "jugar", explanation: "Սպորտային խաղերի համար օգտագործվում է 'jugar':" },
  { id: 3, sentence: "Nosotros ____ la guitarra en la fiesta.", translation: "Մենք կիթառ ենք նվագում երեկույթի ժամանակ։", options: ["jugamos", "tocamos"], correct: "tocamos", explanation: "Կիթառ նվագելը 'tocar' է:" },
  { id: 4, sentence: "Ella ____ al ajedrez muy bien.", translation: "Նա շատ լավ շախմատ է խաղում։", options: ["juega", "toca"], correct: "juega", explanation: "Շախմատ (ajedrez) խաղալը 'jugar' է:" },
  { id: 5, sentence: "Ellos ____ la batería en la banda.", translation: "Նրանք հարվածային գործիքներ են նվագում խմբում։", options: ["juegan", "tocan"], correct: "tocan", explanation: "Հարվածային գործիքներ նվագելը 'tocar' է:" },
  { id: 6, sentence: "¿Quieres ____ al baloncesto conmigo?", translation: "Ուզո՞ւմ ես բասկետբոլ խաղալ ինձ հետ։", options: ["jugar", "tocar"], correct: "jugar", explanation: "Բասկետբոլ խաղալը 'jugar' է:" },
  { id: 7, sentence: "No ____ los cables soltados.", translation: "Մի՛ դիպչիր պոկված լարերին։", options: ["juegues", "toques"], correct: "toques", explanation: "Ինչ-որ բան շոշափելու/դիպչելու համար օգտագործվում է 'tocar':" },
  { id: 8, sentence: "Mi hermano ____ videojuegos todo el día.", translation: "Եղբայրս ամբողջ օրը վիդեոխաղեր է խաղում։", options: ["juega", "toca"], correct: "juega", explanation: "Վիդեոխաղեր (videojuegos) խաղալը 'jugar' է:" },
  { id: 9, sentence: "____ la trompeta es difícil.", translation: "Շեփոր նվագելը դժվար է։", options: ["Jugar", "Tocar"], correct: "Tocar", explanation: "Շեփոր նվագելը 'tocar' է:" },
  { id: 10, sentence: "Ustedes ____ a las cartas en el club.", translation: "Դուք թղթախաղ եք խաղում ակումբում։", options: ["juegan", "tocan"], correct: "juegan", explanation: "Թղթախաղ (cartas) խաղալը 'jugar' է:" },
  { id: 11, sentence: "Yo ____ el violín desde pequeño.", translation: "Ես ջութակ եմ նվագում մանկուց։", options: ["juego", "toco"], correct: "toco", explanation: "Ջութակ նվագելը 'tocar' է:" },
  { id: 12, sentence: "Él me ____ el hombro para llamarme.", translation: "Նա դիպչում է իմ ուսին՝ ինձ կանչելու համար։", options: ["juega", "toca"], correct: "toca", explanation: "Ուսին դիպչելը (դիպչել իմաստով) 'tocar' է:" },
  { id: 13, sentence: "Mañana ____ un partido importante.", translation: "Վաղը մենք կարևոր խաղ ունենք։", options: ["jugamos", "tocamos"], correct: "jugamos", explanation: "Խաղ/մրցույթ խաղալը 'jugar' է:" },
  { id: 14, sentence: "La orquesta ____ una pieza clásica.", translation: "Նվագախումբը դասական ստեղծագործություն է նվագում։", options: ["juega", "toca"], correct: "toca", explanation: "Նվագախումբը նվագում է՝ 'tocar':" },
  { id: 15, sentence: "¿Quién ____ a la puerta?", translation: "Ո՞վ է թակում դուռը։", options: ["juega", "toca"], correct: "toca", explanation: "Դուռը թակելը (դիպչել) 'tocar' է:" },
  { id: 16, sentence: "Los niños ____ en el parque.", translation: "Երեխաները խաղում են այգում։", options: ["juegan", "tocan"], correct: "juegan", explanation: "Երեխաները խաղում են՝ 'jugar':" },
  { id: 17, sentence: "Ella ____ el arpa de maravilla.", translation: "Նա հիանալի տավիղ է նվագում։", options: ["juega", "toca"], correct: "toca", explanation: "Տավիղ նվագելը 'tocar' է:" },
  { id: 18, sentence: "Nosotros ____ al tenis los sábados.", translation: "Մենք թենիս ենք խաղում շաբաթ օրերը։", options: ["jugamos", "tocamos"], correct: "jugamos", explanation: "Թենիս խաղալը 'jugar' է:" },
  { id: 19, sentence: "____ el saxofón es mi pasión.", translation: "Սաքսոֆոն նվագելը իմ կիրքն է։", options: ["Jugar", "Tocar"], correct: "Tocar", explanation: "Սաքսոֆոն նվագելը 'tocar' է:" },
  { id: 20, sentence: "Ellos ____ al póker los viernes.", translation: "Նրանք պոկեր են խաղում ուրբաթ օրերը։", options: ["juegan", "tocan"], correct: "juegan", explanation: "Պոկեր խաղալը 'jugar' է:" }
];

export default function JugarTocarMusicBattle() {
  const [view, setView] = useState<'intro' | 'theory' | 'play' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ Gor: 0, Gayane: 0 });
  const [turn, setTurn] = useState<'Gor' | 'Gayane'>('Gor');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const startBattle = () => {
    setCurrentIdx(0);
    setScores({ Gor: 0, Gayane: 0 });
    setTurn('Gor');
    setFeedback(null);
    setView('play');
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;
    const isCorrect = option === QUESTIONS[currentIdx].correct;
    if (isCorrect) {
      setScores(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
    }
    setFeedback({ correct: isCorrect, msg: QUESTIONS[currentIdx].explanation });
  };

  const nextStep = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTurn(turn === 'Gor' ? 'Gayane' : 'Gor');
      setFeedback(null);
    } else {
      setView('result');
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-indigo-50 font-sans p-6 overflow-hidden flex flex-col items-center justify-center relative">
      
      {/* Musical Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="absolute top-[5%] right-[10%] animate-bounce duration-[3s]"><Music size={120} /></div>
         <div className="absolute bottom-[10%] left-[5%] animate-bounce duration-[4s]"><Music2 size={80} /></div>
         <div className="absolute top-[20%] left-[15%] opacity-20"><Piano size={200} /></div>
         <div className="absolute bottom-[20%] right-[15%] opacity-20 rotate-12"><Guitar size={240} /></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* INTRO VIEW */}
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1 }}
            className="z-10 text-center max-w-lg space-y-12"
          >
            <div className="space-y-6">
               <div className="flex justify-center gap-6">
                  <motion.div 
                    animate={{ rotate: [-2, 2, -2] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-orange-600 rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.4)] border-4 border-orange-400"
                  >
                    <User size={50} className="text-white" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: [2, -2, 2] }} 
                    transition={{ repeat: Infinity, duration: 2.1 }}
                    className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-blue-400"
                  >
                    <User size={50} className="text-white" />
                  </motion.div>
               </div>
               <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
                 Music <span className="text-indigo-500 underline decoration-indigo-500/30">Battle</span>
               </h1>
               <p className="text-indigo-300 font-bold italic tracking-wide">
                 Գոռ <span className="text-stone-500 italic font-medium px-2">vs</span> Գայանե
               </p>
               <p className="text-indigo-400 text-sm max-w-sm mx-auto italic">
                 Մրցակցություն **Jugar** և **Tocar** բայերի շուրջ՝ երաժշտական ռիթմերով:
               </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button 
                 onClick={() => setView('theory')}
                 className="w-full py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
               >
                 <BookOpen size={16} /> Տեսություն
               </button>
               <button 
                 onClick={startBattle}
                 className="w-full py-7 bg-indigo-600 rounded-[40px] font-black text-3xl uppercase italic tracking-tighter shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 Uկսել Մրցույթը <Gamepad2 size={32} />
               </button>
            </div>
          </motion.div>
        )}

        {/* THEORY VIEW */}
        {view === 'theory' && (
          <motion.div 
            key="theory"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="z-10 max-w-3xl w-full bg-slate-900/90 backdrop-blur-2xl border border-blue-900/30 p-10 md:p-14 rounded-[60px] space-y-12 shadow-4xl"
          >
            <div className="text-center space-y-2">
               <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">Jugar vs Tocar</h2>
               <div className="h-1 w-20 bg-indigo-500 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6 bg-orange-600/10 p-8 rounded-[40px] border border-orange-600/20">
                  <h3 className="text-2xl font-black italic text-orange-500 flex items-center gap-3 tracking-tighter">
                    <Dribbble size={28} /> JUGAR
                  </h3>
                  <p className="text-sm leading-relaxed text-indigo-100">
                    Օգտագործվում է **սպորտային խաղերի**, **վիդեոխաղերի** և **ժամանցային խաղերի** համար։
                  </p>
                  <div className="space-y-2 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Օրինակներ:</p>
                    <ul className="text-xs space-y-2 italic text-indigo-400 font-bold">
                      <li>• Juego al tenis.</li>
                      <li>• Jugamos al póker.</li>
                      <li>• Él juega al ajedrez.</li>
                    </ul>
                  </div>
               </div>

               <div className="space-y-6 bg-blue-600/10 p-8 rounded-[40px] border border-blue-600/20">
                  <h3 className="text-2xl font-black italic text-blue-500 flex items-center gap-3 tracking-tighter">
                    <Music size={28} /> TOCAR
                  </h3>
                  <p className="text-sm leading-relaxed text-indigo-100">
                    Օգտագործվում է **երաժշտական գործիքներ նվագելու**, ինչպես նաև **դիպչելու/շոշափելու** համար։
                  </p>
                  <div className="space-y-2 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Օրինակներ:</p>
                    <ul className="text-xs space-y-2 italic text-indigo-400 font-bold">
                      <li>• Toco el saxofón.</li>
                      <li>• Tocamos la batería.</li>
                      <li>• No toques la guitarra.</li>
                    </ul>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setView('intro')}
              className="w-full py-6 bg-white text-indigo-950 rounded-[35px] font-black text-xl uppercase italic tracking-tighter shadow-xl active:scale-95 transition-transform"
            >
              Վերադառնալ
            </button>
          </motion.div>
        )}

        {/* PLAY VIEW */}
        {view === 'play' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full max-w-4xl space-y-12"
          >
            {/* STYLISH SCOREBOARD */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
               <div className={`p-8 rounded-[45px] border-4 transition-all duration-500 relative overflow-hidden ${turn === 'Gor' ? 'bg-orange-600 border-white scale-105 shadow-[0_0_50px_rgba(234,88,12,0.5)]' : 'bg-slate-900 border-slate-800 opacity-40'}`}>
                  <div className="relative z-10 flex items-center justify-between">
                     <span className="font-black italic uppercase tracking-tighter text-2xl">Գոռ</span>
                     <Flame size={24} className={turn === 'Gor' ? 'text-white animate-pulse' : 'text-slate-700'} />
                  </div>
                  <span className="relative z-10 text-6xl font-black italic leading-tight">{scores.Gor}</span>
                  {turn === 'Gor' && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
               </div>
               <div className={`p-8 rounded-[45px] border-4 transition-all duration-500 relative overflow-hidden ${turn === 'Gayane' ? 'bg-blue-600 border-white scale-105 shadow-[0_0_50px_rgba(37,99,235,0.5)]' : 'bg-slate-900 border-slate-800 opacity-40'}`}>
                  <div className="relative z-10 flex items-center justify-between">
                     <span className="font-black italic uppercase tracking-tighter text-2xl">Գայանե</span>
                     <Flame size={24} className={turn === 'Gayane' ? 'text-white animate-pulse' : 'text-slate-700'} />
                  </div>
                  <span className="relative z-10 text-6xl font-black italic leading-tight">{scores.Gayane}</span>
                  {turn === 'Gayane' && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
               </div>
            </div>

            {/* BATTLE CARD */}
            <div className="bg-slate-900/50 backdrop-blur-3xl border border-indigo-900/20 p-12 md:p-20 rounded-[80px] shadow-4xl space-y-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                  <Music size={200} />
               </div>

               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-5 py-2 rounded-full border border-indigo-500/20 text-indigo-400 font-black uppercase text-xs tracking-[0.3em]">
                    Round {currentIdx + 1}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight text-white px-4 drop-shadow-2xl">
                    {QUESTIONS[currentIdx].sentence.split('____').map((p, i) => (
                      <React.Fragment key={i}>
                        {p} {i === 0 && <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-[12px] decoration-8">____</span>}
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="text-indigo-300 font-bold italic text-lg md:text-xl opacity-80 mt-4">
                    {QUESTIONS[currentIdx].translation}
                  </p>
                </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto w-full">
                 {QUESTIONS[currentIdx].options.map(opt => (
                   <button 
                    key={opt}
                    disabled={!!feedback}
                    onClick={() => handleAnswer(opt)}
                    className={`py-10 rounded-[45px] font-black text-4xl uppercase tracking-tighter transition-all relative overflow-hidden group ${
                      feedback ? (opt === QUESTIONS[currentIdx].correct ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-black opacity-10')
                      : 'bg-black/50 backdrop-blur-md hover:bg-indigo-600 text-white border-b-[12px] border-black hover:border-indigo-800 active:scale-95 active:border-b-4'
                    }`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>

               <AnimatePresence>
                 {feedback && (
                   <motion.div 
                     initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                     className={`p-8 rounded-[40px] flex items-center justify-between border-4 backdrop-blur-3xl shadow-2xl ${feedback.correct ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-500'}`}
                   >
                      <div className="flex items-center gap-6 text-left">
                         {feedback.correct 
                            ? <CheckCircle2 className="text-emerald-500" size={48} /> 
                            : <XCircle className="text-rose-500" size={48} />
                         }
                         <div className="space-y-2">
                            <p className={`font-black uppercase tracking-[0.3em] text-xs ${feedback.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                               {feedback.correct ? 'Correct Rhythm!' : 'Broken String!'}
                            </p>
                            <p className="text-indigo-200 font-bold italic text-lg leading-tight max-w-sm">{feedback.msg}</p>
                         </div>
                      </div>
                      <button onClick={nextStep} className="bg-white text-indigo-950 p-6 rounded-3xl hover:scale-110 active:scale-90 transition-all shadow-xl">
                         <ArrowRight size={32} />
                      </button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
            className="z-10 text-center space-y-12 max-w-lg w-full"
          >
            <div className="relative">
               <Trophy size={160} className="mx-auto text-yellow-500 drop-shadow-[0_0_60px_rgba(234,179,8,0.6)] animate-pulse" />
               <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-4 -right-4 bg-indigo-500 p-4 rounded-full text-white shadow-2xl"
               >
                  <Music size={24} />
               </motion.div>
            </div>
            
            <div className="space-y-6">
               <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-white">Showdown Over</h2>
               <div className="bg-white/5 border border-white/10 p-10 rounded-[60px] space-y-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center bg-orange-600 p-6 rounded-[35px] border-b-[8px] border-orange-950">
                     <span className="font-black italic uppercase text-2xl tracking-tighter">Գոռ</span>
                     <span className="text-5xl font-black">{scores.Gor}</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-600 p-6 rounded-[35px] border-b-[8px] border-blue-950">
                     <span className="font-black italic uppercase text-2xl tracking-tighter">Գայանե</span>
                     <span className="text-5xl font-black">{scores.Gayane}</span>
                  </div>
               </div>
               <div className="p-8 bg-indigo-600/20 rounded-[40px] border border-indigo-500/20">
                  <p className="text-2xl font-black text-indigo-400 italic">
                     {scores.Gor > scores.Gayane ? "🎸 Գոռը նվագեց լավագույնս! Հաղթանակ:" : 
                      scores.Gayane > scores.Gor ? "🎹 Գայանեն ռիթմի մեջ էր! Հաղթանակ:" : 
                      "🥁 Սա հիանալի դուետ էր! Ոչ-ոքի:"}
                  </p>
               </div>
            </div>

            <button 
             onClick={() => setView('intro')}
             className="w-full py-9 bg-white text-indigo-950 rounded-[50px] font-black text-3xl uppercase italic tracking-tighter shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              Restart Battle <RotateCcw size={40} />
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <footer className="fixed bottom-12 opacity-10 pointer-events-none text-center w-full">
         <p className="text-[10px] font-black uppercase tracking-[1.5em] text-indigo-500 italic">Music Battle: Jugar & Tocar Mode</p>
      </footer>
    </div>
  );
}
