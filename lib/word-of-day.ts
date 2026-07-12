const WORDS_OF_DAY = [
  { word: 'serendipity', transcription: '/ˌserənˈdɪpɪti/', translation: 'счастливая случайность', example: 'Finding that book was pure serendipity.', level: 'C1' },
  { word: 'resilient', transcription: '/rɪˈzɪliənt/', translation: 'устойчивый, упругий', example: 'She is incredibly resilient in difficult times.', level: 'B2' },
  { word: 'eloquent', transcription: '/ˈeləkwənt/', translation: 'красноречивый', example: 'He gave an eloquent speech at the conference.', level: 'B2' },
  { word: 'mundane', transcription: '/mʌnˈdeɪn/', translation: 'обыденный, скучный', example: 'Even mundane tasks can become meaningful.', level: 'B2' },
  { word: 'ephemeral', transcription: '/ɪˈfemərəl/', translation: 'мимолётный, эфемерный', example: 'Fame can be ephemeral.', level: 'C1' },
  { word: 'meticulous', transcription: '/məˈtɪkjʊləs/', translation: 'тщательный, педантичный', example: 'She is meticulous about her work.', level: 'B2' },
  { word: 'prolific', transcription: '/prəˈlɪfɪk/', translation: 'плодовитый, продуктивный', example: 'He is a prolific writer with 30 novels.', level: 'C1' },
  { word: 'candid', transcription: '/ˈkændɪd/', translation: 'откровенный, прямой', example: 'I appreciate your candid feedback.', level: 'B1' },
  { word: 'eloquence', transcription: '/ˈeləkwəns/', translation: 'красноречие', example: 'Her eloquence won the debate.', level: 'B2' },
  { word: 'tenacious', transcription: '/tɪˈneɪʃəs/', translation: 'упорный, настойчивый', example: 'You need to be tenacious to succeed.', level: 'B2' },
  { word: 'ambiguous', transcription: '/æmˈbɪɡjuəs/', translation: 'неоднозначный', example: 'The instructions were ambiguous.', level: 'B1' },
  { word: 'frugal', transcription: '/ˈfruːɡəl/', translation: 'бережливый, экономный', example: 'Living a frugal lifestyle saves money.', level: 'B2' },
  { word: 'gregarious', transcription: '/ɡrɪˈɡeəriəs/', translation: 'общительный', example: 'She is gregarious and loves parties.', level: 'C1' },
  { word: 'nuance', transcription: '/ˈnjuːɑːns/', translation: 'нюанс, тонкость', example: 'The nuance in his tone was subtle.', level: 'B2' },
  { word: 'pragmatic', transcription: '/præɡˈmætɪk/', translation: 'прагматичный', example: 'We need a pragmatic solution.', level: 'B2' },
  { word: 'benevolent', transcription: '/bəˈnevələnt/', translation: 'доброжелательный', example: 'The benevolent donor helped thousands.', level: 'C1' },
  { word: 'intricate', transcription: '/ˈɪntrɪkət/', translation: 'сложный, запутанный', example: 'The design was incredibly intricate.', level: 'B2' },
  { word: 'diligent', transcription: '/ˈdɪlɪdʒənt/', translation: 'усердный, прилежный', example: 'Diligent students always improve.', level: 'B1' },
  { word: 'exacerbate', transcription: '/ɪɡˈzæsəbeɪt/', translation: 'усугублять', example: 'Stress can exacerbate health problems.', level: 'C1' },
  { word: 'versatile', transcription: '/ˈvɜːsətaɪl/', translation: 'разносторонний', example: 'She is a versatile performer.', level: 'B2' },
  { word: 'lucid', transcription: '/ˈluːsɪd/', translation: 'ясный, чёткий', example: 'His explanation was lucid and helpful.', level: 'B2' },
  { word: 'ostentatious', transcription: '/ˌɒstənˈteɪʃəs/', translation: 'показной, напыщенный', example: 'His ostentatious lifestyle drew attention.', level: 'C1' },
  { word: 'impeccable', transcription: '/ɪmˈpekəbl/', translation: 'безупречный', example: 'She has impeccable taste in fashion.', level: 'C1' },
  { word: 'persevere', transcription: '/ˌpɜːsɪˈvɪə/', translation: 'упорствовать, не сдаваться', example: 'You must persevere through challenges.', level: 'B1' },
  { word: 'alleviate', transcription: '/əˈliːvieɪt/', translation: 'облегчать, смягчать', example: 'This medicine will alleviate the pain.', level: 'B2' },
  { word: 'ubiquitous', transcription: '/juːˈbɪkwɪtəs/', translation: 'вездесущий', example: 'Smartphones are ubiquitous today.', level: 'C1' },
  { word: 'conundrum', transcription: '/kəˈnʌndrəm/', translation: 'головоломка, загадка', example: 'This is a real conundrum for the team.', level: 'C1' },
  { word: 'succinct', transcription: '/səkˈsɪŋkt/', translation: 'краткий, лаконичный', example: 'Please give a succinct answer.', level: 'B2' },
  { word: 'arduous', transcription: '/ˈɑːdjuəs/', translation: 'трудный, изнурительный', example: 'The climb was arduous but rewarding.', level: 'C1' },
  { word: 'obsolete', transcription: '/ˈɒbsəliːt/', translation: 'устаревший', example: 'Fax machines are now obsolete.', level: 'B2' },
]

export function getWordOfDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return WORDS_OF_DAY[dayOfYear % WORDS_OF_DAY.length]
}
