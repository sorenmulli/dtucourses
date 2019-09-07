import os
from os.path import dirname, realpath
os.chdir(realpath(dirname(__file__)))

# Indsætter js-filer direkte i index.html, da den ellers ikke kan finde dem

with open("../../docs/index.html") as f:
	content = f.readlines()
	line = content[12]
	src_indices = [i for i, x in enumerate(line) if line[i:i+4] == "src="]
	# Læser filnavne
	files = []
	for i in src_indices:
		start = i + line[i:].index('"')
		end = start + line[start+1:].index('"')
		files.append(line[start+1:end+1])
	# Fjerne src=
	for i in reversed(src_indices):
		line = line[:i] + line[i+5+line[i+5:].index('"')+2:]
	# Indsætter js
	js_indices = [i+1 for i, x in enumerate(line) if line[i:i+9] == "></script"]
	for i, path in zip(reversed(js_indices), reversed(files)):
		with open("../../docs/%s" % path) as js:
			line = line[:i] + js.read() + line[i:] + "\n"
		os.remove("../../docs/%s" % path)
	content = content[:12] + line.split("\n") + content[13:]

with open("../../docs/index.html", "w") as f:
	f.writelines(content)


