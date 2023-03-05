'''
Author: Aiden Li
Date: 2023-03-05 14:28:45
LastEditors: Aiden Li (i@aidenli.net)
LastEditTime: 2023-03-05 15:50:45
Description: Your description
'''
import pandas as pd
import json

taxo = pd.read_csv("taxo.csv")

data = []

for t in ["Power", "Intermediate", "Precision"]:
    for i in range(len(taxo)):
        if taxo["Type"][i] != t:
            continue
        meta = {
            "Id": i + 1,
            "Name": taxo["Name"][i],
            "Type": taxo["Type"][i],
            "Subtype": taxo["Subtype"][i],
            # "ThumbAbducted": taxo["ThumbAdducted"][i] == 0
        }
        data.append(meta)
    
json.dump(data, open("taxo.json", "w"))
