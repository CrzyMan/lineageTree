/*
 * TODO: Decide on whether to use classes, or a Static that works on the data structure
 *
 * - I could probably get away with using the Static class for brothers , and the normal class for LineageTree
 * - - This would make it easy to translate between object and JSON, but make the project a little harder to follow
 */

var fakeJsonTreeData = '{"name":"Padrick Mulligan","id":"1","initiationClass":"Beta Delta","littles":[{"name":"Alexander Vasko","id":"2","initiationClass":"Beta Zeta","littles":[{"name":"Tyler Whitehouse","id":"3","initiationClass":"Beta Lambda","littles":[{"name":"Zach Swanson","id":"4","initiationClass":"Beta Nu","littles":[],"picture":"","wiki":""}],"picture":"","wiki":""}],"picture":"","wiki":""}],"picture":"","wiki":""}';

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
        // TODO: find and set the id;
    }
    
    /** @returns {String} The lineage tree in viz.js format
     */
    this.toViz = function(){
        var sb = [];
        sb.push("digraph {\n\n  node [ shape=box color=black fillcolor=white style=filled]\n\n")
        sb.push(BrotherFactory.toViz(this.root));
        sb.push(" } ");
        return sb.join("");
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
    "currentId": -1,
    "getNextId": function(){return ++BrotherFactory.currentId;},
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
        "wiki": "",
        "id": BrotherFactory.getNextId(),
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

/** @returns {String} returns the inclusive lineage under this brother in viz.js format
 */
BrotherFactory.toViz = function(brother){
    var sb = [];
    
    // node data
    sb.push("  ", brother.id, " [\n    label=< <B>", brother.name, "</B> <br/>" , brother.initiationClass, " >\n  ]\n\n");
    
    // write node data for littles
    for (var i = 0; i < brother.littles.length; i++) {    
        sb.push(BrotherFactory.toViz(brother.littles[i]));
    }
    
    // connect to littles
    sb.push("  ", brother.id, " -> { ");
    for (var i = 0; i < brother.littles.length; i++) {
        // add connection
        sb.push(brother.littles[i].id, " ");
    }
    sb.push(" } \n\n");
    
    return sb.join("");
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