import { ValidatorRule } from "../../types";

// Amount of characters allowed per sentence to keep recordings in a manageable duration.
const MIN_LENGTH = 1;
const MAX_LENGTH = 90;

const INVALIDATIONS: ValidatorRule[] = [{
  type: 'fn',
  fn: (sentence: string) => {
    return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH;
  },
  error: `toki sitelen ni li suli ike, li ken jo e sitelen lili pi mute ni taso: ${MIN_LENGTH}-${MAX_LENGTH}`,
}, {
  type: 'regex',
  regex: /[0-9]+/,
  error: 'nanpa o lon ala toki ni',
}, {
  type: 'regex',
  regex: /[<>+*#@%^[\]()/]/,
  error: 'sitelen nasa o lon ala toki ni',
}, {
  // capital letters at start of word only; no abbreviations
  type: 'regex',
  regex: /\w[A-Z]|[A-Z]\.[A-Z]/,
  error: 'sitelen suli li ken lon open nimi taso (ike: "jan AwiPota"; pona: "jan Awipota", "jan Awi Pota")',
},

// The following invalidations are to make all submissions conform to Toki Pona's
// phonotactics. Any words that don't follow the phonotactics would have ambiguous
// pronunciations, and some speakers might struggle pronouncing them.

{
  // No non-Toki-Pona letters
  type: 'regex',
  regex: /[BbCcDdFfGgHhQqRrVvXxYyZzÀ-ʯḀ-ỿ]/,
  error: 'o kepeken sitelen Lasina pi toki pona taso',
}, {
  // No consecutive vowels
  type: 'regex',
  regex: /[AaEeIiOoUu]{2,}/,
  error: 'sitelen "a e i o u" tu li ken ala lon poka',
}, {
  // No consecutive consonants (excluding N)
  type: 'regex',
  regex: /[JjKkLlMmPpSsTtWw]{2,}/,
  error: 'sitelen "j k l m p s t w" tu li ken ala lon poka',
}, {
  // No word-final consonants other than N
  type: 'regex',
  regex: /[JjKkLlMmPpSsTtWw]\b/,
  error: 'sitelen "j k l m p s t w" li ken ala lon pini nimi',
}, {
  // No N preceded by a consonant
  type: 'regex',
  regex: /[JjKkLlMmPpSsTtWw]n/,
  error: 'sitelen "j k l m p s t w" li ken ala lon poka open pi sitelen "n"',
}, {
  // No "nn" or "nm"
  type: 'regex',
  regex: /[Nn][mn]/,
  error: 'sitelen "nn" en sitelen "nm" li ken ala',
}, {
  // No word-initial "n + consonant" sequences
  type: 'regex',
  regex: /\b[Nn][jklmpstw]/,
  error: 'sitelen "n" li lon open nimi la sitelen "j k l m p s t w" li ken ala sitelen nanpa tu',
}, {
  // No invalid syllables
  type: 'regex',
  regex: /Wu|wu|Wo|wo|Ji|ji|Ti|ti/,
  error: 'sitelen "wu wo ji ti" li ken ala',
}];

export default INVALIDATIONS;
