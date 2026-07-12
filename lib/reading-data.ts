export interface ReadingText {
  id: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  title: string
  text: string
  highlightWords: string[]
  vocabulary: Record<string, string>
  questions: { question: string; options: string[]; answer: string }[]
}

export const READING_POOL: ReadingText[] = [
  // ── A1 (5) ──
  {
    id: 'r-a1-1', level: 'A1', title: 'My Bedroom',
    text: 'This is my bedroom. It is small but nice. I have a bed, a desk, and a wardrobe. On my desk, there is a computer and some books. My favourite colour is blue, so my walls are blue. I have a big window. I can see the garden from my window. I love my bedroom!',
    highlightWords: ['wardrobe', 'desk', 'favourite', 'window', 'garden'],
    vocabulary: { wardrobe: 'шкаф', desk: 'стол', favourite: 'любимый', window: 'окно', garden: 'сад' },
    questions: [
      { question: 'What colour are the walls?', options: ['Green', 'Yellow', 'Blue', 'White'], answer: 'Blue' },
      { question: 'What is on the desk?', options: ['A bed and books', 'A computer and books', 'A wardrobe and books', 'Books only'], answer: 'A computer and books' },
      { question: 'What can the person see from the window?', options: ['The street', 'The park', 'The garden', 'The school'], answer: 'The garden' },
    ],
  },
  {
    id: 'r-a1-2', level: 'A1', title: 'My Best Friend',
    text: 'My best friend is Lucy. She is thirteen years old. She has long brown hair and green eyes. She is funny and very kind. We go to the same school. We always sit together in class. After school, we walk home together and talk about everything. On Saturdays, we go to the cinema or the park. I am very happy that Lucy is my friend.',
    highlightWords: ['funny', 'kind', 'together', 'cinema', 'happy'],
    vocabulary: { funny: 'смешной', kind: 'добрый', together: 'вместе', cinema: 'кино', happy: 'счастливый' },
    questions: [
      { question: 'How old is Lucy?', options: ['Eleven', 'Twelve', 'Thirteen', 'Fourteen'], answer: 'Thirteen' },
      { question: 'What do they do after school?', options: ['Play sport', 'Watch TV', 'Walk home together', 'Do homework'], answer: 'Walk home together' },
      { question: 'Where do they go on Saturdays?', options: ['The library or café', 'The gym or pool', 'The cinema or park', 'The mall or museum'], answer: 'The cinema or park' },
    ],
  },
  {
    id: 'r-a1-3', level: 'A1', title: 'Animals on the Farm',
    text: 'There are many animals on our farm. We have ten cows, twenty chickens, and five horses. The cows give us milk every day. The chickens give us eggs in the morning. The horses are very big and strong. We also have two dogs. The dogs help us with the cows. Life on the farm is hard but I love it.',
    highlightWords: ['cows', 'chickens', 'horses', 'eggs', 'strong'],
    vocabulary: { cows: 'коровы', chickens: 'курицы', horses: 'лошади', eggs: 'яйца', strong: 'сильный' },
    questions: [
      { question: 'How many chickens are there?', options: ['Ten', 'Fifteen', 'Twenty', 'Twenty-five'], answer: 'Twenty' },
      { question: 'What do the cows give?', options: ['Eggs', 'Milk', 'Meat', 'Wool'], answer: 'Milk' },
      { question: 'What do the dogs do?', options: ['Guard the house', 'Help with the cows', 'Play with children', 'Run races'], answer: 'Help with the cows' },
    ],
  },
  {
    id: 'r-a1-4', level: 'A1', title: 'A Visit to the Doctor',
    text: 'Tom is at the doctor\'s. He has a bad cold. He has a headache and a sore throat. The doctor looks at his throat and takes his temperature. His temperature is 38 degrees. The doctor says Tom needs to rest and drink a lot of water. She gives him some medicine. Tom needs to take two tablets three times a day. He will feel better in three days.',
    highlightWords: ['headache', 'throat', 'temperature', 'medicine', 'tablets'],
    vocabulary: { headache: 'головная боль', throat: 'горло', temperature: 'температура', medicine: 'лекарство', tablets: 'таблетки' },
    questions: [
      { question: 'What is Tom\'s temperature?', options: ['37°', '37.5°', '38°', '39°'], answer: '38°' },
      { question: 'What does the doctor tell Tom to do?', options: ['Go to hospital', 'Take a walk', 'Rest and drink water', 'Eat more food'], answer: 'Rest and drink water' },
      { question: 'How often should Tom take the tablets?', options: ['Once a day', 'Twice a day', 'Three times a day', 'Four times a day'], answer: 'Three times a day' },
    ],
  },
  {
    id: 'r-a1-5', level: 'A1', title: 'A Postcard from London',
    text: 'Dear Maria, I am in London! It is a very big and busy city. Today I visited the British Museum. It was amazing! There are many old things from all over the world. Then I walked to Trafalgar Square. I saw the famous fountains and the big lions. In the evening, I had fish and chips. They were delicious! Tomorrow I am going to the Tower of London. I miss you! Love, Elena',
    highlightWords: ['museum', 'amazing', 'famous', 'fountains', 'delicious'],
    vocabulary: { museum: 'музей', amazing: 'удивительный', famous: 'знаменитый', fountains: 'фонтаны', delicious: 'вкусный' },
    questions: [
      { question: 'Where did Elena go today?', options: ['The Tower of London', 'Hyde Park', 'The British Museum', 'Buckingham Palace'], answer: 'The British Museum' },
      { question: 'What did she eat in the evening?', options: ['Pizza', 'Fish and chips', 'Pasta', 'Sandwiches'], answer: 'Fish and chips' },
      { question: 'Where is she going tomorrow?', options: ['The British Museum', 'Trafalgar Square', 'The Tower of London', 'Hyde Park'], answer: 'The Tower of London' },
    ],
  },

  // ── A2 (5) ──
  {
    id: 'r-a2-1', level: 'A2', title: 'Social Media and Teenagers',
    text: 'Many teenagers today spend several hours a day on social media. They use apps like Instagram, TikTok, and Snapchat to share photos and videos and stay in touch with friends. Some young people say that social media helps them feel connected and find communities with similar interests. However, experts are worried that too much screen time can affect sleep and mental health. Some schools have banned phones during lessons to help students concentrate. Parents often try to set limits on how long their children can use these apps.',
    highlightWords: ['teenagers', 'connected', 'concentrate', 'limits', 'banned'],
    vocabulary: { teenagers: 'подростки', connected: 'связанный', concentrate: 'концентрироваться', limits: 'ограничения', banned: 'запрещённый' },
    questions: [
      { question: 'What do some schools do about phones?', options: ['Give students phones', 'Ban phones during lessons', 'Allow unlimited use', 'Provide phone apps'], answer: 'Ban phones during lessons' },
      { question: 'What are experts worried about?', options: ['Low grades', 'Too much sport', 'Screen time affecting sleep and mental health', 'Students not using technology'], answer: 'Screen time affecting sleep and mental health' },
      { question: 'What do some teenagers say about social media?', options: ['It wastes time', 'It helps them feel connected', 'It is boring', 'It is too expensive'], answer: 'It helps them feel connected' },
    ],
  },
  {
    id: 'r-a2-2', level: 'A2', title: 'Working from Home',
    text: 'Since the pandemic, millions of people around the world have started working from home. Many workers say they enjoy not having to travel to the office every day. They save time and money on commuting. They can also spend more time with their families. However, some people find it difficult to concentrate at home because of noise and distractions. Others miss the social side of office life. Many companies now offer a hybrid model, where employees work partly at home and partly in the office.',
    highlightWords: ['commuting', 'distractions', 'hybrid', 'employees', 'pandemic'],
    vocabulary: { commuting: 'поездки на работу', distractions: 'отвлечения', hybrid: 'гибридный', employees: 'сотрудники', pandemic: 'пандемия' },
    questions: [
      { question: 'What do workers save by working from home?', options: ['Money on food', 'Time and money on commuting', 'Office rent', 'Healthcare costs'], answer: 'Time and money on commuting' },
      { question: 'Why do some people find it hard to work at home?', options: ['Bad internet', 'Noise and distractions', 'Uncomfortable chairs', 'Lack of equipment'], answer: 'Noise and distractions' },
      { question: 'What is the hybrid model?', options: ['Working only at home', 'Working only in the office', 'Working partly at home and partly in the office', 'Working for two companies'], answer: 'Working partly at home and partly in the office' },
    ],
  },
  {
    id: 'r-a2-3', level: 'A2', title: 'Street Food Around the World',
    text: 'Street food is popular in cities all over the world. In Mexico, you can find delicious tacos filled with meat, cheese, and salsa. In Thailand, vendors sell pad thai, a fried noodle dish with prawns and peanuts. In India, people love to eat spicy samosas, which are small pastries filled with potatoes and vegetables. Japan is famous for takoyaki — small round balls made with octopus. Street food is usually cheap and gives you a great taste of local culture. Many tourists say that the best food they eat on holiday is from street stalls.',
    highlightWords: ['vendors', 'pastries', 'spicy', 'octopus', 'culture'],
    vocabulary: { vendors: 'продавцы', pastries: 'выпечка', spicy: 'острый', octopus: 'осьминог', culture: 'культура' },
    questions: [
      { question: 'What is pad thai?', options: ['A rice dish', 'A soup', 'A fried noodle dish', 'A type of pastry'], answer: 'A fried noodle dish' },
      { question: 'What is takoyaki made with?', options: ['Shrimp', 'Octopus', 'Tofu', 'Chicken'], answer: 'Octopus' },
      { question: 'What do many tourists say about street food?', options: ['It is too spicy', 'It is expensive', 'It is the best food they eat on holiday', 'It is hard to find'], answer: 'It is the best food they eat on holiday' },
    ],
  },
  {
    id: 'r-a2-4', level: 'A2', title: 'The History of Coffee',
    text: 'Coffee is one of the most popular drinks in the world. It was first discovered in Ethiopia around a thousand years ago. According to legend, a goat herder noticed his goats were very energetic after eating certain berries. He tried the berries himself and felt more awake. People later learned to roast the beans and make a hot drink. Coffee spread to Arabia in the 15th century, and by the 17th century it had reached Europe. Today, more than two billion cups of coffee are drunk every day around the world.',
    highlightWords: ['discovered', 'legend', 'energetic', 'roast', 'spread'],
    vocabulary: { discovered: 'обнаружен', legend: 'легенда', energetic: 'энергичный', roast: 'обжаривать', spread: 'распространился' },
    questions: [
      { question: 'Where was coffee first discovered?', options: ['Arabia', 'Brazil', 'Ethiopia', 'India'], answer: 'Ethiopia' },
      { question: 'What did the goat herder notice?', options: ['The berries tasted sweet', 'His goats were very energetic', 'The beans smelled nice', 'The water changed colour'], answer: 'His goats were very energetic' },
      { question: 'When did coffee reach Europe?', options: ['15th century', '16th century', '17th century', '18th century'], answer: '17th century' },
    ],
  },
  {
    id: 'r-a2-5', level: 'A2', title: 'Volunteering',
    text: 'Volunteering means working without pay to help others or your community. Many people volunteer at hospitals, food banks, animal shelters, or schools. Some volunteers help elderly people with shopping or housework. Others teach reading to children or adults. Volunteers often say that helping others makes them feel happy and gives them a sense of purpose. Many employers look positively at volunteering experience on a CV because it shows that a person is motivated and caring. Young people especially can benefit by gaining skills and making friends.',
    highlightWords: ['volunteering', 'community', 'elderly', 'purpose', 'motivated'],
    vocabulary: { volunteering: 'волонтёрство', community: 'сообщество', elderly: 'пожилые люди', purpose: 'цель', motivated: 'мотивированный' },
    questions: [
      { question: 'Where do some volunteers work?', options: ['Banks and airports', 'Hospitals and food banks', 'Hotels and restaurants', 'Offices and schools only'], answer: 'Hospitals and food banks' },
      { question: 'Why do employers like volunteering experience?', options: ['It shows creativity', 'It shows motivation and caring', 'It increases salary', 'It replaces qualifications'], answer: 'It shows motivation and caring' },
      { question: 'How do volunteers often feel?', options: ['Tired and stressed', 'Bored and underpaid', 'Happy with a sense of purpose', 'Confused and overwhelmed'], answer: 'Happy with a sense of purpose' },
    ],
  },

  // ── B1 (5) ──
  {
    id: 'r-b1-1', level: 'B1', title: 'Minimalism: Living with Less',
    text: 'Minimalism is a lifestyle philosophy that encourages people to own fewer possessions and focus on what truly matters. Its modern revival was largely driven by the 2011 documentary "Minimalism" and books such as Marie Kondo\'s "The Life-Changing Magic of Tidying Up". Proponents argue that owning less reduces stress, saves money, and forces you to prioritise experiences over things. In a culture that constantly encourages consumption, minimalism represents a deliberate pushback. Critics, however, point out that it can be a privilege — it is easier to choose to own less when you have always had enough.',
    highlightWords: ['possessions', 'revival', 'prioritise', 'consumption', 'privilege'],
    vocabulary: { possessions: 'имущество', revival: 'возрождение', prioritise: 'расставлять приоритеты', consumption: 'потребление', privilege: 'привилегия' },
    questions: [
      { question: 'What helped revive minimalism?', options: ['A television series', 'Social media trends', 'A documentary and books', 'Government campaigns'], answer: 'A documentary and books' },
      { question: 'What do minimalists prioritise over things?', options: ['Money', 'Experiences', 'Work', 'Relationships'], answer: 'Experiences' },
      { question: 'What do critics say about minimalism?', options: ['It is too expensive', 'It is anti-social', 'It can be a privilege', 'It is scientifically flawed'], answer: 'It can be a privilege' },
    ],
  },
  {
    id: 'r-b1-2', level: 'B1', title: 'The Benefits of Bilingualism',
    text: 'Speaking more than one language does more than just help you communicate with people from other countries. Research suggests that bilingual people have stronger executive function — the ability to switch tasks, focus attention, and suppress irrelevant information. Bilingualism may also delay the onset of dementia by several years. This is thought to be because managing two languages creates additional neural connections, essentially exercising the brain. Children who grow up bilingual often struggle initially with vocabulary in each language but typically catch up with monolingual peers by school age. Exposure to a second language, even informally, appears to provide cognitive benefits.',
    highlightWords: ['bilingualism', 'dementia', 'neural', 'monolingual', 'cognitive'],
    vocabulary: { bilingualism: 'двуязычие', dementia: 'деменция', neural: 'нейронный', monolingual: 'одноязычный', cognitive: 'когнитивный' },
    questions: [
      { question: 'What may bilingualism delay?', options: ['Language learning', 'The onset of dementia', 'Reading development', 'Executive function'], answer: 'The onset of dementia' },
      { question: 'Why does managing two languages benefit the brain?', options: ['It increases vocabulary', 'It creates additional neural connections', 'It improves memory directly', 'It reduces stress'], answer: 'It creates additional neural connections' },
      { question: 'How do bilingual children compare to monolingual peers at school age?', options: ['They typically fall behind', 'They typically catch up', 'They are always more advanced', 'They have larger vocabularies'], answer: 'They typically catch up' },
    ],
  },
  {
    id: 'r-b1-3', level: 'B1', title: 'The Rise of Podcasts',
    text: 'Podcasts have experienced remarkable growth over the past decade. In 2006, fewer than a million people regularly listened to podcasts; today, that number exceeds 450 million globally. The format\'s flexibility is key to its appeal — listeners can consume content while commuting, exercising, or doing household chores. Unlike broadcast radio, podcasts cater to extraordinarily niche interests, from true crime to medieval history to specific technical fields. The advertising model has made many podcasters financially viable, and some independent creators rival traditional media outlets in audience size. However, discoverability remains a challenge in an increasingly crowded market.',
    highlightWords: ['remarkable', 'flexibility', 'niche', 'viable', 'discoverability'],
    vocabulary: { remarkable: 'замечательный', flexibility: 'гибкость', niche: 'нишевый', viable: 'жизнеспособный', discoverability: 'возможность найти' },
    questions: [
      { question: 'How many people listen to podcasts globally today?', options: ['Under a million', 'Around 100 million', 'Over 450 million', 'Around 2 billion'], answer: 'Over 450 million' },
      { question: 'What makes podcasts appealing?', options: ['They are always free', 'Their flexibility and niche topics', 'Their celebrity presenters', 'Their live format'], answer: 'Their flexibility and niche topics' },
      { question: 'What challenge do podcasters face?', options: ['Lack of topics', 'Poor audio quality', 'Discoverability in a crowded market', 'No advertising revenue'], answer: 'Discoverability in a crowded market' },
    ],
  },
  {
    id: 'r-b1-4', level: 'B1', title: 'Ocean Plastic',
    text: 'Every year, around eight million tonnes of plastic waste enters the world\'s oceans. Once there, it does not biodegrade but breaks into smaller and smaller pieces called microplastics, which are now found everywhere — from the deepest ocean trenches to Arctic ice cores. Marine animals frequently mistake plastic for food; sea turtles, for example, often confuse plastic bags with jellyfish. Scientists have also found microplastics in human blood, raising concerns about long-term health effects. International efforts to address the problem include treaties banning single-use plastics and projects to collect ocean plastic, though experts warn that prevention is far more effective than cleanup.',
    highlightWords: ['biodegrade', 'microplastics', 'trenches', 'confuse', 'prevention'],
    vocabulary: { biodegrade: 'разлагаться', microplastics: 'микропластик', trenches: 'впадины', confuse: 'путать', prevention: 'предотвращение' },
    questions: [
      { question: 'What are microplastics?', options: ['New plastic products', 'Tiny pieces of broken-down plastic', 'Special biodegradable plastics', 'Ocean creatures'], answer: 'Tiny pieces of broken-down plastic' },
      { question: 'What do sea turtles confuse plastic bags with?', options: ['Fish', 'Seaweed', 'Jellyfish', 'Coral'], answer: 'Jellyfish' },
      { question: 'What do experts say about cleanup vs prevention?', options: ['Cleanup is more effective', 'They are equally effective', 'Prevention is far more effective', 'Neither works well'], answer: 'Prevention is far more effective' },
    ],
  },
  {
    id: 'r-b1-5', level: 'B1', title: 'Why We Dream',
    text: 'Despite decades of research, scientists still do not fully understand why we dream. Several theories exist. One influential view, proposed by Freud, suggested that dreams represent unconscious wishes and desires. Modern neuroscience offers different explanations: some researchers believe dreaming helps the brain process and consolidate memories from the day, while others argue it serves an emotional regulation function, allowing us to rehearse responses to threatening scenarios in a safe environment. REM sleep, the stage most associated with vivid dreaming, is also linked to creativity and problem-solving. Some studies show that people who are woken during REM sleep struggle more with complex tasks the following day.',
    highlightWords: ['unconscious', 'consolidate', 'regulation', 'rehearse', 'creativity'],
    vocabulary: { unconscious: 'бессознательный', consolidate: 'закреплять', regulation: 'регуляция', rehearse: 'репетировать', creativity: 'творчество' },
    questions: [
      { question: 'What did Freud believe dreams represent?', options: ['Random brain activity', 'Future predictions', 'Unconscious wishes and desires', 'Memories only'], answer: 'Unconscious wishes and desires' },
      { question: 'What is one modern theory about dreaming?', options: ['Dreams have no purpose', 'Dreams predict the future', 'Dreaming helps consolidate memories', 'Dreams only occur in children'], answer: 'Dreaming helps consolidate memories' },
      { question: 'What happens to people woken during REM sleep?', options: ['They feel refreshed', 'They remember more dreams', 'They struggle with complex tasks', 'They sleep longer'], answer: 'They struggle with complex tasks' },
    ],
  },

  // ── B2 (5) ──
  {
    id: 'r-b2-1', level: 'B2', title: 'The Economics of Happiness',
    text: 'For much of the twentieth century, economists treated GDP per capita as a reliable proxy for human wellbeing. However, a body of research accumulated since the 1970s — often called the Easterlin Paradox — revealed that beyond a certain income threshold, additional wealth does not correlate with increased happiness. Countries such as Denmark and Finland consistently top global happiness indices not because of their wealth alone, but due to high levels of social trust, robust welfare systems, work-life balance, and perceived freedom. The emerging field of happiness economics advocates reorienting policy targets away from growth metrics toward direct measures of subjective wellbeing.',
    highlightWords: ['proxy', 'threshold', 'correlate', 'paradox', 'reorienting'],
    vocabulary: { proxy: 'показатель', threshold: 'порог', correlate: 'коррелировать', paradox: 'парадокс', reorienting: 'переориентация' },
    questions: [
      { question: 'What did the Easterlin Paradox reveal?', options: ['Money always increases happiness', 'GDP is the best measure of wellbeing', 'Extra wealth above a threshold does not increase happiness', 'Poorer countries are happier'], answer: 'Extra wealth above a threshold does not increase happiness' },
      { question: 'Why do countries like Denmark top happiness indices?', options: ['Because of high GDP alone', 'Due to social trust, welfare systems, and work-life balance', 'Because of low taxes', 'Due to good weather'], answer: 'Due to social trust, welfare systems, and work-life balance' },
      { question: 'What does happiness economics advocate?', options: ['Maximising GDP growth', 'Measuring subjective wellbeing instead of growth', 'Reducing government spending', 'Increasing income inequality'], answer: 'Measuring subjective wellbeing instead of growth' },
    ],
  },
  {
    id: 'r-b2-2', level: 'B2', title: 'The Architecture of Cities',
    text: 'The built environment profoundly shapes human behaviour, social interaction, and even mental health. Jane Jacobs, the urban theorist, argued in her landmark 1961 work that the vibrancy of cities depends on density, mixed land use, short blocks, and buildings of varying ages — conditions that enable the spontaneous street life she called the "ballet of the sidewalk". Contemporary neuroscience is beginning to provide empirical support for such intuitions: studies show that exposure to high-rise environments correlates with increased stress hormones, while access to green spaces and walkable neighbourhoods is associated with lower rates of depression and anxiety.',
    highlightWords: ['vibrancy', 'density', 'spontaneous', 'empirical', 'correlates'],
    vocabulary: { vibrancy: 'живость', density: 'плотность', spontaneous: 'стихийный', empirical: 'эмпирический', correlates: 'коррелирует' },
    questions: [
      { question: 'What did Jane Jacobs argue creates vibrant cities?', options: ['Wide roads and car parks', 'Density, mixed use, short blocks, and varied buildings', 'Tall buildings and modern design', 'Separation of residential and commercial areas'], answer: 'Density, mixed use, short blocks, and varied buildings' },
      { question: 'What does exposure to high-rise environments correlate with?', options: ['Lower stress levels', 'Increased creativity', 'Increased stress hormones', 'Better social interaction'], answer: 'Increased stress hormones' },
      { question: 'What is associated with lower rates of depression?', options: ['High-rise buildings', 'Long commutes', 'Green spaces and walkable neighbourhoods', 'Large shopping malls'], answer: 'Green spaces and walkable neighbourhoods' },
    ],
  },
  {
    id: 'r-b2-3', level: 'B2', title: 'CRISPR and the Ethics of Gene Editing',
    text: 'CRISPR-Cas9, the gene-editing technology developed in the early 2010s, has the potential to eliminate hereditary diseases by precisely modifying DNA sequences. In medicine, early clinical trials have shown remarkable results for conditions such as sickle cell disease and certain cancers. However, the technology raises profound ethical questions that the scientific community is still grappling with. The most contentious application is germline editing — modifying embryos in ways that would be inherited by future generations. Critics argue this crosses a fundamental boundary, potentially opening the door to designer babies and exacerbating genetic inequality. In 2018, the case of Chinese scientist He Jiankui, who claimed to have created the first gene-edited babies, sparked international outrage and calls for a global moratorium.',
    highlightWords: ['hereditary', 'germline', 'contentious', 'moratorium', 'exacerbating'],
    vocabulary: { hereditary: 'наследственный', germline: 'зародышевая линия', contentious: 'спорный', moratorium: 'мораторий', exacerbating: 'усугубляющий' },
    questions: [
      { question: 'What conditions have CRISPR trials shown results for?', options: ['Cancer and diabetes only', 'Sickle cell disease and certain cancers', 'Heart disease and obesity', 'Alzheimer\'s and Parkinson\'s'], answer: 'Sickle cell disease and certain cancers' },
      { question: 'What is germline editing?', options: ['Editing DNA in adults only', 'Modifying embryos in heritable ways', 'Treating genetic diseases in children', 'Testing gene therapies on animals'], answer: 'Modifying embryos in heritable ways' },
      { question: 'What did He Jiankui\'s case lead to?', options: ['Nobel Prize nominations', 'New CRISPR techniques', 'International outrage and calls for a moratorium', 'Government funding increases'], answer: 'International outrage and calls for a moratorium' },
    ],
  },
  {
    id: 'r-b2-4', level: 'B2', title: 'Inflation: Causes and Consequences',
    text: 'Inflation — the general rise in the price level of goods and services — erodes purchasing power, meaning that a given sum of money buys progressively less over time. Economists distinguish between demand-pull inflation, which occurs when aggregate demand exceeds supply, and cost-push inflation, which arises from increased production costs such as rising energy prices or supply chain disruptions. Central banks typically counter inflation by raising interest rates, which increases borrowing costs and cools consumer spending. However, this remedy carries risks: if rates rise too steeply, credit conditions tighten severely and the economy may contract. The challenge for policymakers is navigating between the twin dangers of runaway inflation and recession.',
    highlightWords: ['erodes', 'aggregate', 'disruptions', 'remedy', 'recession'],
    vocabulary: { erodes: 'подрывает', aggregate: 'совокупный', disruptions: 'перебои', remedy: 'средство', recession: 'рецессия' },
    questions: [
      { question: 'What is demand-pull inflation?', options: ['Inflation from rising costs', 'Inflation when demand exceeds supply', 'Inflation from supply chain problems', 'Inflation from interest rate increases'], answer: 'Inflation when demand exceeds supply' },
      { question: 'How do central banks typically counter inflation?', options: ['Lowering taxes', 'Printing more money', 'Raising interest rates', 'Increasing government spending'], answer: 'Raising interest rates' },
      { question: 'What risk comes from raising rates too steeply?', options: ['Higher inflation', 'Loss of currency value', 'Economic contraction', 'Lower employment'], answer: 'Economic contraction' },
    ],
  },
  {
    id: 'r-b2-5', level: 'B2', title: 'Dark Tourism',
    text: 'Dark tourism — travel to sites associated with death, tragedy, or atrocity — is a growing segment of the global travel industry. Sites such as Auschwitz, Chernobyl, and Ground Zero attract millions of visitors annually. Proponents argue that such visits serve an important educational and commemorative function, ensuring that past atrocities are not forgotten. Others contend that commercial tourism transforms trauma into spectacle, trivialising suffering and disrespecting victims. The ethical debate intensified when Netflix\'s "Chernobyl" series triggered a surge in visitor numbers, prompting Ukrainian authorities to develop official tourist routes. Researchers suggest that visitor motivations are complex and rarely reducible to mere morbid curiosity.',
    highlightWords: ['atrocity', 'commemorative', 'trivialising', 'morbid', 'surge'],
    vocabulary: { atrocity: 'зверство', commemorative: 'памятный', trivialising: 'тривиализирующий', morbid: 'болезненный', surge: 'резкий рост' },
    questions: [
      { question: 'What is dark tourism?', options: ['Night-time sightseeing', 'Travel to dangerous countries', 'Travel to sites of death or tragedy', 'Budget travel in dark regions'], answer: 'Travel to sites of death or tragedy' },
      { question: 'What argument do proponents make?', options: ['It is profitable', 'It serves educational and commemorative purposes', 'It is exciting', 'It creates jobs'], answer: 'It serves educational and commemorative purposes' },
      { question: 'What triggered a surge in Chernobyl visitors?', options: ['A new documentary', 'A Netflix series', 'A travel website', 'A government campaign'], answer: 'A Netflix series' },
    ],
  },

  // ── C1 (5) ──
  {
    id: 'r-c1-1', level: 'C1', title: 'The Attention Economy and Democratic Discourse',
    text: 'The commodification of attention by digital platforms has generated externalities that extend well beyond individual wellbeing into the fabric of democratic society. By optimising for engagement rather than accuracy or deliberation, recommendation algorithms systematically amplify outrage, tribalism, and polarisation — qualities that keep users scrolling but corrode the epistemic conditions necessary for meaningful civic participation. Cass Sunstein\'s concept of the "echo chamber", in which individuals are exposed exclusively to information confirming prior beliefs, has gained empirical traction, though subsequent research suggests the phenomenon is more nuanced than initially hypothesised. The central normative question is whether the architecture of information environments constitutes a legitimate subject of democratic governance or whether such regulation inevitably imperils free expression.',
    highlightWords: ['commodification', 'externalities', 'tribalism', 'epistemic', 'normative'],
    vocabulary: { commodification: 'коммодификация', externalities: 'внешние эффекты', tribalism: 'трибализм', epistemic: 'эпистемический', normative: 'нормативный' },
    questions: [
      { question: 'What do recommendation algorithms optimise for?', options: ['Accuracy and deliberation', 'User education', 'Engagement', 'Democratic participation'], answer: 'Engagement' },
      { question: 'What does Sunstein\'s "echo chamber" concept describe?', options: ['Loud online arguments', 'Exposure only to confirming information', 'Government censorship', 'Social media addiction'], answer: 'Exposure only to confirming information' },
      { question: 'What is the central normative question raised?', options: ['How to increase engagement', 'Whether to ban social media', 'Whether to regulate information environments democratically', 'How to improve algorithms'], answer: 'Whether to regulate information environments democratically' },
    ],
  },
  {
    id: 'r-c1-2', level: 'C1', title: 'Posthumanism and the Body',
    text: 'Posthumanist philosophy challenges the Enlightenment conception of a stable, bounded human subject by interrogating the boundary between the natural and the technological. As prosthetics become increasingly sophisticated, as neural interfaces like Neuralink move from science fiction to clinical trial, and as genetic engineering opens the prospect of heritable enhancement, the category of "the human" becomes philosophically unstable. Donna Haraway\'s "A Cyborg Manifesto" argued provocatively that the breakdown of boundaries between organism and machine need not be mourned as a loss of essence but embraced as a liberatory possibility. Critics, including bioethicists and disability scholars, warn that enhancement technologies risk deepening inequalities and encoding existing social hierarchies into the biological.',
    highlightWords: ['interrogating', 'heritable', 'enhancement', 'hierarchies', 'liberatory'],
    vocabulary: { interrogating: 'ставить под сомнение', heritable: 'передаваемый по наследству', enhancement: 'улучшение', hierarchies: 'иерархии', liberatory: 'освобождающий' },
    questions: [
      { question: 'What does posthumanist philosophy challenge?', options: ['Scientific progress', 'The stable conception of the human subject', 'Technological development', 'Environmental ethics'], answer: 'The stable conception of the human subject' },
      { question: 'How does Haraway view the breakdown of human-machine boundaries?', options: ['As a catastrophe', 'As inevitable', 'As a liberatory possibility', 'As morally wrong'], answer: 'As a liberatory possibility' },
      { question: 'What do critics warn about enhancement technologies?', options: ['They are scientifically unsound', 'They risk deepening inequalities', 'They are too expensive', 'They are philosophically trivial'], answer: 'They risk deepening inequalities' },
    ],
  },
  {
    id: 'r-c1-3', level: 'C1', title: 'The Rule of Law Under Strain',
    text: 'Liberal democracies depend not merely on formal legal codes but on a set of informal norms, institutions, and shared understandings that constitute the rule of law. Political scientists have observed with growing alarm a phenomenon they term "democratic backsliding" — the incremental erosion of these norms through mechanisms that are individually legal but cumulatively corrosive: the packing of courts with partisan judges, the delegitimisation of independent media, the weaponisation of anti-corruption laws against political opponents. Unlike the dramatic coups of the twentieth century, this form of democratic decay is frequently invisible to populations until it is well advanced. The challenge for constitutional designers is creating systems robust enough to withstand not only overt authoritarianism but the subtler forms of institutional capture.',
    highlightWords: ['erosion', 'corrosive', 'delegitimisation', 'backsliding', 'authoritarianism'],
    vocabulary: { erosion: 'эрозия', corrosive: 'разрушительный', delegitimisation: 'делегитимизация', backsliding: 'откат', authoritarianism: 'авторитаризм' },
    questions: [
      { question: 'What do political scientists call the incremental erosion of democratic norms?', options: ['Constitutional crisis', 'Democratic backsliding', 'Institutional capture', 'Political polarisation'], answer: 'Democratic backsliding' },
      { question: 'What makes this form of decay particularly dangerous?', options: ['It happens very quickly', 'It involves military force', 'It is often invisible until advanced', 'It targets only media'], answer: 'It is often invisible until advanced' },
      { question: 'What challenge do constitutional designers face?', options: ['Writing clear laws', 'Creating systems resistant to subtle institutional capture', 'Improving voter turnout', 'Reducing political polarisation'], answer: 'Creating systems resistant to subtle institutional capture' },
    ],
  },
  {
    id: 'r-c1-4', level: 'C1', title: 'Quantum Computing: Promise and Peril',
    text: 'Classical computers store information as bits — binary units of zero or one. Quantum computers exploit the principles of superposition and entanglement to process qubits, which can represent zero and one simultaneously, enabling certain calculations to be performed exponentially faster. The implications are transformative: quantum computers could simulate molecular interactions with unprecedented precision, revolutionising drug discovery; they could optimise logistics networks in ways classical systems cannot approach; they could break the encryption standards that currently protect financial transactions, communications, and state secrets. This last capability has prompted governments and cybersecurity experts to begin the transition to post-quantum cryptography, though the timeline for quantum supremacy in cryptographic attacks remains contested.',
    highlightWords: ['superposition', 'entanglement', 'exponentially', 'cryptography', 'supremacy'],
    vocabulary: { superposition: 'суперпозиция', entanglement: 'квантовая запутанность', exponentially: 'экспоненциально', cryptography: 'криптография', supremacy: 'превосходство' },
    questions: [
      { question: 'What allows qubits to be more powerful than bits?', options: ['Higher processing speed', 'Superposition — representing 0 and 1 simultaneously', 'Larger memory capacity', 'Better cooling systems'], answer: 'Superposition — representing 0 and 1 simultaneously' },
      { question: 'What security risk do quantum computers pose?', options: ['Hacking user passwords directly', 'Breaking current encryption standards', 'Spreading computer viruses', 'Crashing financial markets'], answer: 'Breaking current encryption standards' },
      { question: 'What are governments transitioning to in response?', options: ['Banning quantum research', 'Increasing classical computing', 'Post-quantum cryptography', 'Digital currencies'], answer: 'Post-quantum cryptography' },
    ],
  },
  {
    id: 'r-c1-5', level: 'C1', title: 'The Moral Philosophy of Effective Altruism',
    text: 'Effective altruism (EA) is a philosophical and social movement that applies evidence and rigorous analysis to the question of how to do the most good in the world. Drawing on utilitarian ethics, EA argues that we have strong moral obligations to improve the wellbeing of others, irrespective of geographical or relational proximity. This leads to counterintuitive conclusions: donating to a deworming programme in sub-Saharan Africa may save far more lives per dollar than funding a local hospice, making the former more "effective" by EA metrics. Critics argue that EA is overly quantitative, neglects structural causes of poverty and injustice, and can serve as a convenient rationalisation for the ultra-wealthy to perform charitable acts without addressing systemic inequalities. The movement has also been embroiled in controversy following high-profile cases of alleged misconduct among prominent adherents.',
    highlightWords: ['utilitarian', 'irrespective', 'counterintuitive', 'rationalisation', 'systemic'],
    vocabulary: { utilitarian: 'утилитарный', irrespective: 'независимо от', counterintuitive: 'контринтуитивный', rationalisation: 'рационализация', systemic: 'системный' },
    questions: [
      { question: 'What ethical tradition does EA draw on?', options: ['Virtue ethics', 'Deontology', 'Utilitarianism', 'Natural law'], answer: 'Utilitarianism' },
      { question: 'What does EA say about geographical proximity in moral decisions?', options: ['Proximity makes obligations stronger', 'Proximity is irrelevant to moral obligation', 'Local causes should always be prioritised', 'Distance makes giving less valuable'], answer: 'Proximity is irrelevant to moral obligation' },
      { question: 'What is one key criticism of EA?', options: ['It is too focused on local causes', 'It is overly quantitative and neglects structural causes', 'It ignores scientific evidence', 'It only helps wealthy countries'], answer: 'It is overly quantitative and neglects structural causes' },
    ],
  },
]

export function getReadingTexts(level: string, count: number = 2): ReadingText[] {
  const filtered = READING_POOL.filter(t => t.level === level)
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
