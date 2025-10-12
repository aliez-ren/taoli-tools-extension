const s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.js");
(document.documentElement || document.head || document.body).appendChild(s);
s.remove();

const TYPE = "EXTENSION_PROXY_FETCH";

globalThis.addEventListener("message", async ({ source, data }) => {
	if (source !== window) {
		return;
	}
	const { type, id, req } = data;
	if (type !== TYPE) {
		return;
	}
	try {
		const res = await chrome.runtime.sendMessage({ type: TYPE, req });
		globalThis.postMessage({ type: TYPE, id, res }, "*");
	} catch (err) {
		globalThis.postMessage({ type: TYPE, id, res: String(err) }, "*");
	}
});
