using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{

   public class DashboardMetric
    {
        public List<MetricCardsModel> Metrics { get; set; }
        public List<DailyOrderChartModel> DailyOrders { get; set; }
        public List<LastSixMonthsItemChartModel> LastSixMonthsItems { get; set; }
        public List<Top10ItemsChartModel> Top10Items { get; set; }
        public ExtendedInfo DataCountAndDateInfo { get; set; }
    }

    public class MetricCardsModel
    {
        public string OrderDate { get; set; }
        public int TotalOrders { get; set; }
        public string ChartType { get; set; }
    }

    public class DailyOrderChartModel
    {
        public DateTime OrderDay { get; set; }
        public int OrderCount { get; set; }
    }

    public class LastSixMonthsItemChartModel
    {
        public string Month { get; set; }
        public string ItemStatus { get; set; }
        public int ItemCount { get; set; }
        public decimal TotalQty { get; set; }
    }


    public class Top10ItemsChartModel
    {
        public string ItemCode { get; set; }
        public string ItemShortDesc { get; set; }
        public int TotalItemCount { get; set; }
        public decimal TotalItemQty { get; set; }
    }

    public class DashboardMetricRequest
    {
        public string DataRange { get; set; } = "W";
        public string CompanyCode { get; set; }
        public string CustomerCode { get; set; }

    }

    public class ExtendedInfo
    {
        public int AllOrderCount { get; set; }
        public string DataLastUpdated { get; set; }
    }
}
