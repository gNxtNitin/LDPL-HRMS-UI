using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace UserManagementService.Utility.APIHelper
{
    public class ApiClientHelper : IApiClientHelper
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonOptions;


        public ApiClientHelper(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = false
            };
        }

        // Set Authorization Header (e.g., Bearer Token)
        public void SetAuthorizationHeader(string? token, string scheme = "Bearer")
        {
            if (!string.IsNullOrWhiteSpace(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(scheme, token);
            }
            else
            {
                _httpClient.DefaultRequestHeaders.Authorization = null; // Clear auth header
            }
        }

        // Helper: Convert object to JSON content
        private StringContent ToJsonContent<T>(T obj)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            var json = JsonSerializer.Serialize(obj, _jsonOptions);
            return new StringContent(json, Encoding.UTF8, "application/json");
        }

        // Helper: Deserialize JSON response
        private async Task<T?> ReadResponseJsonAsync<T>(HttpResponseMessage response)
        {
            if (response == null) throw new ArgumentNullException(nameof(response));

            try
            {
                // If the response status is Unauthorized (401)
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {

                    throw new UnauthorizedApiException("User is not authorized. Token might be expired.");
                }

                response.EnsureSuccessStatusCode();

                // Deserialize the response
                await using var responseStream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<T>(responseStream, _jsonOptions);
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Error deserializing response to {typeof(T).Name}", ex);
            }
        }


        // Perform HTTP GET request
        public async Task<T?> GetAsync<T>(string endpoint, IDictionary<string, string>? queryParams = null, IDictionary<string, string>? customHeaders = null)
        {
            AddCustomHeaders(customHeaders);

            // Append query parameters to endpoint
            var requestUri = BuildRequestUri(endpoint, queryParams);

            var response = await _httpClient.GetAsync(requestUri);
            return await ReadResponseJsonAsync<T>(response);
        }


        // Perform HTTP POST request
        public async Task<TResponse?> PostAsync<TRequest, TResponse>(string endpoint, TRequest payload, IDictionary<string, string>? customHeaders = null)
        {
            AddCustomHeaders(customHeaders);
            var content = ToJsonContent(payload);
            var response = await _httpClient.PostAsync(endpoint, content);
            return await ReadResponseJsonAsync<TResponse>(response);
        }

        // Perform HTTP PUT request
        public async Task<TResponse?> PutAsync<TRequest, TResponse>(string endpoint, TRequest payload, IDictionary<string, string>? customHeaders = null)
        {
            AddCustomHeaders(customHeaders);
            var content = ToJsonContent(payload);
            var response = await _httpClient.PutAsync(endpoint, content);
            return await ReadResponseJsonAsync<TResponse>(response);
        }

        // Perform HTTP DELETE request
        public async Task<bool> DeleteAsync(string endpoint, IDictionary<string, string>? customHeaders = null)
        {
            AddCustomHeaders(customHeaders);
            var response = await _httpClient.DeleteAsync(endpoint);
            response.EnsureSuccessStatusCode();
            return response.IsSuccessStatusCode;
        }

        // Helper: Add custom headers (e.g., API keys, trace IDs)
        private void AddCustomHeaders(IDictionary<string, string>? headers)
        {
            _httpClient.DefaultRequestHeaders.Clear();
            if (headers == null) return;

            foreach (var header in headers)
            {
                if (!_httpClient.DefaultRequestHeaders.Contains(header.Key))
                {
                    _httpClient.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
            }
        }

        public async Task<TResponse?> PostFormDataAsync<TResponse>(string endpoint, MultipartFormDataContent formData, IDictionary<string, string>? customHeaders = null)
        {
            AddCustomHeaders(customHeaders);

            var response = await _httpClient.PostAsync(endpoint, formData);
            return await ReadResponseJsonAsync<TResponse>(response);
        }

        // Helper: Build URI with query parameters
        private string BuildRequestUri(string endpoint, IDictionary<string, string>? queryParams)
        {
            if (queryParams == null || !queryParams.Any())
            {
                return endpoint; // No query params, return as is.
            }

            var query = new FormUrlEncodedContent(queryParams).ReadAsStringAsync().Result;
            return $"{endpoint}?{query}";
        }
    }
}
