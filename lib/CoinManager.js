const Trie = require("./trie/Trie");

class CoinManager {

    constructor() {
        this.trie = new Trie()
    }

    loadCoinTrie(trieObject) {
        this.trie.unserializeTrieFromObject(trieObject)
    }

    generateCoinTrie(coinList, networkList) {

        function separateWordsBySpace(inputString) {
            return inputString.toLowerCase().split(' ');
        }

        function appendSeparatedWords(list1, list2) {

            const finalList = []

            for (let word1 of list1) {
                for (let word2 of list2) {
                    finalList.push(word1.toLowerCase() + word2.toLowerCase())
                }
            }

            return finalList
        }

        for (let coin of coinList) {
            for (let network of networkList) {

                if (coin["network"] != network["name"])
                    continue

                const coinSymbolSeparate = separateWordsBySpace(coin["symbol"])
                const coinFullnameSeparate = separateWordsBySpace(coin["fullname"])

                const networkNameSeparate = separateWordsBySpace(network["name"])
                const networkFullnameSeparate = separateWordsBySpace(network["fullname"])

                this.trie.insertArray(appendSeparatedWords(coinSymbolSeparate, networkNameSeparate), coin["id"])
                this.trie.insertArray(appendSeparatedWords(coinSymbolSeparate, networkFullnameSeparate), coin["id"])
                this.trie.insertArray(appendSeparatedWords(coinFullnameSeparate, networkNameSeparate), coin["id"])
                this.trie.insertArray(appendSeparatedWords(coinFullnameSeparate, networkFullnameSeparate), coin["id"])

                if (network["name"] === 'eth') {
                    this.trie.insertArray(appendSeparatedWords(coinSymbolSeparate, ['erc20']), coin["id"])
                    this.trie.insertArray(appendSeparatedWords(coinFullnameSeparate, ['erc20']), coin["id"])
                }

                if (network["name"] === 'bsc') {
                    this.trie.insertArray(appendSeparatedWords(coinSymbolSeparate, ['bep20']), coin["id"])
                    this.trie.insertArray(appendSeparatedWords(coinFullnameSeparate, ['bep20']), coin["id"])
                }

                if (network["name"] === 'trx') {
                    this.trie.insertArray(appendSeparatedWords(coinSymbolSeparate, ['trc20']), coin["id"])
                    this.trie.insertArray(appendSeparatedWords(coinFullnameSeparate, ['trc20']), coin["id"])
                }

                break

            }
        }

        return this.trie

    }

    suggest(word, network = null) {
        if (network === null) {
            return this.trie.suggest(word) || []
        }

        const suggestList = this.trie.suggest(word)

        const finalSuggestList = []

        for (let id of suggestList) {
            if (id.endsWith(network.toUpperCase())) {
                finalSuggestList.push(id)
            }
        }

        return finalSuggestList
    }

}

module.exports = CoinManager