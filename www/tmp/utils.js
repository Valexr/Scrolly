function gra(min, max) {
	return Math.random() * (max - min) + min;
}

export function init(min ,max, selector){
	let items = document.querySelectorAll(selector);
	for (const item of items){
		item.style.minWidth = gra(min, max) + 'vw';
	}
}