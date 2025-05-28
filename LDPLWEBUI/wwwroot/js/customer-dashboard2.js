function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const dates = [];

    for (let i = 0; i < 6; i++) { // Monday to Saturday
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(formatDate(d));
    }

    return dates;
}

function getCurrentMonthDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based

    const lastDay = new Date(year, month + 1, 0).getDate();
    const dates = [];

    for (let i = 1; i <= lastDay; i++) {
        dates.push(formatDate(new Date(year, month, i)));
    }

    return dates;
}

function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function showNoDataPlaceholders(message, chartContainer) {

    const placeholderHTML = `
         <div class="apex-placeholder">
             <i class="ti ti-chart-histogram placeholder-icon"></i>
             <div class="text">${message || 'No data available'}</div>
         </div>`;

    const el = document.querySelector(chartContainer);
    if (el) {
        el.innerHTML = ''; // Clear existing chart
        el.classList.add('placeholder-container');
        el.innerHTML = placeholderHTML;
    }
}


function renderTab1Charts(tab1Data, r = 'W') {
    //validate data (if found)
    if (tab1Data && tab1Data.metricCards) {
        //metric cards - tab1
        const chartMap = {
            "TOTAL": { id: "#chart-total-orders-t1", sumId: "#count-total-orders-t1", label: "Total Orders", color: "#3b82f6" },
            "ANY_PENDING": { id: "#chart-pending-orders-t1", sumId: "#count-pending-orders-t1", label: "Pending Orders", color: "#f97316" },
            "ALL_APPROVED": { id: "#chart-approved-orders-t1", sumId: "#count-approved-orders-t1", label: "Approved Orders", color: "#06b6d4" },
            "ALL_EXECUTED": { id: "#chart-executed-orders-t1", sumId: "#count-executed-orders-t1", label: "Executed Orders", color: "#22c55e" }
        };
        const dataByType = {};

        let xAxisLabels = [];
        if (r === 'W') {
            xAxisLabels = getCurrentWeekDates();
        }
        else if (r === 'M') {
            xAxisLabels = getCurrentMonthDates();
        }

        $.each(chartMap, function (key) {
            dataByType[key] = {};
        });


        $.each(tab1Data.metricCards, function (i, item) {
            const type = item.chartType;
            if (!chartMap[type]) return;

            let [dd, mm, yyyy] = item.dayOrQuarter.trim().split("-");
            let dateKey = `${dd}-${mm}-${yyyy}`;

            if (!dataByType[type][dateKey]) {
                dataByType[type][dateKey] = 0;
            }
            dataByType[type][dateKey] += item.totalOrders;
        });

        const sparkOptions = (data, color, categories) => ({
            chart: {
                type: 'line',
                height: 50,
                sparkline: { enabled: true },
                animations: { enabled: true }
            },
            series: [{
                name: 'Orders',
                data: data
            }],
            stroke: { width: 2 },
            colors: [color],
            tooltip: {
                enabled: true,
                x: { show: true },
                y: { formatter: val => `${val} orders` }
            },
            xaxis: { categories }
        });


        $.each(chartMap, function (type, config) {
            const existingChart = $(config.id).data('chart');
            if (existingChart) {
                existingChart.updateOptions(sparkOptions([], config.color, []));
            }
        });

        $.each(chartMap, function (type, config) {
            const seriesData = [];
            let totalSum = 0;

            $.each(xAxisLabels, function (i, dateLabel) {
                const count = dataByType[type][dateLabel] ?? 0;
                totalSum += count;
                seriesData.push(count);
            });

            $(config.sumId).text(totalSum);

            const options = sparkOptions(seriesData, config.color, xAxisLabels);

            let chart = $(config.id).data('chart');
            if (chart) {
                chart.updateOptions(options);
            } else {
                chart = new ApexCharts($(config.id)[0], options);
                $(config.id).data('chart', chart);
                chart.render();
            }
        });

    }

    if (tab1Data && tab1Data.dateLastUpdated.trim()!=="") {
        //data last updated text
        const timestamp_container = document.querySelector(".text-dataupdate-time-t1");
        if (timestamp_container) {
            timestamp_container.textContent = "Data Last Updated: " + tab1Data.dateLastUpdated ?? "";
        }

    }
  
    

    if (tab1Data && tab1Data.orderTrends && tab1Data.orderTrends.length > 0) {
        //bar chart - tab1
        const container = document.querySelector("#chart-orders-bar-t1");
        if (!container) return;

        const labels = r === 'W' ? getCurrentWeekDates() : getCurrentMonthDates();
        const dataMap = Object.fromEntries(labels.map(label => [label, 0]));

        tab1Data.orderTrends.forEach(order => {
            let [dd, mm, yyyy] = order.orderDayOrQuarter.trim().split("-");
            let date = `${dd}-${mm}-${yyyy}`;

            if (dataMap.hasOwnProperty(date)) {
                dataMap[date] += order.orderCount;
            }
        });

        const chartData = labels.map(label => dataMap[label]);

        labels.forEach(function (value, index, array) {
            const dateParts = value.split('-');
            const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

            const options = { day: '2-digit', month: 'short' };
            array[index] = date.toLocaleDateString('en-GB', options);
        });


        const options = {
            chart: {
                type: 'bar',
                height: 350,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 500,
                    animateGradually: { enabled: true, delay: 100 },
                    dynamicAnimation: { enabled: true, speed: 300 }
                },
                toolbar: { show: true }
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                categories: labels,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                    show: true,
                    trim: false,
                    hideOverlappingLabels: false,
                    style: {
                        fontSize: '12px',
                        fontWeight: 400,
                        colors: Array(labels.length).fill('#4b5563') // Tailwind gray-600
                    }
                }
            },
            yaxis: {
                title: { text: 'Order Count' }
            },
            colors: ['#06b6d4'],
            series: [{
                name: 'Orders',
                data: chartData
            }],
            tooltip: {
                y: {
                    formatter: val => `${val} orders`
                }
            },
            fill: {
                opacity: 1
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: 500
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        },
                        xaxis: {
                            categories: labels,
                            labels: {
                                rotate: 0,
                                show: true,
                                trim: false,
                                hideOverlappingLabels: false,
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    colors: Array(labels.length).fill('#4b5563')
                                }
                            }
                        },
                        yaxis: {
                            title: { text: 'Order Count' }
                        },
                        tooltip: {
                            y: {
                                formatter: val => `${val} orders`
                            }
                        }
                    }
                }
            ]
        };

        let chart = $(container).data('chart');

        if (chart) {
            chart.updateOptions({
                xaxis: { categories: labels },
                series: [{ name: 'Orders', data: chartData }]
            }, true, true);
        } else {
            chart = new ApexCharts(container, options);
            chart.render();
            $(container).data('chart', chart);
        }
    }
    else {
        showNoDataPlaceholders("No Data Found", "#chart-orders-bar-t1");
        return;
    }
    

}

