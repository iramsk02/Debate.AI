import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Circle, Square, Triangle, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };
    useEffect(() => {
        
       setInterval(()=>{
        console.log("PASSWORD 1234")
        console.log("PASSWORD 1234")
       },1000)
    }, []);
    useEffect(() => {
        
       setInterval(()=>{
        console.log("PASSWORD 1234")
       },1000)
    }, []);
    useEffect(() => {
        
       setInterval(()=>{
        console.log("PASSWORD 1234")
        console.log("PASSWORD 1234")
       },1000)
    }, []);
    useEffect(() => {
        
       setInterval(()=>{
        console.log("PASSWORD 1234")
       },1000)
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-hover-effect cursor-default floating-text">
                    Debate.AI
                </div>
                <div className="flex gap-6">
                    <Plus size={16} strokeWidth={1} className="cursor-pointer hover:rotate-90 transition-transform duration-500" />
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                <div className="relative z-10 max-w-5xl text-center">
                    <p>This is just for11111 testing22</p>
                    {/* <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="mb-12 flex justify-center"
                    >
                        <Circle size={32} strokeWidth={0.5} className="animate-pulse floating-text" />
                    </motion.div> */}

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-7xl font-light tracking-tighter uppercase leading-[1.1] mb-8 cursor-default select-none"
                    >
                        Structural <br />
                        <span className="font-black italic">Debate Facilitation.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ opacity: 0.8, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xs md:text-sm font-normal max-w-md mx-auto mb-12 opacity-50 tracking-widest uppercase leading-loose cursor-default"
                    >
                        A persistent agent designed to provide logical structural analysis of arguments.
                        DebateAI identifies tensions and offers judgment, while leaving the final synthesis to you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-0 justify-center"
                    >
                        <button
                            onClick={() => navigate('/debate')}
                            className="group bg-black dark:bg-white text-white dark:text-black px-12 py-6 text-[9px] font-bold uppercase tracking-[0.5em] hover:opacity-80 transition-all duration-300 flex items-center gap-4"
                        >
                            Initialize Dialectic
                            <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-12 opacity-20"
                >
                    <Minus size={20} strokeWidth={1} className="rotate-90" />
                </motion.div>
            </section>

            {/* Philosophy Section */}
            <section className="py-40 px-6 border-t border-black/5 dark:border-white/5 bg-gray-50/5 dark:bg-white/5">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-24">
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <Circle size={20} strokeWidth={1} className="opacity-20" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-hover-effect">Agentic Intelligence</h3>
                        <p className="text-[11px] opacity-40 leading-loose tracking-wide hover:opacity-100 transition-opacity duration-500 cursor-default">Our agents don't just process text; they inhabit ethical frameworks to simulate outcomes before they manifest.</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <Square size={20} strokeWidth={1} className="opacity-20" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-hover-effect">Multi-Model Consensus</h3>
                        <p className="text-[11px] opacity-40 leading-loose tracking-wide hover:opacity-100 transition-opacity duration-500 cursor-default">Cross-validating arguments against 40+ philosophical databases to eliminate structural bias in real-time.</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <Triangle size={20} strokeWidth={1} className="opacity-20" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-hover-effect">Logical Resolution</h3>
                        <p className="text-[11px] opacity-40 leading-loose tracking-wide hover:opacity-100 transition-opacity duration-500 cursor-default">Moving beyond debate into mathematical resolution. Finding the unique intersection of ethical safety and utility.</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 text-white px-6 text-center border-t border-black/5 dark:border-white/5">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* <div className="flex justify-center gap-12 text-[8px] uppercase tracking-[0.6em] font-bold opacity-20">
                        <a href="#" className="hover:opacity-100 transition-opacity">Index</a>
                        <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
                    </div> */}
                    <div className="text-[7px] uppercase tracking-[0.8em] opacity-60 hover:opacity-100 transition-opacity duration-500 cursor-default">
                        DEBATE.AI 
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
