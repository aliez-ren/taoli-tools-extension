const HOST_PATTERNS = [
  'https://taoli.tools/*',
  'https://www.gate.io/*',
  'https://www.gate.com/*',
  'https://api.gateio.ws/*',
  'https://www.bitget.com/*',
  'https://api.bitget.com/*',
  'https://www.binance.com/*',
  'https://api.binance.com/*',
  'https://api.backpack.exchange/*',
  'https://omni.apex.exchange/*',
  'https://api.coinbase.com/*',
  'https://api.international.coinbase.com/*',
  'https://fapi.asterdex.com/*',
  'https://api.bybit.com/*',
  'https://api2.bybit.com/*',
  'https://api.mexc.com/*',
  'https://contract.mexc.com/*',
];

const HOSTNAMES = HOST_PATTERNS.map((pattern) => {
  const sanitized = pattern.replace(/\*/g, '');
  return new URL(sanitized).hostname;
});

const RULES = [
  {
    id: 1,
    priority: 1,
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
      domains: HOSTNAMES,
    },
  },
  {
    id: 2,
    priority: 2,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [
        { header: 'access-control-allow-methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD', operation: 'set' },
        { header: 'access-control-allow-headers', value: '*', operation: 'set' },
        { header: 'access-control-max-age', value: '600', operation: 'set' },
      ],
    },
    condition: {
      domains: HOSTNAMES,
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

// Re-register rules whenever the service worker wakes up so they stay in sync.
const ensureRules = () => {
  applyCorsRelaxerRules().catch((error) => {
    console.error('Unexpected error while applying CORS relaxer rules', error);
  });
};

chrome.runtime.onInstalled.addListener(ensureRules);
chrome.runtime.onStartup.addListener(ensureRules);

ensureRules();
