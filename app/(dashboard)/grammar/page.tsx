'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, Volume2 } from 'lucide-react'
import { speak } from '@/lib/speech'

interface GrammarCard {
  id: string
  level: string
  title: string
  rule: string
  examples: Array<{ correct: string; wrong: string; note: string }>
  tip: string
}

const GRAMMAR_CARDS: GrammarCard[] = [
  // A1
  {
    id: 'g-a1-1', level: 'A1', title: 'To Be (Present)',
    rule: 'Глагол "to be" спрягается по лицам: I AM, you/we/they ARE, he/she/it IS. В отрицании добавляем NOT: am not, is not (isn\'t), are not (aren\'t).',
    examples: [
      { correct: 'She is a doctor.', wrong: 'She are a doctor.', note: 'С he/she/it всегда IS' },
      { correct: 'I am not tired.', wrong: 'I is not tired.', note: 'С I всегда AM' },
      { correct: 'They are happy.', wrong: 'They is happy.', note: 'С they всегда ARE' },
    ],
    tip: 'Запомни: IS = один человек (he/she/it). ARE = несколько (you/we/they).',
  },
  {
    id: 'g-a1-2', level: 'A1', title: 'Articles a / an / the',
    rule: '"A" употребляется перед согласными звуками, "an" — перед гласными. "The" — конкретный предмет, уже известный. Без артикля — множественное число в обобщении.',
    examples: [
      { correct: 'I saw a dog.', wrong: 'I saw an dog.', note: '"dog" начинается с согласного звука' },
      { correct: 'She is an engineer.', wrong: 'She is a engineer.', note: '"engineer" начинается с гласного /ɛ/' },
      { correct: 'The dog is in the garden.', wrong: 'A dog is in a garden.', note: 'Уже упомянутый предмет' },
    ],
    tip: 'Правило — про ЗВУК, а не букву. "A university" (звук /j/), "an hour" (звук /aʊ/).',
  },
  {
    id: 'g-a1-3', level: 'A1', title: 'Present Simple',
    rule: 'Present Simple описывает привычки и факты. Форма: V (глагол) или V+s для he/she/it. Отрицание: don\'t / doesn\'t + V. Вопрос: Do/Does + S + V?',
    examples: [
      { correct: 'He works at 9.', wrong: 'He work at 9.', note: 'Добавляем -s для he/she/it' },
      { correct: 'She doesn\'t eat meat.', wrong: 'She don\'t eat meat.', note: 'С she/he/it — doesn\'t' },
      { correct: 'Do you speak French?', wrong: 'Does you speak French?', note: 'С you — Do' },
    ],
    tip: '"Does" уже содержит -s. Поэтому после "does" глагол без окончания: Does she go? (НЕ goes!)',
  },
  {
    id: 'g-a1-4', level: 'A1', title: 'There is / There are',
    rule: '"There is" — единственное число. "There are" — множественное. В вопросе: Is there...? / Are there...? Отрицание: There isn\'t / There aren\'t.',
    examples: [
      { correct: 'There is a book on the table.', wrong: 'There are a book on the table.', note: 'book — одно, значит is' },
      { correct: 'Are there any chairs?', wrong: 'Is there any chairs?', note: 'chairs — множественное' },
      { correct: 'There isn\'t any milk.', wrong: 'There aren\'t any milk.', note: 'milk — неисчисляемое, is' },
    ],
    tip: '"There is" / "There are" переводится как "есть / имеется". Не путай с "It is"!',
  },
  {
    id: 'g-a1-5', level: 'A1', title: 'Have got',
    rule: '"Have got" = to have (иметь). Форма: I/you/we/they have got. He/she/it has got. Отрицание: haven\'t/hasn\'t got. Вопрос: Have/Has...got?',
    examples: [
      { correct: 'She has got a cat.', wrong: 'She have got a cat.', note: 'С she/he/it — has got' },
      { correct: 'Have you got a pen?', wrong: 'Has you got a pen?', note: 'С you — have' },
      { correct: 'I haven\'t got a car.', wrong: 'I hasn\'t got a car.', note: 'С I — haven\'t' },
    ],
    tip: '"Have got" = "have" в British English. В American English обычно просто "have".',
  },
  // A2
  {
    id: 'g-a2-1', level: 'A2', title: 'Past Simple',
    rule: 'Past Simple — завершённые действия в прошлом. Правильные глаголы: V+ed. Неправильные — 2-я форма. Отрицание: didn\'t + V (основная форма). Вопрос: Did + S + V?',
    examples: [
      { correct: 'She visited Paris last year.', wrong: 'She visit Paris last year.', note: 'Правильный глагол +ed' },
      { correct: 'I didn\'t go to school.', wrong: 'I didn\'t went to school.', note: 'После didn\'t — основная форма' },
      { correct: 'Did you see him?', wrong: 'Did you saw him?', note: 'После Did — основная форма' },
    ],
    tip: 'Распространённая ошибка: "didn\'t went". После did/didn\'t всегда инфинитив без to.',
  },
  {
    id: 'g-a2-2', level: 'A2', title: 'Comparatives & Superlatives',
    rule: 'Сравнительная степень: короткие прилагательные +er (bigger), длинные — more (more interesting). Превосходная: the +est (the biggest) или the most (the most interesting).',
    examples: [
      { correct: 'This is more expensive.', wrong: 'This is expensiver.', note: '3+ слога — used more' },
      { correct: 'She is the tallest in class.', wrong: 'She is the most tall.', note: 'tall — короткое, +est' },
      { correct: 'Today is hotter than yesterday.', wrong: 'Today is more hot.', note: 'hot: согласная удваивается' },
    ],
    tip: 'Двусложные прил. типа "happy, clever" — могут быть обоими способами: happier или more happy.',
  },
  {
    id: 'g-a2-3', level: 'A2', title: 'Future: will / going to',
    rule: '"Will" — спонтанные решения и предсказания. "Going to" — запланированные действия или предсказания на основе признаков.',
    examples: [
      { correct: 'I\'ll help you! (спонтанно)', wrong: 'I\'m going to help you! (если только что решил)', note: 'Решение принято в момент речи' },
      { correct: 'Look at the clouds. It\'s going to rain.', wrong: 'It will rain. (без признаков)', note: 'Видим признаки дождя' },
      { correct: 'I\'m going to study tonight. (план)', wrong: 'I\'ll study tonight.', note: 'Заранее запланировано' },
    ],
    tip: 'Запомни: увидел признак→ going to. Угадал/ предсказал → will.',
  },
  {
    id: 'g-a2-4', level: 'A2', title: 'Present Continuous',
    rule: 'Образование: am/is/are + V-ing. Употребление: действие прямо сейчас, временная ситуация, запланированное будущее. НЕ используется с глаголами состояния (know, like, want).',
    examples: [
      { correct: 'She is cooking dinner now.', wrong: 'She cooks dinner now.', note: 'Действие происходит сейчас' },
      { correct: 'I know him well.', wrong: 'I am knowing him well.', note: 'know — глагол состояния' },
      { correct: 'We are meeting tomorrow.', wrong: 'We meet tomorrow.', note: 'Договоренность на будущее' },
    ],
    tip: 'Глаголы состояния: know, believe, want, need, like, love, hate, understand, contain, belong.',
  },
  {
    id: 'g-a2-5', level: 'A2', title: 'Modal Verbs: can, must, should',
    rule: 'Modal verbs не изменяются и идут с инфинитивом без "to". Can — умение/разрешение. Must — необходимость. Should — совет/рекомендация.',
    examples: [
      { correct: 'She can swim.', wrong: 'She cans swim.', note: 'Модальные не спрягаются' },
      { correct: 'You should go to the doctor.', wrong: 'You should to go.', note: 'После модального — без "to"' },
      { correct: 'I must finish this.', wrong: 'I must to finish this.', note: 'must + инфинитив без to' },
    ],
    tip: 'После всех модальных глаголов (can, must, should, will, may, might) — инфинитив БЕЗ "to".',
  },
  // B1
  {
    id: 'g-b1-1', level: 'B1', title: 'Present Perfect',
    rule: 'Have/has + Past Participle (V3). Связывает прошлое с настоящим: результат важен сейчас. Маркеры: just, already, yet, ever, never, recently, since, for.',
    examples: [
      { correct: 'I have just finished.', wrong: 'I just finished.', note: '"just" тяготеет к Present Perfect в BE' },
      { correct: 'Have you ever been to Japan?', wrong: 'Did you ever go to Japan?', note: '"ever" с PP в вопросах' },
      { correct: 'She has lived here for 5 years.', wrong: 'She lives here for 5 years.', note: 'for + период → Present Perfect' },
    ],
    tip: 'Past Simple = конкретный момент в прошлом (yesterday, in 2020). Present Perfect = без точного времени.',
  },
  {
    id: 'g-b1-2', level: 'B1', title: 'Past Continuous',
    rule: 'Was/were + V-ing. Действие в процессе в определённый момент прошлого. Часто используется с Past Simple для прерванного действия (while/when).',
    examples: [
      { correct: 'I was reading when she called.', wrong: 'I read when she was calling.', note: 'Длительное прерывается кратким' },
      { correct: 'While they were sleeping, I worked.', wrong: 'While they slept, I was working.', note: 'while + длительное = was sleeping' },
      { correct: 'It was raining all morning.', wrong: 'It rained all morning.', note: 'Акцент на процессе, не результате' },
    ],
    tip: '"When" + короткое событие → Past Simple. "While" + длительный процесс → Past Continuous.',
  },
  {
    id: 'g-b1-3', level: 'B1', title: 'Second Conditional',
    rule: 'If + Past Simple, would + V. Воображаемые/маловероятные ситуации в настоящем или будущем. НЕ используй "would" в if-клаузе.',
    examples: [
      { correct: 'If I had a car, I would drive to work.', wrong: 'If I would have a car...', note: 'После if — Past Simple, не would' },
      { correct: 'She would travel more if she were rich.', wrong: 'She would travel more if she was rich.', note: 'Формально — were для всех лиц' },
      { correct: 'What would you do if you lost your job?', wrong: 'What would you do if you would lose?', note: '"would" только в главной части' },
    ],
    tip: '"If I were you..." — устойчивая фраза для советов. Were, не was!',
  },
  {
    id: 'g-b1-4', level: 'B1', title: 'Reported Speech',
    rule: 'Прямая речь → косвенная: сдвиг времени назад. is→was, am→was, will→would, can→could. Местоимения также меняются.',
    examples: [
      { correct: '"I am tired." → She said she was tired.', wrong: 'She said she is tired.', note: 'is → was при переносе' },
      { correct: '"I will call." → He said he would call.', wrong: 'He said he will call.', note: 'will → would' },
      { correct: '"I can help." → She said she could help.', wrong: 'She said she can help.', note: 'can → could' },
    ],
    tip: 'Если reporting verb (said, told) в прошедшем → всё внутри сдвигается назад.',
  },
  {
    id: 'g-b1-5', level: 'B1', title: 'Passive Voice',
    rule: 'Страдательный залог: am/is/are/was/were + Past Participle (V3). Используется когда деятель неизвестен, неважен или ясен из контекста.',
    examples: [
      { correct: 'The window was broken.', wrong: 'The window was broke.', note: 'Нужна форма V3 (broken)' },
      { correct: 'English is spoken worldwide.', wrong: 'English is speaking worldwide.', note: '-ing недопустим в пассиве' },
      { correct: 'The report will be finished by Friday.', wrong: 'The report will finish by Friday.', note: 'Пассив будущего: will be + V3' },
    ],
    tip: 'Пассив = быть + причастие. Не путай: "is boring" (скучный) и "is bored" (скучает).',
  },
  // B2
  {
    id: 'g-b2-1', level: 'B2', title: 'Third Conditional',
    rule: 'If + Past Perfect, would have + Past Participle. Воображаемые ситуации в прошлом — то, чего уже не изменить.',
    examples: [
      { correct: 'If she had studied, she would have passed.', wrong: 'If she studied, she would have passed.', note: 'Past Perfect в if-клаузе' },
      { correct: 'I wouldn\'t have been late if I had left earlier.', wrong: '...if I left earlier.', note: 'Обе части с правильными формами' },
      { correct: 'Had I known, I would have helped.', wrong: 'If I would have known...', note: 'Инверсия без if, would — недопустим' },
    ],
    tip: 'Смешанный кондишнл: If she had studied (past) she would be more confident (now). Прошлое + настоящее.',
  },
  {
    id: 'g-b2-2', level: 'B2', title: 'Inversion for Emphasis',
    rule: 'Инверсия усиливает высказывание. После отрицательных наречий (never, seldom, rarely, not only, hardly, no sooner) ставится вспомогательный глагол перед подлежащим.',
    examples: [
      { correct: 'Never have I seen such a mess.', wrong: 'Never I have seen such a mess.', note: 'Вспомогат. глагол перед I' },
      { correct: 'Not only did she arrive late, but she forgot...', wrong: 'Not only she arrived late...', note: 'did + инфинитив после Not only' },
      { correct: 'Hardly had I arrived when it started raining.', wrong: 'Hardly I had arrived...', note: 'Инверсия после Hardly' },
    ],
    tip: 'Инверсия = стиль. Используй в эссе и официальных текстах для академического звучания.',
  },
  {
    id: 'g-b2-3', level: 'B2', title: 'Subjunctive Mood',
    rule: 'Сослагательное наклонение выражает желания, требования и рекомендации. После suggest, recommend, insist, demand, require + that: глагол в базовой форме для всех лиц.',
    examples: [
      { correct: 'I suggest that he be on time.', wrong: 'I suggest that he is on time.', note: 'be, не is — сослагательное' },
      { correct: 'It is essential that she submit the form.', wrong: '...that she submits the form.', note: 'submit, не submits' },
      { correct: 'I wish I were there now.', wrong: 'I wish I was there now.', note: 'were для всех лиц в wish' },
    ],
    tip: '"I wish" + Past для настоящего. "I wish" + Past Perfect для прошлого: I wish I had studied harder.',
  },
  {
    id: 'g-b2-4', level: 'B2', title: 'Participle Clauses',
    rule: 'Причастные обороты заменяют придаточные предложения. Present Participle (V-ing) = активное значение. Past Participle (V3) = пассивное. Перфектное (Having + V3) = действие завершено до главного.',
    examples: [
      { correct: 'Having finished her work, she left.', wrong: 'Finishing her work, she left. (если завершила ранее)', note: 'Having + V3 = завершённое ранее' },
      { correct: 'Written in 1984, the book is still popular.', wrong: 'Writing in 1984, the book...', note: 'Книга написана (пассив) → Past Participle' },
      { correct: 'Looking out the window, she saw snow.', wrong: 'When she looking out...', note: 'Причастный оборот без союза' },
    ],
    tip: 'Причастный оборот должен относиться к подлежащему главного предложения. Иначе — "dangling participle"!',
  },
  {
    id: 'g-b2-5', level: 'B2', title: 'Cleft Sentences',
    rule: 'Расщеплённые предложения выделяют часть информации. "It is/was...that/who..." — конструкция для акцента.',
    examples: [
      { correct: 'It was John who called, not Peter.', wrong: 'John called, not Peter. (менее выразительно)', note: 'Акцент на субъекте' },
      { correct: 'It is money that causes problems.', wrong: 'Money causes problems.', note: 'Акцент на дополнении' },
      { correct: 'What I need is a holiday.', wrong: 'I need a holiday. (нейтрально)', note: '"What"-клауза для акцента' },
    ],
    tip: 'Cleft sentences часты в академическом и журналистском стилях. Позволяют избежать повторений.',
  },
  // C1
  {
    id: 'g-c1-1', level: 'C1', title: 'Mixed Conditionals',
    rule: 'Смешанные условные предложения комбинируют временные планы. Тип: if + Past Perfect (прошлое условие) + would + V (настоящий результат) и наоборот.',
    examples: [
      { correct: 'If she had studied law, she would be a lawyer now.', wrong: '...she would have been a lawyer now.', note: 'Прошлое условие → настоящий результат' },
      { correct: 'If he were more ambitious, he would have applied for the job.', wrong: 'If he was more ambitious...', note: 'Настоящее качество → прошлый результат' },
      { correct: 'Had I been more careful, things would be different now.', wrong: 'If I had been more careful, things would have been different now.', note: 'Инверсия + настоящий результат' },
    ],
    tip: 'Ключ: определи, прошлое или настоящее условие, и прошлый или настоящий результат, затем подставляй формулу.',
  },
  {
    id: 'g-c1-2', level: 'C1', title: 'Advanced Discourse Markers',
    rule: 'Маркеры дискурса структурируют текст. Contrast: whereas, whilst, nevertheless, notwithstanding. Addition: furthermore, in addition, what is more. Concession: albeit, granted that, admittedly.',
    examples: [
      { correct: 'The plan is costly; nevertheless, it is necessary.', wrong: 'The plan is costly; but, it is necessary.', note: '"but" не отделяется запятой в середине' },
      { correct: 'Whereas France exports wine, the UK imports it.', wrong: 'While France exports, UK imports it.', note: '"Whereas" сильнее подчёркивает контраст' },
      { correct: 'Admittedly, the proposal has flaws, yet it is worth considering.', wrong: 'Although it has flaws, it is worth considering.', note: '"Admittedly" + перечисление уступки' },
    ],
    tip: 'В IELTS/TOEFL замена "but" на "however/nevertheless/on the other hand" — лёгкий способ поднять бэнд.',
  },
  {
    id: 'g-c1-3', level: 'C1', title: 'Nominalization',
    rule: 'Номинализация — замена глаголов и прилагательных существительными. Делает текст более формальным и плотным. Типичные суффиксы: -tion, -ment, -ance, -ity, -al.',
    examples: [
      { correct: 'The development of technology has accelerated.', wrong: 'Technology has developed more and more fast.', note: 'develop → development; fast → acceleration' },
      { correct: 'There has been a significant improvement.', wrong: 'Things have improved a lot.', note: 'improved → improvement; a lot → significant' },
      { correct: 'The implementation of the policy requires careful consideration.', wrong: 'When they implement the policy they need to think carefully.', note: 'implement → implementation; think → consideration' },
    ],
    tip: 'Избегай чрезмерной номинализации — текст станет тяжёлым. Баланс глаголов и существительных — ключ.',
  },
  {
    id: 'g-c1-4', level: 'C1', title: 'Ellipsis & Substitution',
    rule: 'Эллипсис — пропуск уже понятных элементов. Субституция — замена на "one/ones, do so, that". Используются для избежания повторений.',
    examples: [
      { correct: 'She wants to leave and he does too. (does = wants to leave)', wrong: 'She wants to leave and he wants to leave too.', note: '"does" заменяет глагольную группу' },
      { correct: 'The new report is longer than the previous one.', wrong: '...than the previous report.', note: '"one" заменяет повторяющееся существительное' },
      { correct: 'A: Can you come? B: I hope to. (to = to come)', wrong: 'I hope to come.', note: 'Инфинитив без глагола' },
    ],
    tip: 'Эллипсис — признак высокого уровня владения языком. Он делает речь натуральной, а не повторяющейся.',
  },
  {
    id: 'g-c1-5', level: 'C1', title: 'Advanced Passive Structures',
    rule: 'Сложный пассив: It is said that / He is believed to / She is reported to have. Используется в академическом и журналистском стиле, когда источник не указан.',
    examples: [
      { correct: 'It is believed that the economy will recover.', wrong: 'They believe that the economy will recover.', note: 'Безличный пассив скрывает агента' },
      { correct: 'The suspect is reported to have fled.', wrong: 'They report the suspect fled.', note: 'Инфинитивная конструкция пассива' },
      { correct: 'The discovery is thought to date back to 3000 BC.', wrong: 'People think the discovery dates back...', note: 'Более академичный регистр' },
    ],
    tip: 'Эти структуры критически важны для IELTS Academic Writing Task 2 и научных текстов.',
  },
]

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444',
}

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1']

