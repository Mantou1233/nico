const curry = fn =>
	function next(...args) {
		return fn.length > args.length
			? (...nextArgs) => next(...args, ...nextArgs)
			: fn(...args);
	};

const range = (start, end) =>
	Array(end - start + 1)
		.fill(0)
		.map((x, index) => index + start);

const memo =
	(fn, memo = {}) =>
	arg => {
		if (arg in memo) return memo[arg];
		return (memo[arg] = fn(arg));
	};

export { curry, memo, range };