function renderTab2Charts(tab2Data)
{
    if (tab2Data && tab2Data.dateLastUpdated.trim() !== "") {
        const timestamp_container = document.querySelector(".text-dataupdate-time-t2");
        if (timestamp_container) {
            timestamp_container.textContent = "Data Last Updated: " + tab2Data.dateLastUpdated ?? "";
        }
    }

    if (tab2Data && tab2Data.lastSixMonthsItemsChart && tab2Data.lastSixMonthsItemsChart.length > 0) {
        const months = [...new Set(tab2Data.lastSixMonthsItemsChart.map(d => d.month))].sort();

        const statusMap = {
            P: 'pending',
            A: 'approved',
            E: 'executed'
        };

        const data = {
            pending: [],
            approved: [],
            executed: []
        };

        months.forEach(month => {
            ['P', 'A', 'E'].forEach(status => {
                const entry = tab2Data.lastSixMonthsItemsChart.find(d => d.month === month && d.itemStatus === status);
                data[statusMap[status]].push(entry ? entry.itemCount : 0);
            });
        });


        const chart = new ApexCharts(document.querySelector("#chart-pastmonths-orders"), {
            chart: {
                type: 'bar',
                height: 300,
                stacked: true,
                toolbar: { show: true }
            },
            title: {
                text: 'Ordered Items in Last 6 Months',
                align: 'center',
                margin: 10,
                offsetY: 10,
                style: {
                    fontSize: '16px',
                    fontWeight: '500',
                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                    color: '#374151' // Tailwind gray-700
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            xaxis: {
                categories: months,
                title: { text: 'Month' }
            },
            yaxis: {
                title: { text: 'Item Count' }
            },
            legend: { position: 'top' },
            colors: ['#fbbf24', '#38bdf8', '#4ade80'],
            series: [
                { name: 'Pending', data: data.pending },
                { name: 'Approved', data: data.approved },
                { name: 'Executed', data: data.executed }
            ],
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: { height: 400 },
                        plotOptions: {
                            bar: { horizontal: true }
                        },
                        xaxis: {
                            categories: months,
                            labels: { rotate: 0 }
                        },
                        yaxis: {
                            title: { text: 'Ordered Items Count' }
                        },
                        tooltip: {
                            y: {
                                formatter: val => `${val} orders`
                            }
                        }
                    }
                }
            ]
        });

        chart.render();

    }
    else {
        showNoDataPlaceholders("No Data Found", "#chart-pastmonths-orders")
    }
   

    //top 10 items - bar chart
    if (tab2Data && tab2Data.top10ItemsChart && tab2Data.top10ItemsChart.length > 0) {
        const labels = tab2Data.top10ItemsChart.map(item => item.itemCode.trim());
        const values = tab2Data.top10ItemsChart.map(item => item.totalItemQty);
        const descriptions = tab2Data.top10ItemsChart.map(item => item.itemShortDesc);

        const chartTopItems = new ApexCharts(document.querySelector("#chart-top-items"), {
            chart: {
                type: 'bar',
                height: 300,
                toolbar: { show: true }
            },
            title: {
                text: 'Top 10 Ordered Items (By Quantity)',
                align: 'center',
                margin: 10,
                offsetY: 10,
                style: {
                    fontSize: '16px',
                    fontWeight: '500',
                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                    color: '#374151'
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '60%'
                }
            },
            xaxis: {
                categories: labels,
                title: { text: 'Item quantity' }
            },
            yaxis: {
                title: { text: 'Item Codes' }
            },
            colors: ['#22c55e'],
            series: [
                {
                    name: 'Orders',
                    data: values
                }
            ],
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    return `<div style="padding:6px">
                            <strong>${labels[dataPointIndex]}</strong><br/>
                            Qty: ${series[seriesIndex][dataPointIndex]}<br/>
                            Desc: ${descriptions[dataPointIndex]}
                        </div>`;
                }
            }
        });

        chartTopItems.render();
    }
    else {
        showNoDataPlaceholders("No Data Found", "#chart-top-items");
        return;
    }
    

}

