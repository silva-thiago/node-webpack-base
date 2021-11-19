const TextComponent = () => {
	const elementText = document.createElement('h1');
	elementText.innerText = 'Olá, Mundo!';
	elementText.classList.add('title');

	return elementText;
};

document.body.appendChild(TextComponent());

/* ************************* _text.js ************************* */
