
const TrieNode = require("./TrieNode");

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.dfsData = new Set();
    }

    unserializeTrieFromObject(trieObject) {
        try {
            this.root = this._unserializeNode(trieObject.root);
        } catch (err) {
            console.error('Error reading or parsing trie data file:', err);
        }
    }

    _unserializeNode(serializedNode) {
        const node = new TrieNode();
        node.isEnd = serializedNode.isEnd;
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
            }
            node = node.children[char];
        }
        node.isEnd = true;
        node.coin.push(coin);
    }

    insertArray(list, coin) {
        for (let word of list) {
            this.insert(word, coin)
        }
    }

    #dfs(node) {
        if (node.isEnd) {
            this.dfsData.add(...node.coin)
        }

        if (Object.keys(node.children).length === 0) {
            return
        }

        for (let child in node.children) {
            this.#dfs(node.children[child]);
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
        this.#dfs(node)

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
        return node.isEnd ? node.coin : false;
    }
}

module.exports = Trie;

