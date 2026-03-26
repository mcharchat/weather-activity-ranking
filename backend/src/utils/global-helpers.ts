import { configRegistry } from "../config/index.js";

const config = (dotNotationPath: string) => {
	const keys: string[] = dotNotationPath.split(".");
	const fileName: string = keys[0];
	const valuePath: string[] = keys.slice(1);

	try {
		const file = configRegistry[fileName as keyof typeof configRegistry];

		if (!file) {
			throw new Error(`Config file '${fileName}' not found in registry`);
		}

		return valuePath.reduce((acc, key) => {
			if (acc && typeof acc === "object" && key in acc) {
				return (acc as any)[key];
			} else {
				throw new Error(`Key '${key}' not found in config path`);
			}
		}, file);
	} catch (error) {
		console.error(`Error loading config for path: ${dotNotationPath}`, error);
		throw new Error(`Config not found for path: ${dotNotationPath}`);
	}
};

export { config };
