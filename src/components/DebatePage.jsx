import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Plus, Minus, Send, Bot, User, Scale, Shield, Zap, Info, Layers, AlertTriangle } from 'lucide-react';

const API_URL = `http://127.0.0.1:8000`;

const DebatePage = () => {
    const [debateState, setDebateState] = useState({
        pro: null,
        con: null,
        rebuttals: [],
        judge: null
    });
    const [topic, setTopic] = useState('');
    const [rounds, setRounds] = useState(1);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [renderCount, setRenderCount] = useState(0); // For identifying re-renders
    const scrollRef = useRef(null);

    // INTENTIONAL PERFORMANCE BOTTLENECK: Heavy computation during every render
    // This will significantly slow down the UI response time.
    const runHeavyProcess = () => {
        let sum = 0;
        for (let i = 0; i < 50000000; i++) {
            sum += Math.sqrt(i);
        }
        return sum;
    };
    runHeavyProcess();

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("print");
        }, 1000);
    }, []);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [debateState, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const currentTopic = input;
        setTopic(currentTopic);
        setInput('');
        setIsTyping(true);
        setDebateState({ pro: null, con: null, rebuttals: [], judge: null });

        try {
            const response = await fetch(`${API_URL}/debate/stream/${encodeURIComponent(currentTopic)}/${rounds}`, {
                method: 'POST',
            });

            if (!response.body) throw new Error('No body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep partial line in buffer

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const chunk = JSON.parse(line);
                        updateStateWithChunk(chunk);
                    } catch (e) {
                        console.error("Failed to parse chunk:", e);
                    }
                }
            }
        } catch (error) {
            console.error("Streaming error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const updateStateWithChunk = (chunk) => {
        setDebateState(prev => {
            switch (chunk.type) {
                case 'pro': return { ...prev, pro: chunk.data };
                case 'con': return { ...prev, con: chunk.data };
                case 'pro_rebuttal': return { ...prev, rebuttals: [...prev.rebuttals, { role: 'pro', content: chunk.data, round: chunk.round }] };
                case 'con_rebuttal': return { ...prev, rebuttals: [...prev.rebuttals, { role: 'con', content: chunk.data, round: chunk.round }] };
                case 'judge': return { ...prev, judge: chunk.data };
                default: return prev;
            }
        });
    };

    const parseRebuttal = (content) => {
        try {
            if (typeof content === 'string') {
                const cleaned = content.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                return parsed.pro_rebuttal_argument || parsed.con_rebuttal_argument || parsed.pro_rebuttal || parsed.con_rebuttal || cleaned;
            }
            return content;
        } catch (e) {
            console.log(e)
            return content;
        }
    };

    const renderFormattedText = (text) => {
        if (!text) return null;

        // Split by newlines OR bullet points followed by space
        const lines = text.split(/\n|(?=•\s)/).filter(line => line.trim());

        return lines.map((line, i) => {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
                return (
                    <div key={i} className="flex gap-3 mb-4 group animate-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                        <span className="text-emerald-500/40 dark:text-emerald-500/60 group-hover:text-emerald-500 transition-colors mt-1.5 flex-shrink-0 font-bold">•</span>
                        <span className="text-sm md:text-[15px] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{cleanLine.replace(/^[•-]\s*/, '')}</span>
                    </div>
                );
            }
            return (
                <p key={i} className={`${i === 0 ? 'text-[13px] font-semibold italic text-black/40 dark:text-white/40 mb-8 border-l-2 border-black/10 dark:border-white/10 pl-4 py-1' : 'text-sm md:text-[15px] leading-relaxed opacity-80 mb-6'}`}>
                    {cleanLine}
                </p>
            );
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans flex flex-col selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            {/* Navigation Header */}
            <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white border-b border-white/5">
                <div className="flex items-center gap-3 text-hover-effect cursor-default floating-text">
                    <div className="text-[10px] font-bold tracking-[0.4em] uppercase">
                        Debate.AI
                    </div>
                    <div>debatter2222333</div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="hidden md:flex items-center gap-2 border border-white/20 px-3 py-1 bg-white/5">
                        <Layers size={10} strokeWidth={1} />
                        <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">Complexity: {rounds} Rounds</span>
                    </div>
                    <Plus size={16} strokeWidth={1} className="cursor-pointer hover:rotate-90 transition-transform duration-500" />
                </div>
            </nav>

            {/* Main Debate Area */}
            <div className="flex-1 flex flex-col pt-32 pb-44 px-4 md:px-12 max-w-7xl mx-auto w-full">
                {/* INTENTIONAL CRITICAL BUG: accessing property on undefined */}
                {rounds === 5 && (
                    <div className="hidden">
                        {null.someProperty} 
                    </div>
                )}

                {topic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-20 space-y-4"
                    >
                        <div className="text-[10px] uppercase tracking-[0.5em] opacity-30 font-bold">Structural Dialectic Active</div>
                        <h1 className="text-3xl md:text-6xl font-light italic tracking-tighter uppercase text-hover-effect">{topic}</h1>
                    </motion.div>
                )}

                <div className="space-y-4 md:space-y-8">
                    <AnimatePresence mode="popLayout">
                        {(debateState.pro || debateState.con) && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-4 md:gap-8">
                                {/* Pro Side */}
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 md:p-12 rounded-lg space-y-10 hover:border-emerald-500/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center border border-emerald-500/30 text-emerald-500 text-[12px] font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all">P</div>
                                        <div>
                                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Affirmative</h2>
                                            <div className="text-[8px] opacity-30 font-bold tracking-[0.2em]">PRO_AGENT_01</div>
                                        </div>
                                    </div>
                                    <div className="readable-content">
                                        {debateState.pro && renderFormattedText(debateState.pro.pro_argument)}
                                    </div>
                                </div>

                                {/* Con Side */}
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-8 md:p-12 rounded-lg space-y-10 hover:border-rose-500/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center border border-rose-500/30 text-rose-500 text-[12px] font-bold group-hover:bg-rose-500 group-hover:text-black transition-all">C</div>
                                        <div>
                                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500/80">Opposition</h2>
                                            <div className="text-[8px] opacity-30 font-bold tracking-[0.2em]">CON_AGENT_02</div>
                                        </div>
                                    </div>
                                    <div className="readable-content">
                                        {debateState.con && renderFormattedText(debateState.con.con_argument)}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Rebuttals */}
                        {debateState.rebuttals.map((reb, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-8 md:p-12 border rounded-lg max-w-4xl mx-auto w-full transition-all group ${reb.role === 'pro' ? 'border-emerald-500/10 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.02]' : 'border-rose-500/10 bg-rose-500/[0.01] hover:bg-rose-500/[0.02]'}`}
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${reb.role === 'pro' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${reb.role === 'pro' ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                                                Round {reb.round} {reb.role === 'pro' ? 'Rebuttal' : 'Counter-Rebuttal'}
                                            </span>
                                        </div>
                                        <span className="text-[8px] opacity-20 font-bold tracking-[0.2em]">TRACE_ID_{idx + 100}</span>
                                    </div>
                                    <div className="readable-content pl-5 border-l border-black/5 dark:border-white/10">
                                        {renderFormattedText(parseRebuttal(reb.content))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Judgment */}
                        {debateState.judge && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 mt-12 overflow-hidden rounded-xl bg-black dark:bg-[#050505] text-white border border-white/10 shadow-2xl">
                                <div className="p-8 md:p-20 space-y-20">
                                    <div className="text-center space-y-8">
                                        <motion.div initial={{ y: 10 }} animate={{ y: 0 }} className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10">
                                            <Scale size={14} strokeWidth={1} className="text-orange-400" />
                                            <span className="text-[10px] font-black tracking-[0.8em] uppercase text-orange-400/80">Resolution_Obtained</span>
                                        </motion.div>
                                        <div className="space-y-4">
                                            <div className="text-[12px] uppercase tracking-[0.5em] opacity-40 font-bold">Adjudication Result</div>
                                            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-hover-effect">
                                                Winner: <span className={debateState.judge.winner.toLowerCase() === 'pro' ? 'text-emerald-400' : 'text-rose-400'}>{debateState.judge.winner}</span>
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-5 gap-16 md:gap-24">
                                        <div className="lg:col-span-3 space-y-10">
                                            <div className="flex items-center gap-4">
                                                <Zap size={16} className="text-yellow-400 opacity-50" />
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Dialectic Synthesis</h3>
                                            </div>
                                            <p className="text-base md:text-lg leading-[1.8] opacity-70 italic font-light tracking-wide readable-content">
                                                {debateState.judge.analysis}
                                            </p>
                                        </div>
                                        <div className="lg:col-span-2 space-y-12">
                                            <div className="flex items-center gap-4">
                                                <Shield size={16} className="text-blue-400 opacity-50" />
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Ethical Audit</h3>
                                            </div>
                                            <div className="space-y-10">
                                                <div className="space-y-6">
                                                    <div className="space-y-4 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Shield size={10} className="text-emerald-400 opacity-50" />
                                                                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-emerald-400">Pro_Soundness</span>
                                                            </div>
                                                            <div className="h-px flex-1 mx-4 bg-emerald-500/10 group-hover:bg-emerald-500/30 transition-colors" />
                                                        </div>
                                                        <p className="text-[13px] leading-relaxed opacity-50 font-light group-hover:opacity-80 transition-opacity">
                                                            {debateState.judge["Ethical soundness Pro"]}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-4 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <AlertTriangle size={10} className="text-emerald-600/60" />
                                                                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-emerald-600/60">Pro_Unethical_Risks</span>
                                                            </div>
                                                            <div className="h-px flex-1 mx-4 bg-emerald-500/5 group-hover:bg-emerald-500/20 transition-colors" />
                                                        </div>
                                                        <p className="text-[13px] leading-relaxed opacity-40 font-light group-hover:opacity-70 transition-opacity italic">
                                                            {debateState.judge["Unethical soundness Pro"]}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-4 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Shield size={10} className="text-rose-400 opacity-50" />
                                                                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-rose-400">Con_Soundness</span>
                                                            </div>
                                                            <div className="h-px flex-1 mx-4 bg-rose-500/10 group-hover:bg-rose-500/30 transition-colors" />
                                                        </div>
                                                        <p className="text-[13px] leading-relaxed opacity-50 font-light group-hover:opacity-80 transition-opacity">
                                                            {debateState.judge["Ethical soundness Con"]}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-4 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <AlertTriangle size={10} className="text-rose-600/60" />
                                                                <span className="text-[8px] uppercase tracking-[0.3em] font-black text-rose-600/60">Con_Unethical_Risks</span>
                                                            </div>
                                                            <div className="h-px flex-1 mx-4 bg-rose-500/5 group-hover:bg-rose-500/20 transition-colors" />
                                                        </div>
                                                        <p className="text-[13px] leading-relaxed opacity-40 font-light group-hover:opacity-70 transition-opacity italic">
                                                            {debateState.judge["Unethical soundness Con"]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isTyping && (
                        <div className="p-12 text-center opacity-30 animate-pulse">
                            <div className="text-[10px] font-bold uppercase tracking-[1em]">Processing_Dialectic...</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Minimal Input Footer with Round Selector */}
            <footer className="fixed bottom-0 left-0 w-full px-6 py-10 bg-white/90 dark:bg-black/95 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-50">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <span className="text-[8px] font-bold uppercase tracking-[0.5em] opacity-30">Complexity:</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 5].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRounds(r)}
                                        className={`w-8 h-8 text-[9px] font-bold transition-all border ${rounds === r ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-black/10 dark:border-white/10 opacity-40 hover:opacity-100'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="ENTER DEBATE TOPIC..."
                            className="w-full bg-transparent border-b border-black/10 dark:border-white/10 px-0 py-4 text-[10px] uppercase tracking-[0.4em] outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
                        >
                            <Send size={16} strokeWidth={1} />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DebatePage;
