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
