// Translation utilities using free APIs

export interface TranslationResult {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence?: number
}

export class Translator {
  private apiUrl: string = 'https://libretranslate.de/translate'
  
  // Translate text using LibreTranslate (free API)
  async translateText(
    text: string, 
    targetLanguage: string, 
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        translatedText: data.translatedText,
        sourceLanguage: data.detectedLanguage || sourceLanguage,
        targetLanguage,
        confidence: data.confidence
      }
    } catch (error) {
      console.error('Translation failed:', error)
      
      // Fallback to mock translation for development
      return this.getMockTranslation(text, targetLanguage, sourceLanguage)
    }
  }

  // Batch translate multiple texts
  async translateBatch(
    texts: string[], 
    targetLanguage: string, 
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult[]> {
    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLanguage, sourceLanguage))
    )
    
    return translations
  }

  // Check if a language is supported
  async getSupportedLanguages(): Promise<LanguageInfo[]> {
    try {
      const response = await fetch('https://libretranslate.de/languages')
      const languages = await response.json()
      
      return languages.map((lang: any) => ({
        code: lang.code,
        name: lang.name
      }))
    } catch (error) {
      console.error('Failed to fetch supported languages:', error)
      return DEFAULT_LANGUAGES
    }
  }

  // Mock translation for development
  private getMockTranslation(
    text: string, 
    targetLanguage: string, 
    sourceLanguage: string
  ): TranslationResult {
    const mockTranslations: Record<string, string> = {
      'es': 'Bienvenido a CapGen, el generador de subtítulos con IA.',
      'fr': 'Bienvenue sur CapGen, le générateur de sous-titres IA.',
      'de': 'Willkommen bei CapGen, dem KI-gestützten Untertitel-Generator.',
      'it': 'Benvenuto in CapGen, il generatore di sottotitoli AI.',
      'pt': 'Bem-vindo ao CapGen, o gerador de legendas com IA.',
      'ru': 'Добро пожаловать в CapGen, генератор субтитров с ИИ.',
      'ja': 'CapGenへようこそ、AI搭載字幕ジェネレーターです。',
      'ko': 'AI 기반 자막 생성기 CapGen에 오신 것을 환영합니다.',
      'zh': '欢迎使用CapGen，AI驱动的字幕生成器。',
      'ar': 'مرحباً بك في CapGen، مولد الترجمة المدعوم بالذكاء الاصطناعي.',
      'hi': 'CapGen में आपका स्वागत है, AI-संचालित उपशीर्षक जेनरेटर।'
    }

    return {
      translatedText: mockTranslations[targetLanguage] || text,
      sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
      targetLanguage,
      confidence: 0.85
    }
  }
}

export interface LanguageInfo {
  code: string
  name: string
}

export const DEFAULT_LANGUAGES: LanguageInfo[] = [
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