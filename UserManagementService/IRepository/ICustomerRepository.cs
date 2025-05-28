using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface ICustomerRepository
    {
        Task<List<CompanyModel>> GetCompany();
        Task<List<OrderDetailsModel>> GetOrderDetailsMaster(string customerid, string companycode);
        Task<List<OrderDetailsModel>> GetOrderDetailsItem(string customerid, string companycode, string ordercode);
        Task<List<OrderInvoiceModel>> GetOrderInvoice(string customerid, string companycode, string? ordercode, string? from, string? to);
        Task<List<ItemsModel>> GetAllItems(string companycode);
        Task<bool> CreateOrder(OrderDetailViewModel odm);
        Task<bool> UpdateOrder(OrderDetailViewModel odm);
        Task<bool> DeleteOrder(OrderDetailViewModel odm);
        Task<List<OrderInvoiceModel>> GetInvoicedetails(string mkey, string customer, string company);
        Task<DashboardMetric> GetDashboardMetric(DashboardMetricRequest request);
        Task<IDashboardMetric> GetDashboardMetric2(DashboardMetricRequest2 request);
    }
}
