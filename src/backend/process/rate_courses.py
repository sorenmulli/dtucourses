import numpy as np

import os
from os.path import dirname, realpath
os.chdir(realpath(dirname(__file__)) + "/../../..")

import json
from copy import copy

from scipy.stats import percentileofscore

'''
My job: I receive the course data downloaded from the DTU website and create meaningful metrics for all courses.
'''

newest_file = 'complete_raw_data.json'


def getpercentiles(scorelist):
	full_list = np.copy(scorelist)

	sorted_list = sorted(full_list[full_list != None])
	percentiles = [percentileofscore(sorted_list, i) for i in full_list[full_list != None]]
	
	full_list[full_list != None] = percentiles
	return full_list


def course_compare(file):
	#Scores corresponding to different answer possibilities
	scores = np.array([4, 3, 2, 1, 0])

	#Load raw data
	with open('src/backend/data/' + file, 'r+') as fp:
		data = json.load(fp)
	
	raw_courses_dict = copy(data)
	del raw_courses_dict["time"]

	courses = list()

	composite_courses = list()

	current_learning_points = list()
	current_worklevel_points = list()
	current_good_points = list()
	
	current_grade_avgs = list()
	
	for course_no, course_dict in raw_courses_dict.items():
		print(course_no)

		#Dict for all neded info for output JSON file
		course_information = dict()
		course_information["info"] = course_dict["info"]

		composite = True
		if "evals" in course_dict and len(course_dict["evals"]) > 0:
			#Rearrange evals into lists
			course_information["evals"] = [
			{"time": eval_time, **old_eval_dict} for eval_time, old_eval_dict in course_dict["evals"].items()
			][::-1]
		
			eval_points = list()	

			#Translate each evaluation into points [0:10]
			for eval_dict in course_information["evals"]:
				N = eval_dict["N_responses"]
			
				learning_points = scores @ eval_dict["learning_answers"] / N * 2.5
				worklevel_points = scores @ eval_dict["worklevel_answers"][::-1] / N * 2.5
				good_points = scores @ eval_dict["good_answers"] / N * 2.5
				
				points = {
					"time": eval_dict["time"],
					"learning": learning_points,
					"worklevel": worklevel_points,
					"good": good_points,
					"N": N,
					}
				eval_points.append(points)
		
			course_information["eval_points"] = eval_points
		
			#Save points in list formats
			current_learning_points.append(eval_points[0]["learning"])
			current_worklevel_points.append(eval_points[0]["worklevel"])
			current_good_points.append(eval_points[0]["good"])

			
		else:

			current_learning_points.append(None)
			current_worklevel_points.append(None)
			current_good_points.append(None)

			composite = False
		
		
		
		if len(course_dict["grades"]) > 0:
			#Rearrange grades into list
			course_information["grades"] = [
			{"time": grade_time, **old_grade_dict} for grade_time, old_grade_dict in course_dict["grades"].items()
			][::-1]
			
			newest_grades = course_information["grades"][0]

			current_grade_avgs.append(newest_grades["exam_avg"])

		else:
			current_grade_avgs.append(None)
			composite = False

		course_information["course_no"] = course_no
		composite_courses.append(composite)
		courses.append(course_information)
	
	# Sorts courses by course number
	courses.sort(key = lambda x: x["course_no"])
	#Lists of all course values in convenient list format for ranking
	all_course_numbers = tuple(map(lambda x: x["course_no"], courses))

