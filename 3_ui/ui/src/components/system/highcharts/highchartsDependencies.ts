import * as Highcharts from 'highcharts';

import more from 'highcharts/highcharts-more';
import highcharts3d from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import boost from 'highcharts/modules/boost';
import draggablePoints from 'highcharts/modules/draggable-points';

more(Highcharts);
highcharts3d(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);
boost(Highcharts);
draggablePoints(Highcharts);

(require('lib/highcharts/highcharts-regression') as any)(Highcharts);

export default Highcharts;
