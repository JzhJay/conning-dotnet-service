using System;
using MongoDB.Bson;

namespace Conning.Models.OMDB
{
    public class FolderItem : DbObject
    {
        public ObjectId _id { get; set; }
        public ObjectId _folder { get; set; }

        public ObjectId itemId { get; set; }
        public string itemType { get; set; }
        
        public string createdBy { get; set; }
        public DateTime createdTime { get; set; }
        public string modifiedBy { get; set; }
        public DateTime? modifiedTime { get; set; }
    }
}