import { useState } from 'react'
import { Languages, Globe, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Translator } from '../lib/translate'
import { Subtitle } from './SubtitleEditor'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
]

interface TranslateButtonProps {
  subtitles: Subtitle[]
  onTranslationComplete: (translatedSubtitles: Subtitle[]) => void
}

export function TranslateButton({ subtitles, onTranslationComplete }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [showLanguages, setShowLanguages] = useState(false)
  const [translator] = useState(() => new Translator())

  const handleTranslate = async () => {
    if (subtitles.length === 0) {
      alert('Please generate subtitles first before translating.')
      return
    }
    
    setIsTranslating(true)
    
    try {
      console.log('Translating to:', targetLanguage)
      
      // Extract texts to translate
      const textsToTranslate = subtitles.map(sub => sub.text)
      
      // Translate all texts
      const translations = await translator.translateBatch(textsToTranslate, targetLanguage)
      
      // Update subtitles with translations
      const translatedSubtitles = subtitles.map((subtitle, index) => ({
        ...subtitle,
        translatedText: translations[index]?.translatedText || subtitle.text
      }))
      
      onTranslationComplete(translatedSubtitles)
      setIsTranslating(false)
    } catch (error) {
      console.error('Translation failed:', error)
      setIsTranslating(false)
      alert('Translation failed. Please try again.')
    }
  }

  const selectedLanguage = LANGUAGES.find(lang => lang.code === targetLanguage)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Languages className="w-5 h-5 mr-2" />
        Translation
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="font-medium">{selectedLanguage?.name}</span>
            </div>
            <motion.div
              animate={{ rotate: showLanguages ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>

          {showLanguages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            >
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setTargetLanguage(language.code)
                    setShowLanguages(false)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors ${
                    targetLanguage === language.code ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isTranslating
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
          }`}
          whileHover={!isTranslating ? { scale: 1.02 } : {}}
          whileTap={!isTranslating ? { scale: 0.98 } : {}}
        >
          {isTranslating ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Languages className="w-4 h-4" />
              <span>Translate Subtitles</span>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  )
}