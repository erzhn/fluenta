export type ExerciseItem =
  | { type: 'fill_blank'; question: string; answer: string; hint?: string; options?: never; words?: never }
  | { type: 'multiple_choice'; question: string; options: string[]; answer: string; hint?: string; words?: never }
  | { type: 'build_sentence'; question?: string; words: string[]; answer: string; hint?: string; options?: never }

export interface Lesson {
  id: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  block: number
  blockName: string
  order: number
  title: string
  duration: string
  theory: {
    explanation: string
    examples: Array<{ english: string; russian: string }>
  }
  exercises: ExerciseItem[]
  quiz: Array<{
    question: string
    options: string[]
    answer: string
  }>
}
export type LessonCategory = string
export type CEFRLevel = Lesson['level']

export const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444', C2: '#ec4899',
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find(l => l.id === id)
}

export function getNextLesson(id: string): Lesson | undefined {
  const idx = LESSONS.findIndex(l => l.id === id)
  return idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : undefined
}

export const LESSONS: Lesson[] = [

  // ── A1 Block 1: Знакомство ──────────────────────────────────────────────────
  {
    id: 'a1-1-1', level: 'A1', block: 1, blockName: 'Знакомство', order: 1,
    title: 'To Be: я есть', duration: '10 мин',
    theory: {
      explanation: 'Глагол TO BE означает "быть/являться". Формы: I am (я есть), You are (ты/вы есть), He/She/It is (он/она/оно есть), We/You/They are (мы/вы/они есть).\n\nОтрицание: I am not (I\'m not), You are not (aren\'t), He/She/It is not (isn\'t).\n\nВопросы: Am I? Are you? Is he/she/it? Are we/they?\n\nКраткие ответы: Yes, I am. / No, I\'m not. Yes, she is. / No, she isn\'t.',
      examples: [
        { english: 'I am happy.', russian: 'Я счастлив(а).' },
        { english: 'She is a teacher.', russian: 'Она учительница.' },
        { english: 'They are friends.', russian: 'Они друзья.' },
        { english: 'We are students.', russian: 'Мы студенты.' },
        { english: 'Is he your brother?', russian: 'Он твой брат?' },
        { english: 'I am not tired.', russian: 'Я не устал(а).' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ a student.', answer: 'am', hint: 'с I используй am' },
      { type: 'fill_blank', question: 'She ___ a teacher.', answer: 'is', hint: 'с he/she/it используй is' },
      { type: 'fill_blank', question: 'They ___ friends.', answer: 'are', hint: 'с they используй are' },
      { type: 'multiple_choice', question: 'Выбери правильный вариант: We ___ students.', options: ['am', 'is', 'are', 'be'], answer: 'are' },
      { type: 'multiple_choice', question: 'Как сказать "Он не устал"?', options: ['He am not tired.', 'He is not tired.', 'He are not tired.', 'He be not tired.'], answer: 'He is not tired.' },
    ],
    quiz: [
      { question: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], answer: 'am' },
      { question: 'He ___ tall.', options: ['am', 'is', 'are', 'be'], answer: 'is' },
      { question: 'They ___ happy.', options: ['am', 'is', 'are', 'be'], answer: 'are' },
      { question: 'We ___ friends.', options: ['am', 'is', 'are', 'be'], answer: 'are' },
      { question: 'She ___ not tired.', options: ['am', 'is', 'are', 'be'], answer: 'is' },
    ],
  },

  {
    id: 'a1-1-2', level: 'A1', block: 1, blockName: 'Знакомство', order: 2,
    title: 'Меня зовут...', duration: '10 мин',
    theory: {
      explanation: 'Как представиться по-английски:\n\nMy name is... (Меня зовут...)\nI\'m from... (Я из...)\nI\'m ... years old. (Мне ... лет.)\nI am a student/teacher/doctor. (Я студент/учитель/врач.)\nNice to meet you! (Приятно познакомиться!)\n\nВопросы: What is your name? (Как тебя зовут?) / Where are you from? (Откуда ты?) / How old are you? (Сколько тебе лет?)',
      examples: [
        { english: 'My name is Anna.', russian: 'Меня зовут Анна.' },
        { english: 'I\'m from Kazakhstan.', russian: 'Я из Казахстана.' },
        { english: 'I\'m 25 years old.', russian: 'Мне 25 лет.' },
        { english: 'I am a student.', russian: 'Я студент.' },
        { english: 'Nice to meet you!', russian: 'Приятно познакомиться!' },
        { english: 'Where are you from?', russian: 'Откуда ты?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Как сказать "Меня зовут Алекс"?', options: ['My name are Alex.', 'My name is Alex.', 'I name is Alex.', 'Name my is Alex.'], answer: 'My name is Alex.' },
      { type: 'multiple_choice', question: 'Как спросить "Откуда ты?"', options: ['Where you from?', 'Where are you from?', 'Where is you from?', 'From where you?'], answer: 'Where are you from?' },
      { type: 'fill_blank', question: 'I\'m ___ Russia.', answer: 'from', hint: 'используй from' },
      { type: 'multiple_choice', question: 'Как сказать "Мне 20 лет"?', options: ['I am 20 years old.', 'I have 20 years.', 'I am 20 year old.', 'My age is have 20.'], answer: 'I am 20 years old.' },
      { type: 'multiple_choice', question: '"Nice to meet you" означает...', options: ['Пока!', 'Приятно познакомиться!', 'Как дела?', 'Спасибо!'], answer: 'Приятно познакомиться!' },
    ],
    quiz: [
      { question: 'Как сказать "Меня зовут..."?', options: ['My name is...', 'I name is...', 'Name me is...', 'My name are...'], answer: 'My name is...' },
      { question: 'I\'m ___ Kazakhstan.', options: ['in', 'from', 'at', 'of'], answer: 'from' },
      { question: 'Как спросить "Как тебя зовут?"', options: ['What are your name?', 'What is your name?', 'How is your name?', 'Who is your name?'], answer: 'What is your name?' },
      { question: '"Nice to meet you" — это...', options: ['Пока!', 'Спасибо!', 'Приятно познакомиться!', 'Извини!'], answer: 'Приятно познакомиться!' },
      { question: 'I ___ 18 years old.', options: ['am', 'is', 'are', 'have'], answer: 'am' },
    ],
  },

  {
    id: 'a1-1-3', level: 'A1', block: 1, blockName: 'Знакомство', order: 3,
    title: 'Числа 1-100', duration: '10 мин',
    theory: {
      explanation: 'Числа 1-20: one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.\n\nДесятки: thirty (30), forty (40), fifty (50), sixty (60), seventy (70), eighty (80), ninety (90), one hundred (100).\n\nСоставные числа: twenty-one (21), thirty-five (35), forty-two (42).\n\nИспользование: возраст (I am twenty), номера телефонов, адреса.',
      examples: [
        { english: 'I am twenty years old.', russian: 'Мне двадцать лет.' },
        { english: 'My phone number is five five five.', russian: 'Мой номер телефона — пять пять пять.' },
        { english: 'There are thirty students.', russian: 'Здесь тридцать студентов.' },
        { english: 'I live at number forty-two.', russian: 'Я живу в доме сорок два.' },
        { english: 'She is fifteen.', russian: 'Ей пятнадцать.' },
        { english: 'One hundred people came.', russian: 'Пришло сто человек.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Как пишется число 15?', options: ['fifty', 'fifteen', 'fiveteen', 'fifth'], answer: 'fifteen' },
      { type: 'multiple_choice', question: 'Как пишется число 40?', options: ['fourty', 'forty', 'four-ty', 'fority'], answer: 'forty' },
      { type: 'fill_blank', question: 'I am ___ years old. (20)', answer: 'twenty', hint: 'напиши число словом' },
      { type: 'multiple_choice', question: 'Что означает "thirty-five"?', options: ['13', '53', '35', '55'], answer: '35' },
      { type: 'multiple_choice', question: 'Как написать 100?', options: ['hundred', 'one hundreds', 'one hundred', 'a hundreds'], answer: 'one hundred' },
    ],
    quiz: [
      { question: 'Число 13 по-английски?', options: ['thirty', 'thirteen', 'threeteen', 'three-ten'], answer: 'thirteen' },
      { question: 'Число 80 по-английски?', options: ['eighthy', 'eighty', 'eighten', 'eight-ty'], answer: 'eighty' },
      { question: 'Что означает "forty-two"?', options: ['24', '14', '42', '44'], answer: '42' },
      { question: 'Число 19 по-английски?', options: ['ninety', 'nineteen', 'ninteen', 'nine-ten'], answer: 'nineteen' },
      { question: 'Число 50 по-английски?', options: ['fivety', 'fifteen', 'fifty', 'fify'], answer: 'fifty' },
    ],
  },

  {
    id: 'a1-1-4', level: 'A1', block: 1, blockName: 'Знакомство', order: 4,
    title: 'Дни и месяцы', duration: '10 мин',
    theory: {
      explanation: 'Дни недели (Days of the week): Monday (пн), Tuesday (вт), Wednesday (ср), Thursday (чт), Friday (пт), Saturday (сб), Sunday (вс).\n\nМесяцы (Months): January, February, March, April, May, June, July, August, September, October, November, December.\n\nПредлоги времени:\nON + день: on Monday, on Friday\nIN + месяц/сезон: in January, in summer\nAT + время: at 8 o\'clock',
      examples: [
        { english: 'Today is Monday.', russian: 'Сегодня понедельник.' },
        { english: 'My birthday is in March.', russian: 'Мой день рождения в марте.' },
        { english: 'The meeting is on Friday.', russian: 'Встреча в пятницу.' },
        { english: 'School starts in September.', russian: 'Школа начинается в сентябре.' },
        { english: 'We rest on Saturday and Sunday.', russian: 'Мы отдыхаем в субботу и воскресенье.' },
        { english: 'Christmas is in December.', russian: 'Рождество в декабре.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Какой предлог используется с днями недели?', options: ['in', 'at', 'on', 'by'], answer: 'on' },
      { type: 'multiple_choice', question: 'Какой предлог используется с месяцами?', options: ['on', 'at', 'by', 'in'], answer: 'in' },
      { type: 'fill_blank', question: 'The meeting is ___ Monday.', answer: 'on', hint: 'с днями недели используй on' },
      { type: 'multiple_choice', question: 'Как по-английски "среда"?', options: ['Tuesday', 'Thursday', 'Wednesday', 'Weekend'], answer: 'Wednesday' },
      { type: 'fill_blank', question: 'My birthday is ___ April.', answer: 'in', hint: 'с месяцами используй in' },
    ],
    quiz: [
      { question: 'Как по-английски "пятница"?', options: ['Thursday', 'Saturday', 'Sunday', 'Friday'], answer: 'Friday' },
      { question: 'Какой предлог: "I was born ___ July"?', options: ['on', 'at', 'in', 'by'], answer: 'in' },
      { question: 'Как по-английски "январь"?', options: ['June', 'January', 'July', 'February'], answer: 'January' },
      { question: 'Какой предлог: "The class is ___ Tuesday"?', options: ['in', 'at', 'by', 'on'], answer: 'on' },
      { question: 'Как по-английски "воскресенье"?', options: ['Saturday', 'Monday', 'Sunday', 'Friday'], answer: 'Sunday' },
    ],
  },

  {
    id: 'a1-1-5', level: 'A1', block: 1, blockName: 'Знакомство', order: 5,
    title: 'Цвета и прилагательные', duration: '10 мин',
    theory: {
      explanation: 'Цвета: red (красный), blue (синий), green (зелёный), yellow (жёлтый), white (белый), black (чёрный), orange (оранжевый), purple (фиолетовый), pink (розовый), grey (серый), brown (коричневый).\n\nОсновные прилагательные: big/small (большой/маленький), old/new (старый/новый), good/bad (хороший/плохой), hot/cold (горячий/холодный), fast/slow (быстрый/медленный), tall/short (высокий/низкий).\n\nПорядок слов: прилагательное ПЕРЕД существительным: a big house, a red car.',
      examples: [
        { english: 'I have a blue car.', russian: 'У меня синяя машина.' },
        { english: 'She has long black hair.', russian: 'У неё длинные чёрные волосы.' },
        { english: 'This is a big old house.', russian: 'Это большой старый дом.' },
        { english: 'The coffee is hot.', russian: 'Кофе горячий.' },
        { english: 'He is very tall.', russian: 'Он очень высокий.' },
        { english: 'I like cold weather.', russian: 'Мне нравится холодная погода.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Как сказать "большой красный шар"?', options: ['red big ball', 'a big red ball', 'a ball big red', 'big a red ball'], answer: 'a big red ball' },
      { type: 'fill_blank', question: 'The sky is ___.  (цвет неба)', answer: 'blue', hint: 'небо синее' },
      { type: 'multiple_choice', question: '"Hot" — это антоним к...', options: ['fast', 'big', 'cold', 'old'], answer: 'cold' },
      { type: 'multiple_choice', question: 'Как сказать "маленькая белая кошка"?', options: ['white small cat', 'a small white cat', 'a white small cat', 'small a white cat'], answer: 'a small white cat' },
      { type: 'multiple_choice', question: '"Tall" означает...', options: ['быстрый', 'старый', 'высокий', 'тихий'], answer: 'высокий' },
    ],
    quiz: [
      { question: 'Как по-английски "фиолетовый"?', options: ['pink', 'purple', 'orange', 'grey'], answer: 'purple' },
      { question: 'Правильный порядок: "новая маленькая машина"?', options: ['a small new car', 'a new small car', 'new small a car', 'car new small a'], answer: 'a new small car' },
      { question: '"Cold" — антоним к...', options: ['slow', 'small', 'hot', 'bad'], answer: 'hot' },
      { question: 'Как по-английски "серый"?', options: ['brown', 'green', 'grey', 'black'], answer: 'grey' },
      { question: '"Good" — антоним к...', options: ['slow', 'small', 'cold', 'bad'], answer: 'bad' },
    ],
  },

  // ── A1 Block 2: Семья и дом ─────────────────────────────────────────────────
  {
    id: 'a1-2-6', level: 'A1', block: 2, blockName: 'Семья и дом', order: 6,
    title: 'Have got', duration: '10 мин',
    theory: {
      explanation: 'HAVE GOT = обладание (иметь). \n\nI/You/We/They have got → I\'ve got, You\'ve got\nHe/She/It has got → She\'s got\n\nОтрицание: I haven\'t got, She hasn\'t got\nВопрос: Have you got...? Has she got...?\nКраткие ответы: Yes, I have. / No, she hasn\'t.\n\nHave got и have означают одно и то же, но have got — чаще в британском английском.',
      examples: [
        { english: 'I have got a dog.', russian: 'У меня есть собака.' },
        { english: 'She has got brown eyes.', russian: 'У неё карие глаза.' },
        { english: 'Have you got a car? Yes, I have.', russian: 'У тебя есть машина? Да.' },
        { english: 'He hasn\'t got a brother.', russian: 'У него нет брата.' },
        { english: 'We have got a big house.', russian: 'У нас большой дом.' },
        { english: 'Has she got a phone? No, she hasn\'t.', russian: 'У неё есть телефон? Нет.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ got a cat.', answer: 'have', hint: 'с I используй have' },
      { type: 'fill_blank', question: 'She ___ got blue eyes.', answer: 'has', hint: 'с she используй has' },
      { type: 'multiple_choice', question: 'Как сказать "У него нет машины"?', options: ['He haven\'t got a car.', 'He hasn\'t got a car.', 'He has\'t got a car.', 'He not got a car.'], answer: 'He hasn\'t got a car.' },
      { type: 'multiple_choice', question: 'Have you got a pen? ___, I have.', options: ['No', 'Yes', 'Not', 'Has'], answer: 'Yes' },
      { type: 'fill_blank', question: 'We ___ got two children.', answer: 'have', hint: 'с we используй have' },
    ],
    quiz: [
      { question: 'She ___ got a sister.', options: ['have', 'has', 'had', 'haves'], answer: 'has' },
      { question: 'Как сказать "У тебя есть брат?"', options: ['Have got you a brother?', 'Has you got a brother?', 'Have you got a brother?', 'Do you have got a brother?'], answer: 'Have you got a brother?' },
      { question: 'I ___ got any money.', options: ['haven\'t', 'hasn\'t', 'don\'t', 'doesn\'t'], answer: 'haven\'t' },
      { question: 'They ___ got a big garden.', options: ['has', 'have', 'haves', 'having'], answer: 'have' },
      { question: 'Has he got a car? No, he ___.', options: ['hasn\'t', 'haven\'t', 'didn\'t', 'don\'t'], answer: 'hasn\'t' },
    ],
  },

  {
    id: 'a1-2-7', level: 'A1', block: 2, blockName: 'Семья и дом', order: 7,
    title: 'Моя семья', duration: '10 мин',
    theory: {
      explanation: 'Члены семьи: mother/mum (мама), father/dad (папа), sister (сестра), brother (брат), grandmother/grandma (бабушка), grandfather/grandpa (дедушка), aunt (тётя), uncle (дядя), cousin (двоюродный брат/сестра), husband (муж), wife (жена), son (сын), daughter (дочь).\n\nПритяжательный падеж: добавь \'s к имени или существительному.\nAnna\'s sister = сестра Анны\nmy mother\'s name = имя моей мамы',
      examples: [
        { english: 'My mother\'s name is Elena.', russian: 'Мою маму зовут Елена.' },
        { english: 'I have one brother and two sisters.', russian: 'У меня один брат и две сестры.' },
        { english: 'My grandfather is 70 years old.', russian: 'Моему дедушке 70 лет.' },
        { english: 'Anna\'s husband is a doctor.', russian: 'Муж Анны — врач.' },
        { english: 'Her daughter is very cute.', russian: 'Её дочь очень милая.' },
        { english: 'His uncle lives in London.', russian: 'Его дядя живёт в Лондоне.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Как по-английски "бабушка" (неформально)?', options: ['grandmother', 'grandma', 'grandpa', 'granny-mother'], answer: 'grandma' },
      { type: 'multiple_choice', question: 'Как сказать "сестра Марии"?', options: ['Maria sister', 'sister of Maria', 'Maria\'s sister', 'Marias sister'], answer: 'Maria\'s sister' },
      { type: 'multiple_choice', question: '"Aunt" — это...', options: ['дядя', 'двоюродная сестра', 'тётя', 'невестка'], answer: 'тётя' },
      { type: 'fill_blank', question: 'My father\'s mother is my ___.', answer: 'grandmother', hint: 'мать отца — это...' },
      { type: 'multiple_choice', question: '"Cousin" — это...', options: ['брат', 'сестра', 'дядя', 'двоюродный брат или сестра'], answer: 'двоюродный брат или сестра' },
    ],
    quiz: [
      { question: 'Как по-английски "муж"?', options: ['wife', 'son', 'husband', 'uncle'], answer: 'husband' },
      { question: 'Как сказать "имя папы"?', options: ['dad name', 'dad\'s name', 'name of dad', 'dads name'], answer: 'dad\'s name' },
      { question: '"Daughter" — это...', options: ['сын', 'дочь', 'племянница', 'сестра'], answer: 'дочь' },
      { question: 'Как по-английски "дедушка" (неформально)?', options: ['grandad', 'grandfather', 'grandpa', 'old man'], answer: 'grandpa' },
      { question: '"Uncle" — это...', options: ['тётя', 'двоюродный брат', 'дядя', 'племянник'], answer: 'дядя' },
    ],
  },

  {
    id: 'a1-2-8', level: 'A1', block: 2, blockName: 'Семья и дом', order: 8,
    title: 'Мой дом', duration: '10 мин',
    theory: {
      explanation: 'Комнаты дома: living room (гостиная), bedroom (спальня), kitchen (кухня), bathroom (ванная), hall/hallway (прихожая), garden (сад), balcony (балкон).\n\nМебель и предметы: sofa (диван), table (стол), chair (стул), bed (кровать), wardrobe (шкаф), shelf (полка), lamp (лампа), mirror (зеркало), fridge (холодильник), washing machine (стиральная машина).',
      examples: [
        { english: 'We have three bedrooms.', russian: 'У нас три спальни.' },
        { english: 'The kitchen is very small.', russian: 'Кухня очень маленькая.' },
        { english: 'My sofa is in the living room.', russian: 'Мой диван в гостиной.' },
        { english: 'There is a big mirror in the bathroom.', russian: 'В ванной есть большое зеркало.' },
        { english: 'I sleep in the bedroom.', russian: 'Я сплю в спальне.' },
        { english: 'We eat in the kitchen.', russian: 'Мы едим на кухне.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I cook food in the ___.', answer: 'kitchen', hint: 'где готовят еду?' },
      { type: 'multiple_choice', question: '"Bedroom" — это...', options: ['кухня', 'ванная', 'спальня', 'гостиная'], answer: 'спальня' },
      { type: 'fill_blank', question: 'We watch TV in the ___ room.', answer: 'living', hint: 'гостиная = living room' },
      { type: 'multiple_choice', question: '"Fridge" — это...', options: ['стиральная машина', 'холодильник', 'плита', 'шкаф'], answer: 'холодильник' },
      { type: 'multiple_choice', question: 'Где обычно стоит кровать?', options: ['In the kitchen', 'In the bathroom', 'In the bedroom', 'In the garden'], answer: 'In the bedroom' },
    ],
    quiz: [
      { question: '"Living room" — это...', options: ['спальня', 'кухня', 'гостиная', 'ванная'], answer: 'гостиная' },
      { question: '"Wardrobe" — это...', options: ['кровать', 'стул', 'шкаф', 'полка'], answer: 'шкаф' },
      { question: 'Где ты принимаешь душ?', options: ['In the kitchen', 'In the bedroom', 'In the garden', 'In the bathroom'], answer: 'In the bathroom' },
      { question: '"Shelf" — это...', options: ['зеркало', 'лампа', 'полка', 'диван'], answer: 'полка' },
      { question: '"Garden" — это...', options: ['балкон', 'гараж', 'сад', 'крыша'], answer: 'сад' },
    ],
  },

  {
    id: 'a1-2-9', level: 'A1', block: 2, blockName: 'Семья и дом', order: 9,
    title: 'Предлоги места', duration: '10 мин',
    theory: {
      explanation: 'Предлоги места:\nin — внутри (in the box)\non — на поверхности (on the table)\nunder — под (under the bed)\nnext to / beside — рядом с (next to the door)\nbehind — позади (behind the house)\nin front of — перед (in front of the school)\nbetween — между (between two chairs)\nnear — близко к (near the park)',
      examples: [
        { english: 'The book is on the table.', russian: 'Книга на столе.' },
        { english: 'The cat is under the bed.', russian: 'Кошка под кроватью.' },
        { english: 'The bank is next to the supermarket.', russian: 'Банк рядом с супермаркетом.' },
        { english: 'My car is behind the house.', russian: 'Моя машина за домом.' },
        { english: 'The children are in front of the school.', russian: 'Дети перед школой.' },
        { english: 'I live near the park.', russian: 'Я живу рядом с парком.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'The cat is ___ the sofa. (на диване)', answer: 'on', hint: 'на поверхности — on' },
      { type: 'fill_blank', question: 'The shoes are ___ the bed. (под кроватью)', answer: 'under', hint: 'под — under' },
      { type: 'multiple_choice', question: '"The bag is ___ the chair" — сумка рядом со стулом?', options: ['under', 'on', 'next to', 'in front of'], answer: 'next to' },
      { type: 'multiple_choice', question: '"Between" означает...', options: ['позади', 'перед', 'между', 'рядом'], answer: 'между' },
      { type: 'fill_blank', question: 'The keys are ___ my bag. (внутри сумки)', answer: 'in', hint: 'внутри — in' },
    ],
    quiz: [
      { question: 'The dog is ___ the table. (под столом)', options: ['on', 'in', 'under', 'next to'], answer: 'under' },
      { question: 'The lamp is ___ the desk. (на столе)', options: ['under', 'in', 'behind', 'on'], answer: 'on' },
      { question: '"In front of" означает...', options: ['позади', 'рядом', 'перед', 'между'], answer: 'перед' },
      { question: 'The school is ___ the park and the church. (между)', options: ['near', 'next to', 'between', 'behind'], answer: 'between' },
      { question: 'The car is ___ the garage. (внутри гаража)', options: ['on', 'in', 'under', 'behind'], answer: 'in' },
    ],
  },

  {
    id: 'a1-2-10', level: 'A1', block: 2, blockName: 'Семья и дом', order: 10,
    title: 'There is / There are', duration: '10 мин',
    theory: {
      explanation: 'THERE IS = существует одна вещь (единственное число или неисчисляемое).\nTHERE ARE = существует несколько вещей (множественное число).\n\nОтрицание: There isn\'t / There aren\'t\nВопрос: Is there...? / Are there...?\nКраткие ответы: Yes, there is. / No, there aren\'t.\n\nС "any": Is there any milk? There aren\'t any chairs.',
      examples: [
        { english: 'There is a cat in the garden.', russian: 'В саду есть кошка.' },
        { english: 'There are three books on the table.', russian: 'На столе три книги.' },
        { english: 'Is there a bank near here? Yes, there is.', russian: 'Здесь есть банк? Да, есть.' },
        { english: 'There aren\'t any chairs.', russian: 'Нет никаких стульев.' },
        { english: 'There is no milk in the fridge.', russian: 'В холодильнике нет молока.' },
        { english: 'Are there any students? No, there aren\'t.', russian: 'Есть ли студенты? Нет.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '___ a supermarket near here.', options: ['There are', 'There is', 'There have', 'There be'], answer: 'There is' },
      { type: 'multiple_choice', question: '___ many people in the park.', options: ['There is', 'There be', 'There are', 'Is there'], answer: 'There are' },
      { type: 'fill_blank', question: 'Is there a hospital? Yes, there ___.', answer: 'is', hint: 'краткий ответ на Is there?' },
      { type: 'multiple_choice', question: 'Как сказать "В комнате нет стульев"?', options: ['There isn\'t any chairs.', 'There aren\'t any chairs.', 'There are no chair.', 'There not are chairs.'], answer: 'There aren\'t any chairs.' },
      { type: 'multiple_choice', question: '___ a problem with the computer.', options: ['There are', 'There is', 'Is there', 'Are there'], answer: 'There is' },
    ],
    quiz: [
      { question: '___ two windows in this room.', options: ['There is', 'There are', 'There be', 'Is there'], answer: 'There are' },
      { question: '___ a post office near here?', options: ['Are there', 'There are', 'Is there', 'There is'], answer: 'Is there' },
      { question: 'There ___ any milk in the fridge.', options: ['aren\'t', 'isn\'t', 'is no', 'are no'], answer: 'isn\'t' },
      { question: 'Are there any chairs? No, there ___.', options: ['isn\'t', 'aren\'t', 'not', 'no'], answer: 'aren\'t' },
      { question: '___ a big tree in the garden.', options: ['There are', 'Are there', 'Is there', 'There is'], answer: 'There is' },
    ],
  },

  // ── A1 Block 3: Распорядок дня ──────────────────────────────────────────────
  {
    id: 'a1-3-11', level: 'A1', block: 3, blockName: 'Распорядок дня', order: 11,
    title: 'Present Simple: привычки', duration: '10 мин',
    theory: {
      explanation: 'Present Simple используется для привычек и регулярных действий.\n\nФорма: I/You/We/They + глагол. He/She/It + глагол+s.\nПримеры: I work, She works, They play, He plays.\n\nОтрицание: I/You/We/They don\'t + глагол. He/She/It doesn\'t + глагол.\nВопрос: Do you...? Does he...?\n\nНаречия: every day, always, usually, sometimes, never.',
      examples: [
        { english: 'I wake up at 7 every day.', russian: 'Я просыпаюсь в 7 каждый день.' },
        { english: 'She works in a hospital.', russian: 'Она работает в больнице.' },
        { english: 'Do you drink coffee? Yes, I do.', russian: 'Ты пьёшь кофе? Да.' },
        { english: 'He doesn\'t eat meat.', russian: 'Он не ест мясо.' },
        { english: 'We study English on Mondays.', russian: 'Мы учим английский по понедельникам.' },
        { english: 'Does she live here? No, she doesn\'t.', russian: 'Она живёт здесь? Нет.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ to school every day. (go)', answer: 'goes', hint: 'с he/she/it добавь -es/-s' },
      { type: 'fill_blank', question: 'I ___ coffee in the morning. (drink)', answer: 'drink', hint: 'с I форма не меняется' },
      { type: 'multiple_choice', question: 'He ___ play football. (отрицание)', options: ['don\'t', 'doesn\'t', 'isn\'t', 'not'], answer: 'doesn\'t' },
      { type: 'multiple_choice', question: '___ she live in Moscow?', options: ['Do', 'Is', 'Does', 'Has'], answer: 'Does' },
      { type: 'fill_blank', question: 'They ___ study on weekends. (отрицание)', answer: 'don\'t', hint: 'с they используй don\'t' },
    ],
    quiz: [
      { question: 'She ___ (work) in a bank.', options: ['work', 'works', 'is work', 'working'], answer: 'works' },
      { question: 'Do you like pizza? No, I ___.', options: ['don\'t', 'doesn\'t', 'not', 'am not'], answer: 'don\'t' },
      { question: 'He ___ (not eat) fish.', options: ['don\'t eat', 'doesn\'t eat', 'isn\'t eat', 'not eats'], answer: 'doesn\'t eat' },
      { question: '___ they live near here?', options: ['Is', 'Does', 'Do', 'Are'], answer: 'Do' },
      { question: 'I ___ (watch) TV every evening.', options: ['watchs', 'am watch', 'watches', 'watch'], answer: 'watch' },
    ],
  },

  {
    id: 'a1-3-12', level: 'A1', block: 3, blockName: 'Распорядок дня', order: 12,
    title: 'Наречия частоты', duration: '10 мин',
    theory: {
      explanation: 'Наречия частоты:\nalways (всегда) — 100%\nusually (обычно) — 80%\noften (часто) — 60%\nsometimes (иногда) — 40%\nrarely/seldom (редко) — 20%\nnever (никогда) — 0%\n\nПоложение: ПЕРЕД основным глаголом, но ПОСЛЕ to be.\nI always drink coffee. / She is never late.',
      examples: [
        { english: 'I always brush my teeth.', russian: 'Я всегда чищу зубы.' },
        { english: 'She usually walks to work.', russian: 'Она обычно ходит на работу пешком.' },
        { english: 'We sometimes go to the cinema.', russian: 'Мы иногда ходим в кино.' },
        { english: 'He rarely eats fast food.', russian: 'Он редко ест фастфуд.' },
        { english: 'I never drink alcohol.', russian: 'Я никогда не пью алкоголь.' },
        { english: 'She is always happy.', russian: 'Она всегда счастлива.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Правильный порядок: "Я обычно читаю перед сном"', options: ['I read usually before bed.', 'Usually I before bed read.', 'I usually read before bed.', 'I read before bed usually.'], answer: 'I usually read before bed.' },
      { type: 'fill_blank', question: 'She is ___ late for class. (никогда)', answer: 'never' },
      { type: 'multiple_choice', question: '"Sometimes" означает...', options: ['всегда', 'обычно', 'иногда', 'никогда'], answer: 'иногда' },
      { type: 'fill_blank', question: 'He ___ goes to the gym. (часто — often)', answer: 'often' },
      { type: 'multiple_choice', question: 'Правильно: "Он всегда счастлив"', options: ['He always is happy.', 'Always he is happy.', 'He is always happy.', 'He is happy always.'], answer: 'He is always happy.' },
    ],
    quiz: [
      { question: '"Always" означает...', options: ['иногда', 'никогда', 'редко', 'всегда'], answer: 'всегда' },
      { question: 'I ___ eat breakfast. (никогда)', options: ['always', 'usually', 'never', 'often'], answer: 'never' },
      { question: 'Правильно: "Мы часто готовим вместе"', options: ['We often cook together.', 'We cook often together.', 'Often we cook together.', 'We cook together often.'], answer: 'We often cook together.' },
      { question: '"Rarely" означает...', options: ['всегда', 'часто', 'редко', 'иногда'], answer: 'редко' },
      { question: 'Правильно: "Она обычно устаёт по понедельникам"', options: ['She is usually tired on Mondays.', 'She usually is tired on Mondays.', 'Usually she tired is on Mondays.', 'She tired usually is on Mondays.'], answer: 'She is usually tired on Mondays.' },
    ],
  },

  {
    id: 'a1-3-13', level: 'A1', block: 3, blockName: 'Распорядок дня', order: 13,
    title: 'Время', duration: '10 мин',
    theory: {
      explanation: 'Как спросить время: What time is it?\nОтветы:\n• 3:00 → It\'s three o\'clock.\n• 3:30 → It\'s half past three.\n• 3:15 → It\'s quarter past three.\n• 3:45 → It\'s quarter to four.\n\nПредлоги:\nAT + конкретное время: at 9 o\'clock\nIN + часть дня/месяц/год/сезон: in the morning, in July\nON + день/дата: on Monday, on 5th March',
      examples: [
        { english: 'What time is it? It\'s half past eight.', russian: 'Который час? Половина девятого.' },
        { english: 'I start work at nine o\'clock.', russian: 'Я начинаю работу в девять часов.' },
        { english: 'She studies in the morning.', russian: 'Она учится по утрам.' },
        { english: 'The party is on Saturday evening.', russian: 'Вечеринка в субботу вечером.' },
        { english: 'I was born in 1998.', russian: 'Я родился в 1998 году.' },
        { english: 'School finishes at three o\'clock.', russian: 'Школа заканчивается в три часа.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Какой предлог: "I wake up ___ 7 o\'clock"?', options: ['in', 'on', 'at', 'by'], answer: 'at' },
      { type: 'multiple_choice', question: 'Как сказать 2:30?', options: ['half to two', 'half past two', 'two and half', 'past half two'], answer: 'half past two' },
      { type: 'multiple_choice', question: 'Какой предлог: "I was born ___ summer"?', options: ['at', 'on', 'by', 'in'], answer: 'in' },
      { type: 'multiple_choice', question: 'Как сказать 4:15?', options: ['quarter past four', 'quarter to four', 'four quarter', 'past four quarter'], answer: 'quarter past four' },
      { type: 'multiple_choice', question: 'Какой предлог: "The class is ___ Monday"?', options: ['in', 'at', 'on', 'by'], answer: 'on' },
    ],
    quiz: [
      { question: 'Какой предлог с конкретным временем?', options: ['in', 'on', 'at', 'by'], answer: 'at' },
      { question: 'Как сказать 6:45?', options: ['quarter past six', 'half past six', 'quarter to seven', 'six forty-five past'], answer: 'quarter to seven' },
      { question: 'Какой предлог с годами?', options: ['at', 'on', 'by', 'in'], answer: 'in' },
      { question: 'What time? It\'s ___ past nine. (9:30)', options: ['quarter', 'half', 'hour', 'three'], answer: 'half' },
      { question: 'Какой предлог: "The meeting is ___ Tuesday"?', options: ['in', 'at', 'on', 'by'], answer: 'on' },
    ],
  },

  {
    id: 'a1-3-14', level: 'A1', block: 3, blockName: 'Распорядок дня', order: 14,
    title: 'Глаголы действия', duration: '10 мин',
    theory: {
      explanation: 'Глаголы для описания распорядка дня:\nwake up (просыпаться), get up (вставать), have breakfast/lunch/dinner (завтракать/обедать/ужинать), go to work/school (идти на работу/в школу), come home (приходить домой), watch TV (смотреть ТВ), read (читать), listen to music (слушать музыку), play sports (заниматься спортом), go to bed (ложиться спать).\n\nДополнительно: buy (покупать), walk (ходить), run (бегать), cook (готовить), clean (убирать).',
      examples: [
        { english: 'I wake up at 7 and have breakfast at 7:30.', russian: 'Я просыпаюсь в 7 и завтракаю в 7:30.' },
        { english: 'She goes to work by bus.', russian: 'Она едет на работу автобусом.' },
        { english: 'We watch TV in the evening.', russian: 'Мы смотрим телевизор вечером.' },
        { english: 'He plays football on weekends.', russian: 'Он играет в футбол по выходным.' },
        { english: 'I cook dinner every night.', russian: 'Я готовлю ужин каждый вечер.' },
        { english: 'They go to bed at 11.', russian: 'Они ложатся спать в 11.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ up at 6 every morning. (wake)', answer: 'wake' },
      { type: 'multiple_choice', question: '"Have breakfast" означает...', options: ['приготовить завтрак', 'пропустить завтрак', 'позавтракать', 'купить завтрак'], answer: 'позавтракать' },
      { type: 'fill_blank', question: 'She ___ to school by bus. (go)', answer: 'goes', hint: 'с she — goes' },
      { type: 'multiple_choice', question: '"Go to bed" означает...', options: ['просыпаться', 'вставать', 'ложиться спать', 'отдыхать'], answer: 'ложиться спать' },
      { type: 'multiple_choice', question: 'Правильное сочетание:', options: ['listen to the TV', 'listen to music', 'listen to dinner', 'listen to sleep'], answer: 'listen to music' },
    ],
    quiz: [
      { question: '"Wake up" означает...', options: ['идти спать', 'просыпаться', 'вставать с постели', 'отдыхать'], answer: 'просыпаться' },
      { question: 'He ___ dinner every day. (cook)', options: ['cook', 'cooks', 'is cook', 'cooking'], answer: 'cooks' },
      { question: '"Come home" означает...', options: ['уходить из дома', 'приходить домой', 'оставаться дома', 'убирать дом'], answer: 'приходить домой' },
      { question: 'I ___ to music every morning. (listen)', options: ['listen', 'listens', 'listening', 'am listen'], answer: 'listen' },
      { question: '"Have lunch" — это...', options: ['позавтракать', 'пообедать', 'поужинать', 'перекусить ночью'], answer: 'пообедать' },
    ],
  },

  {
    id: 'a1-3-15', level: 'A1', block: 3, blockName: 'Распорядок дня', order: 15,
    title: 'Present Continuous', duration: '10 мин',
    theory: {
      explanation: 'Present Continuous описывает действие, происходящее ПРЯМО СЕЙЧАС.\n\nФорма: am/is/are + глагол-ing\nI am eating. She is sleeping. They are playing.\n\nОтрицание: I\'m not eating. / She isn\'t sleeping. / They aren\'t playing.\nВопрос: Are you sleeping? / Is he working?\n\nСигнальные слова: now, right now, at the moment.',
      examples: [
        { english: 'I am reading a book now.', russian: 'Я сейчас читаю книгу.' },
        { english: 'She is cooking dinner.', russian: 'Она готовит ужин.' },
        { english: 'They are watching TV.', russian: 'Они смотрят телевизор.' },
        { english: 'Is he sleeping? No, he isn\'t.', russian: 'Он спит? Нет.' },
        { english: 'We are studying English right now.', russian: 'Мы сейчас учим английский.' },
        { english: 'It is raining outside.', russian: 'На улице идёт дождь.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She is ___ (cook) dinner right now.', answer: 'cooking', hint: 'добавь -ing' },
      { type: 'fill_blank', question: 'I ___ watching TV at the moment.', answer: 'am', hint: 'с I используй am' },
      { type: 'multiple_choice', question: 'Как сказать "Они сейчас не играют"?', options: ['They not playing.', 'They aren\'t playing.', 'They don\'t playing.', 'They isn\'t playing.'], answer: 'They aren\'t playing.' },
      { type: 'multiple_choice', question: '___ he working now?', options: ['Do', 'Does', 'Is', 'Are'], answer: 'Is' },
      { type: 'fill_blank', question: 'It is ___ (rain) outside.', answer: 'raining' },
    ],
    quiz: [
      { question: 'I ___ (read) a book now.', options: ['read', 'reads', 'am reading', 'is reading'], answer: 'am reading' },
      { question: 'She ___ (not sleep) right now.', options: ['don\'t sleeping', 'isn\'t sleeping', 'aren\'t sleeping', 'not sleeping'], answer: 'isn\'t sleeping' },
      { question: '___ they playing football?', options: ['Is', 'Do', 'Does', 'Are'], answer: 'Are' },
      { question: 'He is ___ (write) an email.', options: ['write', 'writes', 'writing', 'written'], answer: 'writing' },
      { question: 'We ___ (study) at the moment.', options: ['study', 'studies', 'are studying', 'is studying'], answer: 'are studying' },
    ],
  },

  // ── A1 Block 4: Прошлое ─────────────────────────────────────────────────────
  {
    id: 'a1-4-16', level: 'A1', block: 4, blockName: 'Прошлое', order: 16,
    title: 'Past Simple: To Be', duration: '10 мин',
    theory: {
      explanation: 'Прошедшее время TO BE:\nI/He/She/It → WAS\nYou/We/They → WERE\n\nОтрицание: wasn\'t / weren\'t\nВопрос: Was he? / Were they?\nКраткие ответы: Yes, he was. / No, they weren\'t.\n\nВременные маркеры: yesterday, last night, last week, in 2020.',
      examples: [
        { english: 'I was very tired yesterday.', russian: 'Вчера я очень устал(а).' },
        { english: 'She was at home last night.', russian: 'Вчера вечером она была дома.' },
        { english: 'Were you at the party? Yes, I was.', russian: 'Ты был(а) на вечеринке? Да.' },
        { english: 'They weren\'t happy.', russian: 'Они не были счастливы.' },
        { english: 'The weather was beautiful.', russian: 'Погода была прекрасная.' },
        { english: 'Was he a good student? No, he wasn\'t.', russian: 'Он был хорошим студентом? Нет.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ at school yesterday.', answer: 'was', hint: 'с I используй was' },
      { type: 'fill_blank', question: 'They ___ at home last night.', answer: 'were', hint: 'с they используй were' },
      { type: 'multiple_choice', question: 'Как сказать "Она не была там"?', options: ['She wasn\'t there.', 'She weren\'t there.', 'She not was there.', 'She didn\'t was there.'], answer: 'She wasn\'t there.' },
      { type: 'multiple_choice', question: '___ you at the cinema? Yes, I ___.', options: ['Was / was', 'Were / were', 'Was / were', 'Were / was'], answer: 'Were / were' },
      { type: 'fill_blank', question: 'The film ___ very good.', answer: 'was', hint: 'прошедшее от is = was' },
    ],
    quiz: [
      { question: 'He ___ at work yesterday.', options: ['were', 'is', 'was', 'be'], answer: 'was' },
      { question: 'We ___ happy last summer.', options: ['was', 'is', 'were', 'be'], answer: 'were' },
      { question: 'Как сказать "Они не были дома"?', options: ['They wasn\'t home.', 'They weren\'t home.', 'They not were home.', 'They didn\'t be home.'], answer: 'They weren\'t home.' },
      { question: 'Was she tired? Yes, she ___.', options: ['were', 'is', 'was', 'be'], answer: 'was' },
      { question: 'I ___ a student in 2020.', options: ['were', 'am', 'be', 'was'], answer: 'was' },
    ],
  },

  {
    id: 'a1-4-17', level: 'A1', block: 4, blockName: 'Прошлое', order: 17,
    title: 'Past Simple: правильные глаголы', duration: '10 мин',
    theory: {
      explanation: 'Правильные глаголы в прошедшем: глагол + ED\nwork → worked, play → played, watch → watched, visit → visited.\n\nПравила орфографии:\n• stop → stopped (удвоение согласной)\n• study → studied (y → ied)\n• love → loved (немое e — просто d)\n\nОтрицание: didn\'t + основной глагол (без -ed!)\nВопрос: Did + подлежащее + основной глагол?',
      examples: [
        { english: 'I worked late last night.', russian: 'Я работал(а) допоздна вчера ночью.' },
        { english: 'She watched a film yesterday.', russian: 'Вчера она смотрела фильм.' },
        { english: 'Did you visit London? Yes, I did.', russian: 'Ты был(а) в Лондоне? Да.' },
        { english: 'We didn\'t play football.', russian: 'Мы не играли в футбол.' },
        { english: 'He studied for three hours.', russian: 'Он учился три часа.' },
        { english: 'They didn\'t stop talking.', russian: 'Они не переставали разговаривать.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ (watch) TV last night.', answer: 'watched', hint: 'watch + ed' },
      { type: 'fill_blank', question: 'I ___ (study) for two hours.', answer: 'studied', hint: 'study → studied' },
      { type: 'multiple_choice', question: 'Как сказать "Он не работал вчера"?', options: ['He didn\'t worked yesterday.', 'He didn\'t work yesterday.', 'He doesn\'t work yesterday.', 'He not worked yesterday.'], answer: 'He didn\'t work yesterday.' },
      { type: 'multiple_choice', question: 'Did they play tennis? Yes, they ___.', options: ['did', 'do', 'played', 'were'], answer: 'did' },
      { type: 'fill_blank', question: 'We ___ (visit) our grandparents last weekend.', answer: 'visited' },
    ],
    quiz: [
      { question: 'I ___ (walk) to school yesterday.', options: ['walk', 'walks', 'walked', 'am walking'], answer: 'walked' },
      { question: 'She ___ (not finish) her homework.', options: ['didn\'t finished', 'didn\'t finish', 'doesn\'t finish', 'not finished'], answer: 'didn\'t finish' },
      { question: 'Did you call me? No, I ___.', options: ['didn\'t', 'don\'t', 'wasn\'t', 'am not'], answer: 'didn\'t' },
      { question: 'They ___ (play) chess last night.', options: ['play', 'plays', 'played', 'playing'], answer: 'played' },
      { question: 'He ___ (stop) the car.', options: ['stop', 'stopted', 'stopped', 'stoped'], answer: 'stopped' },
    ],
  },

  {
    id: 'a1-4-18', level: 'A1', block: 4, blockName: 'Прошлое', order: 18,
    title: 'Неправильные глаголы', duration: '10 мин',
    theory: {
      explanation: 'Неправильные глаголы меняют форму в прошедшем времени:\ngo → went, have → had, see → saw, come → came, get → got\nmake → made, take → took, give → gave, know → knew\nthink → thought, buy → bought, eat → ate, drink → drank, say → said\n\nОтрицание и вопросы — как у правильных глаголов:\nI didn\'t go. / Did you see it? (основной глагол в базовой форме!)',
      examples: [
        { english: 'I went to the cinema last week.', russian: 'На прошлой неделе я ходил(а) в кино.' },
        { english: 'She had a headache yesterday.', russian: 'Вчера у неё болела голова.' },
        { english: 'We saw a great film.', russian: 'Мы посмотрели отличный фильм.' },
        { english: 'He came home late.', russian: 'Он пришёл домой поздно.' },
        { english: 'I bought a new phone.', russian: 'Я купил(а) новый телефон.' },
        { english: 'They ate pizza for dinner.', russian: 'На ужин они ели пиццу.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Прошедшее время "go"?', options: ['goed', 'went', 'gone', 'goes'], answer: 'went' },
      { type: 'multiple_choice', question: 'Прошедшее время "eat"?', options: ['eated', 'eaten', 'ate', 'eatted'], answer: 'ate' },
      { type: 'multiple_choice', question: 'Прошедшее время "buy"?', options: ['buyed', 'buied', 'bought', 'buys'], answer: 'bought' },
      { type: 'multiple_choice', question: 'Прошедшее время "see"?', options: ['seed', 'seen', 'saw', 'sees'], answer: 'saw' },
      { type: 'multiple_choice', question: 'Прошедшее время "have"?', options: ['haved', 'had', 'have', 'has'], answer: 'had' },
    ],
    quiz: [
      { question: 'Прошедшее время "come"?', options: ['comed', 'came', 'coming', 'comes'], answer: 'came' },
      { question: 'Прошедшее время "drink"?', options: ['drinked', 'drunk', 'drank', 'drinks'], answer: 'drank' },
      { question: 'Прошедшее время "make"?', options: ['maked', 'makes', 'made', 'making'], answer: 'made' },
      { question: 'Прошедшее время "know"?', options: ['knowed', 'knew', 'known', 'knows'], answer: 'knew' },
      { question: 'Прошедшее время "say"?', options: ['sayed', 'said', 'says', 'saied'], answer: 'said' },
    ],
  },

  {
    id: 'a1-4-19', level: 'A1', block: 4, blockName: 'Прошлое', order: 19,
    title: 'Вопросы в прошлом', duration: '10 мин',
    theory: {
      explanation: 'Вопросы в Past Simple строятся с DID:\nDid + подлежащее + основной глагол (базовая форма)?\n\nDid you go? / Did she call?\n\nВопросы со вспомогательными словами:\nWhere did you go? What did he do?\nWho did you see? Why did they leave? When did it happen?',
      examples: [
        { english: 'Did you go to school yesterday?', russian: 'Ты ходил в школу вчера?' },
        { english: 'Where did she go last weekend?', russian: 'Куда она ходила на прошлых выходных?' },
        { english: 'What did you eat for breakfast?', russian: 'Что ты ел(а) на завтрак?' },
        { english: 'Why did he leave early?', russian: 'Почему он ушёл рано?' },
        { english: 'Who did you see at the party?', russian: 'Кого ты видел(а) на вечеринке?' },
        { english: 'When did they arrive?', russian: 'Когда они прибыли?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: '___ you go to the cinema last night?', answer: 'Did', hint: 'вопрос Past Simple начинается с Did' },
      { type: 'multiple_choice', question: 'Как спросить "Где ты был вчера?"', options: ['Where you were yesterday?', 'Where did you go yesterday?', 'Where you did go yesterday?', 'Where you go yesterday?'], answer: 'Where did you go yesterday?' },
      { type: 'fill_blank', question: 'What ___ she do last weekend?', answer: 'did' },
      { type: 'multiple_choice', question: 'Did they enjoy the film? ___, they did.', options: ['No', 'Not', 'Yes', 'Did'], answer: 'Yes' },
      { type: 'multiple_choice', question: 'Как спросить "Что ты купил?"', options: ['What you bought?', 'What bought you?', 'What did you buy?', 'What did you bought?'], answer: 'What did you buy?' },
    ],
    quiz: [
      { question: '___ he call you yesterday?', options: ['Was', 'Did', 'Does', 'Do'], answer: 'Did' },
      { question: 'When ___ they arrive?', options: ['do', 'was', 'did', 'were'], answer: 'did' },
      { question: 'What did she ___? (eat)', options: ['ate', 'eaten', 'eat', 'eats'], answer: 'eat' },
      { question: 'Did you see the news? No, I ___.', options: ['don\'t', 'wasn\'t', 'didn\'t', 'haven\'t'], answer: 'didn\'t' },
      { question: 'Why ___ he leave so early?', options: ['do', 'was', 'did', 'does'], answer: 'did' },
    ],
  },

  {
    id: 'a1-4-20', level: 'A1', block: 4, blockName: 'Прошлое', order: 20,
    title: 'Вопросительные слова', duration: '10 мин',
    theory: {
      explanation: 'Вопросительные слова:\nWHAT — что/какой\nWHERE — где/куда\nWHEN — когда\nWHO — кто\nWHY — почему\nHOW — как\nHOW MUCH — сколько (неисчисляемое: money, time)\nHOW MANY — сколько (исчисляемое: students, books)\nWHICH — который\nWHOSE — чей',
      examples: [
        { english: 'What is your name?', russian: 'Как тебя зовут?' },
        { english: 'Where do you live?', russian: 'Где ты живёшь?' },
        { english: 'When does the bus come?', russian: 'Когда приходит автобус?' },
        { english: 'Who is your teacher?', russian: 'Кто твой учитель?' },
        { english: 'Why are you late?', russian: 'Почему ты опаздываешь?' },
        { english: 'How many students are there?', russian: 'Сколько здесь студентов?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '___ is your phone number? (какой)', options: ['Who', 'Where', 'What', 'How'], answer: 'What' },
      { type: 'multiple_choice', question: '___ do you live? (где)', options: ['When', 'What', 'Who', 'Where'], answer: 'Where' },
      { type: 'multiple_choice', question: '___ people are in the class? (исчисляемое)', options: ['How much', 'How many', 'How', 'What'], answer: 'How many' },
      { type: 'multiple_choice', question: '___ is she late? (почему)', options: ['When', 'What', 'Why', 'Which'], answer: 'Why' },
      { type: 'multiple_choice', question: '___ bag is this? (чей)', options: ['Who', 'Whose', 'Which', 'What'], answer: 'Whose' },
    ],
    quiz: [
      { question: '___ are you? — I\'m fine, thanks.', options: ['What', 'Where', 'How', 'Who'], answer: 'How' },
      { question: '___ is your birthday? (когда)', options: ['Where', 'When', 'Why', 'Who'], answer: 'When' },
      { question: '___ much does it cost?', options: ['How', 'What', 'Which', 'Where'], answer: 'How' },
      { question: '___ is calling? (кто)', options: ['Whose', 'Which', 'What', 'Who'], answer: 'Who' },
      { question: '___ one do you want? (который)', options: ['Whose', 'Who', 'Which', 'What'], answer: 'Which' },
    ],
  },

  // ── A1 Block 5: Еда и здоровье ───────────────────────────────────────────────
  {
    id: 'a1-5-21', level: 'A1', block: 5, blockName: 'Еда и здоровье', order: 21,
    title: 'Еда и напитки', duration: '10 мин',
    theory: {
      explanation: 'Еда: bread, rice, pasta, meat, chicken, fish, vegetables, fruit, salad, soup, cake, pizza, burger.\nНапитки: water, juice, tea, coffee, milk.\n\nLike/don\'t like: I like pizza. I don\'t like onions. Do you like coffee?\nI\'d like = вежливая форма "я хочу".',
      examples: [
        { english: 'I like pizza and pasta.', russian: 'Мне нравится пицца и паста.' },
        { english: 'She doesn\'t like fish.', russian: 'Ей не нравится рыба.' },
        { english: 'Do you drink coffee? Yes, I do.', russian: 'Ты пьёшь кофе? Да.' },
        { english: 'We eat rice every day.', russian: 'Мы едим рис каждый день.' },
        { english: 'I\'d like some water please.', russian: 'Я бы хотел(а) воды, пожалуйста.' },
        { english: 'He loves chocolate cake.', russian: 'Он обожает шоколадный торт.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ like onions. (отрицание)', answer: 'don\'t' },
      { type: 'multiple_choice', question: '"Chicken" — это...', options: ['рыба', 'говядина', 'курица', 'свинина'], answer: 'курица' },
      { type: 'fill_blank', question: '___ you like tea? Yes, I do.', answer: 'Do' },
      { type: 'multiple_choice', question: 'Как вежливо попросить чай?', options: ['I want tea.', 'Give me tea.', 'I\'d like some tea, please.', 'I like tea please.'], answer: 'I\'d like some tea, please.' },
      { type: 'multiple_choice', question: '"Vegetables" — это...', options: ['фрукты', 'овощи', 'мясо', 'хлеб'], answer: 'овощи' },
    ],
    quiz: [
      { question: '"Bread" — это...', options: ['рис', 'хлеб', 'паста', 'суп'], answer: 'хлеб' },
      { question: 'She ___ like fish.', options: ['don\'t', 'doesn\'t', 'isn\'t', 'not'], answer: 'doesn\'t' },
      { question: 'Как спросить "Ты любишь суп?"', options: ['Do you like soup?', 'Are you like soup?', 'Do you likes soup?', 'Have you like soup?'], answer: 'Do you like soup?' },
      { question: '"Juice" — это...', options: ['чай', 'вода', 'сок', 'молоко'], answer: 'сок' },
      { question: 'I\'d like ___ water, please.', options: ['a', 'an', 'some', 'any'], answer: 'some' },
    ],
  },

  {
    id: 'a1-5-22', level: 'A1', block: 5, blockName: 'Еда и здоровье', order: 22,
    title: 'Can / Can\'t', duration: '10 мин',
    theory: {
      explanation: 'CAN = умение/способность. Одна форма для всех лиц!\nI/You/He/She/We/They + can/can\'t + основной глагол.\nВопрос: Can you swim? Ответы: Yes, I can. / No, I can\'t.\nПрошедшее: could/couldn\'t.',
      examples: [
        { english: 'I can speak English.', russian: 'Я могу говорить по-английски.' },
        { english: 'She can\'t drive a car.', russian: 'Она не умеет водить машину.' },
        { english: 'Can you swim? Yes, I can.', russian: 'Ты умеешь плавать? Да.' },
        { english: 'He can play guitar.', russian: 'Он умеет играть на гитаре.' },
        { english: 'We couldn\'t find the place.', russian: 'Мы не смогли найти это место.' },
        { english: 'Can they come tomorrow?', russian: 'Они могут прийти завтра?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ swim very well.', answer: 'can' },
      { type: 'fill_blank', question: 'I ___ drive. I never learned.', answer: 'can\'t' },
      { type: 'multiple_choice', question: 'Can you cook? ___, I can.', options: ['No', 'Not', 'Yes', 'Do'], answer: 'Yes' },
      { type: 'multiple_choice', question: 'Как спросить "Умеешь ли ты петь?"', options: ['Do you can sing?', 'Can you sing?', 'Are you can sing?', 'Can you to sing?'], answer: 'Can you sing?' },
      { type: 'multiple_choice', question: 'Прошедшее от "can" — это...', options: ['canned', 'could', 'can\'t', 'was can'], answer: 'could' },
    ],
    quiz: [
      { question: 'He ___ speak three languages.', options: ['cans', 'can', 'is can', 'could'], answer: 'can' },
      { question: 'Can she dance? No, she ___.', options: ['can', 'doesn\'t', 'can\'t', 'isn\'t'], answer: 'can\'t' },
      { question: 'Как сказать "Они не могли найти дорогу"?', options: ['They can\'t find the way.', 'They couldn\'t find the way.', 'They didn\'t can find the way.', 'They not could find the way.'], answer: 'They couldn\'t find the way.' },
      { question: 'I ___ run fast when I was young.', options: ['can', 'can\'t', 'could', 'couldn\'t'], answer: 'could' },
      { question: '___ birds fly?', options: ['Do', 'Are', 'Can', 'Have'], answer: 'Can' },
    ],
  },

  {
    id: 'a1-5-23', level: 'A1', block: 5, blockName: 'Еда и здоровье', order: 23,
    title: 'Would like', duration: '10 мин',
    theory: {
      explanation: 'WOULD LIKE = вежливая форма "хочу".\nI\'d like = I would like.\nИспользование: в магазинах, ресторанах, кафе.\nI\'d like a coffee, please.\nWould you like...? — вежливый вопрос.\nWould you like some tea? Yes, please. / No, thank you.',
      examples: [
        { english: 'I\'d like a coffee, please.', russian: 'Я бы хотел(а) кофе, пожалуйста.' },
        { english: 'Would you like some tea? Yes, please.', russian: 'Хотите чаю? Да, пожалуйста.' },
        { english: 'She\'d like to visit Paris.', russian: 'Она хотела бы посетить Париж.' },
        { english: 'Would you like to come?', russian: 'Вы хотели бы прийти?' },
        { english: 'I\'d like the chicken, please.', russian: 'Я бы хотел(а) курицу, пожалуйста.' },
        { english: 'We\'d like two rooms.', russian: 'Нам нужно два номера.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Вежливо попросить воду:', options: ['I want water.', 'Give me water.', 'I\'d like some water, please.', 'I like water please.'], answer: 'I\'d like some water, please.' },
      { type: 'multiple_choice', question: 'Would you like ___ cake?', options: ['a', 'an', 'some', 'any'], answer: 'some' },
      { type: 'fill_blank', question: '___ you like to order now?', answer: 'Would' },
      { type: 'multiple_choice', question: '"I\'d like" — полная форма:', options: ['I do like', 'I will like', 'I would like', 'I had liked'], answer: 'I would like' },
      { type: 'multiple_choice', question: 'Would you like coffee? ___, please.', options: ['Yes, I would like', 'Yes, please', 'Yes, I like', 'Yes, I want'], answer: 'Yes, please' },
    ],
    quiz: [
      { question: 'Полная форма "I\'d like":', options: ['I do like', 'I will like', 'I would like', 'I had liked'], answer: 'I would like' },
      { question: 'Would you like ___ biscuit?', options: ['some', 'any', 'a', 'the'], answer: 'a' },
      { question: 'Как вежливо сказать "Я хочу чай"?', options: ['I want tea.', 'I\'d like some tea, please.', 'Give me tea, please.', 'Tea for me.'], answer: 'I\'d like some tea, please.' },
      { question: '___ like to try the pasta?', options: ['Do you would', 'Would you', 'Are you', 'Do you'], answer: 'Would you' },
      { question: 'She ___ like to visit London one day.', options: ['do', 'would', 'will', 'does'], answer: 'would' },
    ],
  },

  {
    id: 'a1-5-24', level: 'A1', block: 5, blockName: 'Еда и здоровье', order: 24,
    title: 'Артикли a/an/the', duration: '10 мин',
    theory: {
      explanation: 'A = один из многих (любой): a book. Перед согласным звуком.\nAN = перед гласным звуком: an apple, an hour.\nTHE = конкретный известный предмет: the book I told you about, the sun.\nБЕЗ АРТИКЛЯ: общие понятия: I like music. I drink water.',
      examples: [
        { english: 'I have a dog.', russian: 'У меня есть собака.' },
        { english: 'She is an engineer.', russian: 'Она инженер.' },
        { english: 'The dog is in the garden.', russian: 'Собака (та самая) в саду.' },
        { english: 'I like music.', russian: 'Мне нравится музыка.' },
        { english: 'Can you close the window?', russian: 'Ты можешь закрыть окно?' },
        { english: 'He is a student at the university.', russian: 'Он студент в университете.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'She is ___ teacher.', options: ['a', 'an', 'the', '—'], answer: 'a' },
      { type: 'multiple_choice', question: 'He is ___ engineer.', options: ['a', 'an', 'the', '—'], answer: 'an' },
      { type: 'fill_blank', question: 'Close ___ door, please.', answer: 'the', hint: 'конкретная дверь = the' },
      { type: 'multiple_choice', question: 'I drink ___ coffee every morning. (вообще)', options: ['a', 'an', 'the', '—'], answer: '—' },
      { type: 'multiple_choice', question: 'I saw ___ film. ___ film was great.', options: ['a / The', 'the / A', 'an / The', 'a / A'], answer: 'a / The' },
    ],
    quiz: [
      { question: 'I have ___ cat. ___ cat is black.', options: ['a / The', 'the / A', 'an / The', 'a / A'], answer: 'a / The' },
      { question: 'She is ___ honest person.', options: ['a', 'an', 'the', '—'], answer: 'an' },
      { question: 'I love ___ music. (вообще)', options: ['a', 'an', 'the', '—'], answer: '—' },
      { question: '___ sun is very hot today.', options: ['A', 'An', 'The', '—'], answer: 'The' },
      { question: 'Can I borrow ___ pen?', options: ['an', 'the', 'a', '—'], answer: 'a' },
    ],
  },

  {
    id: 'a1-5-25', level: 'A1', block: 5, blockName: 'Еда и здоровье', order: 25,
    title: 'Must / Mustn\'t', duration: '10 мин',
    theory: {
      explanation: 'MUST = сильная обязанность (я считаю необходимым).\nMUSTN\'T = запрет (нельзя делать).\nMust одинаков для всех лиц.\nНет прошедшей формы — используй HAD TO.\nI had to leave early. (Мне пришлось уйти.)',
      examples: [
        { english: 'You must study every day.', russian: 'Тебе нужно учиться каждый день.' },
        { english: 'She must see a doctor.', russian: 'Ей необходимо сходить к врачу.' },
        { english: 'You mustn\'t smoke here.', russian: 'Здесь нельзя курить.' },
        { english: 'Students must arrive on time.', russian: 'Студенты должны приходить вовремя.' },
        { english: 'I must call my mother.', russian: 'Мне нужно позвонить маме.' },
        { english: 'You mustn\'t use your phone in class.', russian: 'Нельзя пользоваться телефоном на уроке.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'You ___ wear a seatbelt. (обязательно)', answer: 'must' },
      { type: 'fill_blank', question: 'You ___ run in the corridor. (запрет)', answer: 'mustn\'t' },
      { type: 'multiple_choice', question: '"Mustn\'t" означает...', options: ['не нужно', 'нельзя', 'можно не', 'надо'], answer: 'нельзя' },
      { type: 'multiple_choice', question: 'Прошедшее от must:', options: ['musted', 'must have', 'had to', 'was must'], answer: 'had to' },
      { type: 'multiple_choice', question: 'Пациент болен. Совет:', options: ['You must see a doctor.', 'You mustn\'t see a doctor.', 'You should not see a doctor.', 'You can\'t see a doctor.'], answer: 'You must see a doctor.' },
    ],
    quiz: [
      { question: 'You ___ be quiet in the library.', options: ['mustn\'t', 'must', 'can\'t', 'don\'t'], answer: 'must' },
      { question: 'You ___ touch that — it\'s dangerous!', options: ['must', 'should', 'mustn\'t', 'don\'t'], answer: 'mustn\'t' },
      { question: 'Must — это...', options: ['слабый совет', 'сильная обязанность', 'разрешение', 'умение'], answer: 'сильная обязанность' },
      { question: 'She ___ study harder.', options: ['mustn\'t', 'can\'t', 'must', 'don\'t'], answer: 'must' },
      { question: 'Students ___ cheat in exams.', options: ['must', 'can', 'should', 'mustn\'t'], answer: 'mustn\'t' },
    ],
  },

  // ── A1 Block 6: Будущее ─────────────────────────────────────────────────────
  {
    id: 'a1-6-26', level: 'A1', block: 6, blockName: 'Будущее', order: 26,
    title: 'Going to', duration: '10 мин',
    theory: {
      explanation: 'GOING TO = планы и намерения (решены заранее), предсказания на основе видимых признаков.\nФорма: am/is/are + going to + основной глагол.\nI am going to visit Paris next month. (план)\nLook — it\'s going to rain! (предсказание по признаку)\nОтрицание: isn\'t going to / aren\'t going to.',
      examples: [
        { english: 'I am going to visit my parents next weekend.', russian: 'На следующих выходных я собираюсь навестить родителей.' },
        { english: 'She is going to study medicine.', russian: 'Она собирается учиться на врача.' },
        { english: 'Are you going to come? Yes, I am.', russian: 'Ты собираешься прийти? Да.' },
        { english: 'We aren\'t going to watch TV tonight.', russian: 'Сегодня вечером мы не собираемся смотреть ТВ.' },
        { english: 'Look! It\'s going to rain.', russian: 'Смотри! Сейчас пойдёт дождь.' },
        { english: 'He is going to buy a new car.', russian: 'Он собирается купить новую машину.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She is ___ to call you later.', answer: 'going' },
      { type: 'fill_blank', question: 'I ___ going to travel this summer.', answer: 'am' },
      { type: 'multiple_choice', question: 'Как сказать "Они не собираются переезжать"?', options: ['They aren\'t going to move.', 'They not going to move.', 'They aren\'t go to move.', 'They going not to move.'], answer: 'They aren\'t going to move.' },
      { type: 'multiple_choice', question: '___ you going to study tonight?', options: ['Do', 'Will', 'Are', 'Is'], answer: 'Are' },
      { type: 'multiple_choice', question: 'Look at those clouds! It ___ going to rain.', options: ['am', 'are', 'is', 'be'], answer: 'is' },
    ],
    quiz: [
      { question: 'I ___ going to start a new job.', options: ['is', 'are', 'am', 'be'], answer: 'am' },
      { question: 'He ___ going to visit London next year.', options: ['am', 'are', 'is', 'be'], answer: 'is' },
      { question: 'They ___ going to buy a house. (не собираются)', options: ['isn\'t', 'aren\'t', 'am not', 'wasn\'t'], answer: 'aren\'t' },
      { question: '___ she going to learn Spanish?', options: ['Am', 'Are', 'Is', 'Do'], answer: 'Is' },
      { question: 'Going to используется для...', options: ['прошлых действий', 'постоянных привычек', 'планов и намерений', 'умений'], answer: 'планов и намерений' },
    ],
  },

  {
    id: 'a1-6-27', level: 'A1', block: 6, blockName: 'Будущее', order: 27,
    title: 'Will', duration: '10 мин',
    theory: {
      explanation: 'WILL используется для:\n• Спонтанных решений: I\'ll help you!\n• Обещаний: I\'ll call tomorrow.\n• Предсказаний без признаков: It will be sunny.\nФорма: will + основной глагол (для всех лиц)\nСокращение: I\'ll, she\'ll, they\'ll\nОтрицание: won\'t (= will not)',
      examples: [
        { english: 'I\'ll help you with that!', russian: 'Я тебе с этим помогу!' },
        { english: 'She will call you tomorrow.', russian: 'Она позвонит тебе завтра.' },
        { english: 'Will you marry me?', russian: 'Ты выйдешь за меня замуж?' },
        { english: 'It will be sunny tomorrow.', russian: 'Завтра будет солнечно.' },
        { english: 'I won\'t tell anyone.', russian: 'Я никому не скажу.' },
        { english: 'We\'ll see you at the party.', russian: 'Увидимся на вечеринке.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Спонтанное решение помочь другу:', options: ['I\'m going to help you.', 'I help you.', 'I\'ll help you!', 'I helping you!'], answer: 'I\'ll help you!' },
      { type: 'fill_blank', question: 'I promise I ___ be late. (не опоздаю)', answer: 'won\'t' },
      { type: 'multiple_choice', question: '"Won\'t" — это...', options: ['will', 'will not', 'would not', 'was not'], answer: 'will not' },
      { type: 'multiple_choice', question: '___ you help me, please?', options: ['Do', 'Are', 'Will', 'Going to'], answer: 'Will' },
      { type: 'fill_blank', question: 'She ___ be here at 8 tomorrow.', answer: 'will' },
    ],
    quiz: [
      { question: 'Спонтанное решение — "Я открою окно":', options: ['I\'m going to open the window.', 'I\'ll open the window.', 'I open the window.', 'I am opening the window.'], answer: 'I\'ll open the window.' },
      { question: '"Won\'t" означает...', options: ['will', 'will not', 'would not', 'do not'], answer: 'will not' },
      { question: 'It ___ be cold tomorrow. (предсказание)', options: ['is going to', 'will', 'going to', 'would'], answer: 'will' },
      { question: '___ you help me? (просьба)', options: ['Do', 'Are', 'Will', 'Going'], answer: 'Will' },
      { question: 'She ___ come to the party. (не придёт)', options: ['will not', 'won\'t', 'not will', 'willn\'t'], answer: 'won\'t' },
    ],
  },

  {
    id: 'a1-6-28', level: 'A1', block: 6, blockName: 'Будущее', order: 28,
    title: 'Present Perfect: ever/never', duration: '10 мин',
    theory: {
      explanation: 'Present Perfect = жизненный опыт (без конкретного времени).\nФорма: have/has + причастие прошедшего времени (3-я форма).\nEVER = когда-либо (в вопросах): Have you ever eaten sushi?\nNEVER = никогда: I have never seen snow.\nbeen = побывал: I have been to Paris.',
      examples: [
        { english: 'Have you ever eaten sushi? Yes, I have.', russian: 'Ты когда-нибудь ел суши? Да.' },
        { english: 'I have never seen snow.', russian: 'Я никогда не видел снег.' },
        { english: 'She has never been to London.', russian: 'Она никогда не была в Лондоне.' },
        { english: 'Have they ever met before?', russian: 'Они когда-нибудь встречались раньше?' },
        { english: 'I have eaten Indian food once.', russian: 'Я ел индийскую еду один раз.' },
        { english: 'Has he ever driven a truck?', russian: 'Он когда-нибудь водил грузовик?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'Have you ___ been to Japan?', answer: 'ever' },
      { type: 'fill_blank', question: 'I have ___ eaten octopus. (никогда)', answer: 'never' },
      { type: 'multiple_choice', question: 'Форма Present Perfect:', options: ['I go', 'I have go', 'I have gone', 'I went'], answer: 'I have gone' },
      { type: 'multiple_choice', question: 'She has ___ been to France.', options: ['ever', 'never', 'always', 'yet'], answer: 'never' },
      { type: 'multiple_choice', question: 'Have you ever ___ bungee jumping?', options: ['do', 'did', 'done', 'doing'], answer: 'done' },
    ],
    quiz: [
      { question: '___ you ever tried Japanese food?', options: ['Did', 'Do', 'Have', 'Has'], answer: 'Have' },
      { question: 'She has never ___ a horse.', options: ['ride', 'rode', 'ridden', 'riding'], answer: 'ridden' },
      { question: 'I have ___ been to Australia. (никогда)', options: ['ever', 'always', 'never', 'yet'], answer: 'never' },
      { question: 'Has he ever ___ here?', options: ['be', 'been', 'being', 'was'], answer: 'been' },
      { question: 'Когда используем Present Perfect с ever/never?', options: ['Для конкретного прошлого', 'Для привычек', 'Для опыта без указания времени', 'Для будущего'], answer: 'Для опыта без указания времени' },
    ],
  },

  {
    id: 'a1-6-29', level: 'A1', block: 6, blockName: 'Будущее', order: 29,
    title: 'Question Tags', duration: '10 мин',
    theory: {
      explanation: 'Question Tags = короткие вопросы в конце предложения.\nПравило:\n• Утвердительное → отрицательный хвост: She is Spanish, isn\'t she?\n• Отрицательное → утвердительный хвост: They aren\'t coming, are they?\nХвост повторяет вспомогательный глагол.',
      examples: [
        { english: 'You are tired, aren\'t you?', russian: 'Ты устал(а), не правда ли?' },
        { english: 'She isn\'t here, is she?', russian: 'Её здесь нет, верно?' },
        { english: 'They came yesterday, didn\'t they?', russian: 'Они пришли вчера, не так ли?' },
        { english: 'He can swim, can\'t he?', russian: 'Он умеет плавать, правда?' },
        { english: 'We won\'t be late, will we?', russian: 'Мы не опоздаем, верно?' },
        { english: 'It was cold, wasn\'t it?', russian: 'Было холодно, не так ли?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'She is a doctor, ___ she?', options: ['is', 'isn\'t', 'wasn\'t', 'aren\'t'], answer: 'isn\'t' },
      { type: 'multiple_choice', question: 'They don\'t like coffee, ___ they?', options: ['do', 'don\'t', 'are', 'aren\'t'], answer: 'do' },
      { type: 'fill_blank', question: 'It\'s cold today, ___ it?', answer: 'isn\'t' },
      { type: 'multiple_choice', question: 'He can drive, ___ he?', options: ['can', 'can\'t', 'doesn\'t', 'isn\'t'], answer: 'can\'t' },
      { type: 'fill_blank', question: 'You weren\'t at home, ___ you?', answer: 'were' },
    ],
    quiz: [
      { question: 'You like music, ___ you?', options: ['do', 'don\'t', 'are', 'aren\'t'], answer: 'don\'t' },
      { question: 'She wasn\'t happy, ___ she?', options: ['wasn\'t', 'was', 'isn\'t', 'is'], answer: 'was' },
      { question: 'They will come, ___ they?', options: ['will', 'won\'t', 'wouldn\'t', 'don\'t'], answer: 'won\'t' },
      { question: 'He doesn\'t smoke, ___ he?', options: ['doesn\'t', 'does', 'isn\'t', 'is'], answer: 'does' },
      { question: 'It\'s beautiful, ___ it?', options: ['is', 'isn\'t', 'wasn\'t', 'aren\'t'], answer: 'isn\'t' },
    ],
  },

  {
    id: 'a1-6-30', level: 'A1', block: 6, blockName: 'Будущее', order: 30,
    title: 'A1 Повторение', duration: '25 мин',
    theory: {
      explanation: 'Повторение всей грамматики A1:\n• To Be: am/is/are / was/were\n• Have got: I have got, She has got\n• Present Simple: I work, She works\n• Present Continuous: am/is/are + -ing\n• Past Simple: worked / went / didn\'t\n• Can/Must: I can swim / You must stop\n• Going to / Will: I\'m going to study / I\'ll help\n• There is/are\n• Question words: What, Where, When, Who, Why, How\n• Articles: a, an, the\n• Prepositions: in, on, at, under',
      examples: [
        { english: 'I am a student from Russia.', russian: 'Я студент из России.' },
        { english: 'She has got blue eyes.', russian: 'У неё голубые глаза.' },
        { english: 'I went to the cinema last Saturday.', russian: 'В прошлую субботу я ходил(а) в кино.' },
        { english: 'Can you speak French? No, I can\'t.', russian: 'Ты говоришь по-французски? Нет.' },
        { english: 'We are going to travel next summer.', russian: 'Следующим летом мы собираемся путешествовать.' },
        { english: 'There are many people in the park.', russian: 'В парке много людей.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'She ___ (go) to school every day.', options: ['go', 'goes', 'going', 'is go'], answer: 'goes' },
      { type: 'fill_blank', question: 'I ___ at home yesterday. (wasn\'t/weren\'t)', answer: 'wasn\'t' },
      { type: 'multiple_choice', question: 'There ___ a cat in the garden.', options: ['are', 'is', 'be', 'have'], answer: 'is' },
      { type: 'fill_blank', question: 'She is going ___ visit her grandma.', answer: 'to' },
      { type: 'multiple_choice', question: 'You ___ smoke here. (запрет)', options: ['must', 'mustn\'t', 'can', 'should'], answer: 'mustn\'t' },
    ],
    quiz: [
      { question: 'I ___ at school yesterday.', options: ['were', 'am', 'is', 'was'], answer: 'was' },
      { question: 'She ___ got long hair.', options: ['have', 'has', 'had', 'haves'], answer: 'has' },
      { question: '___ they playing right now?', options: ['Is', 'Do', 'Does', 'Are'], answer: 'Are' },
      { question: 'Did you see the film? No, I ___.', options: ['don\'t', 'wasn\'t', 'didn\'t', 'haven\'t'], answer: 'didn\'t' },
      { question: 'Can she drive? Yes, she ___.', options: ['does', 'is', 'can', 'has'], answer: 'can' },
      { question: 'There ___ three chairs in the room.', options: ['is', 'are', 'be', 'have'], answer: 'are' },
      { question: '___ is your birthday?', options: ['Where', 'What', 'When', 'Who'], answer: 'When' },
      { question: 'I\'m ___ to travel next month.', options: ['will', 'going', 'shall', 'can'], answer: 'going' },
      { question: 'She is ___ engineer.', options: ['a', 'an', 'the', '—'], answer: 'an' },
      { question: 'You ___ be quiet in the library.', options: ['mustn\'t', 'can\'t', 'must', 'don\'t'], answer: 'must' },
    ],
  },

  // ── A2 Block 1: Прошлое углублённо ──────────────────────────────────────────
  {
    id: 'a2-1-31', level: 'A2', block: 1, blockName: 'Прошлое углублённо', order: 31,
    title: 'Past Progressive', duration: '12 мин',
    theory: {
      explanation: 'Past Progressive = действие в процессе в определённый момент прошлого.\nФорма: was/were + глагол-ing.\nI was sleeping at 10pm. (Я спал в 10 вечера.)\nОтрицание: wasn\'t/weren\'t + -ing.\nВопрос: Were you sleeping?\nКраткие ответы: Yes, I was. / No, I wasn\'t.',
      examples: [
        { english: 'I was watching TV at 8 o\'clock.', russian: 'В 8 часов я смотрел(а) телевизор.' },
        { english: 'She was reading when I called.', russian: 'Когда я позвонил(а), она читала.' },
        { english: 'Were you sleeping? Yes, I was.', russian: 'Ты спал(а)? Да.' },
        { english: 'They weren\'t listening to the teacher.', russian: 'Они не слушали учителя.' },
        { english: 'What were you doing?', russian: 'Что ты делал(а)?' },
        { english: 'He was cooking dinner.', russian: 'Он готовил ужин.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ (read) when I arrived.', answer: 'was reading', hint: 'was + reading' },
      { type: 'fill_blank', question: 'They ___ (not listen) to music.', answer: 'weren\'t listening' },
      { type: 'multiple_choice', question: 'What ___ you doing at 9pm?', options: ['did', 'was', 'were', 'are'], answer: 'were' },
      { type: 'multiple_choice', question: 'He ___ (sleep) when the phone rang.', options: ['was sleeping', 'were sleeping', 'slept', 'is sleeping'], answer: 'was sleeping' },
      { type: 'fill_blank', question: 'I ___ (study) at 7 o\'clock.', answer: 'was studying' },
    ],
    quiz: [
      { question: 'She ___ (work) at midnight.', options: ['work', 'worked', 'was working', 'were working'], answer: 'was working' },
      { question: 'We ___ (not watch) TV.', options: ['wasn\'t watching', 'weren\'t watching', 'didn\'t watching', 'not watching'], answer: 'weren\'t watching' },
      { question: '___ he sleeping when you arrived?', options: ['Did', 'Was', 'Were', 'Is'], answer: 'Was' },
      { question: 'What ___ they doing at noon?', options: ['did', 'was', 'were', 'are'], answer: 'were' },
      { question: 'I ___ (cook) when she called.', options: ['cook', 'cooked', 'was cooking', 'am cooking'], answer: 'was cooking' },
    ],
  },

  {
    id: 'a2-1-32', level: 'A2', block: 1, blockName: 'Прошлое углублённо', order: 32,
    title: 'Past Simple vs Progressive', duration: '12 мин',
    theory: {
      explanation: 'Past Progressive (was doing) = более длинное фоновое действие.\nPast Simple (did) = более короткое законченное действие, прерывающее первое.\n\nI was sleeping WHEN the phone rang.\n(Я спал — фон; телефон зазвонил — прервало)\n\nWHILE вводит длинное действие: While I was cooking, she arrived.',
      examples: [
        { english: 'I was walking home when it started to rain.', russian: 'Я шёл домой, когда начался дождь.' },
        { english: 'She was reading while I was cooking.', russian: 'Она читала, пока я готовил(а).' },
        { english: 'While they were talking, I left.', russian: 'Пока они разговаривали, я ушёл(ла).' },
        { english: 'He fell asleep while he was watching TV.', russian: 'Он заснул, пока смотрел телевизор.' },
        { english: 'I was having a shower when you called.', russian: 'Я принимал(а) душ, когда ты позвонил(а).' },
        { english: 'What were you doing when I arrived?', russian: 'Что ты делал(а), когда я пришёл(пришла)?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ (read) when she called.', answer: 'was reading', hint: 'фоновое действие = Past Progressive' },
      { type: 'fill_blank', question: 'While I was cooking, he ___ (arrive).', answer: 'arrived', hint: 'прерывающее действие = Past Simple' },
      { type: 'multiple_choice', question: 'She ___ (sleep) when the alarm ___ (go off).', options: ['was sleeping / went', 'slept / was going', 'was sleeping / was going', 'slept / went'], answer: 'was sleeping / went' },
      { type: 'multiple_choice', question: '"While" вводит...', options: ['короткое действие', 'длинное фоновое действие', 'будущее действие', 'привычку'], answer: 'длинное фоновое действие' },
      { type: 'fill_blank', question: 'He ___ (fall) asleep while he ___ (watch) TV.', answer: 'fell', hint: 'прерывающее действие' },
    ],
    quiz: [
      { question: 'I was eating when she ___ (arrive).', options: ['was arriving', 'arrived', 'arrives', 'is arriving'], answer: 'arrived' },
      { question: 'While they ___ (talk), I left.', options: ['talked', 'was talking', 'were talking', 'are talking'], answer: 'were talking' },
      { question: '"When" в этом контексте вводит...', options: ['фоновое действие', 'прерывающее действие', 'будущее', 'привычку'], answer: 'прерывающее действие' },
      { question: 'She ___ (read) while I was working.', options: ['read', 'was reading', 'reads', 'is reading'], answer: 'was reading' },
      { question: 'He broke his leg while he ___ (ski).', options: ['skied', 'skis', 'was skiing', 'is skiing'], answer: 'was skiing' },
    ],
  },

  {
    id: 'a2-1-33', level: 'A2', block: 1, blockName: 'Прошлое углублённо', order: 33,
    title: 'Топ-20 неправильных глаголов', duration: '12 мин',
    theory: {
      explanation: 'Важные неправильные глаголы:\nbegin/began, break/broke, bring/brought, build/built\ncatch/caught, choose/chose, feel/felt, find/found\nforget/forgot, grow/grew, hold/held, keep/kept\nleave/left, lose/lost, meet/met, pay/paid\nrun/ran, send/sent, sit/sat, stand/stood',
      examples: [
        { english: 'She forgot her keys again.', russian: 'Она снова забыла ключи.' },
        { english: 'We met at university.', russian: 'Мы познакомились в университете.' },
        { english: 'I lost my phone yesterday.', russian: 'Вчера я потерял(а) телефон.' },
        { english: 'He kept his promise.', russian: 'Он сдержал своё обещание.' },
        { english: 'They built this house in 1990.', russian: 'Они построили этот дом в 1990 году.' },
        { english: 'She sent me a message.', russian: 'Она прислала мне сообщение.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Прошедшее время "forget"?', options: ['forgetted', 'forgot', 'forgotten', 'forgets'], answer: 'forgot' },
      { type: 'multiple_choice', question: 'Прошедшее время "leave"?', options: ['leaved', 'left', 'leaving', 'leaves'], answer: 'left' },
      { type: 'multiple_choice', question: 'Прошедшее время "catch"?', options: ['catched', 'caught', 'catching', 'catcht'], answer: 'caught' },
      { type: 'multiple_choice', question: 'Прошедшее время "send"?', options: ['sended', 'sent', 'sending', 'sends'], answer: 'sent' },
      { type: 'multiple_choice', question: 'Прошедшее время "find"?', options: ['finded', 'found', 'finding', 'finds'], answer: 'found' },
    ],
    quiz: [
      { question: 'Прошедшее время "break"?', options: ['breaked', 'broken', 'broke', 'breaks'], answer: 'broke' },
      { question: 'Прошедшее время "lose"?', options: ['losed', 'lost', 'losing', 'loses'], answer: 'lost' },
      { question: 'Прошедшее время "meet"?', options: ['meeted', 'met', 'meeting', 'meets'], answer: 'met' },
      { question: 'Прошедшее время "run"?', options: ['runned', 'run', 'ran', 'runs'], answer: 'ran' },
      { question: 'Прошедшее время "choose"?', options: ['choosed', 'chosen', 'chose', 'chooses'], answer: 'chose' },
    ],
  },

  {
    id: 'a2-1-34', level: 'A2', block: 1, blockName: 'Прошлое углублённо', order: 34,
    title: 'Used to', duration: '12 мин',
    theory: {
      explanation: 'USED TO = повторяющиеся действия или состояния в прошлом (которые больше не происходят).\nФорма: I used to + основной глагол.\nОтрицание: I didn\'t use to.\nВопрос: Did you use to...?\nВАЖНО: нет настоящей формы "used to" для текущего состояния.',
      examples: [
        { english: 'I used to live in Moscow.', russian: 'Раньше я жил(а) в Москве.' },
        { english: 'She used to have long hair.', russian: 'Раньше у неё были длинные волосы.' },
        { english: 'Did you use to play football?', russian: 'Ты раньше играл(а) в футбол?' },
        { english: 'We didn\'t use to have smartphones.', russian: 'Раньше у нас не было смартфонов.' },
        { english: 'He used to be very shy.', russian: 'Раньше он был очень застенчивым.' },
        { english: 'They used to come every weekend.', russian: 'Раньше они приходили каждые выходные.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ (used to) smoke, but I stopped.', answer: 'used to' },
      { type: 'fill_blank', question: 'She ___ (used to, отрицание) like vegetables.', answer: 'didn\'t use to' },
      { type: 'multiple_choice', question: '"Used to" означает...', options: ['привычка сейчас', 'привычка в прошлом (уже нет)', 'будущая привычка', 'текущее действие'], answer: 'привычка в прошлом (уже нет)' },
      { type: 'multiple_choice', question: 'Did you ___ live here?', options: ['used to', 'use to', 'using to', 'used'], answer: 'use to' },
      { type: 'fill_blank', question: 'He ___ (used to) be very shy.', answer: 'used to' },
    ],
    quiz: [
      { question: 'She ___ play tennis every day.', options: ['used to', 'use to', 'uses to', 'is used to'], answer: 'used to' },
      { question: 'I ___ eat meat, but now I\'m vegetarian.', options: ['used to', 'use to', 'am used to', 'was used to'], answer: 'used to' },
      { question: 'Вопрос: "___ you use to live here?"', options: ['Was', 'Did', 'Were', 'Do'], answer: 'Did' },
      { question: 'They ___ have a dog. (раньше не было)', options: ['used to', 'didn\'t use to', 'weren\'t use to', 'not used to'], answer: 'didn\'t use to' },
      { question: '"Used to" используется для...', options: ['текущих привычек', 'прошлых привычек (уже нет)', 'будущих планов', 'постоянных истин'], answer: 'прошлых привычек (уже нет)' },
    ],
  },

  {
    id: 'a2-1-35', level: 'A2', block: 1, blockName: 'Прошлое углублённо', order: 35,
    title: 'Past Simple review', duration: '12 мин',
    theory: {
      explanation: 'Полное повторение Past Simple:\n• Правильные глаголы: + ed (worked, played)\n• Неправильные: go→went, have→had, see→saw\n• Отрицание: didn\'t + базовый глагол\n• Вопрос: Did + базовый глагол?\n• Маркеры времени: yesterday, last week, ago, in 2020\n• was/were для TO BE',
      examples: [
        { english: 'I didn\'t see the film last night.', russian: 'Вчера вечером я не смотрел(а) фильм.' },
        { english: 'What did you do at the weekend?', russian: 'Что ты делал(а) на выходных?' },
        { english: 'She moved to London five years ago.', russian: 'Пять лет назад она переехала в Лондон.' },
        { english: 'Did he enjoy the party? Yes, he did.', russian: 'Ему понравилась вечеринка? Да.' },
        { english: 'They travelled to Spain in 2019.', russian: 'В 2019 году они путешествовали по Испании.' },
        { english: 'I was born in Almaty.', russian: 'Я родился(ась) в Алматы.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ (go) to Paris last year.', answer: 'went' },
      { type: 'multiple_choice', question: 'I ___ (not see) him yesterday.', options: ['didn\'t saw', 'didn\'t see', 'don\'t see', 'not saw'], answer: 'didn\'t see' },
      { type: 'fill_blank', question: '___ you enjoy the concert?', answer: 'Did' },
      { type: 'multiple_choice', question: 'He ___ (arrive) two hours ago.', options: ['arrive', 'arrives', 'arrived', 'is arriving'], answer: 'arrived' },
      { type: 'multiple_choice', question: 'We ___ (be) at home yesterday evening.', options: ['was', 'were', 'are', 'been'], answer: 'were' },
    ],
    quiz: [
      { question: 'She ___ (visit) her parents last Sunday.', options: ['visit', 'visits', 'visited', 'visiting'], answer: 'visited' },
      { question: 'I ___ (not finish) my homework.', options: ['didn\'t finished', 'didn\'t finish', 'doesn\'t finish', 'not finished'], answer: 'didn\'t finish' },
      { question: '___ they arrive on time?', options: ['Was', 'Were', 'Did', 'Do'], answer: 'Did' },
      { question: 'He ___ (take) a taxi home.', options: ['take', 'takes', 'took', 'taken'], answer: 'took' },
      { question: 'I ___ born in 1995.', options: ['am', 'was', 'were', 'be'], answer: 'was' },
    ],
  },


  // ── A2 Block 2: Условия и желания ──────────────────────────────────────────
  {
    id: 'a2-2-36', level: 'A2', block: 2, blockName: 'Условия и желания', order: 36,
    title: 'Zero Conditional', duration: '12 мин',
    theory: {
      explanation: 'Zero Conditional = факты и общие истины.\nФорма: If + Present Simple, Present Simple.\nРезультат ВСЕГДА верен при данном условии.\nМожно заменить "if" на "when".\nIf you heat water to 100°C, it boils.',
      examples: [
        { english: 'If you eat too much, you get fat.', russian: 'Если ешь слишком много, толстеешь.' },
        { english: 'Water freezes if the temperature is below zero.', russian: 'Вода замерзает, если температура ниже нуля.' },
        { english: 'If it rains, I get wet.', russian: 'Если идёт дождь, я мокну.' },
        { english: 'When you don\'t sleep, you feel tired.', russian: 'Когда не спишь, чувствуешь усталость.' },
        { english: 'If you exercise regularly, you feel better.', russian: 'Если регулярно заниматься, чувствуешь себя лучше.' },
        { english: 'Plants die if they don\'t get water.', russian: 'Растения погибают, если не получают воды.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'If you heat ice, it ___ (melt).', answer: 'melts', hint: 'Zero Conditional: оба глагола в Present Simple' },
      { type: 'multiple_choice', question: 'Zero Conditional используется для...', options: ['будущих планов', 'общих фактов и истин', 'нереальных ситуаций', 'прошлых событий'], answer: 'общих фактов и истин' },
      { type: 'fill_blank', question: 'If you don\'t eat, you ___ (get) hungry.', answer: 'get' },
      { type: 'multiple_choice', question: 'Правильная форма: "If it snows, the roads ___ dangerous."', options: ['will be', 'are', 'were', 'would be'], answer: 'are' },
      { type: 'multiple_choice', question: '"When" в Zero Conditional означает...', options: ['только иногда', 'то же, что if', 'в будущем', 'в прошлом'], answer: 'то же, что if' },
    ],
    quiz: [
      { question: 'If you mix red and blue, you ___ purple.', options: ['will get', 'get', 'got', 'getting'], answer: 'get' },
      { question: 'Water boils if you ___ it to 100°C.', options: ['heated', 'heat', 'will heat', 'heating'], answer: 'heat' },
      { question: 'Zero Conditional = ...', options: ['нереальное настоящее', 'общая правда/факты', 'будущий результат', 'прошлое сожаление'], answer: 'общая правда/факты' },
      { question: '___ you don\'t sleep enough, you feel tired.', options: ['If', 'Will', 'Would', 'Were'], answer: 'If' },
      { question: 'Оба глагола в Zero Conditional:', options: ['Past Simple', 'Future Simple', 'Present Simple', 'Present Perfect'], answer: 'Present Simple' },
    ],
  },

  {
    id: 'a2-2-37', level: 'A2', block: 2, blockName: 'Условия и желания', order: 37,
    title: 'First Conditional', duration: '12 мин',
    theory: {
      explanation: 'First Conditional = реальные и возможные ситуации в будущем.\nФорма: If + Present Simple, will + основной глагол.\nIf it rains tomorrow, I will stay home.\n\nВ части с результатом можно использовать: might, can, should.\nIf you study hard, you might pass.',
      examples: [
        { english: 'If it rains tomorrow, I will stay home.', russian: 'Если завтра будет дождь, я останусь дома.' },
        { english: 'If you study hard, you will pass the exam.', russian: 'Если будешь усердно учиться, сдашь экзамен.' },
        { english: 'If she calls, I\'ll tell her.', russian: 'Если она позвонит, я ей скажу.' },
        { english: 'I\'ll be angry if you\'re late.', russian: 'Я рассержусь, если ты опоздаешь.' },
        { english: 'If we leave now, we won\'t miss the train.', russian: 'Если уйдём сейчас, не опоздаем на поезд.' },
        { english: 'If you need help, you can call me.', russian: 'Если понадобится помощь, можешь позвонить мне.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'If it ___ (rain) tomorrow, I will stay home.', answer: 'rains', hint: 'If-часть: Present Simple' },
      { type: 'fill_blank', question: 'If she studies hard, she ___ (pass).', answer: 'will pass', hint: 'результат: will + глагол' },
      { type: 'multiple_choice', question: 'First Conditional выражает...', options: ['нереальные ситуации', 'реальные возможные будущие ситуации', 'прошлые сожаления', 'факты'], answer: 'реальные возможные будущие ситуации' },
      { type: 'multiple_choice', question: 'If you ___ (not hurry), you\'ll be late.', options: ['won\'t hurry', 'don\'t hurry', 'didn\'t hurry', 'wouldn\'t hurry'], answer: 'don\'t hurry' },
      { type: 'fill_blank', question: 'I ___ (help) you if you ask me.', answer: 'will help' },
    ],
    quiz: [
      { question: 'If she ___ (call), I\'ll answer.', options: ['called', 'calls', 'will call', 'would call'], answer: 'calls' },
      { question: 'If you eat well, you ___ (feel) better.', options: ['feel', 'will feel', 'felt', 'would feel'], answer: 'will feel' },
      { question: 'First Conditional: If + ___ , will + verb', options: ['Past Simple', 'Present Simple', 'Present Perfect', 'Future'], answer: 'Present Simple' },
      { question: 'I ___ angry if you\'re late.', options: ['am', 'was', 'will be', 'would be'], answer: 'will be' },
      { question: 'If we ___ (not leave) now, we\'ll miss the bus.', options: ['won\'t leave', 'don\'t leave', 'didn\'t leave', 'wouldn\'t leave'], answer: 'don\'t leave' },
    ],
  },

  {
    id: 'a2-2-38', level: 'A2', block: 2, blockName: 'Условия и желания', order: 38,
    title: 'Unless', duration: '12 мин',
    theory: {
      explanation: 'UNLESS = if not (если не).\nUnless you study, you\'ll fail = If you don\'t study, you\'ll fail.\n\nВАЖНО: после unless всегда используй ПОЛОЖИТЕЛЬНЫЙ глагол!\nUnless she calls (не: unless she doesn\'t call)\n\nUnless обычно используется с нулевым и первым условным.',
      examples: [
        { english: 'I\'ll go unless it rains.', russian: 'Я пойду, если только не пойдёт дождь.' },
        { english: 'Unless you hurry, you\'ll be late.', russian: 'Если не поспешишь, опоздаешь.' },
        { english: 'She won\'t come unless you invite her.', russian: 'Она не придёт, если ты её не пригласишь.' },
        { english: 'Unless you eat breakfast, you\'ll be hungry.', russian: 'Если не позавтракаешь, будешь голодным.' },
        { english: 'He\'ll call unless he\'s busy.', russian: 'Он позвонит, если не будет занят.' },
        { english: 'I won\'t tell anyone unless you ask me to.', russian: 'Я никому не скажу, если ты меня не попросишь.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Unless" означает...', options: ['даже если', 'если не', 'когда', 'как только'], answer: 'если не' },
      { type: 'multiple_choice', question: '"Unless you study, you\'ll fail" = ?', options: ['If you study, you\'ll fail.', 'If you don\'t study, you\'ll fail.', 'If you studied, you\'d fail.', 'You won\'t fail if you study.'], answer: 'If you don\'t study, you\'ll fail.' },
      { type: 'fill_blank', question: '___ she hurries, she\'ll miss the train.', answer: 'Unless' },
      { type: 'multiple_choice', question: 'После unless глагол...', options: ['отрицательный', 'положительный', 'в Past Simple', 'в будущем'], answer: 'положительный' },
      { type: 'fill_blank', question: 'I won\'t help you ___ you apologise.', answer: 'unless' },
    ],
    quiz: [
      { question: '"Unless" = ...', options: ['if', 'if not', 'even if', 'although'], answer: 'if not' },
      { question: '___ you book in advance, there won\'t be seats.', options: ['If', 'Unless', 'When', 'Although'], answer: 'Unless' },
      { question: 'Unless he ___ (study), he\'ll fail.', options: ['studies', 'doesn\'t study', 'studied', 'will study'], answer: 'studies' },
      { question: '"Unless it rains" = ?', options: ['if it rains', 'if it doesn\'t rain', 'when it rains', 'although it rains'], answer: 'if it doesn\'t rain' },
      { question: 'She won\'t pass ___ she practises more.', options: ['if', 'unless', 'when', 'although'], answer: 'unless' },
    ],
  },

  {
    id: 'a2-2-39', level: 'A2', block: 2, blockName: 'Условия и желания', order: 39,
    title: 'Wish', duration: '12 мин',
    theory: {
      explanation: 'WISH для воображаемых ситуаций:\nWish + Past Simple = хочу, чтобы сейчас было иначе (но это не так).\nI wish I was taller. (Я не высокий, но хочу быть.)\nI wish I had more money. (У меня мало денег.)\nWish + could = умение, которого хочу:\nI wish I could speak French.',
      examples: [
        { english: 'I wish I was taller.', russian: 'Жаль, что я не выше ростом.' },
        { english: 'She wishes she could speak French.', russian: 'Она хотела бы уметь говорить по-французски.' },
        { english: 'I wish I had more time.', russian: 'Жаль, что у меня так мало времени.' },
        { english: 'He wishes he lived near the beach.', russian: 'Он хотел бы жить у моря.' },
        { english: 'I wish it wasn\'t raining.', russian: 'Жаль, что идёт дождь.' },
        { english: 'We wish we could help you.', russian: 'Мы бы хотели тебе помочь.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I wish I ___ (be) taller.', answer: 'was', hint: 'wish + Past Simple' },
      { type: 'fill_blank', question: 'She wishes she ___ (can) drive.', answer: 'could', hint: 'wish + could' },
      { type: 'multiple_choice', question: '"I wish I had more money" означает...', options: ['У меня много денег.', 'У меня нет денег, и я хочу иметь больше.', 'Я буду иметь больше денег.', 'Мне дали деньги.'], answer: 'У меня нет денег, и я хочу иметь больше.' },
      { type: 'multiple_choice', question: 'I wish it ___ (not rain) today.', options: ['doesn\'t rain', 'won\'t rain', 'wasn\'t raining', 'isn\'t raining'], answer: 'wasn\'t raining' },
      { type: 'fill_blank', question: 'He wishes he ___ (live) in Paris.', answer: 'lived' },
    ],
    quiz: [
      { question: 'I wish I ___ (know) the answer.', options: ['know', 'knew', 'known', 'will know'], answer: 'knew' },
      { question: '"I wish I could fly" означает...', options: ['Я умею летать.', 'Я хочу научиться летать.', 'Я не умею летать, но хотел бы.', 'Я буду летать.'], answer: 'Я не умею летать, но хотел бы.' },
      { question: 'She wishes she ___ (have) a bigger flat.', options: ['has', 'have', 'had', 'having'], answer: 'had' },
      { question: 'Форма глагола после "wish" (настоящее нереальное):', options: ['Present Simple', 'Future', 'Past Simple', 'Infinitive'], answer: 'Past Simple' },
      { question: 'He wishes he ___ (can) speak English better.', options: ['can', 'could', 'will', 'would'], answer: 'could' },
    ],
  },

  {
    id: 'a2-2-40', level: 'A2', block: 2, blockName: 'Условия и желания', order: 40,
    title: 'Should', duration: '12 мин',
    theory: {
      explanation: 'SHOULD = совет и рекомендация (я думаю, это хорошая идея).\nФорма: should + основной глагол (для всех лиц).\nОтрицание: shouldn\'t.\nВопрос: Should I...?\n\nShould — слабее, чем must. Это не обязательство, а совет.',
      examples: [
        { english: 'You should see a doctor.', russian: 'Тебе следует сходить к врачу.' },
        { english: 'She shouldn\'t work so much.', russian: 'Ей не следует так много работать.' },
        { english: 'Should I call him?', russian: 'Мне стоит ему позвонить?' },
        { english: 'You should drink more water.', russian: 'Тебе стоит пить больше воды.' },
        { english: 'I think you should apologise.', russian: 'Думаю, тебе стоит извиниться.' },
        { english: 'You shouldn\'t eat so much sugar.', russian: 'Не следует есть так много сахара.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'You ___ eat more vegetables. (совет)', answer: 'should' },
      { type: 'fill_blank', question: 'You ___ smoke. (плохой совет = shouldn\'t)', answer: 'shouldn\'t' },
      { type: 'multiple_choice', question: 'Should — это...', options: ['сильная обязанность', 'запрет', 'совет/рекомендация', 'разрешение'], answer: 'совет/рекомендация' },
      { type: 'multiple_choice', question: '___ I take an umbrella?', options: ['Must', 'Should', 'Will', 'Am'], answer: 'Should' },
      { type: 'multiple_choice', question: 'Разница между must и should:', options: ['Нет разницы', 'Must сильнее — обязанность; should — совет', 'Should сильнее', 'Must — совет; should — обязанность'], answer: 'Must сильнее — обязанность; should — совет' },
    ],
    quiz: [
      { question: 'You ___ go to bed earlier. (совет)', options: ['must', 'should', 'can', 'will'], answer: 'should' },
      { question: 'She ___ eat so much junk food. (не следует)', options: ['should', 'shouldn\'t', 'mustn\'t', 'can\'t'], answer: 'shouldn\'t' },
      { question: '___ I wear a tie to the interview?', options: ['Must', 'Should', 'Do', 'Am'], answer: 'Should' },
      { question: '"Should" выражает...', options: ['строгий запрет', 'умение', 'совет', 'разрешение'], answer: 'совет' },
      { question: 'You ___ listen to your teacher. (совет)', options: ['mustn\'t', 'can\'t', 'shouldn\'t', 'should'], answer: 'should' },
    ],
  },


  // ── A2 Block 3: Обязательства ───────────────────────────────────────────────
  {
    id: 'a2-3-41', level: 'A2', block: 3, blockName: 'Обязательства', order: 41,
    title: 'Have to / Had to', duration: '12 мин',
    theory: {
      explanation: 'HAVE TO = внешняя обязанность (правило, требование другого человека).\nI have to wear a uniform at work. (Это правило.)\nHAD TO = прошедшая обязанность.\nDON\'T HAVE TO = нет необходимости (но можно, если хочешь).\nDo I have to...? = Обязательно ли мне...?',
      examples: [
        { english: 'I have to work on Saturdays.', russian: 'Мне приходится работать по субботам.' },
        { english: 'She had to see the doctor yesterday.', russian: 'Вчера ей пришлось идти к врачу.' },
        { english: 'Do you have to wear a uniform?', russian: 'Тебе обязательно носить форму?' },
        { english: 'We don\'t have to come early.', russian: 'Нам не нужно приходить рано.' },
        { english: 'He had to leave before the end.', russian: 'Ему пришлось уйти до конца.' },
        { english: 'You don\'t have to pay.', russian: 'Тебе не нужно платить.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ (have to) finish this today.', answer: 'have to' },
      { type: 'fill_blank', question: 'She ___ (had to) work late yesterday.', answer: 'had to' },
      { type: 'multiple_choice', question: '"Don\'t have to" означает...', options: ['нельзя', 'не нужно (но можно)', 'обязательно', 'запрещено'], answer: 'не нужно (но можно)' },
      { type: 'multiple_choice', question: '___ you have to wear a suit at work?', options: ['Must', 'Are', 'Do', 'Have'], answer: 'Do' },
      { type: 'fill_blank', question: 'You ___ (don\'t have to) come if you\'re busy.', answer: 'don\'t have to' },
    ],
    quiz: [
      { question: 'She ___ leave early yesterday. (пришлось)', options: ['has to', 'have to', 'had to', 'must'], answer: 'had to' },
      { question: 'You ___ pay — it\'s free! (не нужно)', options: ['mustn\'t', 'can\'t', 'don\'t have to', 'haven\'t to'], answer: 'don\'t have to' },
      { question: '___ he have to wear a tie?', options: ['Must', 'Does', 'Has', 'Is'], answer: 'Does' },
      { question: 'Have to vs must: have to — это...', options: ['личное ощущение необходимости', 'внешнее правило/требование', 'запрет', 'разрешение'], answer: 'внешнее правило/требование' },
      { question: 'I ___ (have to) study harder.', options: ['has to', 'have to', 'had', 'must'], answer: 'have to' },
    ],
  },

  {
    id: 'a2-3-42', level: 'A2', block: 3, blockName: 'Обязательства', order: 42,
    title: 'Must vs Have to', duration: '12 мин',
    theory: {
      explanation: 'MUST = внутренняя обязанность (ты сам считаешь необходимым).\nI must call Mum — я давно не звонил.\nHAVE TO = внешняя обязанность (правило или требование другого).\nYou have to wear a seatbelt — это закон.\n\nMUSTN\'T = запрет (нельзя!)\nDON\'T HAVE TO = не обязательно (свободный выбор)',
      examples: [
        { english: 'I must call my mother — I haven\'t spoken to her in a week.', russian: 'Мне нужно позвонить маме — я не говорил(а) с ней неделю.' },
        { english: 'You have to wear a seatbelt — it\'s the law.', russian: 'Ты обязан пристегнуться — это закон.' },
        { english: 'You mustn\'t smoke in here.', russian: 'Здесь нельзя курить.' },
        { english: 'You don\'t have to come if you don\'t want to.', russian: 'Тебе необязательно приходить, если не хочешь.' },
        { english: 'I must remember to buy milk.', russian: 'Мне нужно не забыть купить молоко.' },
        { english: 'Students have to hand in their work by Friday.', russian: 'Студенты обязаны сдать работу к пятнице.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Ты сам считаешь важным сделать что-то. Используй:', options: ['have to', 'must', 'should', 'can'], answer: 'must' },
      { type: 'multiple_choice', question: 'Это правило в школе. Используй:', options: ['must', 'have to', 'should', 'might'], answer: 'have to' },
      { type: 'multiple_choice', question: '"Mustn\'t" vs "don\'t have to": "нельзя" — это...', options: ['don\'t have to', 'mustn\'t', 'shouldn\'t', 'can\'t'], answer: 'mustn\'t' },
      { type: 'multiple_choice', question: '"Не обязательно" — это...', options: ['mustn\'t', 'don\'t have to', 'can\'t', 'shouldn\'t'], answer: 'don\'t have to' },
      { type: 'fill_blank', question: 'You ___ smoke here. (строгий запрет)', answer: 'mustn\'t' },
    ],
    quiz: [
      { question: 'Ты сам решил позвонить маме. Скажи:', options: ['I have to call Mum.', 'I must call Mum.', 'I should call Mum.', 'I can call Mum.'], answer: 'I must call Mum.' },
      { question: 'Закон требует пристёгиваться. Скажи:', options: ['You must wear a seatbelt.', 'You have to wear a seatbelt.', 'You should wear a seatbelt.', 'You might wear a seatbelt.'], answer: 'You have to wear a seatbelt.' },
      { question: '"You mustn\'t park here" означает...', options: ['Здесь не нужно парковаться.', 'Здесь нельзя парковаться.', 'Здесь можно парковаться.', 'Здесь рекомендуется парковаться.'], answer: 'Здесь нельзя парковаться.' },
      { question: '"You don\'t have to come" означает...', options: ['Ты не можешь прийти.', 'Тебе нельзя приходить.', 'Тебе необязательно приходить.', 'Ты должен прийти.'], answer: 'Тебе необязательно приходить.' },
      { question: 'Must выражает ___ обязанность.', options: ['внешнюю (правило)', 'внутреннюю (личное мнение)', 'слабую', 'никакую'], answer: 'внутреннюю (личное мнение)' },
    ],
  },

  {
    id: 'a2-3-43', level: 'A2', block: 3, blockName: 'Обязательства', order: 43,
    title: 'Could / Couldn\'t', duration: '12 мин',
    theory: {
      explanation: 'COULD = прошлое умение (мог/умел).\nI could swim at age 5. (В 5 лет я умел плавать.)\nCOULDN\'T = не умел/не мог.\n\nTакже COULD используется для:\n• Вежливые просьбы: Could you help me?\n• Возможность: It could be true. (Это возможно.)',
      examples: [
        { english: 'I could swim when I was five.', russian: 'В пять лет я умел плавать.' },
        { english: 'She couldn\'t speak English before the course.', russian: 'До курса она не умела говорить по-английски.' },
        { english: 'Could you help me, please?', russian: 'Не могли бы вы помочь мне?' },
        { english: 'Could I have the bill, please?', russian: 'Могу я попросить счёт?' },
        { english: 'He couldn\'t find his keys.', russian: 'Он не мог найти ключи.' },
        { english: 'Could you open the window?', russian: 'Не могли бы вы открыть окно?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ (could) run very fast when she was young.', answer: 'could' },
      { type: 'fill_blank', question: 'I ___ (couldn\'t) find my passport.', answer: 'couldn\'t' },
      { type: 'multiple_choice', question: 'Вежливая просьба: "___ you pass the salt?"', options: ['Can', 'Could', 'Should', 'Must'], answer: 'Could' },
      { type: 'multiple_choice', question: '"Couldn\'t" означает...', options: ['не хотел', 'не мог / не умел', 'не должен', 'не разрешается'], answer: 'не мог / не умел' },
      { type: 'multiple_choice', question: 'Could — это прошедшее от...', options: ['shall', 'will', 'can', 'must'], answer: 'can' },
    ],
    quiz: [
      { question: 'He ___ play chess at the age of 4.', options: ['can', 'could', 'would', 'should'], answer: 'could' },
      { question: 'I ___ understand the lecture — it was too fast.', options: ['could', 'can', 'couldn\'t', 'can\'t'], answer: 'couldn\'t' },
      { question: '___ you tell me the time, please?', options: ['Can', 'Could', 'Should', 'Must'], answer: 'Could' },
      { question: 'Could для вежливой просьбы — это...', options: ['прошлое', 'настоящее вежливое', 'будущее', 'запрет'], answer: 'настоящее вежливое' },
      { question: 'She ___ speak three languages when she was ten.', options: ['can', 'could', 'couldn\'t', 'was able'], answer: 'could' },
    ],
  },

  {
    id: 'a2-3-44', level: 'A2', block: 3, blockName: 'Обязательства', order: 44,
    title: 'Need / Needn\'t', duration: '12 мин',
    theory: {
      explanation: 'NEED = необходимость.\nI need to buy food. She needs to rest.\nNEEDN\'T = нет необходимости (= don\'t need to).\nYou needn\'t worry. (Тебе не нужно беспокоиться.)\nDo I need to...? = Нужно ли мне...?\n\nNeedn\'t + основной глагол (без to): You needn\'t come.',
      examples: [
        { english: 'I need to buy some food.', russian: 'Мне нужно купить еды.' },
        { english: 'Do I need to bring anything?', russian: 'Мне нужно что-нибудь принести?' },
        { english: 'You needn\'t come if you\'re tired.', russian: 'Тебе не нужно приходить, если ты устал(а).' },
        { english: 'She needs to rest.', russian: 'Ей нужно отдохнуть.' },
        { english: 'We need more time.', russian: 'Нам нужно больше времени.' },
        { english: 'You needn\'t worry — everything is fine.', russian: 'Тебе не нужно волноваться — всё хорошо.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ to call the doctor.', answer: 'need' },
      { type: 'fill_blank', question: 'You ___ (needn\'t) wait for me.', answer: 'needn\'t' },
      { type: 'multiple_choice', question: '"Needn\'t" означает...', options: ['запрещено', 'не нужно', 'обязательно', 'можно'], answer: 'не нужно' },
      { type: 'multiple_choice', question: '___ I need to book in advance?', options: ['Should', 'Must', 'Do', 'Am'], answer: 'Do' },
      { type: 'fill_blank', question: 'She ___ to finish the report today.', answer: 'needs' },
    ],
    quiz: [
      { question: 'You ___ bring money — I\'ll pay. (не нужно)', options: ['needn\'t', 'mustn\'t', 'can\'t', 'shouldn\'t'], answer: 'needn\'t' },
      { question: 'I ___ to see a dentist soon.', options: ['need', 'needs', 'needn\'t', 'needed'], answer: 'need' },
      { question: 'Does she ___ to work tomorrow?', options: ['need', 'needs', 'needed', 'needn\'t'], answer: 'need' },
      { question: '"Needn\'t" vs "mustn\'t": needn\'t = ...', options: ['запрет', 'не нужно', 'обязанность', 'умение'], answer: 'не нужно' },
      { question: 'We ___ more information to decide.', options: ['need', 'needn\'t', 'must', 'should'], answer: 'need' },
    ],
  },

  {
    id: 'a2-3-45', level: 'A2', block: 3, blockName: 'Обязательства', order: 45,
    title: 'Modal verbs review', duration: '12 мин',
    theory: {
      explanation: 'Все модальные глаголы:\nCAN — умение/разрешение: Can you swim?\nCOULD — прошлое умение/вежливая просьба: Could you help?\nMUST — сильная обязанность/запрет: must/mustn\'t\nHAVE TO — внешняя обязанность: I have to wear a uniform.\nSHOULD — совет: You should rest.\nNEED — необходимость: I need to eat.\nNEEDN\'T — нет необходимости: You needn\'t come.',
      examples: [
        { english: 'Can you speak Japanese?', russian: 'Ты говоришь по-японски?' },
        { english: 'Could you repeat that?', russian: 'Не могли бы вы повторить?' },
        { english: 'You must wear a seatbelt.', russian: 'Вы обязаны пристегнуться.' },
        { english: 'I have to work tomorrow.', russian: 'Завтра мне нужно работать.' },
        { english: 'You should rest more.', russian: 'Тебе стоит больше отдыхать.' },
        { english: 'You needn\'t bring food — I have everything.', russian: 'Тебе не нужно приносить еду — у меня всё есть.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Совет: "Тебе стоит спать больше":', options: ['You must sleep more.', 'You should sleep more.', 'You have to sleep more.', 'You can sleep more.'], answer: 'You should sleep more.' },
      { type: 'multiple_choice', question: 'Умение в прошлом: "Я умел кататься на велосипеде":', options: ['I can ride a bike.', 'I could ride a bike.', 'I must ride a bike.', 'I should ride a bike.'], answer: 'I could ride a bike.' },
      { type: 'fill_blank', question: 'You ___ smoke here. (запрет)', answer: 'mustn\'t' },
      { type: 'multiple_choice', question: 'Внешняя обязанность (правило):', options: ['must', 'could', 'should', 'have to'], answer: 'have to' },
      { type: 'multiple_choice', question: 'Нет необходимости: "Тебе не нужно готовить":', options: ['You mustn\'t cook.', 'You don\'t have to cook.', 'You can\'t cook.', 'You shouldn\'t cook.'], answer: 'You don\'t have to cook.' },
    ],
    quiz: [
      { question: 'Как попросить кого-то помочь вежливо?', options: ['Can you help?', 'Could you help?', 'Must you help?', 'Should you help?'], answer: 'Could you help?' },
      { question: 'Запрет в настоящем:', options: ['don\'t have to', 'shouldn\'t', 'mustn\'t', 'couldn\'t'], answer: 'mustn\'t' },
      { question: 'She ___ speak French before taking the course.', options: ['can\'t', 'couldn\'t', 'mustn\'t', 'needn\'t'], answer: 'couldn\'t' },
      { question: '"Не нужно" (нет обязанности):', options: ['mustn\'t', 'shouldn\'t', 'don\'t have to', 'can\'t'], answer: 'don\'t have to' },
      { question: 'Умение в настоящем:', options: ['could', 'must', 'can', 'should'], answer: 'can' },
    ],
  },


  // ── A2 Block 4: Present Perfect углублённо ─────────────────────────────────
  {
    id: 'a2-4-46', level: 'A2', block: 4, blockName: 'Present Perfect углублённо', order: 46,
    title: 'Present Perfect: since/for', duration: '12 мин',
    theory: {
      explanation: 'Present Perfect + FOR = длительность (как долго).\nI have lived here for 3 years. (на протяжении 3 лет)\nPresent Perfect + SINCE = начальная точка.\nI have lived here since 2020. (с 2020 года)\n\nИспользуй для ситуаций, которые начались в прошлом и продолжаются сейчас.',
      examples: [
        { english: 'I have studied English for two years.', russian: 'Я учу английский уже два года.' },
        { english: 'She has worked here since January.', russian: 'Она работает здесь с января.' },
        { english: 'How long have you lived in Almaty?', russian: 'Как долго ты живёшь в Алматы?' },
        { english: 'We have been married for ten years.', russian: 'Мы женаты уже десять лет.' },
        { english: 'He has had this car since 2018.', russian: 'У него эта машина с 2018 года.' },
        { english: 'They haven\'t spoken since last week.', russian: 'Они не разговаривают с прошлой недели.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'I have known her ___ 2015.', options: ['for', 'since', 'from', 'during'], answer: 'since' },
      { type: 'multiple_choice', question: 'He has worked here ___ five years.', options: ['since', 'from', 'for', 'during'], answer: 'for' },
      { type: 'fill_blank', question: 'She has lived here ___ she was born.', answer: 'since', hint: 'начальная точка = since' },
      { type: 'fill_blank', question: 'I have waited ___ an hour.', answer: 'for', hint: 'период времени = for' },
      { type: 'multiple_choice', question: 'How long ___ you known him?', options: ['do', 'did', 'have', 'are'], answer: 'have' },
    ],
    quiz: [
      { question: 'We have been friends ___ school.', options: ['for', 'during', 'since', 'from'], answer: 'since' },
      { question: 'She has studied here ___ three months.', options: ['since', 'from', 'during', 'for'], answer: 'for' },
      { question: 'How long ___ he worked here?', options: ['is', 'does', 'has', 'did'], answer: 'has' },
      { question: 'I haven\'t eaten ___ this morning.', options: ['for', 'during', 'since', 'from'], answer: 'since' },
      { question: 'They have lived in London ___ ten years.', options: ['since', 'from', 'during', 'for'], answer: 'for' },
    ],
  },

  {
    id: 'a2-4-47', level: 'A2', block: 4, blockName: 'Present Perfect углублённо', order: 47,
    title: 'Present Perfect: already/yet/just', duration: '12 мин',
    theory: {
      explanation: 'ALREADY = раньше ожидаемого (утвердительные): I have already eaten.\nYET = ожидалось, но ещё не произошло (отрицательные и вопросы):\nHave you eaten yet? / I haven\'t eaten yet.\nJUST = только что (очень недавно): I have just arrived.\n\nПозиция: already и just — перед причастием; yet — в конце.',
      examples: [
        { english: 'I have already done my homework.', russian: 'Я уже сделал(а) домашнее задание.' },
        { english: 'Have you finished yet?', russian: 'Ты уже закончил(а)?' },
        { english: 'No, I haven\'t finished yet.', russian: 'Нет, я ещё не закончил(а).' },
        { english: 'She has just called.', russian: 'Она только что звонила.' },
        { english: 'Have they arrived yet? Yes, they have already arrived.', russian: 'Они уже приехали? Да, уже приехали.' },
        { english: 'I have just had a shower.', russian: 'Я только что принял(а) душ.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I have ___ seen this film. (уже)', answer: 'already' },
      { type: 'fill_blank', question: 'Have you eaten ___? (ещё нет)', answer: 'yet' },
      { type: 'fill_blank', question: 'She has ___ arrived. (только что)', answer: 'just' },
      { type: 'multiple_choice', question: 'I haven\'t finished ___. (ещё)', options: ['already', 'yet', 'just', 'still'], answer: 'yet' },
      { type: 'multiple_choice', question: 'He has ___ eaten — he\'s not hungry.', options: ['yet', 'just', 'already', 'still'], answer: 'already' },
    ],
    quiz: [
      { question: '"Already" используется в...', options: ['отрицательных предложениях', 'утвердительных предложениях', 'только в вопросах', 'только с never'], answer: 'утвердительных предложениях' },
      { question: 'Have you called him ___?', options: ['already', 'just', 'yet', 'never'], answer: 'yet' },
      { question: 'She has ___ left — she left 5 minutes ago.', options: ['already', 'yet', 'just', 'still'], answer: 'just' },
      { question: 'I haven\'t seen him ___. (ещё не)', options: ['already', 'just', 'yet', 'never'], answer: 'yet' },
      { question: '"Just" означает...', options: ['никогда', 'только что', 'уже давно', 'ещё не'], answer: 'только что' },
    ],
  },

  {
    id: 'a2-4-48', level: 'A2', block: 4, blockName: 'Present Perfect углублённо', order: 48,
    title: 'Present Perfect vs Past Simple', duration: '12 мин',
    theory: {
      explanation: 'Present Perfect = прошлое с СВЯЗЬЮ С СЕЙЧАС (опыт или всё ещё актуально).\nPast Simple = конкретное прошлое время (yesterday, last week, in 2020).\n\nПравило: если есть КОГДА → Past Simple.\nHave you ever eaten sushi? (PP — опыт)\nI ate sushi last week. (PS — конкретное время)',
      examples: [
        { english: 'I have visited Paris. (general experience)', russian: 'Я был(а) в Париже. (общий опыт)' },
        { english: 'I visited Paris last summer. (specific time)', russian: 'Прошлым летом я был(а) в Париже.' },
        { english: 'Have you ever eaten sushi?', russian: 'Ты когда-нибудь ел(а) суши?' },
        { english: 'I ate sushi in Tokyo in 2019.', russian: 'Я ел(а) суши в Токио в 2019 году.' },
        { english: 'She has lost her keys.', russian: 'Она потеряла ключи (и сейчас их нет).' },
        { english: 'She lost her keys this morning.', russian: 'Она потеряла ключи этим утром.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'I ___ (see) that film. (уже, опыт)', options: ['saw', 'have seen', 'see', 'seen'], answer: 'have seen' },
      { type: 'multiple_choice', question: 'I ___ (see) that film last night. (конкретно)', options: ['have seen', 'see', 'saw', 'seen'], answer: 'saw' },
      { type: 'fill_blank', question: 'She ___ (lose) her phone. She can\'t find it now.', answer: 'has lost', hint: 'связь с настоящим = PP' },
      { type: 'multiple_choice', question: 'Когда мы используем Past Simple?', options: ['Когда нет конкретного времени', 'Когда есть конкретное прошлое время', 'Для жизненного опыта', 'Для недавних событий'], answer: 'Когда есть конкретное прошлое время' },
      { type: 'multiple_choice', question: 'I ___ (be) to France twice.', options: ['was', 'went', 'have been', 'been'], answer: 'have been' },
    ],
    quiz: [
      { question: 'She ___ (arrive) yesterday.', options: ['has arrived', 'arrived', 'arrives', 'is arrived'], answer: 'arrived' },
      { question: 'I ___ (never/be) to Australia.', options: ['never was', 'have never been', 'never been', 'was never'], answer: 'have never been' },
      { question: 'Какое время использовать с "yesterday"?', options: ['Present Perfect', 'Past Simple', 'Past Progressive', 'Present Simple'], answer: 'Past Simple' },
      { question: 'He ___ (finish) his homework — he\'s free now.', options: ['finished', 'finishes', 'has finished', 'had finished'], answer: 'has finished' },
      { question: 'We ___ (meet) him at the conference in 2021.', options: ['have met', 'meet', 'met', 'are meeting'], answer: 'met' },
    ],
  },

  {
    id: 'a2-4-49', level: 'A2', block: 4, blockName: 'Present Perfect углублённо', order: 49,
    title: 'Present Perfect questions', duration: '12 мин',
    theory: {
      explanation: 'Вопросы в Present Perfect:\nHave you ever...? (Ты когда-нибудь...?)\nHow long have you...? (Как долго ты...?)\nHow many times have you...? (Сколько раз ты...?)\nWhat have you done? (Что ты сделал(а)?)\nWho have you met? (Кого ты встретил(а)?)\n\nВсе эти вопросы о жизненном опыте или текущей релевантности.',
      examples: [
        { english: 'Have you ever been to the USA?', russian: 'Ты когда-нибудь был(а) в США?' },
        { english: 'How long have you known her?', russian: 'Как давно ты её знаешь?' },
        { english: 'How many times have you seen this film?', russian: 'Сколько раз ты смотрел(а) этот фильм?' },
        { english: 'What have you done today?', russian: 'Что ты сделал(а) сегодня?' },
        { english: 'Have you met my brother?', russian: 'Ты знаком(а) с моим братом?' },
        { english: 'How long has she worked here?', russian: 'Как долго она здесь работает?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'How long ___ you known him?', answer: 'have' },
      { type: 'fill_blank', question: '___ you ever tried Thai food?', answer: 'Have' },
      { type: 'multiple_choice', question: 'Сколько раз: "How many times ___ you been there?"', options: ['did', 'do', 'have', 'are'], answer: 'have' },
      { type: 'multiple_choice', question: 'Как спросить "Что ты сегодня сделал(а)?"', options: ['What you have done today?', 'What have you done today?', 'What did you do today?', 'What you did today?'], answer: 'What have you done today?' },
      { type: 'fill_blank', question: 'How long ___ she worked here?', answer: 'has' },
    ],
    quiz: [
      { question: '___ you ever tried Indian food?', options: ['Did', 'Do', 'Have', 'Has'], answer: 'Have' },
      { question: 'How long ___ they been married?', options: ['did', 'do', 'have', 'are'], answer: 'have' },
      { question: 'How many times ___ she visited London?', options: ['did', 'does', 'is', 'has'], answer: 'has' },
      { question: 'What ___ you done this week?', options: ['did', 'do', 'have', 'are'], answer: 'have' },
      { question: '___ he ever spoken in public?', options: ['Did', 'Has', 'Have', 'Does'], answer: 'Has' },
    ],
  },

  {
    id: 'a2-4-50', level: 'A2', block: 4, blockName: 'Present Perfect углублённо', order: 50,
    title: 'A2 Повторение', duration: '25 мин',
    theory: {
      explanation: 'Повторение всей грамматики A2:\n• Past Progressive: was/were + -ing\n• Used to: привычки в прошлом\n• Zero/First Conditional: факты и реальные будущие ситуации\n• Unless: если не\n• Wish: I wish I had...\n• Should: совет\n• Have to/Must: обязанность\n• Could: прошлое умение\n• Need/Needn\'t: необходимость\n• Present Perfect: since/for, already/yet/just',
      examples: [
        { english: 'I was watching TV when she called.', russian: 'Я смотрел(а) ТВ, когда она позвонила.' },
        { english: 'If it rains, I\'ll stay home.', russian: 'Если пойдёт дождь, я останусь дома.' },
        { english: 'I wish I could drive.', russian: 'Жаль, что я не умею водить.' },
        { english: 'You should eat less sugar.', russian: 'Тебе стоит есть меньше сахара.' },
        { english: 'I have lived here since 2015.', russian: 'Я живу здесь с 2015 года.' },
        { english: 'She used to live in Moscow.', russian: 'Раньше она жила в Москве.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'I ___ (watch) TV when he arrived.', options: ['watch', 'watched', 'was watching', 'am watching'], answer: 'was watching' },
      { type: 'fill_blank', question: 'If it rains, I ___ (stay) home.', answer: 'will stay' },
      { type: 'multiple_choice', question: '"Used to" выражает...', options: ['текущую привычку', 'прошлую привычку (уже нет)', 'будущий план', 'общую истину'], answer: 'прошлую привычку (уже нет)' },
      { type: 'fill_blank', question: 'She has worked here ___ five years.', answer: 'for' },
      { type: 'multiple_choice', question: 'You ___ be late! (совет)', options: ['mustn\'t', 'can\'t', 'shouldn\'t', 'don\'t have to'], answer: 'shouldn\'t' },
    ],
    quiz: [
      { question: 'She ___ (cook) when I arrived.', options: ['cooked', 'cook', 'was cooking', 'is cooking'], answer: 'was cooking' },
      { question: 'I used to ___ in Moscow.', options: ['lived', 'living', 'live', 'lives'], answer: 'live' },
      { question: 'If it ___ (rain), plants grow.', options: ['rained', 'rains', 'will rain', 'is raining'], answer: 'rains' },
      { question: 'I wish I ___ (speak) French.', options: ['speak', 'spoke', 'could speak', 'will speak'], answer: 'could speak' },
      { question: 'You ___ see a doctor. (совет)', options: ['must', 'have to', 'should', 'can'], answer: 'should' },
      { question: 'I have lived here ___ 2018.', options: ['for', 'during', 'since', 'from'], answer: 'since' },
      { question: 'Have you finished ___?', options: ['already', 'just', 'yet', 'never'], answer: 'yet' },
      { question: '___ you study, you won\'t pass. (если не)', options: ['If', 'Unless', 'When', 'Although'], answer: 'Unless' },
      { question: 'She couldn\'t swim when she was young.', options: ['True — could = past ability', 'False — couldn\'t = present inability', 'True — couldn\'t = past inability', 'False — should be can\'t'], answer: 'True — couldn\'t = past inability' },
      { question: '"Must" vs "have to" — must выражает...', options: ['внешнее правило', 'личное ощущение необходимости', 'слабый совет', 'умение'], answer: 'личное ощущение необходимости' },
    ],
  },


  // ── B1 Block 1: Сложные условия ─────────────────────────────────────────────
  {
    id: 'b1-1-51', level: 'B1', block: 1, blockName: 'Сложные условия', order: 51,
    title: 'Second Conditional', duration: '15 мин',
    theory: {
      explanation: 'Second Conditional = нереальные/воображаемые ситуации в настоящем или будущем.\nФорма: If + Past Simple, would + основной глагол.\nIf I had more money, I would travel more.\n(У меня нет денег — это воображаемая ситуация)\n\nWere можно использовать для всех лиц:\nIf I were you, I would accept. (совет)',
      examples: [
        { english: 'If I had more money, I would buy a house.', russian: 'Если бы у меня было больше денег, я бы купил(а) дом.' },
        { english: 'If I were you, I would call her.', russian: 'На твоём месте я бы позвонил(а) ей.' },
        { english: 'What would you do if you won the lottery?', russian: 'Что бы ты сделал(а), если бы выиграл(а) в лотерею?' },
        { english: 'She would travel more if she didn\'t have to work.', russian: 'Она бы путешествовала больше, если бы ей не нужно было работать.' },
        { english: 'If I spoke better English, I would get that job.', russian: 'Если бы я говорил(а) по-английски лучше, я бы получил(а) эту работу.' },
        { english: 'He wouldn\'t be so tired if he slept more.', russian: 'Он бы не был таким усталым, если бы спал больше.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'If I ___ (be) rich, I would travel the world.', answer: 'were', hint: 'Second Conditional: If + Past Simple' },
      { type: 'fill_blank', question: 'She would buy a car if she ___ (have) enough money.', answer: 'had' },
      { type: 'multiple_choice', question: 'What ___ you do if you found a wallet?', options: ['will', 'would', 'do', 'did'], answer: 'would' },
      { type: 'multiple_choice', question: 'Second Conditional описывает...', options: ['реальные будущие события', 'воображаемые/нереальные ситуации', 'общие факты', 'прошлые события'], answer: 'воображаемые/нереальные ситуации' },
      { type: 'fill_blank', question: 'If I were you, I ___ (accept) the offer.', answer: 'would accept' },
    ],
    quiz: [
      { question: 'If he ___ (study), he would pass.', options: ['studies', 'studied', 'will study', 'has studied'], answer: 'studied' },
      { question: 'I would visit Japan if I ___ (have) the time.', options: ['have', 'had', 'will have', 'has'], answer: 'had' },
      { question: '"If I were you" используется для...', options: ['факта', 'прошлого', 'совета', 'разрешения'], answer: 'совета' },
      { question: 'What would you do if you ___ (see) an accident?', options: ['see', 'saw', 'will see', 'have seen'], answer: 'saw' },
      { question: 'She ___ (not be) so stressed if she exercised more.', options: ['won\'t be', 'wouldn\'t be', 'isn\'t', 'wasn\'t'], answer: 'wouldn\'t be' },
    ],
  },

  {
    id: 'b1-1-52', level: 'B1', block: 1, blockName: 'Сложные условия', order: 52,
    title: '1st vs 2nd Conditional', duration: '15 мин',
    theory: {
      explanation: 'ПЕРВОЕ условное (First) = возможная реальная ситуация:\nIf it rains, I WILL stay home. (это реально может случиться)\n\nВТОРОЕ условное (Second) = нереальная/маловероятная ситуация:\nIf it rained every day, I WOULD move away. (это нереально или очень маловероятно)\n\nКлюч: насколько вероятна ситуация?',
      examples: [
        { english: 'If I find his number, I\'ll call him. (likely)', russian: 'Если найду его номер, позвоню ему. (возможно)' },
        { english: 'If I found his number, I\'d call him. (unlikely)', russian: 'Если бы я нашёл(ла) его номер, я бы позвонил(а). (маловероятно)' },
        { english: 'If she works hard, she\'ll succeed.', russian: 'Если она будет усердно трудиться, она добьётся успеха.' },
        { english: 'If she worked harder, she\'d succeed.', russian: 'Если бы она работала усерднее, она бы добилась успеха.' },
        { english: 'If I win the lottery, I\'ll buy a house.', russian: 'Если я выиграю в лотерею, куплю дом.' },
        { english: 'If I won the lottery, I\'d travel the world.', russian: 'Если бы я выиграл(а) в лотерею, я бы объехал(а) весь мир.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'It might rain — реальная возможность. Используй:', options: ['Second Conditional', 'First Conditional', 'Zero Conditional', 'Third Conditional'], answer: 'First Conditional' },
      { type: 'multiple_choice', question: 'Нереальная/воображаемая ситуация. Используй:', options: ['First Conditional', 'Second Conditional', 'Zero Conditional', 'Third Conditional'], answer: 'Second Conditional' },
      { type: 'multiple_choice', question: 'If I ___ (be) a bird, I would fly everywhere.', options: ['am', 'was', 'were', 'will be'], answer: 'were' },
      { type: 'multiple_choice', question: 'If she ___ (study) tonight, she\'ll pass tomorrow.', options: ['studies', 'studied', 'would study', 'has studied'], answer: 'studies' },
      { type: 'fill_blank', question: 'If I ___ (win) the lottery, I would buy a yacht.', answer: 'won', hint: 'нереальная ситуация = 2nd Conditional, Past Simple' },
    ],
    quiz: [
      { question: '"If I have time, I\'ll come." — это...', options: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'], answer: 'First Conditional' },
      { question: '"If I had time, I\'d come." — это...', options: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'], answer: 'Second Conditional' },
      { question: 'If it ___ (not rain), we\'ll go for a walk.', options: ['didn\'t rain', 'doesn\'t rain', 'won\'t rain', 'wouldn\'t rain'], answer: 'doesn\'t rain' },
      { question: 'If I ___ (be) the president, I\'d change many things.', options: ['am', 'was', 'were', 'will be'], answer: 'were' },
      { question: 'Во втором условном в результате используется...', options: ['will', 'would', 'should', 'might always'], answer: 'would' },
    ],
  },

  {
    id: 'b1-1-53', level: 'B1', block: 1, blockName: 'Сложные условия', order: 53,
    title: 'Third Conditional', duration: '15 мин',
    theory: {
      explanation: 'Third Conditional = воображаемое прошлое (то, что могло произойти, но не произошло).\nФорма: If + Past Perfect, would have + Past Participle.\n\nIf I had studied harder, I would have passed.\n(Я не учил(а) — поэтому не сдал(а). Это невозможно изменить.)\n\nЧасто выражает сожаление о прошлом.',
      examples: [
        { english: 'If I had studied harder, I would have passed the exam.', russian: 'Если бы я учился(ась) усерднее, то сдал(а) бы экзамен.' },
        { english: 'She would have got the job if she had spoken better English.', russian: 'Она бы получила работу, если бы говорила по-английски лучше.' },
        { english: 'If we had left earlier, we wouldn\'t have missed the train.', russian: 'Если бы мы вышли раньше, не опоздали бы на поезд.' },
        { english: 'He would have called you if he had had your number.', russian: 'Он бы позвонил тебе, если бы у него был твой номер.' },
        { english: 'If you had told me, I would have helped.', russian: 'Если бы ты сказал(а) мне, я бы помог(ла).' },
        { english: 'I wouldn\'t have eaten so much if I\'d known about dinner.', russian: 'Я бы не ел(а) так много, если бы знал(а) об ужине.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'If she ___ (study) harder, she would have passed.', answer: 'had studied', hint: '3rd Conditional: If + Past Perfect' },
      { type: 'fill_blank', question: 'We wouldn\'t have been late if we ___ (leave) earlier.', answer: 'had left' },
      { type: 'multiple_choice', question: 'Third Conditional используется для...', options: ['реальных будущих ситуаций', 'нереальных настоящих ситуаций', 'воображаемых прошлых ситуаций', 'общих истин'], answer: 'воображаемых прошлых ситуаций' },
      { type: 'multiple_choice', question: 'If I had known, I ___ (help) you.', options: ['help', 'would help', 'will help', 'would have helped'], answer: 'would have helped' },
      { type: 'fill_blank', question: 'He ___ (call) if he had had your number.', answer: 'would have called' },
    ],
    quiz: [
      { question: 'If you ___ (come) earlier, you would have met her.', options: ['came', 'come', 'had come', 'would come'], answer: 'had come' },
      { question: 'She wouldn\'t have failed if she ___ (study).', options: ['studied', 'had studied', 'has studied', 'would study'], answer: 'had studied' },
      { question: '"If I had known" — это прошедшее совершенное (Past Perfect)?', options: ['Нет', 'Да', 'Только для I', 'Только в вопросах'], answer: 'Да' },
      { question: 'Результат в Third Conditional:', options: ['will + verb', 'would + verb', 'would have + participle', 'had + participle'], answer: 'would have + participle' },
      { question: 'If we ___ (not take) a taxi, we would have missed the flight.', options: ['didn\'t take', 'don\'t take', 'hadn\'t taken', 'wouldn\'t take'], answer: 'hadn\'t taken' },
    ],
  },

  {
    id: 'b1-1-54', level: 'B1', block: 1, blockName: 'Сложные условия', order: 54,
    title: 'Mixed Conditionals', duration: '15 мин',
    theory: {
      explanation: 'Mixed Conditional = смешивание времён в условных предложениях.\n\nТип 1: Прошлое → настоящий результат\nIf + Past Perfect → would + verb (сейчас)\nIf I had studied medicine, I would be a doctor now.\n\nТип 2: Настоящее → прошлый результат\nIf + Past Simple → would have + past participle\nIf I weren\'t so lazy, I would have finished it yesterday.',
      examples: [
        { english: 'If I had taken that job, I would be living in Paris now.', russian: 'Если бы я взял(а) ту работу, сейчас жил(а) бы в Париже.' },
        { english: 'If she weren\'t so shy, she would have spoken to him.', russian: 'Если бы она не была такой застенчивой, она бы поговорила с ним.' },
        { english: 'If I had studied harder, I would have more options now.', russian: 'Если бы я учился(ась) усерднее, сейчас у меня было бы больше возможностей.' },
        { english: 'If he were braver, he would have asked her out.', russian: 'Если бы он был храбрее, он бы пригласил её на свидание.' },
        { english: 'If I had saved more money, I could afford this now.', russian: 'Если бы я откладывал(а) больше денег, сейчас мог(ла) бы себе это позволить.' },
        { english: 'She would have applied if she knew about the job.', russian: 'Она бы подала заявку, если бы знала об этой работе.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"If I had slept more, I wouldn\'t be so tired now." — тип смешанного условного:', options: ['Прошлое → настоящее', 'Настоящее → прошлое', 'Оба настоящие', 'Оба прошлые'], answer: 'Прошлое → настоящее' },
      { type: 'fill_blank', question: 'If I ___ (study) law, I would be a lawyer now.', answer: 'had studied' },
      { type: 'fill_blank', question: 'If she weren\'t so busy, she ___ (help) yesterday.', answer: 'would have helped' },
      { type: 'multiple_choice', question: 'Mixed Conditional позволяет...', options: ['использовать только Past Simple', 'смешивать времена из разных условных', 'избегать would', 'только описывать будущее'], answer: 'смешивать времена из разных условных' },
      { type: 'multiple_choice', question: 'Если результат = сейчас, используй в главном предложении:', options: ['would have + pp', 'would + verb', 'will + verb', 'might have + pp'], answer: 'would + verb' },
    ],
    quiz: [
      { question: 'If he had worked harder, he ___ (be) CEO now.', options: ['would be', 'would have been', 'will be', 'had been'], answer: 'would be' },
      { question: 'If I ___ (not be) so impatient, I would have waited.', options: ['wasn\'t', 'aren\'t', 'weren\'t', 'hadn\'t been'], answer: 'weren\'t' },
      { question: 'Смешанное условное: прошлая причина → настоящий результат — структура:', options: ['If + PS, would + verb', 'If + PP, would + verb', 'If + PP, would have + pp', 'If + PS, would have + pp'], answer: 'If + PP, would + verb' },
      { question: 'She would know the answer if she ___ (study) harder.', options: ['studied', 'had studied', 'studies', 'would study'], answer: 'had studied' },
      { question: 'If I ___ (be) taller, I would have become a model.', options: ['was', 'were', 'had been', 'am'], answer: 'were' },
    ],
  },

  {
    id: 'b1-1-55', level: 'B1', block: 1, blockName: 'Сложные условия', order: 55,
    title: 'I wish / If only', duration: '15 мин',
    theory: {
      explanation: 'I WISH / IF ONLY = сожаление и желание иных обстоятельств.\n\n• Настоящее нереальное: wish + Past Simple\n  I wish I knew the answer. (не знаю)\n• Прошлое нереальное: wish + Past Perfect\n  I wish I hadn\'t said that. (уже сказал — сожалею)\n• Желание изменить: wish + would\n  I wish it would stop raining. (раздражение, просьба к изменению)\n\nIF ONLY = более сильное выражение того же.',
      examples: [
        { english: 'I wish I could speak Chinese.', russian: 'Жаль, что я не умею говорить по-китайски.' },
        { english: 'I wish I hadn\'t eaten so much.', russian: 'Жаль, что я столько съел(а).' },
        { english: 'If only I had more time!', russian: 'Если бы только у меня было больше времени!' },
        { english: 'I wish you would stop making noise.', russian: 'Хотел(а) бы, чтобы ты перестал(а) шуметь.' },
        { english: 'If only I had known then what I know now.', russian: 'Если бы только я тогда знал(а) то, что знаю сейчас.' },
        { english: 'She wishes she hadn\'t quit her job.', russian: 'Она сожалеет, что ушла с работы.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I wish I ___ (know) the answer.', answer: 'knew', hint: 'настоящее нереальное: wish + Past Simple' },
      { type: 'fill_blank', question: 'I wish I ___ (not say) that. (прошлое сожаление)', answer: 'hadn\'t said', hint: 'прошлое: wish + Past Perfect' },
      { type: 'multiple_choice', question: '"I wish it would stop raining" выражает...', options: ['прошлое сожаление', 'раздражение / желание изменения', 'нереальное настоящее умение', 'условие'], answer: 'раздражение / желание изменения' },
      { type: 'multiple_choice', question: '"If only" по значению...', options: ['слабее чем wish', 'то же что wish, но сильнее', 'совершенно другое', 'используется только в прошлом'], answer: 'то же что wish, но сильнее' },
      { type: 'fill_blank', question: 'If only I ___ (study) harder at school!', answer: 'had studied' },
    ],
    quiz: [
      { question: 'I wish I ___ (be) taller. (сейчас)', options: ['am', 'was', 'were', 'have been'], answer: 'were' },
      { question: 'I wish I ___ (not eat) that cake. (прошлое)', options: ['didn\'t eat', 'hadn\'t eaten', 'don\'t eat', 'wouldn\'t eat'], answer: 'hadn\'t eaten' },
      { question: 'I wish you ___ (stop) talking! (раздражение)', options: ['stop', 'stopped', 'would stop', 'had stopped'], answer: 'would stop' },
      { question: 'If only = ...', options: ['более слабая форма wish', 'более сильная форма wish', 'форма unless', 'форма although'], answer: 'более сильная форма wish' },
      { question: 'She wishes she ___ (take) that job. (прошлое)', options: ['takes', 'took', 'had taken', 'would take'], answer: 'had taken' },
    ],
  },


  // ── B1 Block 2: Прошлое совершенное ─────────────────────────────────────────
  {
    id: 'b1-2-56', level: 'B1', block: 2, blockName: 'Прошлое совершенное', order: 56,
    title: 'Past Perfect', duration: '15 мин',
    theory: {
      explanation: 'Past Perfect = действие, завершённое РАНЬШЕ другого прошлого действия.\nФорма: had + Past Participle (для всех лиц).\n\nI had already eaten when she arrived.\n(Сначала — поел; потом — она пришла)\n\nОтрицание: hadn\'t + PP\nВопрос: Had you...?\nЧасто используется с: before, after, when, already, just, never, by the time.',
      examples: [
        { english: 'When I arrived, the film had already started.', russian: 'Когда я пришёл(ла), фильм уже начался.' },
        { english: 'She had never flown before her trip to London.', russian: 'До своей поездки в Лондон она никогда не летала.' },
        { english: 'He had finished his homework before dinner.', russian: 'Он сделал домашнее задание до ужина.' },
        { english: 'By the time we arrived, they had left.', russian: 'К тому времени, как мы приехали, они уже ушли.' },
        { english: 'I hadn\'t seen her since school.', russian: 'Я не видел(а) её со школы.' },
        { english: 'Had you met him before the party?', russian: 'Ты встречал(а) его до вечеринки?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'When I arrived, she ___ (leave) already.', answer: 'had already left', hint: 'действие, произошедшее раньше = Past Perfect' },
      { type: 'fill_blank', question: 'He ___ (never/see) snow before.', answer: 'had never seen' },
      { type: 'multiple_choice', question: 'By the time we arrived, the film ___ (start).', options: ['started', 'has started', 'had started', 'was starting'], answer: 'had started' },
      { type: 'multiple_choice', question: 'Past Perfect = had + ...', options: ['V1 (base form)', 'V2 (past simple)', 'V3 (past participle)', '-ing form'], answer: 'V3 (past participle)' },
      { type: 'fill_blank', question: '___ you finished before she called?', answer: 'Had' },
    ],
    quiz: [
      { question: 'She ___ (eat) before the party.', options: ['ate', 'has eaten', 'had eaten', 'was eating'], answer: 'had eaten' },
      { question: 'I realized I ___ (forget) my keys.', options: ['forgot', 'have forgotten', 'had forgotten', 'was forgetting'], answer: 'had forgotten' },
      { question: 'По времени: Past Perfect происходит ___ Past Simple.', options: ['после', 'одновременно с', 'до', 'вместо'], answer: 'до' },
      { question: '___ she ever visited Italy before 2020?', options: ['Did', 'Has', 'Had', 'Was'], answer: 'Had' },
      { question: 'When he called, I ___ (already finish) the report.', options: ['already finished', 'have already finished', 'had already finished', 'already finishing'], answer: 'had already finished' },
    ],
  },

  {
    id: 'b1-2-57', level: 'B1', block: 2, blockName: 'Прошлое совершенное', order: 57,
    title: 'Past Perfect vs Past Simple', duration: '15 мин',
    theory: {
      explanation: 'Когда в предложении ДВА прошлых действия, используй:\n• Past Perfect (had + PP) — для БОЛЕЕ РАННЕГО действия\n• Past Simple (V2) — для БОЛЕЕ ПОЗДНЕГО действия\n\nWhen I arrived (PS), she had already left (PP).\n(Сначала ушла, потом я пришёл(ла))\n\nЕсли последовательность очевидна (after/before), Past Perfect необязателен.',
      examples: [
        { english: 'After she had finished work, she went home.', russian: 'После того как она закончила работу, она пошла домой.' },
        { english: 'I was tired because I had worked all day.', russian: 'Я устал(а), потому что работал(а) весь день.' },
        { english: 'She opened the box that she had received the day before.', russian: 'Она открыла коробку, которую получила накануне.' },
        { english: 'He told me that he had lost his job.', russian: 'Он сказал мне, что потерял работу.' },
        { english: 'When they arrived at the station, the train had left.', russian: 'Когда они приехали на станцию, поезд уже ушёл.' },
        { english: 'I recognised her because we had met before.', russian: 'Я узнал(а) её, потому что мы встречались раньше.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'When I got home, my family ___ (eat) dinner.', options: ['ate', 'was eating', 'had eaten', 'has eaten'], answer: 'had eaten' },
      { type: 'fill_blank', question: 'She was happy because she ___ (pass) her exam.', answer: 'had passed' },
      { type: 'multiple_choice', question: 'I bought the dress that I ___ (see) in the window.', options: ['saw', 'had seen', 'see', 'have seen'], answer: 'had seen' },
      { type: 'fill_blank', question: 'After he ___ (read) the letter, he called her.', answer: 'had read' },
      { type: 'multiple_choice', question: 'Какое действие произошло ПЕРВЫМ? "When I arrived, they had already eaten."', options: ['I arrived', 'They ate', 'Одновременно', 'Невозможно определить'], answer: 'They ate' },
    ],
    quiz: [
      { question: 'She was sad because she ___ (fail) the test.', options: ['failed', 'has failed', 'had failed', 'was failing'], answer: 'had failed' },
      { question: 'I recognized him because I ___ (see) his photo.', options: ['saw', 'had seen', 'have seen', 'see'], answer: 'had seen' },
      { question: 'When he arrived, we ___ (start) eating.', options: ['start', 'had started', 'have started', 'started'], answer: 'had started' },
      { question: 'He said he ___ (lose) his wallet.', options: ['lost', 'had lost', 'has lost', 'was losing'], answer: 'had lost' },
      { question: 'Past Perfect маркирует ___ из двух прошлых действий.', options: ['более позднее', 'одновременное', 'более раннее', 'текущее'], answer: 'более раннее' },
    ],
  },

  {
    id: 'b1-2-58', level: 'B1', block: 2, blockName: 'Прошлое совершенное', order: 58,
    title: 'Past Perfect Progressive', duration: '15 мин',
    theory: {
      explanation: 'Past Perfect Progressive (Continuous) = действие, которое ПРОДОЛЖАЛОСЬ до определённого момента в прошлом (и, возможно, привело к результату).\nФорма: had been + глагол-ing\n\nShe was tired because she had been working all day.\n(Она устала — потому что весь день работала до этого момента)\n\nУделяет акцент на ДЛИТЕЛЬНОСТИ, а не завершённости.',
      examples: [
        { english: 'He was exhausted because he had been running for two hours.', russian: 'Он был изнурён, потому что бежал два часа.' },
        { english: 'She had been waiting for an hour when he finally arrived.', russian: 'Она ждала час, когда он наконец пришёл.' },
        { english: 'I had been studying all night, so I was tired.', russian: 'Я готовился(лась) всю ночь, поэтому устал(а).' },
        { english: 'They had been arguing when I walked in.', russian: 'Когда я вошёл(ла), они спорили (и до этого спорили).' },
        { english: 'How long had you been waiting?', russian: 'Как долго ты ждал(а)?' },
        { english: 'My eyes were red because I had been crying.', russian: 'Мои глаза были красными, потому что я плакал(а).' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She was tired because she ___ (work) all day.', answer: 'had been working', hint: 'длительность до момента в прошлом' },
      { type: 'multiple_choice', question: 'Past Perfect Progressive акцентирует...', options: ['завершённость действия', 'длительность действия до прошлого момента', 'привычку в прошлом', 'воображаемое прошлое'], answer: 'длительность действия до прошлого момента' },
      { type: 'fill_blank', question: 'He ___ (run) for an hour when he got injured.', answer: 'had been running' },
      { type: 'multiple_choice', question: 'Форма Past Perfect Progressive:', options: ['had + V3', 'was/were + -ing', 'had been + -ing', 'have been + -ing'], answer: 'had been + -ing' },
      { type: 'fill_blank', question: 'How long ___ you ___ (wait) when she arrived?', answer: 'had been waiting' },
    ],
    quiz: [
      { question: 'My hands were dirty because I ___ (garden).', options: ['gardened', 'had gardened', 'had been gardening', 'was gardening'], answer: 'had been gardening' },
      { question: 'He was out of breath because he ___ (run).', options: ['ran', 'had run', 'had been running', 'was running'], answer: 'had been running' },
      { question: 'Past Perfect Prog. = had ___ + verb-ing', options: ['to', 'being', 'been', 'be'], answer: 'been' },
      { question: 'She ___ (cry) — her eyes were red.', options: ['cried', 'had cried', 'had been crying', 'was crying'], answer: 'had been crying' },
      { question: 'How long ___ he been studying before the exam?', options: ['has', 'did', 'had', 'was'], answer: 'had' },
    ],
  },

  {
    id: 'b1-2-59', level: 'B1', block: 2, blockName: 'Прошлое совершенное', order: 59,
    title: 'Narrative tenses', duration: '15 мин',
    theory: {
      explanation: 'Нарративные времена для рассказов о прошлом:\n• Past Simple = основные события по порядку\n• Past Progressive = фоновые действия/обстановка\n• Past Perfect = события РАНЬШЕ основных\n• Past Perfect Progressive = длительный фон РАНЬШЕ основных событий\n\nПример рассказа:\n"It was midnight (PS). Rain was falling (PP cont). I had been waiting for two hours (PPP). Suddenly the door opened (PS) — someone I had met before (PP)."',
      examples: [
        { english: 'It was a dark night. The wind was blowing and I was walking alone.', russian: 'Это была тёмная ночь. Дул ветер, и я шёл(шла) один(одна).' },
        { english: 'Suddenly I saw a figure that I had seen before.', russian: 'Вдруг я увидел(а) фигуру, которую видел(а) раньше.' },
        { english: 'She had been waiting for an hour when the call finally came.', russian: 'Она ждала час, когда наконец пришёл звонок.' },
        { english: 'He opened the letter, read it quickly, and threw it away.', russian: 'Он открыл письмо, быстро прочёл его и выбросил.' },
        { english: 'While she was talking on the phone, he slipped out.', russian: 'Пока она разговаривала по телефону, он выскользнул.' },
        { english: 'By the time help arrived, the fire had spread everywhere.', russian: 'К тому времени, как прибыла помощь, огонь распространился повсюду.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'В рассказе фоновое действие передаётся через:', options: ['Past Simple', 'Past Progressive', 'Past Perfect', 'Past Perfect Progressive'], answer: 'Past Progressive' },
      { type: 'multiple_choice', question: 'Основные события рассказа в порядке:', options: ['Past Perfect', 'Past Progressive', 'Past Simple', 'Past Perfect Progressive'], answer: 'Past Simple' },
      { type: 'fill_blank', question: 'She ___ (walk) home when it started to rain.', answer: 'was walking', hint: 'фоновое действие' },
      { type: 'fill_blank', question: 'By the time I arrived, they ___ (leave).', answer: 'had left', hint: 'более раннее действие' },
      { type: 'multiple_choice', question: '"She was tired because she had been cooking all day" — had been cooking =', options: ['действие до этого момента', 'фоновое действие одновременно', 'основное событие', 'воображаемое прошлое'], answer: 'действие до этого момента' },
    ],
    quiz: [
      { question: 'Какое время для "основных событий рассказа"?', options: ['Past Progressive', 'Past Perfect', 'Past Simple', 'Present Perfect'], answer: 'Past Simple' },
      { question: 'Какое время для "обстановки/фона в прошлом"?', options: ['Past Simple', 'Past Progressive', 'Past Perfect', 'Present Simple'], answer: 'Past Progressive' },
      { question: 'He arrived, ___  (find) the door open.', options: ['found', 'was finding', 'had found', 'finding'], answer: 'found' },
      { question: 'She was exhausted. She ___ (travel) for 20 hours.', options: ['travelled', 'was travelling', 'had been travelling', 'has travelled'], answer: 'had been travelling' },
      { question: '"When I woke up, it had already stopped raining." — Что случилось РАНЬШЕ?', options: ['Я проснулся', 'Дождь прекратился', 'Одновременно', 'Неизвестно'], answer: 'Дождь прекратился' },
    ],
  },

  {
    id: 'b1-2-60', level: 'B1', block: 2, blockName: 'Прошлое совершенное', order: 60,
    title: 'Time expressions review', duration: '15 мин',
    theory: {
      explanation: 'Маркеры времени для прошлого:\n• Past Simple: yesterday, last week/month/year, ago, in 2020, at 5pm, on Monday\n• Past Progressive: while, when, at that moment, all day/night\n• Past Perfect: already, just, never, by the time, when (для более ранних), before, after\n• Past Perfect Progressive: for + period, all day/night (до момента в прошлом)',
      examples: [
        { english: 'She called me yesterday evening.', russian: 'Она позвонила мне вчера вечером.' },
        { english: 'While I was cooking, he arrived.', russian: 'Пока я готовил(а), он пришёл.' },
        { english: 'By the time she arrived, we had eaten.', russian: 'К тому времени, как она пришла, мы уже поели.' },
        { english: 'He had been sleeping for three hours when I woke him.', russian: 'Он спал три часа, когда я его разбудил(а).' },
        { english: 'I had already left when she called.', russian: 'Я уже ушёл(ла), когда она позвонила.' },
        { english: 'We met two years ago at a conference.', russian: 'Мы познакомились два года назад на конференции.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"By the time" используется с:', options: ['Past Simple', 'Past Progressive', 'Past Perfect', 'Present Simple'], answer: 'Past Perfect' },
      { type: 'multiple_choice', question: '"While" вводит:', options: ['основное событие (PS)', 'фоновое действие (PP Cont)', 'более раннее действие (PP)', 'текущее состояние'], answer: 'фоновое действие (PP Cont)' },
      { type: 'fill_blank', question: 'He left ___ years ago.', answer: 'two', hint: 'ago = прошлое' },
      { type: 'multiple_choice', question: '"I had never been abroad before 2015" — время:', options: ['Past Simple', 'Past Progressive', 'Past Perfect', 'Present Perfect'], answer: 'Past Perfect' },
      { type: 'fill_blank', question: 'She ___ (sleep) all day when I called.', answer: 'had been sleeping' },
    ],
    quiz: [
      { question: 'I met him ___ 2018.', options: ['since', 'for', 'in', 'during'], answer: 'in' },
      { question: 'They arrived ___ the party had started.', options: ['while', 'during', 'after', 'before'], answer: 'after' },
      { question: 'By the time I woke up, she ___ (leave).', options: ['left', 'was leaving', 'had left', 'has left'], answer: 'had left' },
      { question: 'While we ___ (eat), the phone rang.', options: ['ate', 'were eating', 'had eaten', 'had been eating'], answer: 'were eating' },
      { question: 'I hadn\'t seen her ___ she was a child.', options: ['for', 'since', 'during', 'when'], answer: 'since' },
    ],
  },


  // ── B1 Block 3: Reported Speech ──────────────────────────────────────────────
  {
    id: 'b1-3-61', level: 'B1', block: 3, blockName: 'Reported Speech', order: 61,
    title: 'Reported Statements', duration: '15 мин',
    theory: {
      explanation: 'Reported Speech (косвенная речь) = передаём чужие слова.\nГлаголы времени СДВИГАЮТСЯ назад:\n• Present Simple → Past Simple\n• Present Progressive → Past Progressive\n• Past Simple → Past Perfect\n• Will → Would\n• Can → Could\n• Must → Had to\n\nМестоимения и наречия времени/места тоже меняются:\nhere → there; now → then; today → that day; tomorrow → the next day',
      examples: [
        { english: '"I love pizza" → She said she loved pizza.', russian: '"Я люблю пиццу" → Она сказала, что любит пиццу.' },
        { english: '"I am working" → He said he was working.', russian: '"Я работаю" → Он сказал, что работает.' },
        { english: '"I will help" → She said she would help.', russian: '"Я помогу" → Она сказала, что поможет.' },
        { english: '"I can swim" → He said he could swim.', russian: '"Я умею плавать" → Он сказал, что умеет плавать.' },
        { english: '"I have finished" → She said she had finished.', russian: '"Я закончила" → Она сказала, что закончила.' },
        { english: '"I must leave now" → He said he had to leave then.', russian: '"Мне нужно уходить сейчас" → Он сказал, что ему нужно было уходить.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: '"I work here." → She said she ___ there.', answer: 'worked', hint: 'Present Simple → Past Simple' },
      { type: 'fill_blank', question: '"I will call you." → He said he ___ call me.', answer: 'would', hint: 'will → would' },
      { type: 'multiple_choice', question: '"I can help." → She said she ___ help.', options: ['can', 'could', 'may', 'might'], answer: 'could' },
      { type: 'multiple_choice', question: '"I am eating." → He said he ___ eating.', options: ['is', 'was', 'were', 'has been'], answer: 'was' },
      { type: 'fill_blank', question: '"I have seen it." → She said she ___ seen it.', answer: 'had' },
    ],
    quiz: [
      { question: '"I love this city." → He said he ___ that city.', options: ['love', 'loves', 'loved', 'had loved'], answer: 'loved' },
      { question: '"We will arrive tomorrow." → They said they ___ arrive the next day.', options: ['will', 'shall', 'would', 'could'], answer: 'would' },
      { question: '"I can\'t come." → She said she ___ come.', options: ['can\'t', 'couldn\'t', 'won\'t', 'mustn\'t'], answer: 'couldn\'t' },
      { question: '"now" в косвенной речи становится...', options: ['today', 'here', 'then', 'soon'], answer: 'then' },
      { question: '"today" в косвенной речи становится...', options: ['this day', 'that day', 'now', 'the next day'], answer: 'that day' },
    ],
  },

  {
    id: 'b1-3-62', level: 'B1', block: 3, blockName: 'Reported Speech', order: 62,
    title: 'Reported Questions', duration: '15 мин',
    theory: {
      explanation: 'Reported Questions (косвенные вопросы):\n1. Общие вопросы (Yes/No): используй if/whether\n   "Are you ready?" → He asked if I was ready.\n2. Специальные вопросы (WH-): используй вопросительное слово\n   "Where do you live?" → She asked where I lived.\n\nВАЖНО: в косвенном вопросе НЕТ инверсии (вспомогательный глагол после подлежащего)!\nПрямой: What ARE you doing?\nКосвенный: She asked what I WAS doing. (не "what was I doing")',
      examples: [
        { english: '"Are you hungry?" → He asked if I was hungry.', russian: '"Ты голоден?" → Он спросил, голоден ли я.' },
        { english: '"Where do you live?" → She asked where I lived.', russian: '"Где ты живёшь?" → Она спросила, где я живу.' },
        { english: '"What time is it?" → He asked what time it was.', russian: '"Который час?" → Он спросил, который час.' },
        { english: '"Can you swim?" → She asked if I could swim.', russian: '"Ты умеешь плавать?" → Она спросила, умею ли я плавать.' },
        { english: '"Did you enjoy it?" → He asked whether I had enjoyed it.', russian: '"Тебе понравилось?" → Он спросил, понравилось ли мне.' },
        { english: '"How long have you been here?" → She asked how long I had been there.', russian: '"Как давно ты здесь?" → Она спросила, как давно я там.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: '"Are you tired?" → He asked ___ I was tired.', answer: 'if', hint: 'Yes/No вопрос → if/whether' },
      { type: 'fill_blank', question: '"Where do you live?" → She asked where I ___.', answer: 'lived', hint: 'Present Simple → Past Simple' },
      { type: 'multiple_choice', question: '"What are you doing?" → He asked what I ___ doing.', options: ['am', 'was', 'were', 'are'], answer: 'was' },
      { type: 'multiple_choice', question: 'В косвенном вопросе используется...', options: ['инверсия (глагол перед подлежащим)', 'прямой порядок слов (подлежащее перед глаголом)', 'вопросительный знак', 'только whether'], answer: 'прямой порядок слов (подлежащее перед глаголом)' },
      { type: 'fill_blank', question: '"Can you help?" → She asked ___ I could help.', answer: 'if' },
    ],
    quiz: [
      { question: '"Do you like coffee?" → He asked ___ I liked coffee.', options: ['that', 'what', 'if', 'how'], answer: 'if' },
      { question: '"Where is she?" → He asked where she ___.', options: ['is', 'was', 'were', 'has been'], answer: 'was' },
      { question: '"How old are you?" → She asked how old I ___.', options: ['am', 'was', 'were', 'had been'], answer: 'was' },
      { question: '"Did you call?" → He asked ___ I had called.', options: ['that', 'what', 'whether', 'which'], answer: 'whether' },
      { question: 'Прямой вопрос: "What time IS it?" → Косвенный: She asked what time it ___', options: ['is', 'was', 'were', 'had been'], answer: 'was' },
    ],
  },

  {
    id: 'b1-3-63', level: 'B1', block: 3, blockName: 'Reported Speech', order: 63,
    title: 'Reported Commands', duration: '15 мин',
    theory: {
      explanation: 'Reported Commands/Requests (косвенные команды и просьбы):\nПрямая: "Sit down!" / "Please help me."\nКосвенная: He told me to sit down. / She asked me to help her.\n\nСтруктура: verb + object + to + infinitive\ntold = команда; asked = просьба\nОтрицание: told/asked + not to + infinitive\n"Don\'t be late!" → He told me not to be late.',
      examples: [
        { english: '"Sit down!" → He told me to sit down.', russian: '"Садитесь!" → Он сказал мне сесть.' },
        { english: '"Please help me." → She asked me to help her.', russian: '"Помоги мне, пожалуйста." → Она попросила меня помочь ей.' },
        { english: '"Don\'t be late!" → He told me not to be late.', russian: '"Не опаздывай!" → Он сказал мне не опаздывать.' },
        { english: '"Could you open the window?" → She asked him to open the window.', russian: '"Не могли бы вы открыть окно?" → Она попросила его открыть окно.' },
        { english: '"Don\'t touch that!" → He told the children not to touch it.', russian: '"Не трогайте это!" → Он сказал детям не трогать это.' },
        { english: '"Please stop talking." → The teacher asked us to stop talking.', russian: '"Пожалуйста, прекратите разговаривать." → Учитель попросил нас прекратить разговаривать.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: '"Go away!" → He told her ___ go away.', answer: 'to', hint: 'told + object + to + infinitive' },
      { type: 'fill_blank', question: '"Please wait." → She asked me ___ wait.', answer: 'to' },
      { type: 'multiple_choice', question: '"Don\'t worry!" → He told me ___ worry.', options: ['to not', 'not to', 'don\'t', 'not'], answer: 'not to' },
      { type: 'multiple_choice', question: '"Told" используется для...', options: ['просьб', 'команд', 'вопросов', 'предположений'], answer: 'команд' },
      { type: 'multiple_choice', question: '"Asked" используется для...', options: ['команд', 'предположений', 'просьб', 'отказов'], answer: 'просьб' },
    ],
    quiz: [
      { question: '"Be quiet!" → She told us ___ quiet.', options: ['be', 'to be', 'not to be', 'being'], answer: 'to be' },
      { question: '"Please don\'t smoke." → He asked her ___ smoke.', options: ['to not', 'not to', 'don\'t', 'not'], answer: 'not to' },
      { question: '"Come here." → She told him ___ there.', options: ['come', 'coming', 'to come', 'came'], answer: 'to come' },
      { question: 'Структура косвенной команды:', options: ['told + to + inf', 'told + obj + to + inf', 'told + obj + inf', 'told that + clause'], answer: 'told + obj + to + inf' },
      { question: '"Don\'t leave!" → He told her ___ leave.', options: ['to not', 'not to', 'don\'t', 'no to'], answer: 'not to' },
    ],
  },

  {
    id: 'b1-3-64', level: 'B1', block: 3, blockName: 'Reported Speech', order: 64,
    title: 'Say vs Tell', duration: '15 мин',
    theory: {
      explanation: 'SAY vs TELL:\nSAY = говорить (без указания кому, или с to)\n  She said (to me) that she was tired.\nTELL = говорить кому-то (ОБЯЗАТЕЛЬНО нужен объект — кому говорят)\n  She told me that she was tired.\n\nSay + (to + person) + that\nTell + person + that\n\nТакже tell используется в: tell the truth, tell a lie, tell a story, tell the time.',
      examples: [
        { english: 'She said she was tired.', russian: 'Она сказала, что устала.' },
        { english: 'She said to me that she was tired.', russian: 'Она сказала мне, что устала.' },
        { english: 'She told me she was tired.', russian: 'Она сказала мне, что устала.' },
        { english: 'He said goodbye and left.', russian: 'Он попрощался и ушёл.' },
        { english: 'Can you tell me the time?', russian: 'Можете сказать мне, который час?' },
        { english: 'He told the children a bedtime story.', russian: 'Он рассказал детям сказку на ночь.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'She ___ me she was busy.', options: ['said', 'told', 'spoke', 'talked'], answer: 'told' },
      { type: 'multiple_choice', question: 'He ___ that he would come.', options: ['told', 'said', 'asked', 'spoke'], answer: 'said' },
      { type: 'fill_blank', question: 'She ___ to me that she was leaving.', answer: 'said' },
      { type: 'multiple_choice', question: '"Tell" требует...', options: ['that + clause', 'объект (кому говорят)', 'вопросительного слова', 'отрицания'], answer: 'объект (кому говорят)' },
      { type: 'fill_blank', question: 'Can you ___ me the way to the station?', answer: 'tell' },
    ],
    quiz: [
      { question: 'She ___ me her name.', options: ['said', 'told', 'spoke', 'talked'], answer: 'told' },
      { question: 'He ___ he was sorry.', options: ['told', 'said', 'asked', 'claimed'], answer: 'said' },
      { question: 'She ___ to him that she needed help.', options: ['told', 'said', 'spoke', 'claimed'], answer: 'said' },
      { question: 'He ___ the truth.', options: ['said', 'told', 'spoke', 'talked'], answer: 'told' },
      { question: '"Tell" без объекта — это...', options: ['правильно', 'допустимо с to', 'неправильно (нужен объект)', 'допустимо только в вопросах'], answer: 'неправильно (нужен объект)' },
    ],
  },

  {
    id: 'b1-3-65', level: 'B1', block: 3, blockName: 'Reported Speech', order: 65,
    title: 'Reporting verbs', duration: '15 мин',
    theory: {
      explanation: 'Глаголы репортажной речи (кроме say/tell):\n• admit + -ing: He admitted stealing it.\n• deny + -ing: She denied knowing him.\n• suggest + -ing: He suggested going out.\n• promise + to + inf: She promised to help.\n• refuse + to + inf: He refused to answer.\n• agree + to + inf: She agreed to come.\n• warn + obj + not to: He warned me not to go.\n• advise + obj + to: She advised me to study.',
      examples: [
        { english: 'He admitted breaking the window.', russian: 'Он признался, что разбил окно.' },
        { english: 'She denied taking the money.', russian: 'Она отрицала, что взяла деньги.' },
        { english: 'He suggested going to a café.', russian: 'Он предложил пойти в кафе.' },
        { english: 'She promised to call later.', russian: 'Она пообещала позвонить позже.' },
        { english: 'He refused to answer the question.', russian: 'Он отказался отвечать на вопрос.' },
        { english: 'She advised me to see a doctor.', russian: 'Она посоветовала мне обратиться к врачу.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"I broke it!" → He admitted ___ it.', options: ['break', 'to break', 'breaking', 'broke'], answer: 'breaking' },
      { type: 'multiple_choice', question: '"Let\'s go out!" → He suggested ___ out.', options: ['go', 'to go', 'going', 'went'], answer: 'going' },
      { type: 'multiple_choice', question: '"I will help." → She promised ___ help.', options: ['help', 'to help', 'helping', 'helped'], answer: 'to help' },
      { type: 'multiple_choice', question: '"Don\'t go there!" → He warned me ___ go.', options: ['to not', 'not to', 'don\'t', 'to'], answer: 'not to' },
      { type: 'fill_blank', question: '"I didn\'t do it!" → She denied ___ it.', answer: 'doing', hint: 'deny + -ing' },
    ],
    quiz: [
      { question: 'She ___ (refuse) to answer. Структура refuse:', options: ['refuse + -ing', 'refuse + to + inf', 'refuse + that', 'refuse + obj'], answer: 'refuse + to + inf' },
      { question: 'He admitted ___ the exam.', options: ['to fail', 'failing', 'that failed', 'fail'], answer: 'failing' },
      { question: 'She suggested ___ to the cinema.', options: ['go', 'to go', 'going', 'that go'], answer: 'going' },
      { question: 'He agreed ___ help.', options: ['helping', 'help', 'to help', 'that help'], answer: 'to help' },
      { question: 'She advised me ___ more water.', options: ['drink', 'drinking', 'to drink', 'that I drink'], answer: 'to drink' },
    ],
  },


  // ── B1 Block 4: Пассивный залог ──────────────────────────────────────────────
  {
    id: 'b1-4-66', level: 'B1', block: 4, blockName: 'Пассивный залог', order: 66,
    title: 'Present & Past Passive', duration: '15 мин',
    theory: {
      explanation: 'Пассивный залог: субъект получает действие, а не совершает его.\nФорма: be + Past Participle\n\nPresent Simple Passive: am/is/are + V3\n  The letter is written. (Письмо пишется.)\nPast Simple Passive: was/were + V3\n  The letter was written. (Письмо было написано.)\n\nАктивный: Shakespeare wrote Hamlet.\nПассивный: Hamlet was written by Shakespeare.',
      examples: [
        { english: 'English is spoken in many countries.', russian: 'На английском говорят во многих странах.' },
        { english: 'The Eiffel Tower was built in 1889.', russian: 'Эйфелева башня была построена в 1889 году.' },
        { english: 'The car is repaired every year.', russian: 'Машину ремонтируют каждый год.' },
        { english: 'The book was written by Tolstoy.', russian: 'Книга была написана Толстым.' },
        { english: 'Millions of emails are sent every day.', russian: 'Каждый день отправляются миллионы электронных писем.' },
        { english: 'The window was broken yesterday.', russian: 'Вчера окно было разбито.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'The report ___ (write) every week.', answer: 'is written', hint: 'Present Simple Passive: is/are + V3' },
      { type: 'fill_blank', question: 'The pyramid ___ (build) by ancient Egyptians.', answer: 'was built', hint: 'Past Simple Passive: was/were + V3' },
      { type: 'multiple_choice', question: 'Active: "They make cars here." → Passive:', options: ['Cars make here.', 'Cars are made here.', 'Cars were made here.', 'Cars made here.'], answer: 'Cars are made here.' },
      { type: 'multiple_choice', question: '"By" в пассивном залоге указывает на...', options: ['место', 'время', 'деятеля (кто сделал)', 'результат'], answer: 'деятеля (кто сделал)' },
      { type: 'fill_blank', question: 'The match ___ (cancel) because of the rain.', answer: 'was cancelled' },
    ],
    quiz: [
      { question: 'Passive Voice: be + ...', options: ['infinitive', 'present participle (-ing)', 'past participle (V3)', 'base form'], answer: 'past participle (V3)' },
      { question: 'The new bridge ___ (open) last month.', options: ['opens', 'is opened', 'was opened', 'opened'], answer: 'was opened' },
      { question: 'Rice ___ (grow) in Asia.', options: ['grows', 'is grown', 'was grown', 'grew'], answer: 'is grown' },
      { question: 'Active: "They built this church in 1600." → Passive:', options: ['This church was built in 1600.', 'This church is built in 1600.', 'This church builds in 1600.', 'This church built in 1600.'], answer: 'This church was built in 1600.' },
      { question: 'Когда используется пассивный залог?', options: ['Когда деятель важнее', 'Когда действие важнее деятеля', 'Только в прошедшем времени', 'Только в вопросах'], answer: 'Когда действие важнее деятеля' },
    ],
  },

  {
    id: 'b1-4-67', level: 'B1', block: 4, blockName: 'Пассивный залог', order: 67,
    title: 'Future & Perfect Passive', duration: '15 мин',
    theory: {
      explanation: 'Пассивный залог в других временах:\n\nFuture Passive: will be + V3\n  The letter will be sent tomorrow.\n\nPresent Perfect Passive: has/have been + V3\n  The report has been finished.\n\nPast Perfect Passive: had been + V3\n  The work had been completed before I arrived.\n\nModal Passive: modal + be + V3\n  The rules must be followed.',
      examples: [
        { english: 'The new stadium will be opened next year.', russian: 'Новый стадион будет открыт в следующем году.' },
        { english: 'The email has been sent.', russian: 'Письмо было отправлено (и уже готово).' },
        { english: 'The contract had been signed before the meeting.', russian: 'Контракт был подписан до встречи.' },
        { english: 'The rules must be followed.', russian: 'Правила должны соблюдаться.' },
        { english: 'Mistakes can be corrected.', russian: 'Ошибки можно исправить.' },
        { english: 'The building should be renovated.', russian: 'Здание следует отремонтировать.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'The house ___ (sell) next month.', answer: 'will be sold', hint: 'Future Passive: will be + V3' },
      { type: 'fill_blank', question: 'The report ___ (finish) already.', answer: 'has been finished', hint: 'Present Perfect Passive: has/have been + V3' },
      { type: 'multiple_choice', question: 'Modal Passive: "Правила должны соблюдаться."', options: ['Rules must follow.', 'Rules must be followed.', 'Rules are must followed.', 'Rules must been followed.'], answer: 'Rules must be followed.' },
      { type: 'fill_blank', question: 'The work ___ (complete) before the deadline.', answer: 'had been completed', hint: 'Past Perfect Passive' },
      { type: 'multiple_choice', question: 'Present Perfect Passive = has/have + ___ + V3', options: ['to', 'be', 'been', 'being'], answer: 'been' },
    ],
    quiz: [
      { question: 'The decision ___ (make) soon.', options: ['makes', 'is made', 'will be made', 'will make'], answer: 'will be made' },
      { question: 'All the tickets ___ (sell).', options: ['have been sold', 'has been sold', 'were selling', 'sold'], answer: 'have been sold' },
      { question: 'Future Passive = will ___ + V3', options: ['be', 'been', 'being', 'to be'], answer: 'be' },
      { question: 'Mistakes ___ (can/correct).', options: ['can correct', 'can be corrected', 'can corrected', 'can being corrected'], answer: 'can be corrected' },
      { question: 'The letter ___ (send) before she arrived.', options: ['was sent', 'had been sent', 'has been sent', 'will be sent'], answer: 'had been sent' },
    ],
  },

  {
    id: 'b1-4-68', level: 'B1', block: 4, blockName: 'Пассивный залог', order: 68,
    title: 'Active vs Passive choice', duration: '15 мин',
    theory: {
      explanation: 'Когда использовать пассивный залог?\n1. Деятель неизвестен: My car was stolen.\n2. Деятель очевиден или неважен: The road is being repaired.\n3. В официальных/формальных текстах: Applications must be submitted by Friday.\n4. Чтобы акцентировать объект: The Mona Lisa was painted by da Vinci.\n\nАктивный залог — более прямой и разговорный стиль.',
      examples: [
        { english: 'Active: Shakespeare wrote Hamlet. (автор важен)', russian: 'Активный: Шекспир написал Гамлета. (автор важен)' },
        { english: 'Passive: Hamlet was written in 1600. (время важнее автора)', russian: 'Пассивный: Гамлет был написан в 1600 году. (время важнее автора)' },
        { english: 'My wallet was stolen! (кто — неизвестно)', russian: 'Мой кошелёк украли! (кто — неизвестно)' },
        { english: 'The meeting has been cancelled. (официальное)', russian: 'Встреча отменена. (официальное)' },
        { english: 'Taxes must be paid by April. (официальное)', russian: 'Налоги должны быть уплачены к апрелю. (официальное)' },
        { english: 'I was told by my boss to work harder.', russian: 'Мой начальник сказал мне работать усерднее.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"My bike ___ last night." (кто — неизвестно)', options: ['Someone stole', 'was stolen', 'has stolen', 'stole'], answer: 'was stolen' },
      { type: 'multiple_choice', question: 'В каком случае лучше использовать пассивный залог?', options: ['В разговорной речи', 'Когда деятель важен', 'Когда деятель неизвестен/неважен', 'Всегда'], answer: 'Когда деятель неизвестен/неважен' },
      { type: 'multiple_choice', question: 'Активный: "They are building a new road." → Пассивный:', options: ['A new road is built.', 'A new road is being built.', 'A new road was built.', 'A new road will be built.'], answer: 'A new road is being built.' },
      { type: 'fill_blank', question: 'The results ___ (announce) tomorrow.', answer: 'will be announced' },
      { type: 'multiple_choice', question: '"Hamlet ___ by Shakespeare." Правильный вариант:', options: ['writes', 'was writing', 'was written', 'has written'], answer: 'was written' },
    ],
    quiz: [
      { question: '"My phone ___ (steal)!" Используй пассивный (неизвестен кто):', options: ['My phone stole!', 'My phone was stolen!', 'My phone stolen!', 'My phone is stealing!'], answer: 'My phone was stolen!' },
      { question: 'Активный vs пассивный: активный — более...', options: ['официальный', 'прямой и разговорный', 'формальный', 'сложный'], answer: 'прямой и разговорный' },
      { question: 'Present Progressive Passive: am/is/are + ___ + V3', options: ['been', 'being', 'be', 'to be'], answer: 'being' },
      { question: '"English ___ in Australia." (говорят / очевидно кто)', options: ['speaks', 'is spoken', 'was spoken', 'spoke'], answer: 'is spoken' },
      { question: '"Applications must be submitted" — это пример...', options: ['разговорного стиля', 'официального стиля с пассивом', 'неправильного пассива', 'активного залога'], answer: 'официального стиля с пассивом' },
    ],
  },

  {
    id: 'b1-4-69', level: 'B1', block: 4, blockName: 'Пассивный залог', order: 69,
    title: 'Causative have/get', duration: '15 мин',
    theory: {
      explanation: 'Causative = кто-то делает что-то ДЛЯ тебя (ты заказываешь услугу).\n\nHAVE + object + past participle:\nI had my hair cut. (Мне подстригли волосы.)\nShe had her car repaired. (Ей починили машину.)\n\nGET + object + past participle (более разговорный):\nI got my hair cut.\n\nNote: ты не делаешь сам — ты организуешь, чтобы кто-то другой сделал.',
      examples: [
        { english: 'I had my hair cut yesterday.', russian: 'Вчера мне подстригли волосы.' },
        { english: 'She had her car serviced.', russian: 'Ей сделали техническое обслуживание машины.' },
        { english: 'We had the house painted.', russian: 'Нам покрасили дом.' },
        { english: 'I got my phone repaired.', russian: 'Мне починили телефон.' },
        { english: 'He had his suit dry-cleaned.', russian: 'Он сдал костюм в химчистку.' },
        { english: 'She gets her nails done every week.', russian: 'Она делает маникюр каждую неделю.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'I had my photo ___.', options: ['take', 'took', 'taking', 'taken'], answer: 'taken' },
      { type: 'fill_blank', question: 'She ___ her house painted. (causative have)', answer: 'had' },
      { type: 'multiple_choice', question: '"I had my hair cut" означает...', options: ['Я сам(а) подстриг(ла) волосы.', 'Мне подстригли волосы.', 'Я хотел(а) подстричь волосы.', 'Волосы были длинными.'], answer: 'Мне подстригли волосы.' },
      { type: 'multiple_choice', question: 'Have/Get causative: have + obj + ...', options: ['infinitive', 'past simple', 'past participle', '-ing form'], answer: 'past participle' },
      { type: 'fill_blank', question: 'He got his teeth ___ (check).', answer: 'checked' },
    ],
    quiz: [
      { question: 'I need to have my car ___.', options: ['repair', 'repaired', 'repairing', 'to repair'], answer: 'repaired' },
      { question: '"She had her house cleaned" означает...', options: ['Она убрала дом сама.', 'Ей убрали дом.', 'Дом был чистым.', 'Она чистила дом.'], answer: 'Ей убрали дом.' },
      { question: 'Causative с get (разговорный): I got my phone ___.', options: ['fix', 'to fix', 'fixing', 'fixed'], answer: 'fixed' },
      { question: 'Causative have структура:', options: ['have + to + inf', 'have + obj + V3', 'have + obj + -ing', 'have + been + V3'], answer: 'have + obj + V3' },
      { question: 'She ___ her portrait painted. (causative)', options: ['made', 'got', 'took', 'did'], answer: 'got' },
    ],
  },

  {
    id: 'b1-4-70', level: 'B1', block: 4, blockName: 'Пассивный залог', order: 70,
    title: 'Passive review', duration: '15 мин',
    theory: {
      explanation: 'Пассивный залог — итоговое повторение:\n• Present: is/are + V3\n• Past: was/were + V3\n• Future: will be + V3\n• Present Perfect: has/have been + V3\n• Past Perfect: had been + V3\n• Modal: must/can/should + be + V3\n• Present Progressive: is/are being + V3\n• Causative: have/get + obj + V3',
      examples: [
        { english: 'The report is written by the manager.', russian: 'Отчёт пишется менеджером.' },
        { english: 'The work will be finished soon.', russian: 'Работа будет завершена скоро.' },
        { english: 'The bridge has been repaired.', russian: 'Мост был отремонтирован.' },
        { english: 'The rules must be obeyed.', russian: 'Правила должны соблюдаться.' },
        { english: 'The road is being built.', russian: 'Дорога строится (прямо сейчас).' },
        { english: 'She had her dress made.', russian: 'Ей сшили платье.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Present Progressive Passive: The road ___ (fix).', options: ['is fixed', 'is being fixed', 'was being fixed', 'is fixing'], answer: 'is being fixed' },
      { type: 'fill_blank', question: 'The letter ___ (send) yesterday.', answer: 'was sent' },
      { type: 'multiple_choice', question: 'Future Passive: The results ___ (announce) tomorrow.', options: ['announce', 'will announce', 'will be announced', 'are announced'], answer: 'will be announced' },
      { type: 'fill_blank', question: 'The work ___ (complete) by Friday. (must)', answer: 'must be completed' },
      { type: 'fill_blank', question: 'She had her hair ___ (cut).', answer: 'cut' },
    ],
    quiz: [
      { question: 'Modal Passive: "The form ___ fill in."', options: ['must fill in', 'must be filled in', 'must filling in', 'must filled in'], answer: 'must be filled in' },
      { question: 'Present Perfect Passive: The email ___ (send).', options: ['is sent', 'was sent', 'has been sent', 'had been sent'], answer: 'has been sent' },
      { question: 'Causative: I ___ my car serviced. (have)', options: ['made', 'had', 'got to', 'did'], answer: 'had' },
      { question: 'Past Passive: The house ___ (build) in 1905.', options: ['builds', 'is built', 'was built', 'has been built'], answer: 'was built' },
      { question: 'Passive focus is on...', options: ['the agent (who does)', 'the action/result', 'the time', 'the manner'], answer: 'the action/result' },
    ],
  },


  // ── B1 Block 5: Модальные для вывода ────────────────────────────────────────
  {
    id: 'b1-5-71', level: 'B1', block: 5, blockName: 'Модальные для вывода', order: 71,
    title: 'Must / Can\'t (deduction)', duration: '15 мин',
    theory: {
      explanation: 'Модальные глаголы для ВЫВОДА (логического умозаключения):\n\nMUST = почти уверен, что это так (логический вывод)\n  She must be tired — she worked all day. (я уверен)\n\nCAN\'T = почти уверен, что это НЕ ТАК (отрицательный вывод)\n  He can\'t be at home — I saw him at the office.',
      examples: [
        { english: 'She must be tired — she looks exhausted.', russian: 'Она, должно быть, устала — выглядит изнурённой.' },
        { english: 'He can\'t be at home — his car isn\'t there.', russian: 'Его не может быть дома — машины нет.' },
        { english: 'This must be the right address.', russian: 'Это, должно быть, правильный адрес.' },
        { english: 'You can\'t be serious!', russian: 'Ты не можешь говорить серьёзно!' },
        { english: 'They must know each other — they\'re talking like old friends.', russian: 'Они, должно быть, знают друг друга — говорят как старые друзья.' },
        { english: 'That can\'t be right — I checked twice.', russian: 'Это не может быть правильным — я проверял(а) дважды.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'She looks pale. She ___ be ill.', options: ['can\'t', 'must', 'might', 'should'], answer: 'must' },
      { type: 'multiple_choice', question: 'He just ate a huge meal. He ___ be hungry now.', options: ['must', 'can\'t', 'might', 'should'], answer: 'can\'t' },
      { type: 'fill_blank', question: 'That ___ be John — he\'s in Tokyo! (невозможно)', answer: 'can\'t' },
      { type: 'fill_blank', question: 'She ___ be very rich — look at that car! (уверен)', answer: 'must' },
      { type: 'multiple_choice', question: '"Must" для вывода означает...', options: ['это обязательно', 'я почти уверен, что так', 'это возможно', 'это невозможно'], answer: 'я почти уверен, что так' },
    ],
    quiz: [
      { question: 'They\'ve been travelling for 20 hours. They ___ be exhausted.', options: ['can\'t', 'must', 'should', 'might'], answer: 'must' },
      { question: 'She ___ be the manager — she\'s too young.', options: ['must', 'can\'t', 'should', 'might'], answer: 'can\'t' },
      { question: '"Must" для вывода vs "must" для обязанности:', options: ['одно и то же', 'вывод = почти уверен; обязанность = необходимо сделать', 'вывод = необходимо; обязанность = уверен', 'они всегда взаимозаменяемы'], answer: 'вывод = почти уверен; обязанность = необходимо сделать' },
      { question: 'He speaks 7 languages. He ___ be a genius.', options: ['can\'t', 'mustn\'t', 'must', 'had to'], answer: 'must' },
      { question: 'The lights are off. They ___ be home.', options: ['must', 'can\'t', 'should', 'would'], answer: 'can\'t' },
    ],
  },

  {
    id: 'b1-5-72', level: 'B1', block: 5, blockName: 'Модальные для вывода', order: 72,
    title: 'Might / Could (possibility)', duration: '15 мин',
    theory: {
      explanation: 'MIGHT / COULD = возможность (менее уверенно, чем must).\n\nMIGHT: She might be at home. (возможно, но не уверен)\nCOULD: It could rain later. (тоже возможно)\n\nСтепень уверенности:\nmust (95%+) > might/could (50%) > can\'t (0%)\n\nMAY = то же, что might (формальнее).\nMIGHT NOT = маловероятно, но возможно.\nЭти глаголы НЕ меняются по лицам: she might, he could.',
      examples: [
        { english: 'She might be at the gym.', russian: 'Возможно, она в спортзале.' },
        { english: 'It could rain this afternoon.', russian: 'Днём может пойти дождь.' },
        { english: 'He might not come to the party.', russian: 'Возможно, он не придёт на вечеринку.' },
        { english: 'This could be a good opportunity.', russian: 'Это может быть хорошей возможностью.' },
        { english: 'I\'m not sure — she might know the answer.', russian: 'Я не уверен(а) — возможно, она знает ответ.' },
        { english: 'It may take longer than expected.', russian: 'Это может занять больше времени, чем ожидалось.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She ___ be at home or she might be at work.', answer: 'might', hint: 'возможность = might/could' },
      { type: 'multiple_choice', question: 'Степень уверенности "might": ', options: ['почти 100%', 'около 50%', 'почти 0%', 'точно 100%'], answer: 'около 50%' },
      { type: 'multiple_choice', question: 'It ___ be cold tomorrow — I\'m not sure.', options: ['must', 'can\'t', 'could', 'will'], answer: 'could' },
      { type: 'fill_blank', question: 'He ___ not come — he\'s very busy.', answer: 'might' },
      { type: 'multiple_choice', question: 'May и might — это...', options: ['разные по значению', 'одинаковые по значению (might неформальнее)', 'might = прошлое; may = настоящее', 'могут использоваться только в вопросах'], answer: 'одинаковые по значению (might неформальнее)' },
    ],
    quiz: [
      { question: 'I don\'t know where she is. She ___ be at work.', options: ['must', 'can\'t', 'might', 'should'], answer: 'might' },
      { question: 'It ___ be a mistake — check again.', options: ['must not', 'can\'t', 'could', 'had to'], answer: 'could' },
      { question: 'Разница: "must" vs "might" для вывода:', options: ['одинаковы', 'must = почти уверен; might = возможно', 'might = уверен; must = возможно', 'оба означают 50%'], answer: 'must = почти уверен; might = возможно' },
      { question: 'She ___ not know about the meeting.', options: ['must', 'can\'t', 'might', 'should'], answer: 'might' },
      { question: 'He ___ be the new manager — I\'m not sure.', options: ['must', 'can\'t', 'could', 'shouldn\'t'], answer: 'could' },
    ],
  },

  {
    id: 'b1-5-73', level: 'B1', block: 5, blockName: 'Модальные для вывода', order: 73,
    title: 'Modal Perfect (past deduction)', duration: '15 мин',
    theory: {
      explanation: 'Modal + have + Past Participle = вывод о прошлом\n\n• must have + PP = уверен, что так было в прошлом\n  She must have left early. (Она, должно быть, ушла рано.)\n• can\'t have + PP = уверен, что так НЕ БЫЛО\n  He can\'t have finished — it\'s too soon.\n• might have + PP = возможно, так было\n  She might have forgotten.\n• should have + PP = должно было случиться, но не случилось (сожаление)\n  You should have called. (Надо было позвонить.)',
      examples: [
        { english: 'She must have left — her coat is gone.', russian: 'Она, должно быть, ушла — пальто нет.' },
        { english: 'He can\'t have read it — he just got it.', russian: 'Он не мог прочитать — только что получил.' },
        { english: 'She might have forgotten about the meeting.', russian: 'Возможно, она забыла о встрече.' },
        { english: 'You should have told me earlier!', russian: 'Надо было сказать мне раньше!' },
        { english: 'They must have been very tired after the trip.', russian: 'После поездки они, должно быть, были очень уставшими.' },
        { english: 'I shouldn\'t have eaten so much.', russian: 'Не нужно было есть так много.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'She isn\'t here. She ___ have left already.', answer: 'must', hint: 'уверенный вывод о прошлом' },
      { type: 'fill_blank', question: 'He looks upset. Something ___ have happened.', answer: 'must' },
      { type: 'multiple_choice', question: '"You should have called me." означает...', options: ['Ты должен позвонить.', 'Ты позвонил — хорошо.', 'Надо было позвонить (но не позвонил).', 'Ты мог бы позвонить.'], answer: 'Надо было позвонить (но не позвонил).' },
      { type: 'multiple_choice', question: '"He can\'t have passed" означает...', options: ['Он, возможно, сдал.', 'Он не мог сдать (уверен).', 'Ему нельзя было сдавать.', 'Он должен был сдать.'], answer: 'Он не мог сдать (уверен).' },
      { type: 'fill_blank', question: 'I ___ have studied harder. (сожаление)', answer: 'should' },
    ],
    quiz: [
      { question: 'They left 3 hours ago. They ___ have arrived by now.', options: ['can\'t', 'might', 'must', 'should'], answer: 'must' },
      { question: 'She ___ have forgotten — she always remembers everything.', options: ['must', 'can\'t', 'might', 'could'], answer: 'can\'t' },
      { question: '"Should have + PP" выражает...', options: ['уверенность', 'возможность', 'сожаление о прошлом', 'запрет'], answer: 'сожаление о прошлом' },
      { question: 'He ___ have taken the wrong train. (возможно)', options: ['must', 'can\'t', 'might', 'should'], answer: 'might' },
      { question: 'I ___ have said that. (сожаление — не надо было говорить)', options: ['must', 'might', 'shouldn\'t', 'can\'t'], answer: 'shouldn\'t' },
    ],
  },

  {
    id: 'b1-5-74', level: 'B1', block: 5, blockName: 'Модальные для вывода', order: 74,
    title: 'Modal verbs summary', duration: '15 мин',
    theory: {
      explanation: 'Все модальные глаголы — итог:\n\nНАСТОЯЩЕЕ:\n• must: обязанность / уверенный вывод\n• can\'t: невозможность / уверенный отриц. вывод\n• might/could: возможность\n• should: совет\n• have to: внешняя обязанность\n• needn\'t: нет необходимости\n\nПРОШЛОЕ:\n• must have + PP: уверен, что было\n• can\'t have + PP: уверен, что не было\n• might have + PP: возможно, было\n• should have + PP: надо было (но не было)\n• shouldn\'t have + PP: не надо было',
      examples: [
        { english: 'You must be exhausted! (deduction)', russian: 'Ты, должно быть, изнурён(а)! (вывод)' },
        { english: 'You must wear a seatbelt. (obligation)', russian: 'Ты обязан пристегнуться. (обязанность)' },
        { english: 'She might come later. (possibility)', russian: 'Возможно, она придёт позже. (возможность)' },
        { english: 'I should have listened. (past regret)', russian: 'Надо было слушать. (сожаление)' },
        { english: 'He can\'t have done it. (impossible past)', russian: 'Он не мог этого сделать. (невозможное прошлое)' },
        { english: 'You needn\'t worry. (no necessity)', russian: 'Тебе не нужно беспокоиться. (нет необходимости)' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"She must be rich" — это...', options: ['обязанность', 'совет', 'логический вывод', 'разрешение'], answer: 'логический вывод' },
      { type: 'multiple_choice', question: '"I should have called" означает...', options: ['Мне нужно позвонить.', 'Надо было позвонить (не позвонил).', 'Я позвоню.', 'Мне разрешили позвонить.'], answer: 'Надо было позвонить (не позвонил).' },
      { type: 'fill_blank', question: 'He ___ have done it — he was abroad. (невозможно)', answer: 'can\'t' },
      { type: 'multiple_choice', question: '"Might have + PP" означает...', options: ['уверен, что было', 'возможно, было', 'уверен, что не было', 'надо было сделать'], answer: 'возможно, было' },
      { type: 'fill_blank', question: 'You ___ have told me! (надо было)', answer: 'should' },
    ],
    quiz: [
      { question: 'Для логического вывода (почти уверен) используй:', options: ['should', 'might', 'must', 'need'], answer: 'must' },
      { question: 'Для отрицательного вывода (невозможно) используй:', options: ['mustn\'t', 'can\'t', 'won\'t', 'needn\'t'], answer: 'can\'t' },
      { question: 'Сожаление о прошлом:', options: ['must have + PP', 'might have + PP', 'should have + PP', 'can\'t have + PP'], answer: 'should have + PP' },
      { question: '"She might have left" — это...', options: ['уверенное прошлое', 'возможное прошлое', 'невозможное прошлое', 'обязанность в прошлом'], answer: 'возможное прошлое' },
      { question: 'Не надо было делать: "I ___ have done that."', options: ['should', 'shouldn\'t', 'must', 'can\'t'], answer: 'shouldn\'t' },
    ],
  },

  {
    id: 'b1-5-75', level: 'B1', block: 5, blockName: 'Модальные для вывода', order: 75,
    title: 'B1 Повторение', duration: '25 мин',
    theory: {
      explanation: 'Повторение грамматики B1:\n• 2nd/3rd Conditional и Mixed\n• I wish / If only\n• Past Perfect и Past Perfect Progressive\n• Narrative tenses\n• Reported Speech (say/tell/reporting verbs)\n• Passive Voice (все времена)\n• Causative (have/get + obj + V3)\n• Modals for deduction (must/can\'t/might + have PP)',
      examples: [
        { english: 'If I had more time, I would learn Japanese.', russian: 'Если бы у меня было больше времени, я бы учил(а) японский.' },
        { english: 'She said she had already eaten.', russian: 'Она сказала, что уже поела.' },
        { english: 'The report must have been finished by now.', russian: 'Отчёт, должно быть, уже закончен.' },
        { english: 'I wish I hadn\'t said that.', russian: 'Жаль, что я это сказал(а).' },
        { english: 'The car is being repaired.', russian: 'Машина ремонтируется (прямо сейчас).' },
        { english: 'She had her nails done.', russian: 'Ей сделали маникюр.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'If I ___ (study) harder, I would have passed.', options: ['studied', 'had studied', 'would study', 'study'], answer: 'had studied' },
      { type: 'fill_blank', question: '"I will call you." → She said she ___ call me.', answer: 'would' },
      { type: 'multiple_choice', question: 'Passive: The bridge ___ (build) in 1850.', options: ['builds', 'is built', 'was built', 'built'], answer: 'was built' },
      { type: 'fill_blank', question: 'She must ___ (forget) about the meeting. (прошлое)', answer: 'have forgotten' },
      { type: 'multiple_choice', question: 'I wish I ___ (not say) that. (прошлое сожаление)', options: ['didn\'t say', 'hadn\'t said', 'wouldn\'t say', 'don\'t say'], answer: 'hadn\'t said' },
    ],
    quiz: [
      { question: 'If I were rich, I ___ travel the world.', options: ['will', 'would', 'could always', 'should'], answer: 'would' },
      { question: '"I am studying." → He said he ___ studying.', options: ['is', 'was', 'were', 'has been'], answer: 'was' },
      { question: '"Don\'t be late!" → She told me ___ late.', options: ['to not be', 'not to be', 'not be', 'don\'t be'], answer: 'not to be' },
      { question: 'She ___ her car serviced. (causative)', options: ['made', 'had', 'got to', 'did'], answer: 'had' },
      { question: 'He must ___ left already. (прошлое)', options: ['has', 'had', 'have', 'be'], answer: 'have' },
      { question: 'I wish I ___ harder at school. (прошлое)', options: ['worked', 'had worked', 'would work', 'work'], answer: 'had worked' },
      { question: 'The report ___ (complete) by tomorrow. (Future Passive)', options: ['completes', 'is completed', 'will be completed', 'was completed'], answer: 'will be completed' },
      { question: '"She might have forgotten" — степень уверенности:', options: ['почти 100%', 'около 50%', 'почти 0%', 'точно 0%'], answer: 'около 50%' },
      { question: 'She admitted ___ the window. (reporting verb)', options: ['break', 'to break', 'breaking', 'broke'], answer: 'breaking' },
      { question: 'Past Perfect: By the time I arrived, she ___ (leave).', options: ['left', 'was leaving', 'had left', 'has left'], answer: 'had left' },
    ],
  },


  // ── B2 Block 1: Сложные модальные ────────────────────────────────────────────
  {
    id: 'b2-1-76', level: 'B2', block: 1, blockName: 'Сложные модальные', order: 76,
    title: 'Advanced modal meanings', duration: '18 мин',
    theory: {
      explanation: 'Продвинутые значения модальных глаголов:\n\nWOULD: привычки в прошлом (= used to для действий)\n  He would always bring flowers.\nWILL / WON\'T: отказ/нежелание (упрямство)\n  She won\'t listen to me!\nSHALL: предложение/вопрос о желании (формально)\n  Shall I help you? / Shall we go?\nNEED NOT HAVE: не было необходимости, но сделал\n  You needn\'t have cooked — we had pizza.\nCOULD HAVE: возможность в прошлом, которой не воспользовались\n  You could have asked me!',
      examples: [
        { english: 'He would sit by the fire for hours.', russian: 'Он бывало часами сидел у камина.' },
        { english: 'She won\'t eat vegetables — she refuses.', russian: 'Она не хочет есть овощи — она отказывается.' },
        { english: 'Shall I open the window?', russian: 'Открыть окно?' },
        { english: 'You needn\'t have bought flowers.', russian: 'Не нужно было покупать цветы (но купил).' },
        { english: 'You could have told me!', russian: 'Мог бы и сказать мне!' },
        { english: 'He would play guitar every evening.', russian: 'Каждый вечер он играл на гитаре (раньше).' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Would" для прошлых привычек (действий) = ...', options: ['will', 'used to (действия)', 'should', 'might'], answer: 'used to (действия)' },
      { type: 'multiple_choice', question: '"She won\'t answer my calls." Это означает...', options: ['она не может', 'она отказывается (упрямство)', 'она не будет в будущем', 'ей не нужно'], answer: 'она отказывается (упрямство)' },
      { type: 'fill_blank', question: '___ I help you with that? (вежливое предложение)', answer: 'Shall' },
      { type: 'multiple_choice', question: '"You needn\'t have worried" означает...', options: ['Тебе не нужно беспокоиться.', 'Тебе не нужно было беспокоиться (но ты беспокоился).', 'Тебе нельзя было беспокоиться.', 'Возможно, ты беспокоился.'], answer: 'Тебе не нужно было беспокоиться (но ты беспокоился).' },
      { type: 'fill_blank', question: 'You ___ have told me — I would have helped!', answer: 'could' },
    ],
    quiz: [
      { question: 'He ___ always sing in the morning. (прошлая привычка)', options: ['will', 'would', 'should', 'could'], answer: 'would' },
      { question: '"The car won\'t start." — won\'t здесь означает...', options: ['не будет (будущее)', 'отказывается/не хочет', 'не должно', 'не может'], answer: 'отказывается/не хочет' },
      { question: '___ we leave now? (предложение, формально)', options: ['Will', 'Would', 'Shall', 'Should'], answer: 'Shall' },
      { question: '"You could have called!" означает...', options: ['Ты должен был позвонить.', 'Ты мог позвонить, но не позвонил.', 'Ты, возможно, позвонил.', 'Тебе разрешили позвонить.'], answer: 'Ты мог позвонить, но не позвонил.' },
      { question: '"Needn\'t have + PP" означает...', options: ['не нужно делать', 'не было необходимости, но сделал', 'запрет', 'сожаление'], answer: 'не было необходимости, но сделал' },
    ],
  },

  {
    id: 'b2-1-77', level: 'B2', block: 1, blockName: 'Сложные модальные', order: 77,
    title: 'Hedging language', duration: '18 мин',
    theory: {
      explanation: 'Хеджинг (hedging) = смягчение утверждений, выражение неуверенности.\n\nГлаголы хеджинга: seem, appear, tend, suggest\n  It seems to be correct. / The data suggests a rise.\n\nНаречия: apparently, presumably, generally, typically\n  Apparently, he resigned.\n\nМодальные: may, might, could, should\n  This could explain the results.\n\nЕдинственное число: it appears that, it would seem that\nИспользуется в академическом и научном стиле.',
      examples: [
        { english: 'It seems that the problem is more complex.', russian: 'Кажется, проблема сложнее.' },
        { english: 'She appears to be unhappy.', russian: 'Похоже, она несчастна.' },
        { english: 'Apparently, he resigned.', russian: 'По всей видимости, он уволился.' },
        { english: 'This could explain the rise in prices.', russian: 'Это может объяснить рост цен.' },
        { english: 'People tend to eat more in winter.', russian: 'Люди, как правило, едят больше зимой.' },
        { english: 'The results would suggest a positive trend.', russian: 'Результаты, по всей видимости, указывают на положительную тенденцию.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'It ___ that he made a mistake. (по всей видимости)', options: ['says', 'seems', 'tells', 'appears always'], answer: 'seems' },
      { type: 'multiple_choice', question: '"Apparently" означает...', options: ['определённо', 'по всей видимости/судя по всему', 'никогда', 'иногда'], answer: 'по всей видимости/судя по всему' },
      { type: 'multiple_choice', question: 'Хеджинг используется для...', options: ['категоричных утверждений', 'смягчения/неуверенности', 'запретов', 'команд'], answer: 'смягчения/неуверенности' },
      { type: 'fill_blank', question: 'She ___ to be tired. (appear)', answer: 'appears' },
      { type: 'multiple_choice', question: '"This could explain it" — это пример...', options: ['категоричного утверждения', 'хеджинга', 'условия', 'обязанности'], answer: 'хеджинга' },
    ],
    quiz: [
      { question: '"It seems that" используется для...', options: ['абсолютной уверенности', 'осторожного высказывания', 'прямого отказа', 'команды'], answer: 'осторожного высказывания' },
      { question: 'People ___ to spend more in December.', options: ['seem', 'tend', 'appear', 'would'], answer: 'tend' },
      { question: '___, he lost the contract. (судя по всему)', options: ['Certainly', 'Apparently', 'Definitely', 'Clearly'], answer: 'Apparently' },
      { question: 'This ___ explain the results. (возможно)', options: ['must', 'will', 'could', 'should always'], answer: 'could' },
      { question: 'She ___ to be telling the truth. (appears)', options: ['appears', 'seems', 'looks like', 'tends'], answer: 'appears' },
    ],
  },

  {
    id: 'b2-1-78', level: 'B2', block: 1, blockName: 'Сложные модальные', order: 78,
    title: 'Inversion with modals', duration: '18 мин',
    theory: {
      explanation: 'Инверсия с модальными глаголами для усиления или в формальном стиле:\n\nShould (в условных, формально = If):\n  Should you need help, call me. (= If you need help)\nWere (в условных):\n  Were I in your position, I would refuse.\n  (= If I were in your position)\nHad (в 3-м условном):\n  Had I known, I would have told you.\n  (= If I had known)\n\nЭто формальный/книжный стиль!',
      examples: [
        { english: 'Should you require assistance, press 1.', russian: 'Если вам потребуется помощь, нажмите 1.' },
        { english: 'Were she to apply, she would get the job.', russian: 'Если бы она подала заявку, она бы получила работу.' },
        { english: 'Had I known about it, I would have helped.', russian: 'Если бы я знал(а) об этом, я бы помог(ла).' },
        { english: 'Should there be any problems, let me know.', russian: 'Если возникнут проблемы, сообщите мне.' },
        { english: 'Were they to cancel, we\'d lose money.', russian: 'Если бы они отменили, мы бы потеряли деньги.' },
        { english: 'Had she accepted, everything would be different.', russian: 'Если бы она согласилась, всё было бы по-другому.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Should you need help, call me." = ?', options: ['You should need help — call me.', 'If you need help, call me.', 'You needed help — call me.', 'Whenever you need help.'], answer: 'If you need help, call me.' },
      { type: 'multiple_choice', question: '"Were I taller, I\'d be a model." = ?', options: ['If I were taller, I\'d be a model.', 'I was taller to be a model.', 'I should be taller.', 'I will be taller.'], answer: 'If I were taller, I\'d be a model.' },
      { type: 'fill_blank', question: '___ you have any questions, please ask.', answer: 'Should' },
      { type: 'multiple_choice', question: '"Had + subject + PP" = ...-ое условное с инверсией', options: ['первое', 'второе', 'третье', 'нулевое'], answer: 'третье' },
      { type: 'fill_blank', question: '___ she be interested, let me know. (формально)', answer: 'Should' },
    ],
    quiz: [
      { question: '"Had I been there, I would have helped." = ?', options: ['If I am there, I help.', 'If I were there, I\'d help.', 'If I had been there, I would have helped.', 'Since I was there, I helped.'], answer: 'If I had been there, I would have helped.' },
      { question: '"Should there be delays, we\'ll inform you." — стиль:', options: ['разговорный', 'формальный/книжный', 'сленговый', 'архаичный'], answer: 'формальный/книжный' },
      { question: '"Were I rich, I\'d buy a yacht." — тип условного:', options: ['первое', 'второе (инверсия)', 'третье', 'нулевое'], answer: 'второе (инверсия)' },
      { question: '___ you require a receipt, please ask at the desk.', options: ['If', 'Should', 'Were', 'Had'], answer: 'Should' },
      { question: '"Had they arrived earlier" = "If they ___"', options: ['arrived earlier', 'had arrived earlier', 'would arrive earlier', 'arrive earlier'], answer: 'had arrived earlier' },
    ],
  },

  {
    id: 'b2-1-79', level: 'B2', block: 1, blockName: 'Сложные модальные', order: 79,
    title: 'Inversion for emphasis', duration: '18 мин',
    theory: {
      explanation: 'Инверсия для усиления (emphatic inversion):\nОтрицательные наречия в начале предложения → вспомогательный глагол + подлежащее.\n\nNever have I seen such beauty.\nNot only did she win, but she broke the record.\nHardly had I sat down when the phone rang.\nNo sooner had she arrived than he left.\nSeldom do we get such opportunities.\nLittle did I know what would happen.',
      examples: [
        { english: 'Never have I seen such a beautiful place.', russian: 'Никогда я не видел(а) такого красивого места.' },
        { english: 'Not only did she win, but she broke the record.', russian: 'Она не только победила, но и побила рекорд.' },
        { english: 'Hardly had I sat down when the phone rang.', russian: 'Я едва успел(а) сесть, как зазвонил телефон.' },
        { english: 'Seldom do we get such opportunities.', russian: 'Редко нам выпадают такие возможности.' },
        { english: 'No sooner had she left than it started to rain.', russian: 'Едва она ушла, как начался дождь.' },
        { english: 'Little did I know that it would change my life.', russian: 'Я и не подозревал(а), что это изменит мою жизнь.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Never have I seen such beauty." — здесь инверсия потому что:', options: ['это вопрос', 'отрицательное наречие в начале', 'это пассивный залог', 'это условное предложение'], answer: 'отрицательное наречие в начале' },
      { type: 'fill_blank', question: 'Not only ___ she pass, but she came first.', answer: 'did' },
      { type: 'multiple_choice', question: '"Hardly had I arrived ___ the meeting started."', options: ['that', 'when', 'than', 'after'], answer: 'when' },
      { type: 'multiple_choice', question: '"No sooner ___ than" вводит...', options: ['будущее действие', 'два действия, одно сразу за другим', 'условие', 'сомнение'], answer: 'два действия, одно сразу за другим' },
      { type: 'fill_blank', question: 'Seldom ___ we have such weather.', answer: 'do' },
    ],
    quiz: [
      { question: 'Never ___ I eaten such good food.', options: ['have', 'had', 'did', 'do'], answer: 'have' },
      { question: 'Не только... но и: "Not only ___ he speak French, but also German."', options: ['does', 'he does', 'he speaks', 'speaks'], answer: 'does' },
      { question: 'Hardly had I woken up ___ the alarm went off again.', options: ['then', 'that', 'when', 'than'], answer: 'when' },
      { question: '"Little did I know" означает...', options: ['Я знал мало.', 'Я совсем не знал / и не подозревал.', 'Мало кто знал.', 'Я узнал кое-что.'], answer: 'Я совсем не знал / и не подозревал.' },
      { question: 'No sooner had she left ___ it started raining.', options: ['when', 'than', 'that', 'as'], answer: 'than' },
    ],
  },

  {
    id: 'b2-1-80', level: 'B2', block: 1, blockName: 'Сложные модальные', order: 80,
    title: 'Cleft sentences', duration: '18 мин',
    theory: {
      explanation: 'Расщеплённые предложения (Cleft sentences) — для выделения части информации.\n\nIT-cleft: It was John who called. (не кто-то другой — именно Джон)\nStructure: It + be + [выделяемый элемент] + who/that/where/when\n\nWH-cleft (pseudo-cleft): What I need is sleep.\nStructure: What + clause + is/was + [выделяемый элемент]\n\nИспользуется для: уточнения, исправления, подчёркивания.',
      examples: [
        { english: 'It was Mary who called, not Tom.', russian: 'Это Мэри позвонила, а не Том.' },
        { english: 'It was in 2020 that everything changed.', russian: 'Именно в 2020 году всё изменилось.' },
        { english: 'What I really need is a holiday.', russian: 'То, что мне действительно нужно, — это отпуск.' },
        { english: 'It was the noise that woke me up.', russian: 'Именно шум меня разбудил.' },
        { english: 'What surprised me was how quickly he agreed.', russian: 'Меня удивило то, как быстро он согласился.' },
        { english: 'It\'s Paris that I\'ve always wanted to visit.', russian: 'Именно Париж я всегда хотел(а) посетить.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"It was John who won." — что выделяется?', options: ['действие (win)', 'время', 'деятель (John)', 'место'], answer: 'деятель (John)' },
      { type: 'fill_blank', question: '___ I want is a cup of tea. (wh-cleft)', answer: 'What' },
      { type: 'multiple_choice', question: '"It was yesterday ___ I lost my keys."', options: ['who', 'that', 'where', 'when'], answer: 'that' },
      { type: 'multiple_choice', question: 'Cleft sentences используются для...', options: ['выражения сожаления', 'выделения определённой информации', 'пассивного залога', 'условных предложений'], answer: 'выделения определённой информации' },
      { type: 'fill_blank', question: 'It was Tom ___ broke the window.', answer: 'who' },
    ],
    quiz: [
      { question: '"What she needs is rest." — тип:', options: ['It-cleft', 'Wh-cleft (pseudo-cleft)', 'Passive', 'Inversion'], answer: 'Wh-cleft (pseudo-cleft)' },
      { question: '"It was in London ___ they met."', options: ['who', 'that', 'where', 'which'], answer: 'that' },
      { question: 'It was ___ mistake that caused the problem.', options: ['him', 'his', 'he', 'himself'], answer: 'his' },
      { question: '"What I love about winter is the snow." — выделяется:', options: ['субъект (I)', 'время', 'то, что я люблю в зиме', 'зима'], answer: 'то, что я люблю в зиме' },
      { question: 'It was the teacher ___ helped me most.', options: ['that', 'which', 'what', 'whom'], answer: 'that' },
    ],
  },


  // ── B2 Block 2: Инверсия ────────────────────────────────────────────────────
  {
    id: 'b2-2-81', level: 'B2', block: 2, blockName: 'Инверсия', order: 81,
    title: 'Relative clauses advanced', duration: '18 мин',
    theory: {
      explanation: 'Придаточные определительные (Relative Clauses):\n\nОПРЕДЕЛИТЕЛЬНЫЕ (Defining): нет запятых — информация обязательна\n  The woman WHO called is my sister.\n\nПОЯСНИТЕЛЬНЫЕ (Non-defining): с запятыми — дополнительная информация\n  My sister, WHO lives in Paris, is a doctor.\n\nWho = люди; Which = вещи; Whose = притяжательное\nWhere = место; When = время; That = люди/вещи (только определительные)\n\nВ пояснительных нельзя использовать THAT.',
      examples: [
        { english: 'The man who lives next door is a teacher.', russian: 'Мужчина, который живёт по соседству, — учитель.' },
        { english: 'This is the book which changed my life.', russian: 'Это книга, которая изменила мою жизнь.' },
        { english: 'My father, who is 70, still works.', russian: 'Мой отец, которому 70 лет, всё ещё работает.' },
        { english: 'The town where I grew up is small.', russian: 'Городок, где я вырос(ла), маленький.' },
        { english: 'The company, whose profits fell, closed.', russian: 'Компания, чья прибыль упала, закрылась.' },
        { english: 'I remember the day when we first met.', russian: 'Я помню день, когда мы впервые встретились.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'The girl ___ bag was stolen was very upset.', options: ['who', 'which', 'whose', 'that'], answer: 'whose' },
      { type: 'multiple_choice', question: 'В пояснительном придаточном НЕЛЬЗЯ использовать...', options: ['who', 'which', 'that', 'where'], answer: 'that' },
      { type: 'fill_blank', question: 'That\'s the town ___ I was born.', answer: 'where' },
      { type: 'multiple_choice', question: 'Пояснительное придаточное (non-defining):', options: ['без запятых', 'с запятыми', 'только с that', 'только с которых'], answer: 'с запятыми' },
      { type: 'fill_blank', question: 'My brother, ___ is a doctor, lives in London.', answer: 'who' },
    ],
    quiz: [
      { question: 'The car ___ I bought is already broken.', options: ['who', 'whose', 'which', 'where'], answer: 'which' },
      { question: 'The man, ___ I met at the conference, is famous.', options: ['that', 'who', 'which', 'whose'], answer: 'who' },
      { question: 'Определительное (defining) придаточное содержит...', options: ['лишнюю информацию с запятыми', 'обязательную информацию без запятых', 'только which', 'только who'], answer: 'обязательную информацию без запятых' },
      { question: 'She works for a company ___ products are sold worldwide.', options: ['who', 'which', 'whose', 'that'], answer: 'whose' },
      { question: 'This is ___ I wanted to talk about. (то, о чём)', options: ['that', 'which', 'what', 'who'], answer: 'what' },
    ],
  },

  {
    id: 'b2-2-82', level: 'B2', block: 2, blockName: 'Инверсия', order: 82,
    title: 'Participle clauses', duration: '18 мин',
    theory: {
      explanation: 'Причастные обороты (Participle clauses) заменяют придаточные для сжатости.\n\nPresent Participle (-ing): активное или одновременное действие\n  Seeing the dog, she ran. (= When she saw the dog, she ran.)\n\nPast Participle (V3): пассивное значение\n  Shocked by the news, he sat down.\n  (= After he was shocked by the news)\n\nPerfect Participle (having + V3): более раннее действие\n  Having finished his work, he left.',
      examples: [
        { english: 'Walking down the street, I met an old friend.', russian: 'Идя по улице, я встретил(а) старого друга.' },
        { english: 'Shocked by the news, she burst into tears.', russian: 'Потрясённая новостью, она расплакалась.' },
        { english: 'Having finished the report, she left.', russian: 'Закончив отчёт, она ушла.' },
        { english: 'The man sitting by the window is my boss.', russian: 'Мужчина, сидящий у окна, — мой начальник.' },
        { english: 'Painted in 1503, the Mona Lisa is priceless.', russian: 'Написанная в 1503 году, Мона Лиза бесценна.' },
        { english: 'Not knowing what to say, he left.', russian: 'Не зная, что сказать, он ушёл.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Walking home, I saw a dog." Что заменяет "walking"?', options: ['After I walked', 'While I was walking', 'Before walking', 'Although walking'], answer: 'While I was walking' },
      { type: 'multiple_choice', question: '"Shocked by the news" — это...', options: ['Present Participle', 'Past Participle (пассивный)', 'Perfect Participle', 'Инфинитив'], answer: 'Past Participle (пассивный)' },
      { type: 'fill_blank', question: '___ (have) his breakfast, he left for work.', answer: 'Having had', hint: 'Perfect Participle = having + V3' },
      { type: 'fill_blank', question: '___ (exhaust) by the long journey, she slept immediately.', answer: 'Exhausted' },
      { type: 'multiple_choice', question: '"Not knowing the answer" — частица НЕ идёт...', options: ['после глагола', 'перед причастием', 'в конце', 'после подлежащего'], answer: 'перед причастием' },
    ],
    quiz: [
      { question: '"Having eaten, he went for a walk." = ?', options: ['While he was eating', 'After he had eaten', 'Before he ate', 'Because he ate'], answer: 'After he had eaten' },
      { question: '"Written in 1800" — это какое причастие?', options: ['Present (-ing)', 'Perfect (having + V3)', 'Past (V3) — пассивное', 'Инфинитив'], answer: 'Past (V3) — пассивное' },
      { question: '___ (sit) by the window, I could see the garden.', options: ['Sat', 'Sitting', 'Having sat', 'Sitted'], answer: 'Sitting' },
      { question: 'Причастный оборот используется для...', options: ['более длинного выражения', 'сжатой замены придаточного', 'пассивного залога только', 'условных предложений'], answer: 'сжатой замены придаточного' },
      { question: '"Tired of waiting" — это причастие от глагола "tire":...', options: ['Present Participle', 'Past Participle', 'Perfect Participle', 'Инфинитив'], answer: 'Past Participle' },
    ],
  },

  {
    id: 'b2-2-83', level: 'B2', block: 2, blockName: 'Инверсия', order: 83,
    title: 'Noun clauses', duration: '18 мин',
    theory: {
      explanation: 'Именные придаточные (Noun Clauses) = придаточное в функции существительного.\n\nФункции:\n• Подлежащее: That he survived is amazing.\n• Дополнение: I know that she is right.\n• Дополнение к прилагательному: I\'m sure that he\'ll come.\n\nВводные слова: that, whether, if, what, who, where, when, how\n\nС глаголами мышления/речи: think, know, believe, wonder, doubt, say, report',
      examples: [
        { english: 'I know that she is coming.', russian: 'Я знаю, что она придёт.' },
        { english: 'Whether he comes or not doesn\'t matter.', russian: 'Придёт он или нет — не важно.' },
        { english: 'What she said surprised me.', russian: 'То, что она сказала, удивило меня.' },
        { english: 'I wonder where he went.', russian: 'Интересно, куда он ушёл.' },
        { english: 'The fact that she failed upset everyone.', russian: 'То, что она провалилась, расстроило всех.' },
        { english: 'I\'m not sure if he\'ll agree.', russian: 'Я не уверен(а), согласится ли он.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"I know ___ she is right." Вводное слово:', options: ['if', 'what', 'that', 'which'], answer: 'that' },
      { type: 'fill_blank', question: 'I wonder ___ he is doing now.', answer: 'what' },
      { type: 'multiple_choice', question: '"Whether" используется для...', options: ['места', 'времени', 'альтернативы / да-нет вопроса', 'причины'], answer: 'альтернативы / да-нет вопроса' },
      { type: 'multiple_choice', question: 'Именное придаточное может быть...', options: ['только подлежащим', 'только дополнением', 'подлежащим, дополнением или пояснением', 'только пояснением'], answer: 'подлежащим, дополнением или пояснением' },
      { type: 'fill_blank', question: 'The fact ___ he lied shocked me.', answer: 'that' },
    ],
    quiz: [
      { question: '"What I need is rest." — именное придаточное в функции:', options: ['дополнения', 'определения', 'подлежащего', 'обстоятельства'], answer: 'подлежащего' },
      { question: 'I believe ___ she can succeed.', options: ['if', 'whether', 'that', 'what'], answer: 'that' },
      { question: 'Tell me ___ you found it. (где)', options: ['that', 'what', 'where', 'whether'], answer: 'where' },
      { question: '___ he is innocent hasn\'t been proved.', options: ['If', 'That', 'What', 'Whether'], answer: 'Whether' },
      { question: 'I\'m not sure ___ to do. (что делать)', options: ['that', 'what', 'if', 'whether'], answer: 'what' },
    ],
  },

  {
    id: 'b2-2-84', level: 'B2', block: 2, blockName: 'Инверсия', order: 84,
    title: 'Advanced conditionals', duration: '18 мин',
    theory: {
      explanation: 'Продвинутые условные:\n\n1. Unless / As long as / Provided that / On condition that — все = "если" (с условием):\n  You can go as long as you\'re back by midnight.\n  Provided you pass, you\'ll get the scholarship.\n\n2. Even if — даже если (результат не изменится):\n  Even if I tried, I couldn\'t do it.\n\n3. Suppose / Supposing — предположим, что:\n  Supposing you won the lottery — what would you buy?',
      examples: [
        { english: 'You can stay as long as you\'re quiet.', russian: 'Ты можешь остаться, пока ты тихо себя ведёшь.' },
        { english: 'Provided that you apply on time, you\'ll be considered.', russian: 'При условии, что ты подашь вовремя, тебя рассмотрят.' },
        { english: 'Even if she apologised, I wouldn\'t forgive her.', russian: 'Даже если бы она извинилась, я бы не простил(а) её.' },
        { english: 'Supposing you were invisible — what would you do?', russian: 'Предположим, ты невидим(а) — что бы ты сделал(а)?' },
        { english: 'On condition that he pays, I\'ll help him.', russian: 'При условии, что он заплатит, я ему помогу.' },
        { english: 'I won\'t help unless he asks me directly.', russian: 'Я не помогу, если он не попросит меня лично.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"As long as" в условии означает...', options: ['хотя', 'при условии что', 'после того как', 'вместо того чтобы'], answer: 'при условии что' },
      { type: 'multiple_choice', question: '"Even if she apologised, I wouldn\'t forgive her." — это:', options: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'], answer: 'Second Conditional' },
      { type: 'fill_blank', question: 'You can borrow my car ___ (at condition) you fill it up.', answer: 'provided' },
      { type: 'multiple_choice', question: '"Supposing" = ...', options: ['если даже', 'предположим что', 'кроме того, что', 'до того как'], answer: 'предположим что' },
      { type: 'fill_blank', question: '___ if I tried, I couldn\'t do it.', answer: 'Even' },
    ],
    quiz: [
      { question: '"Provided that" = ...', options: ['despite', 'as long as / on condition that', 'even if', 'unless'], answer: 'as long as / on condition that' },
      { question: 'I\'ll come ___ you invite me. (при условии)', options: ['even if', 'unless', 'as long as', 'although'], answer: 'as long as' },
      { question: '"Even if it rained, we\'d still go." — означает:', options: ['Если пойдёт дождь, пойдём.', 'Даже если пойдёт дождь, мы всё равно пойдём.', 'Мы не пойдём, если будет дождь.', 'Если только не будет дождя.'], answer: 'Даже если пойдёт дождь, мы всё равно пойдём.' },
      { question: '___ you got a million dollars — what would you do?', options: ['Suppose', 'Supposing', 'Even if', 'Provided'], answer: 'Supposing' },
      { question: 'On ___ that she agrees, I\'ll proceed.', options: ['unless', 'condition', 'even', 'provide'], answer: 'condition' },
    ],
  },

  {
    id: 'b2-2-85', level: 'B2', block: 2, blockName: 'Инверсия', order: 85,
    title: 'Concession clauses', duration: '18 мин',
    theory: {
      explanation: 'Уступительные придаточные = несмотря на условие, результат неожиданный.\n\nALTHOUGH / EVEN THOUGH / THOUGH + clause:\n  Although it was cold, I went for a walk.\n\nDESPITE / IN SPITE OF + noun/gerund:\n  Despite the cold weather, I went for a walk.\n  Despite being cold, I went for a walk.\n\nHOWEVER / NEVERTHELESS / NONETHELESS (наречия):\n  It was cold. However, I went for a walk.',
      examples: [
        { english: 'Although she was tired, she finished the work.', russian: 'Хотя она устала, она закончила работу.' },
        { english: 'Even though it rained, we had a great time.', russian: 'Несмотря на дождь, мы отлично провели время.' },
        { english: 'Despite being tired, she continued.', russian: 'Несмотря на усталость, она продолжила.' },
        { english: 'In spite of the difficulties, they succeeded.', russian: 'Несмотря на трудности, они добились успеха.' },
        { english: 'He is clever. Nevertheless, he makes mistakes.', russian: 'Он умён. Тем не менее, он делает ошибки.' },
        { english: 'Though she tried, she couldn\'t open it.', russian: 'Хотя она и пыталась, открыть не смогла.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Despite" следует за...', options: ['придаточным предложением (S + V)', 'существительным или герундием', 'инфинитивом', 'вспомогательным глаголом'], answer: 'существительным или герундием' },
      { type: 'multiple_choice', question: '"Although" следует за...', options: ['существительным', 'герундием', 'придаточным предложением (S + V)', 'инфинитивом'], answer: 'придаточным предложением (S + V)' },
      { type: 'fill_blank', question: '___ being rich, she was unhappy.', answer: 'Despite' },
      { type: 'fill_blank', question: '___ she was rich, she was unhappy.', answer: 'Although' },
      { type: 'multiple_choice', question: '"Nevertheless" — это...', options: ['предлог', 'союз', 'наречие с запятой', 'причастие'], answer: 'наречие с запятой' },
    ],
    quiz: [
      { question: 'He passed the exam ___ not studying much.', options: ['although', 'despite', 'even though', 'however'], answer: 'despite' },
      { question: '___ the weather was bad, we enjoyed the trip.', options: ['Despite', 'In spite of', 'Even though', 'However'], answer: 'Even though' },
      { question: 'She was determined. ___, she gave up eventually.', options: ['Despite', 'Although', 'However', 'Even though'], answer: 'However' },
      { question: 'In spite of ___ hard, he failed.', options: ['try', 'tried', 'trying', 'to try'], answer: 'trying' },
      { question: '"Though" = ...', options: ['so', 'because', 'although', 'unless'], answer: 'although' },
    ],
  },


  // ── B2 Block 3: Придаточные предложения ─────────────────────────────────────
  {
    id: 'b2-3-86', level: 'B2', block: 3, blockName: 'Придаточные предложения', order: 86,
    title: 'Purpose clauses', duration: '18 мин',
    theory: {
      explanation: 'Придаточные цели (Purpose Clauses):\n\nTO + infinitive (самый простой):\n  I went to the shop to buy milk.\n\nIN ORDER TO + inf (формальнее):\n  She studies in order to improve her skills.\n\nSO AS TO + inf:\n  He left early so as to avoid traffic.\n\nSO THAT + clause (с подлежащим):\n  I saved money so that I could travel.\n  She spoke slowly so that we could understand.\n\nОТРИЦАНИЕ: in order not to / so as not to / so that... won\'t',
      examples: [
        { english: 'She studies hard to pass the exam.', russian: 'Она усердно учится, чтобы сдать экзамен.' },
        { english: 'I called in order to check the details.', russian: 'Я позвонил(а), чтобы уточнить детали.' },
        { english: 'He left early so as not to miss the train.', russian: 'Он ушёл рано, чтобы не опоздать на поезд.' },
        { english: 'She spoke slowly so that we could understand.', russian: 'Она говорила медленно, чтобы мы могли понять.' },
        { english: 'I saved money so that I could buy a car.', russian: 'Я копил(а) деньги, чтобы купить машину.' },
        { english: 'He whispered so as not to wake the baby.', russian: 'Он говорил шёпотом, чтобы не разбудить ребёнка.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"She left early ___ catch the bus." (цель)', options: ['for', 'in order that', 'to', 'so that'], answer: 'to' },
      { type: 'fill_blank', question: 'He saved money ___ that he could retire early.', answer: 'so' },
      { type: 'multiple_choice', question: '"So as not to" используется для...', options: ['положительной цели', 'отрицательной цели', 'уступки', 'причины'], answer: 'отрицательной цели' },
      { type: 'multiple_choice', question: '"In order to" vs "to": in order to — это...', options: ['неверно', 'более формальный вариант', 'только для прошлого', 'только с отрицанием'], answer: 'более формальный вариант' },
      { type: 'fill_blank', question: 'I spoke slowly ___ that you could understand.', answer: 'so' },
    ],
    quiz: [
      { question: 'She whispered ___ not to wake the baby.', options: ['so', 'in order', 'as', 'for'], answer: 'so as' },
      { question: 'He exercises ___ stay healthy.', options: ['for', 'in order for', 'to', 'that'], answer: 'to' },
      { question: '"So that" требует после себя...', options: ['инфинитив', 'герундий', 'придаточное (S + V)', 'существительное'], answer: 'придаточное (S + V)' },
      { question: '"I left early in order ___ be late." (не опоздать)', options: ['to not', 'not to', 'for not', 'that not'], answer: 'not to' },
      { question: 'She saved money ___ she could buy a house.', options: ['so that', 'to that', 'in order that', 'for'], answer: 'so that' },
    ],
  },

  {
    id: 'b2-3-87', level: 'B2', block: 3, blockName: 'Придаточные предложения', order: 87,
    title: 'Result clauses', duration: '18 мин',
    theory: {
      explanation: 'Придаточные следствия (Result Clauses):\n\nSO + adjective/adverb + THAT:\n  She was so tired that she fell asleep.\nSUCH + noun phrase + THAT:\n  It was such a good film that I saw it twice.\n\nAS A RESULT / THEREFORE / CONSEQUENTLY / THUS (наречия):\n  It rained heavily; therefore, the match was cancelled.\n\nSO (разговорное): It was late, so we left.',
      examples: [
        { english: 'It was so hot that we couldn\'t work.', russian: 'Было так жарко, что мы не могли работать.' },
        { english: 'She was such a good teacher that everyone loved her.', russian: 'Она была такой хорошей учительницей, что все её любили.' },
        { english: 'The traffic was heavy; therefore, I was late.', russian: 'Было много пробок; поэтому я опоздал(а).' },
        { english: 'He spoke so quietly that we couldn\'t hear.', russian: 'Он говорил так тихо, что мы не могли расслышать.' },
        { english: 'It was such a difficult exam that many failed.', russian: 'Экзамен был таким сложным, что многие провалились.' },
        { english: 'As a result of the storm, the town was flooded.', russian: 'В результате шторма город был затоплен.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"It was ___ cold that we stayed inside." (so/such)', options: ['such', 'so', 'very', 'too'], answer: 'so' },
      { type: 'multiple_choice', question: '"It was ___ a cold day that we stayed inside." (so/such)', options: ['so', 'such', 'very', 'too'], answer: 'such' },
      { type: 'fill_blank', question: 'She was ___ tired that she fell asleep immediately.', answer: 'so' },
      { type: 'fill_blank', question: 'It was ___ good weather that we had a picnic.', answer: 'such' },
      { type: 'multiple_choice', question: '"Therefore" используется как...', options: ['союз', 'предлог', 'наречие-соединитель', 'причастие'], answer: 'наречие-соединитель' },
    ],
    quiz: [
      { question: 'She ran ___ fast that she won easily.', options: ['such', 'so', 'very', 'too'], answer: 'so' },
      { question: 'It was ___ beautiful sunset that we stopped to watch.', options: ['so', 'such a', 'very a', 'so a'], answer: 'such a' },
      { question: '"Consequently" — синоним к:', options: ['although', 'therefore', 'despite', 'unless'], answer: 'therefore' },
      { question: 'He was ___ talented musician that he toured the world.', options: ['so a', 'so', 'such a', 'such'], answer: 'such a' },
      { question: '"As a result" вводит...', options: ['причину', 'уступку', 'следствие', 'цель'], answer: 'следствие' },
    ],
  },

  {
    id: 'b2-3-88', level: 'B2', block: 3, blockName: 'Придаточные предложения', order: 88,
    title: 'Subjunctive mood', duration: '18 мин',
    theory: {
      explanation: 'Сослагательное наклонение (Subjunctive):\n\n1. После глаголов требования/рекомендации (suggest, recommend, insist, demand, propose):\n   I suggest that he STUDY harder. (не studies)\n   She demanded that he LEAVE. (не leaves)\n\n2. Set phrases:\n   If I were you... / Were she to know...\n   It\'s time we left. / I\'d rather you stayed.\n   It\'s vital/essential/necessary that he BE here.\n\nSUBJUNCTIVE = базовая форма глагола (без -s)',
      examples: [
        { english: 'I suggest that she study more.', russian: 'Я предлагаю, чтобы она больше занималась.' },
        { english: 'He demanded that the manager be called.', russian: 'Он потребовал, чтобы вызвали менеджера.' },
        { english: 'It\'s essential that everyone be present.', russian: 'Необходимо, чтобы все присутствовали.' },
        { english: 'I\'d rather you didn\'t tell her.', russian: 'Я бы предпочёл(а), чтобы ты не говорил(а) ей.' },
        { english: 'It\'s time we left.', russian: 'Уже пора уходить.' },
        { english: 'She insisted that he apologise.', russian: 'Она настояла на том, чтобы он извинился.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'I suggest that he ___ harder.', options: ['studies', 'study', 'studied', 'to study'], answer: 'study' },
      { type: 'multiple_choice', question: 'It is essential that she ___ on time.', options: ['is', 'be', 'was', 'being'], answer: 'be' },
      { type: 'fill_blank', question: 'She insisted that he ___ (apologize).', answer: 'apologise' },
      { type: 'multiple_choice', question: '"I\'d rather you didn\'t come." означает:', options: ['Я хочу, чтобы ты не пришёл.', 'Я бы предпочёл, чтобы ты не приходил.', 'Ты не должен приходить.', 'Тебе лучше не приходить.'], answer: 'Я бы предпочёл, чтобы ты не приходил.' },
      { type: 'fill_blank', question: 'It\'s time we ___ (leave).', answer: 'left', hint: 'It\'s time + Past Simple' },
    ],
    quiz: [
      { question: 'He demanded that she ___ the truth.', options: ['tells', 'tell', 'told', 'to tell'], answer: 'tell' },
      { question: 'It is vital that everyone ___ the policy.', options: ['follows', 'follow', 'followed', 'to follow'], answer: 'follow' },
      { question: '"I\'d rather you stayed home." — stayed — это:', options: ['Past Simple (реальное)', 'Сослагательное (нереальное)', 'Past Perfect', 'Инфинитив'], answer: 'Сослагательное (нереальное)' },
      { question: 'После "suggest/recommend/insist that" глагол стоит в форме:', options: ['Present Simple (с -s)', 'базовой форме (без -s)', 'Past Simple', 'Future'], answer: 'базовой форме (без -s)' },
      { question: 'It\'s time he ___ (apologise).', options: ['apologises', 'apologise', 'apologised', 'to apologise'], answer: 'apologised' },
    ],
  },

  {
    id: 'b2-3-89', level: 'B2', block: 3, blockName: 'Придаточные предложения', order: 89,
    title: 'Discourse markers', duration: '18 мин',
    theory: {
      explanation: 'Дискурсивные маркеры — слова для организации текста/речи:\n\nДОБАВЛЕНИЕ: furthermore, moreover, in addition, what is more\nКОНТРАСТ: however, nevertheless, on the other hand, whereas, while\nПРИЧИНА: because of, due to, owing to, as a result of\nСЛЕДСТВИЕ: therefore, consequently, hence, as a result\nВЫВОД: in conclusion, to sum up, overall, to summarise\nИЛЛЮСТРАЦИЯ: for example, for instance, such as, namely',
      examples: [
        { english: 'Furthermore, the price has increased.', russian: 'Кроме того, цена выросла.' },
        { english: 'However, not everyone agreed.', russian: 'Тем не менее, не все были согласны.' },
        { english: 'Owing to the rain, the match was cancelled.', russian: 'Из-за дождя матч был отменён.' },
        { english: 'Consequently, we had to change plans.', russian: 'Следовательно, нам пришлось изменить планы.' },
        { english: 'In conclusion, the project was a success.', russian: 'В заключение, проект оказался успешным.' },
        { english: 'For instance, take the case of Japan.', russian: 'Например, возьмём случай Японии.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Moreover" относится к группе маркеров...', options: ['контраста', 'добавления', 'следствия', 'иллюстрации'], answer: 'добавления' },
      { type: 'multiple_choice', question: '"However" выражает...', options: ['добавление', 'следствие', 'контраст', 'иллюстрацию'], answer: 'контраст' },
      { type: 'fill_blank', question: '___ to the strike, the factory was closed. (из-за)', answer: 'Owing' },
      { type: 'multiple_choice', question: '"For instance" = ...', options: ['moreover', 'however', 'for example', 'therefore'], answer: 'for example' },
      { type: 'fill_blank', question: 'In ___, the plan failed. (в заключение)', answer: 'conclusion' },
    ],
    quiz: [
      { question: 'The product is cheap. ___, it is high quality.', options: ['Therefore', 'Moreover', 'Consequently', 'Hence'], answer: 'Moreover' },
      { question: '"Due to" = ...', options: ['despite', 'although', 'because of', 'even though'], answer: 'because of' },
      { question: '"Hence" — это маркер...', options: ['добавления', 'следствия', 'контраста', 'примера'], answer: 'следствия' },
      { question: '"On the other hand" — это маркер...', options: ['добавления', 'следствия', 'контраста', 'примера'], answer: 'контраста' },
      { question: '"Namely" используется для...', options: ['вывода', 'уточнения/конкретизации', 'контраста', 'причины'], answer: 'уточнения/конкретизации' },
    ],
  },

  {
    id: 'b2-3-90', level: 'B2', block: 3, blockName: 'Придаточные предложения', order: 90,
    title: 'B2 Повторение', duration: '25 мин',
    theory: {
      explanation: 'Повторение грамматики B2:\n• Продвинутые модальные (would, shall, needn\'t have, could have)\n• Хеджинг (seem, appear, apparently)\n• Инверсия (never have I, not only did, had I known)\n• Расщеплённые предложения (It was... who/that)\n• Придаточные определительные (who/which/whose/that)\n• Причастные обороты\n• Именные придаточные\n• Придаточные цели/следствия/уступки\n• Сослагательное наклонение\n• Дискурсивные маркеры',
      examples: [
        { english: 'Never have I seen such dedication.', russian: 'Никогда я не видел(а) такой самоотдачи.' },
        { english: 'It was her perseverance that made the difference.', russian: 'Именно её упорство сыграло роль.' },
        { english: 'She was so exhausted that she fell asleep immediately.', russian: 'Она была так изнурена, что сразу заснула.' },
        { english: 'I suggest that he take a break.', russian: 'Я предлагаю, чтобы он сделал перерыв.' },
        { english: 'Having finished, she submitted the report.', russian: 'Закончив, она сдала отчёт.' },
        { english: 'Moreover, the results were unexpected.', russian: 'Кроме того, результаты оказались неожиданными.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Never ___ I seen such talent."', options: ['has', 'have', 'had', 'did'], answer: 'have' },
      { type: 'fill_blank', question: 'It was the storm ___ caused the flooding.', answer: 'that' },
      { type: 'multiple_choice', question: 'I suggest that she ___ more rest.', options: ['gets', 'get', 'got', 'to get'], answer: 'get' },
      { type: 'fill_blank', question: 'Despite ___ hard, she failed. (работать)', answer: 'working' },
      { type: 'multiple_choice', question: '"Moreover" выражает...', options: ['контраст', 'добавление', 'следствие', 'уступку'], answer: 'добавление' },
    ],
    quiz: [
      { question: '"Had she studied, she would have passed." = ?', options: ['If she studied, she would pass.', 'If she had studied, she would have passed.', 'If she studies, she will pass.', 'If she was studying, she would pass.'], answer: 'If she had studied, she would have passed.' },
      { question: 'Not only did he win, ___ he broke the record.', options: ['and', 'but', 'but also', 'also'], answer: 'but also' },
      { question: '"Owing to the weather, the event was cancelled." "Owing to" = ...', options: ['despite', 'although', 'because of', 'however'], answer: 'because of' },
      { question: '___ finished the report, she went home. (причастный оборот)', options: ['Finishing', 'Having finished', 'Finished', 'After finish'], answer: 'Having finished' },
      { question: 'It was ___ I wanted to tell you about.', options: ['that', 'which', 'what', 'who'], answer: 'what' },
      { question: '"Even though" = ...', options: ['despite', 'although (с подлежащим)', 'in spite of', 'however'], answer: 'although (с подлежащим)' },
      { question: 'She was such ___ teacher that everyone loved her.', options: ['good', 'a good', 'so good', 'very good'], answer: 'a good' },
      { question: '"It\'s time we left." — left — это:', options: ['Past Simple (реальное прошлое)', 'Сослагательное (нереальное)', 'Past Perfect', 'Present Simple'], answer: 'Сослагательное (нереальное)' },
      { question: '"The girl whose bag was stolen" — whose относится к...', options: ['месту', 'владению', 'времени', 'причине'], answer: 'владению' },
      { question: '"Consequently" — маркер...', options: ['добавления', 'контраста', 'следствия', 'иллюстрации'], answer: 'следствия' },
    ],
  },


  // ── C1 Block 1: Сложные конструкции ─────────────────────────────────────────
  {
    id: 'c1-1-91', level: 'C1', block: 1, blockName: 'Сложные конструкции', order: 91,
    title: 'Complex noun phrases', duration: '20 мин',
    theory: {
      explanation: 'Сложные именные группы (Complex Noun Phrases):\n\nПре-модификаторы (перед существительным): adjectives, nouns, participles\n  A fast-growing technology company\n  A well-respected senior official\n\nПост-модификаторы (после существительного):\n• Prepositional phrases: the man in the corner\n• Relative clauses: the issue that we discussed\n• Participle clauses: the data collected last year\n• Infinitive phrases: the ability to adapt\n• Appositive phrases: my colleague, Dr Smith, ...',
      examples: [
        { english: 'A groundbreaking scientific discovery', russian: 'Революционное научное открытие' },
        { english: 'The man standing by the door', russian: 'Мужчина, стоящий у двери' },
        { english: 'The ability to think critically', russian: 'Способность мыслить критически' },
        { english: 'The issue raised at the meeting', russian: 'Вопрос, поднятый на встрече' },
        { english: 'My mentor, Professor Davies, gave excellent advice.', russian: 'Мой наставник, профессор Дейвис, дал отличный совет.' },
        { english: 'A well-designed, user-friendly interface', russian: 'Хорошо разработанный, удобный интерфейс' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"The data collected last year" — "collected last year" является:', options: ['пре-модификатором', 'пост-модификатором (причастный оборот)', 'предикативным прилагательным', 'наречием'], answer: 'пост-модификатором (причастный оборот)' },
      { type: 'multiple_choice', question: '"The ability to adapt" — "to adapt" является:', options: ['инфинитивным пост-модификатором', 'герундиальным пре-модификатором', 'относительным придаточным', 'предложным оборотом'], answer: 'инфинитивным пост-модификатором' },
      { type: 'fill_blank', question: 'A fast-___ technology company (растущий)', answer: 'growing' },
      { type: 'multiple_choice', question: 'Аппозитив (appositive) — это:', options: ['причастный оборот', 'пояснение, отделённое запятыми', 'предложный оборот', 'относительное придаточное с that'], answer: 'пояснение, отделённое запятыми' },
      { type: 'fill_blank', question: 'The issue ___ at the meeting (поднятый — Past Participle)', answer: 'raised' },
    ],
    quiz: [
      { question: 'В "a well-respected senior official" пре-модификаторы — это:', options: ['official', 'a, senior', 'well-respected, senior', 'respected, official'], answer: 'well-respected, senior' },
      { question: '"The man in the corner" — "in the corner" — это:', options: ['пре-модификатор', 'пост-модификатор (предложный)', 'аппозитив', 'придаточное с that'], answer: 'пост-модификатор (предложный)' },
      { question: '"My colleague, Dr Smith, gave advice." — Dr Smith — это:', options: ['подлежащее', 'аппозитив к "my colleague"', 'дополнение', 'пост-модификатор'], answer: 'аппозитив к "my colleague"' },
      { question: 'Какой порядок пре-модификаторов верен?', options: ['a scientific groundbreaking discovery', 'a groundbreaking scientific discovery', 'a discovery scientific groundbreaking', 'a scientific discovery groundbreaking'], answer: 'a groundbreaking scientific discovery' },
      { question: '"The proposal submitted by the team" — "submitted by the team" — это:', options: ['пре-модификатор', 'пост-модификатор (причастный)', 'аппозитив', 'именное придаточное'], answer: 'пост-модификатор (причастный)' },
    ],
  },

  {
    id: 'c1-1-92', level: 'C1', block: 1, blockName: 'Сложные конструкции', order: 92,
    title: 'Advanced passives', duration: '20 мин',
    theory: {
      explanation: 'Продвинутый пассивный залог:\n\n1. Пассив с глаголами мнения (reporting verbs):\n   It is said that... / He is said to be...\n   It is believed that... / She is believed to have...\n\n2. Пассив в составных временах:\n   The report is being written. (Pr Prog Passive)\n   It should have been done. (Modal Perfect Passive)\n\n3. Get-passive (разговорный):\n   She got promoted last year.\n   He got arrested.\n\n4. Double passive (редко):\n   The students were seen to leave.',
      examples: [
        { english: 'It is believed that the company will merge.', russian: 'Считается, что компания слиянется.' },
        { english: 'He is thought to be the best in his field.', russian: 'Считается, что он лучший в своей области.' },
        { english: 'She is said to have discovered the treatment.', russian: 'Говорят, что она открыла лечение.' },
        { english: 'The building is being demolished.', russian: 'Здание сносится (прямо сейчас).' },
        { english: 'She got promoted last month.', russian: 'В прошлом месяце её повысили.' },
        { english: 'It should have been finished by now.', russian: 'К этому времени это должно было быть закончено.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'It ___ believed that prices will rise.', answer: 'is' },
      { type: 'multiple_choice', question: '"He is said to be wealthy." = ?', options: ['Он говорит, что богат.', 'Говорят, что он богат.', 'Он сказал, что богат.', 'Ему говорят быть богатым.'], answer: 'Говорят, что он богат.' },
      { type: 'fill_blank', question: 'She is thought ___ have won the prize.', answer: 'to' },
      { type: 'multiple_choice', question: '"She got fired." — это пример:', options: ['официального пассива', 'get-пассива (разговорный)', 'double passive', 'пассива с reporting verb'], answer: 'get-пассива (разговорный)' },
      { type: 'multiple_choice', question: '"It should have been done earlier." — какой пассив?', options: ['Present Simple Passive', 'Get-passive', 'Modal Perfect Passive', 'Future Passive'], answer: 'Modal Perfect Passive' },
    ],
    quiz: [
      { question: 'It ___ reported that the CEO resigned.', options: ['is', 'was', 'has', 'had'], answer: 'has been' },
      { question: '"She is believed to have left." Раскрой: ?', options: ['People believe she is leaving.', 'People believe she left.', 'People believed she had left.', 'People believe she has left/left.'], answer: 'People believe she has left/left.' },
      { question: '"The proposal is being reviewed." — время:', options: ['Present Simple Passive', 'Present Progressive Passive', 'Present Perfect Passive', 'Past Progressive Passive'], answer: 'Present Progressive Passive' },
      { question: 'He ___ promoted recently. (get-passive)', options: ['was', 'got', 'has', 'had'], answer: 'got' },
      { question: 'It is ___ that he is innocent.', options: ['believe', 'believed', 'believing', 'to believe'], answer: 'believed' },
    ],
  },

  {
    id: 'c1-1-93', level: 'C1', block: 1, blockName: 'Сложные конструкции', order: 93,
    title: 'Nominalization', duration: '20 мин',
    theory: {
      explanation: 'Номинализация = превращение глаголов/прилагательных в существительные.\nХарактерна для академического и формального стиля.\n\nГлагол → Существительное:\ndecide → decision; develop → development; analyse → analysis\ndiscover → discovery; achieve → achievement; argue → argument\n\nПрилагательное → Существительное:\naccurate → accuracy; efficient → efficiency; important → importance\n\nПример:\nРазговорное: "Scientists discovered that...\nАкадемическое: "The discovery of... was significant."',
      examples: [
        { english: 'The development of new technologies has transformed communication.', russian: 'Развитие новых технологий преобразило общение.' },
        { english: 'Their analysis of the data revealed trends.', russian: 'Их анализ данных выявил тенденции.' },
        { english: 'The achievement of these goals required effort.', russian: 'Достижение этих целей потребовало усилий.' },
        { english: 'The accuracy of the results was questioned.', russian: 'Точность результатов была поставлена под сомнение.' },
        { english: 'There was a significant improvement in performance.', russian: 'Наблюдалось значительное улучшение показателей.' },
        { english: 'The decision to invest was unanimous.', russian: 'Решение об инвестировании было единогласным.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Номинализация глагола "decide":', options: ['decision', 'decisive', 'decidedly', 'decided'], answer: 'decision' },
      { type: 'multiple_choice', question: 'Номинализация прилагательного "efficient":', options: ['efficiently', 'efficiency', 'efficienting', 'efficiented'], answer: 'efficiency' },
      { type: 'fill_blank', question: 'Глагол "achieve" → существительное: ___', answer: 'achievement' },
      { type: 'multiple_choice', question: 'Зачем нужна номинализация?', options: ['В разговорной речи', 'В академическом/формальном стиле', 'Только в пассивном залоге', 'Для эмоциональности'], answer: 'В академическом/формальном стиле' },
      { type: 'fill_blank', question: 'Глагол "discover" → существительное: ___', answer: 'discovery' },
    ],
    quiz: [
      { question: '"Argue" → существительное:', options: ['arguer', 'arguing', 'argument', 'arguement'], answer: 'argument' },
      { question: '"Important" → существительное:', options: ['importantly', 'importantness', 'importance', 'importation'], answer: 'importance' },
      { question: 'Формальный эквивалент "They improved the process":...', options: ['They improve the process.', 'There was an improvement in the process.', 'Improving the process happened.', 'Process improvement them.'], answer: 'There was an improvement in the process.' },
      { question: '"Develop" → существительное:', options: ['developer', 'development', 'developing', 'developed'], answer: 'development' },
      { question: 'Номинализация делает текст...', options: ['менее формальным', 'более формальным и сжатым', 'более эмоциональным', 'более разговорным'], answer: 'более формальным и сжатым' },
    ],
  },

  {
    id: 'c1-1-94', level: 'C1', block: 1, blockName: 'Сложные конструкции', order: 94,
    title: 'Ellipsis and substitution', duration: '20 мин',
    theory: {
      explanation: 'ЭЛЛИПСИС = пропуск слов, которые уже известны из контекста.\n"Are you coming?" "I hope so." (= I hope I am coming)\n"You should call her." "I know I should." (= I know I should call her)\n\nЗАМЕНА (Substitution) = использование местоимений/заменителей:\nSO: "Do you think it will rain?" "I think so."\nNOT: "Will he come?" "I hope not."\nDO SO: "He promised to help, and he did so."\nONE/ONES: "Which shirt? The blue one."',
      examples: [
        { english: '"Will it rain?" "I hope not."', russian: '"Будет ли дождь?" "Надеюсь, нет."' },
        { english: '"Is she coming?" "I think so."', russian: '"Она придёт?" "Думаю, да."' },
        { english: '"Shall I help?" "Please do."', russian: '"Мне помочь?" "Пожалуйста."' },
        { english: 'He wanted to leave, and so did she.', russian: 'Он хотел уйти, и она тоже.' },
        { english: 'I\'ve met him, but my sister hasn\'t.', russian: 'Я с ним встречался(лась), а моя сестра — нет.' },
        { english: '"Which cake do you want?" "The chocolate one."', russian: '"Какой торт тебе?" "Шоколадный."' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Will it be cold?" "I hope ___."', options: ['yes', 'so', 'it', 'that'], answer: 'so' },
      { type: 'multiple_choice', question: '"Will they cancel?" "I hope ___." (нет)', options: ['not', 'no', 'so not', 'not so'], answer: 'not' },
      { type: 'fill_blank', question: '"Which book?" "The red ___."', answer: 'one' },
      { type: 'multiple_choice', question: '"He left early, and so ___ she."', options: ['do', 'did', 'does', 'has'], answer: 'did' },
      { type: 'multiple_choice', question: 'Эллипсис — это:', options: ['добавление лишних слов', 'пропуск слов, понятных из контекста', 'номинализация', 'инверсия'], answer: 'пропуск слов, понятных из контекста' },
    ],
    quiz: [
      { question: '"Are you hungry?" "I believe ___."', options: ['it', 'so', 'yes', 'that'], answer: 'so' },
      { question: '"Will she agree?" "I doubt ___."', options: ['it', 'so', 'not so', 'that not'], answer: 'so' },
      { question: '"Which jacket?" "The leather ___."', options: ['one', 'jacket', 'it', 'ones'], answer: 'one' },
      { question: '"She passed, and I ___ too."', options: ['passed', 'did', 'had', 'have'], answer: 'did' },
      { question: '"I promised to help, and I ___ so."', options: ['made', 'had', 'did', 'got'], answer: 'did' },
    ],
  },

  {
    id: 'c1-1-95', level: 'C1', block: 1, blockName: 'Сложные конструкции', order: 95,
    title: 'C1 Итоговое повторение', duration: '30 мин',
    theory: {
      explanation: 'Финальное повторение всего курса (A1–C1):\n\nA1-A2: времена (Simple, Progressive, Perfect), модальные, условные\nB1: условные (2-3-й), косвенная речь, пассив, модальные выводы\nB2: инверсия, расщеплённые предложения, придаточные, сослагательное\nC1: сложные именные группы, продвинутый пассив, номинализация, эллипсис\n\nЦель: свободное использование всех конструкций в контексте.',
      examples: [
        { english: 'Had they invested earlier, they would have profited significantly.', russian: 'Если бы они инвестировали раньше, они бы значительно выиграли.' },
        { english: 'It is believed that the merger will be completed next quarter.', russian: 'Считается, что слияние будет завершено в следующем квартале.' },
        { english: 'Never has such a discovery been made in this field.', russian: 'Никогда в этой области не было сделано такого открытия.' },
        { english: 'The committee suggested that the proposal be revised.', russian: 'Комитет предложил пересмотреть предложение.' },
        { english: 'Having analysed the data, the team presented their findings.', russian: 'Проанализировав данные, команда представила свои выводы.' },
        { english: 'What the research revealed was the importance of early intervention.', russian: 'То, что выявило исследование, — важность раннего вмешательства.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Had they left earlier, they wouldn\'t have been late." = ?', options: ['If they left earlier, they won\'t be late.', 'If they had left earlier, they wouldn\'t have been late.', 'If they leave earlier, they wouldn\'t be late.', 'If they would leave, they won\'t be late.'], answer: 'If they had left earlier, they wouldn\'t have been late.' },
      { type: 'fill_blank', question: 'It is ___ that the results are significant.', answer: 'believed', hint: 'пассив с reporting verb' },
      { type: 'multiple_choice', question: '"Never ___ such talent been seen before."', options: ['has', 'have', 'had', 'did'], answer: 'has' },
      { type: 'fill_blank', question: 'The committee recommended that she ___ promoted.', answer: 'be', hint: 'субъюнктив после recommend' },
      { type: 'multiple_choice', question: '"Having completed the project" означает:', options: ['во время завершения', 'до завершения (Perfect Participle)', 'после завершения (Perfect Participle)', 'по причине завершения'], answer: 'после завершения (Perfect Participle)' },
    ],
    quiz: [
      { question: '"Not only did she win, but she also broke the record." — структура:', options: ['Emphatic inversion', 'Cleft sentence', 'Passive voice', 'Nominalization'], answer: 'Emphatic inversion' },
      { question: '"The development of AI" — "development" — это:', options: ['глагол', 'прилагательное', 'номинализация глагола "develop"', 'причастие'], answer: 'номинализация глагола "develop"' },
      { question: '"It is thought to be the best option." Развернуть:', options: ['People think it is the best option.', 'It thinks it is best.', 'They thought it best.', 'Best option is thought.'], answer: 'People think it is the best option.' },
      { question: '"Were she to apply, she\'d get the job." — это:', options: ['Third Conditional', 'Inverted Second Conditional', 'Mixed Conditional', 'Zero Conditional'], answer: 'Inverted Second Conditional' },
      { question: '"What I need is a break." — тип конструкции:', options: ['It-cleft', 'Wh-cleft (pseudo-cleft)', 'Emphatic inversion', 'Nominalization'], answer: 'Wh-cleft (pseudo-cleft)' },
      { question: '"I think so" — "so" заменяет...', options: ['существительное', 'предложение/целую мысль', 'прилагательное', 'наречие'], answer: 'предложение/целую мысль' },
      { question: 'C1 номинализация: "He decided" → формально:', options: ['His deciding was formal.', 'His decision was made.', 'He made deciding.', 'A decision made he.'], answer: 'His decision was made.' },
      { question: 'Субъюнктив после "suggest": "I suggest that he ___ early."', options: ['leaves', 'leave', 'left', 'will leave'], answer: 'leave' },
      { question: '"The data collected suggests a positive trend." — "collected" — это:', options: ['Present Participle', 'Past Participle (пост-модификатор)', 'Perfect Participle', 'Герундий'], answer: 'Past Participle (пост-модификатор)' },
      { question: '"In spite of being tired, she finished." — "being tired" — это:', options: ['придаточное с although', 'герундий после despite/in spite of', 'причастный оборот', 'инфинитивный оборот'], answer: 'герундий после despite/in spite of' },
    ],
  },

  // ─── A2 Block 5: В путешествии ────────────────────────────────────────────
  {
    id: 'a2-5-1', level: 'A2', block: 5, blockName: 'В путешествии', order: 1,
    title: 'Бронирование гостиницы', duration: '15 мин',
    theory: {
      explanation: 'Когда мы путешествуем, нам часто нужно забронировать номер в гостинице. На английском слово «бронирование» — reservation или booking. Когда приезжаешь, делаешь check-in (заселение), а когда уезжаешь — check-out (выселение). Типы номеров: single room (одноместный), double room (двухместный с одной кроватью), twin room (двухместный с двумя кроватями), suite (люкс). Ресепшионист — receptionist, стойка регистрации — reception desk. Если есть свободные номера — vacancy. Залог за номер — deposit. Полезные фразы: "I\'d like to book a room for two nights" (хочу забронировать номер на две ночи), "Do you have any rooms available?" (есть ли свободные номера?), "What\'s the check-out time?" (в какое время выселение?). Завтрак может быть включён в стоимость — breakfast included. Часто спрашивают: "Is Wi-Fi included?" (Wi-Fi включён?). Гостиницы классифицируются по звёздам: от одной до пяти.',
      examples: [
        { english: 'I\'d like to make a reservation for a double room.', russian: 'Я хотел бы забронировать двухместный номер.' },
        { english: 'What time is check-in?', russian: 'В какое время заселение?' },
        { english: 'Is breakfast included in the price?', russian: 'Завтрак включён в стоимость?' },
        { english: 'Do you have any vacancies for this weekend?', russian: 'Есть ли у вас свободные номера на эти выходные?' },
        { english: 'We need to pay a deposit of fifty pounds.', russian: 'Нам нужно внести залог в размере пятидесяти фунтов.' },
        { english: 'Could I have a room with a sea view, please?', russian: 'Можно мне номер с видом на море, пожалуйста?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'When you arrive at the hotel, you do ___-in.', answer: 'check', hint: 'check-in = заселение' },
      { type: 'multiple_choice', question: 'A room with two separate beds is called a:', options: ['double room', 'twin room', 'single room', 'suite'], answer: 'twin room' },
      { type: 'fill_blank', question: 'I\'d like to ___ a room for three nights.', answer: 'book', hint: 'book = забронировать' },
      { type: 'multiple_choice', question: 'The person at the hotel desk is the:', options: ['manager', 'receptionist', 'porter', 'concierge'], answer: 'receptionist' },
      { type: 'fill_blank', question: 'Is Wi-Fi ___ in the price?', answer: 'included', hint: 'included = включён' },
    ],
    quiz: [
      { question: '"Check-out" means:', options: ['arriving at the hotel', 'leaving the hotel', 'booking a room', 'paying a deposit'], answer: 'leaving the hotel' },
      { question: 'A "single room" is:', options: ['a room for two people', 'a room for one person', 'a luxury room', 'a room with two beds'], answer: 'a room for one person' },
      { question: '"Vacancy" means:', options: ['a full hotel', 'an available room', 'a hotel deposit', 'a hotel receipt'], answer: 'an available room' },
      { question: 'How do you say "залог" in English?', options: ['receipt', 'vacancy', 'deposit', 'suite'], answer: 'deposit' },
      { question: '"I\'d like to make a ___." (бронирование)', options: ['reservation', 'reception', 'vacancy', 'deposit'], answer: 'reservation' },
      { question: 'A "suite" is:', options: ['a cheap room', 'a shared room', 'a luxury room', 'a twin room'], answer: 'a luxury room' },
    ],
  },

  {
    id: 'a2-5-2', level: 'A2', block: 5, blockName: 'В путешествии', order: 2,
    title: 'Как спросить дорогу', duration: '15 мин',
    theory: {
      explanation: 'Умение спросить и объяснить дорогу — важный навык. Основные направления: left (налево), right (направо), straight on или straight ahead (прямо). Поворачивать — turn: "Turn left at the traffic lights" (повернуть налево на светофоре). Перекрёсток — crossroads или junction, угол — corner, светофор — traffic lights, кольцевая развязка — roundabout, зебра/пешеходный переход — zebra crossing, мост — bridge. Расстояние: "It\'s about five minutes on foot" (примерно пять минут пешком), "It\'s two blocks away" (два квартала отсюда). Ориентиры: "opposite the bank" (напротив банка), "next to the supermarket" (рядом с супермаркетом), "between the café and the post office" (между кафе и почтой). Полезные выражения: "Excuse me, could you tell me the way to...?" (простите, не могли бы вы сказать, как пройти к...?), "You can\'t miss it" (вы это точно не пропустите).',
      examples: [
        { english: 'Turn left at the traffic lights.', russian: 'Повернуть налево на светофоре.' },
        { english: 'Go straight on until you reach the roundabout.', russian: 'Идти прямо до кольцевой развязки.' },
        { english: 'The station is opposite the supermarket.', russian: 'Станция находится напротив супермаркета.' },
        { english: 'Take the first turning on the right.', russian: 'Возьмите первый поворот направо.' },
        { english: 'It\'s about ten minutes\' walk from here.', russian: 'Это примерно десять минут ходьбы отсюда.' },
        { english: 'Excuse me, how do I get to the city centre?', russian: 'Простите, как мне добраться до центра города?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Turn right" means:', options: ['повернуть налево', 'повернуть направо', 'идти прямо', 'остановиться'], answer: 'повернуть направо' },
      { type: 'fill_blank', question: 'Go ___ on until you see the bank.', answer: 'straight', hint: 'straight on = прямо' },
      { type: 'multiple_choice', question: '"Traffic lights" — это:', options: ['перекрёсток', 'светофор', 'пешеходный переход', 'кольцевая развязка'], answer: 'светофор' },
      { type: 'fill_blank', question: 'The café is ___ to the museum.', answer: 'next', hint: 'next to = рядом с' },
      { type: 'multiple_choice', question: 'A "roundabout" is:', options: ['a straight road', 'a circular junction', 'a bridge', 'a traffic light'], answer: 'a circular junction' },
    ],
    quiz: [
      { question: 'How do you ask for directions politely?', options: ['"Where is it?"', '"Tell me the way!"', '"Excuse me, could you tell me the way to...?"', '"Go left!"'], answer: '"Excuse me, could you tell me the way to...?"' },
      { question: '"Opposite" means:', options: ['рядом', 'напротив', 'за углом', 'между'], answer: 'напротив' },
      { question: '"Take the first turning on the right" means:', options: ['идти прямо', 'повернуть на первом правом повороте', 'остановиться у светофора', 'перейти дорогу'], answer: 'повернуть на первом правом повороте' },
      { question: '"Crossroads" — это:', options: ['светофор', 'перекрёсток', 'мост', 'угол'], answer: 'перекрёсток' },
      { question: '"You can\'t miss it" means:', options: ['вы заблудитесь', 'это легко найти', 'это далеко', 'спросите кого-нибудь'], answer: 'это легко найти' },
    ],
  },

  {
    id: 'a2-5-3', level: 'A2', block: 5, blockName: 'В путешествии', order: 3,
    title: 'В аэропорту', duration: '15 мин',
    theory: {
      explanation: 'Путешествие на самолёте начинается с аэропорта. Стойка регистрации — check-in desk. Посадочный талон — boarding pass. Паспортный контроль — passport control. Таможня — customs. Зона вылета — departures, прилёта — arrivals. Выход на посадку — gate. Ручная кладь — hand luggage или carry-on. Зарегистрированный багаж — checked baggage. Вес багажа — baggage allowance (норма). Рейс может быть задержан — delayed или отменён — cancelled. Объявление посадки — boarding announcement. "Final call" означает последний призыв на посадку. Стыковочный рейс — connecting flight, пересадка — transit. Дьюти-фри — duty-free shop (магазин беспошлинной торговли). Посадка заканчивается — "Boarding is now complete." При потере багажа нужно обратиться в lost property или baggage claim office.',
      examples: [
        { english: 'Please have your boarding pass ready.', russian: 'Пожалуйста, приготовьте посадочный талон.' },
        { english: 'The flight has been delayed by two hours.', russian: 'Рейс задержан на два часа.' },
        { english: 'Proceed to gate 14 for boarding.', russian: 'Пройдите к выходу 14 для посадки.' },
        { english: 'Your hand luggage must not exceed 10 kg.', russian: 'Ваша ручная кладь не должна превышать 10 кг.' },
        { english: 'Do you have anything to declare at customs?', russian: 'Есть ли у вас что-либо для декларирования на таможне?' },
        { english: 'This is the final call for passengers on flight BA204.', russian: 'Это последний призыв для пассажиров рейса BA204.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Boarding pass" — это:', options: ['паспорт', 'посадочный талон', 'виза', 'билет на поезд'], answer: 'посадочный талон' },
      { type: 'fill_blank', question: 'The flight is ___. It will leave two hours late.', answer: 'delayed', hint: 'задержан' },
      { type: 'multiple_choice', question: '"Hand luggage" is:', options: ['зарегистрированный багаж', 'ручная кладь', 'потерянный багаж', 'сверхгабаритный груз'], answer: 'ручная кладь' },
      { type: 'fill_blank', question: 'Please go to ___ 7 for your flight.', answer: 'gate', hint: 'выход на посадку' },
      { type: 'multiple_choice', question: '"Customs" — это:', options: ['пограничный контроль', 'таможня', 'регистрация', 'зона прилёта'], answer: 'таможня' },
    ],
    quiz: [
      { question: '"Departures" is the area for:', options: ['arriving passengers', 'departing passengers', 'customs officers', 'baggage handlers'], answer: 'departing passengers' },
      { question: 'What does "final call" mean?', options: ['первое объявление', 'последнее объявление перед посадкой', 'отмена рейса', 'задержка рейса'], answer: 'последнее объявление перед посадкой' },
      { question: '"Checked baggage" is:', options: ['ручная кладь', 'зарегистрированный багаж', 'потерянный багаж', 'сверхнормативный багаж'], answer: 'зарегистрированный багаж' },
      { question: 'A "connecting flight" means:', options: ['прямой рейс', 'рейс с пересадкой', 'чартерный рейс', 'задержанный рейс'], answer: 'рейс с пересадкой' },
      { question: '"Passport control" — это:', options: ['таможня', 'регистрация', 'паспортный контроль', 'зона duty-free'], answer: 'паспортный контроль' },
    ],
  },

  {
    id: 'a2-5-4', level: 'A2', block: 5, blockName: 'В путешествии', order: 4,
    title: 'Транспорт', duration: '15 мин',
    theory: {
      explanation: 'Городской и межгородской транспорт на английском. Автобус — bus, поезд — train, такси — taxi или cab, метро — underground (в Лондоне), subway (в США), или metro. Трамвай — tram, паром — ferry. Станция — station, платформа — platform, перрон тоже platform. Стоимость проездного — fare. Билет в одну сторону — single ticket, в обе стороны — return ticket. Остановка — stop (для автобуса), station (для метро/поезда). Расписание — timetable или schedule. Час пик — rush hour. Опоздать на автобус — miss the bus. Пересадка — change: "Change at Victoria" (пересадка на станции Виктория). Проездной — travel card или pass. Водитель автобуса — bus driver, машинист поезда — train driver или motorman. Такси можно поймать на улице (hail a taxi) или заказать заранее. Ride-sharing apps — приложения для совместных поездок.',
      examples: [
        { english: 'Which platform does the train to Edinburgh leave from?', russian: 'С какой платформы отправляется поезд до Эдинбурга?' },
        { english: 'I\'d like a return ticket to Oxford, please.', russian: 'Мне, пожалуйста, билет туда и обратно до Оксфорда.' },
        { english: 'The last bus leaves at midnight.', russian: 'Последний автобус уходит в полночь.' },
        { english: 'You need to change at King\'s Cross.', russian: 'Вам нужно пересесть на станции Кинг-Кросс.' },
        { english: 'The tube is faster than the bus during rush hour.', russian: 'Метро быстрее автобуса в час пик.' },
        { english: 'How much is the fare to the city centre?', russian: 'Сколько стоит проезд до центра города?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Rush hour" — это:', options: ['время отдыха', 'час пик', 'ночной рейс', 'скоростной поезд'], answer: 'час пик' },
      { type: 'fill_blank', question: 'A ___ ticket takes you there and back.', answer: 'return', hint: 'туда и обратно' },
      { type: 'multiple_choice', question: '"Platform" — это:', options: ['расписание', 'билет', 'перрон/платформа', 'вагон'], answer: 'перрон/платформа' },
      { type: 'fill_blank', question: 'You need to ___ at the next station to get on the Circle Line.', answer: 'change', hint: 'пересесть' },
      { type: 'multiple_choice', question: '"Fare" — это:', options: ['расписание', 'остановка', 'стоимость проезда', 'билет'], answer: 'стоимость проезда' },
    ],
    quiz: [
      { question: 'A "single ticket" is:', options: ['билет для одного человека', 'билет только в одну сторону', 'проездной на месяц', 'билет для двоих'], answer: 'билет только в одну сторону' },
      { question: '"The underground" in London is also called:', options: ['the bus', 'the tram', 'the tube', 'the ferry'], answer: 'the tube' },
      { question: '"Miss the bus" means:', options: ['найти автобус', 'опоздать на автобус', 'доехать до остановки', 'сесть в автобус'], answer: 'опоздать на автобус' },
      { question: '"Timetable" — это:', options: ['расписание', 'стоимость', 'маршрут', 'остановка'], answer: 'расписание' },
      { question: 'How do you ask a taxi driver to stop? You "hail" a taxi when you want to:', options: ['pay', 'stop it', 'flag it down on the street', 'book it online'], answer: 'flag it down on the street' },
    ],
  },

  {
    id: 'a2-5-5', level: 'A2', block: 5, blockName: 'В путешествии', order: 5,
    title: 'Описание города', duration: '15 мин',
    theory: {
      explanation: 'Для описания расположения мест в городе используются специальные конструкции и предлоги. Конструкция "There is / There are" означает «есть» или «находится»: "There is a café near the station" (рядом со станцией есть кафе). Предлоги места: near (рядом), opposite (напротив), between (между), next to (рядом с), in front of (перед), behind (за/позади), on the corner of (на углу). В центре — in the centre, на окраине — on the outskirts. Достопримечательности — sights, исторический центр — old town, торговый центр — shopping centre/mall, парк — park, площадь — square, набережная — embankment/waterfront. Главная улица — high street или main street. Описывая город: "It\'s a lively city" (оживлённый город), "There\'s plenty to do" (есть чем заняться), "It\'s famous for its architecture" (знаменит своей архитектурой). Пригород — suburb, деревня — village, небольшой городок — town.',
      examples: [
        { english: 'There is a beautiful park in the centre of the city.', russian: 'В центре города есть красивый парк.' },
        { english: 'The museum is opposite the main square.', russian: 'Музей находится напротив главной площади.' },
        { english: 'There are lots of restaurants between the theatre and the river.', russian: 'Между театром и рекой много ресторанов.' },
        { english: 'The hotel is next to the train station.', russian: 'Гостиница находится рядом с железнодорожным вокзалом.' },
        { english: 'The city is famous for its medieval architecture.', russian: 'Город знаменит своей средневековой архитектурой.' },
        { english: 'On the corner of Main Street and Park Avenue there is a post office.', russian: 'На углу Главной улицы и Парк авеню находится почта.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'There ___ a supermarket near my house.', answer: 'is', hint: 'There is + единственное число' },
      { type: 'multiple_choice', question: '"Opposite" means:', options: ['рядом', 'напротив', 'между', 'позади'], answer: 'напротив' },
      { type: 'fill_blank', question: 'The bank is ___ the café and the pharmacy.', answer: 'between', hint: 'между двумя местами' },
      { type: 'multiple_choice', question: '"In the centre" describes:', options: ['окраину', 'пригород', 'центр', 'деревню'], answer: 'центр' },
      { type: 'fill_blank', question: 'There ___ many things to do in this city.', answer: 'are', hint: 'There are + множественное число' },
    ],
    quiz: [
      { question: '"There is a park" — how to say this about TWO parks?', options: ['There is two parks', 'There are two parks', 'There have two parks', 'There be two parks'], answer: 'There are two parks' },
      { question: '"Next to" means:', options: ['напротив', 'между', 'рядом с', 'за'], answer: 'рядом с' },
      { question: '"The outskirts" of a city are:', options: ['центр', 'площадь', 'окраина', 'набережная'], answer: 'окраина' },
      { question: '"High street" is:', options: ['высокая улица', 'главная торговая улица', 'набережная', 'переулок'], answer: 'главная торговая улица' },
      { question: 'Complete: "The city is ___ for its old castle."', options: ['known', 'famous', 'popular', 'All of the above'], answer: 'All of the above' },
    ],
  },

  // ─── A2 Block 6: Работа и учёба ────────────────────────────────────────────
  {
    id: 'a2-6-1', level: 'A2', block: 6, blockName: 'Работа и учёба', order: 1,
    title: 'Профессии', duration: '15 мин',
    theory: {
      explanation: 'Знание названий профессий на английском очень важно как в повседневном общении, так и на экзаменах. Чтобы сказать, кем работает человек, используется глагол "be" + профессия: "She is a doctor" (она врач). Или глагол "work as": "He works as an engineer" (он работает инженером). Вопрос "What do you do?" означает «Кем вы работаете?» или «Чем занимаетесь?». Распространённые профессии: teacher (учитель), doctor (врач), engineer (инженер), nurse (медсестра/медбрат), lawyer (юрист/адвокат), accountant (бухгалтер), manager (менеджер), programmer (программист), chef (шеф-повар), pilot (пилот), driver (водитель), architect (архитектор), journalist (журналист), designer (дизайнер), scientist (учёный). Место работы: office (офис), hospital (больница), school (школа), factory (завод), lab (лаборатория). Неполная занятость — part-time, полная — full-time.',
      examples: [
        { english: 'She is a nurse at the city hospital.', russian: 'Она медсестра в городской больнице.' },
        { english: 'What do you do for a living?', russian: 'Чем вы зарабатываете на жизнь?' },
        { english: 'He works as a software engineer at a tech company.', russian: 'Он работает программистом в технологической компании.' },
        { english: 'My sister is studying to be a lawyer.', russian: 'Моя сестра учится на юриста.' },
        { english: 'I work part-time as a designer.', russian: 'Я работаю неполный рабочий день дизайнером.' },
        { english: 'The chef at this restaurant is very talented.', russian: 'Шеф-повар в этом ресторане очень талантлив.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"What do you do?" means:', options: ['Что ты делаешь сейчас?', 'Кем ты работаешь?', 'Что тебе нравится?', 'Куда ты идёшь?'], answer: 'Кем ты работаешь?' },
      { type: 'fill_blank', question: 'She works ___ a doctor at the hospital.', answer: 'as', hint: 'work as + профессия' },
      { type: 'multiple_choice', question: 'An "accountant" works with:', options: ['patients', 'money and finances', 'buildings', 'computers only'], answer: 'money and finances' },
      { type: 'fill_blank', question: 'He is ___ engineer. He designs bridges.', answer: 'an', hint: 'артикль перед гласной' },
      { type: 'multiple_choice', question: '"Part-time" means:', options: ['полный рабочий день', 'неполный рабочий день', 'сверхурочная работа', 'работа из дома'], answer: 'неполный рабочий день' },
    ],
    quiz: [
      { question: 'A "pilot" works:', options: ['in a hospital', 'in a school', 'on a plane', 'in an office'], answer: 'on a plane' },
      { question: 'How do you say "юрист" in English?', options: ['accountant', 'engineer', 'lawyer', 'journalist'], answer: 'lawyer' },
      { question: '"She is a teacher." To ask about her profession:', options: ['"What does she do?"', '"Where does she go?"', '"How does she work?"', '"When does she work?"'], answer: '"What does she do?"' },
      { question: '"Full-time" means:', options: ['неполный день', 'полный рабочий день', 'удалённая работа', 'временная работа'], answer: 'полный рабочий день' },
      { question: 'A "chef" works in:', options: ['a hospital', 'a school', 'a restaurant or kitchen', 'an office'], answer: 'a restaurant or kitchen' },
    ],
  },

  {
    id: 'a2-6-2', level: 'A2', block: 6, blockName: 'Работа и учёба', order: 2,
    title: 'Рассказ о работе', duration: '15 мин',
    theory: {
      explanation: 'Чтобы рассказать о своей работе на английском, используются несколько конструкций. "I work at/for/in" — я работаю в...: "I work at Google" (в Google), "I work for a small company" (в небольшой компании), "I work in marketing" (в маркетинге). Глагол "deal with" означает «иметь дело с», «заниматься»: "I deal with customer complaints" (я занимаюсь жалобами клиентов). "I\'m responsible for" — я отвечаю за: "I\'m responsible for training new staff" (я отвечаю за обучение новых сотрудников). "My job involves" — моя работа включает: "My job involves a lot of travelling" (моя работа предполагает много командировок). "I report to" — я подчиняюсь: "I report to the head of department" (я подчиняюсь руководителю отдела). Коллеги — colleagues или workmates, начальник — boss или manager, подчинённый — subordinate. Совещание — meeting, дедлайн — deadline, проект — project.',
      examples: [
        { english: 'I work for an international company in the finance sector.', russian: 'Я работаю в международной компании в финансовом секторе.' },
        { english: 'My job involves meeting clients and preparing reports.', russian: 'Моя работа включает встречи с клиентами и подготовку отчётов.' },
        { english: 'I\'m responsible for managing the social media accounts.', russian: 'Я отвечаю за управление аккаунтами в социальных сетях.' },
        { english: 'I deal with customer queries every day.', russian: 'Я каждый день занимаюсь вопросами клиентов.' },
        { english: 'I report directly to the CEO.', russian: 'Я напрямую подчиняюсь генеральному директору.' },
        { english: 'We have a team meeting every Monday morning.', russian: 'У нас командное совещание каждое утро в понедельник.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"I work ___ a big bank." (в большом банке)', options: ['in', 'at', 'for', 'All correct'], answer: 'All correct' },
      { type: 'fill_blank', question: 'My job ___ dealing with customer complaints.', answer: 'involves', hint: 'моя работа включает' },
      { type: 'multiple_choice', question: '"I\'m responsible ___" is followed by:', options: ['to + infinitive', 'for + gerund', 'with + noun', 'at + noun'], answer: 'for + gerund' },
      { type: 'fill_blank', question: 'I ___ to the marketing director.', answer: 'report', hint: 'подчиняюсь / отчитываюсь' },
      { type: 'multiple_choice', question: '"I deal with" means:', options: ['я занимаюсь / работаю с', 'я отвечаю за', 'я подчиняюсь', 'я участвую'], answer: 'я занимаюсь / работаю с' },
    ],
    quiz: [
      { question: 'Which sentence is correct?', options: ['I work at finance.', 'I work in finance.', 'I work on finance.', 'I work by finance.'], answer: 'I work in finance.' },
      { question: '"My job involves a lot of travelling." "Involves" is followed by:', options: ['infinitive', 'gerund (-ing)', 'past tense', 'noun only'], answer: 'gerund (-ing)' },
      { question: '"I\'m responsible for the project." What does this mean?', options: ['Я интересуюсь проектом', 'Я отвечаю за проект', 'Я завершил проект', 'Я начал проект'], answer: 'Я отвечаю за проект' },
      { question: '"Colleagues" means:', options: ['клиенты', 'начальники', 'коллеги', 'подчинённые'], answer: 'коллеги' },
      { question: '"I report to the manager." "Report to" means:', options: ['сообщать менеджеру новости', 'писать отчёты для менеджера', 'подчиняться менеджеру', 'встречаться с менеджером'], answer: 'подчиняться менеджеру' },
    ],
  },

  {
    id: 'a2-6-3', level: 'A2', block: 6, blockName: 'Работа и учёба', order: 3,
    title: 'Школьная лексика', duration: '15 мин',
    theory: {
      explanation: 'Для общения об учёбе нужно знать школьную лексику. Предмет — subject: mathematics (математика), English (английский), history (история), science (естественные науки), geography (география), art (изобразительное искусство), PE/physical education (физкультура), music (музыка). Урок — lesson или class. Домашнее задание — homework, контрольная работа — test, экзамен — exam или examination. Оценка — grade или mark: "I got an A" (получил отличную оценку). Учебный год делится на семестры — semesters или учебные четверти — terms. Одноклассник — classmate, школьная форма — school uniform, столовая — canteen или cafeteria, спортзал — gym. Расписание — timetable. Прогуливать — skip class, опаздывать — be late. Университет — university, колледж — college, степень — degree. Преподаватель в университете — lecturer или professor.',
      examples: [
        { english: 'My favourite subject is history.', russian: 'Мой любимый предмет — история.' },
        { english: 'We have a maths exam next Friday.', russian: 'В следующую пятницу у нас экзамен по математике.' },
        { english: 'Did you do your homework for science class?', russian: 'Ты сделал домашнее задание по естествознанию?' },
        { english: 'She got an A in her English test.', russian: 'Она получила отличную оценку на тесте по английскому.' },
        { english: 'The school timetable changes every semester.', russian: 'Школьное расписание меняется каждый семестр.' },
        { english: 'Our teacher set a lot of homework over the holidays.', russian: 'Наш учитель задал много домашнего задания на каникулах.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Homework" — это:', options: ['домашнее задание', 'контрольная работа', 'экзамен', 'расписание'], answer: 'домашнее задание' },
      { type: 'fill_blank', question: 'I have five ___ today: maths, English, history, PE, and art.', answer: 'lessons', hint: 'уроки' },
      { type: 'multiple_choice', question: '"Classmate" means:', options: ['учитель', 'директор', 'одноклассник', 'репетитор'], answer: 'одноклассник' },
      { type: 'fill_blank', question: 'We write a ___ at the end of the school year.', answer: 'exam', hint: 'экзамен' },
      { type: 'multiple_choice', question: '"Grade" or "mark" refers to:', options: ['предмет', 'оценка', 'урок', 'школьная форма'], answer: 'оценка' },
    ],
    quiz: [
      { question: '"PE" stands for:', options: ['Personal Education', 'Physical Education', 'Practical Engineering', 'Primary English'], answer: 'Physical Education' },
      { question: 'A "semester" is:', options: ['один урок', 'один учебный год', 'половина учебного года', 'один учебный день'], answer: 'половина учебного года' },
      { question: '"She skipped class" means:', options: ['она опоздала', 'она прыгала на уроке', 'она прогуляла урок', 'она сдала экзамен'], answer: 'она прогуляла урок' },
      { question: 'A "canteen" is:', options: ['спортивный зал', 'столовая', 'библиотека', 'класс'], answer: 'столовая' },
      { question: '"Getting an A" in a test means:', options: ['провалить тест', 'сдать тест нормально', 'получить отличную оценку', 'не прийти на тест'], answer: 'получить отличную оценку' },
    ],
  },

  {
    id: 'a2-6-4', level: 'A2', block: 6, blockName: 'Работа и учёба', order: 4,
    title: 'Рабочий распорядок дня', duration: '15 мин',
    theory: {
      explanation: 'Рассказывая о рабочем дне, используют фразовые глаголы и устойчивые выражения. "Start work" — начинать работу, "finish work" — заканчивать работу. "Have a meeting" — проводить/участвовать в совещании: "We have a meeting at ten" (у нас совещание в десять). "Take a break" — делать перерыв, "have lunch" — обедать. "Work overtime" — работать сверхурочно. Дедлайн — deadline: "The deadline is Friday" (дедлайн в пятницу). "Meet a deadline" — уложиться в срок. Коллеги — colleagues. Задача — task, проект — project. "Check emails" — проверять почту. "Give a presentation" — делать презентацию. "Attend a training" — проходить обучение. В конце дня можно сказать "It\'s been a busy day" (был насыщенный день) или "I wrapped up at six" (я закончил в шесть). Гибкий график — flexible hours, работа из дома — remote work или working from home.',
      examples: [
        { english: 'I usually start work at nine and finish at six.', russian: 'Я обычно начинаю работу в девять и заканчиваю в шесть.' },
        { english: 'We had three meetings today — I\'m exhausted.', russian: 'Сегодня у нас было три совещания — я устал.' },
        { english: 'Can we take a break? I need a coffee.', russian: 'Можем сделать перерыв? Мне нужен кофе.' },
        { english: 'The deadline for this report is tomorrow morning.', russian: 'Дедлайн для этого отчёта — завтра утром.' },
        { english: 'I often work overtime when we have a big project.', russian: 'Я часто работаю сверхурочно, когда у нас большой проект.' },
        { english: 'She gives a presentation to the board every quarter.', russian: 'Она делает презентацию для совета директоров каждый квартал.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I ___ work at 8:30 every morning.', answer: 'start', hint: 'начинаю работу' },
      { type: 'multiple_choice', question: '"Work overtime" means:', options: ['работать дистанционно', 'работать сверхурочно', 'взять выходной', 'работать неполный день'], answer: 'работать сверхурочно' },
      { type: 'fill_blank', question: 'We need to ___ a break. We\'ve been working for three hours.', answer: 'take', hint: 'take a break' },
      { type: 'multiple_choice', question: '"Meet a deadline" means:', options: ['пропустить срок', 'уложиться в срок', 'перенести срок', 'установить срок'], answer: 'уложиться в срок' },
      { type: 'fill_blank', question: 'She ___ a presentation to the new clients yesterday.', answer: 'gave', hint: 'give (past) a presentation' },
    ],
    quiz: [
      { question: '"Flexible hours" means:', options: ['строгий график', 'гибкий рабочий график', 'ночная смена', 'сверхурочная работа'], answer: 'гибкий рабочий график' },
      { question: '"Check emails" is something you do:', options: ['на обеде', 'at your computer/phone', 'in a meeting', 'only on Fridays'], answer: 'at your computer/phone' },
      { question: '"The deadline is Friday" means:', options: ['работа начинается в пятницу', 'нужно сдать работу до пятницы', 'в пятницу выходной', 'совещание в пятницу'], answer: 'нужно сдать работу до пятницы' },
      { question: '"I wrapped up at six" means:', options: ['я начал в шесть', 'я завернул посылку', 'я закончил работу в шесть', 'я пришёл в шесть'], answer: 'я закончил работу в шесть' },
      { question: '"Remote work" means:', options: ['тяжёлая работа', 'работа из дома/дистанционно', 'работа в офисе', 'временная работа'], answer: 'работа из дома/дистанционно' },
    ],
  },

  {
    id: 'a2-6-5', level: 'A2', block: 6, blockName: 'Работа и учёба', order: 5,
    title: 'Поиск работы', duration: '15 мин',
    theory: {
      explanation: 'Поиск работы — важная тема, связанная с реальной жизнью. CV (curriculum vitae) или resume — резюме. Cover letter — сопроводительное письмо. "Apply for a job" — подавать заявку на работу. Вакансия — vacancy или job opening. Собеседование — interview: "I have an interview tomorrow" (у меня завтра собеседование). Опыт работы — work experience. Квалификации — qualifications. Навыки — skills. Зарплата — salary или wage. Льготы — benefits: health insurance (медицинская страховка), paid holidays (оплачиваемый отпуск). "I was hired" — меня наняли, "I was fired/dismissed" — меня уволили. "Resign" — уволиться по собственному желанию. Рекрутер — recruiter, агентство по трудоустройству — employment agency. Рекомендательное письмо — reference letter. Испытательный срок — probation period.',
      examples: [
        { english: 'I applied for the marketing manager position online.', russian: 'Я подал заявку на должность менеджера по маркетингу онлайн.' },
        { english: 'Could you send me your CV and cover letter?', russian: 'Могли бы вы прислать мне своё резюме и сопроводительное письмо?' },
        { english: 'She has five years\' experience in project management.', russian: 'У неё пять лет опыта в управлении проектами.' },
        { english: 'The job offers a competitive salary and great benefits.', russian: 'Работа предлагает конкурентоспособную зарплату и хорошие льготы.' },
        { english: 'I have an interview at the bank next Thursday.', russian: 'В следующий четверг у меня собеседование в банке.' },
        { english: 'What qualifications do you need for this position?', russian: 'Какие квалификации нужны для этой должности?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Apply for a job" means:', options: ['отказаться от работы', 'подать заявку на работу', 'уволиться с работы', 'рекомендовать работу'], answer: 'подать заявку на работу' },
      { type: 'fill_blank', question: 'Please send your CV and ___ letter with your application.', answer: 'cover', hint: 'сопроводительное письмо' },
      { type: 'multiple_choice', question: '"Salary" means:', options: ['должность', 'зарплата', 'льготы', 'опыт'], answer: 'зарплата' },
      { type: 'fill_blank', question: 'She was ___ for the job after a great interview.', answer: 'hired', hint: 'наняли' },
      { type: 'multiple_choice', question: '"Benefits" at a job include:', options: ['зарплата и рабочее время', 'дополнительные льготы (страховка, отпуск)', 'должностные обязанности', 'требования к квалификации'], answer: 'дополнительные льготы (страховка, отпуск)' },
    ],
    quiz: [
      { question: '"CV" stands for:', options: ['Career Vision', 'Curriculum Vitae', 'Company Values', 'Certificate of Validity'], answer: 'Curriculum Vitae' },
      { question: '"I resigned from my job" means:', options: ['меня уволили', 'я ушёл по собственному желанию', 'я получил повышение', 'я сменил должность'], answer: 'я ушёл по собственному желанию' },
      { question: '"Qualifications" are:', options: ['личные качества', 'документы об образовании и профессиональные навыки', 'рабочий опыт только', 'рекомендательные письма'], answer: 'документы об образовании и профессиональные навыки' },
      { question: 'A "probation period" is:', options: ['испытательный срок', 'отпуск', 'период обучения', 'пенсионный период'], answer: 'испытательный срок' },
      { question: '"I was fired" means:', options: ['я получил новую работу', 'меня уволили', 'я взял отгул', 'я прошёл собеседование'], answer: 'меня уволили' },
    ],
  },
  {
    id: 'b1-5-1', level: 'B1', block: 5, blockName: 'Навыки общения', order: 1,
    title: 'Согласие и несогласие', duration: '15 мин',
    theory: {
      explanation: 'Умение выражать согласие и несогласие — ключевой навык в английском общении. Для согласия используют: "I agree with you", "That\'s a good point", "Exactly!", "Absolutely!", "You\'re right", "I couldn\'t agree more" (полностью согласен). Для частичного согласия: "I see your point, but...", "That\'s true to some extent", "I agree up to a point". Для несогласия: "I\'m afraid I disagree", "I don\'t think so", "I see it differently", "With all due respect...", "That\'s not quite right". Важно выражать несогласие вежливо, без агрессии. "I take your point, however..." — я понимаю вашу точку зрения, однако... "We\'ll have to agree to disagree" — нам придётся остаться при своих мнениях. "Fair enough" — ладно, договорились. При дебатах используйте linking words: "on the other hand", "nevertheless", "whereas".',
      examples: [
        { english: 'I completely agree with your assessment of the situation.', russian: 'Я полностью согласен с вашей оценкой ситуации.' },
        { english: 'I see your point, but I think there\'s another way to look at it.', russian: 'Я понимаю вашу точку зрения, но думаю, есть другой способ взглянуть на это.' },
        { english: 'With all due respect, I don\'t think that\'s the best solution.', russian: 'При всём уважении, я не думаю, что это лучшее решение.' },
        { english: 'That\'s a fair point — I hadn\'t thought of it that way.', russian: 'Это справедливое замечание — я не думал об этом так.' },
        { english: 'We\'ll have to agree to disagree on this one.', russian: 'По этому вопросу нам придётся остаться при своих мнениях.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"I couldn\'t agree more" means:', options: ['я совсем не согласен', 'я полностью согласен', 'я частично согласен', 'я не понимаю'], answer: 'я полностью согласен' },
      { type: 'fill_blank', question: 'I ___ your point, but I see it differently.', answer: 'take', hint: 'понимаю/принимаю' },
      { type: 'multiple_choice', question: 'Which is the most polite way to disagree?', options: ['You\'re wrong!', 'That\'s stupid.', 'With all due respect, I disagree.', 'No, that\'s not right.'], answer: 'With all due respect, I disagree.' },
      { type: 'fill_blank', question: 'That\'s true to some ___, but there are exceptions.', answer: 'extent', hint: 'степень' },
      { type: 'build_sentence', question: 'Составь предложение: agree / to / have / We\'ll / disagree', words: ['We\'ll', 'have', 'to', 'agree', 'to', 'disagree'], answer: 'We\'ll have to agree to disagree' },
    ],
    quiz: [
      { question: '"I see it differently" is used to express:', options: ['agreement', 'disagreement', 'surprise', 'confusion'], answer: 'disagreement' },
      { question: '"Fair enough" means:', options: ['несправедливо', 'ладно, договорились', 'это неправильно', 'я не согласен'], answer: 'ладно, договорились' },
      { question: '"Agree to disagree" means:', options: ['оба согласны', 'оба остаются при своих мнениях', 'один убеждает другого', 'тема закрыта'], answer: 'оба остаются при своих мнениях' },
      { question: 'Which phrase shows PARTIAL agreement?', options: ['Exactly!', 'Absolutely!', 'That\'s true to some extent.', 'I couldn\'t agree more.'], answer: 'That\'s true to some extent.' },
      { question: '"With all due respect" is used before:', options: ['compliment', 'polite disagreement', 'question', 'greeting'], answer: 'polite disagreement' },
    ],
  },
  {
    id: 'b1-5-2', level: 'B1', block: 5, blockName: 'Навыки общения', order: 2,
    title: 'Предложения и просьбы', duration: '15 мин',
    theory: {
      explanation: 'Делать предложения и просьбы вежливо — важная часть коммуникации. Предложения (Suggestions): "Why don\'t we...?", "How about...?", "What if we...?", "Shall we...?", "We could...", "I suggest that we...". Просьбы (Requests): "Could you...?", "Would you mind...?", "Would it be possible to...?", "I was wondering if you could...". Предложение помощи (Offers): "Shall I...?", "Would you like me to...?", "Can I help you with...?", "Let me...". Принятие предложения: "That sounds great!", "Good idea!", "Why not?", "I\'d love that." Отказ от предложения: "I\'d rather not", "Maybe another time", "That\'s kind of you, but...", "I\'m afraid I can\'t". "Would you mind + -ing" — не могли бы вы + инфинитив (вопрос с вежливой просьбой).',
      examples: [
        { english: 'Why don\'t we meet at the café on Saturday?', russian: 'Почему бы нам не встретиться в кафе в субботу?' },
        { english: 'Would you mind closing the window? It\'s a bit cold.', russian: 'Не могли бы вы закрыть окно? Немного холодно.' },
        { english: 'I was wondering if you could help me with this report.', russian: 'Я хотел бы узнать, не могли бы вы помочь мне с этим отчётом.' },
        { english: 'Shall I make you a cup of tea?', russian: 'Сделать вам чашку чая?' },
        { english: 'That sounds like a great idea — let\'s do it!', russian: 'Звучит как отличная идея — давайте сделаем это!' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: '___ don\'t we try a different approach?', answer: 'Why', hint: 'почему' },
      { type: 'multiple_choice', question: '"Would you mind helping me?" expects the answer:', options: ['Yes, I would mind.', 'No, not at all.', 'I mind.', 'Yes, please.'], answer: 'No, not at all.' },
      { type: 'fill_blank', question: 'Shall ___ call a taxi for you?', answer: 'I', hint: 'местоимение' },
      { type: 'multiple_choice', question: '"Maybe another time" is used to:', options: ['accept an offer', 'refuse politely', 'make a suggestion', 'ask a question'], answer: 'refuse politely' },
      { type: 'build_sentence', question: 'Составь предложение: me / Could / with / help / you / this?', words: ['Could', 'you', 'help', 'me', 'with', 'this?'], answer: 'Could you help me with this?' },
    ],
    quiz: [
      { question: '"How about going to the cinema?" is a:', options: ['request', 'suggestion', 'offer', 'complaint'], answer: 'suggestion' },
      { question: '"Would you like me to explain?" is an:', options: ['offer', 'request', 'suggestion', 'question'], answer: 'offer' },
      { question: '"I\'d rather not" means:', options: ['я бы предпочёл не делать этого', 'я хотел бы', 'я согласен', 'я не понимаю'], answer: 'я бы предпочёл не делать этого' },
      { question: 'After "Would you mind...", use:', options: ['infinitive', 'gerund (-ing)', 'past tense', 'future tense'], answer: 'gerund (-ing)' },
      { question: '"That\'s kind of you, but..." is used to:', options: ['accept offer', 'refuse politely', 'make a request', 'suggest'], answer: 'refuse politely' },
    ],
  },
  {
    id: 'b1-5-3', level: 'B1', block: 5, blockName: 'Навыки общения', order: 3,
    title: 'Извинения', duration: '15 мин',
    theory: {
      explanation: 'Умение правильно извиняться — важный социальный навык. Простые извинения: "Sorry!", "I\'m sorry", "Excuse me" (привлечь внимание или пройти). Более формальные: "I apologise for...", "I\'d like to apologise for...", "Please accept my apologies". Объяснение: "I\'m sorry, I didn\'t mean to...", "It wasn\'t intentional", "I made a mistake". Принятие извинений: "That\'s okay", "Don\'t worry about it", "No problem", "It\'s fine", "Apology accepted". Отклонение: "I\'m still upset about it", "It\'s not okay actually". "I owe you an apology" — я должен перед вами извиниться. "I shouldn\'t have..." — мне не следовало (+ глагол в inf): "I shouldn\'t have said that". "Forgive me for..." — простите меня за... На официальных мероприятиях: "I sincerely apologise for any inconvenience caused."',
      examples: [
        { english: 'I\'m really sorry for being late — there was a traffic jam.', russian: 'Мне очень жаль, что опоздал — была пробка.' },
        { english: 'Please accept my sincere apologies for the inconvenience.', russian: 'Пожалуйста, примите мои искренние извинения за неудобства.' },
        { english: 'I shouldn\'t have said that — it was wrong of me.', russian: 'Мне не следовало этого говорить — это было неправильно с моей стороны.' },
        { english: 'Don\'t worry about it — these things happen.', russian: 'Не беспокойтесь об этом — такое бывает.' },
        { english: 'I owe you an apology for how I behaved yesterday.', russian: 'Я должен извиниться перед вами за своё поведение вчера.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'Please ___ my apologies for the delay.', answer: 'accept', hint: 'принять' },
      { type: 'multiple_choice', question: '"Excuse me" is used to:', options: ['apologise deeply', 'attract attention or pass by someone', 'refuse a request', 'accept an apology'], answer: 'attract attention or pass by someone' },
      { type: 'fill_blank', question: 'I shouldn\'t ___ said that — I apologise.', answer: 'have', hint: 'вспомогательный глагол' },
      { type: 'multiple_choice', question: '"Apology accepted" means:', options: ['я не принимаю извинения', 'извинения приняты', 'мне жаль', 'это нормально'], answer: 'извинения приняты' },
      { type: 'build_sentence', question: 'Составь: you / apologise / late / for / being / I', words: ['I', 'apologise', 'for', 'being', 'late'], answer: 'I apologise for being late' },
    ],
    quiz: [
      { question: '"I sincerely apologise" is used in:', options: ['informal chat', 'formal/official situations', 'friendly conversations', 'greetings'], answer: 'formal/official situations' },
      { question: '"Don\'t worry about it" is a way to:', options: ['refuse an apology', 'accept an apology', 'make an apology', 'explain a mistake'], answer: 'accept an apology' },
      { question: '"I owe you an apology" means:', options: ['я тебе должен денег', 'я должен перед тобой извиниться', 'я принимаю твои извинения', 'я не виноват'], answer: 'я должен перед тобой извиниться' },
      { question: 'After "I shouldn\'t have...", use:', options: ['gerund', 'past participle', 'base infinitive', 'future form'], answer: 'past participle' },
      { question: '"These things happen" means:', options: ['это недопустимо', 'такое случается (успокоение)', 'объяснение ошибки', 'отказ в извинении'], answer: 'такое случается (успокоение)' },
    ],
  },
  {
    id: 'b1-5-4', level: 'B1', block: 5, blockName: 'Навыки общения', order: 4,
    title: 'Выражение чувств', duration: '15 мин',
    theory: {
      explanation: 'Выражение эмоций и чувств — важная часть общения. Основные чувства: happy (счастливый), sad (грустный), angry (злой), excited (взволнованный), nervous (нервный), disappointed (разочарованный), surprised (удивлённый), confused (сбитый с толку), proud (гордый), ashamed (стыдящийся), relieved (облегчённый), overwhelmed (подавленный). Фразы: "I feel...", "I\'m feeling...", "I\'m really...", "I can\'t help feeling...". Причина: "I feel happy because...", "I\'m excited about...", "I\'m nervous about...". Для сочувствия: "I understand how you feel", "That must be difficult", "I\'m sorry to hear that". Усилители: "absolutely thrilled" (в восторге), "utterly devastated" (полностью опустошён), "incredibly proud" (невероятно горд). Более сложные эмоции: "ambivalent" (двойственное чувство), "melancholy" (меланхолия), "apprehensive" (обеспокоенный).',
      examples: [
        { english: 'I\'m really excited about starting my new job next week.', russian: 'Я очень взволнован тем, что начну новую работу на следующей неделе.' },
        { english: 'I feel a bit nervous about the presentation tomorrow.', russian: 'Я немного нервничаю из-за завтрашней презентации.' },
        { english: 'I\'m so relieved that the exam is finally over.', russian: 'Я так рад, что экзамен наконец закончился.' },
        { english: 'I understand how you feel — it must be really tough.', russian: 'Я понимаю твои чувства — это должно быть очень тяжело.' },
        { english: 'She was absolutely thrilled when she got the promotion.', russian: 'Она была в полном восторге, когда получила повышение.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Overwhelmed" means:', options: ['счастливый', 'подавленный, перегруженный', 'злой', 'спокойный'], answer: 'подавленный, перегруженный' },
      { type: 'fill_blank', question: 'I\'m really nervous ___ the interview tomorrow.', answer: 'about', hint: 'предлог' },
      { type: 'multiple_choice', question: '"I can\'t help feeling..." means:', options: ['я не могу помочь', 'я не могу не чувствовать', 'я хочу почувствовать', 'я отказываюсь чувствовать'], answer: 'я не могу не чувствовать' },
      { type: 'fill_blank', question: 'That must be ___ for you — I\'m sorry to hear it.', answer: 'difficult', hint: 'сложный' },
      { type: 'multiple_choice', question: '"Relieved" means:', options: ['разочарованный', 'облегчённый', 'гордый', 'смущённый'], answer: 'облегчённый' },
    ],
    quiz: [
      { question: '"Absolutely thrilled" means:', options: ['немного доволен', 'в полном восторге', 'слегка взволнован', 'умеренно рад'], answer: 'в полном восторге' },
      { question: '"Apprehensive" means:', options: ['уверенный', 'обеспокоенный/тревожный', 'злой', 'счастливый'], answer: 'обеспокоенный/тревожный' },
      { question: 'To show empathy, say:', options: ['I don\'t care.', 'That\'s your problem.', 'I understand how you feel.', 'You shouldn\'t feel that way.'], answer: 'I understand how you feel.' },
      { question: '"Ambivalent" describes:', options: ['одно сильное чувство', 'двойственное/смешанное чувство', 'отсутствие чувств', 'очень сильный гнев'], answer: 'двойственное/смешанное чувство' },
      { question: 'After "I\'m excited...", which preposition follows?', options: ['for', 'at', 'about', 'of'], answer: 'about' },
    ],
  },
  {
    id: 'b1-5-5', level: 'B1', block: 5, blockName: 'Навыки общения', order: 5,
    title: 'Обсуждение планов', duration: '15 мин',
    theory: {
      explanation: 'Обсуждение планов на будущее в английском требует знания нескольких грамматических конструкций. "Going to" — для планов, уже решённых: "I\'m going to visit my parents this weekend." Present Continuous — для договорённостей: "I\'m meeting John at 7." "Will" — для спонтанных решений и предложений: "I\'ll help you with that." "Plan to" / "intend to" — намереваться: "I plan to study abroad next year." "Hope to" — надеяться: "I hope to get a promotion." "Thinking of / about + -ing" — думаю о: "I\'m thinking of changing my job." "Looking forward to + -ing" — с нетерпением жду: "I\'m looking forward to seeing you." Фразы: "What are your plans for...?", "Have you decided yet?", "Are you doing anything this...?"',
      examples: [
        { english: 'I\'m going to start a new course in September.', russian: 'В сентябре я собираюсь начать новый курс.' },
        { english: 'Are you doing anything this weekend? Let\'s meet up!', russian: 'Ты чем-нибудь занят в эти выходные? Давай встретимся!' },
        { english: 'I\'m thinking of moving to a bigger apartment next year.', russian: 'Я думаю о переезде в квартиру побольше в следующем году.' },
        { english: 'I\'m really looking forward to the holidays.', russian: 'Я с нетерпением жду праздников.' },
        { english: 'She intends to apply for a Masters programme in the autumn.', russian: 'Она намерена подать заявку на программу магистратуры осенью.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I\'m ___ forward to meeting you next week.', answer: 'looking', hint: 'смотреть' },
      { type: 'multiple_choice', question: 'Which is correct for a definite arrangement?', options: ['I will meet John.', 'I am meeting John at 6.', 'I meet John.', 'I was meeting John.'], answer: 'I am meeting John at 6.' },
      { type: 'fill_blank', question: 'I\'m thinking ___ changing careers.', answer: 'of', hint: 'предлог' },
      { type: 'multiple_choice', question: '"I intend to..." means:', options: ['я надеюсь', 'я намереваюсь', 'я планировал', 'я решил вчера'], answer: 'я намереваюсь' },
      { type: 'build_sentence', question: 'Составь: to / I / next / going / am / Paris / visit', words: ['I', 'am', 'going', 'to', 'visit', 'Paris', 'next'], answer: 'I am going to visit Paris next' },
    ],
    quiz: [
      { question: '"Going to" is used for:', options: ['spontaneous decisions', 'pre-planned intentions', 'predictions without evidence', 'habits'], answer: 'pre-planned intentions' },
      { question: '"Looking forward to" is followed by:', options: ['infinitive', 'gerund (-ing)', 'past participle', 'noun only'], answer: 'gerund (-ing)' },
      { question: '"I hope to..." expresses:', options: ['уверенный план', 'надежду/желание', 'завершённое действие', 'условие'], answer: 'надежду/желание' },
      { question: 'Present Continuous for future is used for:', options: ['distant future', 'definite arrangements', 'spontaneous actions', 'repeated actions'], answer: 'definite arrangements' },
      { question: '"Are you doing anything this weekend?" is asking about:', options: ['past activities', 'future plans', 'present habits', 'wishes'], answer: 'future plans' },
    ],
  },
  {
    id: 'b1-6-1', level: 'B1', block: 6, blockName: 'Медиа и технологии', order: 1,
    title: 'Словарь социальных сетей', duration: '15 мин',
    theory: {
      explanation: 'Социальные сети стали частью повседневной жизни, и важно знать соответствующую лексику. Profile (профиль), post (публикация/пост), share (делиться), like (лайкать), comment (комментировать), follow (подписываться), unfollow (отписываться), tag (отмечать). Feed — лента новостей. Story — история (исчезает через 24 часа). DM (direct message) — личное сообщение. Hashtag (#) — хэштег для поиска. Trending — популярный в данный момент. Viral — ставший вирусным. Influencer — блогер с большой аудиторией. Follower — подписчик. Engagement — вовлечённость аудитории. Algorithm — алгоритм, определяющий, что вы видите. Content creator — создатель контента. Subscribe — подписаться. Notification — уведомление. Privacy settings — настройки конфиденциальности.',
      examples: [
        { english: 'She has over a million followers on her Instagram account.', russian: 'У неё более миллиона подписчиков в Instagram.' },
        { english: 'The video went viral overnight and got 10 million views.', russian: 'Видео стало вирусным за одну ночь и набрало 10 миллионов просмотров.' },
        { english: 'Don\'t forget to like, share and subscribe to the channel.', russian: 'Не забудьте поставить лайк, поделиться и подписаться на канал.' },
        { english: 'I saw it trending on Twitter this morning.', russian: 'Сегодня утром я видел это в трендах в Twitter.' },
        { english: 'Make sure your privacy settings are set to "friends only".', russian: 'Убедитесь, что настройки конфиденциальности установлены на "только друзья".' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Go viral" means:', options: ['заболеть', 'стать очень популярным в интернете', 'удалить аккаунт', 'потерять подписчиков'], answer: 'стать очень популярным в интернете' },
      { type: 'fill_blank', question: 'She is a popular ___ who creates beauty content.', answer: 'influencer', hint: 'блогер с аудиторией' },
      { type: 'multiple_choice', question: '"DM" stands for:', options: ['Daily Message', 'Direct Message', 'Digital Media', 'Data Mode'], answer: 'Direct Message' },
      { type: 'fill_blank', question: 'Use a ___ (#) to make your posts easier to find.', answer: 'hashtag', hint: 'символ #' },
      { type: 'multiple_choice', question: '"Unfollow" means:', options: ['подписаться', 'отписаться', 'заблокировать', 'лайкнуть'], answer: 'отписаться' },
    ],
    quiz: [
      { question: '"Engagement" on social media refers to:', options: ['количество постов', 'вовлечённость аудитории (лайки, комменты)', 'настройки профиля', 'личные сообщения'], answer: 'вовлечённость аудитории (лайки, комменты)' },
      { question: '"Trending" means:', options: ['устаревший контент', 'популярный прямо сейчас', 'приватный пост', 'удалённый аккаунт'], answer: 'популярный прямо сейчас' },
      { question: 'A "Story" on social media:', options: ['остаётся навсегда', 'исчезает через 24 часа', 'виден только подписчикам', 'требует подписки'], answer: 'исчезает через 24 часа' },
      { question: '"Content creator" is someone who:', options: ['читает контент', 'создаёт и публикует контент', 'модерирует контент', 'удаляет контент'], answer: 'создаёт и публикует контент' },
      { question: '"Privacy settings" control:', options: ['скорость интернета', 'кто видит ваш контент', 'алгоритм рекомендаций', 'количество подписчиков'], answer: 'кто видит ваш контент' },
    ],
  },
  {
    id: 'b1-6-2', level: 'B1', block: 6, blockName: 'Медиа и технологии', order: 2,
    title: 'Технологии в жизни', duration: '15 мин',
    theory: {
      explanation: 'Технологии изменили нашу жизнь. Основные понятия: device (устройство), smartphone (смартфон), laptop (ноутбук), tablet (планшет), wearable (носимое устройство). Cloud storage — облачное хранилище. Artificial intelligence (AI) — искусственный интеллект. Automation — автоматизация. App (application) — приложение. Update — обновление. Upgrade — улучшение/повышение версии. Cybersecurity — кибербезопасность. Digital divide — цифровое неравенство. Screen time — экранное время. Connectivity — связность/подключение. Streaming — потоковое вещание. Download/upload — скачать/загрузить. Bandwidth — пропускная способность. Smart home — умный дом. IoT (Internet of Things) — интернет вещей.',
      examples: [
        { english: 'I store all my photos in the cloud so I don\'t lose them.', russian: 'Я храню все свои фотографии в облаке, чтобы не потерять их.' },
        { english: 'Artificial intelligence is transforming many industries.', russian: 'Искусственный интеллект трансформирует многие отрасли.' },
        { english: 'Many jobs are at risk due to increasing automation.', russian: 'Многие рабочие места под угрозой из-за растущей автоматизации.' },
        { english: 'I need to update my phone — it\'s running very slowly.', russian: 'Мне нужно обновить телефон — он работает очень медленно.' },
        { english: 'The digital divide means not everyone has equal access to technology.', russian: 'Цифровое неравенство означает, что не все имеют равный доступ к технологиям.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'I save my files in ___ storage so I can access them anywhere.', answer: 'cloud', hint: 'облако' },
      { type: 'multiple_choice', question: '"IoT" stands for:', options: ['Internet of Technology', 'Internet of Things', 'Integration of Tools', 'Interface of Technology'], answer: 'Internet of Things' },
      { type: 'multiple_choice', question: '"Screen time" refers to:', options: ['яркость экрана', 'время, проведённое за экраном', 'размер экрана', 'разрешение экрана'], answer: 'время, проведённое за экраном' },
      { type: 'fill_blank', question: 'AI and ___ are changing the job market rapidly.', answer: 'automation', hint: 'автоматизация' },
      { type: 'multiple_choice', question: '"Upload" means:', options: ['скачать на устройство', 'загрузить в интернет/облако', 'обновить программу', 'удалить файл'], answer: 'загрузить в интернет/облако' },
    ],
    quiz: [
      { question: '"Digital divide" refers to:', options: ['разделение экрана', 'неравенство в доступе к технологиям', 'деление данных', 'раздел настроек'], answer: 'неравенство в доступе к технологиям' },
      { question: '"Wearable technology" includes:', options: ['компьютеры', 'умные часы и фитнес-браслеты', 'телевизоры', 'принтеры'], answer: 'умные часы и фитнес-браслеты' },
      { question: '"Bandwidth" is related to:', options: ['размер экрана', 'пропускная способность интернета', 'размер батареи', 'качество звука'], answer: 'пропускная способность интернета' },
      { question: '"Streaming" means:', options: ['скачивание файлов', 'просмотр/прослушивание в режиме онлайн', 'загрузка файлов', 'хранение данных'], answer: 'просмотр/прослушивание в режиме онлайн' },
      { question: '"Update" vs "Upgrade": update is:', options: ['полная замена программы', 'установка новой версии/патча', 'покупка нового устройства', 'удаление старых файлов'], answer: 'установка новой версии/патча' },
    ],
  },
  {
    id: 'b1-6-3', level: 'B1', block: 6, blockName: 'Медиа и технологии', order: 3,
    title: 'Обсуждение новостей', duration: '15 мин',
    theory: {
      explanation: 'Обсуждение новостей требует специального словаря. Breaking news — срочные новости. Headline — заголовок. Article — статья. Source — источник. Journalist / reporter — журналист/репортёр. Editor — редактор. Broadcast — трансляция. "According to..." — согласно... "It is reported that..." — сообщается, что... "Allegedly" — предположительно. "Confirmed" — подтверждено. Fake news — фейковые новости. Bias — предвзятость. Objective/neutral — объективный/нейтральный. Opinion piece — авторская колонка. Eyewitness — очевидец. Spokesperson — пресс-секретарь. Press conference — пресс-конференция. Investigate — расследовать. Publish — публиковать. Censorship — цензура. Media literacy — медиаграмотность.',
      examples: [
        { english: 'According to BBC News, the agreement was signed yesterday.', russian: 'По данным BBC News, соглашение было подписано вчера.' },
        { english: 'It\'s important to check the source before sharing news online.', russian: 'Важно проверять источник перед тем, как делиться новостями онлайн.' },
        { english: 'The government spokesperson held a press conference this morning.', russian: 'Пресс-секретарь правительства провёл пресс-конференцию этим утром.' },
        { english: 'Always look for multiple sources — every media outlet has some bias.', russian: 'Всегда ищите несколько источников — у каждого СМИ есть предвзятость.' },
        { english: 'The journalist is investigating the alleged corruption scandal.', russian: 'Журналист расследует предполагаемый коррупционный скандал.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Breaking news" means:', options: ['устаревшие новости', 'срочные новости', 'фейковые новости', 'спортивные новости'], answer: 'срочные новости' },
      { type: 'fill_blank', question: '___ to reports, three people were injured in the accident.', answer: 'According', hint: 'согласно' },
      { type: 'multiple_choice', question: '"Bias" in media means:', options: ['объективность', 'предвзятость', 'точность', 'популярность'], answer: 'предвзятость' },
      { type: 'fill_blank', question: 'Always check the ___ of the news before sharing it.', answer: 'source', hint: 'источник' },
      { type: 'multiple_choice', question: '"Allegedly" means:', options: ['подтверждено', 'предположительно', 'официально', 'срочно'], answer: 'предположительно' },
    ],
    quiz: [
      { question: '"Fake news" refers to:', options: ['новости о технологиях', 'ложная или вводящая в заблуждение информация', 'срочные новости', 'мнения журналистов'], answer: 'ложная или вводящая в заблуждение информация' },
      { question: '"Media literacy" is the ability to:', options: ['читать быстро', 'критически анализировать медиа', 'работать в СМИ', 'создавать новости'], answer: 'критически анализировать медиа' },
      { question: 'An "opinion piece" is:', options: ['объективная статья с фактами', 'авторская статья с мнением', 'срочная новость', 'интервью с очевидцем'], answer: 'авторская статья с мнением' },
      { question: '"Eyewitness" is someone who:', options: ['пишет статьи', 'видел событие лично', 'редактирует новости', 'читает новости'], answer: 'видел событие лично' },
      { question: '"Censorship" involves:', options: ['свобода прессы', 'контроль и ограничение публикуемой информации', 'проверка фактов', 'редактирование статей'], answer: 'контроль и ограничение публикуемой информации' },
    ],
  },
  {
    id: 'b1-6-4', level: 'B1', block: 6, blockName: 'Медиа и технологии', order: 4,
    title: 'Описание графиков и трендов', duration: '15 мин',
    theory: {
      explanation: 'Описание графиков и трендов необходимо в академической и деловой среде. Для роста: "increase", "rise", "grow", "go up", "climb", "surge" (резко вырасти). Для падения: "decrease", "fall", "drop", "decline", "go down", "plummet" (резко упасть). Стабильность: "remain stable", "stay constant", "level off", "plateau". Пики и спады: "reach a peak", "hit a low", "peak at...", "bottom out". Наречия: "sharply" (резко), "gradually" (постепенно), "steadily" (стабильно), "slightly" (незначительно). "There was a sharp increase in..." — наблюдался резкий рост в... "The figures show a downward trend" — цифры показывают нисходящий тренд. "Compared to last year..." — по сравнению с прошлым годом...',
      examples: [
        { english: 'Sales increased sharply in the third quarter of the year.', russian: 'Продажи резко выросли в третьем квартале года.' },
        { english: 'The unemployment rate has been declining gradually since 2020.', russian: 'Уровень безработицы постепенно снижается с 2020 года.' },
        { english: 'Prices remained relatively stable throughout the year.', russian: 'Цены оставались относительно стабильными на протяжении всего года.' },
        { english: 'There was a significant drop in profits compared to last year.', russian: 'Прибыль значительно упала по сравнению с прошлым годом.' },
        { english: 'The graph shows an upward trend in online shopping.', russian: 'График показывает восходящий тренд в онлайн-шопинге.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Plummet" means:', options: ['постепенно расти', 'резко падать', 'оставаться стабильным', 'немного вырасти'], answer: 'резко падать' },
      { type: 'fill_blank', question: 'Sales ___ a peak in December and then fell in January.', answer: 'reached', hint: 'достигли' },
      { type: 'multiple_choice', question: '"Gradually" means:', options: ['резко', 'постепенно', 'немного', 'стабильно'], answer: 'постепенно' },
      { type: 'fill_blank', question: 'The prices ___ stable for the entire quarter.', answer: 'remained', hint: 'оставались' },
      { type: 'multiple_choice', question: '"Upward trend" means:', options: ['нисходящий тренд', 'восходящий тренд', 'стабильный тренд', 'сезонный тренд'], answer: 'восходящий тренд' },
    ],
    quiz: [
      { question: '"Level off" means:', options: ['резко вырасти', 'стабилизироваться', 'резко упасть', 'начать расти'], answer: 'стабилизироваться' },
      { question: '"Surge" describes a:', options: ['gradual rise', 'sharp sudden increase', 'slight decline', 'stable period'], answer: 'sharp sudden increase' },
      { question: '"Compared to last year..." introduces:', options: ['прогноз', 'сравнение', 'вывод', 'причину'], answer: 'сравнение' },
      { question: '"Bottom out" means:', options: ['достичь максимума', 'достичь минимума', 'стабилизироваться', 'начать падать'], answer: 'достичь минимума' },
      { question: '"Steadily" describes movement that is:', options: ['sharp and sudden', 'constant and continuous', 'very slight', 'seasonal'], answer: 'constant and continuous' },
    ],
  },
  {
    id: 'b1-6-5', level: 'B1', block: 6, blockName: 'Медиа и технологии', order: 5,
    title: 'Безопасность в интернете', duration: '15 мин',
    theory: {
      explanation: 'Онлайн-безопасность важна для каждого пользователя. Password — пароль. Strong password — надёжный пароль (буквы, цифры, символы). Two-factor authentication (2FA) — двухфакторная аутентификация. Phishing — фишинг (мошенничество через поддельные письма). Scam — мошенничество. Malware — вредоносное ПО. Virus — вирус. Spam — спам. Hacker — хакер. Data breach — утечка данных. VPN (Virtual Private Network) — виртуальная частная сеть. Firewall — межсетевой экран. Encrypt — шифровать. Personal data — личные данные. Identity theft — кража личности. Cyberbullying — кибербуллинг. Report — сообщать о нарушении. Block — заблокировать. Safe browsing — безопасный просмотр.',
      examples: [
        { english: 'Never share your password with anyone, even friends.', russian: 'Никогда не делитесь своим паролем ни с кем, даже с друзьями.' },
        { english: 'Enable two-factor authentication for extra security.', russian: 'Включите двухфакторную аутентификацию для дополнительной безопасности.' },
        { english: 'Be careful of phishing emails that ask for personal information.', russian: 'Будьте осторожны с фишинговыми письмами, которые запрашивают личную информацию.' },
        { english: 'A VPN helps protect your privacy when using public Wi-Fi.', russian: 'VPN помогает защитить вашу конфиденциальность при использовании общественного Wi-Fi.' },
        { english: 'If you experience cyberbullying, report it and block the user.', russian: 'Если вы столкнулись с кибербуллингом, сообщите об этом и заблокируйте пользователя.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Phishing" is:', options: ['рыбалка', 'мошенничество через поддельные письма', 'вид вируса', 'тип пароля'], answer: 'мошенничество через поддельные письма' },
      { type: 'fill_blank', question: 'Use a ___ password with letters, numbers and symbols.', answer: 'strong', hint: 'надёжный' },
      { type: 'multiple_choice', question: '"Data breach" means:', options: ['защита данных', 'утечка данных', 'шифрование данных', 'удаление данных'], answer: 'утечка данных' },
      { type: 'fill_blank', question: 'Enable ___ authentication to protect your account.', answer: 'two-factor', hint: '2FA' },
      { type: 'multiple_choice', question: '"Identity theft" is when someone:', options: ['забывает свой пароль', 'крадёт вашу личную информацию для мошенничества', 'взламывает сайт', 'отправляет спам'], answer: 'крадёт вашу личную информацию для мошенничества' },
    ],
    quiz: [
      { question: '"Malware" is:', options: ['защитное ПО', 'вредоносное программное обеспечение', 'тип браузера', 'облачное хранилище'], answer: 'вредоносное программное обеспечение' },
      { question: '"VPN" helps protect your:', options: ['пароль', 'конфиденциальность в интернете', 'устройство от вирусов', 'данные на диске'], answer: 'конфиденциальность в интернете' },
      { question: '"Cyberbullying" is:', options: ['хакерская атака', 'запугивание/издевательства через интернет', 'кража данных', 'вид спама'], answer: 'запугивание/издевательства через интернет' },
      { question: 'A "firewall" is used to:', options: ['ускорить интернет', 'блокировать нежелательный трафик', 'шифровать файлы', 'создавать пароли'], answer: 'блокировать нежелательный трафик' },
      { question: '"Spam" refers to:', options: ['вредоносный вирус', 'нежелательные массовые сообщения', 'фишинговая атака', 'взлом аккаунта'], answer: 'нежелательные массовые сообщения' },
    ],
  },
  {
    id: 'b2-4-1', level: 'B2', block: 4, blockName: 'Академический английский', order: 1,
    title: 'Академический словарный запас (AWL)', duration: '20 мин',
    theory: {
      explanation: 'Academic Word List (AWL) — список слов, наиболее часто встречающихся в академических текстах. Ключевые слова: analyse (анализировать), approach (подход), assume (предполагать), concept (концепция), context (контекст), data (данные), define (определять), establish (устанавливать), evaluate (оценивать), factor (фактор), identify (определять/выявлять), indicate (указывать), interpret (интерпретировать), method (метод), occur (происходить), process (процесс), require (требовать), significant (значительный), theory (теория). Также: comprise (состоять из), demonstrate (демонстрировать), emerge (возникать), framework (рамки/концепция), hypothesis (гипотеза), implement (внедрять), indicate (указывать), nevertheless (тем не менее), obtain (получать), parameter (параметр), perspective (перспектива/точка зрения), principle (принцип).',
      examples: [
        { english: 'The study analyses data from over 500 participants.', russian: 'Исследование анализирует данные более 500 участников.' },
        { english: 'It is significant to establish a clear theoretical framework first.', russian: 'Важно сначала установить чёткую теоретическую базу.' },
        { english: 'The results indicate a strong correlation between the two variables.', russian: 'Результаты указывают на сильную корреляцию между двумя переменными.' },
        { english: 'We need to evaluate the effectiveness of each approach.', russian: 'Нам необходимо оценить эффективность каждого подхода.' },
        { english: 'The concept of identity is complex and context-dependent.', russian: 'Концепция идентичности сложна и зависит от контекста.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Hypothesis" means:', options: ['доказанный факт', 'рабочая гипотеза', 'метод исследования', 'вывод'], answer: 'рабочая гипотеза' },
      { type: 'fill_blank', question: 'The research ___ a clear link between diet and health.', answer: 'demonstrates', hint: 'демонстрирует' },
      { type: 'multiple_choice', question: '"Framework" in academic writing means:', options: ['строительная конструкция', 'теоретическая или концептуальная основа', 'список литературы', 'методология'], answer: 'теоретическая или концептуальная основа' },
      { type: 'fill_blank', question: 'The study ___ data from multiple sources.', answer: 'comprises', hint: 'включает/состоит из' },
      { type: 'multiple_choice', question: '"Emerge" means:', options: ['исчезать', 'возникать/появляться', 'оставаться', 'снижаться'], answer: 'возникать/появляться' },
    ],
    quiz: [
      { question: '"Significant" in academic context means:', options: ['подписанный', 'существенный/важный', 'похожий', 'секретный'], answer: 'существенный/важный' },
      { question: '"Interpret" means:', options: ['игнорировать', 'интерпретировать/объяснять', 'измерять', 'публиковать'], answer: 'интерпретировать/объяснять' },
      { question: '"Parameter" refers to:', options: ['метод исследования', 'измеримая характеристика или ограничение', 'участник исследования', 'вывод'], answer: 'измеримая характеристика или ограничение' },
      { question: '"Obtain" means:', options: ['получать/добывать', 'терять', 'предполагать', 'публиковать'], answer: 'получать/добывать' },
      { question: '"Nevertheless" is used to:', options: ['добавить пример', 'сделать вывод', 'выразить контраст несмотря на что-то', 'перечислить факты'], answer: 'выразить контраст несмотря на что-то' },
    ],
  },
  {
    id: 'b2-4-2', level: 'B2', block: 4, blockName: 'Академический английский', order: 2,
    title: 'Структура эссе', duration: '20 мин',
    theory: {
      explanation: 'Академическое эссе имеет чёткую структуру. Introduction (введение): hook (зацепка), background information (фоновая информация), thesis statement (тезис — главная мысль). Body paragraphs (основные абзацы): topic sentence (тема абзаца), supporting evidence (подтверждающие доказательства), analysis (анализ), concluding sentence (заключительное предложение абзаца). Conclusion (заключение): restate thesis (перефразировать тезис), summarise main points (обобщить ключевые моменты), final thought (финальная мысль). Типы эссе: argumentative (аргументативное), discursive (дискуссионное), analytical (аналитическое), descriptive (описательное). Требования: formal language (формальный язык), third person (третье лицо), passive voice (пассивный залог), hedging (осторожные высказывания).',
      examples: [
        { english: 'The thesis statement should clearly outline your main argument.', russian: 'Тезис должен чётко излагать ваш главный аргумент.' },
        { english: 'Each body paragraph should begin with a clear topic sentence.', russian: 'Каждый основной абзац должен начинаться с чёткой тематической фразы.' },
        { english: 'In conclusion, the evidence strongly supports the view that...', russian: 'В заключение, доказательства убедительно поддерживают точку зрения о том, что...' },
        { english: 'The conclusion should restate the thesis in different words.', russian: 'Заключение должно перефразировать тезис другими словами.' },
        { english: 'Academic essays require formal language and avoid contractions.', russian: 'Академические эссе требуют формального языка и избегают сокращений.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'A "thesis statement" is:', options: ['заключение эссе', 'главный аргумент/тезис эссе во введении', 'список источников', 'тема абзаца'], answer: 'главный аргумент/тезис эссе во введении' },
      { type: 'fill_blank', question: 'Each paragraph should start with a ___ sentence.', answer: 'topic', hint: 'тема/тематическое' },
      { type: 'multiple_choice', question: 'Academic writing avoids:', options: ['passive voice', 'contractions (can\'t, don\'t)', 'formal vocabulary', 'third person'], answer: 'contractions (can\'t, don\'t)' },
      { type: 'fill_blank', question: 'In ___, the study shows that the hypothesis was correct.', answer: 'conclusion', hint: 'заключение' },
      { type: 'multiple_choice', question: '"Discursive essay" discusses:', options: ['один аргумент', 'несколько точек зрения на тему', 'только факты', 'личный опыт'], answer: 'несколько точек зрения на тему' },
    ],
    quiz: [
      { question: 'A "hook" in an essay introduction is designed to:', options: ['summarise the essay', 'grab the reader\'s attention', 'list the main points', 'conclude the argument'], answer: 'grab the reader\'s attention' },
      { question: '"Supporting evidence" in a body paragraph:', options: ['опровергает тезис', 'подтверждает главную мысль абзаца', 'вводит новую тему', 'является заключением'], answer: 'подтверждает главную мысль абзаца' },
      { question: 'The conclusion should NOT:', options: ['restate the thesis', 'introduce new arguments', 'summarise key points', 'give a final thought'], answer: 'introduce new arguments' },
      { question: 'Academic essays are usually written in:', options: ['first person (I)', 'second person (you)', 'third person (it, they)', 'all persons equally'], answer: 'third person (it, they)' },
      { question: '"Analytical essay" primarily:', options: ['описывает события', 'рассказывает историю', 'анализирует и интерпретирует материал', 'убеждает читателя'], answer: 'анализирует и интерпретирует материал' },
    ],
  },
  {
    id: 'b2-4-3', level: 'B2', block: 4, blockName: 'Академический английский', order: 3,
    title: 'Продвинутые связующие слова', duration: '20 мин',
    theory: {
      explanation: 'Связующие слова делают текст логичным и связным. Добавление: furthermore (более того), in addition (в дополнение), moreover (кроме того), what is more (и что немаловажно). Контраст: however (однако), nevertheless (тем не менее), on the contrary (напротив), in contrast (в противоположность), whereas (тогда как), despite/although. Причина: consequently (следовательно), therefore (поэтому), as a result (в результате), hence (следовательно), thus (таким образом). Иллюстрация: for instance (например), to illustrate (для иллюстрации), specifically (конкретно). Уточнение: in other words (другими словами), that is to say (то есть), namely (а именно). Вывод: in conclusion (в заключение), to sum up (подводя итог), overall (в целом). Условие: provided that (при условии что), as long as (до тех пор пока), unless (если только не).',
      examples: [
        { english: 'The results were positive; furthermore, they exceeded expectations.', russian: 'Результаты были положительными; более того, они превзошли ожидания.' },
        { english: 'Despite the difficulties, the project was completed on time.', russian: 'Несмотря на трудности, проект был завершён в срок.' },
        { english: 'The sample size was small; consequently, the findings may not be reliable.', russian: 'Выборка была небольшой; следовательно, результаты могут быть ненадёжными.' },
        { english: 'Whereas Group A improved significantly, Group B showed no change.', russian: 'Тогда как группа A значительно улучшилась, группа B не показала изменений.' },
        { english: 'To sum up, the evidence suggests that further research is needed.', russian: 'Подводя итог, доказательства свидетельствуют о необходимости дальнейших исследований.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Nevertheless" expresses:', options: ['добавление', 'контраст несмотря на', 'причину', 'вывод'], answer: 'контраст несмотря на' },
      { type: 'fill_blank', question: 'The experiment failed; ___, the team learned valuable lessons.', answer: 'however', hint: 'однако' },
      { type: 'multiple_choice', question: '"Hence" means:', options: ['тем не менее', 'следовательно', 'например', 'в дополнение'], answer: 'следовательно' },
      { type: 'fill_blank', question: '___ that funding is provided, the project can proceed.', answer: 'Provided', hint: 'при условии' },
      { type: 'multiple_choice', question: '"Whereas" is used to show:', options: ['addition', 'contrast between two facts', 'conclusion', 'illustration'], answer: 'contrast between two facts' },
    ],
    quiz: [
      { question: '"Furthermore" adds:', options: ['противоположную информацию', 'дополнительную информацию', 'причину', 'условие'], answer: 'дополнительную информацию' },
      { question: '"In other words" is used to:', options: ['добавить новую идею', 'перефразировать сказанное', 'сделать вывод', 'привести пример'], answer: 'перефразировать сказанное' },
      { question: '"As a result" introduces:', options: ['контраст', 'следствие/результат', 'добавление', 'условие'], answer: 'следствие/результат' },
      { question: '"Unless" means:', options: ['при условии что', 'если только не', 'поскольку', 'хотя'], answer: 'если только не' },
      { question: '"Namely" is used to:', options: ['сделать вывод', 'уточнить/перечислить конкретно', 'добавить информацию', 'выразить контраст'], answer: 'уточнить/перечислить конкретно' },
    ],
  },
  {
    id: 'b2-4-4', level: 'B2', block: 4, blockName: 'Академический английский', order: 4,
    title: 'Hedging — осторожные высказывания', duration: '20 мин',
    theory: {
      explanation: 'Hedging (хеджирование) — использование осторожного языка в академическом письме, чтобы не делать чрезмерно смелых утверждений. Модальные глаголы: may, might, could, should, would. Глаголы: appear to (казаться), seem to (казаться), tend to (иметь тенденцию), suggest (предполагать). Наречия: possibly (возможно), probably (вероятно), perhaps (возможно), apparently (по-видимому), generally (в целом). Прилагательные: possible, probable, likely, unlikely. Фразы: "It is possible that...", "There is evidence to suggest that...", "It seems likely that...", "This may indicate that...", "To some extent...". Hedging позволяет: признать ограничения исследования, избежать абсолютных утверждений, показать научную осторожность. Пример без hedging: "This causes cancer." С hedging: "This may be associated with increased cancer risk."',
      examples: [
        { english: 'This appears to suggest a correlation between the two factors.', russian: 'Это, по всей видимости, указывает на корреляцию между двумя факторами.' },
        { english: 'It is possible that further research will confirm these findings.', russian: 'Возможно, дальнейшие исследования подтвердят эти результаты.' },
        { english: 'The results seem to indicate a positive trend.', russian: 'Результаты, кажется, указывают на положительную тенденцию.' },
        { english: 'This could potentially lead to significant improvements.', russian: 'Это потенциально может привести к значительным улучшениям.' },
        { english: 'There is some evidence to suggest that diet affects mental health.', russian: 'Есть некоторые доказательства, указывающие на то, что диета влияет на психическое здоровье.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'This ___ indicate a problem with the methodology.', answer: 'may', hint: 'модальный глагол' },
      { type: 'multiple_choice', question: '"Hedging" in academic writing is used to:', options: ['делать сильные утверждения', 'смягчать утверждения и признавать неопределённость', 'приводить примеры', 'делать выводы'], answer: 'смягчать утверждения и признавать неопределённость' },
      { type: 'fill_blank', question: 'The results ___ to suggest that the hypothesis is correct.', answer: 'seem', hint: 'казаться' },
      { type: 'multiple_choice', question: 'Which sentence uses hedging correctly?', options: ['This causes cancer.', 'This definitely proves the theory.', 'This may be associated with health risks.', 'This is wrong.'], answer: 'This may be associated with health risks.' },
      { type: 'fill_blank', question: 'It is ___ that further studies are needed.', answer: 'likely', hint: 'вероятно' },
    ],
    quiz: [
      { question: '"Tend to" is a hedging verb that means:', options: ['обязательно делать', 'иметь тенденцию/обычно делать', 'никогда не делать', 'редко делать'], answer: 'иметь тенденцию/обычно делать' },
      { question: '"Apparently" means:', options: ['определённо', 'по-видимому/судя по всему', 'никогда', 'обычно'], answer: 'по-видимому/судя по всему' },
      { question: 'Which modal verb expresses STRONGEST possibility?', options: ['might', 'could', 'may', 'should'], answer: 'should' },
      { question: '"To some extent" means:', options: ['полностью', 'частично/в определённой степени', 'совсем нет', 'главным образом'], answer: 'частично/в определённой степени' },
      { question: 'Hedging makes academic writing:', options: ['менее точным', 'более научным и честным', 'менее формальным', 'более убедительным'], answer: 'более научным и честным' },
    ],
  },
  {
    id: 'b2-4-5', level: 'B2', block: 4, blockName: 'Академический английский', order: 5,
    title: 'Описание исследования', duration: '20 мин',
    theory: {
      explanation: 'При описании исследований используется специальный язык. Методология: qualitative (качественный), quantitative (количественный), mixed methods (смешанный метод). Выборка: sample (выборка), participants (участники), subjects (испытуемые), random sampling (случайная выборка). Сбор данных: survey (опрос), questionnaire (анкета), interview (интервью), observation (наблюдение), experiment (эксперимент). Анализ: statistical analysis (статистический анализ), correlation (корреляция), findings (результаты), data (данные). Результаты: "The results show...", "The findings suggest...", "The data indicates...", "It was found that...". Ограничения: "One limitation of this study is...", "The sample size was limited". Вывод: "In conclusion", "To conclude", "The study demonstrates that...".',
      examples: [
        { english: 'The study employed a mixed-methods approach combining surveys and interviews.', russian: 'Исследование применяло смешанный метод, сочетая опросы и интервью.' },
        { english: 'A random sample of 200 participants was selected for the study.', russian: 'Для исследования была выбрана случайная выборка из 200 участников.' },
        { english: 'The findings suggest a strong correlation between stress and productivity.', russian: 'Результаты предполагают сильную корреляцию между стрессом и производительностью.' },
        { english: 'One limitation of this study is the relatively small sample size.', russian: 'Одним из ограничений этого исследования является относительно небольшой размер выборки.' },
        { english: 'It was found that participants who slept more performed better on tests.', russian: 'Было обнаружено, что участники, которые больше спали, показывали лучшие результаты на тестах.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Qualitative research" focuses on:', options: ['числа и статистика', 'качественные данные, мнения, опыт', 'только эксперименты', 'только анкеты'], answer: 'качественные данные, мнения, опыт' },
      { type: 'fill_blank', question: 'A ___ of 150 students completed the questionnaire.', answer: 'sample', hint: 'выборка' },
      { type: 'multiple_choice', question: '"Findings" in research means:', options: ['методология', 'результаты/выводы исследования', 'участники', 'ограничения'], answer: 'результаты/выводы исследования' },
      { type: 'fill_blank', question: 'One ___ of this study is that it was conducted in only one country.', answer: 'limitation', hint: 'ограничение' },
      { type: 'multiple_choice', question: '"Correlation" means:', options: ['причинно-следственная связь', 'связь между двумя переменными', 'отсутствие связи', 'ошибка в данных'], answer: 'связь между двумя переменными' },
    ],
    quiz: [
      { question: '"Random sampling" means:', options: ['выбор удобных участников', 'случайный выбор участников', 'выбор экспертов', 'выбор по возрасту'], answer: 'случайный выбор участников' },
      { question: '"Mixed methods" research uses:', options: ['только количественные методы', 'только качественные методы', 'оба метода', 'только эксперименты'], answer: 'оба метода' },
      { question: '"Survey" is a type of:', options: ['experimental method', 'data collection method (опрос)', 'statistical analysis', 'research framework'], answer: 'data collection method (опрос)' },
      { question: 'A "limitation" in a study is:', options: ['главный результат', 'слабое место или ограничение исследования', 'вывод', 'рекомендация'], answer: 'слабое место или ограничение исследования' },
      { question: '"It was found that..." introduces:', options: ['методологию', 'результаты исследования', 'ограничения', 'введение'], answer: 'результаты исследования' },
    ],
  },
  {
    id: 'b2-5-1', level: 'B2', block: 5, blockName: 'Деловой английский', order: 1,
    title: 'Официальные письма и emails', duration: '20 мин',
    theory: {
      explanation: 'Деловые письма требуют формального языка. Приветствие: "Dear Mr/Ms [Surname]," (если знаете имя), "Dear Sir/Madam," (если не знаете). Открытие: "I am writing to...", "I am writing with regard to...", "Further to our conversation...". Запрос: "I would be grateful if...", "Could you please...", "I would appreciate it if...". Благодарность: "Thank you for your email of...", "I am grateful for your prompt reply." Закрытие: "I look forward to hearing from you", "Please do not hesitate to contact me", "I would be happy to discuss this further." Подпись: "Yours sincerely" (если знаете имя), "Yours faithfully" (Dear Sir/Madam). Избегайте: разговорного языка, сокращений, эмоциональных выражений. Используйте: пассивный залог, формальную лексику.',
      examples: [
        { english: 'I am writing to enquire about the position advertised on your website.', russian: 'Я пишу, чтобы узнать о вакансии, размещённой на вашем сайте.' },
        { english: 'I would be grateful if you could send me further details.', russian: 'Я был бы признателен, если бы вы могли прислать мне дополнительную информацию.' },
        { english: 'Further to our telephone conversation, I am pleased to confirm...', russian: 'В продолжение нашего телефонного разговора, рад подтвердить...' },
        { english: 'Please do not hesitate to contact me if you require any further information.', russian: 'Пожалуйста, не стесняйтесь связаться со мной, если вам потребуется дополнительная информация.' },
        { english: 'I look forward to hearing from you at your earliest convenience.', russian: 'С нетерпением жду вашего ответа при первой возможности.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Yours faithfully" is used when:', options: ['вы знаете имя получателя', 'вы обращаетесь "Dear Sir/Madam"', 'пишете другу', 'отвечаете на жалобу'], answer: 'вы обращаетесь "Dear Sir/Madam"' },
      { type: 'fill_blank', question: 'I am writing ___ enquire about the job vacancy.', answer: 'to', hint: 'предлог' },
      { type: 'multiple_choice', question: '"I would be grateful if you could..." is:', options: ['неформальная просьба', 'формальная просьба', 'приветствие', 'заключение'], answer: 'формальная просьба' },
      { type: 'fill_blank', question: 'I look ___ to hearing from you soon.', answer: 'forward', hint: 'жду' },
      { type: 'multiple_choice', question: 'Which is appropriate in a formal email?', options: ['Hey! How are you?', 'I am writing to inform you...', 'Just wanted to say...', 'Cheers,'], answer: 'I am writing to inform you...' },
    ],
    quiz: [
      { question: '"Further to our conversation" means:', options: ['в дополнение к нашему разговору', 'после нашего разговора', 'до нашего разговора', 'вместо нашего разговора'], answer: 'в дополнение к нашему разговору' },
      { question: 'Formal emails should AVOID:', options: ['passive voice', 'contractions (I\'m, don\'t)', 'polite requests', 'formal vocabulary'], answer: 'contractions (I\'m, don\'t)' },
      { question: '"Dear Ms Smith" requires the closing:', options: ['Yours faithfully', 'Yours sincerely', 'Best wishes', 'Kind regards'], answer: 'Yours sincerely' },
      { question: '"Do not hesitate to contact me" means:', options: ['не звоните мне', 'свяжитесь со мной без колебаний', 'я свяжусь с вами', 'мне нужна ваша помощь'], answer: 'свяжитесь со мной без колебаний' },
      { question: 'The opening of a formal email should include:', options: ['jokes and small talk', 'the purpose of writing', 'your personal news', 'a list of demands'], answer: 'the purpose of writing' },
    ],
  },
  {
    id: 'b2-5-2', level: 'B2', block: 5, blockName: 'Деловой английский', order: 2,
    title: 'Язык деловых встреч', duration: '20 мин',
    theory: {
      explanation: 'Деловые встречи требуют специального языка. Начало: "Let\'s get started", "Shall we begin?", "The purpose of today\'s meeting is to...". Повестка дня: "agenda" — повестка, "item" — пункт. Высказывание мнения: "In my view...", "As I see it...", "From my perspective...", "I\'d like to point out that...". Прерывание: "Sorry to interrupt, but...", "If I could just add...". Просьба высказаться: "What do you think about this?", "Would you like to add anything?". Принятие решений: "I think we\'ve reached a consensus", "Let\'s put it to a vote", "We\'ve agreed to...". Завершение: "To summarise...", "Are there any other points?", "The next meeting will be...". Делегирование: "I\'ll take responsibility for...", "Who will be in charge of...?".',
      examples: [
        { english: 'Let\'s move on to the next item on the agenda.', russian: 'Перейдём к следующему пункту повестки дня.' },
        { english: 'Sorry to interrupt, but I\'d like to raise a concern.', russian: 'Прошу прощения за прерывание, но я хотел бы высказать опасение.' },
        { english: 'From my perspective, the current approach isn\'t working.', russian: 'С моей точки зрения, текущий подход не работает.' },
        { english: 'I think we\'ve reached a consensus on this point.', russian: 'Я думаю, мы пришли к консенсусу по этому вопросу.' },
        { english: 'Who will take responsibility for following up on this action?', russian: 'Кто возьмёт на себя ответственность за выполнение этого действия?' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'Let\'s move on to the next ___ on the agenda.', answer: 'item', hint: 'пункт' },
      { type: 'multiple_choice', question: '"Reach a consensus" means:', options: ['спорить', 'прийти к общему согласию', 'голосовать', 'прерывать'], answer: 'прийти к общему согласию' },
      { type: 'fill_blank', question: 'The ___ of today\'s meeting is to review Q3 results.', answer: 'purpose', hint: 'цель' },
      { type: 'multiple_choice', question: '"I\'d like to point out that..." is used to:', options: ['задать вопрос', 'обратить внимание на что-то', 'завершить встречу', 'согласиться'], answer: 'обратить внимание на что-то' },
      { type: 'build_sentence', question: 'Составь: agenda / the / next / on / move / Let\'s / item / to', words: ['Let\'s', 'move', 'on', 'to', 'the', 'next', 'item', 'on', 'the', 'agenda'], answer: 'Let\'s move on to the next item on the agenda' },
    ],
    quiz: [
      { question: '"Agenda" in a business meeting is:', options: ['список участников', 'повестка дня', 'протокол встречи', 'презентация'], answer: 'повестка дня' },
      { question: '"Put it to a vote" means:', options: ['обсудить вопрос', 'проголосовать', 'отложить решение', 'делегировать задачу'], answer: 'проголосовать' },
      { question: '"Action points" in a meeting are:', options: ['темы для обсуждения', 'конкретные задачи, которые нужно выполнить', 'итоги встречи', 'список участников'], answer: 'конкретные задачи, которые нужно выполнить' },
      { question: '"Shall we begin?" is used to:', options: ['завершить встречу', 'начать встречу', 'задать вопрос', 'выразить мнение'], answer: 'начать встречу' },
      { question: '"Who will be in charge of...?" means:', options: ['кто виноват в...?', 'кто будет отвечать за...?', 'кто хочет...?', 'кто против...?'], answer: 'кто будет отвечать за...?' },
    ],
  },
  {
    id: 'b2-5-3', level: 'B2', block: 5, blockName: 'Деловой английский', order: 3,
    title: 'Фразы для переговоров', duration: '20 мин',
    theory: {
      explanation: 'Переговоры — ключевой навык в бизнесе. Начало переговоров: "Our position is...", "What we\'re looking for is...", "We\'d like to propose...". Предложение компромисса: "We could consider...", "What if we...?", "Perhaps we could meet halfway", "Would you be willing to...?". Отклонение: "I\'m afraid that\'s not acceptable", "We can\'t go below...", "That\'s not something we can agree to". Принятие: "That seems reasonable", "We can work with that", "I think we have a deal". Уступки: "If you can..., then we\'ll...", "We\'re prepared to... if you...". "Win-win" — взаимовыгодный. "Bottom line" — минимально допустимые условия. "Deadlock" — тупик в переговорах. "Concession" — уступка. "Counter-offer" — встречное предложение.',
      examples: [
        { english: 'Perhaps we could meet halfway on the price.', russian: 'Возможно, мы могли бы найти компромисс по цене.' },
        { english: 'If you can guarantee delivery by Friday, we\'ll accept the offer.', russian: 'Если вы можете гарантировать доставку к пятнице, мы примем предложение.' },
        { english: 'I\'m afraid that\'s below our minimum acceptable price.', russian: 'Боюсь, что это ниже нашей минимально допустимой цены.' },
        { english: 'We\'d like to propose a three-month trial period instead.', russian: 'Мы хотели бы предложить трёхмесячный испытательный период вместо этого.' },
        { english: 'I think we\'ve reached a deal that works for both sides.', russian: 'Я думаю, мы достигли договорённости, которая устраивает обе стороны.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Meet halfway" means:', options: ['встретиться посередине/пойти на компромисс', 'отказаться от переговоров', 'предложить полную цену', 'перенести встречу'], answer: 'встретиться посередине/пойти на компромисс' },
      { type: 'fill_blank', question: '"I\'m afraid that\'s not ___." — вежливый отказ.', answer: 'acceptable', hint: 'приемлемо' },
      { type: 'multiple_choice', question: '"Deadlock" in negotiations means:', options: ['успешное соглашение', 'тупик/невозможность договориться', 'начало переговоров', 'уступка'], answer: 'тупик/невозможность договориться' },
      { type: 'fill_blank', question: 'We\'re ___ to offer a 10% discount if you order in bulk.', answer: 'prepared', hint: 'готовы' },
      { type: 'multiple_choice', question: '"Counter-offer" is:', options: ['первоначальное предложение', 'встречное предложение', 'окончательная цена', 'отказ'], answer: 'встречное предложение' },
    ],
    quiz: [
      { question: '"Win-win" describes a deal where:', options: ['только одна сторона выигрывает', 'обе стороны в выигрыше', 'никто не выигрывает', 'одна сторона уступает'], answer: 'обе стороны в выигрыше' },
      { question: '"Bottom line" in negotiation means:', options: ['итоговая прибыль', 'минимально допустимые условия', 'первое предложение', 'секретная информация'], answer: 'минимально допустимые условия' },
      { question: '"Concession" is:', options: ['жёсткая позиция', 'уступка', 'требование', 'тупик'], answer: 'уступка' },
      { question: '"That seems reasonable" is used to:', options: ['отклонить предложение', 'выразить принятие/согласие', 'предложить компромисс', 'начать переговоры'], answer: 'выразить принятие/согласие' },
      { question: '"Would you be willing to...?" is used to:', options: ['отклонить предложение', 'предложить условие', 'сделать уступку', 'завершить переговоры'], answer: 'предложить условие' },
    ],
  },
  {
    id: 'b2-5-4', level: 'B2', block: 5, blockName: 'Деловой английский', order: 4,
    title: 'Презентации на английском', duration: '20 мин',
    theory: {
      explanation: 'Структура деловой презентации включает несколько ключевых частей. Введение: "Good morning/afternoon, everyone", "Today I\'m going to talk about...", "My presentation will cover three main points." Указание структуры: "I\'ll start by..., then I\'ll move on to..., and finally..." Переход: "Moving on to...", "Let\'s now turn to...", "This brings me to my next point." Акцент: "I\'d like to emphasise that...", "The key point here is...", "It\'s important to note that..." Визуальные материалы: "As you can see from this slide...", "This graph shows...", "If you look at the diagram..." Завершение: "To sum up...", "In conclusion...", "I\'d like to thank you for your attention." Вопросы: "I\'m happy to take any questions", "Does anyone have any questions?"',
      examples: [
        { english: 'Today I\'m going to present our quarterly sales figures.', russian: 'Сегодня я собираюсь представить наши квартальные показатели продаж.' },
        { english: 'I\'d like to emphasise that these results exceeded our targets.', russian: 'Я хотел бы подчеркнуть, что эти результаты превзошли наши цели.' },
        { english: 'As you can see from this slide, profits have increased by 20%.', russian: 'Как видно из этого слайда, прибыль увеличилась на 20%.' },
        { english: 'Moving on to the next point — our marketing strategy for Q4.', russian: 'Переходя к следующему пункту — наша маркетинговая стратегия на Q4.' },
        { english: 'Thank you for your attention. I\'m happy to take any questions.', russian: 'Спасибо за внимание. Я готов ответить на любые вопросы.' },
      ],
    },
    exercises: [
      { type: 'fill_blank', question: 'Today I\'m going to ___ about our new product launch.', answer: 'talk', hint: 'говорить' },
      { type: 'multiple_choice', question: '"Moving on to..." is used to:', options: ['начать презентацию', 'перейти к следующей теме', 'задать вопрос', 'завершить презентацию'], answer: 'перейти к следующей теме' },
      { type: 'fill_blank', question: 'As you can ___ from this graph, sales have increased.', answer: 'see', hint: 'видеть' },
      { type: 'multiple_choice', question: '"I\'d like to emphasise" means:', options: ['я хотел бы подчеркнуть/выделить', 'я хотел бы закончить', 'я хотел бы спросить', 'я хотел бы перейти'], answer: 'я хотел бы подчеркнуть/выделить' },
      { type: 'build_sentence', question: 'Составь: your / for / Thank / attention / you', words: ['Thank', 'you', 'for', 'your', 'attention'], answer: 'Thank you for your attention' },
    ],
    quiz: [
      { question: '"To sum up" is used in the:', options: ['introduction', 'body', 'conclusion', 'Q&A section'], answer: 'conclusion' },
      { question: '"This brings me to my next point" is a:', options: ['transition phrase', 'emphasis phrase', 'closing phrase', 'opening phrase'], answer: 'transition phrase' },
      { question: 'When showing a slide, you say:', options: ['Listen to this...', 'As you can see...', 'In my opinion...', 'Moving on...'], answer: 'As you can see...' },
      { question: '"I\'m happy to take any questions" means:', options: ['вопросов нет', 'я готов ответить на вопросы', 'вопросы задавать нельзя', 'вопросы позже'], answer: 'я готов ответить на вопросы' },
      { question: 'A good presentation opening should include:', options: ['только имя спикера', 'тему и структуру презентации', 'только выводы', 'список вопросов'], answer: 'тему и структуру презентации' },
    ],
  },
  {
    id: 'b2-5-5', level: 'B2', block: 5, blockName: 'Деловой английский', order: 5,
    title: 'Деловые идиомы', duration: '20 мин',
    theory: {
      explanation: 'Деловые идиомы широко используются в бизнес-среде. "Think outside the box" — мыслить нестандартно. "Get the ball rolling" — запустить процесс/начать. "Touch base" — связаться/обсудить коротко. "On the same page" — иметь одинаковое понимание. "Ballpark figure" — приблизительная цифра. "Hit the ground running" — сразу активно начать. "Cut corners" — делать кое-как/экономить на качестве. "Go the extra mile" — сделать больше, чем требуется. "The bottom line" — суть дела/итог. "Take something on board" — принять к сведению. "Put all your eggs in one basket" — ставить всё на одно. "Burning the midnight oil" — работать допоздна. "Up to speed" — в курсе дел. "Bite off more than you can chew" — взять на себя слишком много.',
      examples: [
        { english: 'Let\'s think outside the box and find a creative solution.', russian: 'Давайте мыслить нестандартно и найти творческое решение.' },
        { english: 'I\'ll touch base with you after the meeting to discuss next steps.', russian: 'Я свяжусь с тобой после встречи, чтобы обсудить дальнейшие шаги.' },
        { english: 'We need to make sure everyone is on the same page before we proceed.', russian: 'Нам нужно убедиться, что все одинаково понимают ситуацию, прежде чем продолжать.' },
        { english: 'She always goes the extra mile to ensure customer satisfaction.', russian: 'Она всегда делает больше необходимого, чтобы обеспечить удовлетворённость клиентов.' },
        { english: 'Can you give me a ballpark figure for the project cost?', russian: 'Можете ли вы дать мне приблизительную цифру стоимости проекта?' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Think outside the box" means:', options: ['думать внутри ящика', 'мыслить нестандартно и творчески', 'думать только о деньгах', 'работать сверхурочно'], answer: 'мыслить нестандартно и творчески' },
      { type: 'fill_blank', question: 'Let\'s touch ___ tomorrow to discuss the project update.', answer: 'base', hint: 'идиома' },
      { type: 'multiple_choice', question: '"Cut corners" means:', options: ['делать работу качественно', 'делать кое-как, экономя на качестве', 'работать быстрее', 'помогать коллегам'], answer: 'делать кое-как, экономя на качестве' },
      { type: 'fill_blank', question: 'Can you give me a ___ figure for the budget?', answer: 'ballpark', hint: 'приблизительная' },
      { type: 'multiple_choice', question: '"Get the ball rolling" means:', options: ['начать процесс', 'остановить проект', 'проверить результаты', 'завершить встречу'], answer: 'начать процесс' },
    ],
    quiz: [
      { question: '"On the same page" means:', options: ['читать одну книгу', 'одинаково понимать ситуацию', 'работать в одном офисе', 'иметь одинаковые задачи'], answer: 'одинаково понимать ситуацию' },
      { question: '"Hit the ground running" describes:', options: ['медленный старт', 'активное немедленное начало', 'поздний приход', 'бег на работу'], answer: 'активное немедленное начало' },
      { question: '"Burning the midnight oil" means:', options: ['тушить пожар', 'работать очень поздно', 'сжигать документы', 'экономить электричество'], answer: 'работать очень поздно' },
      { question: '"Bite off more than you can chew" warns against:', options: ['переедания', 'взятия на себя слишком много задач', 'медленной работы', 'отказа от задач'], answer: 'взятия на себя слишком много задач' },
      { question: '"Take something on board" means:', options: ['зайти на борт', 'принять к сведению', 'выбросить идею', 'обсудить коллективно'], answer: 'принять к сведению' },
    ],
  },
  {
    id: 'c1-2-1', level: 'C1', block: 2, blockName: 'Риторика и стиль', order: 1,
    title: 'Формальный и неформальный регистр', duration: '20 мин',
    theory: {
      explanation: 'Регистр — это уровень формальности языка, адаптируемый к ситуации. Формальный регистр используется в: деловой переписке, академических текстах, официальных докладах, юридических документах. Признаки: полные формы (I am, do not), пассивный залог, сложная лексика, безличные конструкции ("It is suggested that..."), избегание идиом. Неформальный регистр: сокращения (I\'m, don\'t), разговорная лексика, фразовые глаголы, идиомы, прямое обращение. Нейтральный регистр — для большинства новостей, общих статей. Смешение регистров — распространённая ошибка. "Code-switching" — переключение между регистрами. Важно: одинаковую мысль можно выразить в разных регистрах: "I want to find out about" (нейтр.) vs "I wish to enquire about" (форм.) vs "I wanna know about" (разг.).',
      examples: [
        { english: 'Formal: I wish to enquire about the status of my application.', russian: 'Формально: Я хотел бы узнать о статусе моей заявки.' },
        { english: 'Informal: I just want to know what\'s happening with my application.', russian: 'Неформально: Я просто хочу знать, что происходит с моей заявкой.' },
        { english: 'Formal: It is recommended that the policy be reviewed annually.', russian: 'Формально: Рекомендуется ежегодно пересматривать политику.' },
        { english: 'Informal: You should check the policy every year.', russian: 'Неформально: Тебе нужно проверять политику каждый год.' },
        { english: 'Mixing registers incorrectly can undermine the credibility of your writing.', russian: 'Неправильное смешение регистров может подорвать доверие к вашему тексту.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: 'Which is MORE formal?', options: ['Can you help me?', 'I would appreciate your assistance.', 'Could you give me a hand?', 'I need some help.'], answer: 'I would appreciate your assistance.' },
      { type: 'fill_blank', question: 'Formal letters use ___ forms, not contractions.', answer: 'full', hint: 'полные' },
      { type: 'multiple_choice', question: 'Passive voice is more common in:', options: ['informal texts', 'formal/academic texts', 'casual emails', 'text messages'], answer: 'formal/academic texts' },
      { type: 'fill_blank', question: '"___ switching" refers to changing register depending on context.', answer: 'Code', hint: 'код' },
      { type: 'multiple_choice', question: 'Which is INFORMAL?', options: ['I wish to enquire about...', 'It is recommended that...', 'I wanna know about...', 'Further to our meeting...'], answer: 'I wanna know about...' },
    ],
    quiz: [
      { question: '"Register" in language refers to:', options: ['кассовый аппарат', 'уровень формальности языка', 'тип грамматики', 'скорость речи'], answer: 'уровень формальности языка' },
      { question: 'Formal writing avoids:', options: ['passive voice', 'phrasal verbs and contractions', 'complex vocabulary', 'impersonal structures'], answer: 'phrasal verbs and contractions' },
      { question: '"I wish to enquire" is __ than "I want to know":', options: ['more informal', 'more formal', 'the same register', 'more ambiguous'], answer: 'more formal' },
      { question: '"Code-switching" means:', options: ['переключение языков', 'переключение между регистрами', 'смешение языков', 'изучение кода'], answer: 'переключение между регистрами' },
      { question: 'Mixing registers inappropriately can:', options: ['улучшить текст', 'подорвать доверие к тексту', 'сделать текст интереснее', 'ускорить чтение'], answer: 'подорвать доверие к тексту' },
    ],
  },
  {
    id: 'c1-2-2', level: 'C1', block: 2, blockName: 'Риторика и стиль', order: 2,
    title: 'Риторические приёмы', duration: '20 мин',
    theory: {
      explanation: 'Риторика — искусство убедительной речи. Ключевые приёмы: Tricolon (правило трёх) — три параллельных элемента: "veni, vidi, vici", "government of the people, by the people, for the people." Anaphora — повторение слова/фразы в начале: "I have a dream... I have a dream..." Rhetorical question — вопрос, не требующий ответа: "Is this the kind of society we want?" Hyperbole — преувеличение: "I\'ve told you a million times." Metaphor — метафора: "Life is a journey." Antithesis — противопоставление: "Ask not what your country can do for you, ask what you can do for your country." Alliteration — аллитерация. Ethos (доверие), Pathos (эмоции), Logos (логика) — три основы убеждения по Аристотелю.',
      examples: [
        { english: 'The rule of three makes arguments more memorable and persuasive.', russian: 'Правило трёх делает аргументы более запоминающимися и убедительными.' },
        { english: 'Is this really the best we can do? (rhetorical question)', russian: 'Это действительно лучшее, что мы можем сделать? (риторический вопрос)' },
        { english: 'We came, we saw, we conquered. (tricolon)', russian: 'Пришли, увидели, победили. (трикулон)' },
        { english: 'One nation, under God, indivisible — anaphora creates rhythm and emphasis.', russian: 'Анафора создаёт ритм и акцент в речи.' },
        { english: 'Ethos builds credibility; pathos creates emotional connection; logos uses logic.', russian: 'Этос строит доверие; пафос создаёт эмоциональную связь; логос использует логику.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Tricolon" is the use of:', options: ['двух контрастных идей', 'трёх параллельных элементов', 'риторического вопроса', 'повторения в начале'], answer: 'трёх параллельных элементов' },
      { type: 'fill_blank', question: 'A ___ question does not require an answer.', answer: 'rhetorical', hint: 'риторический' },
      { type: 'multiple_choice', question: '"Pathos" refers to:', options: ['логика', 'эмоциональное воздействие', 'доверие к спикеру', 'повторение'], answer: 'эмоциональное воздействие' },
      { type: 'fill_blank', question: '"I have a dream... I have a dream..." is an example of ___.', answer: 'anaphora', hint: 'риторический приём' },
      { type: 'multiple_choice', question: '"Hyperbole" means:', options: ['преуменьшение', 'преувеличение для эффекта', 'сравнение двух вещей', 'правило трёх'], answer: 'преувеличение для эффекта' },
    ],
    quiz: [
      { question: '"Ethos" in persuasion refers to:', options: ['эмоциональный аргумент', 'логический аргумент', 'доверие и авторитет спикера', 'риторический вопрос'], answer: 'доверие и авторитет спикера' },
      { question: '"Antithesis" contrasts:', options: ['similar ideas', 'opposing ideas', 'three parallel ideas', 'repeated phrases'], answer: 'opposing ideas' },
      { question: '"Alliteration" is the repetition of:', options: ['слов в начале предложения', 'одного звука/буквы в начале слов', 'рифмующихся слов', 'метафор'], answer: 'одного звука/буквы в начале слов' },
      { question: '"Logos" in rhetoric means:', options: ['логический аргумент с доказательствами', 'эмоциональный призыв', 'авторитет спикера', 'повторение фраз'], answer: 'логический аргумент с доказательствами' },
      { question: 'The "rule of three" works because:', options: ['три аргумента всегда правильны', 'три элемента легко запомнить и звучат убедительно', 'три — священное число', 'так требует грамматика'], answer: 'три элемента легко запомнить и звучат убедительно' },
    ],
  },
  {
    id: 'c1-2-3', level: 'C1', block: 2, blockName: 'Риторика и стиль', order: 3,
    title: 'Язык убеждения', duration: '20 мин',
    theory: {
      explanation: 'Убедительный язык используется в рекламе, политике, журналистике. Ключевые стратегии: 1) Апелляция к авторитету: "Experts agree that...", "Studies show...". 2) Социальное доказательство: "Millions of people already use...", "Join thousands who...". 3) Scarcity (дефицит): "Limited time offer", "Only a few left". 4) Emotional appeal (эмоциональный призыв): слова, вызывающие эмоции — "crisis", "breakthrough", "revolutionary". 5) Inclusive language (инклюзивный язык): "we", "our", "together". 6) Hedged certainty: "There is no doubt that...", "It is clear that...". 7) Concession + rebuttal: "While some may argue..., the evidence clearly shows...". 8) Call to action: "Act now!", "Don\'t miss out!". Критическое мышление: умение распознавать эти приёмы защищает от манипуляций.',
      examples: [
        { english: 'Studies show that nine out of ten dentists recommend this toothpaste.', russian: 'Исследования показывают, что девять из десяти стоматологов рекомендуют эту зубную пасту.' },
        { english: 'Join millions of satisfied customers who have transformed their lives.', russian: 'Присоединяйтесь к миллионам довольных клиентов, которые изменили свою жизнь.' },
        { english: 'While some critics argue against this policy, the data clearly supports it.', russian: 'Хотя некоторые критики выступают против этой политики, данные явно её поддерживают.' },
        { english: 'There is no doubt that immediate action is required to address this crisis.', russian: 'Нет никаких сомнений, что для решения этого кризиса необходимы немедленные действия.' },
        { english: 'Together, we can build a better future for the next generation.', russian: 'Вместе мы можем построить лучшее будущее для следующего поколения.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Scarcity" in persuasion creates:', options: ['доверие', 'срочность/желание действовать быстро', 'логический аргумент', 'эмоциональную связь'], answer: 'срочность/желание действовать быстро' },
      { type: 'fill_blank', question: '"___ to action" means a call to do something now.', answer: 'Call', hint: 'призыв' },
      { type: 'multiple_choice', question: '"Inclusive language" uses:', options: ['I and me', 'we and our', 'you and your', 'they and their'], answer: 'we and our' },
      { type: 'fill_blank', question: '"While some ___, the evidence shows..." — concession + rebuttal.', answer: 'argue', hint: 'утверждают' },
      { type: 'multiple_choice', question: '"Appeal to authority" uses:', options: ['личный опыт', 'мнения экспертов и исследования', 'эмоции аудитории', 'повторение фраз'], answer: 'мнения экспертов и исследования' },
    ],
    quiz: [
      { question: '"Social proof" in persuasion refers to:', options: ['scientific evidence', 'popularity as proof of quality', 'emotional stories', 'statistical data'], answer: 'popularity as proof of quality' },
      { question: '"There is no doubt that..." is an example of:', options: ['hedging', 'hedged certainty (уверенное утверждение)', 'concession', 'rhetorical question'], answer: 'hedged certainty (уверенное утверждение)' },
      { question: '"Critical thinking" helps you:', options: ['принять рекламу на веру', 'распознать и оценить приёмы убеждения', 'говорить убедительнее', 'писать рекламные тексты'], answer: 'распознать и оценить приёмы убеждения' },
      { question: '"Emotional appeal" targets:', options: ['логику читателя', 'чувства и эмоции аудитории', 'авторитет спикера', 'факты и данные'], answer: 'чувства и эмоции аудитории' },
      { question: 'A "concession + rebuttal" structure:', options: ['игнорирует контраргументы', 'признаёт и опровергает контраргументы', 'только соглашается с критикой', 'избегает спорных тем'], answer: 'признаёт и опровергает контраргументы' },
    ],
  },
  {
    id: 'c1-2-4', level: 'C1', block: 2, blockName: 'Риторика и стиль', order: 4,
    title: 'Дискурсивные маркеры', duration: '20 мин',
    theory: {
      explanation: 'Дискурсивные маркеры (discourse markers) — слова и фразы, организующие речь и письмо. Типы: 1) Начало: "To begin with...", "First and foremost...", "The issue at hand is...". 2) Добавление: "What is more...", "Not only that, but...", "Over and above this...". 3) Уточнение: "In particular...", "Specifically...", "To be precise...", "That is to say...". 4) Отступление: "Incidentally...", "By the way...", "As a side note...". 5) Возврат к теме: "As I was saying...", "Getting back to the main point...", "Returning to...". 6) Подытоживание: "All in all...", "On balance...", "Taking everything into account...". 7) Изменение направления: "That said...", "Even so...", "Be that as it may...". В устной речи добавляются fillers: "well", "you know", "I mean", "right?"',
      examples: [
        { english: 'First and foremost, we need to address the safety concerns.', russian: 'Прежде всего, нам нужно решить вопросы безопасности.' },
        { english: 'That said, we cannot ignore the economic implications.', russian: 'При этом мы не можем игнорировать экономические последствия.' },
        { english: 'On balance, the benefits outweigh the disadvantages.', russian: 'В целом, преимущества перевешивают недостатки.' },
        { english: 'Getting back to the main point — what is our core objective?', russian: 'Возвращаясь к главному вопросу — какова наша основная цель?' },
        { english: 'To be precise, the error occurred at 14:37, not 14:30.', russian: 'Если быть точным, ошибка произошла в 14:37, а не в 14:30.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"First and foremost" means:', options: ['во-вторых', 'прежде всего/в первую очередь', 'в заключение', 'тем не менее'], answer: 'прежде всего/в первую очередь' },
      { type: 'fill_blank', question: '___ said, we still need to consider the risks.', answer: 'That', hint: 'discourse marker' },
      { type: 'multiple_choice', question: '"On balance" means:', options: ['потеряв равновесие', 'взвесив всё/в целом', 'в конкретном случае', 'немедленно'], answer: 'взвесив всё/в целом' },
      { type: 'fill_blank', question: 'Getting ___ to the main point — let\'s focus on the deadline.', answer: 'back', hint: 'обратно' },
      { type: 'multiple_choice', question: '"Incidentally" introduces:', options: ['главную мысль', 'второстепенное/случайное замечание', 'заключение', 'опровержение'], answer: 'второстепенное/случайное замечание' },
    ],
    quiz: [
      { question: '"Discourse markers" are used to:', options: ['избежать повторений', 'организовать и связать речь/текст', 'описать факты', 'задать вопросы'], answer: 'организовать и связать речь/текст' },
      { question: '"Be that as it may" means:', options: ['так и должно быть', 'несмотря на это/тем не менее', 'именно поэтому', 'в результате'], answer: 'несмотря на это/тем не менее' },
      { question: '"What is more" is used to:', options: ['задать вопрос', 'добавить ещё один аргумент', 'сделать вывод', 'вернуться к теме'], answer: 'добавить ещё один аргумент' },
      { question: '"To be precise" is used to:', options: ['обобщить информацию', 'уточнить детали', 'ввести новую тему', 'выразить несогласие'], answer: 'уточнить детали' },
      { question: 'In spoken English, "fillers" like "you know" or "I mean" help:', options: ['сделать речь более формальной', 'дать время на обдумывание', 'передать точную информацию', 'убедить слушателя'], answer: 'дать время на обдумывание' },
    ],
  },
  {
    id: 'c1-2-5', level: 'C1', block: 2, blockName: 'Риторика и стиль', order: 5,
    title: 'Изысканные коннекторы', duration: '20 мин',
    theory: {
      explanation: 'На уровне C1 используются более сложные связующие конструкции. Уступка: "notwithstanding" (невзирая на), "albeit" (хотя и), "granted that" (хотя признаём, что). Причина: "inasmuch as" (поскольку), "in that" (в том что), "on the grounds that" (на том основании, что). Следствие: "thereby" (тем самым), "therein" (в этом), "insofar as" (постольку поскольку). Условие: "on condition that", "in the event that" (в случае если), "provided that". Сравнение: "by the same token" (аналогично, по той же причине), "in a similar vein" (в том же духе). Противопоставление: "conversely" (с другой стороны/напротив), "by contrast" (в отличие от). Временные: "simultaneously" (одновременно), "subsequently" (впоследствии), "hitherto" (до сих пор).',
      examples: [
        { english: 'The project was completed on time, albeit with some difficulties.', russian: 'Проект был завершён в срок, хотя и с некоторыми трудностями.' },
        { english: 'Notwithstanding the challenges, the team delivered excellent results.', russian: 'Невзирая на трудности, команда показала отличные результаты.' },
        { english: 'The policy was revised, thereby addressing the main concerns raised.', russian: 'Политика была пересмотрена, тем самым решив основные поднятые вопросы.' },
        { english: 'Conversely, the control group showed no significant improvement.', russian: 'Напротив, контрольная группа не показала значительного улучшения.' },
        { english: 'By the same token, we cannot expect different results without change.', russian: 'Аналогично, мы не можем ожидать других результатов без изменений.' },
      ],
    },
    exercises: [
      { type: 'multiple_choice', question: '"Albeit" means:', options: ['поэтому', 'хотя и', 'кроме того', 'следовательно'], answer: 'хотя и' },
      { type: 'fill_blank', question: 'The results were positive, ___ the limited sample size.', answer: 'notwithstanding', hint: 'невзирая на' },
      { type: 'multiple_choice', question: '"Conversely" introduces:', options: ['additional information', 'contrasting information', 'a conclusion', 'a reason'], answer: 'contrasting information' },
      { type: 'fill_blank', question: 'The new law was passed, ___ reducing the risk of fraud.', answer: 'thereby', hint: 'тем самым' },
      { type: 'multiple_choice', question: '"By the same token" means:', options: ['по другой причине', 'аналогично/по той же логике', 'несмотря на это', 'в результате'], answer: 'аналогично/по той же логике' },
    ],
    quiz: [
      { question: '"Inasmuch as" means:', options: ['несмотря на то что', 'поскольку/в той мере, в какой', 'хотя и', 'в результате'], answer: 'поскольку/в той мере, в какой' },
      { question: '"Subsequently" means:', options: ['одновременно', 'впоследствии/затем', 'до сих пор', 'напротив'], answer: 'впоследствии/затем' },
      { question: '"Hitherto" refers to:', options: ['будущий период', 'период до настоящего момента', 'одновременные события', 'причинно-следственную связь'], answer: 'период до настоящего момента' },
      { question: '"On the grounds that" introduces:', options: ['результат', 'основание/причину', 'уступку', 'условие'], answer: 'основание/причину' },
      { question: '"In a similar vein" means:', options: ['в жиле', 'в том же духе/аналогично', 'в противоположность', 'тем самым'], answer: 'в том же духе/аналогично' },
    ],
  },
]

