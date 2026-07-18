'use client'
import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGenerate } from '@/hooks/useAIGenerate'

interface Template {
  id: string
  title: string
  type: string
  level: string
  description: string
  structure: { label: string; placeholder: string; example: string }[]
  tips: string[]
  wordCount: string
}

const TEMPLATES: Template[] = [
  {
    id: 'ielts-opinion',
    title: 'IELTS Opinion Essay',
    type: 'IELTS',
    level: 'B2-C1',
    description: 'Task 2 — эссе с мнением',
    wordCount: '250+ слов',
    tips: [
      'Чётко выражай свою позицию с первого абзаца',
      'Используй linking words: Furthermore, However, In conclusion',
      'Приводи конкретные примеры',
      'Избегай слов "I think" — используй "It is argued that"',
    ],
    structure: [
      { label: 'Introduction', placeholder: 'Перефразируй вопрос + выражи позицию...', example: 'In recent years, [TOPIC] has become a subject of considerable debate. While some argue that [COUNTER], I firmly believe that [YOUR POSITION].' },
      { label: 'Body Paragraph 1 — Main argument', placeholder: 'Главный аргумент + пример...', example: 'The most compelling reason for [POSITION] is [ARGUMENT]. For instance, [SPECIFIC EXAMPLE]. This clearly demonstrates that [CONCLUSION].' },
      { label: 'Body Paragraph 2 — Second argument', placeholder: 'Второй аргумент + пример...', example: 'Furthermore, [SECOND ARGUMENT]. Research has shown that [EVIDENCE]. Consequently, [RESULT].' },
      { label: 'Conclusion', placeholder: 'Итог + повтор позиции...', example: 'In conclusion, while [ACKNOWLEDGE OTHER SIDE], I maintain that [RESTATE POSITION]. It is essential that [RECOMMENDATION].' },
    ],
  },
  {
    id: 'formal-email',
    title: 'Деловое письмо',
    type: 'Business',
    level: 'B1-B2',
    description: 'Formal email / Business letter',
    wordCount: '150-200 слов',
    tips: [
      'Начинай с Dear Mr/Ms + фамилия (если знаешь) или Dear Sir/Madam',
      'Первое предложение — цель письма',
      'Один абзац — одна мысль',
      'Заканчивай: Yours sincerely (знаешь имя) / Yours faithfully (не знаешь)',
    ],
    structure: [
      { label: 'Subject line', placeholder: 'Тема письма...', example: 'Re: Application for Marketing Manager Position' },
      { label: 'Opening', placeholder: 'Приветствие и цель...', example: 'Dear Ms Johnson,\n\nI am writing with reference to [REASON]. I would like to [PURPOSE].' },
      { label: 'Main body', placeholder: 'Основная информация...', example: 'As you can see from my attached CV, I have [X years] of experience in [FIELD]. In my current role at [COMPANY], I have been responsible for [RESPONSIBILITIES].' },
      { label: 'Request / Call to action', placeholder: 'Что ты просишь сделать...', example: 'I would be grateful if you could [REQUEST]. Please do not hesitate to contact me if you require any further information.' },
      { label: 'Closing', placeholder: 'Завершение...', example: 'I look forward to hearing from you.\n\nYours sincerely,\n[YOUR NAME]' },
    ],
  },
  {
    id: 'complaint-letter',
    title: 'Письмо-жалоба',
    type: 'Business',
    level: 'B1',
    description: 'Complaint letter / email',
    wordCount: '150-180 слов',
    tips: [
      'Будь вежлив, даже если недоволен',
      'Чётко опиши проблему с датой и деталями',
      'Скажи что ты хочешь (возврат, замена, извинение)',
      'Не используй агрессивный тон',
    ],
    structure: [
      { label: 'Opening', placeholder: 'Цель письма...', example: 'I am writing to express my dissatisfaction with [PRODUCT/SERVICE] that I purchased/received on [DATE].' },
      { label: 'Problem description', placeholder: 'Опиши проблему...', example: 'The [ITEM/SERVICE] was [DESCRIBE PROBLEM]. This is unacceptable because [REASON]. I have enclosed [RECEIPT/PHOTO] as evidence.' },
      { label: 'Desired resolution', placeholder: 'Что ты хочешь...', example: 'I would appreciate it if you could [REFUND/REPLACE/REPAIR] as soon as possible. I would also expect an apology for the inconvenience caused.' },
      { label: 'Closing', placeholder: 'Завершение...', example: 'I look forward to your prompt response. Please contact me at [EMAIL/PHONE].\n\nYours faithfully,\n[NAME]' },
    ],
  },
  {
    id: 'ielts-advantages',
    title: 'IELTS Advantages/Disadvantages',
    type: 'IELTS',
    level: 'B2',
    description: 'Task 2 — плюсы и минусы',
    wordCount: '250+ слов',
    tips: [
      'Посвяти один абзац плюсам, один — минусам',
      'В заключении выражай своё мнение',
      'Используй: On the one hand... On the other hand...',
      'Linking words: Although, Despite, Nevertheless, Whereas',
    ],
    structure: [
      { label: 'Introduction', placeholder: 'Вступление...', example: 'The question of [TOPIC] has sparked much discussion. This essay will examine the advantages and disadvantages of [TOPIC] before reaching a conclusion.' },
      { label: 'Advantages paragraph', placeholder: 'Плюсы...', example: 'On the one hand, [ADVANTAGE 1]. This is beneficial because [REASON]. Moreover, [ADVANTAGE 2], which means that [IMPACT].' },
      { label: 'Disadvantages paragraph', placeholder: 'Минусы...', example: 'On the other hand, there are clear drawbacks. First, [DISADVANTAGE 1]. Furthermore, [DISADVANTAGE 2], which can lead to [NEGATIVE CONSEQUENCE].' },
      { label: 'Conclusion', placeholder: 'Заключение с мнением...', example: 'In conclusion, while [TOPIC] offers [BENEFITS], the [DRAWBACKS] cannot be ignored. Overall, I believe that [YOUR OPINION].' },
    ],
  },
  {
    id: 'business-email-request',
    title: 'Business Request Email',
    type: 'Business Email',
    level: 'B1',
    description: 'Formal email requesting information, meeting, or action',
    wordCount: '150–250',
    tips: ['Use formal salutation (Dear Mr/Ms)', 'State purpose in first sentence', 'Be specific about what you need', 'Include deadline if applicable', 'End with clear call to action'],
    structure: [
      { label: 'Subject Line', placeholder: 'Request for...', example: 'Request for Project Proposal Meeting' },
      { label: 'Salutation', placeholder: 'Dear...', example: 'Dear Ms Johnson,' },
      { label: 'Opening — State purpose', placeholder: 'I am writing to...', example: 'I am writing to request a brief meeting to discuss the Q4 marketing proposal.' },
      { label: 'Details — Provide context', placeholder: 'As you may know...', example: 'As you may know, our team has been working on the campaign for the past month and we would value your input.' },
      { label: 'Request — Be specific', placeholder: 'I would appreciate if...', example: 'I would appreciate if you could spare 30 minutes this week, preferably on Thursday or Friday.' },
      { label: 'Closing', placeholder: 'I look forward to...', example: 'I look forward to your response. Please do not hesitate to contact me if you need any further information.' },
      { label: 'Sign-off', placeholder: 'Yours sincerely / Best regards,', example: 'Yours sincerely,\n[Your Name]' },
    ],
  },
  {
    id: 'business-email-complaint',
    title: 'Complaint Email',
    type: 'Business Email',
    level: 'B2',
    description: 'Professional complaint about a product, service, or situation',
    wordCount: '200–300',
    tips: ['Remain professional and factual', 'State the problem clearly', 'Provide order/reference numbers', 'Say what resolution you expect', 'Set a reasonable deadline'],
    structure: [
      { label: 'Subject Line', placeholder: 'Complaint regarding...', example: 'Complaint Regarding Order #12345 — Damaged Goods' },
      { label: 'Salutation', placeholder: 'Dear...', example: 'Dear Customer Service Team,' },
      { label: 'Opening — State the issue', placeholder: 'I am writing to express my dissatisfaction...', example: 'I am writing to express my dissatisfaction with my recent order (Reference: #12345) placed on 10 July 2026.' },
      { label: 'Description — What happened', placeholder: 'When I received...', example: 'When I received the package, I discovered that two of the items were damaged beyond use. The packaging showed no signs of mishandling.' },
      { label: 'Impact — Why it matters', placeholder: 'As a result...', example: 'As a result, I was unable to complete my project on time, which caused significant inconvenience.' },
      { label: 'Resolution — What you want', placeholder: 'I would like to request...', example: 'I would like to request either a full replacement or a refund for the damaged items within 7 business days.' },
      { label: 'Closing', placeholder: 'I trust this matter...', example: 'I trust this matter will be resolved promptly. I look forward to your response.' },
      { label: 'Sign-off', placeholder: 'Yours faithfully,', example: 'Yours faithfully,\n[Your Name]' },
    ],
  },
  {
    id: 'business-email-follow-up',
    title: 'Follow-up Email',
    type: 'Business Email',
    level: 'B1',
    description: 'Professional follow-up after a meeting, interview, or unanswered email',
    wordCount: '100–180',
    tips: ['Reference previous contact clearly', 'Be brief and direct', 'Remind without being pushy', 'Offer easy next step', 'Include your contact details'],
    structure: [
      { label: 'Subject Line', placeholder: 'Following up on...', example: 'Following Up on Our Meeting — 15 July' },
      { label: 'Opening — Reference previous contact', placeholder: 'Thank you for...', example: 'Thank you for taking the time to meet with me last Tuesday to discuss the marketing position.' },
      { label: 'Purpose — Why you\'re writing', placeholder: 'I wanted to follow up...', example: 'I wanted to follow up on our conversation and reiterate my strong interest in joining your team.' },
      { label: 'Value add / Reminder', placeholder: 'As discussed...', example: 'As discussed, I have attached my portfolio with the updated campaign examples you requested.' },
      { label: 'Call to action', placeholder: 'Please let me know...', example: 'Please let me know if you need any additional information or if there is anything I can do to support your decision.' },
      { label: 'Closing', placeholder: 'I look forward to...', example: 'I look forward to hearing from you at your earliest convenience.' },
      { label: 'Sign-off', placeholder: 'Best regards,', example: 'Best regards,\n[Your Name]' },
    ],
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter',
    type: 'Business Email',
    level: 'B2',
    description: 'Job application cover letter for any position',
    wordCount: '250–350',
    tips: ['Tailor to specific job/company', 'Show enthusiasm, not desperation', 'Match skills to job requirements', 'Avoid repeating your CV', 'End with confident call to action'],
    structure: [
      { label: 'Opening — Position and source', placeholder: 'I am writing to apply for...', example: 'I am writing to apply for the Senior Marketing Manager position advertised on LinkedIn on 10 July 2026.' },
      { label: 'Why this company', placeholder: 'I am particularly drawn to...', example: 'I am particularly drawn to your company\'s innovative approach to sustainable product development, which aligns with my professional values.' },
      { label: 'Key experience — Match to role', placeholder: 'In my current role at...', example: 'In my current role at TechCorp, I led a team of 8 and increased brand awareness by 40% through targeted digital campaigns.' },
      { label: 'Additional strength', placeholder: 'Furthermore...', example: 'Furthermore, my fluency in English and Russian allows me to manage campaigns across multiple markets effectively.' },
      { label: 'Closing — Confident and actionable', placeholder: 'I would welcome the opportunity...', example: 'I would welcome the opportunity to discuss how my experience can contribute to your team. I am available for an interview at your convenience.' },
      { label: 'Sign-off', placeholder: 'Yours sincerely,', example: 'Yours sincerely,\n[Your Name]' },
    ],
  },
  {
    id: 'informal-email',
    title: 'Неформальное письмо',
    type: 'Personal',
    level: 'A2-B1',
    description: 'Friendly email / letter to a friend',
    wordCount: '120-180 слов',
    tips: [
      'Начинай с Hi / Hey / Dear [first name]',
      "Используй разговорные фразы: How are you? / It was great to hear from you!",
      "Можно сокращения: I'm, don't, can't",
      'Заканчивай: Best wishes / Take care / Love',
    ],
    structure: [
      { label: 'Opening', placeholder: 'Приветствие...', example: "Hi [NAME]!\n\nHow are you? It was so good to hear from you! Sorry I've been so busy lately — life has been crazy!" },
      { label: 'Main news / reason for writing', placeholder: 'Главная новость...', example: "Anyway, the reason I'm writing is [REASON]. I'm so excited/nervous about [EVENT]." },
      { label: 'Questions / responses', placeholder: 'Вопросы другу...', example: "By the way, how did your [EXAM/TRIP/JOB] go? I've been thinking about you! And did you manage to [SOMETHING]?" },
      { label: 'Closing', placeholder: 'Завершение...', example: "Well, I'd better go now — I have to [REASON]. Write back soon!\n\nLots of love,\n[YOUR NAME]" },
    ],
  },
]

