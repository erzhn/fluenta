export interface VocabWord {
  id: string
  lessonId: string
  word: string
  translation: string
  example: string
  exampleTranslation: string
  // Methodology fields (optional, shown on flashcard back)
  partOfSpeech?: string    // 'n' | 'v' | 'adj' | 'adv' | 'phr v' | 'n phr' | etc.
  definition?: string      // English-language definition (monolingual dictionary approach)
  synonyms?: string[]      // Lexical chain: words with similar meaning
  antonym?: string         // Opposite word (with gradient: dirty → clean → filthy)
}

export const VOCABULARY: VocabWord[] = [
  // a1-1-1: To Be
  { id: 'v-a1-1-1-1', lessonId: 'a1-1-1', word: 'happy', translation: 'счастливый', example: 'I am very happy today.', exampleTranslation: 'Я сегодня очень счастлив.' },
  { id: 'v-a1-1-1-2', lessonId: 'a1-1-1', word: 'tired', translation: 'уставший', example: 'She is tired after work.', exampleTranslation: 'Она устала после работы.' },
  { id: 'v-a1-1-1-3', lessonId: 'a1-1-1', word: 'hungry', translation: 'голодный', example: 'Are you hungry? Let\'s eat!', exampleTranslation: 'Ты голоден? Давай поедим!' },
  { id: 'v-a1-1-1-4', lessonId: 'a1-1-1', word: 'student', translation: 'студент', example: 'I am a student at university.', exampleTranslation: 'Я студент университета.' },
  { id: 'v-a1-1-1-5', lessonId: 'a1-1-1', word: 'teacher', translation: 'учитель', example: 'My teacher is very kind.', exampleTranslation: 'Мой учитель очень добрый.' },
  { id: 'v-a1-1-1-6', lessonId: 'a1-1-1', word: 'friend', translation: 'друг', example: 'He is my best friend.', exampleTranslation: 'Он мой лучший друг.' },
  { id: 'v-a1-1-1-7', lessonId: 'a1-1-1', word: 'brother', translation: 'брат', example: 'My brother is ten years old.', exampleTranslation: 'Моему брату десять лет.' },
  { id: 'v-a1-1-1-8', lessonId: 'a1-1-1', word: 'sister', translation: 'сестра', example: 'Her sister is a doctor.', exampleTranslation: 'Её сестра — врач.' },

  // a1-1-2: Знакомство
  { id: 'v-a1-1-2-1', lessonId: 'a1-1-2', word: 'name', translation: 'имя', example: 'My name is Anna.', exampleTranslation: 'Меня зовут Анна.' },
  { id: 'v-a1-1-2-2', lessonId: 'a1-1-2', word: 'age', translation: 'возраст', example: 'What is your age?', exampleTranslation: 'Сколько тебе лет?' },
  { id: 'v-a1-1-2-3', lessonId: 'a1-1-2', word: 'country', translation: 'страна', example: 'What country are you from?', exampleTranslation: 'Из какой ты страны?' },
  { id: 'v-a1-1-2-4', lessonId: 'a1-1-2', word: 'city', translation: 'город', example: 'I live in a big city.', exampleTranslation: 'Я живу в большом городе.' },
  { id: 'v-a1-1-2-5', lessonId: 'a1-1-2', word: 'speak', translation: 'говорить', example: 'Do you speak English?', exampleTranslation: 'Ты говоришь по-английски?' },
  { id: 'v-a1-1-2-6', lessonId: 'a1-1-2', word: 'understand', translation: 'понимать', example: 'I don\'t understand this word.', exampleTranslation: 'Я не понимаю это слово.' },
  { id: 'v-a1-1-2-7', lessonId: 'a1-1-2', word: 'nice', translation: 'приятный / хороший', example: 'It\'s nice to meet you!', exampleTranslation: 'Приятно познакомиться!' },
  { id: 'v-a1-1-2-8', lessonId: 'a1-1-2', word: 'meet', translation: 'встречать / знакомиться', example: 'I want to meet new people.', exampleTranslation: 'Я хочу знакомиться с новыми людьми.' },

  // a1-1-3: Числа
  { id: 'v-a1-1-3-1', lessonId: 'a1-1-3', word: 'number', translation: 'число / номер', example: 'What is your phone number?', exampleTranslation: 'Какой твой номер телефона?' },
  { id: 'v-a1-1-3-2', lessonId: 'a1-1-3', word: 'year', translation: 'год', example: 'I am twenty years old.', exampleTranslation: 'Мне двадцать лет.' },
  { id: 'v-a1-1-3-3', lessonId: 'a1-1-3', word: 'hundred', translation: 'сто', example: 'There are one hundred students.', exampleTranslation: 'Здесь сто студентов.' },
  { id: 'v-a1-1-3-4', lessonId: 'a1-1-3', word: 'thousand', translation: 'тысяча', example: 'This costs one thousand dollars.', exampleTranslation: 'Это стоит тысячу долларов.' },
  { id: 'v-a1-1-3-5', lessonId: 'a1-1-3', word: 'floor', translation: 'этаж', example: 'I live on the third floor.', exampleTranslation: 'Я живу на третьем этаже.' },
  { id: 'v-a1-1-3-6', lessonId: 'a1-1-3', word: 'phone', translation: 'телефон', example: 'My phone number is 555-0123.', exampleTranslation: 'Мой номер телефона 555-0123.' },
  { id: 'v-a1-1-3-7', lessonId: 'a1-1-3', word: 'address', translation: 'адрес', example: 'What is your address?', exampleTranslation: 'Какой у тебя адрес?' },
  { id: 'v-a1-1-3-8', lessonId: 'a1-1-3', word: 'count', translation: 'считать', example: 'Can you count to one hundred?', exampleTranslation: 'Ты можешь посчитать до ста?' },

  // a1-1-4: Дни
  { id: 'v-a1-1-4-1', lessonId: 'a1-1-4', word: 'Monday', translation: 'понедельник', example: 'I have English on Monday.', exampleTranslation: 'У меня английский в понедельник.' },
  { id: 'v-a1-1-4-2', lessonId: 'a1-1-4', word: 'weekend', translation: 'выходные', example: 'What do you do at the weekend?', exampleTranslation: 'Что ты делаешь на выходных?' },
  { id: 'v-a1-1-4-3', lessonId: 'a1-1-4', word: 'holiday', translation: 'праздник / каникулы', example: 'Christmas is my favourite holiday.', exampleTranslation: 'Рождество — мой любимый праздник.' },
  { id: 'v-a1-1-4-4', lessonId: 'a1-1-4', word: 'birthday', translation: 'день рождения', example: 'My birthday is in June.', exampleTranslation: 'Мой день рождения в июне.' },
  { id: 'v-a1-1-4-5', lessonId: 'a1-1-4', word: 'morning', translation: 'утро', example: 'I drink coffee in the morning.', exampleTranslation: 'Я пью кофе по утрам.' },
  { id: 'v-a1-1-4-6', lessonId: 'a1-1-4', word: 'evening', translation: 'вечер', example: 'We watch TV in the evening.', exampleTranslation: 'Вечером мы смотрим телевизор.' },
  { id: 'v-a1-1-4-7', lessonId: 'a1-1-4', word: 'tonight', translation: 'сегодня вечером', example: 'Are you free tonight?', exampleTranslation: 'Ты свободен сегодня вечером?' },
  { id: 'v-a1-1-4-8', lessonId: 'a1-1-4', word: 'tomorrow', translation: 'завтра', example: 'See you tomorrow!', exampleTranslation: 'Увидимся завтра!' },

  // a1-1-5: Цвета
  { id: 'v-a1-1-5-1', lessonId: 'a1-1-5', word: 'colour', translation: 'цвет', example: 'What is your favourite colour?', exampleTranslation: 'Какой твой любимый цвет?' },
  { id: 'v-a1-1-5-2', lessonId: 'a1-1-5', word: 'bright', translation: 'яркий', example: 'The flowers are bright yellow.', exampleTranslation: 'Цветы ярко-жёлтые.' },
  { id: 'v-a1-1-5-3', lessonId: 'a1-1-5', word: 'dark', translation: 'тёмный', example: 'She has dark brown hair.', exampleTranslation: 'У неё тёмно-каштановые волосы.' },
  { id: 'v-a1-1-5-4', lessonId: 'a1-1-5', word: 'light', translation: 'светлый / лёгкий', example: 'I prefer light colours.', exampleTranslation: 'Я предпочитаю светлые цвета.' },
  { id: 'v-a1-1-5-5', lessonId: 'a1-1-5', word: 'choose', translation: 'выбирать', example: 'Choose your favourite colour.', exampleTranslation: 'Выбери свой любимый цвет.' },
  { id: 'v-a1-1-5-6', lessonId: 'a1-1-5', word: 'favourite', translation: 'любимый', example: 'Blue is my favourite colour.', exampleTranslation: 'Синий — мой любимый цвет.' },
  { id: 'v-a1-1-5-7', lessonId: 'a1-1-5', word: 'beautiful', translation: 'красивый', example: 'What a beautiful painting!', exampleTranslation: 'Какая красивая картина!' },
  { id: 'v-a1-1-5-8', lessonId: 'a1-1-5', word: 'ugly', translation: 'некрасивый', example: 'That colour looks ugly here.', exampleTranslation: 'Этот цвет здесь выглядит некрасиво.' },

  // a1-2-6: Have got
  { id: 'v-a1-2-6-1', lessonId: 'a1-2-6', word: 'own', translation: 'иметь в собственности', example: 'Do you own a car?', exampleTranslation: 'У тебя есть своя машина?' },
  { id: 'v-a1-2-6-2', lessonId: 'a1-2-6', word: 'borrow', translation: 'одалживать (брать)', example: 'Can I borrow your pen?', exampleTranslation: 'Можно одолжить твою ручку?' },
  { id: 'v-a1-2-6-3', lessonId: 'a1-2-6', word: 'lend', translation: 'одалживать (давать)', example: 'Can you lend me five pounds?', exampleTranslation: 'Можешь одолжить мне пять фунтов?' },
  { id: 'v-a1-2-6-4', lessonId: 'a1-2-6', word: 'need', translation: 'нуждаться', example: 'I need a new notebook.', exampleTranslation: 'Мне нужна новая тетрадь.' },
  { id: 'v-a1-2-6-5', lessonId: 'a1-2-6', word: 'share', translation: 'делиться', example: 'We share a room at university.', exampleTranslation: 'Мы делим комнату в университете.' },
  { id: 'v-a1-2-6-6', lessonId: 'a1-2-6', word: 'use', translation: 'использовать', example: 'Can I use your phone?', exampleTranslation: 'Можно использовать твой телефон?' },
  { id: 'v-a1-2-6-7', lessonId: 'a1-2-6', word: 'belong', translation: 'принадлежать', example: 'This bag belongs to me.', exampleTranslation: 'Эта сумка принадлежит мне.' },
  { id: 'v-a1-2-6-8', lessonId: 'a1-2-6', word: 'keep', translation: 'хранить / держать', example: 'Keep this key, please.', exampleTranslation: 'Сохрани, пожалуйста, этот ключ.' },

  // a1-2-7: Семья
  { id: 'v-a1-2-7-1', lessonId: 'a1-2-7', word: 'married', translation: 'женатый / замужем', example: 'They got married last year.', exampleTranslation: 'Они поженились в прошлом году.' },
  { id: 'v-a1-2-7-2', lessonId: 'a1-2-7', word: 'single', translation: 'холостой / незамужняя', example: 'She is single and happy.', exampleTranslation: 'Она не замужем и счастлива.' },
  { id: 'v-a1-2-7-3', lessonId: 'a1-2-7', word: 'relatives', translation: 'родственники', example: 'We visit relatives at Christmas.', exampleTranslation: 'На Рождество мы навещаем родственников.' },
  { id: 'v-a1-2-7-4', lessonId: 'a1-2-7', word: 'parents', translation: 'родители', example: 'My parents live in Moscow.', exampleTranslation: 'Мои родители живут в Москве.' },
  { id: 'v-a1-2-7-5', lessonId: 'a1-2-7', word: 'children', translation: 'дети', example: 'They have three children.', exampleTranslation: 'У них трое детей.' },
  { id: 'v-a1-2-7-6', lessonId: 'a1-2-7', word: 'couple', translation: 'пара', example: 'They are a lovely couple.', exampleTranslation: 'Они прекрасная пара.' },
  { id: 'v-a1-2-7-7', lessonId: 'a1-2-7', word: 'twins', translation: 'близнецы', example: 'She has twin brothers.', exampleTranslation: 'У неё братья-близнецы.' },
  { id: 'v-a1-2-7-8', lessonId: 'a1-2-7', word: 'only child', translation: 'единственный ребёнок', example: 'I am an only child.', exampleTranslation: 'Я единственный ребёнок в семье.' },

  // a1-2-8: Дом
  { id: 'v-a1-2-8-1', lessonId: 'a1-2-8', word: 'rent', translation: 'арендовать / аренда', example: 'We rent a flat in the city.', exampleTranslation: 'Мы снимаем квартиру в городе.' },
  { id: 'v-a1-2-8-2', lessonId: 'a1-2-8', word: 'move', translation: 'переезжать', example: 'We moved to a new house.', exampleTranslation: 'Мы переехали в новый дом.' },
  { id: 'v-a1-2-8-3', lessonId: 'a1-2-8', word: 'flat', translation: 'квартира', example: 'I live in a small flat.', exampleTranslation: 'Я живу в маленькой квартире.' },
  { id: 'v-a1-2-8-4', lessonId: 'a1-2-8', word: 'room', translation: 'комната', example: 'My room is on the second floor.', exampleTranslation: 'Моя комната на втором этаже.' },
  { id: 'v-a1-2-8-5', lessonId: 'a1-2-8', word: 'space', translation: 'пространство / место', example: 'There is a lot of space here.', exampleTranslation: 'Здесь много места.' },
  { id: 'v-a1-2-8-6', lessonId: 'a1-2-8', word: 'tidy', translation: 'аккуратный / убирать', example: 'Please keep your room tidy.', exampleTranslation: 'Пожалуйста, держи свою комнату в порядке.' },
  { id: 'v-a1-2-8-7', lessonId: 'a1-2-8', word: 'messy', translation: 'беспорядочный', example: 'His desk is always messy.', exampleTranslation: 'На его столе всегда беспорядок.' },
  { id: 'v-a1-2-8-8', lessonId: 'a1-2-8', word: 'house', translation: 'дом (отдельный)', example: 'They live in a big house.', exampleTranslation: 'Они живут в большом доме.' },

  // a1-2-9: Предлоги места
  { id: 'v-a1-2-9-1', lessonId: 'a1-2-9', word: 'opposite', translation: 'напротив', example: 'The bank is opposite the park.', exampleTranslation: 'Банк напротив парка.' },
  { id: 'v-a1-2-9-2', lessonId: 'a1-2-9', word: 'corner', translation: 'угол', example: 'Turn left at the corner.', exampleTranslation: 'Поверни налево на углу.' },
  { id: 'v-a1-2-9-3', lessonId: 'a1-2-9', word: 'middle', translation: 'середина', example: 'The table is in the middle.', exampleTranslation: 'Стол стоит посередине.' },
  { id: 'v-a1-2-9-4', lessonId: 'a1-2-9', word: 'end', translation: 'конец / край', example: 'The shop is at the end of the street.', exampleTranslation: 'Магазин в конце улицы.' },
  { id: 'v-a1-2-9-5', lessonId: 'a1-2-9', word: 'side', translation: 'сторона', example: 'Sit on this side of the room.', exampleTranslation: 'Сядь на эту сторону комнаты.' },
  { id: 'v-a1-2-9-6', lessonId: 'a1-2-9', word: 'distance', translation: 'расстояние', example: 'It\'s a short distance from here.', exampleTranslation: 'Это недалеко отсюда.' },
  { id: 'v-a1-2-9-7', lessonId: 'a1-2-9', word: 'close', translation: 'близко', example: 'The school is close to my home.', exampleTranslation: 'Школа близко от моего дома.' },
  { id: 'v-a1-2-9-8', lessonId: 'a1-2-9', word: 'far', translation: 'далеко', example: 'The airport is far from the city.', exampleTranslation: 'Аэропорт далеко от города.' },

  // a1-2-10: There is/are
  { id: 'v-a1-2-10-1', lessonId: 'a1-2-10', word: 'exist', translation: 'существовать', example: 'Does this word exist in English?', exampleTranslation: 'Это слово существует в английском?' },
  { id: 'v-a1-2-10-2', lessonId: 'a1-2-10', word: 'available', translation: 'доступный', example: 'Is this size available?', exampleTranslation: 'Этот размер есть в наличии?' },
  { id: 'v-a1-2-10-3', lessonId: 'a1-2-10', word: 'empty', translation: 'пустой', example: 'The room is empty.', exampleTranslation: 'Комната пустая.' },
  { id: 'v-a1-2-10-4', lessonId: 'a1-2-10', word: 'full', translation: 'полный', example: 'The bus is full.', exampleTranslation: 'Автобус полный.' },
  { id: 'v-a1-2-10-5', lessonId: 'a1-2-10', word: 'several', translation: 'несколько', example: 'There are several books on the shelf.', exampleTranslation: 'На полке несколько книг.' },
  { id: 'v-a1-2-10-6', lessonId: 'a1-2-10', word: 'none', translation: 'ни одного', example: 'There is none left.', exampleTranslation: 'Ничего не осталось.' },
  { id: 'v-a1-2-10-7', lessonId: 'a1-2-10', word: 'enough', translation: 'достаточно', example: 'There is enough food for everyone.', exampleTranslation: 'Еды хватит на всех.' },
  { id: 'v-a1-2-10-8', lessonId: 'a1-2-10', word: 'plenty', translation: 'много / в изобилии', example: 'There is plenty of time.', exampleTranslation: 'Времени предостаточно.' },

  // a1-3-11: Present Simple
  { id: 'v-a1-3-11-1', lessonId: 'a1-3-11', word: 'routine', translation: 'распорядок / рутина', example: 'I have a morning routine.', exampleTranslation: 'У меня есть утренний распорядок.' },
  { id: 'v-a1-3-11-2', lessonId: 'a1-3-11', word: 'habit', translation: 'привычка', example: 'Reading is a good habit.', exampleTranslation: 'Чтение — хорошая привычка.' },
  { id: 'v-a1-3-11-3', lessonId: 'a1-3-11', word: 'always', translation: 'всегда', example: 'She always arrives on time.', exampleTranslation: 'Она всегда приходит вовремя.' },
  { id: 'v-a1-3-11-4', lessonId: 'a1-3-11', word: 'usually', translation: 'обычно', example: 'I usually walk to work.', exampleTranslation: 'Я обычно хожу на работу пешком.' },
  { id: 'v-a1-3-11-5', lessonId: 'a1-3-11', word: 'sometimes', translation: 'иногда', example: 'We sometimes eat out.', exampleTranslation: 'Мы иногда едим вне дома.' },
  { id: 'v-a1-3-11-6', lessonId: 'a1-3-11', word: 'never', translation: 'никогда', example: 'He never drinks coffee.', exampleTranslation: 'Он никогда не пьёт кофе.' },
  { id: 'v-a1-3-11-7', lessonId: 'a1-3-11', word: 'work', translation: 'работать', example: 'She works at a hospital.', exampleTranslation: 'Она работает в больнице.' },
  { id: 'v-a1-3-11-8', lessonId: 'a1-3-11', word: 'study', translation: 'учиться / изучать', example: 'I study English every day.', exampleTranslation: 'Я учу английский каждый день.' },

  // a1-3-12: Наречия частоты
  { id: 'v-a1-3-12-1', lessonId: 'a1-3-12', word: 'often', translation: 'часто', example: 'Do you often go to the gym?', exampleTranslation: 'Ты часто ходишь в тренажёрный зал?' },
  { id: 'v-a1-3-12-2', lessonId: 'a1-3-12', word: 'rarely', translation: 'редко', example: 'She rarely eats meat.', exampleTranslation: 'Она редко ест мясо.' },
  { id: 'v-a1-3-12-3', lessonId: 'a1-3-12', word: 'occasionally', translation: 'иногда / случайно', example: 'I occasionally visit my aunt.', exampleTranslation: 'Я иногда навещаю тётю.' },
  { id: 'v-a1-3-12-4', lessonId: 'a1-3-12', word: 'frequently', translation: 'часто / регулярно', example: 'He frequently travels abroad.', exampleTranslation: 'Он часто путешествует за границу.' },
  { id: 'v-a1-3-12-5', lessonId: 'a1-3-12', word: 'regularly', translation: 'регулярно', example: 'Exercise regularly for good health.', exampleTranslation: 'Занимайся физкультурой регулярно для здоровья.' },
  { id: 'v-a1-3-12-6', lessonId: 'a1-3-12', word: 'hardly', translation: 'едва / почти не', example: 'I can hardly hear you.', exampleTranslation: 'Я едва тебя слышу.' },
  { id: 'v-a1-3-12-7', lessonId: 'a1-3-12', word: 'ever', translation: 'когда-нибудь', example: 'Have you ever been to Japan?', exampleTranslation: 'Ты когда-нибудь бывал в Японии?' },
  { id: 'v-a1-3-12-8', lessonId: 'a1-3-12', word: 'seldom', translation: 'редко', example: 'She seldom goes out at night.', exampleTranslation: 'Она редко выходит ночью.' },

  // a1-3-13: Время
  { id: 'v-a1-3-13-1', lessonId: 'a1-3-13', word: 'early', translation: 'рано', example: 'I wake up early on weekdays.', exampleTranslation: 'По будням я встаю рано.' },
  { id: 'v-a1-3-13-2', lessonId: 'a1-3-13', word: 'late', translation: 'поздно', example: 'Don\'t be late for class!', exampleTranslation: 'Не опаздывай на занятия!' },
  { id: 'v-a1-3-13-3', lessonId: 'a1-3-13', word: 'on time', translation: 'вовремя', example: 'Please arrive on time.', exampleTranslation: 'Пожалуйста, приходи вовремя.' },
  { id: 'v-a1-3-13-4', lessonId: 'a1-3-13', word: 'schedule', translation: 'расписание', example: 'Check the bus schedule.', exampleTranslation: 'Проверь расписание автобусов.' },
  { id: 'v-a1-3-13-5', lessonId: 'a1-3-13', word: 'appointment', translation: 'встреча / запись (к врачу)', example: 'I have a doctor\'s appointment.', exampleTranslation: 'У меня запись к врачу.' },
  { id: 'v-a1-3-13-6', lessonId: 'a1-3-13', word: 'arrive', translation: 'прибывать / приходить', example: 'What time does the train arrive?', exampleTranslation: 'В котором часу прибывает поезд?' },
  { id: 'v-a1-3-13-7', lessonId: 'a1-3-13', word: 'leave', translation: 'уходить / уезжать', example: 'I leave home at 8 o\'clock.', exampleTranslation: 'Я ухожу из дома в 8 часов.' },
  { id: 'v-a1-3-13-8', lessonId: 'a1-3-13', word: 'wait', translation: 'ждать', example: 'Wait for me, please!', exampleTranslation: 'Подожди меня, пожалуйста!' },

  // a1-3-14: Глаголы действия
  { id: 'v-a1-3-14-1', lessonId: 'a1-3-14', word: 'wake up', translation: 'просыпаться', example: 'I wake up at seven o\'clock.', exampleTranslation: 'Я просыпаюсь в семь часов.' },
  { id: 'v-a1-3-14-2', lessonId: 'a1-3-14', word: 'get up', translation: 'вставать', example: 'I get up at half past seven.', exampleTranslation: 'Я встаю в половине восьмого.' },
  { id: 'v-a1-3-14-3', lessonId: 'a1-3-14', word: 'have breakfast', translation: 'завтракать', example: 'I have breakfast at eight.', exampleTranslation: 'Я завтракаю в восемь.' },
  { id: 'v-a1-3-14-4', lessonId: 'a1-3-14', word: 'go home', translation: 'идти домой', example: 'I go home at five o\'clock.', exampleTranslation: 'Я иду домой в пять часов.' },
  { id: 'v-a1-3-14-5', lessonId: 'a1-3-14', word: 'cook dinner', translation: 'готовить ужин', example: 'She cooks dinner every evening.', exampleTranslation: 'Она готовит ужин каждый вечер.' },
  { id: 'v-a1-3-14-6', lessonId: 'a1-3-14', word: 'watch TV', translation: 'смотреть телевизор', example: 'We watch TV after dinner.', exampleTranslation: 'После ужина мы смотрим телевизор.' },
  { id: 'v-a1-3-14-7', lessonId: 'a1-3-14', word: 'go to bed', translation: 'ложиться спать', example: 'I go to bed at eleven.', exampleTranslation: 'Я ложусь спать в одиннадцать.' },
  { id: 'v-a1-3-14-8', lessonId: 'a1-3-14', word: 'sleep', translation: 'спать', example: 'I sleep for eight hours.', exampleTranslation: 'Я сплю восемь часов.' },

  // a1-3-15: Present Continuous
  { id: 'v-a1-3-15-1', lessonId: 'a1-3-15', word: 'currently', translation: 'в настоящее время', example: 'I am currently studying English.', exampleTranslation: 'В настоящее время я изучаю английский.' },
  { id: 'v-a1-3-15-2', lessonId: 'a1-3-15', word: 'right now', translation: 'прямо сейчас', example: 'What are you doing right now?', exampleTranslation: 'Что ты делаешь прямо сейчас?' },
  { id: 'v-a1-3-15-3', lessonId: 'a1-3-15', word: 'at the moment', translation: 'в данный момент', example: 'She is working at the moment.', exampleTranslation: 'Она работает в данный момент.' },
  { id: 'v-a1-3-15-4', lessonId: 'a1-3-15', word: 'busy', translation: 'занятой', example: 'I\'m busy — I\'m cooking!', exampleTranslation: 'Я занят — я готовлю!' },
  { id: 'v-a1-3-15-5', lessonId: 'a1-3-15', word: 'happening', translation: 'происходящий', example: 'What is happening here?', exampleTranslation: 'Что здесь происходит?' },
  { id: 'v-a1-3-15-6', lessonId: 'a1-3-15', word: 'notice', translation: 'замечать', example: 'I am noticing something strange.', exampleTranslation: 'Я замечаю что-то странное.' },
  { id: 'v-a1-3-15-7', lessonId: 'a1-3-15', word: 'listen', translation: 'слушать', example: 'Are you listening to music?', exampleTranslation: 'Ты слушаешь музыку?' },
  { id: 'v-a1-3-15-8', lessonId: 'a1-3-15', word: 'talk', translation: 'разговаривать', example: 'They are talking on the phone.', exampleTranslation: 'Они разговаривают по телефону.' },

  // ── Extended words (7 per lesson, lessons a1-1-1 to a1-2-10) ──

  // a1-1-1 extra (9-15)
  { id: 'v-a1-1-1-9', lessonId: 'a1-1-1', word: 'excited', translation: 'взволнованный', example: 'I am excited about the trip.', exampleTranslation: 'Я взволнован из-за поездки.' },
  { id: 'v-a1-1-1-10', lessonId: 'a1-1-1', word: 'sad', translation: 'грустный', example: 'She is sad today.', exampleTranslation: 'Сегодня она грустная.' },
  { id: 'v-a1-1-1-11', lessonId: 'a1-1-1', word: 'angry', translation: 'злой', example: 'He is angry with his brother.', exampleTranslation: 'Он злится на своего брата.' },
  { id: 'v-a1-1-1-12', lessonId: 'a1-1-1', word: 'tall', translation: 'высокий', example: 'My father is very tall.', exampleTranslation: 'Мой отец очень высокий.' },
  { id: 'v-a1-1-1-13', lessonId: 'a1-1-1', word: 'young', translation: 'молодой', example: 'She is young and energetic.', exampleTranslation: 'Она молодая и энергичная.' },
  { id: 'v-a1-1-1-14', lessonId: 'a1-1-1', word: 'old', translation: 'старый', example: 'This building is very old.', exampleTranslation: 'Это здание очень старое.' },
  { id: 'v-a1-1-1-15', lessonId: 'a1-1-1', word: 'strong', translation: 'сильный', example: 'He is strong and healthy.', exampleTranslation: 'Он сильный и здоровый.' },

  // a1-1-2 extra (9-15)
  { id: 'v-a1-1-2-9', lessonId: 'a1-1-2', word: 'introduce', translation: 'представить', example: 'Let me introduce my friend.', exampleTranslation: 'Позвольте представить моего друга.' },
  { id: 'v-a1-1-2-10', lessonId: 'a1-1-2', word: 'nationality', translation: 'национальность', example: 'What is your nationality?', exampleTranslation: 'Какая у тебя национальность?' },
  { id: 'v-a1-1-2-11', lessonId: 'a1-1-2', word: 'profession', translation: 'профессия', example: 'What is your profession?', exampleTranslation: 'Какая у вас профессия?' },
  { id: 'v-a1-1-2-12', lessonId: 'a1-1-2', word: 'surname', translation: 'фамилия', example: 'What is your surname?', exampleTranslation: 'Какая у вас фамилия?' },
  { id: 'v-a1-1-2-13', lessonId: 'a1-1-2', word: 'hobby', translation: 'хобби', example: 'My hobby is reading books.', exampleTranslation: 'Моё хобби — чтение книг.' },
  { id: 'v-a1-1-2-14', lessonId: 'a1-1-2', word: 'married', translation: 'женатый / замужем', example: 'Are you married or single?', exampleTranslation: 'Вы женаты или не замужем?' },
  { id: 'v-a1-1-2-15', lessonId: 'a1-1-2', word: 'single', translation: 'холостой / незамужняя', example: 'He has been single for years.', exampleTranslation: 'Он не женат уже несколько лет.' },

  // a1-1-3 extra (9-15)
  { id: 'v-a1-1-3-9', lessonId: 'a1-1-3', word: 'dozen', translation: 'дюжина', example: 'I bought a dozen eggs.', exampleTranslation: 'Я купил дюжину яиц.' },
  { id: 'v-a1-1-3-10', lessonId: 'a1-1-3', word: 'million', translation: 'миллион', example: 'There are a million people here.', exampleTranslation: 'Здесь миллион человек.' },
  { id: 'v-a1-1-3-11', lessonId: 'a1-1-3', word: 'half', translation: 'половина', example: 'I ate half of the pizza.', exampleTranslation: 'Я съел половину пиццы.' },
  { id: 'v-a1-1-3-12', lessonId: 'a1-1-3', word: 'quarter', translation: 'четверть', example: 'It is quarter past three.', exampleTranslation: 'Сейчас четверть четвёртого.' },
  { id: 'v-a1-1-3-13', lessonId: 'a1-1-3', word: 'percent', translation: 'процент', example: 'Ten percent of students failed.', exampleTranslation: 'Десять процентов студентов не сдали.' },
  { id: 'v-a1-1-3-14', lessonId: 'a1-1-3', word: 'digit', translation: 'цифра', example: 'Enter a four-digit code.', exampleTranslation: 'Введите четырёхзначный код.' },
  { id: 'v-a1-1-3-15', lessonId: 'a1-1-3', word: 'double', translation: 'двойной', example: 'I\'d like a double room, please.', exampleTranslation: 'Пожалуйста, двухместный номер.' },

  // a1-1-4 extra (9-15)
  { id: 'v-a1-1-4-9', lessonId: 'a1-1-4', word: 'month', translation: 'месяц', example: 'January is the first month of the year.', exampleTranslation: 'Январь — первый месяц года.' },
  { id: 'v-a1-1-4-10', lessonId: 'a1-1-4', word: 'season', translation: 'сезон', example: 'Summer is my favourite season.', exampleTranslation: 'Лето — мой любимый сезон.' },
  { id: 'v-a1-1-4-11', lessonId: 'a1-1-4', word: 'spring', translation: 'весна', example: 'Flowers bloom in spring.', exampleTranslation: 'Весной цветут цветы.' },
  { id: 'v-a1-1-4-12', lessonId: 'a1-1-4', word: 'summer', translation: 'лето', example: 'We go to the beach in summer.', exampleTranslation: 'Летом мы ходим на пляж.' },
  { id: 'v-a1-1-4-13', lessonId: 'a1-1-4', word: 'autumn', translation: 'осень', example: 'The leaves fall in autumn.', exampleTranslation: 'Осенью листья падают.' },
  { id: 'v-a1-1-4-14', lessonId: 'a1-1-4', word: 'diary', translation: 'дневник', example: 'I write in my diary every day.', exampleTranslation: 'Я пишу в дневник каждый день.' },
  { id: 'v-a1-1-4-15', lessonId: 'a1-1-4', word: 'cancel', translation: 'отменить', example: 'We had to cancel the meeting.', exampleTranslation: 'Нам пришлось отменить встречу.' },

  // a1-1-5 extra (9-15)
  { id: 'v-a1-1-5-9', lessonId: 'a1-1-5', word: 'shade', translation: 'оттенок', example: 'I like this shade of blue.', exampleTranslation: 'Мне нравится этот оттенок синего.' },
  { id: 'v-a1-1-5-10', lessonId: 'a1-1-5', word: 'pale', translation: 'бледный', example: 'She looked pale and tired.', exampleTranslation: 'Она выглядела бледной и уставшей.' },
  { id: 'v-a1-1-5-11', lessonId: 'a1-1-5', word: 'vivid', translation: 'яркий', example: 'The painting has vivid colours.', exampleTranslation: 'На картине яркие цвета.' },
  { id: 'v-a1-1-5-12', lessonId: 'a1-1-5', word: 'pattern', translation: 'узор', example: 'Her dress has a flower pattern.', exampleTranslation: 'На её платье цветочный узор.' },
  { id: 'v-a1-1-5-13', lessonId: 'a1-1-5', word: 'turquoise', translation: 'бирюзовый', example: 'The sea is turquoise here.', exampleTranslation: 'Море здесь бирюзовое.' },
  { id: 'v-a1-1-5-14', lessonId: 'a1-1-5', word: 'silver', translation: 'серебряный', example: 'She has a silver necklace.', exampleTranslation: 'У неё серебряное ожерелье.' },
  { id: 'v-a1-1-5-15', lessonId: 'a1-1-5', word: 'golden', translation: 'золотой', example: 'The sunset was golden.', exampleTranslation: 'Закат был золотым.' },

  // a1-2-6 extra (9-15)
  { id: 'v-a1-2-6-9', lessonId: 'a1-2-6', word: 'possess', translation: 'владеть', example: 'He possesses great knowledge.', exampleTranslation: 'Он обладает большими знаниями.' },
  { id: 'v-a1-2-6-10', lessonId: 'a1-2-6', word: 'collect', translation: 'собирать', example: 'She collects old stamps.', exampleTranslation: 'Она собирает старые марки.' },
  { id: 'v-a1-2-6-11', lessonId: 'a1-2-6', word: 'lose', translation: 'терять', example: 'Don\'t lose your keys!', exampleTranslation: 'Не теряй ключи!' },
  { id: 'v-a1-2-6-12', lessonId: 'a1-2-6', word: 'find', translation: 'найти', example: 'Did you find your wallet?', exampleTranslation: 'Ты нашёл свой кошелёк?' },
  { id: 'v-a1-2-6-13', lessonId: 'a1-2-6', word: 'store', translation: 'хранить', example: 'I store my photos online.', exampleTranslation: 'Я храню фотографии в интернете.' },
  { id: 'v-a1-2-6-14', lessonId: 'a1-2-6', word: 'contain', translation: 'содержать', example: 'This box contains books.', exampleTranslation: 'В этой коробке книги.' },
  { id: 'v-a1-2-6-15', lessonId: 'a1-2-6', word: 'give', translation: 'давать', example: 'She gave me a gift.', exampleTranslation: 'Она подарила мне подарок.' },

  // a1-2-7 extra (9-15)
  { id: 'v-a1-2-7-9', lessonId: 'a1-2-7', word: 'nephew', translation: 'племянник', example: 'My nephew is five years old.', exampleTranslation: 'Моему племяннику пять лет.' },
  { id: 'v-a1-2-7-10', lessonId: 'a1-2-7', word: 'niece', translation: 'племянница', example: 'My niece loves dancing.', exampleTranslation: 'Моя племянница любит танцевать.' },
  { id: 'v-a1-2-7-11', lessonId: 'a1-2-7', word: 'stepmother', translation: 'мачеха', example: 'His stepmother is very kind.', exampleTranslation: 'Его мачеха очень добрая.' },
  { id: 'v-a1-2-7-12', lessonId: 'a1-2-7', word: 'stepfather', translation: 'отчим', example: 'Her stepfather cooks dinner.', exampleTranslation: 'Её отчим готовит ужин.' },
  { id: 'v-a1-2-7-13', lessonId: 'a1-2-7', word: 'adopt', translation: 'усыновить', example: 'They decided to adopt a child.', exampleTranslation: 'Они решили усыновить ребёнка.' },
  { id: 'v-a1-2-7-14', lessonId: 'a1-2-7', word: 'relative', translation: 'родственник', example: 'We visit relatives at Christmas.', exampleTranslation: 'На Рождество мы навещаем родственников.' },
  { id: 'v-a1-2-7-15', lessonId: 'a1-2-7', word: 'generation', translation: 'поколение', example: 'Three generations live together.', exampleTranslation: 'Три поколения живут вместе.' },

  // a1-2-8 extra (9-15)
  { id: 'v-a1-2-8-9', lessonId: 'a1-2-8', word: 'ceiling', translation: 'потолок', example: 'The ceiling is very high.', exampleTranslation: 'Потолок очень высокий.' },
  { id: 'v-a1-2-8-10', lessonId: 'a1-2-8', word: 'roof', translation: 'крыша', example: 'The roof needs repairing.', exampleTranslation: 'Крыша требует ремонта.' },
  { id: 'v-a1-2-8-11', lessonId: 'a1-2-8', word: 'garage', translation: 'гараж', example: 'The car is in the garage.', exampleTranslation: 'Машина в гараже.' },
  { id: 'v-a1-2-8-12', lessonId: 'a1-2-8', word: 'cellar', translation: 'подвал', example: 'We store wine in the cellar.', exampleTranslation: 'Мы храним вино в подвале.' },
  { id: 'v-a1-2-8-13', lessonId: 'a1-2-8', word: 'attic', translation: 'чердак', example: 'Old boxes are in the attic.', exampleTranslation: 'Старые коробки на чердаке.' },
  { id: 'v-a1-2-8-14', lessonId: 'a1-2-8', word: 'curtain', translation: 'занавеска', example: 'Please close the curtains.', exampleTranslation: 'Пожалуйста, закрой шторы.' },
  { id: 'v-a1-2-8-15', lessonId: 'a1-2-8', word: 'carpet', translation: 'ковёр', example: 'We have a red carpet in the hall.', exampleTranslation: 'В прихожей у нас красный ковёр.' },

  // a1-2-9 extra (9-15)
  { id: 'v-a1-2-9-9', lessonId: 'a1-2-9', word: 'above', translation: 'над', example: 'The lamp is above the table.', exampleTranslation: 'Лампа над столом.' },
  { id: 'v-a1-2-9-10', lessonId: 'a1-2-9', word: 'below', translation: 'под / ниже', example: 'The temperature is below zero.', exampleTranslation: 'Температура ниже нуля.' },
  { id: 'v-a1-2-9-11', lessonId: 'a1-2-9', word: 'around', translation: 'вокруг', example: 'There are trees around the house.', exampleTranslation: 'Вокруг дома деревья.' },
  { id: 'v-a1-2-9-12', lessonId: 'a1-2-9', word: 'through', translation: 'через', example: 'Walk through the park.', exampleTranslation: 'Пройди через парк.' },
  { id: 'v-a1-2-9-13', lessonId: 'a1-2-9', word: 'across', translation: 'напротив / через', example: 'The shop is across the street.', exampleTranslation: 'Магазин через улицу.' },
  { id: 'v-a1-2-9-14', lessonId: 'a1-2-9', word: 'along', translation: 'вдоль', example: 'Walk along the river.', exampleTranslation: 'Иди вдоль реки.' },
  { id: 'v-a1-2-9-15', lessonId: 'a1-2-9', word: 'towards', translation: 'к / по направлению к', example: 'She walked towards the door.', exampleTranslation: 'Она пошла к двери.' },

  // a1-2-10 extra (9-15)
  { id: 'v-a1-2-10-9', lessonId: 'a1-2-10', word: 'appear', translation: 'появляться', example: 'A new shop appeared on the street.', exampleTranslation: 'На улице появился новый магазин.' },
  { id: 'v-a1-2-10-10', lessonId: 'a1-2-10', word: 'remain', translation: 'оставаться', example: 'Some problems remain unsolved.', exampleTranslation: 'Некоторые проблемы остаются нерешёнными.' },
  { id: 'v-a1-2-10-11', lessonId: 'a1-2-10', word: 'provide', translation: 'обеспечивать', example: 'The school provides free meals.', exampleTranslation: 'Школа обеспечивает бесплатное питание.' },
  { id: 'v-a1-2-10-12', lessonId: 'a1-2-10', word: 'offer', translation: 'предлагать', example: 'They offer good prices.', exampleTranslation: 'Они предлагают хорошие цены.' },
  { id: 'v-a1-2-10-13', lessonId: 'a1-2-10', word: 'include', translation: 'включать', example: 'The price includes breakfast.', exampleTranslation: 'Цена включает завтрак.' },
  { id: 'v-a1-2-10-14', lessonId: 'a1-2-10', word: 'consist', translation: 'состоять', example: 'The team consists of ten people.', exampleTranslation: 'Команда состоит из десяти человек.' },
  { id: 'v-a1-2-10-15', lessonId: 'a1-2-10', word: 'require', translation: 'требовать', example: 'This job requires experience.', exampleTranslation: 'Эта работа требует опыта.' },

  // b1-vocab-learning
  { id: 'v-b1-vocab-learning-1', lessonId: 'b1-vocab-learning', word: 'routine', translation: 'Система привычек', example: 'It\'s a good idea to have a routine when you use a textbook.', exampleTranslation: 'Полезно иметь систему занятий, когда пользуешься учебником.' },
  { id: 'v-b1-vocab-learning-2', lessonId: 'b1-vocab-learning', word: 'revise', translation: 'Повторять', example: 'A daily routine when you revise that unit.', exampleTranslation: 'Ежедневная система занятий, когда повторяешь этот раздел.' },
  { id: 'v-b1-vocab-learning-3', lessonId: 'b1-vocab-learning', word: 'active', translation: 'Активный', example: 'You need to be active when learning.', exampleTranslation: 'Нужно быть активным во время учёбы.' },
  { id: 'v-b1-vocab-learning-4', lessonId: 'b1-vocab-learning', word: 'highlighter pen', translation: 'Маркер для выделения', example: 'Use the highlighter pen to mark words you think are important.', exampleTranslation: 'Используй маркер, чтобы отметить слова, которые кажутся тебе важными.' },
  { id: 'v-b1-vocab-learning-5', lessonId: 'b1-vocab-learning', word: 'translation', translation: 'Перевод', example: 'Next to each one I write a Spanish translation.', exampleTranslation: 'Рядом с каждым словом я пишу перевод на испанский.' },
  { id: 'v-b1-vocab-learning-6', lessonId: 'b1-vocab-learning', word: 'pronunciation', translation: 'Произношение', example: 'Check the pronunciation in the dictionary.', exampleTranslation: 'Проверь произношение в словаре.' },
  { id: 'v-b1-vocab-learning-7', lessonId: 'b1-vocab-learning', word: 'bilingual dictionary', translation: 'Двуязычный словарь', example: 'A bilingual dictionary is easy for you to understand.', exampleTranslation: 'Двуязычный словарь легко понять.' },
  { id: 'v-b1-vocab-learning-8', lessonId: 'b1-vocab-learning', word: 'definition', translation: 'Дефиниция', example: 'In the dictionary you will find a definition.', exampleTranslation: 'В словаре ты найдёшь определение.' },
  { id: 'v-b1-vocab-learning-9', lessonId: 'b1-vocab-learning', word: 'parts of speech', translation: 'Части речи', example: 'I write down the parts of speech for each word.', exampleTranslation: 'Я записываю части речи для каждого слова.' },
  { id: 'v-b1-vocab-learning-10', lessonId: 'b1-vocab-learning', word: 'noun', translation: 'Существительное', example: 'I write down if a word is a noun, verb, or adjective.', exampleTranslation: 'Я записываю, является ли слово существительным, глаголом или прилагательным.' },
  { id: 'v-b1-vocab-learning-11', lessonId: 'b1-vocab-learning', word: 'verb', translation: 'Глагол', example: 'Verbs are words like "sit" and "listen".', exampleTranslation: 'Глаголы — это слова, например "sit" (сидеть) и "listen" (слушать).' },
  { id: 'v-b1-vocab-learning-12', lessonId: 'b1-vocab-learning', word: 'phrasal verb', translation: 'Фразовый глагол', example: 'You will also need to learn the grammar of phrasal verbs.', exampleTranslation: 'Вам также нужно выучить грамматику фразовых глаголов.' },
  { id: 'v-b1-vocab-learning-13', lessonId: 'b1-vocab-learning', word: 'prefix', translation: 'Приставка', example: 'In the word "uncomfortable", "un" is a prefix.', exampleTranslation: 'В слове "uncomfortable" "un" — это приставка.' },
  { id: 'v-b1-vocab-learning-14', lessonId: 'b1-vocab-learning', word: 'suffix', translation: 'Суффикс', example: 'In the word "comfortable", "able" is a suffix.', exampleTranslation: 'В слове "comfortable" "able" — это суффикс.' },
  { id: 'v-b1-vocab-learning-15', lessonId: 'b1-vocab-learning', word: 'stress', translation: 'Ударение', example: 'The vertical mark shows where the stressed syllable begins.', exampleTranslation: 'Вертикальная черта показывает, где начинается ударный слог.' },
  { id: 'v-b1-vocab-learning-16', lessonId: 'b1-vocab-learning', word: 'syllable', translation: 'Слог', example: 'Count the syllables in each word.', exampleTranslation: 'Посчитай слоги в каждом слове.' },

  // b1-vocab-appearance
  { id: 'v-b1-vocab-appearance-1', lessonId: 'b1-vocab-appearance', word: 'attractive', translation: 'Привлекательный', example: 'Women can be attractive or good looking.', exampleTranslation: 'Женщины могут быть привлекательными или красивыми.' },
  { id: 'v-b1-vocab-appearance-2', lessonId: 'b1-vocab-appearance', word: 'good-looking', translation: 'Симпатичный', example: 'They are a very good-looking couple.', exampleTranslation: 'Они очень красивая пара.' },
  { id: 'v-b1-vocab-appearance-3', lessonId: 'b1-vocab-appearance', word: 'gorgeous', translation: 'Шикарный', example: 'Bella looks gorgeous in that dress.', exampleTranslation: 'Белла выглядит шикарно в этом платье.' },
  { id: 'v-b1-vocab-appearance-4', lessonId: 'b1-vocab-appearance', word: 'handsome', translation: 'Красивый (о мужчине)', example: 'Liam has become quite handsome.', exampleTranslation: 'Лиам стал довольно привлекательным.' },
  { id: 'v-b1-vocab-appearance-5', lessonId: 'b1-vocab-appearance', word: 'overweight', translation: 'Полный', example: 'Overweight is more polite than "fat".', exampleTranslation: 'Слово "overweight" звучит вежливее, чем "fat" (толстый).' },
  { id: 'v-b1-vocab-appearance-6', lessonId: 'b1-vocab-appearance', word: 'medium height', translation: 'Среднего роста', example: 'If someone is not tall or short, you can say medium height.', exampleTranslation: 'Если человек не высокий и не низкий, можно сказать «среднего роста».' },
  { id: 'v-b1-vocab-appearance-7', lessonId: 'b1-vocab-appearance', word: 'average', translation: 'Средний', example: 'You can say they are of average build.', exampleTranslation: 'Можно сказать, что у него среднее телосложение.' },
  { id: 'v-b1-vocab-appearance-8', lessonId: 'b1-vocab-appearance', word: 'look like', translation: 'Выглядеть', example: 'What does Sofia\'s boyfriend look like?', exampleTranslation: 'Как выглядит парень Софии?' },
  { id: 'v-b1-vocab-appearance-9', lessonId: 'b1-vocab-appearance', word: 'broad shoulders', translation: 'Широкие плечи', example: 'He\'s got broad shoulders and looks athletic.', exampleTranslation: 'У него широкие плечи, и он выглядит атлетично.' },
  { id: 'v-b1-vocab-appearance-10', lessonId: 'b1-vocab-appearance', word: 'athletic', translation: 'Атлетичный', example: 'He looks very athletic.', exampleTranslation: 'Он выглядит очень спортивным.' },
  { id: 'v-b1-vocab-appearance-11', lessonId: 'b1-vocab-appearance', word: 'smart', translation: 'Стильный', example: 'Is he quite smart? Yeah, he dresses quite well.', exampleTranslation: 'Он стильный? Да, он хорошо одевается.' },
  { id: 'v-b1-vocab-appearance-12', lessonId: 'b1-vocab-appearance', word: 'straight', translation: 'Прямые (волосы)', example: 'She\'s got straight hair.', exampleTranslation: 'У неё прямые волосы.' },
  { id: 'v-b1-vocab-appearance-13', lessonId: 'b1-vocab-appearance', word: 'wavy', translation: 'Волнистые (волосы)', example: 'Hair can be straight, wavy or curly.', exampleTranslation: 'Волосы могут быть прямыми, волнистыми или кудрявыми.' },
  { id: 'v-b1-vocab-appearance-14', lessonId: 'b1-vocab-appearance', word: 'curly', translation: 'Кудрявые (волосы)', example: 'She has curly red hair.', exampleTranslation: 'У неё рыжие вьющиеся волосы.' },
  { id: 'v-b1-vocab-appearance-15', lessonId: 'b1-vocab-appearance', word: 'blond', translation: 'Светлые', example: 'Someone\'s hair can be blond or fair.', exampleTranslation: 'Волосы человека могут быть светлыми или русыми.' },
  { id: 'v-b1-vocab-appearance-16', lessonId: 'b1-vocab-appearance', word: 'dark', translation: 'Тёмные (волосы)', example: 'He has dark brown hair and brown eyes.', exampleTranslation: 'У него тёмно-каштановые волосы и карие глаза.' },

  // b1-vocab-character
  { id: 'v-b1-vocab-character-1', lessonId: 'b1-vocab-character', word: 'confident', translation: 'Уверенный в себе', example: 'I\'m quite confident in social situations.', exampleTranslation: 'Я довольно уверен в себе в социальных ситуациях.' },
  { id: 'v-b1-vocab-character-2', lessonId: 'b1-vocab-character', word: 'shy', translation: 'Стеснительный', example: 'I\'m quite shy when I meet new people.', exampleTranslation: 'Я довольно застенчив, когда знакомлюсь с новыми людьми.' },
  { id: 'v-b1-vocab-character-3', lessonId: 'b1-vocab-character', word: 'hardworking', translation: 'Трудолюбивый', example: 'She is very hardworking and never gives up.', exampleTranslation: 'Она очень трудолюбивая и никогда не сдаётся.' },
  { id: 'v-b1-vocab-character-4', lessonId: 'b1-vocab-character', word: 'sense of humor', translation: 'Чувство юмора', example: 'He has a great sense of humor.', exampleTranslation: 'У него отличное чувство юмора.' },
  { id: 'v-b1-vocab-character-5', lessonId: 'b1-vocab-character', word: 'generous', translation: 'Щедрый', example: 'She is generous and always helps others.', exampleTranslation: 'Она щедрая и всегда помогает другим.' },
  { id: 'v-b1-vocab-character-6', lessonId: 'b1-vocab-character', word: 'mean', translation: 'Жадный', example: 'Why are you so mean today?', exampleTranslation: 'Почему ты сегодня такой злой?' },
  { id: 'v-b1-vocab-character-7', lessonId: 'b1-vocab-character', word: 'honest', translation: 'Честный', example: 'An honest person always tells the truth.', exampleTranslation: 'Честный человек всегда говорит правду.' },
  { id: 'v-b1-vocab-character-8', lessonId: 'b1-vocab-character', word: 'sensible', translation: 'Разумный', example: 'The first thing I would say is that she is very sensible.', exampleTranslation: 'Первое, что я бы сказал — она очень разумная.' },
  { id: 'v-b1-vocab-character-9', lessonId: 'b1-vocab-character', word: 'talented', translation: 'Талантливый', example: 'She is a very talented artist.', exampleTranslation: 'Она очень талантливый художник.' },
  { id: 'v-b1-vocab-character-10', lessonId: 'b1-vocab-character', word: 'reliable', translation: 'Надёжный', example: 'I\'m usually reliable — you can count on me.', exampleTranslation: 'Я обычно надёжный — можешь на меня рассчитывать.' },
  { id: 'v-b1-vocab-character-11', lessonId: 'b1-vocab-character', word: 'patient', translation: 'Терпеливый', example: 'You need to be patient when learning a language.', exampleTranslation: 'Нужно быть терпеливым при изучении языка.' },
  { id: 'v-b1-vocab-character-12', lessonId: 'b1-vocab-character', word: 'impatient', translation: 'Нетерпеливый', example: 'I can be quite impatient when things go slowly.', exampleTranslation: 'Я могу быть довольно нетерпеливым, когда что-то идёт медленно.' },

  // b1-vocab-feelings
  { id: 'v-b1-vocab-feelings-1', lessonId: 'b1-vocab-feelings', word: 'proud of', translation: 'Гордиться', example: 'I\'m very proud of my son\'s success.', exampleTranslation: 'Я очень горжусь успехами своего сына.' },
  { id: 'v-b1-vocab-feelings-2', lessonId: 'b1-vocab-feelings', word: 'disappointed', translation: 'Разочарованный', example: 'I\'m a bit disappointed with the results.', exampleTranslation: 'Я немного разочарован результатами.' },
  { id: 'v-b1-vocab-feelings-3', lessonId: 'b1-vocab-feelings', word: 'confused', translation: 'Растерянный', example: 'The politicians seem confused about what to do.', exampleTranslation: 'Политики, кажется, не знают, что делать.' },
  { id: 'v-b1-vocab-feelings-4', lessonId: 'b1-vocab-feelings', word: 'hopeful', translation: 'Оптимистичный', example: 'I\'m hopeful that things will improve soon.', exampleTranslation: 'Я надеюсь, что скоро всё улучшится.' },
  { id: 'v-b1-vocab-feelings-5', lessonId: 'b1-vocab-feelings', word: 'jealous', translation: 'Ревнивый', example: 'His girlfriend was getting jealous.', exampleTranslation: 'Его девушка начинала ревновать.' },
  { id: 'v-b1-vocab-feelings-6', lessonId: 'b1-vocab-feelings', word: 'upset', translation: 'Расстроенный', example: 'He is quite upset about the news.', exampleTranslation: 'Он очень расстроен этой новостью.' },
  { id: 'v-b1-vocab-feelings-7', lessonId: 'b1-vocab-feelings', word: 'curious', translation: 'Любопытный', example: 'We were curious to see what all the noise was about.', exampleTranslation: 'Нам было интересно узнать, что происходило.' },
  { id: 'v-b1-vocab-feelings-8', lessonId: 'b1-vocab-feelings', word: 'anxious', translation: 'Взволнованный', example: 'I felt anxious when I saw how angry the men were.', exampleTranslation: 'Я почувствовал тревогу, увидев, как злятся мужчины.' },
  { id: 'v-b1-vocab-feelings-9', lessonId: 'b1-vocab-feelings', word: 'scared', translation: 'Испуганный', example: 'We were really scared when they started coming towards us.', exampleTranslation: 'Мы очень испугались, когда они двинулись в нашу сторону.' },
  { id: 'v-b1-vocab-feelings-10', lessonId: 'b1-vocab-feelings', word: 'cheerful', translation: 'Жизнерадостный', example: 'Why do people feel more cheerful when the sun shines?', exampleTranslation: 'Почему люди чувствуют себя веселее, когда светит солнце?' },
  { id: 'v-b1-vocab-feelings-11', lessonId: 'b1-vocab-feelings', word: 'miserable', translation: 'Несчастный', example: 'People feel miserable when it\'s raining all day.', exampleTranslation: 'Люди чувствуют себя несчастными, когда весь день идёт дождь.' },
  { id: 'v-b1-vocab-feelings-12', lessonId: 'b1-vocab-feelings', word: 'depressed', translation: 'Подавленный', example: 'Which makes them feel depressed during long dark winters.', exampleTranslation: 'Что заставляет их чувствовать себя подавленными в долгие тёмные зимы.' },
  { id: 'v-b1-vocab-feelings-13', lessonId: 'b1-vocab-feelings', word: 'mood', translation: 'Настроение', example: 'Can the weather really affect our mood?', exampleTranslation: 'Может ли погода действительно влиять на наше настроение?' },
  { id: 'v-b1-vocab-feelings-14', lessonId: 'b1-vocab-feelings', word: 'furious', translation: 'В ярости', example: 'She was furious when she heard the news.', exampleTranslation: 'Она была в ярости, когда услышала новость.' },
  { id: 'v-b1-vocab-feelings-15', lessonId: 'b1-vocab-feelings', word: 'relieved', translation: 'Облегчённый', example: 'I felt so relieved when the exam was over.', exampleTranslation: 'Я почувствовал такое облегчение, когда экзамен закончился.' },

  // b1-vocab-family
  { id: 'v-b1-vocab-family-1', lessonId: 'b1-vocab-family', word: 'widow', translation: 'Вдова', example: 'My mother was a widow with four young children.', exampleTranslation: 'Моя мать была вдовой с четырьмя маленькими детьми.' },
  { id: 'v-b1-vocab-family-2', lessonId: 'b1-vocab-family', word: 'stepfather', translation: 'Отчим', example: 'So now I have a stepfather.', exampleTranslation: 'Так что теперь у меня есть отчим.' },
  { id: 'v-b1-vocab-family-3', lessonId: 'b1-vocab-family', word: 'elder', translation: 'Старший (брат/сестра)', example: 'I\'ve got an elder brother called Thomas.', exampleTranslation: 'У меня есть старший брат по имени Томас.' },
  { id: 'v-b1-vocab-family-4', lessonId: 'b1-vocab-family', word: 'twins', translation: 'Близнецы', example: 'Anya and Claudia are twins.', exampleTranslation: 'Аня и Клаудиа — близнецы.' },
  { id: 'v-b1-vocab-family-5', lessonId: 'b1-vocab-family', word: 'close family', translation: 'Близкие родственники', example: 'We\'re a very close family.', exampleTranslation: 'Мы очень дружная семья.' },
  { id: 'v-b1-vocab-family-6', lessonId: 'b1-vocab-family', word: 'cousins', translation: 'Двоюродные братья/сёстры', example: 'I have five cousins.', exampleTranslation: 'У меня пять двоюродных братьев и сестёр.' },
  { id: 'v-b1-vocab-family-7', lessonId: 'b1-vocab-family', word: 'relatives', translation: 'Родственники', example: 'All my relatives came to the wedding.', exampleTranslation: 'Все мои родственники пришли на свадьбу.' },
  { id: 'v-b1-vocab-family-8', lessonId: 'b1-vocab-family', word: 'sister-in-law', translation: 'Свояченица', example: 'So now I have a sister-in-law as well.', exampleTranslation: 'Так что теперь у меня есть и невестка.' },
  { id: 'v-b1-vocab-family-9', lessonId: 'b1-vocab-family', word: 'birth', translation: 'Рождение', example: 'This stage of life is called birth.', exampleTranslation: 'Этот этап жизни называется рождением.' },
  { id: 'v-b1-vocab-family-10', lessonId: 'b1-vocab-family', word: 'toddler', translation: 'Малыш (1–3 года)', example: 'From 12 months to 3 years old it is a toddler.', exampleTranslation: 'От 12 месяцев до 3 лет ребёнок называется малышом.' },
  { id: 'v-b1-vocab-family-11', lessonId: 'b1-vocab-family', word: 'childhood', translation: 'Детство', example: 'She had a very happy childhood.', exampleTranslation: 'У неё было очень счастливое детство.' },
  { id: 'v-b1-vocab-family-12', lessonId: 'b1-vocab-family', word: 'teenager', translation: 'Подросток', example: 'In this period you are a teenager.', exampleTranslation: 'В этот период ты являешься подростком.' },
  { id: 'v-b1-vocab-family-13', lessonId: 'b1-vocab-family', word: 'adult', translation: 'Взрослый', example: 'At 18 you become an adult.', exampleTranslation: 'В 18 лет ты становишься взрослым.' },
  { id: 'v-b1-vocab-family-14', lessonId: 'b1-vocab-family', word: 'middle-aged', translation: 'Среднего возраста', example: 'People are middle-aged in the middle of their lives.', exampleTranslation: 'Люди среднего возраста находятся в середине своей жизни.' },
  { id: 'v-b1-vocab-family-15', lessonId: 'b1-vocab-family', word: 'retired', translation: 'На пенсии', example: 'When people stop work they are retired.', exampleTranslation: 'Когда люди прекращают работать, они выходят на пенсию.' },
  { id: 'v-b1-vocab-family-16', lessonId: 'b1-vocab-family', word: 'grow up', translation: 'Расти', example: 'She grew up in the city.', exampleTranslation: 'Она выросла в городе.' },
  { id: 'v-b1-vocab-family-17', lessonId: 'b1-vocab-family', word: 'bring up', translation: 'Воспитывать', example: 'She was brought up on a farm in Wales.', exampleTranslation: 'Она воспитывалась на ферме в Уэльсе.' },
  { id: 'v-b1-vocab-family-18', lessonId: 'b1-vocab-family', word: 'date', translation: 'Свидание', example: 'I had my first date when I was 16.', exampleTranslation: 'У меня было первое свидание, когда мне было 16 лет.' },
  { id: 'v-b1-vocab-family-19', lessonId: 'b1-vocab-family', word: 'go out with', translation: 'Встречаться', example: 'I went out with a girl for three months.', exampleTranslation: 'Я встречался с девушкой три месяца.' },
  { id: 'v-b1-vocab-family-20', lessonId: 'b1-vocab-family', word: 'break up', translation: 'Расставаться', example: 'But we broke up when she met someone else.', exampleTranslation: 'Но мы расстались, когда она встретила другого.' },
  { id: 'v-b1-vocab-family-21', lessonId: 'b1-vocab-family', word: 'serious relationship', translation: 'Серьёзные отношения', example: 'My first serious relationship was at university.', exampleTranslation: 'Мои первые серьёзные отношения были в университете.' },
  { id: 'v-b1-vocab-family-22', lessonId: 'b1-vocab-family', word: 'be in love', translation: 'Быть влюблённым', example: 'We realized we were in love.', exampleTranslation: 'Мы поняли, что влюблены.' },
  { id: 'v-b1-vocab-family-23', lessonId: 'b1-vocab-family', word: 'engaged', translation: 'Помолвлен', example: 'We got engaged a couple of years after university.', exampleTranslation: 'Мы обручились через пару лет после университета.' },
  { id: 'v-b1-vocab-family-24', lessonId: 'b1-vocab-family', word: 'wedding', translation: 'Свадьба', example: 'We had the wedding in the local church.', exampleTranslation: 'Свадьба была в местной церкви.' },
  { id: 'v-b1-vocab-family-25', lessonId: 'b1-vocab-family', word: 'reception', translation: 'Свадебный приём', example: 'Afterwards we had the reception in a small hotel.', exampleTranslation: 'После этого был свадебный приём в небольшом отеле.' },
  { id: 'v-b1-vocab-family-26', lessonId: 'b1-vocab-family', word: 'anniversary', translation: 'Годовщина', example: 'Two days after our fourth wedding anniversary.', exampleTranslation: 'Два дня после нашей четвёртой годовщины свадьбы.' },
  { id: 'v-b1-vocab-family-27', lessonId: 'b1-vocab-family', word: 'honeymoon', translation: 'Медовый месяц', example: 'We went on our honeymoon to Greece.', exampleTranslation: 'Мы отправились в свадебное путешествие в Грецию.' },
  { id: 'v-b1-vocab-family-28', lessonId: 'b1-vocab-family', word: 'divorce', translation: 'Развод', example: 'Divorce — when a marriage officially ends.', exampleTranslation: 'Развод — это когда брак официально заканчивается.' },

  // b1-vocab-home
  { id: 'v-b1-vocab-home-1', lessonId: 'b1-vocab-home', word: 'outskirts', translation: 'Окраина', example: 'We live on the outskirts of town.', exampleTranslation: 'Мы живём на окраине города.' },
  { id: 'v-b1-vocab-home-2', lessonId: 'b1-vocab-home', word: 'location', translation: 'Расположение', example: 'It\'s a very nice location for a flat.', exampleTranslation: 'Это очень хорошее расположение для квартиры.' },
  { id: 'v-b1-vocab-home-3', lessonId: 'b1-vocab-home', word: 'move to', translation: 'Переехать', example: 'We moved to our present flat when we had children.', exampleTranslation: 'Мы переехали в нынешнюю квартиру, когда у нас появились дети.' },
  { id: 'v-b1-vocab-home-4', lessonId: 'b1-vocab-home', word: 'rent', translation: 'Арендовать', example: 'We rent a flat on the second floor.', exampleTranslation: 'Мы арендуем квартиру на втором этаже.' },
  { id: 'v-b1-vocab-home-5', lessonId: 'b1-vocab-home', word: 'ground floor', translation: 'Первый этаж', example: 'The ground floor is at the same level as the ground outside.', exampleTranslation: 'Первый этаж находится на одном уровне с землёй снаружи.' },
  { id: 'v-b1-vocab-home-6', lessonId: 'b1-vocab-home', word: 'top floor', translation: 'Верхний этаж', example: 'She lives on the top floor of the building.', exampleTranslation: 'Она живёт на верхнем этаже здания.' },
  { id: 'v-b1-vocab-home-7', lessonId: 'b1-vocab-home', word: 'block of flats', translation: 'Многоэтажка', example: 'It\'s a modern block of flats.', exampleTranslation: 'Это современная многоэтажка.' },
  { id: 'v-b1-vocab-home-8', lessonId: 'b1-vocab-home', word: 'lift', translation: 'Лифт', example: 'Although the lift is small, it works well.', exampleTranslation: 'Хотя лифт небольшой, он работает хорошо.' },
  { id: 'v-b1-vocab-home-9', lessonId: 'b1-vocab-home', word: 'air conditioning', translation: 'Кондиционер', example: 'There is no air conditioning in the flat.', exampleTranslation: 'В квартире нет кондиционера.' },
  { id: 'v-b1-vocab-home-10', lessonId: 'b1-vocab-home', word: 'cottage', translation: 'Коттедж', example: 'My parents own a cottage in the countryside.', exampleTranslation: 'У моих родителей есть коттедж за городом.' },
  { id: 'v-b1-vocab-home-11', lessonId: 'b1-vocab-home', word: 'backyard', translation: 'Задний двор', example: 'A charming house with a backyard.', exampleTranslation: 'Уютный дом с задним двором.' },
  { id: 'v-b1-vocab-home-12', lessonId: 'b1-vocab-home', word: 'garage', translation: 'Гараж', example: 'The house has a two-car garage.', exampleTranslation: 'В доме есть гараж на две машины.' },
  { id: 'v-b1-vocab-home-13', lessonId: 'b1-vocab-home', word: 'porch', translation: 'Крыльцо', example: 'There\'s a small front porch.', exampleTranslation: 'Есть небольшое крыльцо перед входом.' },
  { id: 'v-b1-vocab-home-14', lessonId: 'b1-vocab-home', word: 'central heating', translation: 'Центральное отопление', example: 'It doesn\'t have central heating, so it\'s cold in winter.', exampleTranslation: 'Здесь нет центрального отопления, поэтому зимой холодно.' },
  { id: 'v-b1-vocab-home-15', lessonId: 'b1-vocab-home', word: 'landlord', translation: 'Домовладелец', example: 'The landlord raised the rent last month.', exampleTranslation: 'Хозяин квартиры поднял арендную плату в прошлом месяце.' },

  // b1-vocab-weather
  { id: 'v-b1-vocab-weather-1', lessonId: 'b1-vocab-weather', word: 'sunny', translation: 'Солнечный', example: 'People feel more cheerful when it\'s sunny.', exampleTranslation: 'Люди чувствуют себя веселее, когда на улице солнечно.' },
  { id: 'v-b1-vocab-weather-2', lessonId: 'b1-vocab-weather', word: 'the sun came out', translation: 'Солнце вышло', example: 'The sun came out after lunch.', exampleTranslation: 'Солнце вышло после обеда.' },
  { id: 'v-b1-vocab-weather-3', lessonId: 'b1-vocab-weather', word: 'foggy', translation: 'Туманный', example: 'The accident happened in thick fog.', exampleTranslation: 'Авария произошла в густом тумане.' },
  { id: 'v-b1-vocab-weather-4', lessonId: 'b1-vocab-weather', word: 'cloudy', translation: 'Облачный', example: 'It was very cloudy this morning.', exampleTranslation: 'Сегодня утром было очень облачно.' },
  { id: 'v-b1-vocab-weather-5', lessonId: 'b1-vocab-weather', word: 'heavy rain', translation: 'Сильный дождь', example: 'We had some heavy rain at the weekend.', exampleTranslation: 'На выходных прошёл сильный дождь.' },
  { id: 'v-b1-vocab-weather-6', lessonId: 'b1-vocab-weather', word: 'strong wind', translation: 'Сильный ветер', example: 'There was a strong wind when we were in the boat.', exampleTranslation: 'Когда мы были в лодке, дул сильный ветер.' },
  { id: 'v-b1-vocab-weather-7', lessonId: 'b1-vocab-weather', word: 'pouring', translation: 'Льёт как из ведра', example: 'Look, it\'s really pouring now.', exampleTranslation: 'Смотри, сейчас льёт как из ведра.' },
  { id: 'v-b1-vocab-weather-8', lessonId: 'b1-vocab-weather', word: 'shower', translation: 'Ливень', example: 'We had a couple of heavy showers this morning.', exampleTranslation: 'Сегодня утром прошли несколько сильных ливней.' },
  { id: 'v-b1-vocab-weather-9', lessonId: 'b1-vocab-weather', word: 'thunderstorm', translation: 'Гроза', example: 'Hot weather sometimes ends with a thunderstorm.', exampleTranslation: 'Жаркая погода иногда заканчивается грозой.' },
  { id: 'v-b1-vocab-weather-10', lessonId: 'b1-vocab-weather', word: 'lightning', translation: 'Молния', example: 'You can see lightning during a thunderstorm.', exampleTranslation: 'Во время грозы можно увидеть молнию.' },
  { id: 'v-b1-vocab-weather-11', lessonId: 'b1-vocab-weather', word: 'boiling', translation: 'Очень жарко', example: 'It\'s boiling today — over 35 degrees!', exampleTranslation: 'Сегодня жарища — больше 35 градусов!' },
  { id: 'v-b1-vocab-weather-12', lessonId: 'b1-vocab-weather', word: 'freezing', translation: 'Морозно', example: 'Freezing — when it\'s extremely cold.', exampleTranslation: '«Freezing» — когда очень холодно.' },
  { id: 'v-b1-vocab-weather-13', lessonId: 'b1-vocab-weather', word: 'chilly', translation: 'Прохладно', example: 'It\'s a bit chilly this evening — take a jacket.', exampleTranslation: 'Сегодня вечером немного прохладно — возьми куртку.' },

  // b1-vocab-world
  { id: 'v-b1-vocab-world-1', lessonId: 'b1-vocab-world', word: 'surface', translation: 'Поверхность', example: 'Two thirds of the surface of the earth is covered in water.', exampleTranslation: 'Две трети поверхности Земли покрыты водой.' },
  { id: 'v-b1-vocab-world-2', lessonId: 'b1-vocab-world', word: 'Celsius', translation: 'Цельсий', example: 'Over 57 degrees Celsius — the hottest place on Earth.', exampleTranslation: 'Больше 57 градусов по Цельсию — самое жаркое место на Земле.' },
  { id: 'v-b1-vocab-world-3', lessonId: 'b1-vocab-world', word: 'cave', translation: 'Пещера', example: 'The Voronya Cave near the Black Sea is the deepest in the world.', exampleTranslation: 'Пещера Воронья у Чёрного моря — самая глубокая в мире.' },
  { id: 'v-b1-vocab-world-4', lessonId: 'b1-vocab-world', word: 'deep', translation: 'Глубокий', example: 'It is over 2000m deep.', exampleTranslation: 'Её глубина составляет более 2000 метров.' },
  { id: 'v-b1-vocab-world-5', lessonId: 'b1-vocab-world', word: 'canal', translation: 'Канал', example: 'The longest canal in the world is in China.', exampleTranslation: 'Самый длинный канал в мире находится в Китае.' },
  { id: 'v-b1-vocab-world-6', lessonId: 'b1-vocab-world', word: 'waterfall', translation: 'Водопад', example: 'The highest waterfall in the world is in Venezuela.', exampleTranslation: 'Самый высокий водопад в мире находится в Венесуэле.' },
  { id: 'v-b1-vocab-world-7', lessonId: 'b1-vocab-world', word: 'rainforest', translation: 'Тропический лес', example: 'The Amazon rainforest is the largest in the world.', exampleTranslation: 'Амазонский тропический лес — крупнейший в мире.' },
  { id: 'v-b1-vocab-world-8', lessonId: 'b1-vocab-world', word: 'ocean', translation: 'Океан', example: 'The Pacific is the largest ocean in the world.', exampleTranslation: 'Тихий океан — самый большой океан в мире.' },
  { id: 'v-b1-vocab-world-9', lessonId: 'b1-vocab-world', word: 'continent', translation: 'Континент', example: 'Antarctica is the coldest continent.', exampleTranslation: 'Антарктида — самый холодный континент.' },
  { id: 'v-b1-vocab-world-10', lessonId: 'b1-vocab-world', word: 'landscape', translation: 'Пейзаж', example: 'The region has completely different landscapes.', exampleTranslation: 'В регионе совершенно разные пейзажи.' },
  { id: 'v-b1-vocab-world-11', lessonId: 'b1-vocab-world', word: 'climate', translation: 'Климат', example: 'The climate can change within a very short distance.', exampleTranslation: 'Климат может меняться на очень небольшом расстоянии.' },
  { id: 'v-b1-vocab-world-12', lessonId: 'b1-vocab-world', word: 'desert', translation: 'Пустыня', example: 'The Sahara is the largest hot desert in the world.', exampleTranslation: 'Сахара — крупнейшая жаркая пустыня в мире.' },
  { id: 'v-b1-vocab-world-13', lessonId: 'b1-vocab-world', word: 'glacier', translation: 'Ледник', example: 'Glaciers are melting due to climate change.', exampleTranslation: 'Ледники тают из-за изменения климата.' },

  // b1-vocab-animals
  { id: 'v-b1-vocab-animals-1', lessonId: 'b1-vocab-animals', word: 'keep a pet', translation: 'Держать питомца', example: 'In the UK many people keep pets.', exampleTranslation: 'В Великобритании многие люди держат домашних животных.' },
  { id: 'v-b1-vocab-animals-2', lessonId: 'b1-vocab-animals', word: 'cage', translation: 'Клетка', example: 'Hamsters and mice are usually kept in a cage.', exampleTranslation: 'Хомяков и мышей обычно держат в клетке.' },
  { id: 'v-b1-vocab-animals-3', lessonId: 'b1-vocab-animals', word: 'wild animals', translation: 'Дикие животные', example: 'Tigers, lions and bears are wild animals.', exampleTranslation: 'Тигры, львы и медведи — дикие животные.' },
  { id: 'v-b1-vocab-animals-4', lessonId: 'b1-vocab-animals', word: 'insects', translation: 'Насекомые', example: 'Insects include bees, mosquitoes and butterflies.', exampleTranslation: 'К насекомым относятся пчёлы, комары и бабочки.' },
  { id: 'v-b1-vocab-animals-5', lessonId: 'b1-vocab-animals', word: 'sea creatures', translation: 'Морские существа', example: 'Whales, sharks and dolphins are sea creatures.', exampleTranslation: 'Киты, акулы и дельфины — морские существа.' },
  { id: 'v-b1-vocab-animals-6', lessonId: 'b1-vocab-animals', word: 'breed', translation: 'Порода', example: 'What breed of dog do you have?', exampleTranslation: 'Какая порода у вашей собаки?' },
  { id: 'v-b1-vocab-animals-7', lessonId: 'b1-vocab-animals', word: 'stray', translation: 'Бездомный (о животном)', example: 'There are many stray cats in the city.', exampleTranslation: 'В городе много бездомных кошек.' },
  { id: 'v-b1-vocab-animals-8', lessonId: 'b1-vocab-animals', word: 'endangered', translation: 'Под угрозой исчезновения', example: 'Many species are now endangered.', exampleTranslation: 'Многие виды сейчас находятся под угрозой исчезновения.' },
  { id: 'v-b1-vocab-animals-9', lessonId: 'b1-vocab-animals', word: 'wildlife', translation: 'Дикая природа', example: 'We should protect local wildlife.', exampleTranslation: 'Мы должны охранять местную дикую природу.' },

  // b1-vocab-body
  { id: 'v-b1-vocab-body-1', lessonId: 'b1-vocab-body', word: 'forehead', translation: 'Лоб', example: 'She touched her forehead — it felt warm.', exampleTranslation: 'Она прикоснулась ко лбу — он был тёплым.' },
  { id: 'v-b1-vocab-body-2', lessonId: 'b1-vocab-body', word: 'cheek', translation: 'Щека', example: 'She kissed him on the cheek.', exampleTranslation: 'Она поцеловала его в щёку.' },
  { id: 'v-b1-vocab-body-3', lessonId: 'b1-vocab-body', word: 'chin', translation: 'Подбородок', example: 'He rubbed his chin thoughtfully.', exampleTranslation: 'Он задумчиво потёр подбородок.' },
  { id: 'v-b1-vocab-body-4', lessonId: 'b1-vocab-body', word: 'neck', translation: 'Шея', example: 'She wore a scarf around her neck.', exampleTranslation: 'Она носила шарф на шее.' },
  { id: 'v-b1-vocab-body-5', lessonId: 'b1-vocab-body', word: 'shoulder', translation: 'Плечо', example: 'He put his arm around her shoulder.', exampleTranslation: 'Он положил руку ей на плечо.' },
  { id: 'v-b1-vocab-body-6', lessonId: 'b1-vocab-body', word: 'chest', translation: 'Грудная клетка', example: 'He felt a pain in his chest.', exampleTranslation: 'Он почувствовал боль в груди.' },
  { id: 'v-b1-vocab-body-7', lessonId: 'b1-vocab-body', word: 'waist', translation: 'Талия', example: 'She tied the belt around her waist.', exampleTranslation: 'Она завязала ремень вокруг талии.' },
  { id: 'v-b1-vocab-body-8', lessonId: 'b1-vocab-body', word: 'wrist', translation: 'Запястье', example: 'She wore a watch on her wrist.', exampleTranslation: 'Она носила часы на запястье.' },
  { id: 'v-b1-vocab-body-9', lessonId: 'b1-vocab-body', word: 'hip', translation: 'Бедро', example: 'She put her hands on her hips.', exampleTranslation: 'Она поставила руки на бёдра.' },
  { id: 'v-b1-vocab-body-10', lessonId: 'b1-vocab-body', word: 'thumb', translation: 'Большой палец', example: 'Put your thumbs up if you agree!', exampleTranslation: 'Поднимите большой палец вверх, если согласны!' },
  { id: 'v-b1-vocab-body-11', lessonId: 'b1-vocab-body', word: 'knee', translation: 'Колено', example: 'He fell and hurt his knee.', exampleTranslation: 'Он упал и ушиб колено.' },
  { id: 'v-b1-vocab-body-12', lessonId: 'b1-vocab-body', word: 'ankle', translation: 'Лодыжка', example: 'She twisted her ankle while running.', exampleTranslation: 'Она подвернула лодыжку во время бега.' },
  { id: 'v-b1-vocab-body-13', lessonId: 'b1-vocab-body', word: 'heel', translation: 'Пятка', example: 'My new shoes are hurting my heels.', exampleTranslation: 'Новые туфли натирают мне пятки.' },
  { id: 'v-b1-vocab-body-14', lessonId: 'b1-vocab-body', word: 'toe', translation: 'Палец ноги', example: 'She painted her toenails red.', exampleTranslation: 'Она покрасила ногти на ногах в красный цвет.' },
  { id: 'v-b1-vocab-body-15', lessonId: 'b1-vocab-body', word: 'breathe', translation: 'Дышать', example: 'Breathe in slowly and then breathe out.', exampleTranslation: 'Медленно вдохни, а потом выдохни.' },
  { id: 'v-b1-vocab-body-16', lessonId: 'b1-vocab-body', word: 'smile at', translation: 'Улыбнуться (кому-то)', example: 'She smiled at him when he walked in.', exampleTranslation: 'Она улыбнулась ему, когда он вошёл.' },
  { id: 'v-b1-vocab-body-17', lessonId: 'b1-vocab-body', word: 'laugh at', translation: 'Смеяться (над чем-то)', example: 'Everyone laughed at his joke.', exampleTranslation: 'Все засмеялись его шутке.' },
  { id: 'v-b1-vocab-body-18', lessonId: 'b1-vocab-body', word: 'cry', translation: 'Плакать', example: 'The baby started to cry in the night.', exampleTranslation: 'Ночью ребёнок начал плакать.' },
  { id: 'v-b1-vocab-body-19', lessonId: 'b1-vocab-body', word: 'nod', translation: 'Кивать', example: 'She nodded her head to say yes.', exampleTranslation: 'Она кивнула головой в знак согласия.' },
  { id: 'v-b1-vocab-body-20', lessonId: 'b1-vocab-body', word: 'shake head', translation: 'Качать головой', example: 'He shook his head — he didn\'t agree.', exampleTranslation: 'Он покачал головой — он не согласился.' },
  { id: 'v-b1-vocab-body-21', lessonId: 'b1-vocab-body', word: 'yawn', translation: 'Зевать', example: 'I couldn\'t stop yawning during the meeting.', exampleTranslation: 'Я не мог перестать зевать на совещании.' },
  { id: 'v-b1-vocab-body-22', lessonId: 'b1-vocab-body', word: 'shake hands', translation: 'Пожимать руку', example: 'They shook hands after signing the contract.', exampleTranslation: 'Они пожали друг другу руки после подписания контракта.' },
  { id: 'v-b1-vocab-body-23', lessonId: 'b1-vocab-body', word: 'fold arms', translation: 'Скрестить руки', example: 'He folded his arms and looked away.', exampleTranslation: 'Он скрестил руки и отвернулся.' },
  { id: 'v-b1-vocab-body-24', lessonId: 'b1-vocab-body', word: 'wave to', translation: 'Махать рукой', example: 'She waved to us from across the street.', exampleTranslation: 'Она помахала нам рукой с другой стороны улицы.' },
  { id: 'v-b1-vocab-body-25', lessonId: 'b1-vocab-body', word: 'blow nose', translation: 'Сморкаться', example: 'He sneezed and blew his nose.', exampleTranslation: 'Он чихнул и высморкался.' },
  { id: 'v-b1-vocab-body-26', lessonId: 'b1-vocab-body', word: 'skin', translation: 'Кожа', example: 'The outer part of the body is covered in skin.', exampleTranslation: 'Внешняя часть тела покрыта кожей.' },
]

export function getVocabByLesson(lessonId: string): VocabWord[] {
  return VOCABULARY.filter(w => w.lessonId === lessonId)
}

export function getVocabById(id: string): VocabWord | undefined {
  return VOCABULARY.find(w => w.id === id)
}

export function getWordsForLesson(lessonId: string, count: number = 8): VocabWord[] {
  const all = VOCABULARY.filter(w => w.lessonId === lessonId)
  return [...all].sort(() => Math.random() - 0.5).slice(0, count)
}

export function getAllWordsForLesson(lessonId: string): VocabWord[] {
  return VOCABULARY.filter(w => w.lessonId === lessonId)
}