############### PREPERATION FINISHED ##############################
	#Convert to np array
	learning_arr = np.array(current_learning_points)
	worklevel_arr = np.array(current_worklevel_points)
	good_arr = np.array(current_good_points)


	pure_grade_arr = np.array(current_grade_avgs)

	#Scale grade averages to [0:10]. Complicated syntax is for preserving the Nones
	scaled_grade_arr = np.copy(pure_grade_arr)
	scaled_grade_arr[scaled_grade_arr != None] = (scaled_grade_arr[scaled_grade_arr != None] + 3) * 10 / 15

	
	#Create composite scores and scale to [0:4]. Complicated initialization and syntax is for preserving Nones
	beer_arr = np.full(len(all_course_numbers) , None)
	quality_arr = np.full(len(all_course_numbers) , None)

	beer_arr[composite_courses] = scaled_grade_arr[composite_courses] - worklevel_arr[composite_courses]
	quality_arr[composite_courses] = learning_arr[composite_courses]  + good_arr[composite_courses] + pure_grade_arr[composite_courses] - worklevel_arr[composite_courses]

	beer_arr[composite_courses] = (beer_arr[composite_courses] - beer_arr[composite_courses].min())  * 10 / (beer_arr[composite_courses].max() - beer_arr[composite_courses].min())
	quality_arr[composite_courses] = (quality_arr[composite_courses] - quality_arr[composite_courses].min())  * 10 / (quality_arr[composite_courses].max() - quality_arr[composite_courses].min())

	#Create percentile versions of all measures
	learning_percentiles = getpercentiles(learning_arr)
	worklevel_percentiles = getpercentiles(worklevel_arr)
	good_percentiles = getpercentiles(good_arr)

	grade_percentiles = getpercentiles(pure_grade_arr)
	
	beer_percentiles = getpercentiles(beer_arr)
	quality_percentiles = getpercentiles(quality_arr)
	
	#Save everything in final data base
	for i, course_no in enumerate(all_course_numbers):
		courses[i]["grade_percentile"] = grade_percentiles[i]
	
		percentiles = {
			"learning": learning_percentiles[i],
			"worklevel": worklevel_percentiles[i],
			"good": good_percentiles[i]
		}

		courses[i]["eval_percentiles"] = percentiles

		composites = {
			"beer_points": beer_arr[i],
			"quality_points": quality_arr[i],
			"beer_percentiles": beer_percentiles[i],
			"quality_percentiles": quality_percentiles[i]
		}
		courses[i]["composites"] = composites 
			# nowtime
	# Clears data/courses and saves
	folder = "src/backend/data/courses"
	for f in os.listdir(folder):
		fp = os.path.join(folder, f)
		try:
			os.unlink(fp)
		except:
			print("Failed to remove file %s" % f)
	
	finished_database = {"time": data["time"], "courses": courses}
	for i, course_no in enumerate(all_course_numbers):
		with open("src/backend/data/courses/%s.json" % course_no, "w") as f:
			json.dump(finished_database["courses"][i], f)

	#Serialize new db
	with open('src/backend/data/db.json', 'w+') as fp:
		json.dump(finished_database, fp)

def create_course_min():
	# expand for more details, used for course overview
	with open("src/backend/data/db.json") as f:
		course_list = json.load(f)
		course_min = {"time": course_list["time"], "courses": list()}
		for course in course_list["courses"]:
			course_min["courses"].append(course["info"])
			
	with open("src/backend/data/course_min.json", "w") as m:
		json.dump(course_min, m)
	with open("src/frontend/src/assets/course_min.json", "w") as f:
		json.dump(course_min, f)

def create_course_expand():

	with open("src/backend/data/db.json") as f:
		courses = json.load(f)["courses"]
		courses_expand = []
		for course in courses:
			course_expand = course["info"]
			try:
				course_expand["exam_avg"] = course["grades"][0]["exam_avg"]
			except (KeyError, IndexError):
				course_expand["exam_avg"] = None
			try:
				course_expand["good"] = course["eval_points"][0]["good"]
			except (KeyError, IndexError):
				course_expand["good"] = None
			try:
				course_expand["worklevel"] = course["eval_points"][0]["worklevel"]
			except (KeyError, IndexError):
				course_expand["worklevel"] = None
			course_expand["beer"] = course["composites"]["beer_points"]
			course_expand["quality"] = course["composites"]["quality_points"]
			courses_expand.append(course_expand)
	
	with open("src/backend/data/courses_expand.json", "w") as f:
		json.dump(courses_expand, f)


if __name__ == "__main__":

	course_compare(newest_file)
	create_course_min()
	create_course_expand()
