export function getOption(list, name) {
	return list.find(l => l.name == name);
}

export function findOption(rootOption, path: string[]) {
	let current = rootOption;

	path.forEach(p => {
		current = current.options.find(o => o.name == p);

		if (current == null)
			return null;
	});

	return current;
}