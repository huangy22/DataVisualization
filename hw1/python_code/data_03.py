#/usr/bin/env python
# -*- coding: UTF-8 -*-
# Last modified: 

"""read in Table_02.csv, Table_02_female.csv and Table_02_male.csv, compute the mean, standard deviation, correlations, and line of regression, and output them in several clean csv files
"""

import json
import numpy as np
import pandas as pd
from io import StringIO

def read_table03(rawfile):
    """read table03 into a dataframe"""
    df = pd.read_csv(rawfile, skiprows = range(4)+range(55,62), thousands=",", na_values=['-'])
    print df

    df.dropna(axis=0, how="all", inplace=True)
    #df.dropna(axis=0, subset=df.columns[1:], how="all", inplace=True)
    df.dropna(axis=1, how="all", inplace=True)

    df = df.rename(columns = {"Unnamed: 2": "All races Percent", "Unnamed: 4": "Males Percent", "Unnamed: 6": "Females Percent", "Unnamed: 8":"25-34 Percent", "25 to 34 years old":"25-34", "Unnamed: 10": "35-54 Percent", "35 to 54 years old":"35-54", "Unnamed: 12":">=55 Percent", "55 years and older":">=55", "Unnamed: 14": "White Percent", "Unnamed: 16": "Non-Hispanic White Percent", "Unnamed: 18": "Black Percent", "Unnamed: 20": "Asian Percent", "Unnamed: 22": "Hispanic Percent", "Hispanic \n(of any race)":"Hispanic"})

    df.drop(0, inplace=True)
    df["Detailed Years of School"][1] = "Total"

    df = df.ix[[45,46,47,48], :]
    df.set_index("Detailed Years of School", inplace=True)
    print df
    #for i in range(4):
        #df.iloc[i][:] = df.iloc[i][:].str.replace(r'[$,]', '').astype('float')
    print df.dtypes

    return df


if __name__ == '__main__':

    df = read_table03("./raw_data/Table03.csv")

    df.to_csv("../data_03.csv", index=True,index_label=['Degree'])

    #analysis
    stat = df.describe()
    corr = df.corr()

    #print "####################################"
    #print "clean data table :\n", df, "\n#####################################"
    print "statistics table :\n", stat, "\n#####################################"
    print "pair-wise correlation table :\n", corr, "\n#####################################"
    
    #df.to_csv("clean_data/data_2A_2J.csv", index=False)
    stat.to_csv("../stat_03.csv", index=True,index_label=['Statistics'])
    corr.to_csv("../corr_03.csv", index=True,index_label=['Features'])

