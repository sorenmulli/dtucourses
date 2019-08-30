import numpy as np

from os import chdir, getcwd
from os.path import dirname, realpath
chdir(realpath(dirname(__file__)) + "/../../..")

import json

newest_file = '2019-08-25T201957complete_raw_data.json'




def course_compare(file):
	#Scores corresponding to different answer possibilities
	scores = np.array([4, 3, 2, 1, 0])

	#Load raw data
	with open('src/backend/data/' + file, 'r+') as fp:
		data = json.load(fp)
	
	course_dict = data["courses"]

	#Lists of all course values

	course_numbers = list()

	current_learning_points = list()
	current_worklevel_points = list()
	current_good_points = list()
	
	current_grade_avgs = list()
	
	i = 0
	for course_no, course_dict in course_dict.items():
		i += 1
		if i > 10: raise ValueError 
		print(course_no)
		#Dict for all neded info for output JSON file
		course_information = dict()

		course_information["grades"] = course_dict["grades"]
		course_information["evals"] = course_dict["evals"]		 				
		course_information["info"] = course_dict["info"]


		
		eval_points = dict()

		for eval_time, eval_dict in course_dict["evals"].items():
			#Translate each evaluation into points
			N = eval_dict["N_responses"]

			learning_points = scores @ eval_dict["learning_answers"] / N
			worklevel_points = scores @ eval_dict["worklevel_answers"] / N
			good_points = scores @ eval_dict["good_answers"] / N
			
			eval_points[eval_time] = {
				"learning": learning_points,
				"worklevel": worklevel_points,
				"good": good_points,
				"N": N
				}

			course_information["eval_points"] = eval_points

		#Save points in list formats
		course_numbers.append(course_no)

		current_learning_points.append(learning_points)
		current_worklevel_points.append(worklevel_points)
		current_good_points.append(good_points)

		#Access newest grades and solving python type issue
		newest_grades_list = list(course_information["grades"].values())[-1:]
		
		if newest_grades_list > 0:
			newest_grades = newest_grades_list[0]
			
		print(newest_grades["exam_avg"])


if __name__ == "__main__":
	course_compare(newest_file)