using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public interface IDashboardMetric
    {
       string DateLastUpdated { get; set; }

    }
    public class DashboardChartDataT1:IDashboardMetric
    {
        public List<MetricCard> MetricCards { get; set; }
        public List<OrderTrend> OrderTrends { get; set; }
        public string DateLastUpdated { get; set; }
    }

    public class DashboardChartDataT2: IDashboardMetric
    {
        public List<LastSixMonthsItemChart> LastSixMonthsItemsChart { get; set; }
        public List<Top10ItemsChart> Top10ItemsChart { get; set; }
        public string DateLastUpdated { get; set; }
    }

    public class DashboardChartDataT3:IDashboardMetric
    {
        public List<MetricCard> MetricCards { get; set; }
        public List<OrderTrend> OrderTrends { get; set; }
        public string DateLastUpdated { get; set; }
    }


    //charts first tab
    public class MetricCard
    {
        public string DayOrQuarter { get; set; }
        public int TotalOrders { get; set; }
        public string ChartType { get; set; }
    }

    public class OrderTrend
    {
        public string OrderDayOrQuarter { get; set; }
        public int OrderCount { get; set; }
    }

    public class LastSixMonthsItemChart
    {
        public string Month { get; set; }
        public string ItemStatus { get; set; }
        public int ItemCount { get; set; }
        public decimal TotalQty { get; set; }
    }


    public class Top10ItemsChart
    {
        public string ItemCode { get; set; }
        public string ItemShortDesc { get; set; }
        public int TotalItemCount { get; set; }
        public decimal TotalItemQty { get; set; }
    }

    public class DashboardMetricRequest2
    {
        public string TabId { get; set; }
        public string CompanyCode { get; set; }
        public string CustomerCode { get; set; }

    }
}
