
namespace UserManagementService.DTOs.ResponseModels
{
    public class APIResponse
    {
        public int Code { get; set; } = -10;
        public string? Msg { get; set; }
        public object? Data { get; set; }
    }
}
