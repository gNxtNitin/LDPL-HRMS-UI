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


function fetchAndShowDashboardData(range = "W") {

    $.ajax({
        url: '/customer/DbMetric',
        contentType: 'application/json',
        data: { p: range },
        beforeSend: function () {
            // Optional: Show loading spinners or overlays
        },
        success: function (response) {
            if (!response) {
                showNoDataPlaceholders("No data received from server.", "#chart-orders-simple");
                showNoDataPlaceholders("No data received from server.", "#chart-pastmonths-orders");
                showNoDataPlaceholders("No data received from server.", "#chart-top-items");
                return;
            }

            try {
                //show all time order count and data last updated datetime
                showExtendedInfo(response.dataCountAndDateInfo);

                //show metric cards
                renderMetricCards(response.metrics ?? {}, range ?? 'W');

                //show order counts of current week/month
                try {
                    renderDailyOrdersChart(response.dailyOrders, range ?? 'W');
                } catch {
                    showNoDataPlaceholders("No data received from server.", "#chart-orders-simple");
                }

                //past 6 months ordered items
                try {
                    render6MonthsChart(response.lastSixMonthsItems);
                } catch {
                    showNoDataPlaceholders("No data received from server.", "#chart-pastmonths-orders");
                }

                //top 10 items ordered (by qty)
                try {
                    renderTopItemsChart(response.top10Items);
                } catch {
                    showNoDataPlaceholders("No data received from server.", "#chart-top-items");
                }
               
            } catch (err) {
                console.error("Rendering error:", err);
                //showNoDataPlaceholders("Error occurred while rendering dashboard data.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
            //showNoDataPlaceholders("Failed to load dashboard data. Please try again later.");
        },
        complete: function () {
            // Optional: Hide loading spinners or overlays
        }
    });

}


function showExtendedInfo(info) {
    const timestamp_container = document.querySelector(".text-dataupdate-time");
    if (timestamp_container) {
        timestamp_container.textContent = "Data Last Updated: " + info.dataLastUpdated;
    }
}


function renderMetricCards(metrics, r = 'W') {


    const chartMap = {
        "total": { id: "#chart-total-orders", sumId: "#count-total-orders", label: "Total Orders", color: "#3b82f6" },
        "any pending": { id: "#chart-pending-orders", sumId: "#count-pending-orders", label: "Pending Orders", color: "#f97316" },
        "all approved": { id: "#chart-approved-orders", sumId: "#count-approved-orders", label: "Approved Orders", color: "#06b6d4" },
        "all executed": { id: "#chart-executed-orders", sumId: "#count-executed-orders", label: "Executed Orders", color: "#22c55e" }
    };
    const dataByType = {};
    let sortedDates = r === 'W' ? getCurrentWeekDates() : getCurrentMonthDates();

    // Initialize empty arrays for each chart type
    $.each(chartMap, function (key) {
        dataByType[key] = {};
    });

    // Group data by date for each chart type
    $.each(metrics, function (i, item) {
        const type = item.chartType.toLowerCase();
        const date = item.orderDate.split(' ')[0];

        if (chartMap[type]) {
            if (!dataByType[type]) {
                dataByType[type] = {};
            }
            dataByType[type][date] = item.totalOrders;
        }
    });

    const sparkOptions = (data, color, categories) => ({
        chart: {
            type: 'line',
            height: 50,
            sparkline: { enabled: true },
            animations: { enabled: true }
        },
        series: [{ data }],
        stroke: { width: 2 },
        colors: [color],
        tooltip: {
            enabled: true,
            x: { format: 'dd MMM' },
            y: { formatter: val => `${val} orders` }
        },
        xaxis: { categories }
    });

    // Clean up and remove existing ApexCharts (if any) only after chart is fully loaded
    $.each(chartMap, function (type, config) {
        if ($(config.id).data('chart')) {
            const chart = $(config.id).data('chart');
            if (chart) chart.updateOptions(sparkOptions([], config.color, [])); // Clear chart data
        }
    });

    // Render each chart
    $.each(chartMap, function (type, config) {
        const seriesData = [];
        let totalSum = 0;

        $.each(sortedDates, function (i, date) {
            const count = dataByType[type][date] ?? 0;
            totalSum += count;
            seriesData.push(count);
        });

        $(config.sumId).text(totalSum);

        const options = sparkOptions(seriesData, config.color, sortedDates);

        // If chart exists, update it, otherwise render a new one
        let chart = $(config.id).data('chart');
        if (chart) {
            chart.updateOptions(options); // Update chart
        } else {
            chart = new ApexCharts($(config.id)[0], options);
            $(config.id).data('chart', chart);
            chart.render();
        }
    });
}


function renderDailyOrdersChart(dailyOrders, range = 'W') {
    

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


function render6MonthsChart(monthlyData) {
    if ($("#chart-pastmonths-orders").children().length > 0) {
        return;
    }
 
    const months = [...new Set(monthlyData.map(d => d.month))].sort();
 
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
            const entry = monthlyData.find(d => d.month === month && d.itemStatus === status);
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

function renderTopItemsChart(top10Items) {

    if ($("#chart-top-items").children().length > 0) {
        // Chart is already rendered
        return;
    }

    // Prepare chart labels (item codes) and values (quantities)
    const labels = top10Items.map(item => item.itemCode.trim());
    const values = top10Items.map(item => item.totalItemQty);
    const descriptions = top10Items.map(item => item.itemShortDesc);

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
                color: '#374151' // Tailwind gray-700
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
            title: {text: 'Item Codes'}
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

function showLoadingIndicator() {
    $(".chart-container").each(function () {
        $(this).html('<div class="loading-spinner">Loading...</div>');
    });
}

function hideLoadingIndicator() {
    $(".chart-container").each(function () {
        $(this).html(''); // Remove the loading spinner
    });
}


$(document).ready(() => {
    fetchAndShowDashboardData("W"); // Default Weekly

    $('#intervalSelector').on('change', function () {
        const range = $(this).val();
        console.log(range);
        if (range === "W") {
           
            $(".overview-title1").text("Orders Overview - This Week")
        }
        else if (range === "M") {
            $(".overview-title1").text("Orders Overview - This Month")
        } else {
            $(".overview-title1").text("Orders Overview")
        }
        
        fetchAndShowDashboardData(range)
       
    });
});