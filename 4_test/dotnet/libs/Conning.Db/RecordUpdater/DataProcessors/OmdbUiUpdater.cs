using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using MongoDB.Bson;

namespace Conning.Db.RecordUpdater.DataProcessors
{
	public struct UpdateRecord
	{
		public string ObjectType;
		public string FieldName;
		public string[] TagsInTargetSection;
		public int? NewSectionInsertionIndexDelta; // Delta from the index identified by TagsInTargetSection at which to insert a new section
		public bool insertToCard;
		public bool insertToTable;
	}

    public class OmdbUiUpdater : RecordPreprocessor
    {
	    private List<UpdateRecord> updates;
	    public OmdbUiUpdater(string supportVersion, List<UpdateRecord> updates) : base(supportVersion, new [] { "omdb_ui" })
	    {
		    this.updates = updates;
	    }

	    public override bool Execute(BsonDocument record, string collectionName)
        {
	        var hasUpdate = false;
	        foreach (var updateData in this.updates)
	        {
		        if (
			        (!String.IsNullOrEmpty(updateData.ObjectType) && record["objectType"] != updateData.ObjectType) ||
			        (!updateData.insertToCard && !updateData.insertToTable)
			    )
		        {
			        continue;
		        }

		        if (updateData.insertToCard)
		        {
			        var hasFieldInCard = false;
			        var targetSelectionIndex = -1;
			        BsonArray targetSection = null;
			        var newTargetSectionIndex = -1;

			        var cardSections = record["card"]["sections"].AsBsonArray;
			        for (var i = 0; i < cardSections.Count; i++)
			        {
				        var section = cardSections[i];

				        foreach (var tag in section["tags"].AsBsonArray)
				        {
					        var name = tag["name"].ToString();
					        if (name == updateData.FieldName)
					        {
						        hasFieldInCard = true;
					        }
					        else if (updateData.TagsInTargetSection != null)
					        {
						        var index = Array.IndexOf(updateData.TagsInTargetSection, name);

						        if (updateData.NewSectionInsertionIndexDelta != null)
						        {
							        if (index != -1 && newTargetSectionIndex == -1)
							        {
								        newTargetSectionIndex = i + (int)updateData.NewSectionInsertionIndexDelta;
							        }
						        }
						        else  if (index > targetSelectionIndex)
						        {
							        targetSelectionIndex = index;
							        targetSection = section["tags"].AsBsonArray;
						        }
					        }
				        }
			        }

			        if (!hasFieldInCard)
			        {
				        hasUpdate = true;
				        var newTag = new BsonDocument("name", updateData.FieldName);
				        if (targetSection != null)
				        {
					        targetSection.Add(newTag);
				        }
				        else if (newTargetSectionIndex != -1)
				        {
					        cardSections.Insert(newTargetSectionIndex, new BsonDocument("tags", new BsonArray(new[] { newTag })));
				        }
				        else
				        {
					        cardSections.Add(new BsonDocument("tags", new BsonArray(new[] { newTag })));
				        }
			        }
		        }

		        if (updateData.insertToTable)
		        {
			        var hadColumnInTable = false;
			        var insertColumnIndex = -1;
			        var tableColumns = record["table"]["columns"].AsBsonArray;
			        foreach (var column in tableColumns)
			        {
				        var name = column["name"].ToString();
				        if (name == updateData.FieldName)
				        {
					        hadColumnInTable = true;
				        }
				        else if (updateData.TagsInTargetSection != null)
				        {
					        var index = Array.IndexOf(updateData.TagsInTargetSection, name);
					        if (index > insertColumnIndex)
					        {
						        insertColumnIndex = index;
					        }
				        }
			        }

			        if (!hadColumnInTable)
			        {
				        hasUpdate = true;
				        var newColumn = new BsonDocument("name", updateData.FieldName);
				        if (insertColumnIndex >= 0)
				        {
					        tableColumns.Insert(insertColumnIndex + 1, newColumn);
				        }
				        else
				        {
					        tableColumns.Add(newColumn);
				        }
			        }
		        }
	        }
	        return hasUpdate;
        }

	    public override bool Rollback(BsonDocument record, string collectionName)
	    {
		    return false;
	    }
    }
}
