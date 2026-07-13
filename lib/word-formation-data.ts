export interface Affix {
  id: string
  affix: string
  type: 'prefix' | 'suffix'
  meaning: string
  examples: { base: string; formed: string; translation: string }[]
  level: string
}

export const AFFIXES: Affix[] = [
  { id: 'un', affix: 'un-', type: 'prefix', meaning: 'не-, обратное действие', level: 'A2',
    examples: [
      { base: 'happy', formed: 'unhappy', translation: 'несчастный' },
      { base: 'do', formed: 'undo', translation: 'отменить' },
      { base: 'lock', formed: 'unlock', translation: 'открыть (замок)' },
      { base: 'comfortable', formed: 'uncomfortable', translation: 'некомфортный' },
      { base: 'expected', formed: 'unexpected', translation: 'неожиданный' },
    ]},
  { id: 're', affix: 're-', type: 'prefix', meaning: 'снова, повторно', level: 'A2',
    examples: [
      { base: 'do', formed: 'redo', translation: 'переделать' },
      { base: 'write', formed: 'rewrite', translation: 'переписать' },
      { base: 'start', formed: 'restart', translation: 'перезапустить' },
      { base: 'read', formed: 'reread', translation: 'перечитать' },
      { base: 'build', formed: 'rebuild', translation: 'перестроить' },
    ]},
  { id: 'dis', affix: 'dis-', type: 'prefix', meaning: 'не-, противоположное', level: 'B1',
    examples: [
      { base: 'agree', formed: 'disagree', translation: 'не соглашаться' },
      { base: 'honest', formed: 'dishonest', translation: 'нечестный' },
      { base: 'appear', formed: 'disappear', translation: 'исчезнуть' },
      { base: 'like', formed: 'dislike', translation: 'не нравиться' },
      { base: 'connect', formed: 'disconnect', translation: 'отключить' },
    ]},
  { id: 'mis', affix: 'mis-', type: 'prefix', meaning: 'неправильно', level: 'B1',
    examples: [
      { base: 'understand', formed: 'misunderstand', translation: 'неправильно понять' },
      { base: 'pronounce', formed: 'mispronounce', translation: 'неправильно произнести' },
      { base: 'spell', formed: 'misspell', translation: 'написать с ошибкой' },
      { base: 'lead', formed: 'mislead', translation: 'вводить в заблуждение' },
    ]},
  { id: 'over', affix: 'over-', type: 'prefix', meaning: 'слишком много, сверх', level: 'B1',
    examples: [
      { base: 'work', formed: 'overwork', translation: 'перерабатывать' },
      { base: 'sleep', formed: 'oversleep', translation: 'проспать' },
      { base: 'eat', formed: 'overeat', translation: 'переесть' },
      { base: 'estimate', formed: 'overestimate', translation: 'переоценивать' },
    ]},
  { id: 'pre', affix: 'pre-', type: 'prefix', meaning: 'до, заранее', level: 'B2',
    examples: [
      { base: 'view', formed: 'preview', translation: 'предварительный просмотр' },
      { base: 'heat', formed: 'preheat', translation: 'предварительно разогреть' },
      { base: 'historic', formed: 'prehistoric', translation: 'доисторический' },
      { base: 'paid', formed: 'prepaid', translation: 'предоплаченный' },
    ]},
  { id: 'tion', affix: '-tion / -sion', type: 'suffix', meaning: 'существительное от глагола', level: 'A2',
    examples: [
      { base: 'educate', formed: 'education', translation: 'образование' },
      { base: 'communicate', formed: 'communication', translation: 'общение' },
      { base: 'decide', formed: 'decision', translation: 'решение' },
      { base: 'discuss', formed: 'discussion', translation: 'обсуждение' },
      { base: 'produce', formed: 'production', translation: 'производство' },
    ]},
  { id: 'ness', affix: '-ness', type: 'suffix', meaning: 'существительное от прилагательного', level: 'B1',
    examples: [
      { base: 'happy', formed: 'happiness', translation: 'счастье' },
      { base: 'kind', formed: 'kindness', translation: 'доброта' },
      { base: 'dark', formed: 'darkness', translation: 'темнота' },
      { base: 'aware', formed: 'awareness', translation: 'осознанность' },
      { base: 'sad', formed: 'sadness', translation: 'грусть' },
    ]},
  { id: 'ly', affix: '-ly', type: 'suffix', meaning: 'наречие от прилагательного', level: 'A1',
    examples: [
      { base: 'quick', formed: 'quickly', translation: 'быстро' },
      { base: 'beautiful', formed: 'beautifully', translation: 'красиво' },
      { base: 'careful', formed: 'carefully', translation: 'осторожно' },
      { base: 'serious', formed: 'seriously', translation: 'серьёзно' },
      { base: 'complete', formed: 'completely', translation: 'полностью' },
    ]},
  { id: 'er', affix: '-er / -or', type: 'suffix', meaning: 'тот кто делает (деятель)', level: 'A1',
    examples: [
      { base: 'teach', formed: 'teacher', translation: 'учитель' },
      { base: 'write', formed: 'writer', translation: 'писатель' },
      { base: 'act', formed: 'actor', translation: 'актёр' },
      { base: 'manage', formed: 'manager', translation: 'менеджер' },
      { base: 'direct', formed: 'director', translation: 'директор' },
    ]},
  { id: 'ful', affix: '-ful', type: 'suffix', meaning: 'полный чего-то (прилагательное)', level: 'A2',
    examples: [
      { base: 'help', formed: 'helpful', translation: 'полезный' },
      { base: 'beauty', formed: 'beautiful', translation: 'красивый' },
      { base: 'care', formed: 'careful', translation: 'осторожный' },
      { base: 'power', formed: 'powerful', translation: 'мощный' },
      { base: 'success', formed: 'successful', translation: 'успешный' },
    ]},
  { id: 'less', affix: '-less', type: 'suffix', meaning: 'без чего-то (прилагательное)', level: 'B1',
    examples: [
      { base: 'help', formed: 'helpless', translation: 'беспомощный' },
      { base: 'care', formed: 'careless', translation: 'беспечный' },
      { base: 'home', formed: 'homeless', translation: 'бездомный' },
      { base: 'use', formed: 'useless', translation: 'бесполезный' },
      { base: 'end', formed: 'endless', translation: 'бесконечный' },
    ]},
]