export default function WritingTemplatesPage() {
  const [selected, setSelected] = useState<Template | null>(null)
  const [userText, setUserText] = useState<Record<string, string>>({})
  const { generate } = useAIGenerate()
  const [fillLoading, setFillLoading] = useState<string|null>(null)
  async function fillSection(label: string, key: string) {
    setFillLoading(label)
    const ctx = `${selected?.title||'English letter'} - ${label}`
    const data = await generate<{text:string}>('writing_template_section', ctx, selected?.level?.split('-')[0]||'B1')
    if (data?.text) setUserText(p=>({...p,[key]:data.text}))
    setFillLoading(null)
  }
  const [filter, setFilter] = useState('Все')
  const [generating, setGenerating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')

  const types = ['Все', 'IELTS', 'Business', 'Business Email', 'Personal']
  const filtered = TEMPLATES.filter(t => filter === 'Все' || t.type === filter)

  async function generateWithAI() {
    if (!selected) return
    setGenerating(true)
    setAiSuggestion('')
    const filledParts = selected.structure
      .map((s, i) => `${s.label}:\n${userText[`${selected.id}_${i}`] || s.example}`)
      .join('\n\n')

    try {
      const res = await fetch('/api/ai/grammar-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: 'writing feedback',
          type: 'feedback',
          customPrompt: `You are an English writing coach. The student wrote the following ${selected.title}:\n\n${filledParts}\n\nProvide brief feedback in Russian:\n1. Что хорошо (2-3 пункта)\n2. Что улучшить (2-3 пункта)\n3. Исправленная версия introduction (если нужно)\nBe encouraging and specific.`
        }),
      })
      const data = await res.json()
      setAiSuggestion(data.explanation ?? data.examples ?? 'Не удалось получить ответ')
    } catch {
      setAiSuggestion('Ошибка AI. Попробуй снова.')
    } finally {
      setGenerating(false)
    }
  }

  if (selected) return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button onClick={() => { setSelected(null); setUserText({}); setAiSuggestion('') }}
        className="text-muted-foreground hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
        ← Все шаблоны
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{selected.type}</span>
        <span className="text-muted-foreground text-xs">{selected.level} · {selected.wordCount}</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{selected.title}</h1>
      <p className="text-muted-foreground text-sm mb-6">{selected.description}</p>

      {/* Советы */}
      <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl p-4 mb-6">
        <p className="text-[#f59e0b] font-semibold text-sm mb-2">💡 Советы</p>
        <ul className="space-y-1">
          {selected.tips.map((tip, i) => (
            <li key={i} className="text-muted-foreground text-sm flex gap-2">
              <span className="text-[#f59e0b]">·</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Структура */}
      <div className="space-y-4 mb-6">
        {selected.structure.map((part, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-1">{part.label}</p>
            <p className="text-muted-foreground text-xs mb-3 italic">{part.example}</p>
            <textarea
              value={userText[`${selected.id}_${i}`] ?? ''}
              onChange={e => setUserText(prev => ({ ...prev, [`${selected.id}_${i}`]: e.target.value }))}
              placeholder={part.placeholder}
              rows={4}
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white
                placeholder:text-[#334155] outline-none focus:border-primary/50 transition-colors text-sm resize-none"
            />
            <button onClick={()=>fillSection(part.label, `${selected.id}_${i}`)} disabled={fillLoading===part.label}
              className="mt-1 flex items-center gap-1 text-xs text-[#818cf8] hover:text-white disabled:opacity-50 min-h-[36px]">
              {fillLoading===part.label?<><Loader2 className="w-3 h-3 animate-spin"/>Генерирую...</>:<><Sparkles className="w-3 h-3"/>AI заполнить</>}
            </button>
          </div>
        ))}
      </div>

      <button onClick={generateWithAI} disabled={generating}
        className="w-full py-4 bg-primary hover:bg-[#5558e8] disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors mb-4">
        {generating ? '⏳ AI анализирует...' : '✨ Получить AI-обратную связь'}
      </button>

      {aiSuggestion && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
          <p className="text-primary font-semibold text-sm mb-3">AI Обратная связь</p>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">{aiSuggestion}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Шаблоны для письма</h1>
      <p className="text-muted-foreground text-sm mb-6">IELTS · деловые письма · жалобы · эссе</p>

      <div className="flex gap-2 mb-6">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === t ? 'bg-primary border-primary text-white' : 'bg-white/[0.04] border-white/10 text-muted-foreground hover:text-white'
            }`}>{t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(t => (
          <button key={t.id} onClick={() => setSelected(t)}
            className="text-left bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.type}</span>
              <span className="text-muted-foreground text-xs">{t.level}</span>
            </div>
            <p className="text-white font-semibold group-hover:text-[#a5b4fc] transition-colors">{t.title}</p>
            <p className="text-muted-foreground text-sm mt-1">{t.description}</p>
            <p className="text-muted-foreground text-xs mt-2">{t.wordCount}</p>
                 </button>
        ))}
      </div>
    </div>
  );
}
