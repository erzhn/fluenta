export type ExerciseItem =
  | { type: 'multiple-choice'; question: string; options: string[]; answer: number; explanation: string }
  | { type: 'fill-blank'; sentence: string; answer: string; hint: string }
  | { type: 'reorder'; words: string[]; correct: string }
  | { type: 'translation'; en: string; ru: string }
  | { type: 'error-spot'; sentence: string; errorWord: string; correction: string; explanation: string }

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type LessonCategory = 'Grammar' | 'Vocabulary' | 'Reading' | 'Speaking' | 'Writing'

export interface Lesson {
  id: string
  level: CEFRLevel
  category: LessonCategory
  title: string
  titleRu: string
  duration: number
  xpReward: number
  content: {
    explanation: string
    examples: { en: string; ru: string }[]
    keyPoints: string[]
  }
  exercises: ExerciseItem[]
}

export const LEVEL_COLORS: Record<CEFRLevel, string> = {
  A1: '#6B7280', A2: '#3B82F6', B1: '#8B5CF6',
  B2: '#10B981', C1: '#F59E0B', C2: '#EF4444',
}

export const LESSONS: Lesson[] = [

  // ── A1 ─────────────────────────────────────────────────────────────────
  {
    id: 'a1-present-simple',
    level: 'A1', category: 'Grammar',
    title: 'Present Simple', titleRu: 'Настоящее простое — привычки и факты',
    duration: 10, xpReward: 50,
    content: {
      explanation: `Present Simple describes habits, routines, and facts that are always true. For I/you/we/they use the base verb. For he/she/it add -s or -es.\n\nNegative: I don't work. She doesn't work.\nQuestion: Do you work? Does she work?`,
      examples: [
        { en: 'I wake up at 7 every morning.', ru: 'Я просыпаюсь в 7 каждое утро.' },
        { en: 'She works at a hospital.', ru: 'Она работает в больнице.' },
        { en: 'They don\'t eat meat.', ru: 'Они не едят мясо.' },
        { en: 'Does he speak Spanish?', ru: 'Он говорит по-испански?' },
      ],
      keyPoints: [
        'He/she/it: add -s or -es (goes, watches, studies)',
        'Negative: don\'t / doesn\'t + base verb',
        'Question: Do / Does + subject + base verb?',
        'Time words: always, usually, often, never, every day',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'She ___ to work by bus every day.', options: ['go', 'goes', 'going', 'is go'], answer: 1, explanation: 'He/she/it needs -s: go → goes.' },
      { type: 'fill-blank', sentence: 'My brother ___ football every Saturday. (play)', answer: 'plays', hint: 'he/she/it → add -s' },
      { type: 'error-spot', sentence: 'He don\'t like cold weather.', errorWord: 'don\'t', correction: 'doesn\'t', explanation: 'With he/she/it use "doesn\'t", not "don\'t".' },
      { type: 'translation', en: 'We go to the gym three times a week.', ru: 'Мы ходим в спортзал три раза в неделю.' },
      { type: 'reorder', words: ['speak', 'Does', 'English', 'your', 'teacher', '?'], correct: 'Does your teacher speak English ?' },
    ],
  },

  {
    id: 'a1-verb-to-be',
    level: 'A1', category: 'Grammar',
    title: 'Verb To Be', titleRu: 'Глагол быть — кто я и что вокруг',
    duration: 10, xpReward: 50,
    content: {
      explanation: `The verb "to be" (am/is/are) is the most important verb in English. It links the subject to a description.\n\nPresent: I am, you are, he/she/it is, we/you/they are.\nShort forms: I'm, you're, he's, she's, it's, we're, they're.\nNegative: I'm not, you aren't, he isn't.`,
      examples: [
        { en: 'I am a student.', ru: 'Я студент.' },
        { en: 'She is from Kazakhstan.', ru: 'Она из Казахстана.' },
        { en: 'They are not at home.', ru: 'Они не дома.' },
        { en: 'Is the coffee hot?', ru: 'Кофе горячий?' },
      ],
      keyPoints: [
        'I → am | he/she/it → is | you/we/they → are',
        'Short forms: I\'m, he\'s, they\'re',
        'Negative: I\'m not, he isn\'t, they aren\'t',
        'Question: Am I? Is he? Are they?',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'My parents ___ very kind people.', options: ['am', 'is', 'are', 'be'], answer: 2, explanation: '"My parents" is plural → use "are".' },
      { type: 'fill-blank', sentence: 'She ___ a nurse at the city hospital.', answer: 'is', hint: 'he/she/it → is' },
      { type: 'multiple-choice', question: 'Choose the negative: "He is tired."', options: ['He don\'t tired.', 'He isn\'t tired.', 'He not tired.', 'He aren\'t tired.'], answer: 1, explanation: 'Negative of "is" is "isn\'t" (is not).' },
      { type: 'translation', en: 'We are happy to be here.', ru: 'Мы рады быть здесь.' },
      { type: 'error-spot', sentence: 'They is from Russia.', errorWord: 'is', correction: 'are', explanation: '"They" is plural — use "are".' },
    ],
  },

  {
    id: 'a1-articles',
    level: 'A1', category: 'Grammar',
    title: 'Articles A / An / The', titleRu: 'Артикли — когда что использовать',
    duration: 12, xpReward: 50,
    content: {
      explanation: `English has three articles: A, AN, and THE.\n\nA / AN (indefinite): Use for non-specific things mentioned for the first time. A + consonant sound. AN + vowel sound (a, e, i, o, u).\n\nTHE (definite): Use when both speaker and listener know which thing is meant, or when something is unique.`,
      examples: [
        { en: 'I saw a dog in the park.', ru: 'Я видел собаку в парке.' },
        { en: 'She is an engineer.', ru: 'Она инженер.' },
        { en: 'The sun rises in the east.', ru: 'Солнце встаёт на востоке.' },
        { en: 'Can you close the door?', ru: 'Ты можешь закрыть дверь?' },
      ],
      keyPoints: [
        'A = before consonant sounds: a book, a car, a university (юни — sounds like "you")',
        'AN = before vowel sounds: an apple, an hour (silent h)',
        'THE = specific, unique, or already mentioned thing',
        'No article: languages (English), sports (football), meals (breakfast)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'She is ___ doctor at a big hospital.', options: ['a', 'an', 'the', '—'], answer: 0, explanation: '"Doctor" starts with a consonant sound → use "a".' },
      { type: 'multiple-choice', question: 'I read ___ book you recommended.', options: ['a', 'an', 'the', '—'], answer: 2, explanation: '"The book you recommended" — we both know which one → "the".' },
      { type: 'fill-blank', sentence: 'He found ___ old letter in the box.', answer: 'an', hint: '"Old" starts with a vowel sound → a or an?' },
      { type: 'error-spot', sentence: 'She plays a piano every evening.', errorWord: 'a', correction: 'the', explanation: 'Musical instruments use "the": play the piano, the guitar.' },
      { type: 'translation', en: 'The Moon is smaller than the Sun.', ru: 'Луна меньше Солнца.' },
    ],
  },

  {
    id: 'a1-numbers-colors-days',
    level: 'A1', category: 'Vocabulary',
    title: 'Numbers, Colors & Days', titleRu: 'Цифры, цвета и дни недели',
    duration: 10, xpReward: 50,
    content: {
      explanation: `Essential vocabulary every beginner needs! Numbers 1-100, basic colors, and days of the week form the backbone of daily communication.\n\nDays of the week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.\nBasic colors: red, blue, green, yellow, black, white, orange, purple, pink, grey.\nOrdinal numbers: first, second, third, fourth, fifth...`,
      examples: [
        { en: 'My meeting is on Wednesday at 3 o\'clock.', ru: 'Моя встреча в среду в 3 часа.' },
        { en: 'She has thirty-five students in her class.', ru: 'У неё тридцать пять учеников в классе.' },
        { en: 'His favourite colour is dark blue.', ru: 'Его любимый цвет — тёмно-синий.' },
        { en: 'Today is the fifteenth of March.', ru: 'Сегодня пятнадцатое марта.' },
      ],
      keyPoints: [
        'Teens: thirteen, fourteen... -teen. Tens: thirty, forty... -ty',
        'Days are always capitalized in English: Monday, not monday',
        'The weekend = Saturday and Sunday',
        'Ordinals: 1st=first, 2nd=second, 3rd=third, then add -th',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'Which day comes after Wednesday?', options: ['Tuesday', 'Thursday', 'Friday', 'Monday'], answer: 1, explanation: 'The order: Mon, Tue, Wed, THURSDAY, Fri, Sat, Sun.' },
      { type: 'translation', en: 'There are twenty-four hours in a day.', ru: 'В сутках двадцать четыре часа.' },
      { type: 'multiple-choice', question: 'The colour of the sky on a clear day is:', options: ['green', 'red', 'blue', 'yellow'], answer: 2, explanation: 'The sky is blue — "blue sky".' },
      { type: 'translation', en: 'My birthday is on the third of July.', ru: 'Мой день рождения третьего июля.' },
      { type: 'fill-blank', sentence: 'There are ___ days in a week.', answer: 'seven', hint: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun = ?' },
    ],
  },

  {
    id: 'a1-greetings',
    level: 'A1', category: 'Speaking',
    title: 'Greetings & Introductions', titleRu: 'Приветствия и знакомства',
    duration: 10, xpReward: 50,
    content: {
      explanation: `Knowing how to greet people and introduce yourself is the first step in speaking English. There are formal and informal ways depending on the situation.\n\nFormal: Good morning/afternoon/evening. How do you do?\nInformal: Hi! Hey! What's up? How are you?\n\nIntroducing yourself: "My name is Alex. I'm from Almaty. I'm 25 years old. Nice to meet you!"`,
      examples: [
        { en: 'Hi! My name is Anna. What\'s your name?', ru: 'Привет! Меня зовут Анна. Как тебя зовут?' },
        { en: 'Nice to meet you! Where are you from?', ru: 'Рад познакомиться! Откуда ты?' },
        { en: 'How are you? — I\'m fine, thanks!', ru: 'Как дела? — Хорошо, спасибо!' },
        { en: 'Good morning! Have a great day!', ru: 'Доброе утро! Хорошего дня!' },
      ],
      keyPoints: [
        '"How are you?" → Answer: Fine/Great/Not bad, thanks!',
        '"Nice to meet you" / "Pleased to meet you" — at first meetings',
        'Goodbye: Bye! See you! Take care! Goodbye!',
        'Good morning (before noon), Good afternoon (12-6pm), Good evening (after 6pm)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'You meet someone for the first time. You say:', options: ['See you later!', 'Nice to meet you!', 'How have you been?', 'Long time no see!'], answer: 1, explanation: '"Nice to meet you" is for first meetings.' },
      { type: 'translation', en: 'What do you do for a living?', ru: 'Кем ты работаешь?' },
      { type: 'fill-blank', sentence: 'A: How are you? B: ___, thank you!', answer: 'Fine', hint: 'A common positive answer to "How are you?"' },
      { type: 'reorder', words: ['is', 'name', 'My', 'Sarah', '.'], correct: 'My name is Sarah .' },
      { type: 'multiple-choice', question: '"Good evening" is used:', options: ['Before 12pm', 'Between 12-6pm', 'After 6pm', 'Any time'], answer: 2, explanation: 'Evening starts at approximately 6pm.' },
    ],
  },

  // ── A2 ─────────────────────────────────────────────────────────────────
  {
    id: 'a2-past-simple',
    level: 'A2', category: 'Grammar',
    title: 'Past Simple', titleRu: 'Прошедшее время — что я делал вчера',
    duration: 12, xpReward: 75,
    content: {
      explanation: `Past Simple describes completed actions in the past. Regular verbs add -ed: work → worked. Irregular verbs change completely: go → went, eat → ate, see → saw.\n\nNegative: didn't + base verb (I didn't go).\nQuestion: Did + subject + base verb? (Did you go?)`,
      examples: [
        { en: 'I visited my grandmother last Sunday.', ru: 'В прошлое воскресенье я навестил бабушку.' },
        { en: 'She didn\'t come to the party.', ru: 'Она не пришла на вечеринку.' },
        { en: 'Did you see that film?', ru: 'Ты видел этот фильм?' },
        { en: 'We had a wonderful holiday in Italy.', ru: 'У нас был чудесный отпуск в Италии.' },
      ],
      keyPoints: [
        'Regular: add -ed (talked, worked, wanted)',
        'Irregular: must be memorized (go→went, buy→bought, think→thought)',
        'Negative: didn\'t + BASE verb (not "didn\'t went"!)',
        'Time words: yesterday, last week, in 2020, ago, when I was young',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'She ___ to London last year for the first time.', options: ['go', 'goes', 'went', 'goed'], answer: 2, explanation: 'Go is irregular: go → went.' },
      { type: 'error-spot', sentence: 'I didn\'t went to school yesterday.', errorWord: 'went', correction: 'go', explanation: 'After "didn\'t" always use the base verb: "didn\'t go".' },
      { type: 'fill-blank', sentence: 'We ___ a great time at the concert last night. (have)', answer: 'had', hint: 'have is irregular: have → had' },
      { type: 'translation', en: 'Did you finish your homework?', ru: 'Ты закончил домашнее задание?' },
      { type: 'reorder', words: ['yesterday', 'he', 'called', 'you', 'Did', '?'], correct: 'Did he call you yesterday ?' },
    ],
  },

  {
    id: 'a2-present-continuous',
    level: 'A2', category: 'Grammar',
    title: 'Present Continuous', titleRu: 'Что происходит прямо сейчас',
    duration: 12, xpReward: 75,
    content: {
      explanation: `Present Continuous describes actions happening right now or temporary situations. Form: am/is/are + verb-ing.\n\nI am working. She is sleeping. They are studying.\nNegative: I'm not working. She isn't sleeping.\nQuestion: Are you working? Is she sleeping?\n\nSpelling: run → running (double consonant), write → writing (drop silent e).`,
      examples: [
        { en: 'I\'m reading a great book right now.', ru: 'Я сейчас читаю отличную книгу.' },
        { en: 'She is living in Paris for six months.', ru: 'Она живёт в Париже шесть месяцев (временно).' },
        { en: 'They\'re not playing — they\'re watching TV.', ru: 'Они не играют — они смотрят телевизор.' },
        { en: 'What are you doing this evening?', ru: 'Что ты делаешь сегодня вечером?' },
      ],
      keyPoints: [
        'am/is/are + verb-ing (adding -ing to base verb)',
        'Spelling: stop→stopping, make→making, study→studying',
        'Signal words: now, right now, at the moment, currently, today',
        'Also used for future plans: I\'m meeting Anna tomorrow.',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'Listen! The baby ___ in the next room.', options: ['cries', 'cry', 'is crying', 'crying'], answer: 2, explanation: '"Listen!" signals right now → Present Continuous.' },
      { type: 'fill-blank', sentence: 'She ___ her hair right now. (wash)', answer: 'is washing', hint: 'she + is/are + verb-ing' },
      { type: 'error-spot', sentence: 'He is swim in the pool.', errorWord: 'swim', correction: 'swimming', explanation: 'Present Continuous = is + verb-ING: swimming.' },
      { type: 'multiple-choice', question: 'Which sentence uses Present Continuous correctly?', options: ['I am know the answer.', 'She is want more coffee.', 'They are studying for the exam.', 'He is have a car.'], answer: 2, explanation: 'Know, want, have are state verbs — no -ing form in present.' },
      { type: 'translation', en: 'What are you thinking about?', ru: 'О чём ты думаешь?' },
    ],
  },

  {
    id: 'a2-comparatives',
    level: 'A2', category: 'Grammar',
    title: 'Comparatives & Superlatives', titleRu: 'Больше, меньше, самый',
    duration: 12, xpReward: 75,
    content: {
      explanation: `Comparatives compare two things. Superlatives compare one thing to a whole group.\n\nShort adjectives (1-2 syllables): add -er/-est. tall → taller → tallest.\nLong adjectives (3+ syllables): more/most. expensive → more expensive → most expensive.\nIrregular: good → better → best | bad → worse → worst | far → farther → farthest.`,
      examples: [
        { en: 'My phone is newer than yours.', ru: 'Мой телефон новее твоего.' },
        { en: 'This is the most interesting book I\'ve read.', ru: 'Это самая интересная книга, которую я читал.' },
        { en: 'He runs faster than anyone in the class.', ru: 'Он бегает быстрее всех в классе.' },
        { en: 'January is the coldest month.', ru: 'Январь — самый холодный месяц.' },
      ],
      keyPoints: [
        'Comparative + than: bigger than, more beautiful than',
        'Superlative + the: the biggest, the most beautiful',
        'Double consonant rule: big→bigger, hot→hotter, thin→thinner',
        'Y→ier: happy→happier→happiest, easy→easier→easiest',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'Russia is ___ country in the world by area.', options: ['big', 'bigger', 'the biggest', 'the most big'], answer: 2, explanation: 'Superlative for short adjectives: the + -est → the biggest.' },
      { type: 'fill-blank', sentence: 'This exam is ___ than the last one. (difficult)', answer: 'more difficult', hint: 'Long adjective → more + adjective' },
      { type: 'error-spot', sentence: 'My sister is more tall than me.', errorWord: 'more tall', correction: 'taller', explanation: '"Tall" is short → use -er form: taller.' },
      { type: 'translation', en: 'Which city is more expensive — London or New York?', ru: 'Какой город дороже — Лондон или Нью-Йорк?' },
      { type: 'multiple-choice', question: 'He felt ___ today than yesterday.', options: ['good', 'gooder', 'better', 'more good'], answer: 2, explanation: '"Good" is irregular: good → better → best.' },
    ],
  },

  {
    id: 'a2-modal-verbs',
    level: 'A2', category: 'Grammar',
    title: 'Modal Verbs: can, must, should', titleRu: 'Возможность и обязанность',
    duration: 12, xpReward: 75,
    content: {
      explanation: `Modal verbs express ability, permission, advice, and obligation. They never add -s for he/she/it and are always followed by the base verb.\n\nCAN: ability or permission (I can swim. Can I leave?)\nMUST: strong obligation or logical conclusion (You must wear a seatbelt.)\nSHOULD: advice or recommendation (You should see a doctor.)`,
      examples: [
        { en: 'She can speak four languages.', ru: 'Она умеет говорить на четырёх языках.' },
        { en: 'You must not use your phone while driving.', ru: 'Нельзя пользоваться телефоном за рулём.' },
        { en: 'You should drink more water.', ru: 'Тебе следует пить больше воды.' },
        { en: 'Can I open the window?', ru: 'Можно открыть окно?' },
      ],
      keyPoints: [
        'Modals: can/could, must/have to, should/ought to, may/might, will/would',
        'Never add -s: she cans ✗ → she can ✓',
        'Always followed by base verb: must to go ✗ → must go ✓',
        'Negative: can\'t, mustn\'t, shouldn\'t',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'You ___ eat so much sugar. It\'s not healthy.', options: ['can', 'must', 'shouldn\'t', 'would'], answer: 2, explanation: '"Shouldn\'t" gives negative advice — don\'t do this.' },
      { type: 'fill-blank', sentence: 'He ___ drive — he passed his test last week. (can)', answer: 'can', hint: 'Ability: he/she/it + can (no -s!)' },
      { type: 'error-spot', sentence: 'She cans speak Spanish very well.', errorWord: 'cans', correction: 'can', explanation: 'Modal verbs NEVER add -s for he/she/it.' },
      { type: 'translation', en: 'You must show your passport at the border.', ru: 'Ты должен показать паспорт на границе.' },
      { type: 'multiple-choice', question: 'I think you ___ apologize to her. It was your fault.', options: ['can', 'must not', 'should', 'will'], answer: 2, explanation: '"Should" is the right choice for advice/recommendation.' },
    ],
  },

  {
    id: 'a2-prepositions',
    level: 'A2', category: 'Grammar',
    title: 'Prepositions: in, on, at, by', titleRu: 'Предлоги места и времени',
    duration: 12, xpReward: 75,
    content: {
      explanation: `Prepositions of time and place are used differently in English. The key ones are IN, ON, AT, and BY.\n\nIN: months, years, seasons, countries, cities (in July, in 2023, in summer, in France)\nON: days and dates (on Monday, on 5th March, on my birthday)\nAT: specific times and places (at 3pm, at noon, at school, at the station)\nBY: deadline or means of transport (by Friday, by car, by train)`,
      examples: [
        { en: 'I was born in 1995 in Almaty.', ru: 'Я родился в 1995 году в Алматы.' },
        { en: 'The meeting is on Thursday at 10am.', ru: 'Встреча в четверг в 10 утра.' },
        { en: 'She travels to work by subway.', ru: 'Она добирается на работу на метро.' },
        { en: 'Please finish the report by tomorrow.', ru: 'Пожалуйста, закончи отчёт к завтрашнему дню.' },
      ],
      keyPoints: [
        'IN + month/year/season/century: in March, in 2020, in summer',
        'ON + day/date/specific day: on Monday, on 15th June, on New Year\'s Day',
        'AT + time/specific place: at 5pm, at home, at the airport',
        'BY + transport/deadline: by bus, by email, by next week',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'My flight departs ___ 6:30 in the morning.', options: ['in', 'on', 'at', 'by'], answer: 2, explanation: 'Specific times → AT: at 6:30.' },
      { type: 'multiple-choice', question: 'She was born ___ a cold winter morning.', options: ['in', 'on', 'at', 'by'], answer: 1, explanation: 'Specific days/mornings → ON: on a cold winter morning.' },
      { type: 'fill-blank', sentence: 'The project must be finished ___ Friday.', answer: 'by', hint: 'Deadline → by' },
      { type: 'translation', en: 'He always travels by train, not by plane.', ru: 'Он всегда путешествует на поезде, а не на самолёте.' },
      { type: 'error-spot', sentence: 'We met on the summer of 2019.', errorWord: 'on', correction: 'in', explanation: 'Seasons → IN: in summer, in winter.' },
    ],
  },

  // ── B1 ─────────────────────────────────────────────────────────────────
  {
    id: 'b1-present-perfect',
    level: 'B1', category: 'Grammar',
    title: 'Present Perfect', titleRu: 'Опыт и результат — что успел сделать',
    duration: 15, xpReward: 100,
    content: {
      explanation: `Present Perfect connects the past to the present. Form: have/has + past participle.\n\nUse it for:\n1. Life experiences (Have you ever been to Japan?)\n2. Recent events with present relevance (I've lost my keys — still lost now)\n3. Unfinished time periods (I've worked here for 5 years)\n\nKey words: ever, never, already, yet, just, for, since.`,
      examples: [
        { en: 'I have visited 12 countries so far.', ru: 'Я посетил 12 стран к данному моменту.' },
        { en: 'She has just finished her report.', ru: 'Она только что закончила отчёт.' },
        { en: 'Have you ever eaten sushi?', ru: 'Ты когда-нибудь ел суши?' },
        { en: 'He hasn\'t called me yet.', ru: 'Он ещё не позвонил мне.' },
      ],
      keyPoints: [
        'have/has + past participle (worked, eaten, been, gone)',
        '"Ever/never" for life experience questions and answers',
        '"Already" in positive sentences, "yet" in negatives and questions',
        '"For" = duration (for 2 years), "since" = start point (since 2020)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'I ___ my wallet somewhere. I can\'t find it!', options: ['lost', 'have lost', 'has lost', 'lose'], answer: 1, explanation: 'The result is relevant now (still can\'t find it) → Present Perfect.' },
      { type: 'fill-blank', sentence: 'She has worked at this company ___ 2015.', answer: 'since', hint: 'since = start point in time; for = duration' },
      { type: 'error-spot', sentence: 'Have you ever went to London?', errorWord: 'went', correction: 'been', explanation: 'Present Perfect needs past participle: go → been/gone, not "went".' },
      { type: 'translation', en: 'He has never tried sushi in his life.', ru: 'Он никогда в жизни не пробовал суши.' },
      { type: 'reorder', words: ['already', 'I\'ve', 'this', 'seen', 'film', '.'], correct: 'I\'ve already seen this film .' },
    ],
  },

  {
    id: 'b1-first-conditional',
    level: 'B1', category: 'Grammar',
    title: 'First Conditional', titleRu: 'Если... то... — реальные условия',
    duration: 15, xpReward: 100,
    content: {
      explanation: `First Conditional describes real, possible situations and their likely results. It's used for future possibilities that are realistic.\n\nStructure: IF + Present Simple → will + base verb\n\nIf it rains, I will take an umbrella.\nIf you study hard, you will pass the exam.\n\nNote: The "if" clause can come first or second. Use a comma when "if" comes first.`,
      examples: [
        { en: 'If she misses the bus, she\'ll be late.', ru: 'Если она опоздает на автобус, она опоздает.' },
        { en: 'I\'ll call you if I have time.', ru: 'Я позвоню тебе, если у меня будет время.' },
        { en: 'If the weather is nice, we\'ll have a picnic.', ru: 'Если погода будет хорошей, мы устроим пикник.' },
        { en: 'Will you come if I invite you?', ru: 'Ты придёшь, если я приглашу тебя?' },
      ],
      keyPoints: [
        'If + Present Simple (NOT "will" in the if-clause!)',
        'Result clause: will / won\'t + base verb',
        'Can also use: might, can, should in the result clause',
        'Real, possible future: "If it rains" (it might really rain)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'If you ___ enough sleep, you\'ll feel better.', options: ['get', 'will get', 'got', 'getting'], answer: 0, explanation: 'After "if" in First Conditional: use Present Simple, not "will".' },
      { type: 'fill-blank', sentence: 'If it snows tomorrow, we ___ cancel the trip. (might)', answer: 'might cancel', hint: 'Result clause: will/might + base verb' },
      { type: 'reorder', words: ['pass', 'you', 'study,', 'the', 'If', 'you\'ll', 'exam.'], correct: 'If you study, you\'ll pass the exam.' },
      { type: 'error-spot', sentence: 'If she will come, we will celebrate.', errorWord: 'will come', correction: 'comes', explanation: 'No "will" in the IF clause: "if she comes".' },
      { type: 'translation', en: 'We\'ll go swimming if the weather is good.', ru: 'Мы пойдём купаться, если погода будет хорошей.' },
    ],
  },

  {
    id: 'b1-passive-voice',
    level: 'B1', category: 'Grammar',
    title: 'Passive Voice', titleRu: 'Страдательный залог — кем/чем сделано',
    duration: 15, xpReward: 100,
    content: {
      explanation: `The Passive Voice focuses on the action and what is done, not who does it. Form: be (in correct tense) + past participle.\n\nPresent: The letter is written. | Past: The letter was written.\nPerfect: The letter has been written. | Future: The letter will be written.\n\nUse passive when the doer is unknown, unimportant, or obvious. Add "by + agent" if needed.`,
      examples: [
        { en: 'English is spoken all over the world.', ru: 'На английском говорят по всему миру.' },
        { en: 'The Eiffel Tower was built in 1889.', ru: 'Эйфелева башня была построена в 1889 году.' },
        { en: 'My car has been repaired.', ru: 'Моя машина была отремонтирована.' },
        { en: 'The report will be finished by tomorrow.', ru: 'Отчёт будет закончен к завтрашнему дню.' },
      ],
      keyPoints: [
        'Form: appropriate form of BE + past participle',
        'To mention who did it: + by (The book was written BY Tolstoy)',
        'Common in news, science, formal writing',
        'Can\'t always be passive: "She resembles her mother" has no passive form',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'The pyramids ___ by the ancient Egyptians.', options: ['built', 'were built', 'are built', 'build'], answer: 1, explanation: 'Past passive: were + past participle.' },
      { type: 'fill-blank', sentence: 'English ___ as an official language in many countries. (speak)', answer: 'is spoken', hint: 'Present passive: is/are + past participle' },
      { type: 'error-spot', sentence: 'This book was wrote by Pushkin.', errorWord: 'wrote', correction: 'written', explanation: 'Passive needs past PARTICIPLE: write → written (not "wrote").' },
      { type: 'translation', en: 'The package will be delivered tomorrow morning.', ru: 'Посылка будет доставлена завтра утром.' },
      { type: 'multiple-choice', question: 'A new hospital ___ in our city next year.', options: ['will build', 'will be built', 'is built', 'builds'], answer: 1, explanation: 'Future passive: will be + past participle.' },
    ],
  },

  {
    id: 'b1-relative-clauses',
    level: 'B1', category: 'Grammar',
    title: 'Relative Clauses', titleRu: 'Придаточные определительные — который, которая',
    duration: 15, xpReward: 100,
    content: {
      explanation: `Relative clauses give more information about a noun. They are introduced by relative pronouns: who, which, that, whose, where.\n\nWHO: for people (The woman who called is my sister.)\nWHICH: for things (The book which I read was amazing.)\nTHAT: for people or things in defining clauses (The car that I drive is old.)\nWHERE: for places (The city where I was born is beautiful.)`,
      examples: [
        { en: 'The man who lives next door is very friendly.', ru: 'Мужчина, который живёт по соседству, очень дружелюбный.' },
        { en: 'This is the film which won the Oscar.', ru: 'Это фильм, который выиграл Оскар.' },
        { en: 'I know a restaurant where they serve amazing food.', ru: 'Я знаю ресторан, где подают замечательную еду.' },
        { en: 'The girl whose father is a pilot wants to fly too.', ru: 'Девочка, чей отец — пилот, тоже хочет летать.' },
      ],
      keyPoints: [
        'WHO for people, WHICH for things, WHERE for places, WHOSE for possession',
        'THAT can replace who/which in defining (restrictive) clauses',
        'Defining: no commas (identifies the noun)',
        'Non-defining: use commas — cannot use "that" (My car, which is red, is fast.)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'The doctor ___ treated me was very professional.', options: ['which', 'whose', 'who', 'where'], answer: 2, explanation: 'For people, use WHO.' },
      { type: 'fill-blank', sentence: 'Paris is the city ___ the Eiffel Tower stands.', answer: 'where', hint: 'For places: where' },
      { type: 'reorder', words: ['which', 'I', 'The', 'film', 'watched', 'boring.', 'was'], correct: 'The film which I watched was boring.' },
      { type: 'error-spot', sentence: 'The car which belongs John is very old.', errorWord: 'which belongs', correction: 'whose', explanation: 'For possession use WHOSE: "the car whose owner is John".' },
      { type: 'translation', en: 'Do you know anyone who speaks Chinese?', ru: 'Ты знаешь кого-нибудь, кто говорит по-китайски?' },
    ],
  },

  {
    id: 'b1-reported-speech',
    level: 'B1', category: 'Grammar',
    title: 'Reported Speech', titleRu: 'Косвенная речь — что он сказал',
    duration: 15, xpReward: 100,
    content: {
      explanation: `Reported speech (indirect speech) is used to report what someone said without quoting their exact words. Tenses usually shift back (backshift).\n\n"I am tired." → She said she WAS tired.\n"I have finished." → He said he HAD finished.\n"I will help you." → She said she WOULD help me.\n\nTime expressions also change: now→then, today→that day, tomorrow→the next day.`,
      examples: [
        { en: '"I love pizza," he said. → He said he loved pizza.', ru: '«Я люблю пиццу» — Он сказал, что любит пиццу.' },
        { en: '"We are leaving," they said. → They said they were leaving.', ru: '«Мы уходим» — Они сказали, что уходят.' },
        { en: '"I will call you," she promised. → She promised she would call me.', ru: '«Я позвоню тебе» — Она пообещала, что позвонит мне.' },
        { en: '"Have you seen this film?" → She asked if I had seen that film.', ru: '«Ты видел этот фильм?» — Она спросила, видел ли я этот фильм.' },
      ],
      keyPoints: [
        'Say + that: He said that he was tired.',
        'Tell + person + that: He told me that he was tired.',
        'Tense shift: am→was, is→was, will→would, have→had',
        'Questions: asked if/whether (yes/no questions) or asked + question word',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '"I am hungry." She said she ___ hungry.', options: ['is', 'am', 'was', 'were'], answer: 2, explanation: 'Backshift: am/is → was in reported speech.' },
      { type: 'fill-blank', sentence: '"I will help you." He promised he ___ help me.', answer: 'would', hint: 'Backshift: will → would' },
      { type: 'error-spot', sentence: 'She said me that she was sorry.', errorWord: 'said me', correction: 'told me', explanation: '"Tell" takes an object: told me. "Say" doesn\'t: said that.' },
      { type: 'translation', en: 'He told us he had already eaten.', ru: 'Он сказал нам, что уже поел.' },
      { type: 'multiple-choice', question: '"Do you like jazz?" She asked me if I ___ jazz.', options: ['like', 'liked', 'do like', 'will like'], answer: 1, explanation: 'Backshift in yes/no questions: like → liked.' },
    ],
  },

  // ── B2 ─────────────────────────────────────────────────────────────────
  {
    id: 'b2-second-conditional',
    level: 'B2', category: 'Grammar',
    title: 'Second Conditional', titleRu: 'Нереальные условия в настоящем',
    duration: 15, xpReward: 125,
    content: {
      explanation: `Second Conditional describes unreal, hypothetical, or unlikely situations in the present or future. We imagine a different reality.\n\nStructure: IF + Past Simple → would + base verb\n\nIf I were a millionaire, I would travel the world.\n(I'm NOT a millionaire — this is imaginary.)\n\nNote: "Were" is used for all persons with "to be" in formal English: If I WERE you...`,
      examples: [
        { en: 'If she had more time, she would learn Korean.', ru: 'Если бы у неё было больше времени, она бы учила корейский.' },
        { en: 'What would you do if you lost your job?', ru: 'Что бы ты сделал, если бы потерял работу?' },
        { en: 'If I were you, I wouldn\'t say that.', ru: 'На твоём месте я бы этого не говорил.' },
        { en: 'We\'d move abroad if we could afford it.', ru: 'Мы бы переехали за границу, если бы могли себе это позволить.' },
      ],
      keyPoints: [
        'IF + Past Simple (imaginary present/future)',
        'Result: would/could/might + base verb',
        'Use "were" for all persons with to be (formal): if I were, if she were',
        '2nd Conditional = UNREAL (currently not true); 1st Conditional = possible',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'If she ___ the truth, she wouldn\'t be so upset.', options: ['knew', 'knows', 'would know', 'know'], answer: 0, explanation: 'Second Conditional: if + Past Simple. knew = past simple of know.' },
      { type: 'fill-blank', sentence: 'If I ___ you, I would accept that job offer.', answer: 'were', hint: 'Second Conditional uses "were" for all persons (formal English).' },
      { type: 'error-spot', sentence: 'If I would have more money, I would buy a car.', errorWord: 'would have', correction: 'had', explanation: 'No "would" in the IF clause. Use Past Simple: "If I had..."' },
      { type: 'translation', en: 'What would you do if you could travel back in time?', ru: 'Что бы ты сделал, если бы мог вернуться в прошлое?' },
      { type: 'reorder', words: ['speak', 'could', 'I', 'Chinese,', 'a', 'If', 'get', 'I\'d', 'better', 'job.'], correct: 'If I could speak Chinese, I\'d get a better job.' },
    ],
  },

  {
    id: 'b2-third-conditional',
    level: 'B2', category: 'Grammar',
    title: 'Third Conditional', titleRu: 'Сожаления о прошлом — если бы тогда...',
    duration: 15, xpReward: 125,
    content: {
      explanation: `Third Conditional refers to imaginary situations in the PAST — things that didn't happen. It's used to express regrets or to speculate about past events.\n\nStructure: IF + Past Perfect → would have + past participle\n\nIf I had studied harder, I would have passed the exam.\n(I didn't study hard, so I didn't pass — it's in the past, can't change it.)`,
      examples: [
        { en: 'If she had left earlier, she wouldn\'t have missed the train.', ru: 'Если бы она вышла раньше, она бы не опоздала на поезд.' },
        { en: 'I would have helped you if you had asked me.', ru: 'Я бы помог тебе, если бы ты попросил меня.' },
        { en: 'If he hadn\'t been so rude, she wouldn\'t have left.', ru: 'Если бы он не был таким грубым, она бы не ушла.' },
        { en: 'We would have won if we\'d played better.', ru: 'Мы бы выиграли, если бы сыграли лучше.' },
      ],
      keyPoints: [
        'IF + Past Perfect (had + past participle)',
        'Result: would have + past participle',
        'Expresses regret, criticism, or speculation about past',
        'Short forms: I would have → I\'d have | would not have → wouldn\'t have',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'If he ___ earlier, he would have caught the bus.', options: ['left', 'had left', 'has left', 'would leave'], answer: 1, explanation: 'Third Conditional: IF + Past Perfect (had + past participle).' },
      { type: 'fill-blank', sentence: 'She would have gotten the job if she ___ better at the interview. (perform)', answer: 'had performed', hint: 'if + had + past participle' },
      { type: 'error-spot', sentence: 'If I would have known, I would have told you.', errorWord: 'would have known', correction: 'had known', explanation: 'No "would" in the IF clause. Use Past Perfect: "If I had known..."' },
      { type: 'translation', en: 'We wouldn\'t have gotten lost if we had brought a map.', ru: 'Мы бы не заблудились, если бы взяли карту.' },
      { type: 'reorder', words: ['would', 'you', 'called', 'have', 'had', 'your', 'If', 'I', 'number.', 'I', 'known'], correct: 'If I had known your number, I would have called you.' },
    ],
  },

  {
    id: 'b2-gerunds-infinitives',
    level: 'B2', category: 'Grammar',
    title: 'Gerunds & Infinitives', titleRu: 'Глагол-ing vs to + infinitive',
    duration: 15, xpReward: 125,
    content: {
      explanation: `After some verbs we use gerunds (verb + -ing), after others we use infinitives (to + verb), and some verbs can use both.\n\nGerund only: enjoy, avoid, suggest, finish, mind, consider, practise\nInfinitive only: want, hope, decide, plan, agree, refuse, manage\nBoth (same meaning): start, begin, like, love, hate, continue\nBoth (different meaning): remember, stop, try, regret`,
      examples: [
        { en: 'I enjoy reading before bed.', ru: 'Мне нравится читать перед сном.' },
        { en: 'She decided to study abroad.', ru: 'Она решила учиться за рубежом.' },
        { en: 'He stopped smoking last year.', ru: 'Он бросил курить в прошлом году.' },
        { en: 'I remember meeting her at the conference.', ru: 'Я помню, что встретил её на конференции.' },
      ],
      keyPoints: [
        'Remember + gerund = memory of past event',
        'Remember + infinitive = remember to do something (don\'t forget)',
        'Stop + gerund = quit doing; Stop + infinitive = pause to do',
        'Try + gerund = experiment; Try + infinitive = make effort',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'I\'ve always avoided ___ in large crowds.', options: ['to shop', 'shopping', 'shop', 'shopped'], answer: 1, explanation: '"Avoid" is always followed by gerund (-ing form).' },
      { type: 'multiple-choice', question: 'She decided ___ a new language.', options: ['learning', 'to learn', 'learn', 'learned'], answer: 1, explanation: '"Decide" is always followed by infinitive (to + verb).' },
      { type: 'fill-blank', sentence: 'Please stop ___ — I can\'t concentrate! (talk)', answer: 'talking', hint: 'Stop + gerund = quit the action' },
      { type: 'error-spot', sentence: 'He suggested to go to the new restaurant.', errorWord: 'to go', correction: 'going', explanation: '"Suggest" always takes gerund: suggest going, suggest doing.' },
      { type: 'translation', en: 'I regret not studying harder when I was young.', ru: 'Я сожалею, что не учился усерднее в молодости.' },
    ],
  },

  {
    id: 'b2-discourse-markers',
    level: 'B2', category: 'Writing',
    title: 'Discourse Markers', titleRu: 'Слова-связки: however, therefore, nevertheless',
    duration: 15, xpReward: 125,
    content: {
      explanation: `Discourse markers (also called connectors or linking words) connect ideas and make your writing more coherent and sophisticated.\n\nContrast: however, nevertheless, nonetheless, on the other hand, despite, although\nResult: therefore, consequently, as a result, thus, hence\nAddition: furthermore, moreover, in addition, besides\nExample: for instance, for example, such as, namely`,
      examples: [
        { en: 'The hotel was expensive; however, the service was excellent.', ru: 'Отель был дорогим; однако сервис был превосходным.' },
        { en: 'She studied hard. Consequently, she passed with top grades.', ru: 'Она усердно занималась. Следовательно, она сдала с отличием.' },
        { en: 'Furthermore, the research shows a clear correlation.', ru: 'Более того, исследование показывает явную корреляцию.' },
        { en: 'Despite the rain, the event was a huge success.', ru: 'Несмотря на дождь, мероприятие прошло с большим успехом.' },
      ],
      keyPoints: [
        'However/Nevertheless: contrast (but more formal)',
        'Therefore/Consequently/Thus: result or conclusion',
        'Furthermore/Moreover: add important information',
        'Despite/Although: contrast (despite + noun/gerund; although + clause)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'The economy is strong. ___, unemployment remains high.', options: ['Therefore', 'However', 'Furthermore', 'As a result'], answer: 1, explanation: 'Contrast between strong economy and high unemployment → However.' },
      { type: 'fill-blank', sentence: 'He worked very hard. ___, he was promoted within a year.', answer: 'Consequently', hint: 'Result of hard work → a result connector' },
      { type: 'multiple-choice', question: '_____ his lack of experience, he was hired for the position.', options: ['Although', 'Despite', 'However', 'Therefore'], answer: 1, explanation: '"Despite" + noun/gerund phrase. "Although" needs a full clause.' },
      { type: 'error-spot', sentence: 'The plan is good. Nevertheless, it needs some changes. Although, we should start now.', errorWord: 'Although,', correction: 'However,', explanation: '"Although" introduces a subordinate clause, not a main sentence. Use "However" to start a new sentence.' },
      { type: 'translation', en: 'The research is promising; nevertheless, more testing is required.', ru: 'Исследование перспективно; тем не менее, требуется больше тестирования.' },
    ],
  },

  {
    id: 'b2-advanced-passive',
    level: 'B2', category: 'Grammar',
    title: 'Advanced Passive Voice', titleRu: 'Пассивный залог — все времена',
    duration: 20, xpReward: 125,
    content: {
      explanation: `Advanced passive forms include all tenses and special constructions.\n\nPassive with modal: should be done, must be checked, can be seen\nPassive infinitive: I want it to be done. It seems to have been solved.\nImpersonal passive: It is said that... / It is believed that... / It is reported that...\nPassive with two objects: She was given a prize. / A prize was given to her.`,
      examples: [
        { en: 'It is believed that the treasure is buried here.', ru: 'Считается, что клад зарыт здесь.' },
        { en: 'The report should have been submitted yesterday.', ru: 'Отчёт должен был быть сдан вчера.' },
        { en: 'He was seen leaving the building at midnight.', ru: 'Его видели выходящим из здания в полночь.' },
        { en: 'The CEO is said to have resigned.', ru: 'Говорят, что генеральный директор ушёл в отставку.' },
      ],
      keyPoints: [
        'Modal passive: modal + be + past participle (must be done)',
        'Perfect passive: have/has/had + been + past participle',
        'Impersonal: It is said/believed/reported/claimed + that...',
        'Personal: He is said to be / to have been...',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'The results ___ by Friday at the latest.', options: ['should submit', 'should be submitted', 'should have submitted', 'are submitting'], answer: 1, explanation: 'Modal passive: should + be + past participle.' },
      { type: 'fill-blank', sentence: 'It ___ that the painting was stolen in 1943. (believe)', answer: 'is believed', hint: 'Impersonal passive: It + is/was + past participle + that...' },
      { type: 'error-spot', sentence: 'The package has been already delivered.', errorWord: 'has been already', correction: 'has already been', explanation: '"Already" goes between "has" and "been": has already been delivered.' },
      { type: 'translation', en: 'It is reported that hundreds of people were affected.', ru: 'Сообщается, что пострадали сотни людей.' },
      { type: 'multiple-choice', question: 'The new law ___ by parliament next month.', options: ['will pass', 'will be passing', 'will be passed', 'has been passed'], answer: 2, explanation: 'Future passive: will be + past participle.' },
    ],
  },

  // ── C1 ─────────────────────────────────────────────────────────────────
  {
    id: 'c1-inversion',
    level: 'C1', category: 'Grammar',
    title: 'Inversion', titleRu: 'Инверсия — Never have I seen...',
    duration: 20, xpReward: 150,
    content: {
      explanation: `Inversion means reversing the normal subject-verb order. It's used for emphasis and is common in formal writing and speeches.\n\nNegative adverbials at the beginning: Never, Rarely, Seldom, Hardly, No sooner, Not only, On no account\n\nNever have I seen such beautiful scenery.\nRarely does she complain about anything.\nHardly had he arrived when the problems started.`,
      examples: [
        { en: 'Never have I felt so proud.', ru: 'Никогда я не чувствовал такой гордости.' },
        { en: 'Not only did she win, but she also broke the record.', ru: 'Она не только выиграла, но и побила рекорд.' },
        { en: 'Rarely does the Prime Minister speak so openly.', ru: 'Редко Премьер-министр говорит так открыто.' },
        { en: 'Hardly had I sat down when the phone rang.', ru: 'Я едва сел, как зазвонил телефон.' },
      ],
      keyPoints: [
        'Trigger words: Never, Rarely, Seldom, Hardly, Scarcely, No sooner',
        'Structure: Trigger + auxiliary + subject + main verb',
        '"Hardly/Scarcely ... when/before": Hardly had she left when it started raining',
        '"Not only ... but also": requires inversion after "not only"',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'Rarely ___ such an inspiring speech.', options: ['I hear', 'do I hear', 'I do hear', 'hear I'], answer: 1, explanation: 'Inversion: Rarely + auxiliary (do) + subject (I) + main verb (hear).' },
      { type: 'reorder', words: ['they', 'left', 'Not', 'lost,', 'only', 'also', 'got', 'did', 'but', 'they'], correct: 'Not only did they lose, but they also got lost.' },
      { type: 'fill-blank', sentence: 'No sooner ___ she arrived than the meeting started.', answer: 'had', hint: 'No sooner had + subject + past participle + than' },
      { type: 'error-spot', sentence: 'Never I have seen such a mess.', errorWord: 'I have', correction: 'have I', explanation: 'Inversion: Never + auxiliary FIRST, then subject: Never HAVE I seen.' },
      { type: 'translation', en: 'Seldom do we get a chance like this.', ru: 'Редко нам выпадает такой шанс.' },
    ],
  },

  {
    id: 'c1-mixed-conditionals',
    level: 'C1', category: 'Grammar',
    title: 'Mixed Conditionals', titleRu: 'Смешанные условия — сложные случаи',
    duration: 20, xpReward: 150,
    content: {
      explanation: `Mixed conditionals combine different time frames in the if-clause and result clause. There are two main types.\n\nType 1 (Past condition → Present result): If + Past Perfect → would + base verb\n"If she had studied medicine, she would be a doctor now."\n(She didn't study medicine in the past → she's not a doctor now)\n\nType 2 (Present/permanent condition → Past result): If + Past Simple → would have + past participle\n"If he were more careful, he wouldn't have made that mistake."`,
      examples: [
        { en: 'If I had taken that job, I would be living in Tokyo now.', ru: 'Если бы я взял ту работу, я бы жил сейчас в Токио.' },
        { en: 'She would have become a dancer if she were more talented.', ru: 'Она стала бы танцором, если бы была более талантливой.' },
        { en: 'If he hadn\'t been so shy, he would have more friends now.', ru: 'Если бы он не был таким застенчивым, у него было бы сейчас больше друзей.' },
        { en: 'If I spoke Spanish, I would have got the job in Madrid.', ru: 'Если бы я говорил по-испански, я бы получил работу в Мадриде.' },
      ],
      keyPoints: [
        'Mixed Type 1: If + Past Perfect (past) → would + infinitive (now)',
        'Mixed Type 2: If + Past Simple (permanent/character) → would have + past participle (past)',
        '"Now" or "at this moment" in result clause = Mixed Type 1',
        'Character/permanent state in if-clause = Mixed Type 2',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'If he had invested in that company, he ___ a millionaire now.', options: ['would be', 'would have been', 'will be', 'was'], answer: 0, explanation: 'Past condition (had invested) → present result (now) → would + base verb.' },
      { type: 'fill-blank', sentence: 'If she were more ambitious, she ___ that opportunity last year. (take)', answer: 'would have taken', hint: 'Permanent trait (were) → past result → would have + past participle' },
      { type: 'translation', en: 'If I hadn\'t moved to London, I wouldn\'t speak English so well now.', ru: 'Если бы я не переехал в Лондон, я бы не говорил на английском так хорошо сейчас.' },
      { type: 'error-spot', sentence: 'If she studied harder, she would have passed the exam yesterday.', errorWord: 'studied', correction: 'had studied', explanation: 'Past result (yesterday) → past condition needs Past Perfect: "had studied".' },
      { type: 'multiple-choice', question: 'Type of conditional: "If I were taller, I would have become a model."', options: ['1st Conditional', '2nd Conditional', '3rd Conditional', 'Mixed Conditional'], answer: 3, explanation: 'Permanent trait (were, present) → past result (would have become) = Mixed.' },
    ],
  },

  {
    id: 'c1-idioms',
    level: 'C1', category: 'Vocabulary',
    title: 'Essential English Idioms', titleRu: 'Топ идиомы — как говорят носители',
    duration: 20, xpReward: 150,
    content: {
      explanation: `Idioms are fixed phrases whose meaning can't be understood from the individual words. They make your English sound natural and native-like. Here are essential idioms for C1 level:\n\nBody idioms: bite the bullet (терпеть боль), cost an arm and a leg (стоить очень дорого), break a leg (удачи!), pull someone's leg (разыгрывать).\n\nBusiness: think outside the box (мыслить нестандартно), back to the drawing board (начать заново), get the ball rolling (начать процесс).`,
      examples: [
        { en: 'The new iPhone costs an arm and a leg, but it\'s worth it.', ru: 'Новый iPhone стоит безумных денег, но оно того стоит.' },
        { en: 'Just bite the bullet and tell her the truth.', ru: 'Просто соберись с духом и скажи ей правду.' },
        { en: 'Our plan failed — we\'re back to the drawing board.', ru: 'Наш план провалился — придётся начать всё заново.' },
        { en: 'Are you pulling my leg? That can\'t be true!', ru: 'Ты меня разыгрываешь? Этого не может быть!' },
      ],
      keyPoints: [
        '"Hit the nail on the head" = say something exactly right',
        '"Under the weather" = feeling sick or unwell',
        '"Once in a blue moon" = very rarely',
        '"Bite off more than you can chew" = take on too much',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '"Break a leg!" means:', options: ['Be careful!', 'Good luck!', 'Well done!', 'Hurry up!'], answer: 1, explanation: '"Break a leg!" is a theatrical expression meaning "Good luck!" — never use it literally!' },
      { type: 'multiple-choice', question: 'She\'s feeling under the weather today. This means:', options: ['She\'s very happy', 'She\'s feeling ill', 'She\'s confused', 'She\'s outside'], answer: 1, explanation: '"Under the weather" means feeling unwell or slightly sick.' },
      { type: 'translation', en: 'We need to think outside the box to solve this problem.', ru: 'Нам нужно мыслить нестандартно, чтобы решить эту проблему.' },
      { type: 'fill-blank', sentence: 'I only see my old school friends once in a ___ moon.', answer: 'blue', hint: '"Once in a ___ moon" = very rarely' },
      { type: 'multiple-choice', question: '"Hit the nail on the head" means:', options: ['Use a hammer', 'Make a mistake', 'Say exactly the right thing', 'Arrive on time'], answer: 2, explanation: '"Hit the nail on the head" = identify or say something exactly correctly.' },
    ],
  },

  {
    id: 'c1-academic-writing',
    level: 'C1', category: 'Writing',
    title: 'Academic Writing Style', titleRu: 'Академическое письмо — эссе и аргументы',
    duration: 20, xpReward: 150,
    content: {
      explanation: `Academic writing requires formal vocabulary, complex sentence structures, and logical argumentation. Key features: objective tone, formal vocabulary, hedging language, and clear structure.\n\nFormal vocabulary: use → utilize, show → demonstrate, get → obtain, start → initiate, important → significant, big → substantial.\n\nHedging: It can be argued that... / It appears that... / The evidence suggests... / This may indicate...`,
      examples: [
        { en: 'The data clearly demonstrates a significant correlation between the variables.', ru: 'Данные явно демонстрируют значительную корреляцию между переменными.' },
        { en: 'It could be argued that economic factors play a pivotal role in this context.', ru: 'Можно утверждать, что экономические факторы играют ключевую роль в данном контексте.' },
        { en: 'Notwithstanding the limitations of this study, the findings are noteworthy.', ru: 'Несмотря на ограничения данного исследования, выводы заслуживают внимания.' },
        { en: 'This paper aims to examine the extent to which globalization affects local cultures.', ru: 'Данная работа направлена на изучение того, в какой мере глобализация влияет на местные культуры.' },
      ],
      keyPoints: [
        'Avoid contractions: don\'t → do not, it\'s → it is',
        'Use passive voice for objectivity: "it was found" not "I found"',
        'Hedge claims: "suggests" not "proves", "appears to" not "is"',
        'Essay structure: Introduction (thesis), Body (arguments + evidence), Conclusion',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'The most formal way to say "use" in academic writing is:', options: ['use', 'utilize', 'employ', 'All of these are acceptable'], answer: 3, explanation: 'All three are acceptable in academic writing. "Utilize" and "employ" are more formal.' },
      { type: 'fill-blank', sentence: 'The evidence ___ that climate change is accelerating. (suggest)', answer: 'suggests', hint: 'Hedging: evidence suggests (not "proves")' },
      { type: 'error-spot', sentence: 'In this essay, I\'m going to show you the main causes of poverty.', errorWord: 'I\'m going to show you', correction: 'This essay examines', explanation: 'Academic writing avoids contractions and first person. Use: "This essay examines/analyses/demonstrates".' },
      { type: 'reorder', words: ['argued', 'education', 'economic', 'It', 'be', 'drives', 'that', 'could', 'growth.'], correct: 'It could be argued that education drives economic growth.' },
      { type: 'translation', en: 'The findings of this study have significant implications for public health policy.', ru: 'Результаты этого исследования имеют важные последствия для политики в области общественного здравоохранения.' },
    ],
  },

  {
    id: 'c1-debate-language',
    level: 'C1', category: 'Speaking',
    title: 'Debate Language', titleRu: 'Язык дискуссии — соглашаться и возражать',
    duration: 20, xpReward: 150,
    content: {
      explanation: `Effective debate requires diplomatic language for agreeing, disagreeing, and making concessions without being rude.\n\nAgreeing: Absolutely, I couldn't agree more, You have a point there, That's a fair point.\nDisagreeing politely: I see your point, but... / With all due respect... / I beg to differ.\nConceding: You may be right that... but... / Granted, however... / While I accept that...\nInterrupting: If I could just come in here... / May I add something?`,
      examples: [
        { en: 'I see your point, but I\'m not entirely convinced by the evidence.', ru: 'Я понимаю вашу точку зрения, но меня не полностью убеждают доказательства.' },
        { en: 'Granted, the solution is expensive; nevertheless, the long-term benefits outweigh the costs.', ru: 'Конечно, решение дорогостоящее; тем не менее, долгосрочные преимущества перевешивают затраты.' },
        { en: 'With all due respect, I think you\'re missing the bigger picture here.', ru: 'При всём уважении, я думаю, что здесь вы упускаете более широкую картину.' },
        { en: 'That\'s a compelling argument; however, there are other factors to consider.', ru: 'Это убедительный аргумент; однако есть и другие факторы для рассмотрения.' },
      ],
      keyPoints: [
        'Polite disagreement: "I see your point, but..." / "With respect..."',
        'Strong agreement: "Absolutely!" / "That\'s exactly right!" / "Precisely!"',
        'Conceding: "Granted..." / "While I accept..." / "Fair point, although..."',
        'Inviting opinion: "What\'s your take on this?" / "Where do you stand on...?"',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'You want to politely disagree. You say:', options: ['"You\'re completely wrong!"', '"I beg to differ."', '"That\'s nonsense."', '"No, that\'s not right."'], answer: 1, explanation: '"I beg to differ" is a polite formal way to express disagreement.' },
      { type: 'fill-blank', sentence: 'I see your ___, but I believe the data tells a different story.', answer: 'point', hint: '"I see your ___" is a polite disagreement opener.' },
      { type: 'multiple-choice', question: 'To concede a point and then counter-argue, use:', options: ['"However..."', '"Granted, ... but..."', '"Although..."', '"Therefore..."'], answer: 1, explanation: '"Granted, [their point]... but [your counter-argument]" = classic concession structure.' },
      { type: 'translation', en: 'With all due respect, the statistics don\'t support that claim.', ru: 'При всём уважении, статистика не подтверждает это утверждение.' },
      { type: 'reorder', words: ['accept', 'While', 'challenges,', 'there', 'I', 'the', 'are', 'benefits.', 'significant', 'that'], correct: 'While I accept the challenges, there are significant benefits.' },
    ],
  },

  // ── C2 ─────────────────────────────────────────────────────────────────
  {
    id: 'c2-advanced-idioms',
    level: 'C2', category: 'Vocabulary',
    title: 'Advanced Idioms & Phrasal Verbs', titleRu: 'Продвинутые идиомы и фразовые глаголы',
    duration: 25, xpReward: 200,
    content: {
      explanation: `At C2 level, mastering complex phrasal verbs and sophisticated idioms separates near-native from native-sounding English.\n\nComplex phrasal verbs: come to terms with (смириться), fall back on (прибегнуть к), put up with (терпеть), see through (раскусить), talk out of (отговорить), look down on (смотреть свысока).\n\nLiterary idioms: add fuel to the fire, flogging a dead horse, the tip of the iceberg, a double-edged sword.`,
      examples: [
        { en: 'I\'ve finally come to terms with the fact that I\'ll never be a professional athlete.', ru: 'Я наконец-то смирился с тем, что никогда не стану профессиональным спортсменом.' },
        { en: 'The scandal was just the tip of the iceberg — there\'s much more to reveal.', ru: 'Скандал был лишь верхушкой айсберга — есть что ещё раскрыть.' },
        { en: 'I can\'t put up with this noise any longer.', ru: 'Я больше не могу терпеть этот шум.' },
        { en: 'Arguing with him is like flogging a dead horse — he never changes his mind.', ru: 'Спорить с ним — всё равно что биться головой об стену — он никогда не меняет своего мнения.' },
      ],
      keyPoints: [
        '"A double-edged sword" = something with both advantages and disadvantages',
        '"See through someone" = realize their true (deceptive) intentions',
        '"Fall back on" = use as a last resort or secondary option',
        '"Talk someone out of" = persuade someone NOT to do something',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '"He talked me out of quitting." This means:', options: ['He persuaded me to quit', 'He persuaded me NOT to quit', 'He helped me quit', 'He quit because of me'], answer: 1, explanation: '"Talk someone OUT OF" = persuade them not to do something.' },
      { type: 'multiple-choice', question: '"Adding fuel to the fire" means:', options: ['Starting a problem', 'Making a bad situation worse', 'Solving a problem', 'Ignoring a problem'], answer: 1, explanation: '"Add fuel to the fire" = make an already bad situation even worse.' },
      { type: 'fill-blank', sentence: 'After years of struggling, she finally came to ___ with her past.', answer: 'terms', hint: '"Come to ___ with" = accept something difficult' },
      { type: 'translation', en: 'The government\'s new policy is a double-edged sword.', ru: 'Новая политика правительства — это обоюдоострый меч.' },
      { type: 'error-spot', sentence: 'He always looks down at people who are less educated.', errorWord: 'at', correction: 'on', explanation: '"Look down ON someone" (not at) = consider someone inferior.' },
    ],
  },

  {
    id: 'c2-tense-nuances',
    level: 'C2', category: 'Grammar',
    title: 'Nuances of Tenses', titleRu: 'Тонкости времён — уровень носителя',
    duration: 25, xpReward: 200,
    content: {
      explanation: `At C2 level, subtle distinctions in tense use mark truly fluent speakers.\n\nPresent Perfect vs Past Simple: "He has lived here for years" (still here) vs "He lived here for years" (no longer here).\n\nPast Continuous for background: "While she was reading, he arrived." (her reading = background for his arrival).\n\nFuture Perfect: "By the time you read this, I will have left." (completed before a future point)\n\nThe "would" of habit: "Every evening, he would sit by the window." (habitual past)`,
      examples: [
        { en: 'I was wondering if you could help me. (polite/tentative)', ru: 'Я хотел узнать, не могли бы вы мне помочь. (вежливая форма)' },
        { en: 'By next year, she will have been working here for a decade.', ru: 'К следующему году она проработает здесь десять лет.' },
        { en: 'He would often come home late from the office.', ru: 'Он часто приходил домой поздно из офиса. (привычка в прошлом)' },
        { en: 'I\'m always losing my keys! (annoying habit — Present Continuous)', ru: 'Я постоянно теряю ключи! (раздражающая привычка)' },
      ],
      keyPoints: [
        '"Would + base verb" for repeated past habits (no longer happening)',
        'Past Continuous for interrupted or background actions',
        'Future Perfect (will have + past participle): completed by a future time',
        'Tentative/polite: "I was hoping..." / "I was wondering..." (more distant than present)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'He ___ in this house for 30 years, but now he lives in Spain.', options: ['has lived', 'lived', 'was living', 'is living'], answer: 1, explanation: 'Completed past period, no connection to now → Past Simple: lived.' },
      { type: 'fill-blank', sentence: 'By the time she graduates, she ___ English for 10 years. (study)', answer: 'will have been studying', hint: 'Completed action by a future point → Future Perfect Continuous' },
      { type: 'multiple-choice', question: '"I\'m always misplacing things!" This expresses:', options: ['A current action', 'An annoying habit', 'A future plan', 'A completed action'], answer: 1, explanation: 'Present Continuous with "always" = annoying or notable habit.' },
      { type: 'translation', en: 'When I was a child, my grandmother would tell me stories every night.', ru: 'Когда я был ребёнком, бабушка каждый вечер рассказывала мне истории.' },
      { type: 'multiple-choice', question: '"I was wondering if you could help me" is:', options: ['Grammatically wrong', 'Past tense for no reason', 'A polite/tentative form', 'Future in the past'], answer: 2, explanation: 'Past Continuous ("was wondering") is used to sound more polite and less direct in English.' },
    ],
  },

  {
    id: 'c2-register-style',
    level: 'C2', category: 'Writing',
    title: 'Register & Style', titleRu: 'Стиль речи — формальный vs неформальный',
    duration: 25, xpReward: 200,
    content: {
      explanation: `Register refers to the level of formality in language. Choosing the wrong register can sound rude, inappropriate, or unprofessional.\n\nFormal: utilize, commence, terminate, sufficient, endeavour, in addition, with reference to\nInformal: use, start, stop, enough, try, also, about\n\nEmail registers: Formal (Dear Sir/Madam, I am writing to enquire) vs Informal (Hi Mark, Just wanted to ask...). Neutral sits between these.`,
      examples: [
        { en: 'Formal: I would like to enquire about the position advertised.', ru: 'Формально: Я хотел бы узнать о рекламируемой должности.' },
        { en: 'Informal: Hey! I saw the job ad — can you tell me more?', ru: 'Неформально: Привет! Видел объявление о работе — можешь рассказать подробнее?' },
        { en: 'Formal: Please do not hesitate to contact me should you require further information.', ru: 'Формально: Пожалуйста, не стесняйтесь связаться со мной, если вам потребуется дополнительная информация.' },
        { en: 'Neutral: If you need anything else, feel free to get in touch.', ru: 'Нейтрально: Если вам что-то понадобится, не стесняйтесь обращаться.' },
      ],
      keyPoints: [
        'Formal writing: no contractions, complex sentences, Latinate vocabulary',
        'Informal writing: contractions OK, simple vocabulary, phrasal verbs fine',
        'Formal openings: Dear Mr Smith / To Whom It May Concern',
        'Formal closings: Yours sincerely (named person) / Yours faithfully (unknown)',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: 'Which is the most formal way to begin a business letter to an unknown person?', options: ['Hi there,', 'Hello,', 'To Whom It May Concern,', 'Hey,'], answer: 2, explanation: '"To Whom It May Concern" is the most formal opening when you don\'t know the name.' },
      { type: 'fill-blank', sentence: 'Please do not ___ to contact us if you need assistance. (formal)', answer: 'hesitate', hint: '"Please do not ___ to contact us" — formal phrase' },
      { type: 'multiple-choice', question: 'Which is informal? "The meeting is scheduled to ___ at 9am."', options: ['commence', 'start', 'initiate', 'begin'], answer: 1, explanation: '"Start" is informal/neutral. "Commence" and "initiate" are formal.' },
      { type: 'error-spot', sentence: 'Dear Mr. Johnson, I\'m writing to let you know I can\'t make it to the interview.', errorWord: 'I\'m, can\'t, make it', correction: 'I am, cannot, attend', explanation: 'Formal letters avoid contractions. "Make it" is informal → "attend".' },
      { type: 'translation', en: 'I would be grateful if you could confirm your availability at your earliest convenience.', ru: 'Я был бы признателен, если бы вы могли подтвердить свою готовность при первой возможности.' },
    ],
  },

  {
    id: 'c2-complex-structures',
    level: 'C2', category: 'Grammar',
    title: 'Complex Sentence Structures', titleRu: 'Сложные синтаксические конструкции',
    duration: 25, xpReward: 200,
    content: {
      explanation: `C2 speakers use advanced sentence structures that create elegant, varied writing and speech.\n\nAbsolute clauses: "The meeting over, they went for dinner." (formal/literary)\nParticipial clauses: "Having finished the report, she left the office."\nCleft sentences: "It was John who called you." / "What I need is a rest."\nNominal relative clauses: "What he said surprised everyone."\nEllipsis: "She will help if asked to." [help is omitted]`,
      examples: [
        { en: 'It was his confidence that impressed the interviewers most.', ru: 'Именно его уверенность больше всего впечатлила интервьюеров.' },
        { en: 'Having considered all the options, the board reached a unanimous decision.', ru: 'Рассмотрев все варианты, совет принял единогласное решение.' },
        { en: 'What strikes me most is her ability to remain calm under pressure.', ru: 'Больше всего меня поражает её способность сохранять спокойствие под давлением.' },
        { en: 'The negotiations having broken down, both parties sought legal advice.', ru: 'Поскольку переговоры зашли в тупик, обе стороны обратились за юридической консультацией.' },
      ],
      keyPoints: [
        'Cleft sentences for emphasis: "It was X that/who..."',
        'Participial clauses: Having + past participle (completed action before main verb)',
        'Nominal relative: What + clause (as subject or object)',
        'Absolute clause: Noun + participle (with no conjunction) — very formal',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '"It was the CEO ___  made the final decision." Choose the right word:', options: ['who', 'which', 'what', 'that'], answer: 0, explanation: '"It was + person + who" — use "who" for people in cleft sentences.' },
      { type: 'reorder', words: ['his', 'Having', 'presentation,', 'a', 'he', 'took', 'finished', 'break.'], correct: 'Having finished his presentation, he took a break.' },
      { type: 'fill-blank', sentence: '___ she said about the project completely changed my mind.', answer: 'What', hint: 'Nominal relative clause: ___ + subject + verb (as a noun phrase)' },
      { type: 'translation', en: 'It is her perseverance that sets her apart from the others.', ru: 'Именно её настойчивость выделяет её среди остальных.' },
      { type: 'error-spot', sentence: 'Having been waiting for hours, the train finally arrived.', errorWord: 'Having been waiting for hours, the train', correction: 'Having waited for hours, the passengers', explanation: 'The subject of the participial clause must match the main clause. The train didn\'t wait — people did.' },
    ],
  },

  {
    id: 'c2-native-patterns',
    level: 'C2', category: 'Speaking',
    title: 'Native Speaker Patterns', titleRu: 'Как говорят реальные носители',
    duration: 25, xpReward: 200,
    content: {
      explanation: `Real native speakers use patterns that textbooks rarely teach: reduced forms, vague language, pragmatic markers, and discourse signals.\n\nReduced speech: "gonna" (going to), "wanna" (want to), "kinda" (kind of), "dunno" (don't know), "lemme" (let me), "y'know" (you know).\n\nHedging and vagueness: "sort of", "kind of", "like", "roughly", "approximately", "or so", "and stuff", "and things like that".`,
      examples: [
        { en: '"I\'m gonna grab some coffee — you want anything?" (informal spoken)', ru: '«Я пойду возьму кофе — тебе что-нибудь нужно?» (разговорный стиль)' },
        { en: '"It\'s, like, kind of complicated to explain." (spoken filler)', ru: '«Это, ну, как бы сложно объяснить.» (разговорные вставки)' },
        { en: '"I\'d say there were, roughly speaking, a hundred people there."', ru: '«Я бы сказал, что там было, грубо говоря, человек сто.»' },
        { en: '"You know what I mean?" / "Does that make sense?" (checking understanding)', ru: '«Ты понимаешь, о чём я?» / «Это понятно?» (проверка понимания)' },
      ],
      keyPoints: [
        'Spoken English ≠ written English: contractions, reductions, fillers are normal',
        'Fillers: "you know", "I mean", "like", "right?" — signal natural speech',
        'Vague language: "or so", "ish" (five-ish = around five)',
        'Checking: "know what I mean?", "make sense?", "right?" at end of ideas',
      ],
    },
    exercises: [
      { type: 'multiple-choice', question: '"I dunno" is a spoken reduction of:', options: ['I do know', 'I don\'t know', 'I did know', 'I could know'], answer: 1, explanation: '"Dunno" = "don\'t know" — very common in informal spoken English.' },
      { type: 'multiple-choice', question: 'A native speaker says: "It took, like, three hours or so." What does "or so" mean?', options: ['Exactly', 'Approximately', 'More than', 'Less than'], answer: 1, explanation: '"Or so" = approximately/roughly. "Three hours or so" = around 3 hours.' },
      { type: 'fill-blank', sentence: '"I\'m ___ go to the gym after work." (spoken reduction of "going to")', answer: 'gonna', hint: 'Informal spoken reduction of "going to"' },
      { type: 'translation', en: 'The project is kind of complicated, to be honest.', ru: 'Честно говоря, проект немного сложноват.' },
      { type: 'error-spot', sentence: 'In my formal presentation: "I\'m gonna talk about, like, three main points, you know?"', errorWord: 'gonna, like, you know', correction: 'going to, three', explanation: 'Spoken fillers ("gonna", "like", "you know") are inappropriate in formal presentations. Use formal language.' },
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find(l => l.id === id)
}

export function getLessonsByLevel(level: CEFRLevel): Lesson[] {
  return LESSONS.filter(l => l.level === level)
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const idx = LESSONS.findIndex(l => l.id === currentId)
  return idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : undefined
}

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function isLevelLocked(userLevel: CEFRLevel, lessonLevel: CEFRLevel): boolean {
  return CEFR_ORDER.indexOf(lessonLevel) > CEFR_ORDER.indexOf(userLevel)
}

// Fix: some lessons have content as string (paste error) — normalize
LESSONS.forEach(l => {
  if (typeof (l.content as unknown) === 'string') {
    const str = l.content as unknown as string
    l.content = {
      explanation: str,
      examples: [],
      keyPoints: [],
    }
  }
})
