export interface MiniStory {
  id: string
  title: string
  level: string
  topic: string
  text: string
  vocabWords: { word: string; translation: string; highlighted: boolean }[]
  questions: { q: string; a: string }[]
}

export const MINI_STORIES: MiniStory[] = [
  {
    id: 'ms1', title: 'A New Beginning', level: 'A1', topic: 'Everyday Life',
    text: `My name is Emma. I am **twenty-five** years old. I live in a small **apartment** in London. Every morning I **wake up** at seven o'clock. I drink **coffee** and eat **breakfast**. Then I go to work by **bus**. I work in an office. I like my job because my **colleagues** are friendly. After work I go to the **gym**. In the evening I **cook** dinner and watch TV. I am **happy** with my life.`,
    vocabWords: [
      { word: 'apartment', translation: 'квартира', highlighted: true },
      { word: 'wake up', translation: 'просыпаться', highlighted: true },
      { word: 'colleagues', translation: 'коллеги', highlighted: true },
      { word: 'gym', translation: 'спортзал', highlighted: true },
      { word: 'cook', translation: 'готовить', highlighted: true },
    ],
    questions: [
      { q: 'Where does Emma live?', a: 'She lives in a small apartment in London.' },
      { q: 'How does she go to work?', a: 'She goes to work by bus.' },
      { q: 'What does she do after work?', a: 'She goes to the gym.' },
    ]
  },
  {
    id: 'ms2', title: 'The Job Interview', level: 'B1', topic: 'Work',
    text: `David had been **unemployed** for three months when he finally got an **invitation** to a job interview. He was **nervous** but **determined** to make a good **impression**. The night before, he **prepared** his answers carefully and chose his best suit. At the interview, the **recruiter** asked him about his **experience** and **strengths**. David spoke **confidently** about his skills. He admitted his **weaknesses** honestly, which **impressed** the panel. Two days later, he received a call with a job **offer**. His **perseverance** had paid off.`,
    vocabWords: [
      { word: 'unemployed', translation: 'безработный', highlighted: true },
      { word: 'determined', translation: 'решительный', highlighted: true },
      { word: 'impression', translation: 'впечатление', highlighted: true },
      { word: 'recruiter', translation: 'рекрутер', highlighted: true },
      { word: 'perseverance', translation: 'настойчивость', highlighted: true },
      { word: 'confidently', translation: 'уверенно', highlighted: true },
    ],
    questions: [
      { q: 'How long had David been unemployed?', a: 'He had been unemployed for three months.' },
      { q: 'What did he do the night before the interview?', a: 'He prepared his answers and chose his best suit.' },
      { q: 'What impressed the panel?', a: 'He admitted his weaknesses honestly.' },
    ]
  },
  {
    id: 'ms3', title: 'The Startup Dream', level: 'B2', topic: 'Business',
    text: `When Sofia **launched** her tech startup, most people thought she was taking an **enormous** risk. She had **quit** her **stable** corporate job to pursue an **ambitious** idea: an app that would **revolutionise** how small businesses manage their **finances**. The early months were **gruelling** — she worked eighteen-hour days, faced constant **setbacks**, and nearly ran out of **funding**. But Sofia was **resilient**. She **pivoted** her business model twice, **collaborated** with unexpected **partners**, and eventually **secured** a significant **investment** from a venture capital firm. Her story became an **inspiration** for aspiring entrepreneurs everywhere.`,
    vocabWords: [
      { word: 'launched', translation: 'запустила', highlighted: true },
      { word: 'ambitious', translation: 'амбициозная', highlighted: true },
      { word: 'revolutionise', translation: 'революционизировать', highlighted: true },
      { word: 'gruelling', translation: 'изнурительный', highlighted: true },
      { word: 'resilient', translation: 'устойчивая', highlighted: true },
      { word: 'pivoted', translation: 'изменила направление', highlighted: true },
      { word: 'secured', translation: 'получила, обеспечила', highlighted: true },
    ],
    questions: [
      { q: "What was Sofia's idea?", a: 'An app to help small businesses manage their finances.' },
      { q: 'What challenges did she face?', a: 'She worked 18-hour days, had setbacks, and nearly ran out of funding.' },
      { q: 'How did she eventually succeed?', a: 'She pivoted her model twice and secured venture capital investment.' },
    ]
  },
  {
    id: 'ms4', title: 'Learning a Language', level: 'A2', topic: 'Education',
    text: `Maria decided to **learn** English when she was thirty years old. At first, it seemed **impossible**. She could not **understand** anything people said on TV. She made many **grammar** mistakes and felt **embarrassed**. But she did not **give up**. She studied for one hour every day. She also found a **language partner** online. After six months, she could have simple **conversations**. After one year, she watched movies without **subtitles**. Maria learned an important **lesson**: if you **practise** every day, you will **improve**.`,
    vocabWords: [
      { word: 'impossible', translation: 'невозможно', highlighted: true },
      { word: 'embarrassed', translation: 'смущённый', highlighted: true },
      { word: 'give up', translation: 'сдаваться', highlighted: true },
      { word: 'language partner', translation: 'языковой партнёр', highlighted: true },
      { word: 'subtitles', translation: 'субтитры', highlighted: true },
      { word: 'practise', translation: 'практиковаться', highlighted: true },
    ],
    questions: [
      { q: 'How old was Maria when she started learning English?', a: 'She was thirty years old.' },
      { q: 'How long did she study every day?', a: 'She studied for one hour every day.' },
      { q: 'What could she do after one year?', a: 'She could watch movies without subtitles.' },
    ]
  },
  {
    id: 'ms5', title: 'The Climate Crisis', level: 'C1', topic: 'Environment',
    text: `The **paradox** of the climate crisis is that those who have **contributed** least to it are **disproportionately** affected by its **consequences**. Small island nations face **existential** threats from rising sea levels, while **industrialised** countries that **emit** the most carbon dioxide continue to **debate** the **urgency** of action. Scientists are **unequivocal**: without **unprecedented** global **cooperation** and a radical **transition** to renewable energy, the window for **averting** catastrophic warming is narrowing rapidly. The question is no longer whether climate change is happening, but whether humanity has the **collective** will to **confront** it.`,
    vocabWords: [
      { word: 'paradox', translation: 'парадокс', highlighted: true },
      { word: 'disproportionately', translation: 'непропорционально', highlighted: true },
      { word: 'existential', translation: 'экзистенциальный, угрожающий существованию', highlighted: true },
      { word: 'unequivocal', translation: 'однозначный', highlighted: true },
      { word: 'unprecedented', translation: 'беспрецедентный', highlighted: true },
      { word: 'averting', translation: 'предотвращение', highlighted: true },
      { word: 'collective', translation: 'коллективный', highlighted: true },
    ],
    questions: [
      { q: 'Who is most affected by the climate crisis?', a: 'Those who contributed least — small island nations.' },
      { q: 'What do scientists say about climate change?', a: 'They are unequivocal that urgent action is needed.' },
      { q: 'What is needed to avert catastrophic warming?', a: 'Unprecedented global cooperation and transition to renewable energy.' },
    ]
  },
]
