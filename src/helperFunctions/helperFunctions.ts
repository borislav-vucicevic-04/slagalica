import IAsocijacije from "../interfaces/asocijacije.interface";
import IDesnoLijevo from "../interfaces/desnoLijevo.interface";
import IGame from "../interfaces/game.interface";
import IMojBroj from "../interfaces/mojBroj.interface";
import IParovi from "../interfaces/parovi.interface";
import IPremetaljka from "../interfaces/premetaljka.interface";
import IPutOkoSvijeta from "../interfaces/putOkoSvijeta.interface";
import ISef from "../interfaces/sef.interface";
import ISlagalica from "../interfaces/slagalica.interface";
import ISpajalica from "../interfaces/spajalica.interface";
import IZid from "../interfaces/zid.interface";

/**
 * The `shuffleArray` function takes an array of any type and shuffles its elements randomly.
 * @param {T[]} array - The `array` parameter is an array of elements of type `T`.
 * @returns The `shuffleArray` function is returning a shuffled version of the input array. It first
 * maps each element of the array to an object containing the original value and a random sort value.
 * Then it sorts these objects based on the random sort value. Finally, it maps the sorted objects back
 * to their original values and returns the shuffled array.
 */
const shuffleArray = <T>(array: T[]): T[] => {
  return array
  .map((value: T) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
}
/**
 * The getRandomNumber function in TypeScript generates a random integer up to a specified maximum
 * value.
 * @param {number} maximum - The `maximum` parameter in the `getRandomNumber` function represents the
 * maximum value that the random number generated should not exceed.
 * @returns A random whole number between 0 (inclusive) and the specified maximum value (exclusive) is
 * being returned.
 */
const getRandomNumber = (maximum: number): number => {
  return Math.floor(Math.random() * maximum)
} 
/**
 * SLAGALICA: The function generates a random word by selecting from a list of Serbian words and filling in
 * missing characters with random letters from a predefined alphabet.
 * @returns An array of 12 characters,
 */
const generateSlagalica = () => {
  let returnState: ISlagalica = {computerWord: '', letters: []}
  let abc = "abcčćdđefghijklmnoprsštuvzž";
  let wordLength = 0;
  let probability = getRandomNumber(100);
  
  if(probability <= 10) wordLength = 8;
  else if(probability <= 22) wordLength = 9;
  else if(probability <= 41) wordLength = 10;
  else if(probability <= 60) wordLength = 11;
  else wordLength = 12;

  let words = (require('./../database/searbian-words-db.json') as string[]).filter(w => w.length === wordLength);
  
  returnState.computerWord = words[getRandomNumber(words.length)];
  returnState.letters = returnState.computerWord.split('')

  while(returnState.letters.length < 12) {
    returnState.letters.push(abc[getRandomNumber(abc.length)]);
  }

  returnState.letters = shuffleArray<string>(returnState.letters);

  return returnState
}
/**
 * The function `generateSpajalica` reads data from a JSON file, shuffles and organizes the data, and
 * returns a game object for a matching pairs game.
 */
const generateSpajalica = () => {
  let database = require('./../database/spajalica/spajalica.json') as {description: string, pairs: Array<Array<string>>}[];
  let spajalica = database[getRandomNumber(database.length)];
  let description = spajalica.description;
  let left: string []= [];
  let right: string []= [];
  let pairs: string []= [];

  spajalica.pairs.forEach((p) => {
    left.push(p[0]);
    right.push(p[1]);
    pairs.push(p.join('-'))
  })

  let game: ISpajalica = {
    description,
    left: shuffleArray(left),
    right: shuffleArray(right),
    pairs: shuffleArray(pairs),
  }

  return game;
}
/**
 * The function `generateDesnoLijevo` reads data from a JSON file, shuffles and pairs correct and
 * wrong answers, and returns a game state object for a Desno Lijevo game.
 * @returns The function `generateDesnoLijevo` returns an object of type `IDesnoLijevo` which contains
 * the properties `correct`, `wrong`, `pairs`, and `description`.
 */
const generateDesnoLijevo = () => {
  let database = require('./../database/desno-lijevo/desno-lijevo.json') as {description: string, correct: string[], wrong: string[]}[];
  let game = database[getRandomNumber(database.length)];
  let correct = shuffleArray(game.correct);
  let wrong = shuffleArray(game.wrong);
  let pairs: Array<Array<string>> = [];

  for(let i = 0; i < correct.length; i++) {
    pairs.push(shuffleArray([correct[i], wrong[i]]));
  }

  let returnState: IDesnoLijevo = {
    correct,
    wrong,
    pairs,
    description: game.description
  }
  return returnState
}
/**
 * The function generates a set of questions and answers along with a famous person and an image path
 * for a game called "Zid".
 * @returns An object containing an array of bricks (questions and answers), the name of a famous
 * person, and the image path of the famous person.
 */
const generateZid = () => {
  let pitanja = require('./../database/zid/pitanja.json') as {question: string, answers: string[], correctAnswer: string}[];
  let famousPeople = require('./../database/zid/poznate-licnosti.json') as {fullName: string, imageName: string}[];
  let fp = famousPeople[getRandomNumber(famousPeople.length)];
  let bricks: {question: string, answers: string[], correctAnswer: string}[] = [];
  let famousPerson: string = '';
  let imagePath: string = '';

  bricks = shuffleArray(pitanja).slice(0, 12).map((p) => {
    let b: {question: string, answers: string[], correctAnswer: string} ={
      question: p.question,
      correctAnswer: p.correctAnswer,
      answers: shuffleArray(p.answers)
    };
    return b;
  });
  famousPerson = fp.fullName;
  imagePath = require(`./../images/zid/${fp.imageName}`);

  let rs: IZid = {
    bricks,
    famousPerson,
    imagePath
  }

  return rs;
}
/**
 * The function `generateAsocijacije` reads a JSON file containing asocijacije data and returns a
 * random entry from the database.
 * @returns An object representing a random entry from the "asocijacije" database.
 */
const generateAsocijacije = () => {
  let database = require('./../database/asocijacije/asocijacije.json') as IAsocijacije[];
  return database[getRandomNumber(database.length)];
}
/**
 * The function `generatePremetaljka` generates a word puzzle by selecting random words from a database
 * based on specified word lengths and creating a shuffled array of letters from the selected words.
 * @returns The `generatePremetaljka` function returns an object of type `IPremetaljka` which contains
 * the following properties:
 * - `firstWord`: a string representing the first randomly selected word
 * - `secondWord`: a string representing the second randomly selected word
 * - `thirdWord`: a string representing the third randomly selected word
 * - `letters`: an array of strings representing the shuffled
 */
const generatePremetaljka = () => {
  const getTriad = () => {
    let arr: number[][] = [];
    for (let a = 5; a <= 10; a++) {
      for (let b = 5; b <= 10; b++) {
          let c = 25 - a - b;
          if (c >= 5 && c <= 10) {
            arr.push([a, b, c]);
          }
      }
    }
    return arr[getRandomNumber(arr.length)]
  }
  const db = {
    w5: new Array<string>(),
    w6: new Array<string>(),
    w7: new Array<string>(),
    w8: new Array<string>(),
    w9: new Array<string>(),
    w10: new Array<string>(),
  }
  let words: string[] = [];
  let allWords = (require('./../database/searbian-words-db.json') as string[]);
  let triad = getTriad();
  allWords.forEach(w => {
    switch(w.length) {
      case 5: db.w5.push(w); break;
      case 6: db.w6.push(w); break;
      case 7: db.w7.push(w); break;
      case 8: db.w8.push(w); break;
      case 9: db.w9.push(w); break;
      case 10: db.w10.push(w); break;
      default: break;
    }
  })

  while(words.length !== 3) {
    let length = triad[0];
    let w = '';

    switch(length) {
      case 5: w = db.w5[getRandomNumber(db.w5.length)]; break;
      case 6: w = db.w6[getRandomNumber(db.w6.length)]; break;
      case 7: w = db.w7[getRandomNumber(db.w7.length)]; break;
      case 8: w = db.w8[getRandomNumber(db.w8.length)]; break;
      case 9: w = db.w9[getRandomNumber(db.w9.length)]; break;
      case 10: w = db.w10[getRandomNumber(db.w10.length)]; break;
      default: break;
    }

    if(!words.includes(w)){ 
      words.push(w);
      triad.shift();
    };
  }
  let firstWord = words[0];
  let secondWord = words[1];
  let thirdWord = words[2];
  let letters = [shuffleArray(firstWord.split('')).join(''), shuffleArray(secondWord.split('')).join(''), shuffleArray(thirdWord.split('')).join('')].join('').split('')
  let rs: IPremetaljka = {
    firstWord,
    secondWord,
    thirdWord,
    letters
  }
  return rs
}
const generateParovi = () => {
  type t = 'bell' | 'clover' | 'clubs' | 'coin' | 'diamonds' | 'hearts' | 'spades' | 'star';
  let cards: Array<t> = [
    'bell','bell','clover','clover','clubs','clubs','coin','coin','diamonds','diamonds','hearts','hearts',
    'spades','spades','star','star'
  ]
  cards = shuffleArray<t>(shuffleArray<t>(shuffleArray<t>(cards)));
  let rs: IParovi = {
    cards
  }
  return rs;
}
/**
 * The function `generateMojBroj` generates a random "Moj Broj" game with a wanted number and a set of
 * given numbers.
 * @returns A function named `generateMojBroj` is being returned. This function generates an object
 * with a `wantedNumber` property set to a random number between 0 and 1000, and a `givenNumbers`
 * property set to an array containing 6 random numbers.
 */
const generateMojBroj = () => {
  return {
    wantedNumber: getRandomNumber(1000),
    givenNumbers: [
      getRandomNumber(9) + 1,
      getRandomNumber(9) + 1,
      getRandomNumber(9) + 1,
      getRandomNumber(9) + 1,
      (getRandomNumber(10) + 1) * 10,
      (getRandomNumber(4) + 1) * 25,
    ]
  } as IMojBroj
}
/**
 * The function `generatePutOkoSvijeta` generates a quiz game with flags and country names from a
 * database.
 * @returns An array of objects representing a quiz game for the "Put Oko Svijeta" game. Each object
 * contains a flag image, a country name, and an array of options for the player to choose from.
 */
const generatePutOkoSvijeta = () => {
  const numberOfCountries = 10;
  const database = [...(require('./../database/put-oko-svijeta/put-oko-svijeta.json') as {abbreviation: string, fullName: string}[])];
  let game: IPutOkoSvijeta[] = [];

  while(game.length < numberOfCountries) {
    let correctIndex = getRandomNumber(database.length);
    let correct = database.splice(correctIndex, 1)[0];

    let firstOptionIndex = getRandomNumber(database.length);
    let firstOption = database.splice(firstOptionIndex, 1)[0];

    let secondOptionIndex = getRandomNumber(database.length);
    let secondOption = database.splice(secondOptionIndex, 1)[0];

    let thirdOptionIndex = getRandomNumber(database.length);
    let thirdOption = database.splice(thirdOptionIndex, 1)[0];

    let flag = require(`./../images/put-oko-svijeta/${correct.abbreviation}.svg`);

    game.push({
      flag,
      country: correct.fullName,
      options: shuffleArray([correct.fullName, firstOption.fullName, secondOption.fullName, thirdOption.fullName])
    })
  }

  return game
}
/**
 * The function `generateSef` returns an object with a `code` property containing an array of four
 * random numbers between 1 and 6.
 * @returns An object is being returned with a property `code` that contains an array of four random
 * numbers generated using the `getRandomNumber` function.
 */
const generateSef = () => {
  return {
    code: [
      getRandomNumber(6) + 1,
      getRandomNumber(6) + 1,
      getRandomNumber(6) + 1,
      getRandomNumber(6) + 1
    ]
  } as ISef
}
const generateGame = (): IGame => {
  return {
    slagalica: generateSlagalica(),
    spajalica: generateSpajalica(),
    desnoLijevo: generateDesnoLijevo(),
    zid: generateZid(),
    asocijacije: generateAsocijacije(),
    premetaljka: generatePremetaljka(),
    parovi: generateParovi(),
    mojBroj: generateMojBroj(),
    putOkoSvijeta: generatePutOkoSvijeta(),
    sef: generateSef()
  }
}
export {
  generateGame
}