export default function GrammarPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = GRAMMAR_CARDS.filter(c => {
    const matchLevel = filter === 'All' || c.level === filter
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.rule.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Грамматический справочник</h1>
        <p className="text-[#64748b] text-sm">25 ключевых правил от A1 до C1 с примерами ошибок</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по теме или правилу..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#3f4a5a] outline-none focus:border-[#6366f1]/50 transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setFilter(l)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${filter === l
                ? l === 'All' ? 'border-[#6366f1] bg-[#6366f1]/20 text-white' : `border-[${LEVEL_COLORS[l]}] text-white`
                : 'border-white/10 text-[#64748b] hover:text-white'}`}
              style={filter === l && l !== 'All'
                ? { borderColor: LEVEL_COLORS[l], backgroundColor: `${LEVEL_COLORS[l]}20`, color: LEVEL_COLORS[l] }
                : {}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[#475569] text-xs">{filtered.length} правил</p>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(card => (
          <div key={card.id} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden transition-all">
            <button onClick={() => setExpanded(e => e === card.id ? null : card.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${LEVEL_COLORS[card.level]}20`, color: LEVEL_COLORS[card.level] }}>
                  {card.level}
                </span>
                <span className="text-white font-medium">{card.title}</span>
              </div>
              {expanded === card.id ? <ChevronUp className="w-4 h-4 text-[#475569]" /> : <ChevronDown className="w-4 h-4 text-[#475569]" />}
            </button>

            <AnimatePresence>
              {expanded === card.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-white/[0.06]">
                  <div className="px-5 py-4 space-y-4">
                    {/* Rule */}
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{card.rule}</p>

                    {/* Examples */}
                    <div>
                      <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">Примеры</h4>
                      <div className="space-y-2.5">
                        {card.examples.map((ex, i) => (
                          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#10b981] text-xs">✓</span>
                                  <span className="text-[#10b981] text-sm">{ex.correct.split(' → ')[0]}</span>
                                  <button onClick={() => speak(ex.correct.split(' → ')[0], { rate: 0.9 })}
                                    className="text-[#475569] hover:text-[#6366f1] transition-colors flex-shrink-0">
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#ef4444] text-xs">✗</span>
                                  <span className="text-[#ef4444]/70 line-through text-sm">{ex.wrong.split(' → ')[0]}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[#475569] text-xs mt-1">{ex.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl px-4 py-3">
                      <span className="text-[#f59e0b] text-xs font-semibold">💡 Совет: </span>
                      <span className="text-[#94a3b8] text-xs">{card.tip}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#475569]">Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}
