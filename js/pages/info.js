export function renderInfo(content) {
	fetch("pages/info.html")
	.then(res => res.text())
	.then(html => content.innerHTML = html);
}