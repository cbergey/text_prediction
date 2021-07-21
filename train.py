# with thanks to https://github.com/ashwinmj/word-prediction/blob/master/MarkovModel.ipynb for structuring inspiration
from __future__ import absolute_import, division, print_function, unicode_literals
import io
import os, sys
import numpy as np   
import pandas as pd 
import csv
import logging
import nltk
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
import pandas as pd
import json
import re

FILE_NAMES = []
#FILE_NAMES = ['adult.txt']
#read_dir = './childes'

read_dir = '/Users/clairebergey/Box/COCA/texts'

for year in range(1990,2005):
  FILE_NAMES.append('text_fiction_awq/w_fic_' + str(year) + '.txt')

def get_pos(utt):
	if isinstance(utt, str):
  		tag = nltk.pos_tag(nltk.word_tokenize(utt))
  		return ' '.join([x[1] for x in tag])
	return('')

def read_file(f):
	return(pd.read_csv(f, delimiter = "\t", names = ["utt"]))

def add_to_dict(dict, word1, word2):
	if word1 not in dict:
		dict[word1] = {}
	if word2 not in dict[word1]:
		dict[word1][word2] = 0
	dict[word1][word2] = dict[word1][word2] + 1

def normalize_dict(dict):
    normed_dict = {}
    sum = 0
    for key, value in dict.items():
    	sum = sum + value
    for key, value in dict.items():
        normed_dict[key] = value / sum
    return normed_dict

def get_common_unigrams(unigram_dict):
	trash_words = []
	for key, value in unigram_dict.items():
		if value < 0.000005:
			trash_words.append(key)
	for word in trash_words:
		del unigram_dict[word]
	return unigram_dict

def clean_dict(ngram_dict, unigram_dict, n):
	trash_words = []
	if n == 2:
		for key, value in ngram_dict.items():
			if not key in unigram_dict or not value in unigram_dict:
				del ngram_dict[key]
	elif n == 3:
		for key, value in ngram_dict.items():
			print(value)
			if not key[0] in unigram_dict or not key[1] in unigram_dict or not value in unigram_dict:
				del ngram_dict[key]
	return ngram_dict

def get_next_word(input):
	tokens = input.rstrip().lower().split()
	length = len(tokens)
	if length == 0: return "No input words"
	if length > 1:
		if tokens[-2] + " " + tokens[-1] in trigram_dict:
			return(max(trigram_dict[tokens[-2] + " " + tokens[-1]], key=trigram_dict[tokens[-2] + " " + tokens[-1]].get))
	if tokens[-1] in bigram_dict:
		return(max(bigram_dict[tokens[-1]], key=bigram_dict[tokens[-1]].get))
	return(max(unigrams, key=unigrams.get))

unigrams = {}
bigram_dict = {}
trigram_dict = {}


for i, file_name in enumerate(FILE_NAMES):
	for line in open(os.path.join(read_dir, file_name), 'r'):
		tokens = line.replace(' \'', '\'')
		tokens = re.sub(r'[^\w\s]','', tokens)
		tokens = tokens.rstrip().lower().split()
		tokens_len = len(tokens)
		for i in range(tokens_len):
			unigrams[tokens[i]] = unigrams.get(tokens[i], 0) + 1

unigram_total = sum(unigrams.values())
for key, val in unigrams.items():
	unigrams[key] = val/unigram_total

print(len(unigrams))
unigrams = get_common_unigrams(unigrams)
print(len(unigrams))

unigram_total = sum(unigrams.values())
for key, val in unigrams.items():
	unigrams[key] = val/unigram_total

for i, file_name in enumerate(FILE_NAMES):
	for line in open(os.path.join(read_dir, file_name), 'r'):
		tokens = line.replace(' \'', '\'')
		tokens = re.sub(r'[^\w\s]','',tokens)
		tokens = tokens.rstrip().lower().split()
		tokens_len = len(tokens)
		for i in range(tokens_len):
			if i < tokens_len - 1 and tokens[i] in unigrams and tokens[i + 1] in unigrams:
				add_to_dict(bigram_dict, tokens[i], tokens[i + 1])
				if i < tokens_len - 2 and tokens[i + 2] in unigrams:
					add_to_dict(trigram_dict, tokens[i] + " " + tokens[i + 1], tokens[i + 2])


for word1, word2 in bigram_dict.items():
	bigram_dict[word1] = normalize_dict(word2)

for wordslist, word3 in trigram_dict.items():
	trigram_dict[wordslist] = normalize_dict(word3)

input = "what are"
for i in range(30):
	next = get_next_word(input)
	input = input + " " + next

print(input)

input = "who is"
for i in range(30):
	next = get_next_word(input)
	input = input + " " + next

print(input)

unigram_json = json.dumps(unigrams, indent = 4)
bigram_json = json.dumps(bigram_dict, indent = 4)
trigram_json = json.dumps(trigram_dict, indent = 4)

with open("COCAfic_unigram.json", "w") as outfile:
    outfile.write(unigram_json)

with open("COCAfic_bigram.json", "w") as outfile:
    outfile.write(bigram_json)

with open("COCAfic_trigram.json", "w") as outfile:
    outfile.write(trigram_json)

