using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class PasswordPolicyMaster
    {
        public int MinLength { get; set; }
        public int MaxLength { get; set; }
        public int MinUppercase { get; set; }
        public int MaxUppercase { get; set; }
        public int MinLowercase { get; set; }
        public int MaxLowercase { get; set; }
        public int MinNumeric { get; set; }
        public int MaxNumeric { get; set; }
        public int MinPunctuation { get; set; }
        public int MaxPunctuation { get; set; }
        public string DisallowRepeatCharacters { get; set; }
        public string DisallowDuplicateCharacters { get; set; }
        public string DisallowSequentialCharacters { get; set; }
        public bool BeginWithUppercase { get; set; }
        public bool EndWithUppercase { get; set; }
        public bool BeginWithAlpha { get; set; }
        public bool EndWithAlpha { get; set; }
        public bool BeginWithNumber { get; set; }
        public bool EndWithNumber { get; set; }
        public bool BeginWithSymbol { get; set; }
        public bool EndWithSymbol { get; set; }
        public string ProhibitedCharacters { get; set; }

        public int ExpiryDays { get; set; }

        public int ExpiryNotifyBeforeDays { get; set; }
        public int MinAgeDays { get; set; }
        public int LockoutThreshold { get;set; }

        public int LockoutDurationMinutes { get; set; }

        public int ResetTokenExpiryMinutes { get; set; }
            
        public bool ForceChangeOnFirstLogin { get; set; }

        public int EnforcePasswordHistory { get; set; }

        public int ModifiedBy { get; set; }
    }
}
