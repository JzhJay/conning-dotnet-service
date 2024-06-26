export class PathSearcher {
    constructor(public data) {

    }

    findClosestPath = (colIndex: number, value: number) => {
        let foundIndex = 0;

        foundIndex = this.binarySearchPermutationMatrix(colIndex, value, 0, this.data.individualScenariosSortedPerm[0].length - 1);

        if (foundIndex < 0) {
            foundIndex = (foundIndex + 1) * -1;

            if (foundIndex > 0) {
                // Binary search (on the sorted list) narrowed the search down to where the point should have been present at, from that we can infer that the point, or one of its neighbors
                // is closest to the search point. Note: The left neighbor is actually the returned midpoint
                if (Math.abs(this.valueFromPermutation(foundIndex, colIndex) - value) > this.valueFromPermutation(foundIndex + 1, colIndex) - value) {
                    foundIndex = foundIndex + 1;
                }
            }
        }

        return this.data.individualScenariosSortedPerm[colIndex][foundIndex];
    }



    /**
     * Maps the row col indices in the path permutation array to its value.
     * @param row   The row index
     * @param col   the col index
     * @returns {any}   The value in the onsorted matrix that matches the row col indeces
     */
    private valueFromPermutation = (row, col):number => {
        return this.data.individualScenarios[this.data.individualScenariosSortedPerm[col][row]][col];
    }

    /**
     * Binary search the permutation matrix to find a specified needle
     * @param colIndex  The column index to search
     * @param needle    The value being searched for
     * @param low       The low search bound
     * @param high      The high search bound.
     * @returns The index of the value if found. Negative 1 based index of the last search range midpoint if not found.
     */
    private binarySearchPermutationMatrix = (colIndex, needle, low, high) => {
        let mid = Math.floor((high + low) / 2);

        if (this.valueFromPermutation(mid, colIndex) === needle)
            return mid;
        else if (this.valueFromPermutation(low, colIndex) === needle)
            return low;
        else if (this.valueFromPermutation(high, colIndex) === needle)
            return high;
        else {

            if (low === high || low + 1 === high) {
                // didn't find the needle, however it would be in this spot if it was present
                return -(mid + 1);
            }

            if (needle < this.valueFromPermutation(mid, colIndex)) {
                return this.binarySearchPermutationMatrix(colIndex, needle, low, mid);
            }
            else {
                return this.binarySearchPermutationMatrix(colIndex, needle, mid, high);
            }
        }
    }
}
