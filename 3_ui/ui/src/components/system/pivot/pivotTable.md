# Pivot Component 
## Overview
Pivots are widely-used within our application.

## Rules of the Road
* Pivots can be very large.  Millions of rows or columns are not unheard of.
* Pivots can be _rearranged_ at will.  You might have been rendering a 1,000,000x1,000 table, but if the user hits *Flip* you now have a million columns to deal with.
* As long as we have data on hand (in browser memory), rendering cell values is instantaneous, even on large pivots.
* The user can change their coordinate bounds very quickly via the scrollbars and keyboard shortcuts.
* Getting data from the backend is relatively slow - on the order of half a second.  It is much better to _prefetch_ the data so that we already have it on hand to show the user. 
* In the event that we cannot prefetch the data, we visually indicate the Axis Coordinates available at a given scrollbar position by prefetching coordinate data at discrete points to display when the user mouses over the scrollbar.

## Lifecycle
Status  | Description
:--: | -------------
Mounting | When the component is being loaded (mounted) into the DOM.  This is the initial state at construction.
Done | Set after an asynchronous operation has completed
[FetchMetadata](#initial-metadata) | Fetching metadata
[LoadingData](#loading-data) | Fetching cell data
[Rearranging](#rearrange) | The user has selected an action like `Flip`, `All Rows`, `All Columns`, or rearranged the pivot via drag and drop.  We must now retrieve new metadata and cell data and try to maintain our scroll position and cell selection/focus.
Rendering | Data is being pushed into the FlexGrid control
Ready | The pivot is ready to be interacted with and displayed.

### Configuration with a PivotID
* The PivotTable component is initialized with a `pivotID` prop.  From then on it manages its own internal state and connection to the backend.  This ID is currently populated from a [static list](http://sachs-webvise.advise-conning.com:8002/v1/query-result) and are shared among clients.

### <a name="initial-metadata"></a>Initial loading of Metadata
* We query the backend for metadata via a call to: `/v1/query-result/${id}/pivot/metadata`.  [Example](http://sachs-webvise.advise-conning.com:8002/v1/query-result/96515a3a-56b7-4f2b-9441-e642e718756f/pivot/metadata) 
* This tells us rows, columns, and axis arrangement.

## Fetching and Caching Pivot Data

## Scrolling
### Ways to scroll the pivot
#### Clicking on the Scrollbar
#### Drag Select
#### Thumb Dragging
#### Keyboard Shortcuts
* Ctrl-Home (End of data)
* Ctrl-End (End of data)
* Arrow key (moving row by row or column by column)
* Page Up
* Page Down

### Scroll Labels
* While scrolling, we display a tooltip indicating the axis values at the scroll location.




## Selection


## Todo
* Notify the backend when we're unmounted and no longer need the pivot.  PivotIDs either need to be unique by user or we need to pass both the user and the id to the backend.



## Notes
Pivot:    [Sample Metadata](http://sachs-webvise.advise-conning.com:8002/v1/query-result/45942327-4aa5-477b-b9ba-ce849df2f1a7/pivot/metadata)

```
{
	"rows": 20000,
	"columns": 84,
	"axes": "groupName": {
        "label": "Economy",
        "description": "Economy description"
        },
        "groupMembers": [
        {
            "label": "CH",
            "description": "CH description"
        },
        {
            "label": "DE",
            "description": "DE description"
        },
        {
            "label": "GB",
            "description": "GB description"
        },
        {
            "label": "US",
            "description": "US description"
        }
    ],
"groupType": "Generic",
	"rowAxes": [
		1
	],
	"columnAxes": [
		0,
		2
	]
}
```
