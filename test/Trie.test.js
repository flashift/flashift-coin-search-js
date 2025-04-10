// src/test/Trie.test.js

const Trie = require('../lib/trie/Trie');

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  test('should insert and search for a word', () => {
    trie.insert('hello', 'hello');
    expect(trie.search('hello')).toStrictEqual(["hello"]);
    expect(trie.search('hell')).toBe(false);
    expect(trie.search('helloo')).toBe(false);
  });

  test('should insert and suggest for a word', () => {
    trie.insert('usdtarb', 'usdtarb');
    trie.insert('usdtar', 'usdtar');
    trie.insert('usdtavax', 'usdtavax');
    trie.insert('usdterc20', 'usdterc20');
    expect(trie.suggest('usdtar')).toStrictEqual(['usdtar', 'usdtarb']);
  });

});