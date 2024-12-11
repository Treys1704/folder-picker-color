import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const colors = [
  { id: 1, value: "#ef4444" },  // red
  { id: 2, value: "#f97316" },  // orange
  { id: 3, value: "#eab308" },  // yellow
  { id: 4, value: "#0ea5e9" },  // blue
  { id: 5, value: "#22c55e" },  // green
  { id: 6, value: "#a855f7" },  // purple
  { id: 7, value: "#171717" },  // black
]

export default function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [animatingColor, setAnimatingColor] = useState<string | null>(null)
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 })
  const [folderPosition, setFolderPosition] = useState({ x: 0, y: 0 })

  const handleColorSelect = (color: typeof colors[0]) => {
    // Get the positions for animation
    const colorElement = document.getElementById(`color-${color.id}`)
    const folderElement = document.getElementById("folder")
    
    if (colorElement && folderElement) {
      const colorRect = colorElement.getBoundingClientRect()
      const folderRect = folderElement.getBoundingClientRect()
      
      setDotPosition({
        x: colorRect.left + colorRect.width / 2,
        y: colorRect.top + colorRect.height / 2
      })
      
      setFolderPosition({
        x: folderRect.left + folderRect.width / 2,
        y: folderRect.top + folderRect.height / 2
      })
    }

    setAnimatingColor(color.value)
    
    // After the jumping animation, update the folder color
    setTimeout(() => {
      setSelectedColor(color)
      setAnimatingColor(null)
    }, 500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gray-100">
      {/* Folder */}
      <div className="relative w-64 h-48" id="folder">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: selectedColor.value,
            clipPath: "path('M 0 25 L 25 0 H 240 L 255 25 V 190 H 0 Z')",
          }}
          initial={false}
          animate={{ backgroundColor: selectedColor.value }}
          transition={{ duration: 0.3 }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            clipPath: "path('M 0 25 L 25 0 H 240 L 255 25 H 0 Z')",
            backgroundColor: "black",
          }}
        />
      </div>

      {/* Color Picker */}
      <div className="flex gap-4 items-center">
        {colors.map((color) => (
          <motion.button
            key={color.id}
            id={`color-${color.id}`}
            className="relative w-8 h-8 rounded-full focus:outline-none"
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorSelect(color)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedColor.id === color.id && (
              <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                  border: `2px solid ${color.value}`,
                }}
                layoutId="colorIndicator"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Jumping Color Dot Animation */}
      <AnimatePresence>
        {animatingColor && (
          <motion.div
            className="fixed w-4 h-4 rounded-full"
            style={{
              backgroundColor: animatingColor,
              position: "fixed",
              left: dotPosition.x,
              top: dotPosition.y,
              marginLeft: "-8px",
              marginTop: "-8px",
            }}
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1, 1, 0],
              x: [0, 0, folderPosition.x - dotPosition.x],
              y: [0, -100, folderPosition.y - dotPosition.y],
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.3, 0.7, 1],
              ease: "linear",
            }}
            onAnimationComplete={() => setAnimatingColor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

