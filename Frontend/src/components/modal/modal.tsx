import React from "react"

interface ModalProps {
  children: React.ReactNode
  className?: string
}

const Modal = ({ children, className = "max-w-5xl" }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full ${className} overflow-hidden animate-in zoom-in-95`}>
        {children}
      </div>
    </div>
  )
}

export default Modal
