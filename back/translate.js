// Import required modules using CommonJS syntax
import axios from 'axios';
import *as cheerio from 'cheerio';


// Function to translate text using Google Translate's web interface (unofficial)
async function translateText(text) {
  const url = `https://translate.google.com/m?hl=en&sl=en&tl=hi&ie=UTF-8&prev=_m&q=${encodeURIComponent(text)}`;

  try {
    // Make the GET request to Google Translate's web page
    const response = await axios.get(url);

    // Load the HTML response into cheerio
    const $ = cheerio.load(response.data);

    // Scrape the translated text from the specific HTML element
    const translatedText = $('div.result-container').text();

    console.log(`Original Text: ${text}`);
    console.log(`Translated Text: ${translatedText}`);
  } catch (error) {
    console.error('Error during translation:', error);
  }
}

// Example usage
translateText('Hello, how are you?');
