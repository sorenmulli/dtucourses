import os, sys
os.chdir(sys.path[0])

import numpy as np
import json

with open("../data/complete_raw_data.json") as f:
	crd = json.load(f)

def avg_mean():
	grades = {}
	for course_no, course in crd.items():
		if course_no == "time":
			continue
		for period, info in course["grades"].items():
			if period in grades:
				grades[period].append(info["exam_avg"])
			else:
				grades[period] = [info["exam_avg"]]
	for period in grades.keys():
		grades[period] = np.array(list(filter(lambda x: x is not None, grades[period])))
		grades[period] = grades[period].mean()
	avgs = list()
	for period, avg in grades.items():
		avgs.append({"period": period, "avg": avg})
	avgs.sort(key = lambda x: x["period"])
	return avgs

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


if __name__ == "__main__":
	stats = {
		"avg_mean": avg_mean(),
		"grade_dist": grade_dist(),
	}
	with open("../data/stats.json", "w", encoding="utf-8") as f:
		json.dump(stats, f)
	
