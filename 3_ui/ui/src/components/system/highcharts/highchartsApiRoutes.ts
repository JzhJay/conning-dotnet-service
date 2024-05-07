//
// import {getHighchartsPDFObject} from "./dataTemplates/pdfTemplate"
// import {getHighchartsCDFObject} from "./dataTemplates/cdfTemplate";
// import {getHighchartsConeObject} from "./dataTemplates/coneTemplate";
// import {getHighchartsBoxObject} from "./dataTemplates/boxTemplate";
// import {getFullPercentileValues} from "./chartUtils";
// import {getHighchartsScatterObject} from "./dataTemplates/scatterTemplate";
// import {getHighchartsHistogramObject} from "./dataTemplates/histogramTemplate";
// import {julia as julia} from 'stores/julia'
// import {QueryResult, queryResult} from 'stores/queryResult';
//
// const Boom = require('boom') as any;
//
// export const highchartApiRoutes = [
//     {
//         method: ['POST'],
//         path:   `/api/highcharts/data-template`,
//         config: {
//             description: `Returns a JSON document suitable for displaying in highcharts for a given report-item`,
//             payload:{
//                 maxBytes:10000000
//             },
//
//             /*validate: {
//
//
//
//              query: {
//              queryResultId: Joi.string(),
//              queryView: Joi.number()
//              }
//              },*/
//             handler: async function (request, reply) {
//                 try {
//                     const {chartType, queryResultId, userOptions, pivotMetadata, juliaHost} = request.payload;
//
//                     // Last connecting client wins - todo, this should just be passed along to the client api calls
//                     if (juliaHost && juliaHost !== julia.hostname) {
//                         console.log(`Updating julia host:  ${julia.hostname} -> ${juliaHost}`)
//                         julia.overrideHost(juliaHost)
//                     }
//
//                     console.log(`Handling chart request - ${chartType} - ${queryResultId}`);
//
//                     let resultPromise: Promise<any> = null;
//                     let chartData                   = null;
//
//                     let descriptor = await queryResult.loadResultDescriptor(queryResultId);
//                     let qr = new QueryResult(descriptor);
//
//                     switch (chartType) {
//                         case 'pdf': {
//                             const {percentiles, degreeOfSmoothingIndex} = userOptions;
//
//                             if (!percentiles || degreeOfSmoothingIndex == null) {
//                                 throw new Error(`Invalid input options:  ${userOptions}`)
//                             }
//
//                             let fullPercentiles = getFullPercentileValues(percentiles);
//                             resultPromise       = qr.highcharts.getPdfData(degreeOfSmoothingIndex, fullPercentiles).then(data => {
//                                 chartData = getHighchartsPDFObject(data, pivotMetadata, userOptions);
//                             })
//                         }
//                             break;
//                         case 'cdf': {
//                             resultPromise = qr.highcharts.getCdfData().then(data => {
//                                 chartData = getHighchartsCDFObject(data, pivotMetadata, userOptions);
//                             })
//                         }
//                             break;
//                         case 'cone':
//                         case 'box': {
//                             const {percentiles} = userOptions;
//
//                             if (!percentiles) {
//                                 throw new Error(`Invalid input options:  ${userOptions}`)
//                             }
//
//                             let fullPercentiles = getFullPercentileValues(percentiles);
//                             resultPromise       = qr.highcharts.getPercentileChartData(fullPercentiles, true).then(data => {
//                                 if (chartType === 'cone')
//                                     chartData = getHighchartsConeObject(data, pivotMetadata, userOptions);
//                                 else
//                                     chartData = getHighchartsBoxObject(data, pivotMetadata, userOptions);
//                             })
//
//                             break;
//                         }
//                         case 'histogram': {
//                             resultPromise = qr.highcharts.getHistogramData().then(data => {
//                                 chartData = getHighchartsHistogramObject(data, pivotMetadata, userOptions);
//                             })
//                         }
//                             break;
//                         case 'scatter': {
//                             resultPromise = qr.pivot.getData({subpivot: true})
//                                 .then(data => {
//                                     console.log('Converting data to scatter...');
//
//                                     // Construct a scatter chart with the data
//                                     chartData = getHighchartsScatterObject(data, pivotMetadata, userOptions);
//                                 });
//                         }
//                             break;
//                     }
//
//                     console.log(chartData);
//
//                     resultPromise.then(() => {
//                         reply(chartData);
//                     });
//                 }
//                 catch (error) {
//                     console.log("Error message " + error.message);
//                     let err                    = Boom.badData(error.message, error.stack);
//                     err.output.payload.details = err.data;
//                     reply(err);
//
//                     console.log(error.stack);
//                     console.log("Julia API error " + err.data);
//                 }
//             }
//         }
//     }
// ];
//
