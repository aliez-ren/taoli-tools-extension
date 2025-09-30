const initiatorDomains = ["taoli.tools"];

const urlFilters = [
	"||gate.io/",
	"||gate.com/",
	"||gateio.ws/",
	"||bitget.com/",
	"||binance.com/",
	"||coinbase.com/",
	"||okx.com/",
	"||apex.exchange/",
	"||bybit.com/",
	"||mexc.com/",
	"||backpack.exchange/",
	"||asterdex.com/",
];

const rules = urlFilters.flatMap((urlFilter, index) => [
	{
		id: index + 1,
		priority: index + 1,
		action: {
			type: "modifyHeaders",
			requestHeaders: [
				{
					header: "origin",
					value: `https://${urlFilter.substring(2, urlFilter.length - 1)}`,
					operation: "set",
				},
				{
					header: "referer",
					value: `https://${urlFilter.substring(2, urlFilter.length - 1)}`,
					operation: "set",
				},
			],
			responseHeaders: [
				{ header: "access-control-allow-origin", value: "*", operation: "set" },
				{ header: "vary", value: "Origin", operation: "set" },
				{
					header: "access-control-allow-credentials",
					value: "true",
					operation: "set",
				},
				{
					header: "access-control-expose-headers",
					value: "*",
					operation: "set",
				},
			],
		},
		condition: {
			initiatorDomains,
			urlFilter,
			resourceTypes: ["xmlhttprequest"],
		},
	},
	{
		id: urlFilters.length + index + 1,
		priority: urlFilters.length + index + 1,
		action: {
			type: "modifyHeaders",
			requestHeaders: [
				{
					header: "origin",
					value: `https://${urlFilter.substring(2, urlFilter.length - 1)}`,
					operation: "set",
				},
				{
					header: "referer",
					value: `https://${urlFilter.substring(2, urlFilter.length - 1)}`,
					operation: "set",
				},
			],
			responseHeaders: [
				{
					header: "access-control-allow-methods",
					value: "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
					operation: "set",
				},
				{
					header: "access-control-allow-headers",
					value: "*",
					operation: "set",
				},
				{ header: "access-control-max-age", value: "600", operation: "set" },
			],
		},
		condition: {
			initiatorDomains,
			urlFilter,
			resourceTypes: ["xmlhttprequest"],
			requestMethods: ["options"],
		},
	},
]);

const ruleIds = rules.map(({ id }) => id);

async function applyCorsRelaxerRules() {
	try {
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: ruleIds,
			addRules: rules,
		});
	} catch (error) {
		console.error("Failed to update CORS relaxer rules", error);
	}
}

const ensureRules = () => {
	applyCorsRelaxerRules().catch((error) => {
		console.error("Unexpected error while applying CORS relaxer rules", error);
	});
};

chrome.runtime.onInstalled.addListener(ensureRules);
chrome.runtime.onStartup.addListener(ensureRules);

ensureRules();
