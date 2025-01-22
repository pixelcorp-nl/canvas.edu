// Run with node js_example.js

const url = 'https://pixelcorp.nl/api/single';
const headers = { 'Content-Type': 'application/json' };

const pixel = { x: 42, y: 42, color: [255, 25, 0], key: 'joppe' };

fetch(url, {
	method: 'POST',
	headers: headers,
	body: JSON.stringify(pixel),
}).then((response) => {
	response.text().then((text) => console.log(text));
});
