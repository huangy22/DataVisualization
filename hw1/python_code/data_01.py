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

def read_table01(rawfile):
    """read Table01 into a dataframe"""
    df_all = pd.read_csv(rawfile, skiprows = range(5)+[6]+range(21,57), thousands=",", na_values=['-'])
    df_female = pd.read_csv(rawfile, skiprows = range(5)+range(6, 22)+range(36,57), thousands=",", na_values=['-'])
    df_male = pd.read_csv(rawfile, skiprows = range(5)+range(6, 37)+range(51,57), thousands=",", na_values=['-'])

    df_all = __modify_Age(df_all)
    df_female = __modify_Age(df_female)
    df_male = __modify_Age(df_male)

    frames = [df_all, df_female, df_male]
    df = pd.concat(frames, keys=['all', 'female', 'male'])

    df.dropna(axis=1, how='all', inplace=True)
    df.fillna(0, inplace=True)
    df.reset_index(inplace=True)
    return df

def __modify_Age(df):
    """Rename the Age categories and drop the redundant rows: 18 over and 25 over"""

    df = df.rename(columns = {"Unnamed: 0": "Age" })
    categories =  ["18-24", "25-29", "30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74",">=75", ">=18", ">=24"]

    df["Age"] = df["Age"].astype('category')
    df["Age"].cat.categories = categories
    df= df[df.Age!=">=24"]
    df.set_index("Age", inplace=True)
    return df


def  extract_edu_age(df):
    """output the education by sex table"""
    df_sub = df[df["level_0"]=="all"]
    del df_sub['level_0']
    
    df_sub.set_index("Age", inplace=True)
    df_sub = df_sub.transpose()

    df_sub_out = df_sub.iloc[1:]/df_sub.iloc[0]
    df_sub_out.to_csv("../data_01_edu_age_1.csv", index=True, index_label="EduLevel")

    print "#######################################"
    print "Education by Age:"
    print df_sub

    extract_edu_age_line(df_sub)


def  extract_edu_sex(df):
    """output the education by age table"""
    df_sub = df[df["Age"]==">=18"]
    del df_sub["Age"]
    df_sub = df_sub[df_sub["level_0"]!="all"]
    df_sub.set_index("level_0", inplace=True)

    df_sub = df_sub.transpose()
    df_sub.iloc[1:] = df_sub.iloc[1:]/df_sub.iloc[0]
    df_sub_out = df_sub.drop("Total")
    df_sub_out.to_csv("../data_01_edu_sex.csv", index=True, index_label="EduLevel")
    print "#######################################"
    print "Education by Sex:"
    print df_sub


def extract_edu_race(df):
    """output the education by race table"""
    df_sub = df[df["Age"]==">=18"]
    df_sub = df_sub[df_sub["level_0"]=="all"]
    del df_sub["Age"], df_sub["level_0"]

    df_sub.reset_index(level=1, drop=True, inplace=True)
    df_sub = df_sub.transpose()

    df_sub.iloc[1:] = df_sub.iloc[1:]/df_sub.iloc[0]
    df_sub_out = df_sub.drop("Total")
    df_sub_out.to_csv("../data_01_edu_race.csv", index=True, index_label="EduLevel")
    print "#######################################"
    print "Education by Race:"
    print df_sub

def extract_edu_age_line(df):
    """output the data for the scatterplot of education by age"""
    edus = pd.Series(df.index.values)
    labels = pd.factorize(edus)[0]
    average = []
    for i in list(df):
        sum = 0
        for j in range(len(df)):
            sum += labels[j].astype(float)*df[i].iloc[j]
        average.append(sum/df[i].iloc[0])

    df = df.append(pd.Series(average, index=list(df), name="AverageEdu"))
    df_sub = df.ix[["Total", "AverageEdu"]]
    df_sub = df_sub.transpose()
    age =  [0, 21]
    for j in range(2, len(df_sub)):
        age.append(17 + 5*j)
    df_sub["AverageAge"] = age

    x = np.array(df_sub["AverageAge"].values)[1:].reshape(-1, 1)
    y = np.array(df_sub["AverageEdu"].values)[1:]

    #print x, y
    for degree in range(1, 4):
        model = make_pipeline(PolynomialFeatures(degree), Ridge())
        model.fit(x, y)
        y_fit = model.predict(x)
        df_sub["EduFitiOrder"+str(degree)] = np.append([0], y_fit )
    #print df_sub
    df_sub_out = df_sub.drop(">=18")
    df_sub_out.to_csv("../data_01_edu_age_2.csv", index=True, index_label="Age")
    return df_sub

if __name__ == '__main__':

    listofTables = ["All", "White Only", "White Non-spanic Only", "Black", "Asian", "Hispanic", "White or Comb", "Asian or Comb", "Black or Comb"]
    filelist = ["", "-white", "-nonHispanicwhite", "-black", "-asian", "-hispanic", "-whitecomb", "-asiancomb", "-blackcomb"]

    dfs = {}

    for i in range(len(filelist)):
        dfs[listofTables[i]] = read_table01("./raw_data/Table01"+filelist[i]+".csv")

    df = pd.concat(dfs, keys=listofTables)

    df.to_csv("../data_01.csv", index=True,index_label=['Race','Sex','Age'])
    #analysis
    stat = df.describe()
    corr = df.corr()
    #print "####################################"
    print "clean data table :\n", df, "\n#####################################"
    print "statistics table :\n", stat, "\n#####################################"
    print "pair-wise correlation table :\n", corr, "\n#####################################"

    df.to_csv("../data_2A_2J.csv", index=False)
    stat.to_csv("../stat_01.csv", index=True,index_label=['Statistics'])
    corr.to_csv("../corr_01.csv", index=True,index_label=['Features'])


    extract_edu_age(dfs["All"])
    extract_edu_sex(dfs["All"])
    extract_edu_race(df)

