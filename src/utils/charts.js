/**
 * Trigger chart resize to full width for Highcharts inside responsive elements
 */
export const triggerChartsResize = function () {
    window.dispatchEvent(new Event("resize"));
};
