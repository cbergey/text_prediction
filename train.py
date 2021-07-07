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

FILE_NAME = 'adult.txt'

read_dir = './childes'

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
    length = len(dict)
    for key, value in dict.items():
        normed_dict[key] = value / length
    return normed_dict

unigrams = {}
bigram_dict = {}
trigram_dict = {}

for line in open(os.path.join(read_dir, FILE_NAME), 'r'):
	tokens = line.rstrip().lower().split()
	tokens_len = len(tokens)
	for i in range(tokens_len):
		unigrams[tokens[i]] = unigrams.get(tokens[i], 0) + 1
		if i < tokens_len - 1:
			add_to_dict(bigram_dict, tokens[i], tokens[i + 1])
			if i < tokens_len - 2:
				add_to_dict(trigram_dict, (tokens[i], tokens[i + 1]), tokens[i + 2])

unigram_total = sum(unigrams.values())
for key, val in unigrams.items():
	unigrams[key] = val/unigram_total

for word1, word2 in bigram_dict.items():
	bigram_dict[word1] = normalize_dict(word2)

for wordslist, word3 in trigram_dict.items():
	trigram_dict[wordslist] = normalize_dict(word3)


def get_next_word(input):
	tokens = input.rstrip().lower().split()
	length = len(tokens)
	if length == 0: return "No input words"
	if length > 1:
		if (tokens[-2], tokens[-1]) in trigram_dict:
			return(max(trigram_dict[(tokens[-2], tokens[-1])], key=trigram_dict[(tokens[-2], tokens[-1])].get))
	if tokens[-1] in bigram_dict:
		return(max(bigram_dict[tokens[-1]], key=bigram_dict[tokens[-1]].get))
	return(max(unigrams, key=unigrams.get))

input = "what are"
for i in range(30):
	next = get_next_word(input)
	input = input + " " + next

print(input)

