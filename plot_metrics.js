/* Plotter
* https://www.npmjs.com/package/plotter
*
* dependencies: 
* brew install gnuplot
* npm install plotter
* 
*/

var plot = require('plotter').plot;

var Plotter = {

    plotRTTs: (rttMap, outputFile) => {
        plot({
            data: { 'RTT': rttMap }, //Object.keys(rttMap).map((k)=>rttMap[k]),
            filename: outputFile,
            format: 'png',
            style: 'linespoints', // lines, points, linespoints
            title: 'RTT vs download timestamp',
            xlabel: 'Time',
            ylabel: 'rtt (milliseconds)',
            decimalsign: ',',
            hideSeriesTitle: true,
            // yFormat: '%.2f s',
            // time: '%H:%M:%S',
            // logscale: true,
        });
    },

    plotE2Edelay: (streamMetrics, outputFile) => {
        var delayList = streamMetrics.frameMetrics.map((f)=>f.e2e_delay);
        plot({
            data: delayList,
            filename: outputFile,
            format: 'png',
            style: 'linespoints', // lines, points, linespoints
            title: 'E2E Delay',
            xlabel: 'Time',
            ylabel: 'E2E delay (seconds)',
            xRange: {
                min: parseInt(streamMetrics.E2E_delay.min),
                max: parseInt(streamMetrics.E2E_delay.max),
            },
            yRange: {
                min: 0,
                max: 1000,
            },
            decimalsign: '.',
            hideSeriesTitle: true,
        });
    }

};

module.exports = Plotter;