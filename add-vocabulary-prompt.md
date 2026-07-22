# Task: Add B1 Thematic Vocabulary to lib/vocabulary-data.ts

## Context
The file `lib/vocabulary-data.ts` exports `VOCABULARY: VocabWord[]` where each entry is:
```ts
interface VocabWord {
  id: string          // format: 'v-{lessonId}-{number}'
  lessonId: string    // use the theme IDs listed below
  word: string        // English word or phrase
  translation: string // Russian translation
  example: string     // English example sentence
  exampleTranslation: string // Russian translation of the example
}
```

## What to do
Append the following 163 vocabulary entries to the `VOCABULARY` array at the end of `lib/vocabulary-data.ts`.

Use these lessonId values (one per thematic group):
- `b1-vocab-learning`    → Unit 1–4: Learning vocabulary
- `b1-vocab-appearance`  → Unit 10: Appearance
- `b1-vocab-character`   → Unit 11: Character
- `b1-vocab-feelings`    → Unit 12: Feelings & Emotions
- `b1-vocab-family`      → Units 13–15: Family & Relationships
- `b1-vocab-home`        → Unit 17: Home & Housing
- `b1-vocab-weather`     → Unit 7: Weather
- `b1-vocab-world`       → Unit 6: Physical World
- `b1-vocab-animals`     → Unit 8: Animals
- `b1-vocab-body`        → Unit 9: Body & Movement

For each entry, generate a natural Russian translation of the `exampleTranslation` field based on the English example provided.

## Vocabulary data to add

### Group 1: b1-vocab-learning (ids: v-b1-vocab-learning-1 … -16)
1. routine / Система привычек / It's a good idea to have a routine when you use a textbook.
2. revise / Повторять / A daily routine when you revise that unit.
3. active / Активный / You need to be active when learning.
4. highlighter pen / Маркер для выделения / Use the highlighter pen to mark words you think are important.
5. translation / Перевод / Next to each one I write a Spanish translation.
6. pronunciation / Произношение / Check the pronunciation in the dictionary.
7. bilingual dictionary / Двуязычный словарь / A bilingual dictionary is easy for you to understand.
8. definition / Дефиниция / In the dictionary you will find a definition.
9. parts of speech / Части речи / I write down the parts of speech for each word.
10. noun / Существительное / I write down if a word is a noun, verb, or adjective.
11. verb / Глагол / Verbs are words like "sit" and "listen".
12. phrasal verb / Фразовый глагол / You will also need to learn the grammar of phrasal verbs.
13. prefix / Приставка / In the word "uncomfortable", "un" is a prefix.
14. suffix / Суффикс / In the word "comfortable", "able" is a suffix.
15. stress / Ударение / The vertical mark shows where the stressed syllable begins.
16. syllable / Слог / Count the syllables in each word.

### Group 2: b1-vocab-appearance (ids: v-b1-vocab-appearance-1 … -16)
1. attractive / Привлекательный / Women can be attractive or good looking.
2. good-looking / Симпатичный / They are a very good-looking couple.
3. gorgeous / Шикарный / Bella looks gorgeous in that dress.
4. handsome / Красивый (о мужчине) / Liam has become quite handsome.
5. overweight / Полный / Overweight is more polite than "fat".
6. medium height / Среднего роста / If someone is not tall or short, you can say medium height.
7. average / Средний / You can say they are of average build.
8. look like / Выглядеть / What does Sofia's boyfriend look like?
9. broad shoulders / Широкие плечи / He's got broad shoulders and looks athletic.
10. athletic / Атлетичный / He looks very athletic.
11. smart / Стильный / Is he quite smart? Yeah, he dresses quite well.
12. straight / Прямые (волосы) / She's got straight hair.
13. wavy / Волнистые (волосы) / Hair can be straight, wavy or curly.
14. curly / Кудрявые (волосы) / She has curly red hair.
15. blond / Светлые / Someone's hair can be blond or fair.
16. dark / Тёмные (волосы) / He has dark brown hair and brown eyes.

### Group 3: b1-vocab-character (ids: v-b1-vocab-character-1 … -12)
1. confident / Уверенный в себе / I'm quite confident in social situations.
2. shy / Стеснительный / I'm quite shy when I meet new people.
3. hardworking / Трудолюбивый / She is very hardworking and never gives up.
4. sense of humor / Чувство юмора / He has a great sense of humor.
5. generous / Щедрый / She is generous and always helps others.
6. mean / Жадный / Why are you so mean today?
7. honest / Честный / An honest person always tells the truth.
8. sensible / Разумный / The first thing I would say is that she is very sensible.
9. talented / Талантливый / She is a very talented artist.
10. reliable / Надёжный / I'm usually reliable — you can count on me.
11. patient / Терпеливый / You need to be patient when learning a language.
12. impatient / Нетерпеливый / I can be quite impatient when things go slowly.

