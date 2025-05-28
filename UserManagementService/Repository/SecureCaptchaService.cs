
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using UserManagementService.IRepository;

namespace UserManagementService.Repository
{
    internal enum CaptchaType
    {
        Alphanumeric,
        Numeric,
        AlphanumericWithSpecialChars
    }

    internal class CaptchaOptions
    {
        public CaptchaType CaptchaType { get; set; } = CaptchaType.Alphanumeric;
        public int Length { get; set; } = 6;
        public int Width { get; set; } = 200;
        public int Height { get; set; } = 60;
        public int FontSize { get; set; } = 24;
        public bool AddNoise { get; set; } = true;
    }

    public class SecureCaptchaService : ISecureCaptchaService
    {
        private const string AlphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private const string NumericChars = "0123456789";
        private const string SpecialChars = "!@#$%^&*";
        private const int Length  = 6;
        private const int Width  = 200;
        private const int Height  = 60;
        private const int FontSize  = 24;
        private const bool IncludeNoise  = true;

        private static readonly Color[] Colors = { Color.DarkBlue, Color.DarkRed, Color.DarkGreen, Color.Purple, Color.DarkOrange };
        private static readonly Random RandomNumber = new Random();

        public async Task<(string ImageBase64, string CaptchaText)> GenerateCaptchaAsync()
        {
            return await Task.Run(() =>
            {
                string captchaText = GenerateRandomText(Length, CaptchaType.Alphanumeric);

                using var bitmap = new Bitmap(Width, Height);
                using var g = Graphics.FromImage(bitmap);
                g.SmoothingMode = SmoothingMode.AntiAlias;
                g.Clear(Color.WhiteSmoke);

                if (IncludeNoise)
                {
                    AddNoise(g, Width, Height);
                }

                DrawCaptchaText(g, captchaText, Width, Height, FontSize);


                using var ms = new MemoryStream();
                bitmap.Save(ms, ImageFormat.Png);
                var imageBase64 = Convert.ToBase64String(ms.ToArray());



                return ($"data:image/png;base64,{imageBase64}", captchaText);
            });
        
        }


        private static void DrawCaptchaText(Graphics g, string captchaText, int width, int height, int fontSize)
        {
            float maxCharWidth = (float)width / captchaText.Length;
            float adjustedFontSize = Math.Min(fontSize, maxCharWidth * 0.8f); // Ensure font fits within bounds

            for (int i = 0; i < captchaText.Length; i++)
            {
                using var font = new Font("Arial", adjustedFontSize, FontStyle.Bold);
                using var brush = new SolidBrush(Colors[RandomNumber.Next(Colors.Length)]);

                // Random character rotation
                var rotationAngle = RandomNumber.Next(-20, 20);
                using var matrix = new Matrix();

                float charWidth = g.MeasureString(captchaText[i].ToString(), font).Width;
                float charHeight = g.MeasureString(captchaText[i].ToString(), font).Height;
                float x = Math.Min(width - charWidth, 10 + i * maxCharWidth + RandomNumber.Next(-5, 5));
                float y = Math.Min(height - charHeight, RandomNumber.Next(10, height / 3));

                matrix.RotateAt(rotationAngle, new PointF(x + charWidth / 2, y + charHeight / 2));
                g.Transform = matrix;

                g.DrawString(captchaText[i].ToString(), font, brush, x, y);
                g.ResetTransform();
            }
        }


        private string GenerateRandomText(int length, CaptchaType captchaType)
        {
            string charset = captchaType switch
            {
                CaptchaType.Numeric => NumericChars,
                CaptchaType.AlphanumericWithSpecialChars => AlphanumericChars + SpecialChars,
                _ => AlphanumericChars
            };

            using var rng = RandomNumberGenerator.Create();
            Span<char> result = stackalloc char[length];
            byte[] data = new byte[length];
            rng.GetBytes(data);

            for (int i = 0; i < length; i++)
            {
                result[i] = charset[data[i] % charset.Length];
            }

            return new string(result);
        }

        private void AddNoise(Graphics g, int width, int height)
        {
            using var pen = new Pen(Color.Gray, 2);
            for (int i = 0; i < RandomNumber.Next(7, 10); i++)
            {
                pen.Color = Colors[RandomNumber.Next(Colors.Length)];
                int x1 = RandomNumber.Next(width);
                int y1 = RandomNumber.Next(height);
                int x2 = x1 + RandomNumber.Next(-100, 100);
                int y2 = y1 + RandomNumber.Next(-100, 100);
                g.DrawLine(pen, x1, y1, Math.Clamp(x2, 0, width), Math.Clamp(y2, 0, height));
            }

                for (int i = 0; i < 150; i++)
            {
                var color = Colors[RandomNumber.Next(Colors.Length)];
                using var brush = new SolidBrush(color);
                g.FillRectangle(brush, RandomNumber.Next(width), RandomNumber.Next(height), 2, 2);
            }

        }

        public bool ValidateCaptcha(string inputCaptcha, string storedCaptcha)
        {
            if (string.IsNullOrWhiteSpace(inputCaptcha) || string.IsNullOrWhiteSpace(storedCaptcha))
                return false;

            return string.Equals(inputCaptcha.Trim(), storedCaptcha.Trim(), StringComparison.OrdinalIgnoreCase);
        }
    }
}
