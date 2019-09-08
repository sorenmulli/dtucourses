export interface ICoursesMin {
	time: Date,
	courses: {
		[key: string]: ICourseMin,
	},
}

export interface ICourseMin {
	course_no: string,
	name: string,
	language: string,
	ECTS: number,
	time: string,
	level: string,
}

export interface ICourse {
	info: ICourseMin,
	grades?: {
		time: string,
		N_exam: number,
		N_passed: number,
		exam_avg: number,
		grade_dist?: number[],
	}[],
	evals?: {
		time: string,
		N_responses: number,
		learning_answers: number[],
		participation_answers: number[],
		material_answers: number[],
		clear_answers: number[],
		connection_answers: number[],
		worklevel_answers: number[],
		prerequisite_answers: number[],
		good_answers: number[],
	}[],
	eval_points?: {
		time: string,
		learning: number,
		worklevel: number,
		good: number,
		N: number,
	}[],
	grade_percentile: number,
	eval_percentiles: {
		learning: number,
		worklevel: number,
		good: number,
	},
	composits: {
		beer_points: number,
		quality_points: number,
		beer_percentiles: number,
		quality_percentiles: number,
	}
}


