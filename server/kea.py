from transformers import MarianMTModel, MarianTokenizer
import torch
from sklearn.feature_extraction.text import TfidfVectorizer

# Extract English keywords (as before)
text = ["This is a sample sentence used for extracting keywords using the KEA algorithm in NLP."]
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(text)
feature_names = vectorizer.get_feature_names_out()
tfidf_scores = zip(feature_names, tfidf_matrix.toarray()[0])
sorted_words = sorted(tfidf_scores, key=lambda x: x[1], reverse=True)
keywords = [word for word, score in sorted_words[:5]]

# Initialize MarianMT for English-to-Hindi translation
model_name = 'Helsinki-NLP/opus-mt-en-hi'  # MarianMT model for English-Hindi translation
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Translate and score each keyword
translated_keywords = {}
for word in keywords:
    # Tokenize and translate the word
    inputs = tokenizer(word, return_tensors="pt")
    outputs = model.generate(**inputs, return_dict_in_generate=True, output_scores=True)
    
    # Get translation and score
    translation = tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
    score = torch.exp(outputs.sequences_scores[0])  # Convert log probability to a score

    translated_keywords[word] = (translation, score.item())

# Print translations and their scores
print("Translated Keywords with Scores:")
for word, (translation, score) in translated_keywords.items():
    print(f"English: {word}, Hindi: {translation}, Score: {score}")
