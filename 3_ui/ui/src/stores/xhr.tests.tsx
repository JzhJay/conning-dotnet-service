import {user} from 'stores/user';
import {xhr} from 'stores/xhr';
import {expect, ITestable, testScheduler} from 'test';

class XhrTests implements ITestable {
	describeTests = () => {
		describe("secure header", function() {

			let validationId;


			it("dotNet - basic request protect", async function () {
				this.timeout(10 * 1000);
				const resp = await xhr.get<any>(`${user.dotNetUserRoute}/profile`, null, null, true);
				expect(resp.header["strict-transport-security"]).to.eq("max-age=631138519; includeSubDomains");
				expect(resp.header["x-content-type-options"]).to.eq("nosniff");

				validationId = resp.req.header["x-conning-validation-id"];
				expect(validationId).to.not.eq(undefined, "request header properties: 'x-conning-validation-id' should be exist");
			});

			it("dotNet - HTML protect", async function () {
				this.timeout(10 * 1000);
				const host = location.host;
				const resp = await xhr.get<any>(`${location.protocol}//${host}/api/views/react/`, null, null, true);

				// same as HTTPS protect
				expect(resp.header["strict-transport-security"]).to.eq("max-age=631138519; includeSubDomains");
				expect(resp.header["x-content-type-options"]).to.eq("nosniff");

				// only applied to text/html responses
				expect(resp.header["x-frame-options"]).to.eq("SAMEORIGIN");
				expect(resp.header["x-xss-protection"]).to.eq("1; mode=block");
				expect(resp.header["content-security-policy"]).to.not.eq(undefined, "response header properties: 'Content-Security-Policy' should be exist");
				const csp = resp.header["content-security-policy"].split(';').map(t => t.trim());

				expect(_.includes(csp, "report-uri /api/aws/reportCspViolation")).to.eq(true, "content security policy should have report-uri");
				expect(_.includes(csp, "report-to csp-endpoint")).to.eq(true, "content security policy should have custom directive: report-to");

				['script-src'].forEach( src => {
					expect(_.some(csp, t => t.indexOf(src) == 0 && t.indexOf("'unsafe-eval'") > 0)).to.eq(true, `content security policy source [${src}] should include 'unsafe-eval'`);
				});

				['script-src'].forEach( src => {
					expect(_.some(csp, t => t.indexOf(src) == 0 && t.indexOf("'nonce-") > 0)).to.eq(true, `content security policy source [${src}] should include 'nonce'`);
				});

				['script-src', 'frame-ancestors', 'default-src', 'connect-src', 'frame-src', 'style-src', 'font-src', 'img-src'].forEach( src => {
					expect(_.some(csp, t => t.indexOf(src) == 0 && t.indexOf("'self'") > 0)).to.eq(true, `content security policy source [${src}] should include 'self'`);
				});
			})

			it("julia - basic request protect", async function () {
				const host = location.host;
				const resp = await xhr.post<any>(
					`${location.protocol}//${host}/julia/dev-only/console/print`,
					{text: 'test headers', color: 'gary'},
					{fullResponse: true});
				expect(resp.header["x-conning-validation-id"]).to.eq(validationId, `the [x-conning-validation-id] should as same as dotNet's return`);
			});
		});
	}
}

testScheduler.register(new XhrTests());