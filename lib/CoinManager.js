const Trie = require("./trie/Trie");

class CoinManager {

    constructor() {
        this.trie = new Trie()
    }

    loadCoinFile(filePath) {
        this.trie.unserializeTrieFromFile(filePath)
    }
   
    generateCoinFile(coinListPath, networkListPath, trieDataPath) {
        const fs = require('fs');

        function downloadFile(downloadPath, savePath) {
            const https = require('https');
            return new Promise((resolve, reject) => {
              const file = fs.createWriteStream(savePath);
          
              https.get(downloadPath, (response) => {
                if (response.statusCode !== 200) {
                  reject(new Error(`Failed to get '${downloadPath}' (${response.statusCode})`));
                  return;
                }
          
                response.pipe(file);
          
                file.on('finish', () => {
                  file.close(resolve);
                });
          
              }).on('error', (err) => {
                fs.unlink(savePath, () => {});
                reject(err);
              });
            });
        }

        async function downloadAllFiles() {
            await downloadFile('https://static.flashift.app/list/coinList.json', coinListPath)
            await downloadFile('https://static.flashift.app/list/networkList.json', networkListPath)   
        }

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

        function serializeTrieToFile(trie, filePath) {
            const fs = require('fs');

            const serializedTrie = JSON.stringify(trie);
            fs.writeFileSync(filePath, serializedTrie, 'utf8');
        }

        downloadAllFiles().then(() => {
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


            serializeTrieToFile(this.trie, trieDataPath);        
        })
    
    }
    
    suggest(word, network = null) {
        if (network === null) {
            return this.trie.suggest(word)   
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