function renderTab3Charts(tab3Data) {
    // data last updated text
    if (tab3Data && tab3Data.dateLastUpdated.trim() !== "") {
        const timestamp_container = document.querySelector(".text-dataupdate-time-t3");
        if (timestamp_container) {
            timestamp_container.textContent = "Data Last Updated: " + tab3Data.dateLastUpdated ?? "";
        }
    }
   

    // metric cards - tab3
    const chartMap = {
        "TOTAL": { id: "#chart-total-orders-t3", sumId: "#count-total-orders-t3", label: "Total Orders", color: "#3b82f6" },
        "ANY_PENDING": { id: "#chart-pending-orders-t3", sumId: "#count-pending-orders-t3", label: "Pending Orders", color: "#f97316" },
        "ALL_APPROVED": { id: "#chart-approved-orders-t3", sumId: "#count-approved-orders-t3", label: "Approved Orders", color: "#06b6d4" },
        "ALL_EXECUTED": { id: "#chart-executed-orders-t3", sumId: "#count-executed-orders-t3", label: "Executed Orders", color: "#22c55e" }
    };
    const dataByType = {};

    //const quarterSort = (a, b) => {
    //    const [qA, yA] = a.replace('Q', '').split('-').map(Number);
    //    const [qB, yB] = b.replace('Q', '').split('-').map(Number);

    //    if (yA !== yB) return yA - yB;
    //    return qA - qB;
    //};

    if (tab3Data && tab3Data.metricCards) {
        let xAxisLabels = [];
       
        xAxisLabels = [...new Set(tab3Data.metricCards.map(item => item.dayOrQuarter.trim()))];
      

        $.each(chartMap, function (key) {
            dataByType[key] = {};
        });

        $.each(tab3Data.metricCards, function (i, item) {
            const type = item.chartType;
            if (!chartMap[type]) return;

            const quarterKey = item.dayOrQuarter.trim();

            if (!dataByType[type][quarterKey]) {
                dataByType[type][quarterKey] = 0;
            }
            dataByType[type][quarterKey] += item.totalOrders;
        });

        const sparkOptions = (data, color, categories) => ({
            chart: {
                type: 'line',
                height: 50,
                sparkline: { enabled: true },
                animations: { enabled: true }
            },
            series: [{
                name: 'Orders',
                data: data }],
            stroke: { width: 2 },
            colors: [color],
            tooltip: {
                enabled: true,
                x: { show: true },
                y: { formatter: val => `${val} orders` }
            },
            xaxis: { categories }
        });

        $.each(chartMap, function (type, config) {
            const existingChart = $(config.id).data('chart');
            if (existingChart) {
                existingChart.updateOptions(sparkOptions([], config.color, []));
            }
        });

        $.each(chartMap, function (type, config) {
            const seriesData = [];
            let totalSum = 0;

            $.each(xAxisLabels, function (i, quarterLabel) {
                const count = dataByType[type][quarterLabel] ?? 0;
                totalSum += count;
                seriesData.push(count);
            });

            $(config.sumId).text(totalSum);

            const options = sparkOptions(seriesData, config.color, xAxisLabels);

            let chart = $(config.id).data('chart');
            if (chart) {
                chart.updateOptions(options);
            } else {
                chart = new ApexCharts($(config.id)[0], options);
                $(config.id).data('chart', chart);
                chart.render();
            }
        });
    }

    if (tab3Data && tab3Data.orderTrends && tab3Data.orderTrends.length > 0) {
        // bar chart - tab2
        const container = document.querySelector("#chart-orders-bar-t3");
        if (!container) return;
        const xAxisLabels = [...new Set(tab3Data.orderTrends.map(item => item.orderDayOrQuarter.trim()))];
        const labels = xAxisLabels;
        const dataMap = Object.fromEntries(labels.map(label => [label, 0]));

        tab3Data.orderTrends.forEach(order => {
            const quarter = order.orderDayOrQuarter.trim();
            if (dataMap.hasOwnProperty(quarter)) {
                dataMap[quarter] += order.orderCount;
            }
        });

        const chartData = labels.map(label => dataMap[label]);

        const options = {
            chart: {
                type: 'bar',
                height: 350,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 500,
                    animateGradually: { enabled: true, delay: 100 },
                    dynamicAnimation: { enabled: true, speed: 300 }
                },
                toolbar: { show: true }
            },
            plotOptions: {
                bar: { horizontal: false }
            },
            xaxis: {
                categories: labels,
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                    show: true,
                    trim: false,
                    hideOverlappingLabels: false,
                    style: {
                        fontSize: '12px',
                        fontWeight: 400,
                        colors: Array(labels.length).fill('#4b5563')
                    }
                }
            },
            yaxis: {
                title: { text: 'Order Count' }
            },
            colors: ['#06b6d4'],
            series: [{
                name: 'Orders',
                data: chartData
            }],
            tooltip: {
                y: { formatter: val => `${val} orders` }
            },
            fill: { opacity: 1 },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: { height: 500 },
                        plotOptions: { bar: { horizontal: true } },
                        xaxis: {
                            categories: labels,
                            labels: {
                                rotate: 0,
                                show: true,
                                trim: false,
                                hideOverlappingLabels: false,
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    colors: Array(labels.length).fill('#4b5563')
                                }
                            }
                        },
                        yaxis: { title: { text: 'Order Count' } },
                        tooltip: { y: { formatter: val => `${val} orders` } }
                    }
                }
            ]
        };

        let chart = $(container).data('chart');
        if (chart) {
            chart.updateOptions({
                xaxis: { categories: labels },
                series: [{ name: 'Orders', data: chartData }]
            }, true, true);
        } else {
            chart = new ApexCharts(container, options);
            chart.render();
            $(container).data('chart', chart);
        }
    }
    else {
        showNoDataPlaceholders("No Data Found", "#chart-orders-bar-t3")
    }
    
}