### Group 4: b1-vocab-feelings (ids: v-b1-vocab-feelings-1 … -15)
1. proud of / Гордиться / I'm very proud of my son's success.
2. disappointed / Разочарованный / I'm a bit disappointed with the results.
3. confused / Растерянный / The politicians seem confused about what to do.
4. hopeful / Оптимистичный / I'm hopeful that things will improve soon.
5. jealous / Ревнивый / His girlfriend was getting jealous.
6. upset / Расстроенный / He is quite upset about the news.
7. curious / Любопытный / We were curious to see what all the noise was about.
8. anxious / Взволнованный / I felt anxious when I saw how angry the men were.
9. scared / Испуганный / We were really scared when they started coming towards us.
10. cheerful / Жизнерадостный / Why do people feel more cheerful when the sun shines?
11. miserable / Несчастный / People feel miserable when it's raining all day.
12. depressed / Подавленный / Which makes them feel depressed during long dark winters.
13. mood / Настроение / Can the weather really affect our mood?
14. furious / В ярости / She was furious when she heard the news.
15. relieved / Облегчённый / I felt so relieved when the exam was over.

### Group 5: b1-vocab-family (ids: v-b1-vocab-family-1 … -28)
1. widow / Вдова / My mother was a widow with four young children.
2. stepfather / Отчим / So now I have a stepfather.
3. elder / Старший (брат/сестра) / I've got an elder brother called Thomas.
4. twins / Близнецы / Anya and Claudia are twins.
5. close family / Близкие родственники / We're a very close family.
6. cousins / Двоюродные братья/сёстры / I have five cousins.
7. relatives / Родственники / All my relatives came to the wedding.
8. sister-in-law / Свояченица / So now I have a sister-in-law as well.
9. birth / Рождение / This stage of life is called birth.
10. toddler / Малыш (1–3 года) / From 12 months to 3 years old it is a toddler.
11. childhood / Детство / She had a very happy childhood.
12. teenager / Подросток / In this period you are a teenager.
13. adult / Взрослый / At 18 you become an adult.
14. middle-aged / Среднего возраста / People are middle-aged in the middle of their lives.
15. retired / На пенсии / When people stop work they are retired.
16. grow up / Расти / She grew up in the city.
17. bring up / Воспитывать / She was brought up on a farm in Wales.
18. date / Свидание / I had my first date when I was 16.
19. go out with / Встречаться / I went out with a girl for three months.
20. break up / Расставаться / But we broke up when she met someone else.
21. serious relationship / Серьёзные отношения / My first serious relationship was at university.
22. be in love / Быть влюблённым / We realized we were in love.
23. engaged / Помолвлен / We got engaged a couple of years after university.
24. wedding / Свадьба / We had the wedding in the local church.
25. reception / Свадебный приём / Afterwards we had the reception in a small hotel.
26. anniversary / Годовщина / Two days after our fourth wedding anniversary.
27. honeymoon / Медовый месяц / We went on our honeymoon to Greece.
28. divorce / Развод / Divorce — when a marriage officially ends.

### Group 6: b1-vocab-home (ids: v-b1-vocab-home-1 … -15)
1. outskirts / Окраина / We live on the outskirts of town.
2. location / Расположение / It's a very nice location for a flat.
3. move to / Переехать / We moved to our present flat when we had children.
4. rent / Арендовать / We rent a flat on the second floor.
5. ground floor / Первый этаж / The ground floor is at the same level as the ground outside.
6. top floor / Верхний этаж / She lives on the top floor of the building.
7. block of flats / Многоэтажка / It's a modern block of flats.
8. lift / Лифт / Although the lift is small, it works well.
9. air conditioning / Кондиционер / There is no air conditioning in the flat.
10. cottage / Коттедж / My parents own a cottage in the countryside.
11. backyard / Задний двор / A charming house with a backyard.
12. garage / Гараж / The house has a two-car garage.
13. porch / Крыльцо / There's a small front porch.
14. central heating / Центральное отопление / It doesn't have central heating, so it's cold in winter.
15. landlord / Домовладелец / The landlord raised the rent last month.

