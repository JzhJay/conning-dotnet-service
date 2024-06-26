import {julia as juliaStore, xhr} from 'stores';
import {testScheduler, ITestable, expect, JULIA_TAG, verifyDownloadFile} from "test"
import * as utility from './utility';

class UtilityTests implements ITestable {
	describeTests = () => {
		describe('utility.formatLabelText function', function () {
			it("can transform a field's label to custom text if necessary", function () {
				const fieldName = "riskSolutionsVersion";

				expect(utility.formatLabelText(fieldName)).to.equal("Risk Solutions Version")
			});

			it("can transform a field's label to camel case and upper case 1st char of text if the field's is not needed to be customized", function () {
				expect(utility.formatLabelText("sourceType")).to.equal("Source Type")
			});
		});

		describe('utility.getHexColorFrom3ColorGradient function', function () {
			const color1 = [255, 0, 0];
			const color2 = [255, 255, 255];
			const color3 = [0, 128, 0];

			it("can get a color code (hex) from 3-Color gradient by an offset value between 0 and 1 ( < 0.5)", function () {
				expect(utility.getHexColorFrom3ColorGradient(0.3, color1, color2, color3)).to.equal("#ff9999")
			});

			it("can get a color code (hex) from 3-Color gradient by an offset value between 0 and 1 ( > 0.5)", function () {
				expect(utility.getHexColorFrom3ColorGradient(0.7, color1, color2, color3)).to.equal("#99cc99")
			});

			it("can get a color code (hex) from 3-Color gradient by an offset value between 0 and 1 (0, 0.5, 1)", function () {
				expect(utility.getHexColorFrom3ColorGradient(0, color1, color2, color3)).to.equal("#ff0000");
				expect(utility.getHexColorFrom3ColorGradient(0.5, color1, color2, color3)).to.equal("#ffffff");
				expect(utility.getHexColorFrom3ColorGradient(1, color1, color2, color3)).to.equal("#008000");
			});

			it("throws an exception if the offset value is not between 0 and 1", function () {
				expect(utility.getHexColorFrom3ColorGradient.bind(utility, 2, color1, color2, color3)).to.throw('Offset is out of range');
			});
		});

		describe(`utility export file`, function () {
			const juliaURL = `${juliaStore.url}/v1/export`;
			const testData = [["ABC","ABC","ABC"],["ABC","ABC","ABC"]];

			it(`utility.downloadCSVFile function ${JULIA_TAG}`, async function() {
				await utility.downloadCSVFile(testData);
				await verifyDownloadFile(expect, {
					type: "text/csv",
					fileName: "exportFile.csv"
				});
			});

			it(`utility.downloadXLSXFile function ${JULIA_TAG}`, async function() {
				await utility.downloadXLSXFile(testData);
				await verifyDownloadFile(expect, {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					fileName: "exportFile.xlsx"
				});
			});
		});
	}
}

testScheduler.register(new UtilityTests());