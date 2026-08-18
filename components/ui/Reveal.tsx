'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/** Плавное появление блока при попадании во вьюпорт. */
export function Reveal({
  children, delay = 0, y = 16, className = '',
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Контейнер со stagger-появлением детей. Оборачивай элементы в <RevealItem>. */
export function RevealStagger({
  children, className = '', gap = 0.07,
}: { children: ReactNode; className?: string; gap?: number }) {
  const reduce = useReducedMotion()
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : gap } },
  }
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/** Элемент внутри <RevealStagger>. */
export function RevealItem({
  children, className = '',
}: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={revealItem}>{children}</motion.div>
}
