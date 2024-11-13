import { useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rating from './Rating';

const Translator = () => {
  const [translatedText, setTranslatedText] = useState("");
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const Textref = useRef(null);
  const [posTags, setPosTags] = useState([]);
  const [keywords, setKeywords] = useState({}); 

  // Function to fetch parts of speech
  const fetchPartsOfSpeech = async (translated) => {
    try {
      const response = await axios.post('https://mini-project-lzkwcgrn7-abhinay2025s-projects.vercel.app/pos', { text: translated });
      return response.data;
    } catch (error) {
      console.error('Error fetching parts of speech:', error);
      toast.error('Failed to fetch parts of speech. Please try again later.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return [];
    }
  };

  // Translation handler
  const translateText = async () => {
    const inputText = Textref.current.value;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|hi`;

    setLoadingTranslation(true);

    try {
      const response = await axios.get(url);
      const translated = response.data.responseData.translatedText;

      console.log(`Original Text: ${inputText}`);
      console.log(`Translated Text: ${translated}`);
      setTranslatedText(translated);

      const posData = await fetchPartsOfSpeech(translated);
      setPosTags(posData);

      toast.success('Translation done!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error during translation:', error);
      toast.error('Failed to translate. Please try again later.');
    } finally {
      setLoadingTranslation(false);
    }
  };

  // Handler for translating keywords
  const translateKeywords = async () => {
    const inputText = Textref.current.value;

    if (!inputText) {
      toast.error('Please enter text to extract keywords.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoadingKeywords(true);

    try {
      const response = await axios.post('https://mini-project-lzkwcgrn7-abhinay2025s-projects.vercel.app/translate_keywords', { text: [inputText] });
      setKeywords(response.data); 

      toast.success('Keywords translated successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error fetching translated keywords:', error);
      toast.error('Failed to fetch translated keywords. Please try again later.');
    } finally {
      setLoadingKeywords(false);
    }
  };

  // Copy translated text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      toast.success('Translated text copied to clipboard!', {
        position: 'top-center',
        autoClose: 3000,
      });
    }).catch((error) => {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy text. Please try again.');
    });
  };

  return (
    <div className="w-full border-black border-2 rounded-lg p-6">
      <ToastContainer />
      <div className="flex justify-between mb-4 p-4">
        <div>English</div>
        <div>Hindi</div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium">Input Text</label>
          <textarea
            ref={Textref}
            spellCheck
            className="w-full h-[60vh] border rounded-lg p-4"
            placeholder="Enter text here char up to 400 only"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-2 font-medium">Translated Text</label>
          <textarea
            value={translatedText}
            className="w-full h-[60vh] border rounded-lg p-4"
            placeholder="Translation will appear here"
            readOnly
          />
          <button 
            onClick={copyToClipboard} 
            className="mt-2 bg-gray-300 hover:bg-gray-400 rounded-lg px-4 py-2"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          className={`border-2 px-8 py-2 rounded-full mt-2 transition-colors ${
            loadingTranslation
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-300 hover:bg-blue-400 cursor-pointer'
          }`}
          onClick={translateText}
          disabled={loadingTranslation || loadingKeywords}
        >
          {loadingTranslation ? 'Translating...' : 'Translate'}
        </button>
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          className={`border-2 px-8 py-2 rounded-full mt-2 transition-colors ${
            loadingKeywords
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-300 hover:bg-green-400 cursor-pointer'
          }`}
          onClick={translateKeywords}
          disabled={loadingKeywords || loadingTranslation}
        >
          {loadingKeywords ? 'Translating Keywords...' : 'Translate Keywords'}
        </button>
      </div>

      {/* Table for parts of speech tags */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Parts of Speech:</h2>
        {posTags.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-black p-2">Token</th>
                <th className="border border-black p-2">Part of Speech</th>
              </tr>
            </thead>
            <tbody>
              {posTags.map((item, index) => (
                <tr key={index}>
                  <td className="border border-black p-2">{item.token}</td>
                  <td className="border border-black p-2">{item.pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Enter text to translate.</p>
        )}
      </div>

      {/* Table for translated keywords */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Translated Keywords:</h2>
        {Object.keys(keywords).length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-black p-2">Keyword</th>
                <th className="border border-black p-2">Translation</th>
                <th className="border border-black p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(keywords).map(([word, { translation, score }], index) => (
                <tr key={index}>
                  <td className="border border-black p-2">{word}</td>
                  <td className="border border-black p-2">{translation}</td>
                  <td className="border border-black p-2">{score.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No keywords translated yet.</p>
        )}
      </div>

      {translatedText ? <Rating /> : null}
    </div>
  );
};

export default Translator;
