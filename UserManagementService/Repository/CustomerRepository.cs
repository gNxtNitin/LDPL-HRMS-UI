using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility.APIHelper;


namespace UserManagementService.Repository
{
    public class CustomerRepository: ICustomerRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        public CustomerRepository(IApiClientHelper apiClientHelper)
        {
            _apiClientHelper = apiClientHelper;
        }
        public async Task<List<CompanyModel>> GetCompany()
        {
            
            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetAllCompany");

            if (resp.Code > 0)
            {
                List<CompanyModel> list = JsonSerializer.Deserialize<List<CompanyModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return list;
            }

            return new List<CompanyModel>();
        }

        public async Task<List<OrderDetailsModel>> GetOrderDetailsMaster(string customerid, string companycode)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", customerid);
            q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetOrderDetailsMaster", q);

                if (resp.Code == 1)
                {
                    List<OrderDetailsModel> list = JsonSerializer.Deserialize<List<OrderDetailsModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<OrderDetailsModel>();
        }
        public async Task<List<OrderDetailsModel>> GetOrderDetailsItem(string customerid, string companycode, string ordercode)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", customerid);
            q.Add("cid2", companycode);
            q.Add("cid3", ordercode);


            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetOrderDetailsItem", q);

            if (resp.Code == 1)
            {
                List<OrderDetailsModel> list = JsonSerializer.Deserialize<List<OrderDetailsModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return list;
            }

            return new List<OrderDetailsModel>();
        }
        public async Task<List<OrderInvoiceModel>> GetOrderInvoice(string customerid, string companycode, string? ordercode,string? from, string? to)
        {
            try
            {
                Dictionary<string, string> q = new Dictionary<string, string>();
                q.Add("cid1", customerid);
                q.Add("cid2", companycode);
                if(ordercode != null)
                {
                    q.Add("cid3", ordercode);
                }
                if (from != null)
                {
                    q.Add("cid4", from);
                }
                if (to != null)
                {
                    q.Add("cid5", to);
                }
                


                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetAllInvoice", q);

                if (resp.Code == 1)
                {

                    List<OrderInvoiceModel> list = JsonSerializer.Deserialize<List<OrderInvoiceModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;


                }
            }
            catch (Exception ex)
            {

            }
            return new List<OrderInvoiceModel>();
        }
        public async Task<List<OrderInvoiceModel>> GetInvoicedetails(string mkey, string customer, string company)
        {
            try
            {
                Dictionary<string, string> q = new Dictionary<string, string>();
                q.Add("cid1", mkey);
                q.Add("cid2", customer);
                q.Add("cid3", company);



                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetInvoiceData", q);

                if (resp.Code == 1)
                {

                    List<OrderInvoiceModel> list = JsonSerializer.Deserialize<List<OrderInvoiceModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;


                }
            }
            catch (Exception ex)
            {

            }
            return new List<OrderInvoiceModel>();
        }
        public async Task<List<ItemsModel>> GetAllItems(string companycode)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", companycode);
            


            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Customer/GetAllItems", q);

            if (resp.Code == 1)
            {
                List<ItemsModel> list = JsonSerializer.Deserialize<List<ItemsModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return list;
            }

            return new List<ItemsModel>();
        }
        public async Task<bool> CreateOrder(OrderDetailViewModel odm)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<OrderDetailViewModel, APIResponse>("/api/Customer/CreateOrder", odm);

            if (respBody.Code > 0)
            {
                //var uniqueId = Guid.NewGuid().ToString();
                //_memoryCacheService.Set(uniqueId, userRequestModel.Email, TimeSpan.FromMinutes(10));

                return true;
            }

            return false;
        }
        public async Task<bool> UpdateOrder(OrderDetailViewModel odm)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<OrderDetailViewModel, APIResponse>("/api/Customer/UpdateOrder", odm);

            if (respBody.Code > 0)
            {
                //var uniqueId = Guid.NewGuid().ToString();
                //_memoryCacheService.Set(uniqueId, userRequestModel.Email, TimeSpan.FromMinutes(10));

                return true;
            }

            return false;
        }
        public async Task<bool> DeleteOrder(OrderDetailViewModel odm)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<OrderDetailViewModel, APIResponse>("/api/Customer/DeleteOrder", odm);

            if (respBody.Code > 0)
            {
                //var uniqueId = Guid.NewGuid().ToString();
                //_memoryCacheService.Set(uniqueId, userRequestModel.Email, TimeSpan.FromMinutes(10));

                return true;
            }

            return false;
        }


        public async Task<DashboardMetric> GetDashboardMetric(DashboardMetricRequest request)
        {
            APIResponse respBody = await _apiClientHelper.PostAsync<DashboardMetricRequest, APIResponse>("/api/Customer/DashboardMetric", request);


            if (respBody.Code > 0)
            {
                var dbData = JsonSerializer.Deserialize<DashboardMetric>(respBody.Data.ToString());
                return dbData;
            }

            return new DashboardMetric();
           
        }

        public async Task<IDashboardMetric> GetDashboardMetric2(DashboardMetricRequest2 request)
        {
            APIResponse respBody = await _apiClientHelper.PostAsync<DashboardMetricRequest2, APIResponse>("/api/Customer/DashboardMetric2", request);
            IDashboardMetric dashboardData = null;

            if (respBody.Code > 0)
            {
                switch (request.TabId)
                {
                    case "T1":
                        dashboardData = JsonSerializer.Deserialize<DashboardChartDataT1>(respBody.Data.ToString());
                        break;
                    case "T2":
                        dashboardData = JsonSerializer.Deserialize<DashboardChartDataT2>(respBody.Data.ToString());
                        break;
                    case "T3":
                        dashboardData = JsonSerializer.Deserialize<DashboardChartDataT3>(respBody.Data.ToString());
                        break;
                    default:
                        dashboardData = null;
                        break;
                }
            }

            return dashboardData;
        }

    }
}
