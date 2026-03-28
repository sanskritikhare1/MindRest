import React, { useState } from "react";
import PredictionPage from "./Predictionpage";
import { mlApi } from "../services/mlApi";

export default function Assessment() {
  const [showPopup, setShowPopup] = useState(false);
  const [risk, setRisk] = useState("Low");
  const [inputs, setInputs] = useState({
    screentime: 1, sleep: 1, stress: 1, mood: 1
  });
  const [loading, setLoading] = useState(false);

  const screenLabels = ["<2h", "2-4h", "4-6h", "6-8h", "8-10h", "10-12h", "12-14h", "14-16h", "16-18h", "18h+"];
  const sleepLabels = ["Great", "V.Good", "Good", "Fair", "Avg", "Poor", "V.Poor", "Bad", "Exhausted", "None"];
  const stressLabels = ["None", "V.Low", "Low", "Mild", "Mod", "High", "V.High", "Peak", "Burnout", "Extreme"];
  const moodLabels = ["Great", "Happy", "Good", "Stable", "Neutral", "Low", "Sad", "V.Low", "Bad", "Empty"];

  const getPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowPopup(false);

    try {
      const mappedInputs = {
        screentime: [1, 3, 5, 7, 9, 11, 13, 15, 17, 18][inputs.screentime - 1],
        sleep: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][inputs.sleep - 1],
        stress: inputs.stress,
        mood: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][inputs.mood - 1]
      };
      const response = await mlApi.getPrediction(mappedInputs);
      const result = response.risk_label;
      let mappedRisk = result === "High" ? "High Digital Exhaustion (Burnout Risk)" :
        result === "Moderate" ? "Moderate Digital Exhaustion" : "Low Digital Exhaustion";
      setRisk(mappedRisk);
      setShowPopup(true);
    } catch (err) {
      setRisk("Unable to calculate risk. Please check your connection.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const ChoiceGrid = ({ label, id, list, currentVal }) => (
    <div className="bg-white p-[0.625rem] rounded-[1.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-[0.4rem] px-[0.25rem]">
        <span className="text-[0.625rem] font-black text-[#1D4D4F] uppercase tracking-wider">{label}</span>
        <span className="text-[0.5rem] font-black text-teal-600 bg-teal-50 px-[0.5rem] py-[0.125rem] border border-teal-100 rounded-lg">
          {list[currentVal - 1]}
        </span>
      </div>
      <div className="grid grid-cols-10 gap-[0.25rem]">
        {list.map((_, index) => {
          const val = index + 1;
          const isActive = currentVal === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setInputs({ ...inputs, [id]: val })}
              className={`h-[1.75rem] flex items-center justify-center border transition-all text-[0.68rem] font-black rounded-[0.75rem] ${isActive
                ? "bg-[#1D4D4F] border-[#1D4D4F] text-white shadow-lg"
                : "border-slate-100 bg-white text-slate-400 hover:border-[#1D4D4F] hover:bg-slate-50"
                }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    /* FIXED: This wrapper now controls the entire gray background area */
    <div className="h-screen w-full bg-[#F5F7F9] flex flex-col font-sans overflow-hidden">

      {/* 1. Header/Navbar (Add your actual Navbar component here if separate) */}
      <header className="w-full shrink-0">
        {/* Placeholder for your MindRest Nav */}
      </header>

      {/* 2. Main content area: Flex-grow pushes the footer down and keeps itself centered */}
      <main className="flex-grow flex items-center justify-center p-[0.5rem] overflow-hidden">
        <div className="max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl bg-white rounded-[2.5rem] border-t-[0.375rem] border-[#1D4D4F] overflow-y-auto scrollbar-hide">
          <div className="p-[1.25rem] border-b border-slate-100 text-center shrink-0">
            <h2 className="text-[1.25rem] font-light text-[#1D4D4F]">
              MindRest <span className="font-bold">Assessment</span>
            </h2>
            <p className="mt-[0.25rem] text-slate-400 text-[0.56rem] font-black uppercase tracking-[0.3em]">
              Analysis Engine v1.2
            </p>
          </div>

          <form onSubmit={getPrediction} className="p-[1.25rem] space-y-[0.5rem]">
            <ChoiceGrid label="Screen Usage" id="screentime" list={screenLabels} currentVal={inputs.screentime} />
            <ChoiceGrid label="Sleep Quality" id="sleep" list={sleepLabels} currentVal={inputs.sleep} />
            <ChoiceGrid label="Stress Level" id="stress" list={stressLabels} currentVal={inputs.stress} />
            <ChoiceGrid label="Current Mood" id="mood" list={moodLabels} currentVal={inputs.mood} />

            <div className="pt-[0.75rem] shrink-0">
              <button
                type="submit"
                className="w-full bg-[#E76F51] text-white py-[0.8rem] font-black text-[0.7rem] uppercase tracking-[0.2em] rounded-[1rem] hover:bg-[#cf5b3f] transition-all shadow-lg"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Generate Analysis"}
              </button>
            </div>
          </form>

          <div className="bg-slate-50 p-[0.625rem] text-center border-t border-slate-100 mt-auto">
            <p className="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest">
              Secure Local Processing — © 2026 MindRest
            </p>
          </div>
        </div>
      </main>

      {/* 3. Footer: shrink-0 prevents it from pushing the layout height up */}
      <footer className="w-full shrink-0 py-4 text-center">
        {/* Your footer links from screenshot 2 go here */}
      </footer>

      {showPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-[1rem]">
          <div className="bg-white shadow-2xl relative max-w-lg w-full rounded-[2.5rem] border-t-[0.375rem] border-[#E76F51] overflow-hidden">
            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-6 text-slate-300 hover:text-red-400 font-light text-2xl">✕</button>
            <PredictionPage
              passedRisk={risk}
              score={Number((((inputs.screentime + inputs.sleep + inputs.stress + inputs.mood - 4) / 36) * 10).toFixed(1))}
              screenTime={inputs.screentime}
              sleep={inputs.sleep}
              stress={inputs.stress}
              focus={11 - inputs.mood}
            />
          </div>
        </div>
      )}
    </div>
  );
}