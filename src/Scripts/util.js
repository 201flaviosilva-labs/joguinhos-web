// JS Utils
// Numbers
export const randomNumber = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1) + min);
export const randomNumberDecimal = (min = 0, max = 100) => Math.random() * (max - min) + min;

// Colors
export const randomColor = () => "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
export const randomRGBColor = () => `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;
export const randomRGBAColor = () => `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${Math.random().toFixed(5)})`;

// Radians and Degrees
export const radiansToDegrees = r => r * (180 / Math.PI);
export const degreesToRadians = d => d * (Math.PI / 180);

// Sort Numbers
export const sortAscending = arr => arr.sort((a, b) => a - b);
export const sortDescending = arr => arr.sort((a, b) => b - a);

// Sort Objects by property
export const sortAscendingObj = (arr, prop) => arr.sort((a, b) => a[prop] - b[prop]);
export const sortDescendingObj = (arr, prop) => arr.sort((a, b) => b[prop] - a[prop]);

// Get Max/Min from a Array of Objects
export const getMinArrayObjects = (arr, prop) => Math.min.apply(Math, arr.map(o => o[prop]));
export const getMaxArrayObjects = (arr, prop) => Math.max.apply(Math, arr.map(o => o[prop]));

// Date
export const getDateFormatted = () => {
	const date = new Date();
	return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

// Eliminate all child elements of a choice parent element, for example: ul
export const deleteAllChildDom = (domElement) => {
	while (domElement.hasChildNodes()) {
		domElement.removeChild(domElement.firstChild);
	}
}

// Export a file
export function download(data, filename, type) {
	const file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename);
	else {
		const a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

export function getLinkInfos(pagina, ferramenta) {
	fetch("./Scripts/Links" + pagina + ".json")
		.then((response) => response.json())
		.then((data) => {
			let links = [];
			data[ferramenta].map(jogo => {
				const linkCompleto = `./${pagina}/${ferramenta}/${jogo.pasta}/index.html`;
				links.pop({
					nome: jogo.nome,
					href: linkCompleto
				});
			});
		});
	console.log(links);
}
