#/usr/bin/env python
# -*- coding: UTF-8 -*-
# Last modified: 

"""read in Table_2A.csv and Table_2J.csv, compute the mean, standard deviation, correlations, and line of regression, and output them in a json file
"""

import json
import numpy as np
import pandas as pd
from io import StringIO
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

def clean_Table_2A_2J(rawfile):
    """read Table 2A, remove the description and footnote, rename the columns, change the dollar and thousands into numerics
    output the clean data to csv and json files"""

    df = pd.read_csv(rawfile, skiprows=range(5)+range(18,23), thousands=',')
    df = df[pd.notnull(df['Highest level completed'])]
    df.columns = ['EduLevel', 'Number', 'Income', 'EarnFT', 'EarnAll', 'Months_Worked']
    df[df.columns[2:5]] = df[df.columns[2:5]].apply(lambda x: x.str.replace('$','')).apply(lambda x: x.str.replace(',','')).astype(np.float64)
    return df

def combine_2A_2J(df_A, df_J):
    df = pd.merge(df_2A, df_2J, on='EduLevel', how='left', suffixes=('_mean', '_median'))
    del df["Number_median"], df["Months_Worked_median"]
    df = df.rename(columns = {"Number_mean":"Number", "Months_Worked_mean":"Months Worked"})
    return df

def add_edu_month_line(df):
    edus = pd.Series(df["EduLevel"])
    labels = pd.factorize(edus)[0]
    df["EduScore"] = labels

    x = np.array(df["EduScore"].values).reshape(-1, 1)
    y = np.array(df["Months Worked"].values)

    #print x, y
    model = make_pipeline(PolynomialFeatures(1), Ridge())
    model.fit(x, y)
    y_fit = model.predict(x)
    print model.predict(np.array([0.0, 1.0]).reshape(-1, 1))
    df["EduMonthFit"] = y_fit
    return df

def add_edu_income_line(df):
    x = np.array(df["EduScore"].values).reshape(-1, 1)
    y = np.array(df["Income_median"].values)

    #print x, y
    model = make_pipeline(PolynomialFeatures(1), Ridge())
    model.fit(x, y)
    y_fit = model.predict(x)
    print model.predict(np.array([0.0, 1.0]).reshape(-1, 1))
    df["EduIncomeFit"] = y_fit
    return df

def add_income_month_line(df):
    x = np.array(df["Income_median"].values).reshape(-1, 1)
    y = np.array(df["Months Worked"].values)

    #print x, y
    model = make_pipeline(PolynomialFeatures(1), Ridge())
    model.fit(x/1000, y)
    y_fit = model.predict(x/1000)
    print model.predict(np.array([0.0, 1.0]).reshape(-1, 1))
    df["IncomeMonthFit"] = y_fit
    return df

if __name__ == '__main__':

    df_2A = clean_Table_2A_2J("./raw_data/Table_2A.csv")
    df_2J = clean_Table_2A_2J("./raw_data/Table_2J.csv")
    df = combine_2A_2J(df_2A, df_2J)


    ##analysis
    stat = df.describe().round(2)
    stat = stat.drop("count")
    corr = df.corr().round(5)
    #regre = {}
    #regre["IncomeMean-Months"] = regression(df["Income_mean"], df["Months"])

    print "####################################"
    print "statistics table :\n", stat, "\n#####################################"
    print "pair-wise correlation table :\n", corr, "\n#####################################"
    
    stat.to_csv("../stat_2A_2J.csv", index=True, index_label="Statistics")
    corr.to_csv("../corr_2A_2J.csv", index=True, index_label="Features")

    ##add line of regression
    df = add_edu_month_line(df)
    df = add_edu_income_line(df)
    df = add_income_month_line(df)

    del df["EduScore"]
    print "clean data table :\n", df, "\n#####################################"
    df.to_csv("../data_2A_2J.csv", index=False)
