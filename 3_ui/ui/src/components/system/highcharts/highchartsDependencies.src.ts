import * as Highcharts from 'highcharts/highcharts.src';

import more from 'highcharts/highcharts-more.src';
import highcharts3d from 'highcharts/highcharts-3d.src';
import exporting from 'highcharts/modules/exporting.src';
import offlineExporting from 'highcharts/modules/offline-exporting.src';
import boost from 'highcharts/modules/boost.src';
import draggablePoints from 'highcharts/modules/draggable-points.src';

more(Highcharts);
highcharts3d(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);
boost(Highcharts);
draggablePoints(Highcharts);

(require('lib/highcharts/highcharts-regression') as any)(Highcharts);

export default Highcharts;