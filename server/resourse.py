from flask import Flask, request, jsonify
from flask_cors import CORS
import stanza
from transformers import MarianMTModel, MarianTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
import torch

# Initialize the Hindi NLP pipeline for POS tagging
# stanza.download('hi')  # Run this once to download the Hindi model
nlp = stanza.Pipeline('hi')

# Initialize the MarianMT model and tokenizer for translation
model_name = 'Helsinki-NLP/opus-mt-en-hi'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "https://mini-project-nka2htdww-abhinay2025s-projects.vercel.app"}})

@app.route('/pos', methods=['POST'])
def pos_tagging():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    doc = nlp(text)
    results = [{"token": word.text, "pos": word.upos} for sentence in doc.sentences for word in sentence.words]
    return jsonify(results)

@app.route('/translate_keywords', methods=['POST'])
def translate_keywords():
    data = request.json
    text = data.get("text", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Extract English keywords
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(text)
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = zip(feature_names, tfidf_matrix.toarray()[0])
    sorted_words = sorted(tfidf_scores, key=lambda x: x[1], reverse=True)
    keywords = [word for word, score in sorted_words[:6]]

    # Translate keywords and get scores
    translated_keywords = {}
    for word in keywords:
        inputs = tokenizer(word, return_tensors="pt")
        outputs = model.generate(**inputs, return_dict_in_generate=True, output_scores=True)
        translation = tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
        score = torch.exp(outputs.sequences_scores[0]).item()  # Convert log probability to a score
        translated_keywords[word] = {"translation": translation, "score": score}

    return jsonify(translated_keywords)

if __name__ == '__main__':
    app.run(debug=True)
