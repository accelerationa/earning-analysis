
from pprint import pprint
import re
from pandas import *
from numpy import *
import json




def main():
    data = get_data()
    sp500_data = get_sp500_data(data)

    turning_point_analyze(sp500_data)

def total_numbers(data):
    true = 0
    false = 0
    for key, value_string in data.iteritems():  
        true += value_string.count('T')
        false += value_string.count('F')

    print true
    print false
    print float(true)/(true + false)
        

def continuous_true_analyze(data, continuous_length): 
    keyword = 'T' * continuous_length
    correct, wrong = predict(data=data, keyword=keyword, length=continuous_length)

    print correct
    print wrong
    print float(correct)/(correct + wrong)


def turning_point_analyze(data):
    keyword = 'FT'
    correct, wrong = predict(data=data, keyword=keyword, length=len(keyword))

    print correct
    print wrong
    print float(correct)/(correct + wrong)


def predict(data, keyword, length):
    correct = 0
    wrong = 0

    for key, value_string in data.iteritems():    
            index_list = []
            for i in range(0, len(value_string)):
                if i + length <= len(value_string):
                    if value_string[i: i+length] == keyword:
                        index_list.append(i)
            for i in index_list:
                if i + length < len(value_string):
                    if value_string[i+length] == 'T':
                        correct += 1
                    else:
                        wrong += 1
    
    return correct, wrong


def get_data():
    with open('data.json') as f:
        data = json.load(f)

    filtered_data = {}

    for key, value in data.iteritems():
        if len(value) > 0:
            filtered_data[key] = ''.join(value)
    
    return filtered_data


def get_sp500_data(data):
    tickers = get_sp500_tickers()

    filtered_data = {}

    for ticker in tickers:
        if not data.get(ticker):
            print 'WARNING: unbale to find data for ' + ticker
        else: 
            filtered_data[ticker] = data.get(ticker)
    return filtered_data


def get_sp500_tickers():
    Tickers=read_table('sp500_tickers.txt')
    Ticker=transpose(array(Tickers)).tolist()
    Ticker=Ticker[0]

    processed_tickers = []

    for ticker in Ticker:
        processed_tickers.append(ticker[:ticker.find(',')])

    return processed_tickers


if __name__ == "__main__":
    main()