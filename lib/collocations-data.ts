export interface Collocation {
  id: string
  collocation: string
  verb?: string
  noun?: string
  adjective?: string
  translation: string
  example: string
  wrongExample?: string
  category: string
  level: string
}

export const COLLOCATIONS: Collocation[] = [
  // MAKE
  { id: 'c1', collocation: 'make a decision', verb: 'make', translation: 'принять решение', example: 'She had to make a difficult decision.', wrongExample: 'Неверно: do a decision', category: 'MAKE', level: 'A2' },
  { id: 'c2', collocation: 'make a mistake', verb: 'make', translation: 'совершить ошибку', example: 'Everyone makes mistakes sometimes.', wrongExample: 'Неверно: do a mistake', category: 'MAKE', level: 'A1' },
  { id: 'c3', collocation: 'make progress', verb: 'make', translation: 'делать прогресс', example: 'You are making great progress with English!', category: 'MAKE', level: 'A2' },
  { id: 'c4', collocation: 'make an effort', verb: 'make', translation: 'прилагать усилия', example: 'Please make an effort to be on time.', category: 'MAKE', level: 'B1' },
  { id: 'c5', collocation: 'make an appointment', verb: 'make', translation: 'записаться на приём', example: 'I need to make an appointment with the doctor.', category: 'MAKE', level: 'A2' },
  { id: 'c6', collocation: 'make a difference', verb: 'make', translation: 'иметь значение', example: 'Every small action can make a difference.', category: 'MAKE', level: 'B1' },
  { id: 'c7', collocation: 'make friends', verb: 'make', translation: 'заводить друзей', example: "It's easy to make friends at university.", wrongExample: 'Неверно: do friends', category: 'MAKE', level: 'A1' },
  { id: 'c8', collocation: 'make money', verb: 'make', translation: 'зарабатывать деньги', example: 'He makes money by selling online.', wrongExample: 'Неверно: earn/win money (different meaning)', category: 'MAKE', level: 'A2' },
  // DO
  { id: 'c9', collocation: 'do homework', verb: 'do', translation: 'делать домашнее задание', example: 'Did you do your homework?', wrongExample: 'Неверно: make homework', category: 'DO', level: 'A1' },
  { id: 'c10', collocation: 'do exercise', verb: 'do', translation: 'заниматься спортом', example: 'She does exercise every morning.', wrongExample: 'Неверно: make exercise', category: 'DO', level: 'A1' },
  { id: 'c11', collocation: 'do research', verb: 'do', translation: 'проводить исследование', example: 'We need to do more research on this topic.', wrongExample: 'Неверно: make research', category: 'DO', level: 'B1' },
  { id: 'c12', collocation: 'do someone a favour', verb: 'do', translation: 'оказать кому-то услугу', example: 'Could you do me a favour and pick up the kids?', category: 'DO', level: 'A2' },
  { id: 'c13', collocation: 'do the dishes', verb: 'do', translation: 'мыть посуду', example: "It's your turn to do the dishes.", category: 'DO', level: 'A1' },
  { id: 'c14', collocation: 'do business', verb: 'do', translation: 'вести бизнес', example: 'We do business with companies in 20 countries.', category: 'DO', level: 'B1' },
  // TAKE
  { id: 'c15', collocation: 'take a photo', verb: 'take', translation: 'сделать фото', example: 'Can you take a photo of us?', wrongExample: 'Неверно: make/do a photo', category: 'TAKE', level: 'A1' },
  { id: 'c16', collocation: 'take a break', verb: 'take', translation: 'сделать перерыв', example: "Let's take a break — we've been working for hours.", category: 'TAKE', level: 'A2' },
  { id: 'c17', collocation: 'take a shower', verb: 'take', translation: 'принять душ', example: 'I always take a shower in the morning.', wrongExample: 'Неверно: make/do a shower', category: 'TAKE', level: 'A1' },
  { id: 'c18', collocation: 'take responsibility', verb: 'take', translation: 'взять ответственность', example: 'You need to take responsibility for your actions.', category: 'TAKE', level: 'B1' },
  { id: 'c19', collocation: 'take an exam', verb: 'take', translation: 'сдавать экзамен', example: 'She took the IELTS exam last week.', wrongExample: 'Неверно: make/do an exam (do exam = OK in British)', category: 'TAKE', level: 'A2' },
  { id: 'c20', collocation: 'take notes', verb: 'take', translation: 'делать заметки', example: 'Always take notes during lectures.', wrongExample: 'Неверно: make notes (also correct but less common)', category: 'TAKE', level: 'A2' },
  // HAVE
  { id: 'c21', collocation: 'have a meeting', verb: 'have', translation: 'проводить встречу', example: 'We have a meeting at 3 pm.', wrongExample: 'Неверно: make/do a meeting', category: 'HAVE', level: 'A2' },
  { id: 'c22', collocation: 'have a conversation', verb: 'have', translation: 'вести разговор', example: 'We had a long conversation about the future.', category: 'HAVE', level: 'A2' },
  { id: 'c23', collocation: 'have an argument', verb: 'have', translation: 'поспорить, поссориться', example: 'They had an argument about money.', category: 'HAVE', level: 'B1' },
  { id: 'c24', collocation: 'have fun', verb: 'have', translation: 'веселиться', example: 'Did you have fun at the party?', wrongExample: 'Неверно: make fun (different meaning!)', category: 'HAVE', level: 'A1' },
  { id: 'c25', collocation: 'have a look', verb: 'have', translation: 'взглянуть', example: 'Can you have a look at this email?', category: 'HAVE', level: 'A2' },
  // ADJECTIVE + NOUN
  { id: 'c26', collocation: 'heavy rain', adjective: 'heavy', translation: 'сильный дождь', example: 'We got caught in heavy rain.', wrongExample: 'Неверно: strong rain / hard rain', category: 'Прилагательные', level: 'A2' },
  { id: 'c27', collocation: 'heavy traffic', adjective: 'heavy', translation: 'сильные пробки', example: 'There was heavy traffic on the motorway.', category: 'Прилагательные', level: 'A2' },
  { id: 'c28', collocation: 'strong coffee', adjective: 'strong', translation: 'крепкий кофе', example: 'I need a strong coffee to wake up.', wrongExample: 'Неверно: heavy coffee', category: 'Прилагательные', level: 'A1' },
  { id: 'c29', collocation: 'strong opinion', adjective: 'strong', translation: 'твёрдое мнение', example: 'She has strong opinions about politics.', category: 'Прилагательные', level: 'B1' },
  { id: 'c30', collocation: 'fast food', adjective: 'fast', translation: 'быстрое питание', example: 'He eats too much fast food.', wrongExample: 'Неверно: quick food', category: 'Прилагательные', level: 'A1' },
  { id: 'c31', collocation: 'deep sleep', adjective: 'deep', translation: 'глубокий сон', example: 'She fell into a deep sleep immediately.', wrongExample: 'Неверно: heavy sleep', category: 'Прилагательные', level: 'B1' },
  { id: 'c32', collocation: 'sharp pain', adjective: 'sharp', translation: 'острая боль', example: 'I felt a sharp pain in my chest.', wrongExample: 'Неверно: strong pain', category: 'Прилагательные', level: 'B1' },
  { id: 'c33', collocation: 'wide range', adjective: 'wide', translation: 'широкий ассортимент/диапазон', example: 'We offer a wide range of products.', wrongExample: 'Неверно: big range', category: 'Прилагательные', level: 'B1' },
  { id: 'c34', collocation: 'high demand', adjective: 'high', translation: 'высокий спрос', example: 'There is high demand for English teachers.', wrongExample: 'Неверно: big demand', category: 'Прилагательные', level: 'B2' },
  { id: 'c35', collocation: 'low income', adjective: 'low', translation: 'низкий доход', example: 'Many families live on a low income.', wrongExample: 'Неверно: small income', category: 'Прилагательные', level: 'B1' },
  // GO
  { id: 'c36', collocation: 'go on holiday', verb: 'go', translation: 'поехать в отпуск', example: 'We go on holiday every summer.', wrongExample: 'Неверно: make holiday', category: 'GO', level: 'A1' },
  { id: 'c37', collocation: 'go for a walk', verb: 'go', translation: 'пойти на прогулку', example: "Let's go for a walk in the park.", category: 'GO', level: 'A1' },
  { id: 'c38', collocation: 'go wrong', verb: 'go', translation: 'пойти не так', example: 'Something went wrong with the plan.', category: 'GO', level: 'A2' },
  { id: 'c39', collocation: 'go bankrupt', verb: 'go', translation: 'обанкротиться', example: 'The company went bankrupt last year.', category: 'GO', level: 'B2' },
  { id: 'c40', collocation: 'go viral', verb: 'go', translation: 'стать вирусным', example: 'Her video went viral overnight.', category: 'GO', level: 'B1' },
]

export const COLLOCATION_CATEGORIES = [...new Set(COLLOCATIONS.map(c => c.category))]
