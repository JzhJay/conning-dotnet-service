/**
 * Builds a complete/full list of percentile values which includes the reflected values not specified.
 * Also performs validity checking.
 * @param percentileValues  Array of percentiles
 * @param performReflection do number reflection. if not set, do reflection when all percentile values <= 50.
 * @returns {Array} Complete list including percentiles >50
 */
export function getFullPercentileValues(percentileValues, performReflection?: boolean) {
    let percentiles: number[] = [];
    let hasCenterPercentile = false;

    if (`${percentileValues[percentileValues.length-1]}` == ';') {
	    performReflection = false;
	    percentileValues = [...percentileValues];
	    percentileValues.pop();
	}

    // Copy valid percentiles from input values
    for (let i = 0; i < percentileValues.length; i++) {
    	let pValue = percentileValues[i];
    	if (typeof pValue == 'number') {
    		if (isNaN(pValue)) {
    			continue;
		    }
	    } else if (_.isNumber(percentileValues[i])) {
		    pValue = parseFloat(pValue);
	    } else {
    		continue;
	    }

    	if( pValue < 0 || pValue > 100)
		    continue;

        percentiles.push(pValue);
	    hasCenterPercentile = hasCenterPercentile || pValue === 50;

        // only reflect the values when there are no other values > 50 when performReflection not set.
        if (performReflection == null && pValue > 50)
            performReflection = false;
    }

    if (performReflection !== false) {
        // Add a center point at 50 if not already present
        if (!hasCenterPercentile && percentiles.length > 0)
            percentiles.push(50);

        // Calculate the other half of the percentiles
        for (let i = percentiles.length - 1; i >= 0; i--) {
            if (percentiles[i] !== 50)
                percentiles.push(100 - percentiles[i]);
        }
    }

	// remove duplicate values
	percentiles = percentiles.sort((x,y) => x - y);
    percentiles = percentiles.filter((value, i) => i == 0 || value != percentiles[i - 1]);

    return percentiles;
}
