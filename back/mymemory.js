// Import required modules
import axios from 'axios';

// Function to translate text using MyMemory API
async function translateText(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`;

  try {
    // Make the GET request to MyMemory API
    const response = await axios.get(url);
    
    // Extract the translated text
    const translatedText = response.data.responseData.translatedText;
    
    console.log(`Original Text: ${text}`);
    console.log(`Translated Text: ${translatedText}`);
  } catch (error) {
    console.error('Error during translation:', error);
  }
}

// Example usage
translateText('hi my name is abhinay');
