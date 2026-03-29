import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { journalService } from "../services/journalService";
import "./Journal.css";

/* ─── Blog SVG Icons (unchanged) ──────────────────────────────────── */
const IconStillness = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="36" width="36" height="4" rx="2" fill="white" fillOpacity="0.5" />
        <rect x="10" y="20" width="6" height="16" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="32" y="20" width="6" height="16" rx="1" fill="white" fillOpacity="0.7" />
        <path d="M10 20 Q24 6 38 20" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="22" r="4" fill="white" fillOpacity="0.9" />
        <line x1="24" y1="4" x2="24" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="36" y1="8" x2="33" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="12" y1="8" x2="15" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
);
const IconDopamine = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 10 A14 14 0 1 1 10 24" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <polyline points="8,18 10,24 16,22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.85" />
        <circle cx="22" cy="22" r="1.5" fill="white" fillOpacity="0.5" />
    </svg>
);
const IconSleep = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 12 A12 12 0 1 1 18 36 A16 16 0 0 0 30 12Z" fill="white" fillOpacity="0.85" />
        <circle cx="36" cy="14" r="2" fill="white" fillOpacity="0.7" />
        <circle cx="40" cy="22" r="1.4" fill="white" fillOpacity="0.5" />
        <circle cx="34" cy="9" r="1" fill="white" fillOpacity="0.5" />
        <rect x="8" y="28" width="12" height="16" rx="2" stroke="white" strokeWidth="2" fill="none" fillOpacity="0.6" />
        <line x1="11" y1="32" x2="17" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="11" y1="35" x2="17" y2="35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
);
const IconBurnout = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 32 C10 30 8 24 10 19 C12 14 17 12 21 14 C22 11 25 9 28 10 C32 11 34 15 33 19 C36 20 38 24 36 28 C34 32 30 34 24 34 C20 34 17 33 16 32Z"
            stroke="white" strokeWidth="2.2" fill="white" fillOpacity="0.18" />
        <path d="M26 14 L20 26 H25 L22 36 L31 22 H26 Z" fill="white" fillOpacity="0.9" />
    </svg>
);
const IconAttention = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2" fillOpacity="0" fill="none" strokeOpacity="0.4" />
        <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="2" fillOpacity="0" fill="none" strokeOpacity="0.6" />
        <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2" fillOpacity="0" fill="none" strokeOpacity="0.8" />
        <circle cx="24" cy="24" r="2.5" fill="white" />
        <line x1="24" y1="4" x2="24" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="24" y1="36" x2="24" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="4" y1="24" x2="12" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="36" y1="24" x2="44" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
);
const IconLeaf = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 C12 36 14 20 28 14 C38 10 42 12 42 12 C42 12 40 22 30 28 C20 34 12 36 12 36Z"
            fill="white" fillOpacity="0.85" />
        <path d="M12 36 C14 30 18 26 24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
        <path d="M28 14 C24 20 20 26 18 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
    </svg>
);

/* ─── Arrow-out icon ────────────────────────────────────────────────── */
const ArrowOut = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ─── Data ──────────────────────────────────────────────────────────── */
const PROMPTS = [
    { text: "How has your digital environment felt today — like a tool or like a cage?", label: "Digital Awareness" },
    { text: "What made you smile today, even for just a brief second?", label: "Gratitude Prompt" },
    { text: "Describe a moment today where you felt completely at peace.", label: "Mindfulness Prompt" },
    { text: "Which digital habit would you like to delete from your life this week?", label: "Self-Care Prompt" },
];

const PAST_REFLECTIONS = []; // Deprecated - Now using live state

const INSIGHTS = [
    {
        title: "The Architecture of Stillness",
        category: "Environment",
        color: "from-[#2A9D8F] to-[#E9C46A]",
        Icon: IconStillness,
        desc: "How intentional spaces free us from the grip of constant connectivity.",
        url: "https://www.mindful.org/how-to-do-a-digital-detox-without-going-cold-turkey/"
    },
    {
        title: "The Dopamine Loop",
        category: "Habits",
        color: "from-[#E76F51] to-[#264653]",
        Icon: IconDopamine,
        desc: "Why social feeds hijack your reward system — and how to break free.",
        url: "https://www.healthline.com/health/dopamine-effects"
    },
    {
        title: "The Science of Sleep & Screens",
        category: "Health",
        color: "from-[#F4A261] to-[#E76F51]",
        Icon: IconSleep,
        desc: "Blue light, melatonin, and the hidden cost of scrolling before bed.",
        url: "https://www.sleepfoundation.org/how-sleep-works/blue-light"
    },
    {
        title: "Digital Burnout Is Real",
        category: "Mental Health",
        color: "from-[#457B9D] to-[#A8DADC]",
        Icon: IconBurnout,
        desc: "Recognising the signs of tech-driven burnout before it overwhelms you.",
        url: "https://www.verywellmind.com/what-is-digital-burnout-5194405"
    },
    {
        title: "Reclaiming Your Attention",
        category: "Productivity",
        color: "from-[#6D6875] to-[#B5838D]",
        Icon: IconAttention,
        desc: "Cal Newport's deep work principles applied to a hyperconnected world.",
        url: "https://www.ted.com/talks/cal_newport_why_you_should_quit_social_media"
    },
    {
        title: "The Case for a Digital Detox",
        category: "Lifestyle",
        color: "from-[#52B788] to-[#1B4332]",
        Icon: IconLeaf,
        desc: "Medical News Today breaks down the benefits, challenges, and how to start unplugging from screens.",
        url: "https://www.medicalnewstoday.com/articles/digital-detox"
    }
];

