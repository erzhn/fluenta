export interface Idiom {
  id: string
  idiom: string
  meaning: string
  example: string
  category: string
  level: string
}

export const IDIOMS: Idiom[] = [
  { id: '1', idiom: 'Break the ice', meaning: 'Начать разговор, снять напряжение', example: 'He told a joke to break the ice at the meeting.', category: 'Общение', level: 'B1' },
  { id: '2', idiom: 'Hit the nail on the head', meaning: 'Попасть в точку', example: 'You hit the nail on the head with that analysis.', category: 'Общение', level: 'B1' },
  { id: '3', idiom: 'Bite the bullet', meaning: 'Стиснуть зубы и сделать что-то неприятное', example: 'I bit the bullet and went to the dentist.', category: 'Решения', level: 'B1' },
  { id: '4', idiom: 'Under the weather', meaning: 'Чувствовать себя плохо', example: "I'm feeling a bit under the weather today.", category: 'Здоровье', level: 'A2' },
  { id: '5', idiom: 'Once in a blue moon', meaning: 'Очень редко', example: 'We only visit them once in a blue moon.', category: 'Время', level: 'A2' },
  { id: '6', idiom: 'Spill the beans', meaning: 'Разболтать секрет', example: "Don't spill the beans about the surprise party.", category: 'Общение', level: 'B1' },
  { id: '7', idiom: 'Hit the sack', meaning: 'Идти спать', example: "I'm exhausted — time to hit the sack.", category: 'Быт', level: 'A2' },
  { id: '8', idiom: 'Cost an arm and a leg', meaning: 'Стоить очень дорого', example: 'That new phone costs an arm and a leg.', category: 'Деньги', level: 'A2' },
  { id: '9', idiom: 'Beat around the bush', meaning: 'Ходить вокруг да около', example: 'Stop beating around the bush and tell me the truth.', category: 'Общение', level: 'B1' },
  { id: '10', idiom: 'A blessing in disguise', meaning: 'Что-то плохое, оказавшееся хорошим', example: 'Losing that job was a blessing in disguise.', category: 'Жизнь', level: 'B2' },
  { id: '11', idiom: 'Get out of hand', meaning: 'Выйти из-под контроля', example: 'The situation got out of hand quickly.', category: 'Ситуации', level: 'B1' },
  { id: '12', idiom: 'On the fence', meaning: 'Не определиться с решением', example: "I'm still on the fence about which job to take.", category: 'Решения', level: 'B1' },
  { id: '13', idiom: "Let the cat out of the bag", meaning: 'Случайно раскрыть секрет', example: 'She let the cat out of the bag about the wedding.', category: 'Общение', level: 'B1' },
  { id: '14', idiom: 'Bite off more than you can chew', meaning: 'Взять на себя слишком много', example: 'He bit off more than he could chew with three projects.', category: 'Работа', level: 'B2' },
  { id: '15', idiom: 'Kill two birds with one stone', meaning: 'Убить двух зайцев одним выстрелом', example: 'Taking the scenic route kills two birds with one stone.', category: 'Эффективность', level: 'B1' },
  { id: '16', idiom: 'The ball is in your court', meaning: 'Теперь решение за тобой', example: "I've made my offer — the ball is in your court now.", category: 'Решения', level: 'B2' },
  { id: '17', idiom: 'Burn bridges', meaning: 'Сжечь мосты', example: "Don't burn bridges when leaving a job.", category: 'Отношения', level: 'B2' },
  { id: '18', idiom: 'Cutting corners', meaning: 'Делать кое-как, срезать углы', example: 'They cut corners and now the building has problems.', category: 'Работа', level: 'B1' },
  { id: '19', idiom: 'Hit the ground running', meaning: 'Начать энергично, с места в карьер', example: 'She hit the ground running in her new role.', category: 'Работа', level: 'B2' },
  { id: '20', idiom: 'Jump on the bandwagon', meaning: 'Присоединиться к модному течению', example: 'Everyone jumped on the social media bandwagon.', category: 'Тренды', level: 'B2' },
  { id: '21', idiom: 'Miss the boat', meaning: 'Упустить возможность', example: 'He missed the boat on that investment opportunity.', category: 'Возможности', level: 'B1' },
  { id: '22', idiom: 'Sit on the fence', meaning: 'Занимать нейтральную позицию', example: 'Politicians often sit on the fence to avoid controversy.', category: 'Политика', level: 'B2' },
  { id: '23', idiom: "Steal someone's thunder", meaning: 'Перехватить чей-то успех', example: 'She stole his thunder by announcing it first.', category: 'Отношения', level: 'C1' },
  { id: '24', idiom: 'Turn a blind eye', meaning: 'Закрывать глаза на что-то', example: 'The manager turned a blind eye to their lateness.', category: 'Работа', level: 'B2' },
  { id: '25', idiom: 'Under the radar', meaning: 'Незамеченный, тайный', example: 'The startup stayed under the radar for two years.', category: 'Бизнес', level: 'B2' },
  { id: '26', idiom: 'Wrap your head around', meaning: 'Понять что-то сложное', example: "I can't wrap my head around quantum physics.", category: 'Обучение', level: 'B1' },
  { id: '27', idiom: 'Go the extra mile', meaning: 'Сделать больше чем нужно', example: 'She always goes the extra mile for her clients.', category: 'Работа', level: 'B1' },
  { id: '28', idiom: 'In hot water', meaning: 'В горячей воде / в беде', example: 'He got in hot water for missing the deadline.', category: 'Проблемы', level: 'B1' },
  { id: '29', idiom: 'Read between the lines', meaning: 'Читать между строк', example: "Reading between the lines, she wasn't happy.", category: 'Общение', level: 'B2' },
  { id: '30', idiom: "Pull someone's leg", meaning: 'Разыгрывать кого-то', example: 'Are you serious or just pulling my leg?', category: 'Юмор', level: 'A2' },
]

export const IDIOM_CATEGORIES = [...new Set(IDIOMS.map(i => i.category))]
