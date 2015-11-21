Zotero.Zotpie_Helpers = {
	// http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
	// slow?
	removeDuplicateItems: function(items) {
	    var seen = {};
	    var out = [];
	    var len = items.length;
	    var j = 0;

	    for(var i = 0; i < len; i++) {
	         var item = items[i];
	         if(seen[item.id] !== 1) {
	               seen[item.id] = 1;
	               out[j++] = item;
	         }
	    }
	    return out;
	},

	// b - a
	// slow?
	diff: function(b, a) {
    	return b.filter(function(x) {return !(a.indexOf(x) > -1); });
	},

	/*
	Copyright (c) 2011 Andrei Mackenzie
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/

	// Compute the edit distance between the two given strings
	editDistance: function(a, b) {
	  if(a.length == 0) return b.length; 
	  if(b.length == 0) return a.length; 

	  var matrix = [];

	  // increment along the first column of each row
	  var i;
	  for(i = 0; i <= b.length; i++){
	    matrix[i] = [i];
	  }

	  // increment each column in the first row
	  var j;
	  for(j = 0; j <= a.length; j++){
	    matrix[0][j] = j;
	  }

	  // Fill in the rest of the matrix
	  for(i = 1; i <= b.length; i++){
	    for(j = 1; j <= a.length; j++){
	      if(b.charAt(i-1) == a.charAt(j-1)){
	        matrix[i][j] = matrix[i-1][j-1];
	      } else {
	        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
	                                Math.min(matrix[i][j-1] + 1, // insertion
	                                         matrix[i-1][j] + 1)); // deletion
	      }
	    }
	  }

	  return matrix[b.length][a.length];
	},

	insertAtLocation: function(element, array) {
		array.splice(locationOf(element, array) + 1, 0, element);
		return array;
	},

	// http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
	locationOf: function (element, array, compartor, start, end) {
    	if (array.length === 0)
	        return -1;

	    start = start || 0;
	    end = end || array.length;
	    var pivot = (start + end) >> 1;  // should be faster than the above calculation

	    var c = compartor(element, array[pivot]);
	    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

	    switch (c) {
	        case -1: return locationOf(element, array, comparer, start, pivot);
	        case 0: return pivot;
	        case 1: return locationOf(element, array, comparer, pivot, end);
	    };
	}

};