### Group 7: b1-vocab-weather (ids: v-b1-vocab-weather-1 … -13)
1. sunny / Солнечный / People feel more cheerful when it's sunny.
2. the sun came out / Солнце вышло / The sun came out after lunch.
3. foggy / Туманный / The accident happened in thick fog.
4. cloudy / Облачный / It was very cloudy this morning.
5. heavy rain / Сильный дождь / We had some heavy rain at the weekend.
6. strong wind / Сильный ветер / There was a strong wind when we were in the boat.
7. pouring / Льёт как из ведра / Look, it's really pouring now.
8. shower / Ливень / We had a couple of heavy showers this morning.
9. thunderstorm / Гроза / Hot weather sometimes ends with a thunderstorm.
10. lightning / Молния / You can see lightning during a thunderstorm.
11. boiling / Очень жарко / It's boiling today — over 35 degrees!
12. freezing / Морозно / Freezing — when it's extremely cold.
13. chilly / Прохладно / It's a bit chilly this evening — take a jacket.

### Group 8: b1-vocab-world (ids: v-b1-vocab-world-1 … -13)
1. surface / Поверхность / Two thirds of the surface of the earth is covered in water.
2. Celsius / Цельсий / Over 57 degrees Celsius — the hottest place on Earth.
3. cave / Пещера / The Voronya Cave near the Black Sea is the deepest in the world.
4. deep / Глубокий / It is over 2000m deep.
5. canal / Канал / The longest canal in the world is in China.
6. waterfall / Водопад / The highest waterfall in the world is in Venezuela.
7. rainforest / Тропический лес / The Amazon rainforest is the largest in the world.
8. ocean / Океан / The Pacific is the largest ocean in the world.
9. continent / Континент / Antarctica is the coldest continent.
10. landscape / Пейзаж / The region has completely different landscapes.
11. climate / Климат / The climate can change within a very short distance.
12. desert / Пустыня / The Sahara is the largest hot desert in the world.
13. glacier / Ледник / Glaciers are melting due to climate change.

### Group 9: b1-vocab-animals (ids: v-b1-vocab-animals-1 … -9)
1. keep a pet / Держать питомца / In the UK many people keep pets.
2. cage / Клетка / Hamsters and mice are usually kept in a cage.
3. wild animals / Дикие животные / Tigers, lions and bears are wild animals.
4. insects / Насекомые / Insects include bees, mosquitoes and butterflies.
5. sea creatures / Морские существа / Whales, sharks and dolphins are sea creatures.
6. breed / Порода / What breed of dog do you have?
7. stray / Бездомный (о животном) / There are many stray cats in the city.
8. endangered / Под угрозой исчезновения / Many species are now endangered.
9. wildlife / Дикая природа / We should protect local wildlife.

### Group 10: b1-vocab-body (ids: v-b1-vocab-body-1 … -26)
1. forehead / Лоб / She touched her forehead — it felt warm.
2. cheek / Щека / She kissed him on the cheek.
3. chin / Подбородок / He rubbed his chin thoughtfully.
4. neck / Шея / She wore a scarf around her neck.
5. shoulder / Плечо / He put his arm around her shoulder.
6. chest / Грудная клетка / He felt a pain in his chest.
7. waist / Талия / She tied the belt around her waist.
8. wrist / Запястье / She wore a watch on her wrist.
9. hip / Бедро / She put her hands on her hips.
10. thumb / Большой палец / Put your thumbs up if you agree!
11. knee / Колено / He fell and hurt his knee.
12. ankle / Лодыжка / She twisted her ankle while running.
13. heel / Пятка / My new shoes are hurting my heels.
14. toe / Палец ноги / She painted her toenails red.
15. breathe / Дышать / Breathe in slowly and then breathe out.
16. smile at / Улыбнуться (кому-то) / She smiled at him when he walked in.
17. laugh at / Смеяться (над чем-то) / Everyone laughed at his joke.
18. cry / Плакать / The baby started to cry in the night.
19. nod / Кивать / She nodded her head to say yes.
20. shake head / Качать головой / He shook his head — he didn't agree.
21. yawn / Зевать / I couldn't stop yawning during the meeting.
22. shake hands / Пожимать руку / They shook hands after signing the contract.
23. fold arms / Скрестить руки / He folded his arms and looked away.
24. wave to / Махать рукой / She waved to us from across the street.
25. blow nose / Сморкаться / He sneezed and blew his nose.
26. skin / Кожа / The outer part of the body is covered in skin.

## Final instruction
After adding all entries, verify the file compiles by checking there are no syntax errors (missing commas, unclosed brackets). Run `npx tsc --noEmit` if needed.

The total added entries should be approximately 163 words across 10 thematic groups.
