import React, { useCallback, useState } from 'react'
import { Upload, Video, FileAudio, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { WhisperTranscriber } from '../lib/whisper'
import { Subtitle } from './SubtitleEditor'

interface VideoUploaderProps {
  onSubtitlesGenerated: (subtitles: Subtitle[]) => void
}

export function VideoUploader({ onSubtitlesGenerated }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcriber] = useState(() => new WhisperTranscriber())

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('audio/'))) {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setIsProcessing(false)
  }

  const processFile = async () => {
    if (!file) return
    
    setIsProcessing(true)
    
    try {
      console.log('Processing file:', file.name)
      
      // Use Whisper transcription - this will now actually work
      const transcriptionResult = await transcriber.transcribeClientSide(file)
      
      // Convert transcription segments to Subtitle format
      const generatedSubtitles: Subtitle[] = transcriptionResult.segments.map(segment => ({
        id: segment.id.toString(),
        startTime: Math.floor(segment.start),
        endTime: Math.floor(segment.end),
        text: segment.text.trim(),
        translatedText: ''
      }))
      
      // Update subtitles in parent component
      onSubtitlesGenerated(generatedSubtitles)
      
      setIsProcessing(false)
    } catch (error) {
      console.error('Transcription failed:', error)
      setIsProcessing(false)
      
      // Show error to user
      alert('Transcription failed. Please try again with a different file or check your internet connection.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Video or Audio</h3>
      
      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 mb-2">
            Drop your video or audio file here
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Supports MP4, MP3, WAV, and more
          </p>
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {file.type.startsWith('video/') ? (
                <Video className="w-8 h-8 text-blue-600" />
              ) : (
                <FileAudio className="w-8 h-8 text-green-600" />
              )}
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <motion.button
            onClick={processFile}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Generating Subtitles...</span>
              </div>
            ) : (
              'Generate Subtitles'
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}