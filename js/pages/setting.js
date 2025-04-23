function renderSetting(content){
	fetch("pages/settings.html")
	.then(res => res.text())
	.then(html => {
		content.innerHTML = html;
		setupSettings();
	});
}

function setupSettings(){

}

export {
	renderSetting
}