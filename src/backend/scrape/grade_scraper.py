import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_all_grades(course_n):
	grade_information = dict()

	winter_lim = datetime(datetime.now().year+1, 1, 1)
	summer_lim = datetime(datetime.now().year, 6, 1)

	for year in range(2010, datetime.now().year+1):

		# Tries summer
		if year < datetime.now().year or datetime.now() > summer_lim:
			url = 'http://karakterer.dtu.dk/Histogram/1/%s/Summer-%s' % (course_n, str(year))
			result = scrape_grades_url(url)
			if result:
				grade_information[str(year) + "summer"] = result

		# Tries winter
		if year < datetime.now().year or datetime.now() > winter_lim:
			url = 'http://karakterer.dtu.dk/Histogram/1/%s/Winter-%s' % (course_n, str(year))
			result = scrape_grades_url(url)
			if result and (year == datetime.now().year and datetime.now() >= winter_lim):
				grade_information[str(year) + "winter"] = result

	return grade_information


def scrape_grades_url(url):
	"""

	TODO:
		-- Request error handling
		-- HTML and typecasting error handling
		-- Control information version
	"""
	wanted_strings = ["Fremmødte", "Antal bestået", "Eksamensgennemsnit"]
	result = dict()

	#HTTP request and BS parsing
	page = requests.get(url)
	soup = BeautifulSoup(page.text, 'html.parser')
	
	if "Error" in soup.title:
		return False
	
	grade_info = soup.find(id = 'karsumForm')
	
	### Grab header information
	try:
		header_td_list = grade_info.find_all('td', style = 'padding-right: 2em')
	except:
		return False

	header_scraped_strings = dict()
	for td in header_td_list:
		for wanted_string in wanted_strings:
			if wanted_string in td.string:
				info_td = td.parent.contents[3].string
				header_scraped_strings[wanted_string] = info_td.split()[0]
	try:
		result["N_exam"] = int(header_scraped_strings['Fremmødte']) #ERROR HANDLING!?!?!?!?
		result["N_passed"] = int(header_scraped_strings['Antal bestået'])
		result["exam_avg"] = float(header_scraped_strings['Eksamensgennemsnit'].replace(',', '.'))
	except:
		return False

	#### Grab grade table information
	grade_table = grade_info.find_all("table")[1]
	
	grade_Ns = list()
	for grade_td in grade_table.find_all("td", style = "text-align: center"):
		grade_Ns.append(int(grade_td.string))									#ERROR HANDLING!?!?!?!??!?!

	result["grade_dist"] = grade_Ns

	if not len(grade_Ns) in [8, 9, 10, 11]: #Assert that standard 7-step system has been used
		return False

		
	return result
