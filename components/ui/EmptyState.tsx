interface EmptyStateProps {
  type: 'no-lessons' | 'no-words' | 'no-activity' | 'completed' | 'search'
  title: string
  subtitle?: string
  action?: { label: string; href: string }
}

const ILLUSTRATIONS: Record<string, string> = {
  'no-lessons': `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="20" width="140" height="100" rx="12" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" stroke-width="1.5"/>
    <rect x="50" y="40" width="80" height="8" rx="4" fill="rgba(99,102,241,0.4)"/>
    <rect x="50" y="56" width="100" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
    <rect x="50" y="70" width="90" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
    <rect x="50" y="84" width="70" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
    <circle cx="155" cy="115" r="25" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" stroke-width="1.5"/>
    <path d="M147 115 l6 6 l10-10" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'no-words': `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="70" height="90" rx="10" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" stroke-width="1.5"/>
    <rect x="110" y="45" width="70" height="70" rx="10" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" stroke-width="1.5"/>
    <rect x="32" y="50" width="46" height="5" rx="2.5" fill="rgba(139,92,246,0.5)"/>
    <rect x="32" y="62" width="38" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
    <rect x="32" y="73" width="42" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
    <text x="125" y="88" font-family="serif" font-size="28" fill="rgba(99,102,241,0.6)">A</text>
    <circle cx="160" cy="48" r="8" fill="rgba(99,102,241,0.3)"/>
    <text x="157" y="52" font-size="10" fill="#6366f1">+</text>
  </svg>`,

  'no-activity': `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="100" width="20" height="40" rx="4" fill="rgba(99,102,241,0.2)"/>
    <rect x="50" y="80" width="20" height="60" rx="4" fill="rgba(99,102,241,0.3)"/>
    <rect x="80" y="60" width="20" height="80" rx="4" fill="rgba(99,102,241,0.4)"/>
    <rect x="110" y="70" width="20" height="70" rx="4" fill="rgba(99,102,241,0.35)"/>
    <rect x="140" y="50" width="20" height="90" rx="4" fill="rgba(99,102,241,0.5)"/>
    <line x1="15" y1="145" x2="185" y2="145" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <circle cx="100" cy="30" r="15" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.4)" stroke-width="1.5"/>
    <text x="93" y="36" font-size="14">&#x26A1;</text>
  </svg>`,

  'completed': `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="75" r="50" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" stroke-width="2"/>
    <path d="M75 75 l18 18 l32-32" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="55" cy="30" r="6" fill="rgba(245,158,11,0.4)"/>
    <circle cx="150" cy="25" r="4" fill="rgba(99,102,241,0.4)"/>
    <circle cx="165" cy="120" r="5" fill="rgba(139,92,246,0.4)"/>
    <circle cx="35" cy="120" r="3" fill="rgba(6,182,212,0.4)"/>
  </svg>`,

  'search': `<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="88" cy="72" r="40" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.25)" stroke-width="2"/>
    <circle cx="88" cy="72" r="28" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.15)" stroke-width="1.5"/>
    <line x1="118" y1="102" x2="145" y2="129" stroke="rgba(99,102,241,0.4)" stroke-width="3" stroke-linecap="round"/>
    <line x1="76" y1="60" x2="76" y2="84" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
    <line x1="64" y1="72" x2="88" y2="72" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
  </svg>`
}

export function EmptyState({ type, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-48 h-36 mb-6 opacity-90"
        dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[type] }}
      />
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      {subtitle && <p className="text-[#64748b] text-sm max-w-xs mb-6">{subtitle}</p>}
      {action && (
        <a
          href={action.href}
          className="px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e8] text-white text-sm font-medium rounded-xl transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  )
}
