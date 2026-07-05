export interface VocabWord {
  id: string
  lessonId: string
  word: string
  translation: string
  example: string
  exampleTranslation: string
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
]

export function getVocabByLesson(lessonId: string): VocabWord[] {
  return VOCABULARY.filter(w => w.lessonId === lessonId)
}

export function getVocabById(id: string): VocabWord | undefined {
  return VOCABULARY.find(w => w.id === id)
}
