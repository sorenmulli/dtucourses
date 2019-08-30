export interface ICourses {
	time: Date,
	courses: {
		[key: string]: ICourse,
	},
}

export interface ICourse {
	info: {
		course_no: string,
		name: string,
		language: string,
		ECTS: number,
		time: string,
		level: string
	},
	grades?: {
		[key: string]: {
			N_exam: number,
			N_passed: number,
			exam_avg: number,  // 0: Værdi, 1: Percentil
			grade_dist?: number[],
		}
	},
	evals?: {
		[key: string]: {
			N_responses: number,
			learning_answers: number[],
			participation_answers: number[],
			material_answers: number[],
			clear_answers: number[],
			connection_answers: number[],
			worklevel_answers: number[],
			good_answers: number[],
		}
	}
}


