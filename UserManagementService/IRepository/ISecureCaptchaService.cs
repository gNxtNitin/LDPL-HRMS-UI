using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Repository;

namespace UserManagementService.IRepository
{
    public interface ISecureCaptchaService
    {
        Task<(string ImageBase64, string CaptchaText)> GenerateCaptchaAsync();
        bool ValidateCaptcha(string inputCaptcha, string storedCaptcha);
    }
}
