import { motion } from 'framer-motion'

export function MiniMonster() {
  return (
    <motion.div
      className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        animate={{ 
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <span className="text-white text-xs font-bold">👾</span>
      </motion.div>
      <span className="text-sm font-medium text-purple-700">Mini Monster</span>
    </motion.div>
  )
}