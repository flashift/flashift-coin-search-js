
const TrieNode = require("./TrieNode");

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.dfsData = new Set();
    }

    unserializeTrieFromFile(filePath) {
        const fs = require('fs');
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const serializedTrie = JSON.parse(data);
            this.root = this._unserializeNode(serializedTrie.root);
        } catch (err) {
            console.error('Error reading or parsing trie data file:', err);
        }
    }

    _unserializeNode(serializedNode) {
        const node = new TrieNode();
        node.letter = serializedNode.letter;
        node.isEndOfWord = serializedNode.isEndOfWord;
        node.coin = serializedNode.coin;
        for (let char in serializedNode.children) {
            node.children[char] = this._unserializeNode(serializedNode.children[char]);
        }
        return node;
    }

    insert(word, coin) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
                node.children[char].letter = char;
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.coin.push(coin);
    }

    insertArray(list, coin) {
        for (let word of list) {
            this.insert(word, coin)
        }
    }

    #dfs(node, word) {
        if (node.isEndOfWord) {
            this.dfsData.add(...node.coin)
        }

        if (Object.keys(node.children).length === 0) {
            return
        }

        for (let child in node.children) {
            this.#dfs(node.children[child], word + node.children[child].letter);
        }
    }

    suggest(word) {
        let node = this.root
        for (let char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }

        this.dfsData = new Set()
        this.#dfs(node, word)

        return Array.from(this.dfsData)
    }

    search(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord ? node.coin : false;
    }
}

module.exports = Trie;

