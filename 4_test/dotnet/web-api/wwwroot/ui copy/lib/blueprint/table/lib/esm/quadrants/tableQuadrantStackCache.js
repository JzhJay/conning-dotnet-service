var TableQuadrantStackCache=function(){function t(){this.reset()}return t.prototype.reset=function(){this.cachedRowHeaderWidth=0,this.cachedColumnHeaderHeight=0,this.cachedScrollLeft=0,this.cachedScrollTop=0},t.prototype.getScrollOffset=function(t){return"scrollLeft"===t?this.cachedScrollLeft:this.cachedScrollTop},t.prototype.getRowHeaderWidth=function(){return this.cachedRowHeaderWidth},t.prototype.getColumnHeaderHeight=function(){return this.cachedColumnHeaderHeight},t.prototype.getScrollContainerClientWidth=function(){return this.cachedScrollContainerClientWidth},t.prototype.getScrollContainerClientHeight=function(){return this.cachedScrollContainerClientHeight},t.prototype.setColumnHeaderHeight=function(t){this.cachedColumnHeaderHeight=t},t.prototype.setRowHeaderWidth=function(t){this.cachedRowHeaderWidth=t},t.prototype.setScrollOffset=function(t,e){"scrollLeft"===t?this.cachedScrollLeft=e:this.cachedScrollTop=e},t.prototype.setScrollContainerClientWidth=function(t){this.cachedScrollContainerClientWidth=t},t.prototype.setScrollContainerClientHeight=function(t){this.cachedScrollContainerClientHeight=t},t}();export{TableQuadrantStackCache};