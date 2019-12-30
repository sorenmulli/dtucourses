import os, sys
os.chdir(sys.path[0])

import numpy as np
import json

with open("../data/complete_raw_data.json") as f:
	crd = json.load(f)

def grade_dist():
	grades = {}
	for course_no, course in crd.items():
		if course_no == "time":
			continue
		for period, info in course["grades"].items():
			dist = np.array(info["grade_dist"][:7])
			if period in grades:
				grades[period] += dist
			else:
				grades[period] = dist
	dists = list()
	for period, dist in grades.items():
		dists.append({"period": period, "dist": [int(x) for x in dist]})
	dists.sort(key = lambda x: x["period"])
	return dists

def mean_hist():
	dists = grade_dist()
	grades = [12, 10, 7, 4, 2, 0, -3]
	avgs = {}
	for pd in dists:
		period, dist = pd["period"], pd["dist"]
		avgs[period] = sum([x * y for x, y in zip(grades, dist)])
		avgs[period] /= sum(dist)
	avgs_list = list()
	for period, avg in avgs.items():
		avgs_list.append({"period": period, "avg": avg})
	return avgs


if __name__ == "__main__":
	stats = {
		"mean_hist": mean_hist(),
		"grade_dist": grade_dist(),
	}
	with open("../data/stats.json", "w", encoding="utf-8") as f:
		json.dump(stats, f)
	
