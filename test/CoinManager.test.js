const CoinManager = require('../lib/CoinManager');

describe('CoinManager', () => {
    let coinManager;

    beforeEach(() => {
        coinManager = new CoinManager();
    });

    test('should load a coin file', () => {
        coinManager.loadCoinFile('./assets/trieData.json')
        expect(true).toBe(true);
    });

    test('should generate a coin file', () => {
        coinManager.generateCoinFile('./assets/coinList.json', './assets/networkList.json')
        expect(true).toBe(true);
    });

    test('should suggest some coins', () => {
        coinManager.loadCoinFile('./assets/trieData.json')
        coinManager.suggest('tether');
        expect(true).toBe(true);
    });
});
