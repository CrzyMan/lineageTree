/*
 * TODO: Decide on whether to use classes, or a Static that works on the data structure
 *
 * - I could probably get away with using the Static class for brothers , and the normal class for LineageTree
 * - - This would make it easy to translate between object and JSON, but make the project a little harder to follow
 */

var fakeJsonTreeData = "";

function LineageTree(treeData) {
    
    // The root of the tree
    this.root = null;
    
    
    /** Retrieve a brother whose property contains the given name
     * 
     * @param {String} property  The name of the property to search
     * @param {String} value  The value to compare to
     *
     * @returns {Brother[]}  The list of brothers that meet the criteria
     */
    this.search = function(property, value){
        if (this.root.propertyIsEnumerable(property) == false) return [];
        
        var results = [];
        if (this.root != null){
            var stack = [this.root];
            while(stack.length > 0){
                var brother = stack.pop();
                stack = stack.concat(brother.littles);
                
                if (brother[property].includes(value)) {
                    results.push(brother);
                }
            }
        }
        return results;
    }
    
    /** @returns {int} The number of brothers in the tree
     */
    this.getSize = function(){
        if (this.root == null) return 0;
        return BrotherFactory.getSize(this.root);
    }
    
    /** @returns {height} The height of the tree
     */
    this.getHeight = function(){
        if (this.root == null) return 0;
        return BrotherFactory.getHeight(this.root);
    }
    
    
    /** @returns {String} The lineage tree in the JSON format
     */
    this.toJSON = function(){
        return JSON.stringify(this.root);
    }
    
    /** Turns JSON back into a lineage tree
     * 
     * @param {String} jsonTreeData  The JSON data
     */
    this.parseTree = function(jsonTreeData){
        this.root = JSON.parse(jsonTreeData);
    }
    
    /** Sets a new root for the tree
     *
     * @param {Brother} newRoot
     */
    this.setRoot = function(newRoot){
        this.root = newRoot;
    }
    
    // Part of the constructor
    if (typeof treeData === "string") {
        this.parseTree(treeData);
    } else if (typeof treeData === "object") {
        this.setRoot(treeData);
    }
}




/** The Brother Factory
 */
var BrotherFactory = {
};

/**
 * @param {String}
 */
BrotherFactory.new = function(name, initiationClass){
    return {
        "name": name || "",
        "initiationClass": initiationClass || "",
        "littles": [],
        "picture": "",
        "wiki": ""
    };
}

/** Whether or not the other brother is the same brother
 *
 * @param {Brother} brother  The brother to compare to
 *
 * @returns {boolean}
 */
BrotherFactory.areEqual = function(b1, b2){
    return b1.name==b2.name && b1.initiationClass == b2.initiationClass;
}

/** @returns {int} The number of brothers inclusively under this brother
 */
BrotherFactory.getSize = function(brother){
    if (brother == null) return 0;
    
    var sum = 1;
    for (var i = 0; i < brother.littles.length; i++){
        sum += BrotherFactory.getSize(brother.littles[0]);
    }
    return sum;
}

/** @returns {int} The height of the tree inclusively under the brother
 */
BrotherFactory.getHeight = function(brother){
    if (brother == null) return 0;
    
    var height = 0;
    for (var i = 0; i < brother.littles.length; i++){
        var h = BrotherFactory.getHeight(brother.littles[i]);
        if (h > height) height = h;
    }
    return height + 1;
}



/** Just some utilities
 */
function addLittles(layer, bro){
  bro.littles.push(BrotherFactory.new(bro.name + "a", ""+layer));
  bro.littles.push(BrotherFactory.new(bro.name + "b", ""+layer));
  if (layer !== 1){
    addLittles(layer - 1, bro.littles[0]);
    addLittles(layer - 1, bro.littles[1]);
  }
}