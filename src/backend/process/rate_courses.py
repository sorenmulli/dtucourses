import numpy as np

from os import chdir, getcwd
from os.path import dirname, realpath
chdir(realpath(dirname(__file__)) + "/../../..")

import json


'''
My job: I receive the course data downloaded from the DTU website and create meaningful metrics for all courses.
'''

newest_file = '2019-08-25T201957complete_raw_data.json'



def course_compare(file):
	#Scores corresponding to different answer possibilities
	scores = np.array([4, 3, 2, 1, 0])

	#Load raw data
	with open('src/backend/data/' + file, 'r+') as fp:
		data = json.load(fp)
	
	raw_courses_dict = data["courses"]

	finished_database = {"time": data["time"]}

	#Lists of all course values in convenient list format for ranking

	point_course_numbers = list()
	current_learning_points = list()
	current_worklevel_points = list()
	current_good_points = list()
	
	grade_course_numbers = list()
	current_grade_avgs = list()
	
#	i = 0
	for course_no, course_dict in raw_courses_dict.items():
#		i += 1
#		if i > 10: raise ValueError 
		print(course_no)
		
		#Dict for all neded info for output JSON file
		course_information = dict()
		course_information["info"] = course_dict["info"]

	
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
				worklevel_points = scores @ eval_dict["worklevel_answers"] / N
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
			point_course_numbers.append(course_no)

			current_learning_points.append(eval_points[0]["learning"])
			current_worklevel_points.append(eval_points[0]["worklevel"])
			current_good_points.append(eval_points[0]["good"])
		
		
		
		
		if len(course_dict["grades"]) > 0:
			#Rearrange grades into list
			course_information["grades"] = [
			{"time": grade_time, **old_grade_dict} for grade_time, old_grade_dict in course_dict["grades"].items()
			][::-1]

			newest_grades = course_information["grades"][0]

			grade_course_numbers.append(course_no)
			current_grade_avgs.append(newest_grades["exam_avg"])

		finished_database[course_no] = course_information

	with open('src/backend/data/finished.json', 'w+') as fp:
		json.dump(finished_database, fp, indent=4)

if __name__ == "__main__":
	course_compare(newest_file)