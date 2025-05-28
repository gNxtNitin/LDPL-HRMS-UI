using System.Security.Cryptography;
using System.Text;

namespace LDPLWEBUI.Utility
{
    public static class PasswordConfig
    {
        public static string GetMd5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert byte array to hex string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2")); // "x2" for lowercase hex
                }
                return sb.ToString();
            }
        }
    }
}