/* ─── Save button states ────────────────────────────────────────────── */
const SAVE_STATE = { idle: "idle", saving: "saving", saved: "saved" };

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════ */
export default function Journal() {
    const [content, setContent]       = useState("");
    const [title, setTitle]           = useState("");
    const [activeMood, setActiveMood] = useState(null);
    const [promptIdx, setPromptIdx]   = useState(0);
    const [showAll, setShowAll]       = useState(false);
    const [saveState, setSaveState]   = useState(SAVE_STATE.idle);
    const [reflections, setReflections] = useState([]);
    const [isLoading, setIsLoading]     = useState(true);

    const moods = [
        { label: "Terrible", emoji: "😫" },
        { label: "Bad",      emoji: "🙁" },
        { label: "Okay",     emoji: "😐" },
        { label: "Good",     emoji: "🙂" },
        { label: "Great",    emoji: "😆" },
    ];

    const getMoodEmoji = (label) => moods.find(m => m.label === label)?.emoji || "😐";

    const fetchReflections = async () => {
        try {
            const data = await journalService.getEntries();
            setReflections(data.data || []);
        } catch (error) {
            console.error("Failed to fetch reflections:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReflections();
    }, []);

    const visibleInsights = showAll ? INSIGHTS : INSIGHTS.slice(0, 3);

    const prevPrompt = () => setPromptIdx((i) => (i - 1 + PROMPTS.length) % PROMPTS.length);
    const nextPrompt = () => setPromptIdx((i) => (i + 1) % PROMPTS.length);

    const handleSave = async () => {
        if (saveState !== SAVE_STATE.idle || !content.trim()) return;
        setSaveState(SAVE_STATE.saving);
        try {
            const newEntry = await journalService.createEntry(
                title || "Daily Reflection",
                content,
                activeMood || "Okay"
            );
            setSaveState(SAVE_STATE.saved);
            
            // Prepend the new entry to reflections state immediately
            setReflections(prev => [newEntry, ...prev]);

            // Reset form
            setTimeout(() => {
                setSaveState(SAVE_STATE.idle);
                setTitle("");
                setContent("");
                setActiveMood(null);
            }, 2000);
        } catch (error) {
            console.error("Failed to save entry:", error);
            setSaveState(SAVE_STATE.idle);
        }
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
    };

    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <div className="journal-page min-h-screen py-10 px-4 md:px-8">

            {/* ── PROMPT ROW ─────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1D4D4F]">Daily Inspiration</h2>
                    <div className="flex gap-2">
                        <button onClick={prevPrompt} className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-[#1D4D4F] hover:text-[#1D4D4F] transition-all text-sm">‹</button>
                        <button onClick={nextPrompt} className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-[#1D4D4F] hover:text-[#1D4D4F] transition-all text-sm">›</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        (promptIdx) % PROMPTS.length,
                        (promptIdx + 1) % PROMPTS.length,
                        (promptIdx + 2) % PROMPTS.length,
                    ].map((idx, pos) => {
                        const isActive = pos === 2;
                        return (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -3 }}
                                onClick={() => setPromptIdx(idx)}
                                className={`rounded-2xl p-5 cursor-pointer transition-all border ${
                                    isActive
                                        ? "bg-[#1D4D4F] text-white border-[#1D4D4F] shadow-lg"
                                        : "bg-white text-[#1D4D4F] border-gray-100 shadow-sm"
                                }`}
                            >
                                <p className={`text-sm font-semibold leading-snug mb-3 ${isActive ? "text-white" : "text-[#1D4D4F]"}`}>
                                    {PROMPTS[idx].text}
                                </p>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-white/50" : "text-gray-400"}`}>
                                    {PROMPTS[idx].label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── MAIN TWO-COLUMN AREA ─────────────────────────────── */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-12">

                {/* LEFT – New Entry */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
                    <div className="flex items-baseline justify-between mb-6">
                        <h3 className="text-2xl font-bold text-[#1D4D4F]">New Entry</h3>
                        <span className="text-xs font-bold text-[#f07654] uppercase tracking-widest">{today}</span>
                    </div>

                    {/* Mood picker */}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">How are you feeling?</p>
                    <div className="flex gap-5 mb-6">
                        {moods.map((m) => (
                            <button
                                key={m.label}
                                onClick={() => setActiveMood(m.label)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <span className={`
                                    w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all
                                    ${activeMood === m.label
                                        ? "bg-[#1D4D4F] scale-110 shadow-md"
                                        : "bg-gray-100 opacity-50 group-hover:opacity-100 group-hover:scale-105"}
                                `}>
                                    {m.emoji}
                                </span>
                                <span className={`text-[9px] font-bold uppercase tracking-tight transition-colors ${activeMood === m.label ? "text-[#1D4D4F]" : "text-gray-400"}`}>
                                    {m.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Title */}
                    <input
                        type="text"
                        className="w-full border-none outline-none text-lg font-bold text-[#1D4D4F] placeholder-gray-200 mb-2 bg-transparent"
                        placeholder="Title of your reflection..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="h-px bg-gray-100 mb-4" />

                    {/* Body */}
                    <textarea
                        className="journal-textarea w-full flex-1 outline-none text-base font-serif placeholder-gray-200 resize-none"
                        style={{ minHeight: "220px" }}
                        placeholder="Start typing your thoughts here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Save button */}
                    <div className="mt-6 flex justify-end border-t border-gray-50 pt-5">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={handleSave}
                            disabled={saveState !== SAVE_STATE.idle}
                            className={`
                                px-7 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow transition-all duration-300
                                ${saveState === SAVE_STATE.saved
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[#1D4D4F] text-white hover:bg-[#f07654]"}
                            `}
                        >
                            <AnimatePresence mode="wait">
                                {saveState === SAVE_STATE.idle && (
                                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        Seal &amp; Save
                                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>lock</span>
                                    </motion.span>
                                )}
                                {saveState === SAVE_STATE.saving && (
                                    <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
                                        </svg>
                                        Saving...
                                    </motion.span>
                                )}
                                {saveState === SAVE_STATE.saved && (
                                    <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Saved!
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* RIGHT – Past Reflections */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-[#1D4D4F]">Past Reflections</h4>
                        <button className="text-xs font-bold text-[#f07654] hover:underline">View All</button>
                    </div>

                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <p className="text-xs text-gray-400 italic">Loading reflections...</p>
                        ) : reflections.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No reflections yet. Start writing!</p>
                        ) : (
                            reflections.slice(0, 5).map((r, i) => (
                                <motion.div
                                    key={r.id || i}
                                    whileHover={{ y: -3 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer shrink-0"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {formatDate(r.created_at)}
                                        </span>
                                        <span className="text-lg">{getMoodEmoji(r.mood_tag)}</span>
                                    </div>
                                    <h5 className="text-sm font-bold text-[#1D4D4F] mb-1 line-clamp-1">{r.title}</h5>
                                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{r.content}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── INSIGHTS LIBRARY (unchanged) ─────────────────────── */}
            <section className="max-w-6xl mx-auto px-0 pb-16">
                <div className="flex justify-between items-end mb-8">
                    <h4 className="text-2xl font-bold text-[#1D4D4F]">Insights Library</h4>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#1D4D4F] transition-colors"
                    >
                        {showAll ? "Show Less ↑" : "View All →"}
                    </button>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleInsights.map((item, i) => {
                        const Icon = item.Icon;
                        return (
                            <motion.a
                                layout
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.07 }}
                                whileHover={{ y: -8 }}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group cursor-pointer flex flex-col"
                            >
                                <div className={`h-32 rounded-3xl bg-gradient-to-br ${item.color} mb-4 flex items-center justify-center`}>
                                    <Icon />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                                <h5 className="text-lg font-bold text-[#1D4D4F] mt-1 mb-2 group-hover:text-[#f07654] transition-colors">{item.title}</h5>
                                <p className="text-sm text-gray-400 leading-relaxed flex-1">{item.desc}</p>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#2A9D8F] group-hover:text-[#f07654] transition-colors">
                                    Read article <ArrowOut />
                                </span>
                            </motion.a>
                        );
                    })}
                </motion.div>
            </section>
        </div>
    );
}