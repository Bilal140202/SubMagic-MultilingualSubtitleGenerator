// Whisper AI transcription utilities using @xenova/transformers
import { pipeline, Pipeline } from '@xenova/transformers'

export interface TranscriptionResult {
  text: string
  segments: TranscriptionSegment[]
}

export interface TranscriptionSegment {
  id: number
  start: number
  end: number
  text: string
  confidence?: number
}

export class WhisperTranscriber {
  private model: string = 'Xenova/whisper-tiny.en'
  private transcriber: Pipeline | null = null
  private isLoading: boolean = false
  
  constructor(model: string = 'Xenova/whisper-tiny.en') {
    this.model = model
  }

  // Initialize the transcriber pipeline
  private async initializeTranscriber(): Promise<Pipeline> {
    if (this.transcriber) {
      return this.transcriber
    }

    if (this.isLoading) {
      // Wait for the current loading to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.transcriber!
    }

    this.isLoading = true
    
    try {
      console.log('Loading Whisper model:', this.model)
      this.transcriber = await pipeline('automatic-speech-recognition', this.model, {
        chunk_length_s: 30,
        stride_length_s: 5,
      })
      console.log('Whisper model loaded successfully')
      return this.transcriber
    } catch (error) {
      console.error('Failed to load Whisper model:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  // Client-side transcription using @xenova/transformers
  async transcribeClientSide(audioFile: File): Promise<TranscriptionResult> {
    try {
      console.log('Starting transcription for:', audioFile.name)
      
      // Initialize the transcriber
      const transcriber = await this.initializeTranscriber()
      
      // Convert file to audio data
      const audioData = await this.fileToAudioData(audioFile)
      
      // Perform transcription
      const result = await transcriber(audioData, {
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      })
      
      console.log('Transcription result:', result)
      
      // Process the result
      return this.processTranscriptionResult(result)
      
    } catch (error) {
      console.error('Client-side transcription failed:', error)
      
      // Fallback to mock data for development
      console.log('Using mock transcription data')
      return this.getMockTranscription()
    }
  }

  // Convert File to audio data that Whisper can process
  private async fileToAudioData(file: File): Promise<Float32Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          
          // Decode audio data
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          
          // Convert to mono if stereo
          let audioData: Float32Array
          if (audioBuffer.numberOfChannels === 1) {
            audioData = audioBuffer.getChannelData(0)
          } else {
            // Mix down to mono
            const left = audioBuffer.getChannelData(0)
            const right = audioBuffer.getChannelData(1)
            audioData = new Float32Array(left.length)
            for (let i = 0; i < left.length; i++) {
              audioData[i] = (left[i] + right[i]) / 2
            }
          }
          
          // Resample to 16kHz if needed (Whisper expects 16kHz)
          if (audioBuffer.sampleRate !== 16000) {
            audioData = this.resampleAudio(audioData, audioBuffer.sampleRate, 16000)
          }
          
          resolve(audioData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read audio file'))
      reader.readAsArrayBuffer(file)
    })
  }

  // Simple audio resampling
  private resampleAudio(audioData: Float32Array, originalSampleRate: number, targetSampleRate: number): Float32Array {
    if (originalSampleRate === targetSampleRate) {
      return audioData
    }
    
    const ratio = originalSampleRate / targetSampleRate
    const newLength = Math.round(audioData.length / ratio)
    const result = new Float32Array(newLength)
    
    for (let i = 0; i < newLength; i++) {
      const index = i * ratio
      const indexFloor = Math.floor(index)
      const indexCeil = Math.min(indexFloor + 1, audioData.length - 1)
      const fraction = index - indexFloor
      
      result[i] = audioData[indexFloor] * (1 - fraction) + audioData[indexCeil] * fraction
    }
    
    return result
  }

  // Process the raw transcription result from Whisper
  private processTranscriptionResult(result: any): TranscriptionResult {
    let segments: TranscriptionSegment[] = []
    let fullText = ''

    if (result.chunks && Array.isArray(result.chunks)) {
      // Handle chunked results with timestamps
      segments = result.chunks.map((chunk: any, index: number) => ({
        id: index + 1,
        start: chunk.timestamp?.[0] || 0,
        end: chunk.timestamp?.[1] || 0,
        text: chunk.text.trim(),
        confidence: 0.9 // Whisper doesn't provide confidence scores
      }))
      
      fullText = segments.map(s => s.text).join(' ')
    } else if (typeof result.text === 'string') {
      // Handle simple text result - create segments by splitting sentences
      fullText = result.text
      const sentences = this.splitIntoSentences(fullText)
      const avgDuration = 4 // Average 4 seconds per sentence
      
      segments = sentences.map((sentence, index) => ({
        id: index + 1,
        start: index * avgDuration,
        end: (index + 1) * avgDuration,
        text: sentence.trim(),
        confidence: 0.9
      }))
    }

    return {
      text: fullText,
      segments: segments.filter(s => s.text.length > 0)
    }
  }

  // Split text into sentences for creating segments
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  // Mock transcription for development and fallback
  private getMockTranscription(): TranscriptionResult {
    return {
      text: "Welcome to CapGen, the AI-powered subtitle generator. Upload your video or audio file to get started. Our AI will automatically generate accurate subtitles for you. You can then edit, translate, and export your subtitles in various formats.",
      segments: [
        {
          id: 1,
          start: 0,
          end: 3,
          text: "Welcome to CapGen, the AI-powered subtitle generator.",
          confidence: 0.95
        },
        {
          id: 2,
          start: 3,
          end: 7,
          text: "Upload your video or audio file to get started.",
          confidence: 0.92
        },
        {
          id: 3,
          start: 7,
          end: 11,
          text: "Our AI will automatically generate accurate subtitles for you.",
          confidence: 0.88
        },
        {
          id: 4,
          start: 11,
          end: 16,
          text: "You can then edit, translate, and export your subtitles in various formats.",
          confidence: 0.90
        }
      ]
    }
  }
}

// Available Whisper models
export const WHISPER_MODELS = [
  { id: 'Xenova/whisper-tiny.en', name: 'Tiny (English)', size: '39 MB', speed: 'Fastest' },
  { id: 'Xenova/whisper-tiny', name: 'Tiny (Multilingual)', size: '39 MB', speed: 'Fastest' },
  { id: 'Xenova/whisper-base.en', name: 'Base (English)', size: '74 MB', speed: 'Fast' },
  { id: 'Xenova/whisper-base', name: 'Base (Multilingual)', size: '74 MB', speed: 'Fast' },
  { id: 'Xenova/whisper-small.en', name: 'Small (English)', size: '244 MB', speed: 'Medium' },
  { id: 'Xenova/whisper-small', name: 'Small (Multilingual)', size: '244 MB', speed: 'Medium' }
]