const ButtonComponent = () => {
	const elementButton = document.createElement('button');
	elementButton.innerHTML = 'Botão';
	elementButton.classList.add('btn');

	return elementButton;
};

document.body.appendChild(ButtonComponent());

/* ************************* _button.js ************************* */
