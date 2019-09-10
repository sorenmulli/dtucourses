import os
from os.path import dirname, realpath
os.chdir(realpath(dirname(__file__)))

# Indsætter css- og js-filer direkte i index.html, da den ellers ikke kan finde dem

with open("../../docs/index.html") as f:
	content = f.readlines()
	cssline = content[9]
	print(cssline)
	pindex = cssline.index("href=") + 6
	endindex = cssline[pindex+1:].index('"') + pindex + 1
	path = "../../docs/%s" % cssline[pindex:endindex]
	with open(path) as css:
		content[9] = "<style>" + css.read() + "</style>\n"
	os.remove(path)

	jsline = content[12]
	src_indices = [i for i, x in enumerate(jsline) if jsline[i:i+4] == "src="]
	# Læser filnavne
	files = []
	for i in src_indices:
		start = i + jsline[i:].index('"')
		end = start + jsline[start+1:].index('"')
		files.append(jsline[start+1:end+1])
	# Fjerne src=
	for i in reversed(src_indices):
		jsline = jsline[:i] + jsline[i+5+jsline[i+5:].index('"')+2:]
	# Indsætter js
	js_indices = [i+1 for i, x in enumerate(jsline) if jsline[i:i+9] == "></script"]
	for i, path in zip(reversed(js_indices), reversed(files)):
		with open("../../docs/%s" % path) as js:
			jsline = jsline[:i] + js.read() + jsline[i:] + "\n"
		os.remove("../../docs/%s" % path)
	content = content[:12] + jsline.split("\n") + content[13:]

with open("../../docs/index.html", "w") as f:
	f.writelines(content)


