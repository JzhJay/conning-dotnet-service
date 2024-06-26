using System;
using MongoDB.Bson;

namespace Conning.Models.OMDB
{
    public class Folder: DbObject
    {
        public ObjectId _id { get; set; }
        public ObjectId? parent { get; set; }
        public string path { get; set; }
        public string name { get; set; }
        
        public string createdBy { get; set; }
        public DateTime createdTime { get; set; }
        public string modifiedBy { get; set; }
        public DateTime? modifiedTime { get; set; }

    }

}