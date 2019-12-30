export interface IStats {
	mean_hist: {
		period: string;
		avg: number;
	}[];
	grade_dist: {
		period: string;
		dist: number[];
	}[];
}

