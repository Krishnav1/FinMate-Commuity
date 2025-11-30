

import React, { useState, useEffect } from 'react';
import { generateImagePrompt, generateCarouselStructure, generateSlideVisual, splitTextToSlides, generatePostCaption } from '../services/geminiService';
import { Sparkles, Send, Image, MessageCircle, RefreshCw, CheckCircle2, Linkedin, Twitter, PenTool, Globe, Newspaper, Lightbulb, Layers, Plus, Layout, Palette, ArrowRight, ChevronRight, ChevronLeft, Eye, MessageSquare, Box } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreatorPersona, CarouselSlide, VisualStyle } from '../types';

interface SignalComposerProps {
  onSuccess?: () => void;
}

// STAGES for the new Advanced Workflow
type WizardStage = 'STRATEGY' | 'TEXT_REVIEW' | 'VISUAL_PROTOTYPE' | 'FULL_GENERATION' | 'FINAL_POLISH';

const SignalComposer: React.FC<SignalComposerProps> = ({ onSuccess }) => {
  const { addSignal, addReport, user, activeDraft, setActiveDraft } = useApp();
  
  // MODES: 'SINGLE' | 'CAROUSEL'
  const [creationMode, setCreationMode] = useState<'SINGLE' | 'CAROUSEL'>('SINGLE');

  // Single Post State
  const [contentBody, setContentBody] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePromptRefinement, setImagePromptRefinement] = useState('');
  const [showImageRefine, setShowImageRefine] = useState(false);
  
  // Carousel State
  const [carouselTopic, setCarouselTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('CORPORATE');
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [wizardStage, setWizardStage] = useState<WizardStage>('STRATEGY');
  const [postCaption, setPostCaption] = useState('');
  const [visualFeedback, setVisualFeedback] = useState('');

  // Common State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LINKEDIN']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Trader Mode State
  const [tradeForm, setTradeForm] = useState({ symbol: '', type: 'BUY', entry: '', sl: '', target: '' });

  // Load Draft from Research Hub
  useEffect(() => {
    if (activeDraft) {
      if (activeDraft.isCarousel) {
          setCreationMode('CAROUSEL');
          setCarouselTopic(activeDraft.title || activeDraft.text.substring(0, 50));
          // If we have text but no slides, try to auto-split
          if (activeDraft.text && (!activeDraft.slides || activeDraft.slides.length === 0)) {
              handleAutoSplit(activeDraft.text);
          }
      } else {
          setCreationMode('SINGLE');
          setContentBody(activeDraft.text || '');
      }
    }
  }, [activeDraft]);

  const handleAutoSplit = async (text: string) => {
      const splitSlides = await splitTextToSlides(text, user.contentNiche);
      setSlides(splitSlides);
      setWizardStage('TEXT_REVIEW');
  }

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]);
  };

  // --- SINGLE POST HANDLERS ---
  const handleGenerateImage = async () => {
     if (!contentBody) return;
     setIsGenerating(true);
     setGeneratedImage(null);
     setTimeout(async () => {
         const keywords = contentBody.split(' ')[0] || 'finance';
         const imgUrl = `https://source.unsplash.com/random/800x600/?${keywords},chart`;
         setGeneratedImage(imgUrl);
         setIsGenerating(false);
         setShowImageRefine(false);
     }, 1500);
  };

  const handleRefineImage = async () => {
      // Simulate regeneration with new prompt
      setIsGenerating(true);
      setTimeout(() => {
          const keywords = contentBody.split(' ')[0] || 'finance';
          const seed = Math.random();
          const imgUrl = `https://source.unsplash.com/random/800x600/?${keywords},abstract&sig=${seed}`;
          setGeneratedImage(imgUrl);
          setIsGenerating(false);
          setShowImageRefine(false);
          setImagePromptRefinement('');
      }, 1500);
  }

  // --- CAROUSEL HANDLERS (THE WIZARD) ---
  
  // 1. Generate Text Structure
  const handleGenerateCarouselStructure = async () => {
      if (!carouselTopic) return;
      setIsGenerating(true);
      const generatedSlides = await generateCarouselStructure(carouselTopic, slideCount, user.contentNiche);
      setSlides(generatedSlides);
      setWizardStage('TEXT_REVIEW');
      setIsGenerating(false);
  };

  const handleUpdateSlide = (id: number, field: 'title' | 'body', value: string) => {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // 2. Prototype First Visual
  const handlePrototypeVisual = async () => {
      setIsGenerating(true);
      // Generate only the first slide to save time/cost
      const firstSlide = slides[0];
      const img = await generateSlideVisual(firstSlide.title, visualStyle);
      const updatedSlides = slides.map((s, i) => i === 0 ? { ...s, imageUrl: img, isGenerated: true } : s);
      setSlides(updatedSlides);
      setCurrentSlideIndex(0);
      setWizardStage('VISUAL_PROTOTYPE');
      setIsGenerating(false);
  }

  // 3. Regenerate Visual (Feedback Loop)
  const handleRegenerateVisual = async () => {
      setIsGenerating(true);
      const firstSlide = slides[0];
      // Simulate using the feedback
      const img = await generateSlideVisual(firstSlide.title, visualStyle, visualFeedback);
      const updatedSlides = slides.map((s, i) => i === 0 ? { ...s, imageUrl: img, isGenerated: true } : s);
      setSlides(updatedSlides);
      setIsGenerating(false);
      setVisualFeedback('');
  }

  // 4. Generate All (Batch)
  const handleGenerateAllVisuals = async () => {
      setIsGenerating(true);
      // Generate the rest using the confirmed style
      const updatedSlides = await Promise.all(slides.map(async (slide, idx) => {
          if (idx === 0) return slide; // Skip already generated
          const img = await generateSlideVisual(slide.title, visualStyle);
          return { ...slide, imageUrl: img, isGenerated: true };
      }));
      
      // Auto-generate summary
      const summary = await generatePostCaption(updatedSlides);
      
      setSlides(updatedSlides);
      setPostCaption(summary);
      setWizardStage('FINAL_POLISH');
      setIsGenerating(false);
  }

  const handlePublish = () => {
      setIsPublishing(true);
      setTimeout(() => {
          if (user.persona === CreatorPersona.TRADER) {
              addSignal({
                  id: `sig-${Date.now()}`,
                  symbol: tradeForm.symbol,
                  type: tradeForm.type as any,
                  entry: Number(tradeForm.entry),
                  stopLoss: Number(tradeForm.sl),
                  targets: [Number(tradeForm.target)],
                  status: 'ACTIVE',
                  timestamp: 'Just Now',
                  createdAt: Date.now(),
                  confidence: 'High'
              });
          } else {
              addReport({
                  id: `post-${Date.now()}`,
                  title: creationMode === 'CAROUSEL' ? carouselTopic : (activeDraft?.title || 'New Update'),
                  type: 'POST',
                  contentBody: creationMode === 'CAROUSEL' ? postCaption : contentBody,
                  platform: 'ALL',
                  publishedAt: Date.now(),
                  imageUrl: creationMode === 'SINGLE' ? (generatedImage || undefined) : slides[0]?.imageUrl,
                  format: creationMode === 'CAROUSEL' ? 'CAROUSEL' : (generatedImage ? 'IMAGE' : 'TEXT'),
                  metaData: {
                      format: creationMode === 'CAROUSEL' ? 'CAROUSEL' : 'TEXT',
                      visualStyle: creationMode === 'CAROUSEL' ? visualStyle : undefined,
                      hookType: 'STATEMENT',
                      dominantTone: 'PROFESSIONAL',
                      readabilityScore: 80,
                      slideCount: creationMode === 'CAROUSEL' ? slides.length : undefined
                  }
              });
              setActiveDraft(null);
          }
          setIsPublishing(false);
          setIsSuccess(true);
          setTimeout(() => {
              setIsSuccess(false);
              if(onSuccess) onSuccess();
          }, 2000);
      }, 1500);
  };

  if (isSuccess) {
      return (
          <div className="h-[400px] flex flex-col items-center justify-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Published Successfully!</h2>
              <p className="text-slate-400 mt-2">Your content is live on {selectedPlatforms.join(', ')}</p>
          </div>
      );
  }

  // --- RENDER FOR TRADER (UNCHANGED) ---
  if (user.persona === CreatorPersona.TRADER) {
      return (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">New Trade Signal</h2>
              <div className="space-y-4">
                  <input type="text" placeholder="Symbol (e.g. NIFTY)" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={tradeForm.symbol} onChange={e=>setTradeForm({...tradeForm, symbol: e.target.value.toUpperCase()})} />
                  <div className="flex gap-4">
                      <button onClick={()=>setTradeForm({...tradeForm, type: 'BUY'})} className={`flex-1 py-3 rounded font-bold ${tradeForm.type === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>BUY</button>
                      <button onClick={()=>setTradeForm({...tradeForm, type: 'SELL'})} className={`flex-1 py-3 rounded font-bold ${tradeForm.type === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400'}`}>SELL</button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <input type="number" placeholder="Entry" className="bg-slate-900 border border-slate-700 rounded p-3 text-white" value={tradeForm.entry} onChange={e=>setTradeForm({...tradeForm, entry: e.target.value})} />
                      <input type="number" placeholder="Stop Loss" className="bg-slate-900 border border-slate-700 rounded p-3 text-white" value={tradeForm.sl} onChange={e=>setTradeForm({...tradeForm, sl: e.target.value})} />
                      <input type="number" placeholder="Target" className="bg-slate-900 border border-slate-700 rounded p-3 text-white" value={tradeForm.target} onChange={e=>setTradeForm({...tradeForm, target: e.target.value})} />
                  </div>
                  <button onClick={handlePublish} disabled={isPublishing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg mt-4 flex justify-center items-center gap-2">
                      {isPublishing ? <RefreshCw className="animate-spin" /> : <Send />} Publish Signal
                  </button>
              </div>
          </div>
      );
  }

  // --- RENDER FOR ANALYST / CONTENT CREATOR ---
  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4">
        
        {/* MODE TOGGLE */}
        <div className="flex justify-center mb-8">
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex gap-1">
                <button 
                  onClick={() => setCreationMode('SINGLE')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${creationMode === 'SINGLE' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <PenTool size={16} /> Single Post
                </button>
                <button 
                  onClick={() => setCreationMode('CAROUSEL')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${creationMode === 'CAROUSEL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <Layers size={16} /> Carousel Studio
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: EDITOR */}
            <div className="space-y-6">
                
                {/* --- SINGLE POST EDITOR --- */}
                {creationMode === 'SINGLE' && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><PenTool size={18} className="text-purple-400"/> Post Editor</h3>
                        </div>
                        
                        <textarea 
                            value={contentBody}
                            onChange={(e) => setContentBody(e.target.value)}
                            placeholder="Start typing your post..."
                            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none text-base leading-relaxed"
                        />
                        
                        <div className="mt-4 flex gap-3 items-center">
                            <button 
                                onClick={handleGenerateImage}
                                disabled={isGenerating}
                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Image size={16} />} 
                                {generatedImage ? 'Regenerate Image' : 'Generate AI Image'}
                            </button>
                            {generatedImage && (
                                <button 
                                    onClick={() => setShowImageRefine(!showImageRefine)}
                                    className="text-xs text-indigo-400 hover:text-white underline"
                                >
                                    Modify Image?
                                </button>
                            )}
                        </div>
                        
                        {showImageRefine && (
                            <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-800 animate-in slide-in-from-top-2">
                                <p className="text-xs text-slate-400 mb-2">Refine the visual:</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={imagePromptRefinement}
                                        onChange={(e) => setImagePromptRefinement(e.target.value)}
                                        placeholder="e.g. Make it more minimalist, use blue colors..."
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white outline-none"
                                    />
                                    <button onClick={handleRefineImage} className="bg-indigo-600 text-white text-xs px-3 py-1 rounded">Update</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- CAROUSEL WIZARD --- */}
                {creationMode === 'CAROUSEL' && (
                    <div className="space-y-6">
                        {/* WIZARD STEPS INDICATOR */}
                        <div className="flex justify-between items-center px-2">
                            {['Strategy', 'Review', 'Visuals', 'Polish'].map((step, i) => (
                                <div key={step} className="flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        (i===0 && wizardStage==='STRATEGY') ||
                                        (i===1 && wizardStage==='TEXT_REVIEW') ||
                                        (i===2 && wizardStage==='VISUAL_PROTOTYPE') ||
                                        (i===3 && wizardStage==='FINAL_POLISH') 
                                        ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                        {i+1}
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase">{step}</span>
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Strategy */}
                        {wizardStage === 'STRATEGY' && (
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4">Step 1: Carousel Strategy</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Topic / Hook</label>
                                        <input 
                                            type="text" 
                                            value={carouselTopic}
                                            onChange={(e) => setCarouselTopic(e.target.value)}
                                            placeholder="e.g. 5 Reasons HDFC Bank is a Buy"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Slide Count</label>
                                            <select 
                                                value={slideCount}
                                                onChange={(e) => setSlideCount(Number(e.target.value))}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
                                            >
                                                {[3,4,5,6,7,8,10].map(n => <option key={n} value={n}>{n} Slides</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Visual Style</label>
                                            <select 
                                                value={visualStyle}
                                                onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
                                            >
                                                <option value="CORPORATE">Corporate Blue</option>
                                                <option value="MINIMALIST">Minimalist</option>
                                                <option value="CYBERPUNK">Cyberpunk</option>
                                                <option value="BOLD">Bold & Red</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleGenerateCarouselStructure}
                                        disabled={!carouselTopic || isGenerating}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />} Generate Outline
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Content Review */}
                        {wizardStage === 'TEXT_REVIEW' && (
                             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-white">Step 2: Review Text</h3>
                                    <button onClick={() => setWizardStage('STRATEGY')} className="text-xs text-slate-400 hover:text-white">Back</button>
                                </div>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {slides.map((slide, idx) => (
                                        <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-indigo-400 uppercase">Slide {idx + 1}</span>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={slide.title}
                                                onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                                                className="w-full bg-transparent border-b border-slate-800 text-white font-bold mb-2 focus:border-indigo-500 outline-none pb-1"
                                            />
                                            <textarea 
                                                value={slide.body}
                                                onChange={(e) => handleUpdateSlide(slide.id, 'body', e.target.value)}
                                                className="w-full bg-transparent text-slate-300 text-sm h-20 resize-none outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={handlePrototypeVisual}
                                    disabled={isGenerating}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
                                >
                                    {isGenerating ? <RefreshCw className="animate-spin" /> : <Eye />} Preview Visual Style
                                </button>
                             </div>
                        )}

                        {/* Step 3: Visual Prototype */}
                        {wizardStage === 'VISUAL_PROTOTYPE' && (
                             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                 <h3 className="font-bold text-white mb-2">Step 3: Verify Style</h3>
                                 <p className="text-slate-400 text-sm mb-4">Check the first slide on the right. Is the style correct?</p>
                                 
                                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
                                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Feedback Loop</label>
                                     <div className="flex gap-2">
                                         <input 
                                             type="text" 
                                             value={visualFeedback}
                                             onChange={(e) => setVisualFeedback(e.target.value)}
                                             placeholder="e.g. Too dark, make it blue..."
                                             className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white outline-none"
                                         />
                                         <button onClick={handleRegenerateVisual} disabled={isGenerating} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-2">
                                             {isGenerating ? <RefreshCw className="animate-spin" size={14}/> : <RefreshCw size={14}/>} Regenerate
                                         </button>
                                     </div>
                                 </div>

                                 <div className="flex gap-3">
                                     <button onClick={() => setWizardStage('TEXT_REVIEW')} className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-3 rounded-lg text-sm font-bold">Back to Text</button>
                                     <button 
                                        onClick={handleGenerateAllVisuals} 
                                        disabled={isGenerating}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                     >
                                         <CheckCircle2 size={16} /> Approve & Generate All
                                     </button>
                                 </div>
                             </div>
                        )}

                        {/* Step 4: Final Polish */}
                        {wizardStage === 'FINAL_POLISH' && (
                             <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                 <h3 className="font-bold text-white mb-4">Step 4: Final Polish</h3>
                                 
                                 <div className="mb-6">
                                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Post Caption (Social Summary)</label>
                                     <textarea 
                                         value={postCaption}
                                         onChange={(e) => setPostCaption(e.target.value)}
                                         className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                     />
                                 </div>

                                 <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                                     <CheckCircle2 size={16} className="text-emerald-500" /> All {slides.length} slides generated. Review preview on right.
                                 </p>
                             </div>
                        )}
                    </div>
                )}

                {/* Platform Selector (Common) */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4 text-sm uppercase text-slate-400">Publish To</h3>
                    <div className="flex gap-4">
                        <button onClick={() => togglePlatform('LINKEDIN')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedPlatforms.includes('LINKEDIN') ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            <Linkedin size={18} /> LinkedIn
                        </button>
                        <button onClick={() => togglePlatform('TWITTER')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedPlatforms.includes('TWITTER') ? 'bg-sky-500 border-sky-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            <Twitter size={18} /> Twitter
                        </button>
                        <button onClick={() => togglePlatform('TELEGRAM')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedPlatforms.includes('TELEGRAM') ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            <Send size={18} /> Telegram
                        </button>
                    </div>
                    <button 
                        onClick={handlePublish} 
                        disabled={isPublishing || (creationMode === 'SINGLE' && !contentBody) || (creationMode === 'CAROUSEL' && wizardStage !== 'FINAL_POLISH')}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? <RefreshCw className="animate-spin" /> : <Send size={18} />} 
                        Publish Content
                    </button>
                </div>
            </div>

            {/* RIGHT: PREVIEW CARD */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center sticky top-24 h-fit">
                <div className="w-full max-w-md bg-white text-black rounded-xl overflow-hidden shadow-2xl transition-all">
                    {/* LinkedIn Style Header */}
                    <div className="p-4 flex gap-3 border-b border-gray-100">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                           {user.avatarUrl && <img src={user.avatarUrl} className="w-full h-full object-cover"/>}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate w-48">{user.bio.substring(0, 30)}...</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">1h • <Globe size={10} /></p>
                        </div>
                    </div>
                    
                    {/* Content Preview */}
                    {creationMode === 'SINGLE' ? (
                        <>
                            <div className="p-4 min-h-[100px]">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {contentBody || "Your post preview will appear here..."}
                                </p>
                            </div>
                            {generatedImage && (
                                <div className="w-full h-64 bg-gray-100 relative group">
                                    {isGenerating ? (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 gap-2">
                                            <RefreshCw className="animate-spin" /> Generating...
                                        </div>
                                    ) : (
                                        <>
                                            <img src={generatedImage} alt="AI Generated" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
                                                AI Generated
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        // CAROUSEL PREVIEW
                        <div className="bg-gray-50 pb-4">
                            <div className="p-4">
                                <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                                    {postCaption || (carouselTopic + " 🧵 👇")}
                                </p>
                            </div>
                            
                            {/* Slide Display */}
                            <div className="aspect-square bg-gray-900 relative mx-4 rounded-lg overflow-hidden shadow-lg group">
                                {slides.length > 0 && slides[currentSlideIndex]?.imageUrl ? (
                                    <>
                                        <img 
                                            src={slides[currentSlideIndex].imageUrl} 
                                            className={`w-full h-full object-cover opacity-60 ${visualStyle === 'MINIMALIST' ? 'grayscale' : ''}`} 
                                        />
                                        <div className="absolute inset-0 p-8 flex flex-col justify-center">
                                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                                                {slides[currentSlideIndex].title}
                                            </h3>
                                            <p className="text-gray-100 text-sm leading-relaxed drop-shadow">
                                                {slides[currentSlideIndex].body}
                                            </p>
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">
                                            {currentSlideIndex + 1} / {slides.length}
                                        </div>
                                        
                                        {/* Navigation Controls (Only if >1 slide generated) */}
                                        {slides.length > 1 && (
                                            <>
                                                <div className="absolute inset-y-0 left-0 flex items-center">
                                                    <button 
                                                        onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                                                        className="p-2 bg-black/20 hover:bg-black/50 text-white rounded-r transition-colors disabled:opacity-0"
                                                        disabled={currentSlideIndex === 0}
                                                    >
                                                        <ChevronLeft />
                                                    </button>
                                                </div>
                                                <div className="absolute inset-y-0 right-0 flex items-center">
                                                    <button 
                                                        onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                                                        className="p-2 bg-black/20 hover:bg-black/50 text-white rounded-l transition-colors disabled:opacity-0"
                                                        disabled={currentSlideIndex === slides.length - 1}
                                                    >
                                                        <ChevronRight />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-gray-200">
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw size={48} className="mb-4 text-indigo-500 animate-spin" />
                                                <p className="text-sm">Designing Slide {currentSlideIndex+1}...</p>
                                            </>
                                        ) : (
                                            <>
                                                <Layout size={48} className="mb-4 opacity-50" />
                                                <p className="text-sm">Preview will appear here after generation.</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Dots Indicator */}
                            {slides.length > 0 && (
                                <div className="flex justify-center gap-1.5 mt-4">
                                    {slides.map((_, idx) => (
                                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Social Actions */}
                    <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-gray-500">
                        <span className="text-xs flex items-center gap-1">👍 Like</span>
                        <span className="text-xs flex items-center gap-1">💬 Comment</span>
                        <span className="text-xs flex items-center gap-1">↗️ Share</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SignalComposer;