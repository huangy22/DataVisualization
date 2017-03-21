#/usr/bin/env python
# -*- coding: UTF-8 -*-
# Last modified: 

"""read in Table01.csv and Table01-*.csv, compute the mean, standard deviation, correlations, and line of regression, and output them in several clean csv files
"""

import json
import numpy as np
import pandas as pd
from io import StringIO


def read_table(rawfile):
    """read Facebook table into a dataframe"""
    df = pd.read_csv(rawfile, na_values=[''])
    df.fillna(0, inplace=True)
    df["Type"] = df["Type"].astype('category')
    df["Category"] = df["Category"].astype('category')
    df["Category"] = df["Category"].cat.rename_categories(['action','product','inspiration'])
    df["Post Weekday"] = df["Post Weekday"].astype('category')
    df["Post Weekday"] = df["Post Weekday"].cat.rename_categories(['Mon','Tue','Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    df["Paid"] = df["Paid"].astype('category')
    df["Paid"] = df["Paid"].cat.rename_categories(['no','yes'])
    return df

def metadata(df):
    print list(df)
    dict = {'color': ['Type', 'Category', 'Post Weekday', 'Paid'],
            'category': ['Type', 'Category', 'Post Month', 'Post Weekday', 'Post Hour', 'Paid'],
            'number of category data': 6,
            'number of numerical data': 13,
            'numerical': ['Page total likes','Lifetime Post Total Reach', 'Lifetime Post Total Impressions', 'Lifetime Engaged Users', 'Lifetime Post Consumers', 'Lifetime Post Consumptions', 'Lifetime Post Impressions by people who have liked your Page', 'Lifetime Post reach by people who like your Page', 'Lifetime People who have liked your Page and engaged with your post', 'comment', 'like', 'share', 'Total Interactions']}
    with open('../metadata_facebook.json', 'w') as fp:
        json.dump(dict, fp)
    

if __name__ == '__main__':


    df = read_table("../raw_data/dataset_Facebook-table.csv")
    df.to_csv("../data_facebook.csv", index=False)
    metadata(df)


