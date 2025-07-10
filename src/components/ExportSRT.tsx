import React, { useState } from 'react'
import { Download, FileText, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const EXPORT_FORMATS = [
  { id: 'srt', name: 'SRT', description: 'SubRip Subtitle' },
  { id: 'vtt', name: 'VTT', description: 'WebVTT' },
  { id: 'txt', name: 'TXT', description: 'Plain Text' }
]

export function ExportSRT() {
  const [selectedFormat, setSelectedFormat] = useState('srt')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    // TODO: Implement actual export logic
    console.log('Exporting as:', selectedFormat)
    
    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      setExported(true)
      
      // Reset exported state after 2 seconds
      setTimeout(() => setExported(false), 2000)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Export Subtitles
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
          <div className="space-y-2">
            {EXPORT_FORMATS.map((format) => (
              <label
                key={format.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {selectedFormat === format.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{format.name}</div>
                  <div className="text-sm text-slate-500">{format.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            exported
              ? 'bg-green-600 text-white'
              : isExporting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
          }`}
          whileHover={!isExporting && !exported ? { scale: 1.02 } : {}}
          whileTap={!isExporting && !exported ? { scale: 0.98 } : {}}
        >
          {exported ? (
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Exported Successfully!</span>
            </div>
          ) : isExporting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export {selectedFormat.toUpperCase()}</span>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  )
}