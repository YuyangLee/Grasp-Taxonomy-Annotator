'''
Author: Aiden Li
Date: 2023-03-05 15:30:07
LastEditors: Aiden Li (i@aidenli.net)
LastEditTime: 2023-03-05 16:52:53
Description: Your description
'''
import json
import os
from collections import defaultdict

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

sns.set(rc={'figure.figsize':(16,4)})

choice_dir = "data/choices/raw"
grasp_list = "grasps/grasps.json"

grasps = json.load(open(grasp_list, "r"))
taxo = { g.split(".")[0]: [] for g in grasps }
# taxo = { g.split(".")[0]: [] for g in grasps }
choices = []
all_choices = []

n_count = 0

for file in os.listdir(choice_dir):
    if os.path.isdir(file) or not file.endswith(".json"):
        continue
    data = json.load(open(os.path.join(choice_dir, file), "r"))
    source = os.path.basename(file).split(".")[0]
    for g in data:
        taxo[g].append(data[g])
        choices.append(pd.DataFrame({
            "n_count": n_count,
            "grasp_id": g.split("/")[0] + "/" + g.split("/")[1][:8],
            "grasp": g,
            "choice": data[g],
            "source": source
        }, index=[0]))
        n_count += 1
        all_choices.append(data[g])
        
        
json.dump(taxo, open("data/choices/choices.json", "w"))
choices = pd.concat(choices)
choices.to_csv("data/choices/choices.csv", index=False)

all_choices = list(set(all_choices))
group_choices = choices.groupby(['grasp_id', 'choice']).count()['n_count'].unstack().fillna(0)
group_choices.plot(kind='bar', stacked=True)

plt.xlabel("Grasp ID")
plt.ylabel("# Taxonomy Choice")
plt.legend()

plt.xticks(rotation=45)
plt.tight_layout()

plt.savefig("data/choices/choices.png")
plt.savefig("data/choices/choices.pdf")
