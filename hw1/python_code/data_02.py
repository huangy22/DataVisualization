#/usr/bin/env python
# -*- coding: UTF-8 -*-
# Last modified: 

"""read in Table_02.csv, Table_02_female.csv and Table_02_male.csv, compute the mean, standard deviation, correlations, and line of regression, and output them in several clean csv files
"""

import json
import numpy as np
import pandas as pd
from io import StringIO

def read_table02(rawfile):
    """read table02 into a dataframe"""
    df = pd.read_csv(rawfile, skiprows = range(5)+range(79, 213), thousands=",", na_values=['-'])
    df.dropna(axis=0, how="all", inplace=True)
    #df.dropna(axis=0, subset=df.columns[1:], how="all", inplace=True)
    df.dropna(axis=1, how="all", inplace=True)

    df_native = df.iloc[[24, 25, 27, 28], :]
    df_native = df_native.rename(columns = {"Unnamed: 0": "Category", "Unnamed: 1": "Total" })
    for i in range(len(df_native["Category"])):
        df_native["Category"].iloc[i] = df_native["Category"].iloc[i][2:]
    df_native.set_index("Category", inplace=True)

    df_occ = df.iloc[40:49]
    df_occ = df_occ.rename(columns = {"Unnamed: 0": "Category", "Unnamed: 1": "Total" })
    for i in range(len(df_occ["Category"])):
        df_occ["Category"].iloc[i] = df_occ["Category"].iloc[i][1:]
    df_occ.set_index("Category", inplace=True)

    df_ind = df.iloc[51:64]
    df_ind = df_ind.rename(columns = {"Unnamed: 0": "Category", "Unnamed: 1": "Total" })
    for i in range(len(df_ind["Category"])):
        df_ind["Category"].iloc[i] = df_ind["Category"].iloc[i][1:]
    df_ind.set_index("Category", inplace=True)

    frames = [df_native, df_occ, df_ind]
    df = pd.concat(frames, keys=['Citizenship', 'Occupation', 'Industry'])
    df.fillna(0, inplace=True)
    #print df
    return df

if __name__ == '__main__':

    listofTables = ["All", "Women", "Men"]
    filelist = ["", "-women", "-men"]

    dfs = {}

    for i in range(len(filelist)):
        dfs[listofTables[i]] = read_table02("./raw_data/Table02"+filelist[i]+".csv")
    df = pd.concat(dfs, keys=listofTables)

    df.to_csv("../data_02.csv", index=True,index_label=['Sex','Character','Category'])


    #analysis
    stat = df.describe()
    corr = df.corr()

    #print "####################################"
    #print "clean data table :\n", df, "\n#####################################"
    #print "statistics table :\n", stat, "\n#####################################"
    #print "pair-wise correlation table :\n", corr, "\n#####################################"
    
    #df.to_csv("clean_data/data_2A_2J.csv", index=False)
    stat.to_csv("../stat_02.csv", index=True,index_label=['Statistics'])
    corr.to_csv("../corr_02.csv", index=True,index_label=['Features'])

