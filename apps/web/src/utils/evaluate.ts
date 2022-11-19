const tryEval = (command: string) => {
	try {
		// eslint-disable-next-line no-eval
		return eval(command);
	} catch (e) {
		return (e as Error).message;
	}
};

// eslint-disable-next-line @typescript-eslint/no-implied-eval
export const functionEval = (func: string) => new Function(`return ${func};`)();

export default tryEval;
