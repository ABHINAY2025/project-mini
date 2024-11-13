from flask import Flask, request, jsonify
from flask_cors import CORS
import stanza

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set up the Stanza pipeline for Hindi
stanza.download('hi')  # Download Hindi model (run this only once)
nlp = stanza.Pipeline('hi')

# Define a route for processing text
@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    hindi_text = data['text']

    # Process the text with Stanza
    doc = nlp(hindi_text)

    tokens = []
    stems = []
    subject = ""
    verb = ""
    obj = ""
    adjectives = []  # List to store adjectives

    # Extract tokens and their dependencies
    for sentence in doc.sentences:
        for word in sentence.words:
            tokens.append(word.text)
            stems.append(word.lemma)  # Get the lemma (base form) of the word
            
            # Identify subject, verb, object, and adjectives based on dependency labels
            if word.deprel == 'nsubj':  # Nominal subject
                subject = word.text
            elif word.deprel == 'root':  # Root verb
                verb = word.text
            elif word.deprel in ['obj', 'dobj']:  # Object (direct object)
                obj = word.text
            elif word.upos == 'ADJ':  # Universal POS tag for adjectives
                adjectives.append(word.text)

    # Ensure obj is populated correctly
    if obj == "":
        # Try to find the object based on dependency relations
        for word in sentence.words:
            if word.deprel == 'iobj' or word.deprel == 'obj':  # Indirect or direct object
                obj = word.text
                break

    # Return JSON response
    return jsonify({
        'tokens': tokens,
        'stems': stems,
        'subject': subject,
        'verb': verb,
        'object': obj,
        'adjectives': adjectives,  # Add adjectives to the response
    })

if __name__ == '__main__':
    app.run(debug=True)
