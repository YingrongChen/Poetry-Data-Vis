import pandas as pd
import numpy as np
import os

# Read the .sav file
# interview_age11 = pd.read_spss("mcs5_cm_interview.sav")
# interview_age14 = pd.read_spss("mcs6_cm_interview.sav")

# hhgrid_age11 = pd.read_spss("mcs5_hhgrid.sav")
# hhgrid_age14 = pd.read_spss("mcs6_hhgrid.sav")
hhgrid_age17 = pd.read_spss("mcs7_hhgrid.sav")
interview_age17 = pd.read_spss("mcs7_cm_interview.sav")

# age11 = pd.merge(interview_age11, hhgrid_age11, on='MCSID', how='left')
# age14 = pd.merge(interview_age14, hhgrid_age14, on='MCSID', how='left')
age17 = pd.merge(interview_age17, hhgrid_age17, on='MCSID', how='left')

# # Create a list of the column names
# interview_age11_satisfied = age11[['ECQ11A00', 'EPSEX0000']]
# interview_age14_satisfied = age14[['FCSATI00', 'FHPSEX00']]
# interview_age17_satisfied = age17[['GCSATI00', 'GHPSEX00']]

# # value counts groupby EPSEX0000
# df = pd.DataFrame()
# df['count_age11'] = age11.value_counts(subset=['ECQ11A00','EPSEX0000'])/age11.value_counts(subset=['EPSEX0000'])
# df['count_age14'] = age14.value_counts(subset=['FCSATI00', 'FHPSEX00'])/age14.value_counts(subset=['FHPSEX00'])
# df['count_age17'] = age17.value_counts(subset=['GCSATI00','GHPSEX00'])/age17.value_counts(subset=['GHPSEX00'])
# df.to_csv('satisfaction_4point.csv')
# df = pd.read_csv('satisfaction_4point.csv')
# # print(df.columns)
# ldf = pd.wide_to_long(df, stubnames='count_age', i=['ECQ11A00', 'EPSEX0000'], j='age')
# ldf.to_csv('satisfaction_4point.csv')
# ldf = pd.read_csv('satisfaction_4point.csv')
# print(ldf.columns)

# wdf = pd.pivot(ldf, index=['age', 'EPSEX0000'], columns='ECQ11A00', values='count_age')
# # change column names
# # ldf = ldf.rename(columns = {'ECQ11A00':'4point_satisfaction', 'EPSEX0000': 'Sex'})
# # ldf.columns = ['4point_satisfaction', 'Sex', 'Age', 'Count']
# wdf.to_csv('satisfaction_4point.csv')
# wdf = pd.read_csv('satisfaction_4point.csv')
# wdf.rename(columns={'EPSEX0000': 'sex'}, inplace=True)
# wdf['(Strongly) Agree'] = wdf['Strongly agree'] + wdf['Agree']
# print(wdf)
# wdf.to_csv('satisfaction_4point.csv')

# # save columns '(Strongly) Agree', 'age', 'sex' in wdf to a new data
# df = wdf[['(Strongly) Agree', 'age', 'sex']]
# ndf = df.pivot(index='age', columns='sex', values='(Strongly) Agree')
# print(ndf)
# ndf.to_csv('final_satisfaction_4point.csv')

# save data to csv
# df.to_json('satisfaction.json', orient='table')
# interview_age17 = pd.read_spss("mcs7_cm_interview.sav")
# sex=interview_age14[['FCCSEX00']]
futureExpect = age17[['GHPSEX00', 'GCASPR0A', 'GCASPR0B', 'GCASPR0C', 'GCASPR0D', 'GCASPR0E', 'GCASPR0F', 'GCASPR0G', 'GCASPR0H', 'GCASPR0I']]
futureExpect = futureExpect[futureExpect['GHPSEX00'] == "Female"]
columnNames=["Sex", "Home", "Car", "Money", "Job", "Children", "Partner", "Famous", "Personal Achievement", "None"]
futureExpect.columns = columnNames
df = futureExpect['Home'].value_counts().rename_axis('unique_values').to_frame('Home')
percendf = pd.DataFrame()
for each in columnNames:
    df[each] = futureExpect[each].value_counts().rename_axis('unique_values').to_frame(each)
    percendf[each] = df[each] / df[each].sum()
print(percendf)
percendf = percendf.T 
# sort by column 'Yes'
percendf.sort_values('Yes', ascending=False, inplace=True)
# save data to json
percendf.to_csv('futureExpectbysex.csv')

# ECQ10A00
# ECQ10B00
# ECQ10C00
# ECQ10D00
# ECQ10E00
# ECQ10F00

# FCSCWK00
# FCWYLK00
# FCFMLY00
# FCFRNS00
# FCSCHL00
# FCLIFE00

# Create a new dataframe with the interview_age11_satisfied, interview_age14_satisfied, interview_age17_satisfied
# satisfied = pd.DataFrame({'interview_age11_satisfied': interview_age11_satisfied, 'interview_age14_satisfied': interview_age14_satisfied, 'interview_age17_satisfied': interview_age17_satisfied})
# print(satisfied.describe())