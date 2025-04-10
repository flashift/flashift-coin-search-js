const Trie = require("./trie/Trie");

class CoinManager {

    constructor() {
        this.trie = new Trie()
    }

    loadCoinFile(filePath) {
        this.trie.unserializeTrieFromFile(filePath)
    }
    
    generateCoinFile(coinListPath, networkListPath) {
        const fs = require('fs');

        function downloadFile(fileName) {
            const https = require('https');

            const url = `https://static.flashift.app/list/${fileName}.json`;

            https.get(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    fs.writeFileSync(`./assets/${fileName}.json`, data, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing to coinList.json:', err);
                        } else {
                            console.log('coinList.json has been saved.');
                        }
                    });
                });

            }).on('error', (err) => {
                console.error('Error downloading coinList.json:', err);
            });
        }

        downloadFile('coinList')
        downloadFile('networkList')
    
        function readList(filePath) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            } catch (err) {
                console.error('Error reading list file:', err);
                return null;
            }
        }

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
    
        const coinList = JSON.parse(JSON.stringify(readList(coinListPath)));
        const networkList = JSON.parse(JSON.stringify(readList(networkListPath)));
        
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

                break

            }
        }

        function serializeTrieToFile(trie, filePath) {
            const fs = require('fs');

            const serializedTrie = JSON.stringify(trie);
            fs.writeFileSync(filePath, serializedTrie, 'utf8');
        }

        serializeTrieToFile(this.trie, './assets/trieData.json');
    }
    
    suggest(word) {
        return this.trie.suggest(word)
    }
    
}

module.exports = CoinManager