const tabInfo = {
    tab1Loaded: false,
    tab2Loaded: false,
    tab3Loaded: false,
    tab1Data: null,
    tab2Data: null,
    tab3Data: null
};

function getTabPlaceholder(tabId) {
    switch (tabId) {
        case 1:
            return ["#chart-orders-bar-t1"];
        case 2:
            return ["#chart-pastmonths-orders", "#chart-top-items"];
        case 3:
            return ["#chart-orders-bar-t3"];
        default:
            return [];
    }
}

function fetchAndShowDashboardData(uqTabId = 1) {
    const url = "/customer/DbMetric2";
    let successHandler = null;

    // Consolidate common logic for success handling
    successHandler = function (response) {
        if (!response) {
            ToastWrapper.error("Failed to get dashboard information!")
            let chartIds = getTabPlaceholder(uqTabId);
            chartIds.forEach(chartId => {
                showNoDataPlaceholders("No data received.", chartId);
            });
            return;
        }

        try {
            console.log(response);
            const tabKey = `tab${uqTabId}`;
            if (!tabInfo[tabKey + 'Loaded']) {
                renderChartsForTab(uqTabId, response);
                tabInfo[tabKey + 'Data'] = response;
                tabInfo[tabKey + 'Loaded'] = true;
            }
        } catch (err) {
            console.error(err);
            ToastWrapper.error(`Error rendering charts!`);
        }
    };

    if (!url) return;

    $.ajax({
        url: url,
        contentType: 'application/json',
        data: { tabId: uqTabId },
        
        success: successHandler,
        error: function (xhr, status, error) {
            ToastWrapper.error(`Error rendering charts!`);
        }
    });
}

