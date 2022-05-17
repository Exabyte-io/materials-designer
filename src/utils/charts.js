/**
 * Trigger chart resize to full width for Highcharts inside responsive elements
 */
export function triggerChartsResize() {
    window.dispatchEvent(new Event("resize"));
}
