import { Edit3, Clock, Type } from 'lucide-react'
import { motion } from 'framer-motion'

export interface Subtitle {
  id: string
  startTime: number
  endTime: number
  text: string
  translatedText?: string
}

interface SubtitleEditorProps {
  subtitles: Subtitle[]
  setSubtitles: React.Dispatch<React.SetStateAction<Subtitle[]>>
}

export function SubtitleEditor({ subtitles, setSubtitles }: SubtitleEditorProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateSubtitle = (id: string, field: keyof Subtitle, value: string | number) => {
    setSubtitles(prev => prev.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Edit3 className="w-5 h-5 mr-2" />
          Subtitle Editor
        </h3>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Type className="w-4 h-4" />
          <span>{subtitles.length} subtitles</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {subtitles.map((subtitle, index) => (
          <motion.div
            key={subtitle.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <input
                    type="number"
                    value={subtitle.startTime}
                    onChange={(e) => updateSubtitle(subtitle.id, 'startTime', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-center"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={subtitle.endTime}
                    onChange={(e) => updateSubtitle(subtitle.id, 'endTime', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-center"
                    min="0"
                  />
                  <span className="text-slate-400">
                    ({formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Original</label>
                <textarea
                  value={subtitle.text}
                  onChange={(e) => updateSubtitle(subtitle.id, 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Enter subtitle text..."
                />
              </div>

              {subtitle.translatedText !== undefined && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Translation</label>
                  <textarea
                    value={subtitle.translatedText}
                    onChange={(e) => updateSubtitle(subtitle.id, 'translatedText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="Translation will appear here..."
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {subtitles.length === 0 && (
        <div className="text-center py-12">
          <Edit3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No subtitles generated yet</p>
          <p className="text-sm text-slate-400">Upload a file to get started</p>
        </div>
      )}
    </div>
  )
}