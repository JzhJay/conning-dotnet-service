export function smartStringify(o: any) {
    let cache = [];
    return JSON.stringify(o, function (key, value) {
        if (key.startsWith('_') || (typeof value === 'object' && value != null)) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
}
