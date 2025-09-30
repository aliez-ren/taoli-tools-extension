const HOSTNAME = 'taoli.tools'

const HOSTNAMES_0 = [
  'www.gate.io',
  'www.gate.com',
  'api.gateio.ws',
  'www.bitget.com',
  'api.bitget.com',
  'www.binance.com',
  'api.binance.com',
  'omni.apex.exchange',
  'api.coinbase.com',
  'api.international.coinbase.com',
  'fapi.asterdex.com',
  'api.bybit.com',
  'api2.bybit.com',
  'api.mexc.com',
  'contract.mexc.com',
]

const HOSTNAMES_1 = [
  'api.backpack.exchange',
]

const RULES = [
  {
    id: 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [
        { header: 'access-control-allow-origin', value: '*', operation: 'set' },
        { header: 'vary', value: 'Origin', operation: 'set' },
        { header: 'access-control-allow-credentials', value: 'true', operation: 'set' },
        { header: 'access-control-expose-headers', value: '*', operation: 'set' },
      ],
    },
    condition: {
      domains: [HOSTNAME, ...HOSTNAMES_0],
    },
  },
  {
    id: 2,
    priority: 2,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        { header: 'origin', operation: 'remove' },
      ],
      responseHeaders: [
        { header: 'access-control-allow-origin', value: '*', operation: 'set' },
        { header: 'vary', value: 'Origin', operation: 'set' },
        { header: 'access-control-allow-credentials', value: 'true', operation: 'set' },
        { header: 'access-control-expose-headers', value: '*', operation: 'set' },
      ],
    },
    condition: {
      domains: [HOSTNAME, ...HOSTNAMES_1],
    },
  },
  {
    id: 3,
    priority: 3,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [
        { header: 'access-control-allow-methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD', operation: 'set' },
        { header: 'access-control-allow-headers', value: '*', operation: 'set' },
        { header: 'access-control-max-age', value: '600', operation: 'set' },
      ],
    },
    condition: {
      domains: [HOSTNAME, ...HOSTNAMES_0, ...HOSTNAMES_1],
      requestMethods: ['options'],
    },
  },
];

const RULE_IDS = RULES.map(({ id }) => id);

async function applyCorsRelaxerRules() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: RULE_IDS,
      addRules: RULES,
    });
  } catch (error) {
    console.error('Failed to update CORS relaxer rules', error);
  }
}

const ensureRules = () => {
  applyCorsRelaxerRules().catch((error) => {
    console.error('Unexpected error while applying CORS relaxer rules', error);
  });
};

chrome.runtime.onInstalled.addListener(ensureRules);
chrome.runtime.onStartup.addListener(ensureRules);

ensureRules();
