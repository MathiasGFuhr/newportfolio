import { motion } from 'framer-motion'

interface MenuButtonProps {
  isOpen: boolean
  toggle: () => void
}

export const MenuButton = ({ isOpen, toggle }: MenuButtonProps) => {
  const variant = isOpen ? "opened" : "closed"

  const top = {
    closed: {
      rotate: 0,
      translateY: 0,
      transition: { duration: 0.2 }
    },
    opened: {
      rotate: 45,
      translateY: 6,
      transition: { duration: 0.2 }
    }
  }

  const center = {
    closed: {
      opacity: 1,
      transition: { duration: 0.2 }
    },
    opened: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const bottom = {
    closed: {
      rotate: 0,
      translateY: 0,
      transition: { duration: 0.2 }
    },
    opened: {
      rotate: -45,
      translateY: -6,
      transition: { duration: 0.2 }
    }
  }

  const lineProps = {
    stroke: "white",
    strokeWidth: 2,
    vectorEffect: "non-scaling-stroke",
    initial: "closed",
    animate: variant
  }

  return (
    <motion.button
      className="flex justify-center items-center w-12 h-12 rounded-full bg-orange-500 md:hidden"
      onClick={toggle}
      animate={variant}
      aria-label="Menu"
      initial={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.line
          x1="4" x2="20" y1="6" y2="6"
          variants={top}
          {...lineProps}
        />
        <motion.line
          x1="4" x2="20" y1="12" y2="12"
          variants={center}
          {...lineProps}
        />
        <motion.line
          x1="4" x2="20" y1="18" y2="18"
          variants={bottom}
          {...lineProps}
        />
      </svg>
    </motion.button>
  )
} 