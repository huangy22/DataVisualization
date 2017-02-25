#/usr/bin/env python
# -*- coding: UTF-8 -*-
# Last modified: 

"""read in Table01.csv and Table01-*.csv, compute the mean, standard deviation, correlations, and line of regression, and output them in several clean csv files
"""

import json
import numpy as np
import pandas as pd
from io import StringIO

from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

def read_table(rawfile):
    """read Facebook table into a dataframe"""
    df = pd.read_csv(rawfile, na_values=[''])
    df.fillna(0, inplace=True)
    df["Type"] = df["Type"].astype('category')
    print df["Type"]
    df["Type"] = df["Type"].cat.rename_categories([1,2,3,4]).astype('int').astype('int')
    return df

def metadata(df):
    print list(df)
    dict = {'category': ['Type', 'Category', 'Post Month', 'Post Weekday', 'Post Hour', 'Paid'],
            'category_name':{'Type':['Link', 'Photo', 'Status', 'Video'],
                    'Category':['action', 'product', 'inspiration']},
            'number of category data': 6,
            'number of numerical data': 13,
            'numerical': ['Page total likes','Lifetime Post Total Reach', 'Lifetime Post Total Impressions', 'Lifetime Engaged Users', 'Lifetime Post Consumers', 'Lifetime Post Consumptions', 'Lifetime Post Impressions by people who have liked your Page', 'Lifetime Post reach by people who like your Page', 'Lifetime People who have liked your Page and engaged with your post', 'comment', 'like', 'share', 'Total Interactions']}
    with open('../metadata_facebook.json', 'w') as fp:
        json.dump(dict, fp)
    

if __name__ == '__main__':


    df = read_table("./raw_data/dataset_Facebook-table.csv")
    df.to_csv("../data_facebook.csv", index=False)
    metadata(df)


