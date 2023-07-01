// Run with node js_example.js

// Define the URL of the API endpoint and the request headers
const url = "http://pixelcorp.nl/api/single";
const headers = { 'Content-Type': 'application/json' };

// Define the pixel data as a JavaScript object
const pixel = { x: 42, y: 42, color: [255, 25, 0] };

// Send a POST request to the API endpoint with the pixel data as JSON
fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(pixel)
})
  .then(response => {
    // Check if the request was successful
    if (response.ok) {
      // If the request was successful, print a success message
      console.log("Pixel successfully changed!");
    } else {
      // If the request was unsuccessful, print an error message that includes the HTTP status code
      console.log("Failed to change pixel:", response.status);
    }
  })
  .catch(error => {
    console.log("Error:", error);
  });
