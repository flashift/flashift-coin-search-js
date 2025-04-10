class TrieNode {
    constructor() {
        this.letter = '';
        this.children = {};
        this.coin = [];
        this.isEndOfWord = false;
    }
}

module.exports = TrieNode;