export interface PhrasalVerb {
  id: string
  verb: string
  translation: string
  examples: string[]
  category: string
}

export interface PhrasalVerbCategory {
  id: string
  title: string
  description: string
  verbs: PhrasalVerb[]
}

export const PHRASAL_VERBS_DATA: PhrasalVerbCategory[] = [
  {
    id: 'daily',
    title: 'Быт и повседневные дела',
    description: 'Домашняя рутина, уход за одеждой и повседневные задачи',
    verbs: [
      { id: 'turn-on', verb: 'Turn on', translation: 'включать', examples: ['Tom turned on the lights.', 'Can you turn on the TV?'], category: 'daily' },
      { id: 'turn-off', verb: 'Turn off', translation: 'выключать', examples: ['Please turn off the TV.', 'Turn off the lights when you leave.'], category: 'daily' },
      { id: 'put-on', verb: 'Put on', translation: 'надевать', examples: ["Put on your jacket, it's cold.", 'She put on her coat and left.'], category: 'daily' },
      { id: 'take-off-clothes', verb: 'Take off (clothes)', translation: 'снимать одежду', examples: ['Take off your shoes please.', 'I took off my jacket.'], category: 'daily' },
      { id: 'clean-up', verb: 'Clean up', translation: 'убираться, приводить в порядок', examples: ['Did you clean up your room?', 'We need to clean up the kitchen.'], category: 'daily' },
      { id: 'throw-away', verb: 'Throw away', translation: 'выбрасывать', examples: ["Don't throw away your old clothes.", 'I threw away the broken lamp.'], category: 'daily' },
      { id: 'put-away', verb: 'Put away', translation: 'убирать на место', examples: ['Put away your toys.', 'She put away the dishes after dinner.'], category: 'daily' },
      { id: 'wash-up', verb: 'Wash up', translation: 'мыть посуду', examples: ["I'll wash up after dinner.", 'Can you wash up while I cook?'], category: 'daily' },
      { id: 'warm-up', verb: 'Warm up', translation: 'разогревать еду', examples: ["I'll warm up the soup.", 'Warm up the leftovers in the microwave.'], category: 'daily' },
      { id: 'mop-up', verb: 'Mop up', translation: 'вытирать разлитое', examples: ['I need to mop up the spill in the kitchen.', 'He mopped up the water on the floor.'], category: 'daily' },
      { id: 'zip-up', verb: 'Zip up', translation: 'застегивать молнию', examples: ['Zip up your jacket.', 'She zipped up her bag.'], category: 'daily' },
      { id: 'use-up', verb: 'Use up', translation: 'израсходовать полностью', examples: ['We used up all the paper.', "I've used up all my savings."], category: 'daily' },
      { id: 'dry-up', verb: 'Dry up', translation: 'засыхать, высыхать', examples: ['The paint dried up quickly.', 'The river dried up in summer.'], category: 'daily' },
      { id: 'blow-out', verb: 'Blow out', translation: 'задувать свечи', examples: ['Lisa blew out the candles on the cake.', 'Blow out the candles and make a wish.'], category: 'daily' },
      { id: 'pick-up', verb: 'Pick up', translation: 'забирать, поднимать', examples: ['Can you pick up the kids from school?', "I'll pick up some groceries after work.", 'I picked up the keys from the floor.'], category: 'daily' },
      { id: 'load-up', verb: 'Load up', translation: 'загружать', examples: ['We loaded up the car with groceries.', 'Load up the dishwasher, please.'], category: 'daily' },
    ],
  },
  {
    id: 'social',
    title: 'Общение и отношения',
    description: 'Социальное взаимодействие, воспитание и контакты между людьми',
    verbs: [
      { id: 'get-along', verb: 'Get along / Get on', translation: 'ладить, хорошо общаться', examples: ['We get along really well.', 'I get on really well with my co-workers.', "They don't get on at all."], category: 'social' },
      { id: 'look-after', verb: 'Look after', translation: 'присматривать, заботиться', examples: ['Jane looks after the children.', "I'll look after your cat while you are away."], category: 'social' },
      { id: 'bring-up', verb: 'Bring up', translation: 'воспитывать детей / упоминать тему', examples: ['They bring up three kids.', "Don't bring up politics during dinner.", 'You brought up a good point.'], category: 'social' },
      { id: 'hang-out', verb: 'Hang out', translation: 'проводить время, тусоваться', examples: ['We hang out in the park.', "Let's hang out this weekend."], category: 'social' },
      { id: 'come-over', verb: 'Come over', translation: 'заходить в гости', examples: ['Emma came over for dinner.', 'Come over whenever you want.'], category: 'social' },
      { id: 'drop-by', verb: 'Drop by', translation: 'заглянуть ненадолго', examples: ['Feel free to drop by anytime.', 'I dropped by her office yesterday.'], category: 'social' },
      { id: 'run-into', verb: 'Run into', translation: 'случайно встретить', examples: ['I ran into Mike today.', 'I ran into an old friend at the store.'], category: 'social' },
      { id: 'see-off', verb: 'See off', translation: 'провожать уезжающих', examples: ["I'll see you off at the airport.", 'The whole family came to see him off.'], category: 'social' },
      { id: 'get-together', verb: 'Get together', translation: 'собираться вместе', examples: ["Let's get together tomorrow.", 'The team gets together every Friday.'], category: 'social' },
      { id: 'make-up-reconcile', verb: 'Make up', translation: 'мириться', examples: ["Let's forget the past and make up.", 'They made up after the argument.'], category: 'social' },
      { id: 'let-down', verb: 'Let down', translation: 'подводить', examples: ["Don't let me down Jake.", 'I felt let down when he cancelled.'], category: 'social' },
      { id: 'look-up-to', verb: 'Look up to', translation: 'восхищаться, брать пример', examples: ['I look up to my older sister.', 'Children look up to their parents.'], category: 'social' },
      { id: 'take-after', verb: 'Take after', translation: 'быть похожим на родственника', examples: ['She takes after her mother.', 'He takes after his grandfather.'], category: 'social' },
      { id: 'show-off', verb: 'Show off', translation: 'хвастаться', examples: ['Jack showed off his new bike.', 'Stop showing off!'], category: 'social' },
      { id: 'point-out', verb: 'Point out', translation: 'указывать, замечать', examples: ['She pointed out my mistakes.', 'I want to point out a few issues.'], category: 'social' },
      { id: 'call-back', verb: 'Call back', translation: 'перезванивать', examples: ["I'll call you back.", 'He never called back.'], category: 'social' },
      { id: 'speak-up', verb: 'Speak up', translation: 'говорить громче', examples: ["Please speak up, I can't hear you.", "Don't be afraid to speak up."], category: 'social' },
    ],
  },
  {
    id: 'work',
    title: 'Работа и учёба',
    description: 'Профессиональная деятельность, анализ информации и обучение',
    verbs: [
      { id: 'find-out', verb: 'Find out', translation: 'выяснять, узнавать', examples: ['I need to find out the truth.', "Let's find out what happened."], category: 'work' },
      { id: 'figure-out', verb: 'Figure out', translation: 'сообразить, разобраться', examples: ["I can't figure out how to do this.", 'She figured out the answer quickly.'], category: 'work' },
      { id: 'work-out-solve', verb: 'Work out (solve)', translation: 'решать проблему', examples: ['We can work out this issue.', "I'm sure we'll work it out."], category: 'work' },
      { id: 'set-up', verb: 'Set up', translation: 'основывать бизнес / настраивать технику', examples: ['I want to set up my own business.', 'He set up the Wi-Fi in the new apartment.'], category: 'work' },
      { id: 'call-off', verb: 'Call off', translation: 'отменять', examples: ['Lisa called off the party.', 'They called off the meeting.'], category: 'work' },
      { id: 'put-off', verb: 'Put off', translation: 'откладывать', examples: ['Stop putting things off.', 'We put off the meeting until next week.'], category: 'work' },
      { id: 'fill-out', verb: 'Fill out', translation: 'заполнять форму/анкету', examples: ['Please fill out this application form.', 'Did you fill out the application?'], category: 'work' },
      { id: 'take-up', verb: 'Take up', translation: 'занимать должность / начинать хобби', examples: ["He'll take up his new position soon.", 'She took up yoga to improve her health.', 'I took up running to stay fit.'], category: 'work' },
      { id: 'turn-down', verb: 'Turn down', translation: 'отклонять, отказываться', examples: ['She turned down the job.', 'He turned down the invitation to the party.'], category: 'work' },
      { id: 'drop-out', verb: 'Drop out', translation: 'бросать учёбу', examples: ['George dropped out of college.', 'She dropped out of the course.'], category: 'work' },
      { id: 'go-through', verb: 'Go through', translation: 'изучать документы / проходить трудности', examples: ['I need to go through these documents.', 'I had to go through a lot of difficulties.'], category: 'work' },
      { id: 'work-on', verb: 'Work on', translation: 'работать над чем-либо', examples: ["I'm working on improving my English.", 'We need to work on this project.'], category: 'work' },
      { id: 'cut-back', verb: 'Cut back', translation: 'сокращать расходы', examples: ['We cut back on spending.', 'I need to cut back on sugar.'], category: 'work' },
      { id: 'pay-off', verb: 'Pay off', translation: 'окупаться, приносить результат', examples: ['All your hard work will pay off.', 'The investment finally paid off.'], category: 'work' },
      { id: 'look-up', verb: 'Look up', translation: 'искать информацию в словаре', examples: ['You can look up this word in the dictionary.', 'I looked it up online.'], category: 'work' },
      { id: 'write-down', verb: 'Write down', translation: 'записывать', examples: ['Write down my phone number.', 'Write down your ideas.'], category: 'work' },
      { id: 'speed-up', verb: 'Speed up', translation: 'ускорять', examples: ['Speed up your work.', 'Can we speed up the process?'], category: 'work' },
      { id: 'move-on', verb: 'Move on', translation: 'переходить к следующему', examples: ["Let's move on to the next topic.", "It's time to move on."], category: 'work' },
      { id: 'keep-on', verb: 'Keep on', translation: 'продолжать делать', examples: ['She keeps on calling me.', "Keep on practicing and you'll get better."], category: 'work' },
    ],
  },
  {
    id: 'travel',
    title: 'Движение и путешествия',
    description: 'Перемещение, поездки и эксплуатация транспорта',
    verbs: [
      { id: 'set-off', verb: 'Set off', translation: 'отправляться в путь', examples: ['We set off early in the morning.', "Let's set off before sunrise."], category: 'travel' },
      { id: 'take-off-plane', verb: 'Take off (plane)', translation: 'взлетать', examples: ['The plane takes off at 8:00 a.m.', 'My flight takes off in an hour.'], category: 'travel' },
      { id: 'break-down', verb: 'Break down', translation: 'ломаться (о механизмах)', examples: ["Jake's car broke down again.", 'The elevator broke down.'], category: 'travel' },
      { id: 'pull-up', verb: 'Pull up', translation: 'подъезжать, останавливаться', examples: ['The car pulled up at the traffic lights.', 'A taxi pulled up outside.'], category: 'travel' },
      { id: 'get-on-off', verb: 'Get on / Get off', translation: 'садиться / выходить из транспорта', examples: ['Get on the bus.', 'She got on the train at the last minute.', "I'll get off at the next stop."], category: 'travel' },
      { id: 'check-in', verb: 'Check in', translation: 'заселяться в отель, регистрироваться', examples: ['He checked in at the hotel.', 'We need to check in two hours before the flight.'], category: 'travel' },
      { id: 'move-in-out', verb: 'Move in / Move out', translation: 'въезжать / выезжать из жилья', examples: ['When can we move in?', 'We are moving out of the apartment.'], category: 'travel' },
      { id: 'drive-off', verb: 'Drive off', translation: 'уезжать', examples: ['The car drove off.', 'He drove off without saying goodbye.'], category: 'travel' },
      { id: 'run-away', verb: 'Run away', translation: 'убегать, совершать побег', examples: ['The suspect ran away.', 'The dog ran away from home.'], category: 'travel' },
      { id: 'back-up', verb: 'Back up (vehicle)', translation: 'сдавать назад', examples: ['The truck stopped and then backed up.', 'Can you back up a little?'], category: 'travel' },
      { id: 'fall-down', verb: 'Fall down', translation: 'падать', examples: ['The old tree fell down.', "Be careful or you'll fall down."], category: 'travel' },
      { id: 'get-back', verb: 'Get back', translation: 'возвращаться', examples: ["I'll get back home soon.", 'When did you get back from Paris?'], category: 'travel' },
      { id: 'turn-around', verb: 'Turn around', translation: 'развернуться, обернуться', examples: ['She turned around to look at me.', "Turn around, there's a faster route."], category: 'travel' },
      { id: 'get-out', verb: 'Get out', translation: 'выходить', examples: ['Get out of here.', "Let's get out for some fresh air."], category: 'travel' },
      { id: 'drop-off', verb: 'Drop off', translation: 'высаживать из машины', examples: ['Can you drop me off at the station?', "I'll drop you off on my way."], category: 'travel' },
    ],
  },
  {
    id: 'emotions',
    title: 'Эмоции и состояние',
    description: 'Чувства, здоровье, отдых и внутренние реакции',
    verbs: [
      { id: 'give-up', verb: 'Give up', translation: 'сдаваться, бросать', examples: ["You shouldn't give up so easily.", "Don't give up on your goals.", 'Brian gave up smoking last year.'], category: 'emotions' },
      { id: 'calm-down', verb: 'Calm down', translation: 'успокаиваться', examples: ['Take a deep breath and calm down.', 'Calm down, everything will be fine.'], category: 'emotions' },
      { id: 'cheer-up', verb: 'Cheer up', translation: 'взбодриться, развеселиться', examples: ['Cheer up, things will get better.', 'He tried to cheer her up.'], category: 'emotions' },
      { id: 'chill-out', verb: 'Chill out', translation: 'расслабляться, отдыхать', examples: ["Let's chill out and watch a movie.", 'You need to chill out more.'], category: 'emotions' },
      { id: 'look-forward-to', verb: 'Look forward to', translation: 'ждать с нетерпением', examples: ["I'm looking forward to Summer.", "I'm looking forward to the trip.", "I'm looking forward to my vacation."], category: 'emotions' },
      { id: 'zone-out', verb: 'Zone out', translation: 'отключаться, грезить наяву', examples: ['I zoned out during the meeting.', 'She zoned out while reading.'], category: 'emotions' },
      { id: 'come-down-with', verb: 'Come down with', translation: 'заболеть чем-либо', examples: ['Frank came down with the flu.', "I think I'm coming down with a cold."], category: 'emotions' },
      { id: 'pass-out', verb: 'Pass out', translation: 'терять сознание', examples: ['Kevin passed out from the heat.', 'She passed out from exhaustion.'], category: 'emotions' },
      { id: 'work-out-fitness', verb: 'Work out (fitness)', translation: 'тренироваться', examples: ['I work out regularly to keep fit.', 'She works out at the gym every morning.'], category: 'emotions' },
      { id: 'fall-behind', verb: 'Fall behind', translation: 'отставать', examples: ['I fell behind during the hike.', "Don't fall behind with your studies."], category: 'emotions' },
      { id: 'fall-apart', verb: 'Fall apart', translation: 'разваливаться', examples: ["The chair is so old it's starting to fall apart.", 'My plans fell apart.'], category: 'emotions' },
      { id: 'lie-down', verb: 'Lie down', translation: 'прилечь', examples: ["Why don't you lie down and rest?", 'I need to lie down for a minute.'], category: 'emotions' },
      { id: 'hold-on', verb: 'Hold on', translation: 'подождать, держаться', examples: ['Hold on a minute please.', 'Hold on, I forgot my keys.', 'Hold on, you can do this.'], category: 'emotions' },
      { id: 'come-across', verb: 'Come across', translation: 'производить впечатление / случайно найти', examples: ['He comes across as a very confident person.', 'I came across an interesting article.'], category: 'emotions' },
      { id: 'grow-up', verb: 'Grow up', translation: 'расти, взрослеть', examples: ['Kids grow up so fast.', 'Where did you grow up?'], category: 'emotions' },
      { id: 'turn-into', verb: 'Turn into', translation: 'превращаться', examples: ['Caterpillars turn into butterflies.', 'The argument turned into a fight.'], category: 'emotions' },
    ],
  },
]

export function searchPhrasalVerbs(query: string): PhrasalVerb[] {
  const q = query.toLowerCase()
  const results: PhrasalVerb[] = []
  for (const cat of PHRASAL_VERBS_DATA) {
    for (const verb of cat.verbs) {
      if (
        verb.verb.toLowerCase().includes(q) ||
        verb.translation.toLowerCase().includes(q) ||
        verb.examples.some(e => e.toLowerCase().includes(q))
      ) {
        results.push(verb)
      }
    }
  }
  return results
}

export function getAllPhrasalVerbs(): PhrasalVerb[] {
  return PHRASAL_VERBS_DATA.flatMap(c => c.verbs)
}
