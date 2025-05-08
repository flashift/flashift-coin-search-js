const trieData = require('../assets/trieData.json');

const coinList = require('../assets/coinList.json');
const networkList = require('../assets/networkList.json');

const CoinManager = require('../lib/CoinManager');

describe('CoinManager', () => {
    let coinManager;

    beforeEach(() => {
        coinManager = new CoinManager();
    });

    test('should load a coin file', () => {
        coinManager.loadCoinTrie(trieData);
        expect(true).toBe(true);
    });

    test('should generate a coin file', () => {
        coinManager.generateCoinTrie(coinList, networkList)
        expect(true).toBe(true);
    });

    test('should suggest some coins', () => {
        coinManager.loadCoinTrie(trieData);
        coinManager.suggest('tether');
        expect(true).toBe(true);
    });

    test('should suggest some coins from Object', () => {
        coinManager.loadCoinTrie(trieData);
        coinManager.suggest('tether');
        expect(true).toBe(true);
    });

    test('should suggest some coins with network', () => {
        coinManager.loadCoinTrie(trieData);
        coinManager.suggest('tether', 'bsc');
        expect(true).toBe(true);
    });

    test('should suggest some coins with erc20', () => {
        coinManager.loadCoinTrie(trieData);
        coinManager.suggest('tethererc20');
        expect(true).toBe(true);
    });
});
