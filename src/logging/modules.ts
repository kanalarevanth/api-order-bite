type ModuleNames = keyof typeof modules;
type Feature<T extends ModuleNames> = (typeof modules)[T][number];

export type Module<T extends ModuleNames> = {
	module: T;
	feature: Feature<T>;
};

const modules = {
	user_management: ['auth'],
} as const;
