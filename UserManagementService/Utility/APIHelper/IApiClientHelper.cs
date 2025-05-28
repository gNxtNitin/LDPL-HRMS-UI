using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace UserManagementService.Utility.APIHelper
{
    public interface IApiClientHelper
    {
        /// <summary>
        /// Sets the Authorization header (e.g., Bearer token).
        /// </summary>
        void SetAuthorizationHeader(string? token, string scheme = "Bearer");

        /// <summary>
        /// Sends an HTTP GET request with optional query parameters and custom headers.
        /// </summary>
        Task<T?> GetAsync<T>(string endpoint, IDictionary<string, string>? queryParams = null, IDictionary<string, string>? customHeaders = null);

        /// <summary>
        /// Sends an HTTP POST request with a payload and returns a response.
        /// </summary>
        Task<TResponse?> PostAsync<TRequest, TResponse>(string endpoint, TRequest payload, IDictionary<string, string>? customHeaders = null);

        /// <summary>
        /// Sends an HTTP PUT request with a payload and returns a response.
        /// </summary>
        Task<TResponse?> PutAsync<TRequest, TResponse>(string endpoint, TRequest payload, IDictionary<string, string>? customHeaders = null);

        /// <summary>
        /// Sends an HTTP POST request with a multipart/form-data and returns a response.
        /// </summary>
        Task<TResponse?> PostFormDataAsync<TResponse>(string endpoint, MultipartFormDataContent formData, IDictionary<string, string>? customHeaders = null);

        /// <summary>
        /// Sends an HTTP DELETE request and returns success status.
        /// </summary>
        Task<bool> DeleteAsync(string endpoint, IDictionary<string, string>? customHeaders = null);
    }
}
