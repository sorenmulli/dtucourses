import numpy as np

from os import chdir, getcwd
from os.path import dirname, realpath
chdir(realpath(dirname(__file__)) + "/../../..")

import json

from scipy.stats import percentileofscore
'''
My job: I receive the course data downloaded from the DTU website and create meaningful metrics for all courses.
'''

newest_file = '2019-08-25T201957complete_raw_data.json'


def getpercentiles(scorelist):
	full_list = np.copy(scorelist)

	sorted_list = sorted(full_list[full_list != None])
	percentiles = [percentileofscore(sorted_list, i) for i in full_list[full_list != None]]
	
	full_list[full_list != None] = percentiles
	return full_list


def course_compare(file):
	#Scores corresponding to different answer possibilities
	scores = np.array([5, 4, 3, 2, 1])

	#Load raw data
	with open('src/backend/data/' + file, 'r+') as fp:
		data = json.load(fp)
	
	raw_courses_dict = data["courses"]

	courses = dict()

	#Lists of all course values in convenient list format for ranking
	all_course_numbers = list()

	composite_courses = list()

	current_learning_points = list()
	current_worklevel_points = list()
	current_good_points = list()
	
	current_grade_avgs = list()
	
	for course_no, course_dict in raw_courses_dict.items():
		print(course_no)
		all_course_numbers.append(course_no)

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

			#Translate each evaluation into points
			for eval_dict in course_information["evals"]:
				N = eval_dict["N_responses"]
			
				learning_points = scores @ eval_dict["learning_answers"] / N
				worklevel_points = scores @ eval_dict["worklevel_answers"][::-1] / N
				good_points = scores @ eval_dict["good_answers"] / N
				
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

		
		composite_courses.append(composite)
		courses[course_no] = course_information	

############### PREPERATION FINISHED ##############################
	#Convert to np array
	learning_arr = np.array(current_learning_points)
	worklevel_arr = np.array(current_worklevel_points)
	good_arr = np.array(current_good_points)


	pure_grade_arr = np.array(current_grade_avgs)

	#Scale grade averages to [1:5]. Complicated syntax is for preserving the Nones
	scaled_grade_arr = np.copy(pure_grade_arr)
	scaled_grade_arr[scaled_grade_arr != None] = (scaled_grade_arr[scaled_grade_arr != None] + 3) * 4 / 15 + 1

	
	#Create composite scores and scale to [1:5]. Complicated initialization and syntax is for preserving Nones
	beer_arr = np.full(len(all_course_numbers) , None)
	quality_arr = np.full(len(all_course_numbers) , None)

	beer_arr[composite_courses] = scaled_grade_arr[composite_courses] - worklevel_arr[composite_courses]
	quality_arr[composite_courses] = learning_arr[composite_courses]  + good_arr[composite_courses] + pure_grade_arr[composite_courses] - worklevel_arr[composite_courses]

	beer_arr[composite_courses] = (beer_arr[composite_courses] - beer_arr[composite_courses].min())  * 4 / (beer_arr[composite_courses].max() - beer_arr[composite_courses].min()) +1
	quality_arr[composite_courses] = (quality_arr[composite_courses] - quality_arr[composite_courses].min())  * 4 / (quality_arr[composite_courses].max() - quality_arr[composite_courses].min()) +1

	#Create percentile versions of all measures
	learning_percentiles = getpercentiles(learning_arr)
	worklevel_percentiles = getpercentiles(worklevel_arr)
	good_percentiles = getpercentiles(good_arr)

	grade_percentiles = getpercentiles(pure_grade_arr)
	
	beer_percentiles = getpercentiles(beer_arr)
	quality_percentiles = getpercentiles(quality_arr)
	
	#Save everything in final data base
	for i, course_no in enumerate(all_course_numbers):
		courses[course_no]["grade_percentile"] = grade_percentiles[i]
	
		percentiles = {
			"learning": learning_percentiles[i],
			"worklevel": worklevel_percentiles[i],
			"good": good_percentiles[i]
		}

		courses[course_no]["eval_percentiles"] = percentiles

		composites = {
			"beer_points": beer_arr[i],
			"quality_points": quality_arr[i],
			"beer_percentiles": beer_percentiles[i],
			"quality_percentiles": quality_percentiles[i]
		}
		courses[course_no]["composites"] = composites 
			
	finished_database = {"time": data["time"], "courses": courses}

	#Serialize new db
	with open('src/frontend/src/assets/db.json', 'w+') as fp:
		json.dump(finished_database, fp, indent=4)


if __name__ == "__main__":
	course_compare(newest_file)