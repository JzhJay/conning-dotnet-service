using System;

namespace Conning.Models.OMDB
{
    public interface DbObject
    {
        string createdBy { get; set; }
        DateTime createdTime { get; set; }
        string modifiedBy { get; set; }
        DateTime? modifiedTime { get; set; }
    }
}