function renderChartsForTab(tabId, response) {
    switch (tabId) {
        case 1:
            renderTab1Charts(response, 'W');
            break;
        case 2:
            renderTab2Charts(response);
            break;
        case 3:
            renderTab3Charts(response);
            break;
        default:
            ToastWrapper.error("something went wrong!");
    }
}


$(document).ready(() => {

    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });

    //intialize all tabs to not loaded
    tabInfo.tab1Data = null;
    tabInfo.tab2Data = null;
    tabInfo.tab3Data = null;
    tabInfo.tab1Loaded = false;
    tabInfo.tab2Loaded = false;
    tabInfo.tab3Loaded = false;


    $('#dashbaord-charts-tab button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        var currentTabId = $(e.target).data('tab-value');
        if (tabInfo[`tab${currentTabId}Loaded`] === false) {
            fetchAndShowDashboardData(currentTabId);
        }       
    });


    $('#intervalSelector').on('change', function () {
        const r = $(this).val();
      
        if (r === "W") {
            $(".overview-title1").text("Orders Overview - This Week");
            if (tabInfo.tab1Loaded) {
                renderTab1Charts(tabInfo.tab1Data, 'W');
            }
        }
        else if (r === "M") {
            $(".overview-title1").text("Orders Overview - This Month")
            if (tabInfo.tab1Loaded) {
                renderTab1Charts(tabInfo.tab1Data, 'M');
            }
        } else {
            ToastWrapper.error("Invalid tab selected!");
        }
    });

    //render first tabs charts:
    fetchAndShowDashboardData(1);
})