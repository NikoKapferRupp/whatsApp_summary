'use strict'

const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
const CHARS_BEFORE_MESSAGE = 19;
const fs = require('fs');
let chat;
let chatArray;

chat = fs.readFileSync('../assets/WhatsApp-Chat_mit_Natalie.txt', { encoding: 'utf8', flag: 'r' })
chatArray = chat.split('\n');

class User {
  constructor(name) {
    this.name = name;
    this.messageStartIndex = User.getMessageStart(name);
    this.messageAmount = 0;
    this.words = {};
    this.emojis = {};
    this.longestMessage = {message: '', amount: 0};
  };

  static getMessageStart(name) {
    return name.length + CHARS_BEFORE_MESSAGE;
  };
  // getters
  getName() { return this.name };

  getMessageStartIndex() { return this.messageStartIndex };

  getMessageAmount() { return this.messageAmount };

  getWords() { return this.words };

  getEmojis() { return this.emojis };

  getLongestMessage() { return { message: this.longestMessage.message, amount: this.longestMessage.amount} } ;
  // mutators
  addOneToMessageAmount() { this.messageAmount += 1 };

  setEmojis(emoArr) {
    //console.log(emoArr)
    emoArr.forEach(element => this.emojis.hasOwnProperty(element) ? this.emojis[`${element}`] += 1 : this.emojis[`${element}`] = 1)
  }

  setWords(word) {
    word = word.replaceAll(/[^a-zA-Z0-9 ]/g, "");
    this.words.hasOwnProperty(word) ? this.words[`${word}`] += 1 : this.words[`${word}`] = 1;
  }

  setLongestMessage(string, newAmount) { 
    this.longestMessage.message = string;
    this.longestMessage.amount = newAmount;
  }
};

let natalie = new User(`😍 Natalie "Cutest Babe Of Unrelenting Chaos" (Tinder) Kapfer-Rupp`);
let niko = new User('Nikolaus Kapfer-Rupp');


function chatArrayIterator() {
  chatArray.forEach(element => { 
    let currentUser = element.includes(`😍 Natalie "Cutest Babe Of Unrelenting Chaos" (Tinder) Kapfer-Rupp`) ? natalie : niko ;
    // ignores links
    if(element.includes('www.') || element.includes('https') || element.includes('Medien') ) { return };
    // shortesn message
    element = element.slice(currentUser.messageStartIndex)
    // messageAmount 
    currentUser.addOneToMessageAmount();
    // longestMessage
    if(currentUser.getLongestMessage().amount < element.length && !element.includes('www.') ) { 
      currentUser.setLongestMessage(element, element.length);
    }
    
    // set words and emoji object
    element.split(' ').forEach(string => {
      string.replaceAll(/[^a-zA-Z0-9 ]/g, "")
      // remove all special chars
      if(regex.test(string)) {
        currentUser.setEmojis(string.match(regex))
      }
      string.replaceAll(regex, '');
      currentUser.setWords(string.toLowerCase());
    })    
  });
};

chatArrayIterator();

//console.log(natalie.getWords())
//console.log(Object.entries(natalie.getEmojis()).sort((a, b) => b[1] - a[1]));

//console.log(Object.entries(natalie.getWords()).sort((a, b) => b[1] - a[1]));
