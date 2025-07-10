import { useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import { SubtitleEditor, Subtitle } from './components/SubtitleEditor'
import { TranslateButton } from './components/TranslateButton'
import { ExportSRT } from './components/ExportSRT'
import { MiniMonster } from './components/MiniMonster'

function App() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CG</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CapGen
              </h1>
            </div>
            <MiniMonster />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            AI Subtitle & Translation
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Generate accurate subtitles and translate them instantly. 
            Free, fast, and privacy-focused - all processing happens in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            <VideoUploader onSubtitlesGenerated={setSubtitles} />
            <div className="flex flex-col sm:flex-row gap-4">
              <TranslateButton 
                subtitles={subtitles} 
                onTranslationComplete={setSubtitles} 
              />
              <ExportSRT subtitles={subtitles} />
            </div>
          </div>

          {/* Right Column - Subtitle Editor */}
          <div>
            <SubtitleEditor subtitles={subtitles} setSubtitles={setSubtitles} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>Built with ❤️ using React, Tailwind CSS, and AI</p>
            <p className="text-sm mt-2">Free • Open Source • Privacy-First</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App