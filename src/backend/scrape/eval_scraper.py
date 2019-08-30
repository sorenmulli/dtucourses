import requests
from bs4 import BeautifulSoup

import json
def scrape_all_evals(course_n):
	eval_information = dict()

	#Establish connection to CourseSearch
	page = requests.post('https://evaluering.dtu.dk/CourseSearch', data = 
		{"courseNumber":course_n,
		"termUid":"",
		"SearchButton":"Søg"}
	)

	if page.status_code != 200:
		print("Course eval page could not be reached, code: %s, course: %s" % (page.status_code, course_n)) 
		raise ValueError

	soup = BeautifulSoup(page.text, 'html.parser')
#	with open("src/backend/scrape/ex.html", 'r+') as outfile:
#		outfile.write(soup.prettify())
	
	#Get all evaluation results from courseSearch
	result_list = soup.find('div', id = 'CourseList')
	try:
		all_results = result_list.find_all('div', class_ = 'ResultsPublicRow')
	except:
		raise Exception("No course eval results")

	for result in all_results:
		info = result.a

		#Assure that right course is found
		found_course = info.find('div', class_ = "CourseNumber")
		if found_course.string != course_n:
			print(found_course.string)
			continue
		
		#Get term and url from the result
		found_term = info.find('div', class_ ='Term').string
		url = 'http://evaluering.dtu.dk' + info["href"]

		
		#Go to the answer page
		answers = scrape_eval_url(url)
		if answers:
			eval_information[found_term] = answers
	
	return eval_information


def scrape_eval_url(url):
	"""
	TODO:
		-- Request error handling
		-- Control information version

	"""
	result = dict()
	question_names = ["learning_answers", "participation_answers", "material_answers", "clear_answers", "connection_answers", "worklevel_answers", "prerequisite_answers", "good_answers"]

	#HTTP request and BS parsing
	page = requests.get(url)
	soup = BeautifulSoup(page.text, 'html.parser')

	if "No access" in soup.title:
		return False

	### Grab number of responses
	result_container = soup.find(id = "CourseResultsPublicContainer")
	n_tr = result_container.table.find_all("tr")[1]
	try: 
		result["N_responses"] = int(n_tr.td.string)
	except KeyError:
		return False

	if result["N_responses"] == 0:
		return False

	### Grab responses
	question_objects = soup.find_all(class_ = "ResultCourseModelWrapper grid_6 clearmarg")
	if len(question_objects) != 9: # assert that only the nine questions are received
		return False

	for i, question in enumerate(question_objects[:8]):
		answerobject = question.find_all(class_ = "Answer_Result_Background")
		answers = list()

		for answer in answerobject:
			answers.append(int(answer.span.string))
		assert len(answers) == 5 # assert that only five possible answers are received

		result[question_names[i]] = answers

	return result

