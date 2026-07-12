export interface ListeningText {
  id: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  title: string
  text: string
  questions: { question: string; options: string[]; answer: string }[]
}

export const LISTENING_POOL: ListeningText[] = [
  // ── A1 (5) ──
  {
    id: 'l-a1-1', level: 'A1', title: 'At the Café',
    text: 'Tom: Hello! Can I have a coffee, please?\nWaiter: Of course. Milk and sugar?\nTom: Just milk, thank you. How much is it?\nWaiter: It\'s two pounds fifty.\nTom: Here you are. Thank you!\nWaiter: You\'re welcome. Enjoy your coffee!',
    questions: [
      { question: 'What does Tom order?', options: ['Tea', 'Coffee', 'Juice', 'Water'], answer: 'Coffee' },
      { question: 'What does Tom want in his drink?', options: ['Sugar', 'Milk', 'Nothing', 'Both'], answer: 'Milk' },
      { question: 'How much does the drink cost?', options: ['£1.50', '£2.00', '£2.50', '£3.00'], answer: '£2.50' },
    ],
  },
  {
    id: 'l-a1-2', level: 'A1', title: 'My Family',
    text: 'Hi! My name is Emma. I am ten years old. I have a big family. My mother is a teacher. My father is a doctor. I have one brother. His name is Sam. He is seven. We have a dog. His name is Max. We are very happy!',
    questions: [
      { question: 'How old is Emma?', options: ['Seven', 'Eight', 'Ten', 'Twelve'], answer: 'Ten' },
      { question: 'What is Emma\'s mother\'s job?', options: ['Doctor', 'Teacher', 'Nurse', 'Driver'], answer: 'Teacher' },
      { question: 'What pet does the family have?', options: ['Cat', 'Bird', 'Dog', 'Fish'], answer: 'Dog' },
    ],
  },
  {
    id: 'l-a1-3', level: 'A1', title: 'The Weather Today',
    text: 'It is Monday morning. The weather is cold and cloudy. It is raining outside. Anna is at home. She is wearing a warm jumper and jeans. She wants to go to the park, but she cannot. She is watching TV and drinking hot tea.',
    questions: [
      { question: 'What day is it?', options: ['Sunday', 'Saturday', 'Monday', 'Friday'], answer: 'Monday' },
      { question: 'What is the weather like?', options: ['Hot and sunny', 'Cold and cloudy', 'Warm and windy', 'Cold and snowy'], answer: 'Cold and cloudy' },
      { question: 'What is Anna doing?', options: ['Reading a book', 'Sleeping', 'Watching TV', 'Cooking'], answer: 'Watching TV' },
    ],
  },
  {
    id: 'l-a1-4', level: 'A1', title: 'At the Supermarket',
    text: 'Maria is at the supermarket. She needs bread, milk, and apples. The bread is on the second shelf. The milk is near the door. The apples are in the fruit section. Maria pays fifteen pounds at the checkout. She is very happy with her shopping.',
    questions: [
      { question: 'Where is the milk?', options: ['On the second shelf', 'Near the door', 'In the fruit section', 'At the checkout'], answer: 'Near the door' },
      { question: 'How much does Maria pay?', options: ['£10', '£12', '£15', '£20'], answer: '£15' },
      { question: 'Which of these does Maria NOT buy?', options: ['Bread', 'Milk', 'Apples', 'Oranges'], answer: 'Oranges' },
    ],
  },
  {
    id: 'l-a1-5', level: 'A1', title: 'My Daily Routine',
    text: 'My name is Jake. I wake up at seven o\'clock every morning. I have breakfast at half past seven. I go to school at eight. School finishes at three o\'clock in the afternoon. After school I play football with my friends. At nine o\'clock I go to bed.',
    questions: [
      { question: 'What time does Jake wake up?', options: ['6:00', '7:00', '7:30', '8:00'], answer: '7:00' },
      { question: 'What does Jake do after school?', options: ['Reads books', 'Watches TV', 'Plays football', 'Studies'], answer: 'Plays football' },
      { question: 'What time does Jake go to bed?', options: ['8:00', '9:00', '10:00', '9:30'], answer: '9:00' },
    ],
  },

  // ── A2 (5) ──
  {
    id: 'l-a2-1', level: 'A2', title: 'Planning a Holiday',
    text: 'Sarah: I\'d like to book a holiday. Where do you recommend?\nAgent: How about Spain? The weather is lovely in July.\nSarah: Sounds great! How long are the flights?\nAgent: About two and a half hours from London.\nSarah: And what\'s the price for two adults, one week?\nAgent: We have a special offer — eight hundred pounds per person, including the hotel.\nSarah: That\'s a bit expensive. Do you have anything cheaper?\nAgent: I can offer you a four-star hotel for six hundred and fifty per person.',
    questions: [
      { question: 'Where does the agent recommend?', options: ['France', 'Italy', 'Spain', 'Portugal'], answer: 'Spain' },
      { question: 'How long is the flight?', options: ['1 hour', '2 hours', '2.5 hours', '3 hours'], answer: '2.5 hours' },
      { question: 'What is the cheaper hotel option per person?', options: ['£600', '£650', '£700', '£800'], answer: '£650' },
    ],
  },
  {
    id: 'l-a2-2', level: 'A2', title: 'A Phone Call',
    text: 'Mike left his phone at a restaurant yesterday evening. He called the restaurant this morning. The manager said they found a black phone near table seven. Mike was relieved. He asked if he could collect it today. The manager said yes, but only after twelve o\'clock because they were cleaning in the morning.',
    questions: [
      { question: 'Where did Mike leave his phone?', options: ['At a shop', 'At a restaurant', 'At school', 'At the cinema'], answer: 'At a restaurant' },
      { question: 'What colour is Mike\'s phone?', options: ['White', 'Silver', 'Black', 'Blue'], answer: 'Black' },
      { question: 'When can Mike collect his phone?', options: ['In the morning', 'Before 12:00', 'After 12:00', 'The next day'], answer: 'After 12:00' },
    ],
  },
  {
    id: 'l-a2-3', level: 'A2', title: 'Learning to Cook',
    text: 'Last Saturday, Clara decided to cook dinner for her family for the first time. She wanted to make pasta. She watched a video online and bought the ingredients at the supermarket. She spent two hours in the kitchen. The pasta was a little salty, but her family said it was delicious. Clara was proud of herself and decided to cook every Sunday.',
    questions: [
      { question: 'What day did Clara cook?', options: ['Friday', 'Sunday', 'Saturday', 'Monday'], answer: 'Saturday' },
      { question: 'What did Clara cook?', options: ['Pizza', 'Soup', 'Pasta', 'Rice'], answer: 'Pasta' },
      { question: 'How did her family react?', options: ['They were unhappy', 'They said it was too salty', 'They said it was delicious', 'They didn\'t eat it'], answer: 'They said it was delicious' },
    ],
  },
  {
    id: 'l-a2-4', level: 'A2', title: 'Job Interview',
    text: 'Anna had a job interview yesterday at a marketing company. She arrived ten minutes early. The interviewer asked about her previous experience and why she wanted the job. Anna said she had worked at a small agency for two years and was looking for new challenges. The interviewer seemed impressed. Anna will find out the result next week.',
    questions: [
      { question: 'What kind of company was the interview at?', options: ['Design', 'Technology', 'Marketing', 'Finance'], answer: 'Marketing' },
      { question: 'How long had Anna worked at her previous job?', options: ['One year', 'Two years', 'Three years', 'Six months'], answer: 'Two years' },
      { question: 'When will Anna know the result?', options: ['Today', 'Tomorrow', 'Next week', 'Next month'], answer: 'Next week' },
    ],
  },
  {
    id: 'l-a2-5', level: 'A2', title: 'The New Neighbour',
    text: 'A new family moved into our street last week. They have two children, a boy and a girl. The parents are both teachers. Yesterday they knocked on our door and introduced themselves. Their names are David and Lisa. They seem very friendly. My mum invited them for dinner on Friday. I am excited to meet the children.',
    questions: [
      { question: 'How many children does the new family have?', options: ['One', 'Two', 'Three', 'Four'], answer: 'Two' },
      { question: 'What do the parents do for work?', options: ['Doctors', 'Engineers', 'Teachers', 'Lawyers'], answer: 'Teachers' },
      { question: 'When is the dinner invitation for?', options: ['Thursday', 'Friday', 'Saturday', 'Sunday'], answer: 'Friday' },
    ],
  },

  // ── B1 (5) ──
  {
    id: 'l-b1-1', level: 'B1', title: 'The Sharing Economy',
    text: 'In recent years, the sharing economy has transformed the way people travel and work. Platforms like Airbnb allow homeowners to rent out spare rooms, while apps like Uber connect drivers with passengers. Supporters argue that these services are more affordable and flexible than traditional options. Critics, however, point out that workers in the gig economy often lack job security and benefits. Governments around the world are now trying to regulate these industries without stifling innovation.',
    questions: [
      { question: 'What does Airbnb allow people to do?', options: ['Book flights', 'Rent out rooms', 'Share cars', 'Find jobs'], answer: 'Rent out rooms' },
      { question: 'What do critics say about gig economy workers?', options: ['They earn too much', 'They work too few hours', 'They lack security and benefits', 'They are highly skilled'], answer: 'They lack security and benefits' },
      { question: 'What are governments trying to do?', options: ['Ban sharing platforms', 'Regulate without stifling innovation', 'Promote traditional taxis', 'Increase house prices'], answer: 'Regulate without stifling innovation' },
    ],
  },
  {
    id: 'l-b1-2', level: 'B1', title: 'A Career Change',
    text: 'At the age of 35, Daniel decided to leave his well-paid banking job to become a primary school teacher. His friends and family thought he was making a huge mistake. However, Daniel had always been passionate about education. He spent a year retraining and qualified as a teacher last summer. Although he earns less money now, he says he has never been happier. He feels that his work makes a real difference to children\'s lives.',
    questions: [
      { question: 'What was Daniel\'s previous job?', options: ['Lawyer', 'Doctor', 'Banker', 'Engineer'], answer: 'Banker' },
      { question: 'How long did his retraining take?', options: ['Six months', 'One year', 'Two years', 'Three years'], answer: 'One year' },
      { question: 'How does Daniel feel about his new career?', options: ['Regretful', 'Uncertain', 'Very happy', 'Disappointed'], answer: 'Very happy' },
    ],
  },
  {
    id: 'l-b1-3', level: 'B1', title: 'Sleep and Health',
    text: 'Scientists have long known that sleep is essential for good health, but recent research suggests the connection is even stronger than previously thought. Adults who regularly sleep fewer than six hours a night are more likely to develop heart disease, diabetes, and depression. During sleep, the brain clears toxins that build up during the day. Experts recommend between seven and nine hours per night for most adults. Despite this, millions of people worldwide report difficulty sleeping, often due to stress and excessive screen time.',
    questions: [
      { question: 'What happens in the brain during sleep?', options: ['It creates new memories', 'It clears toxins', 'It processes emotions', 'It grows new cells'], answer: 'It clears toxins' },
      { question: 'How much sleep do experts recommend for adults?', options: ['5-6 hours', '6-7 hours', '7-9 hours', '9-10 hours'], answer: '7-9 hours' },
      { question: 'What is a common cause of sleep difficulty?', options: ['Exercise', 'Good diet', 'Stress and screen time', 'Fresh air'], answer: 'Stress and screen time' },
    ],
  },
  {
    id: 'l-b1-4', level: 'B1', title: 'Urban Farming',
    text: 'Growing food in cities is becoming increasingly popular. Urban farms can be found on rooftops, in converted warehouses, and even underground. These spaces use innovative techniques such as hydroponics, which grows plants in water without soil, and vertical farming, which stacks crops in layers to save space. Supporters say urban farming reduces food miles, creates local jobs, and can provide fresh produce in areas where supermarkets are far away. However, setting up these farms requires significant investment and expertise.',
    questions: [
      { question: 'What is hydroponics?', options: ['Growing plants on rooftops', 'Growing plants without soil', 'Growing crops underground', 'Stacking crops in layers'], answer: 'Growing plants without soil' },
      { question: 'What is one benefit of urban farming mentioned?', options: ['It is always cheaper', 'It reduces food miles', 'It requires no investment', 'It replaces supermarkets'], answer: 'It reduces food miles' },
      { question: 'What challenge does urban farming face?', options: ['Lack of sunlight', 'Water shortages', 'High investment needed', 'Government bans'], answer: 'High investment needed' },
    ],
  },
  {
    id: 'l-b1-5', level: 'B1', title: 'A Gap Year',
    text: 'More and more young people are choosing to take a gap year between school and university. During this time, they might travel, volunteer, or work to save money. Proponents argue that a gap year helps students develop independence, life skills, and a clearer sense of what they want to study. Some universities actually encourage it. Critics worry that students lose momentum and find it harder to return to academic study. Research suggests that gap year students often perform slightly better at university than those who went straight from school.',
    questions: [
      { question: 'What do some students do during a gap year?', options: ['Repeat exams', 'Travel or volunteer', 'Start university early', 'Study online'], answer: 'Travel or volunteer' },
      { question: 'What do critics worry about?', options: ['High costs', 'Losing academic momentum', 'Not finding work', 'Poor health'], answer: 'Losing academic momentum' },
      { question: 'What does research suggest about gap year students?', options: ['They fail more', 'They perform slightly better at university', 'They take longer to graduate', 'They change their subject'], answer: 'They perform slightly better at university' },
    ],
  },

  // ── B2 (5) ──
  {
    id: 'l-b2-1', level: 'B2', title: 'The Psychology of Habit Formation',
    text: 'Habits are formed through a neurological loop consisting of three elements: a cue, a routine, and a reward. When a behaviour is repeated consistently in response to a cue, the brain gradually automates it, reducing cognitive load. This is why habits are so persistent — even when we consciously decide to change, the neural pathways remain. Research by Phillippa Lally at University College London found that forming a new habit takes an average of 66 days, not the commonly cited 21. The most effective strategy for breaking bad habits is replacing the routine while keeping the cue and reward intact.',
    questions: [
      { question: 'What are the three elements of the habit loop?', options: ['Goal, action, result', 'Cue, routine, reward', 'Trigger, behaviour, consequence', 'Thought, action, feeling'], answer: 'Cue, routine, reward' },
      { question: 'How many days does research say it takes to form a habit?', options: ['21', '30', '66', '90'], answer: '66' },
      { question: 'What is the best strategy for breaking bad habits according to the text?', options: ['Removing the cue', 'Replacing the routine', 'Eliminating the reward', 'Starting fresh'], answer: 'Replacing the routine' },
    ],
  },
  {
    id: 'l-b2-2', level: 'B2', title: 'Remote Work: A Permanent Shift?',
    text: 'The COVID-19 pandemic forced millions of employees to work from home almost overnight, triggering what many economists describe as the most significant shift in working patterns since the Industrial Revolution. While productivity studies have yielded mixed results, surveys consistently show that the majority of knowledge workers prefer hybrid arrangements. Companies that mandate full-time office return have faced increased staff turnover, particularly among high performers who have multiple job offers. However, critics argue that remote work disadvantages younger employees who lack the mentorship and spontaneous collaboration that office environments provide.',
    questions: [
      { question: 'What event triggered the shift to remote work?', options: ['The financial crisis', 'Industrial Revolution', 'COVID-19 pandemic', 'A government policy'], answer: 'COVID-19 pandemic' },
      { question: 'What happens at companies that demand full office return?', options: ['Productivity increases', 'Staff turnover increases', 'Employee satisfaction rises', 'Costs decrease'], answer: 'Staff turnover increases' },
      { question: 'Who may be disadvantaged by remote work?', options: ['Senior managers', 'Older employees', 'Younger employees', 'Part-time workers'], answer: 'Younger employees' },
    ],
  },
  {
    id: 'l-b2-3', level: 'B2', title: 'Rewilding Britain',
    text: 'Rewilding — the large-scale restoration of ecosystems — is gaining momentum across Britain. Advocates propose reintroducing species such as beavers, lynx, and even wolves to restore ecological balance. Beavers, already reintroduced in several river systems, have proven remarkably effective at flood management, creating wetland habitats and improving water quality. The lynx proposal is more contentious; farmers fear for their livestock, while ecologists argue the cats would control deer populations that are currently devastating native woodland. The debate highlights the tension between conservation ambitions and the economic interests of rural communities.',
    questions: [
      { question: 'What have beavers proven effective at?', options: ['Controlling deer', 'Flood management', 'Reducing pollution', 'Replanting trees'], answer: 'Flood management' },
      { question: 'Why do farmers oppose reintroducing lynx?', options: ['They damage crops', 'They fear for their livestock', 'They destroy rivers', 'They spread disease'], answer: 'They fear for their livestock' },
      { question: 'What tension does the debate highlight?', options: ['Urban vs rural', 'Conservation vs economic interests', 'Science vs government', 'Tourism vs farming'], answer: 'Conservation vs economic interests' },
    ],
  },
  {
    id: 'l-b2-4', level: 'B2', title: 'Algorithmic Bias',
    text: 'As artificial intelligence becomes embedded in decision-making across sectors from recruitment to criminal justice, concerns about algorithmic bias have intensified. Algorithms trained on historical data can perpetuate and amplify existing inequalities; a hiring algorithm trained on a company\'s past appointments may systematically disadvantage women or minority candidates simply because they were historically underrepresented. A landmark 2019 study found a widely-used healthcare algorithm was less likely to recommend Black patients for additional care, despite them being sicker than white patients who received the same score. Regulators are now demanding greater transparency and accountability from developers of high-stakes AI systems.',
    questions: [
      { question: 'Why can algorithms perpetuate inequality?', options: ['They are programmed to discriminate', 'They are trained on historical data', 'They are controlled by biased humans', 'They ignore certain languages'], answer: 'They are trained on historical data' },
      { question: 'What did the 2019 healthcare study find?', options: ['AI was more accurate than doctors', 'Black patients were less likely to be recommended additional care', 'White patients received less care', 'Algorithms improved health outcomes'], answer: 'Black patients were less likely to be recommended additional care' },
      { question: 'What are regulators demanding?', options: ['Banning AI in healthcare', 'Greater transparency and accountability', 'Slower AI development', 'More diverse training teams'], answer: 'Greater transparency and accountability' },
    ],
  },
  {
    id: 'l-b2-5', level: 'B2', title: 'The Four-Day Work Week',
    text: 'A growing number of companies worldwide are trialling a four-day work week without cutting pay, based on the premise that productivity depends more on focus than hours. Iceland ran the largest trial between 2015 and 2019, involving thousands of public sector workers. The results were overwhelmingly positive: productivity remained stable or improved, while employee wellbeing, work-life balance, and sick leave rates all improved significantly. Critics caution that the model works better in some industries than others — it is easier to implement in office environments than in hospitality or healthcare, where round-the-clock coverage is essential.',
    questions: [
      { question: 'What country ran the largest four-day week trial?', options: ['UK', 'Norway', 'Iceland', 'Sweden'], answer: 'Iceland' },
      { question: 'What happened to productivity during the trial?', options: ['It fell significantly', 'It stayed the same or improved', 'It was not measured', 'It declined slightly'], answer: 'It stayed the same or improved' },
      { question: 'Where is the four-day week harder to implement?', options: ['Law firms', 'Tech companies', 'Hospitality and healthcare', 'Finance'], answer: 'Hospitality and healthcare' },
    ],
  },

  // ── C1 (5) ──
  {
    id: 'l-c1-1', level: 'C1', title: 'The Epistemology of Fake News',
    text: 'The proliferation of misinformation in digital environments raises profound questions about the nature of knowledge and epistemic authority. Unlike traditional gatekeeping models, in which credentialed experts and editorial processes filtered information, social media platforms prioritise engagement over accuracy, creating what researchers term "epistemic bubbles" — environments where users are exposed exclusively to information that confirms their existing beliefs. The problem is compounded by the fact that emotionally charged content spreads significantly faster than factual corrections. Some philosophers argue that the solution lies not in greater censorship but in fostering epistemic virtues — intellectual humility, curiosity, and the disposition to revise beliefs in the light of evidence.',
    questions: [
      { question: 'What do social media platforms prioritise over accuracy?', options: ['Speed', 'Safety', 'Engagement', 'Revenue'], answer: 'Engagement' },
      { question: 'What is an "epistemic bubble"?', options: ['A fact-checking tool', 'An environment confirming existing beliefs', 'A type of misinformation', 'A philosophical concept'], answer: 'An environment confirming existing beliefs' },
      { question: 'What do some philosophers propose as a solution?', options: ['Greater censorship', 'Banning social media', 'Fostering epistemic virtues', 'Returning to print media'], answer: 'Fostering epistemic virtues' },
    ],
  },
  {
    id: 'l-c1-2', level: 'C1', title: 'Neuroplasticity and Identity',
    text: 'The discovery that the adult brain retains significant plasticity — the capacity to reorganise its structure and function in response to experience — has profound implications for our understanding of identity and selfhood. For centuries, Western philosophy operated on the assumption that the self is a fixed essence. Contemporary neuroscience challenges this: the neural correlates of our personality, values, and memories are in a state of perpetual, if gradual, flux. This has practical implications for psychotherapy; interventions such as cognitive behavioural therapy are effective partly because they physically alter neural pathways. It also raises thorny ethical questions about the boundaries of moral responsibility if our behaviour is subject to biological change.',
    questions: [
      { question: 'What has neuroscience challenged?', options: ['The existence of consciousness', 'The idea of a fixed self', 'The effectiveness of therapy', 'The role of genetics'], answer: 'The idea of a fixed self' },
      { question: 'Why is CBT effective according to the text?', options: ['It changes behaviour quickly', 'It physically alters neural pathways', 'It helps people understand their past', 'It improves emotional intelligence'], answer: 'It physically alters neural pathways' },
      { question: 'What ethical question does neuroplasticity raise?', options: ['Whether therapy is necessary', 'Boundaries of moral responsibility', 'Funding for neuroscience', 'Privacy of brain data'], answer: 'Boundaries of moral responsibility' },
    ],
  },
  {
    id: 'l-c1-3', level: 'C1', title: 'The Economics of Attention',
    text: 'In an age of information abundance, scarcity has migrated from content to attention. Economists such as Herbert Simon were among the first to recognise that in an information-rich world, the wealth of information creates a poverty of attention. Social media companies have built trillion-dollar businesses by commodifying human attention, using sophisticated behavioural design — variable reward schedules, social validation loops, and infinite scroll — to maximise the time users spend on their platforms. Critics argue this constitutes a form of exploitation, particularly given growing evidence of links between heavy social media use and deteriorating mental health, especially among adolescents. Proposals for reform include data portability, stricter age verification, and algorithmic transparency requirements.',
    questions: [
      { question: 'What has become scarce in the modern world according to the text?', options: ['Information', 'Content', 'Attention', 'Technology'], answer: 'Attention' },
      { question: 'Which design mechanism is mentioned as keeping users on platforms?', options: ['Advertising', 'Variable reward schedules', 'Subscription models', 'News feeds'], answer: 'Variable reward schedules' },
      { question: 'What group is particularly affected by heavy social media use?', options: ['Elderly people', 'Politicians', 'Adolescents', 'Teachers'], answer: 'Adolescents' },
    ],
  },
  {
    id: 'l-c1-4', level: 'C1', title: 'Language and Thought',
    text: 'The Sapir-Whorf hypothesis, or linguistic relativity, posits that the language we speak shapes the way we perceive and think about the world. In its strong form — linguistic determinism — it holds that our thoughts are entirely constrained by our linguistic categories. While the strong version is widely rejected, the weaker hypothesis has gained empirical support. Research has shown, for instance, that speakers of languages with grammatical gender tend to attribute gender-specific qualities to objects, and that languages with different spatial reference systems influence the way speakers navigate and conceptualise space. These findings suggest that while language may not imprison thought, it does create pathways that make certain conceptual structures more cognitively accessible than others.',
    questions: [
      { question: 'What is the Sapir-Whorf hypothesis about?', options: ['How children learn language', 'Whether language shapes thought', 'The origins of grammar', 'Translation between languages'], answer: 'Whether language shapes thought' },
      { question: 'Which version of the hypothesis is widely rejected?', options: ['Linguistic relativity', 'Weak hypothesis', 'Linguistic determinism', 'Cultural relativity'], answer: 'Linguistic determinism' },
      { question: 'What do languages with grammatical gender affect?', options: ['Spatial navigation', 'Mathematical thinking', 'Qualities attributed to objects', 'Reading speed'], answer: 'Qualities attributed to objects' },
    ],
  },
  {
    id: 'l-c1-5', level: 'C1', title: 'Carbon Pricing Mechanisms',
    text: 'Carbon pricing — placing an explicit cost on greenhouse gas emissions — is widely regarded by economists as the most efficient mechanism for driving the transition to a low-carbon economy. Two principal models exist: a carbon tax, which sets a fixed price per tonne of emissions, and cap-and-trade systems, which establish an overall emissions ceiling and allow firms to buy and sell permits. Sweden\'s carbon tax, introduced in 1991 at around $30 per tonne and now exceeding $130, has successfully decoupled economic growth from emissions without damaging the economy. Critics, however, argue that carbon pricing is regressive — falling disproportionately on lower-income households — and that without dividend mechanisms, it lacks political sustainability.',
    questions: [
      { question: 'What does a cap-and-trade system do?', options: ['Sets a fixed price per tonne', 'Bans all carbon emissions', 'Allows firms to buy and sell permits', 'Taxes fuel directly'], answer: 'Allows firms to buy and sell permits' },
      { question: 'What has Sweden\'s carbon tax demonstrated?', options: ['Economic growth always falls', 'Growth can decouple from emissions', 'Carbon taxes are unpopular', 'Industry cannot adapt'], answer: 'Growth can decouple from emissions' },
      { question: 'Why do critics call carbon pricing regressive?', options: ['It harms large corporations', 'It costs too much to administer', 'It falls disproportionately on lower-income households', 'It does not reduce emissions'], answer: 'It falls disproportionately on lower-income households' },
    ],
  },
]

export function getListeningTexts(level: string, count: number = 3): ListeningText[] {
  const filtered = LISTENING_POOL.filter(t => t.level === level)
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
