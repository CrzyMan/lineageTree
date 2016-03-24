/*
 * TODO: Decide on whether to use classes, or a Static that works on the data structure
 *
 * - I could probably get away with using the Static class for brothers , and the normal class for LineageTree
 * - - This would make it easy to translate between object and JSON, but make the project a little harder to follow
 */

var fakeJsonTreeData = '{"name":"","class":"","littles":[{"name":"William O. Ried","class":"Alpha","littles":[{"name":"Steven P. Rhea","class":"Beta","littles":[{"name":"Michael L. Fagg","class":"Epsilon","littles":[{"name":"L. Kyle Massey","class":"Lambda","littles":[{"name":"Cody Schaff","class":"Nu","littles":[],"gradDate":"","id":"16"},{"name":"Jason C. Hittle","class":"Omicron","littles":[],"gradDate":"","id":"19"},{"name":"Jason M. Bumgardner","class":"Rho","littles":[{"name":"Jason L. DeBruhler","class":"Chi","littles":[{"name":"Alan R. Study","class":"Psi","littles":[],"gradDate":"","id":"22"}],"gradDate":"","id":"21"}],"gradDate":"","id":"20"}],"gradDate":"","id":"15"},{"name":"Douglas Brooks","class":"Mu","littles":[],"gradDate":"","id":"17"}],"gradDate":"","id":"11"},{"name":"Eugene T. Coughran","class":"Eta","littles":[{"name":"James Wagman","class":"Iota","littles":[],"gradDate":"","id":"18"}],"gradDate":"","id":"12"}],"gradDate":"","id":"8"},{"name":"Allan Thompson","class":"Gamma","littles":[{"name":"Kurt F. Breischaft","class":"Epsilon","littles":[{"name":"Mark B. Kraeling","class":"Eta","littles":[],"gradDate":"","id":"23"}],"gradDate":"","id":"13"},{"name":"Harold Kays","class":"Iota","littles":[],"gradDate":"","id":"14"}],"gradDate":"","id":"9"},{"name":"Scott Terek","class":"Epsilon","littles":[{"name":"Stephen A. Osaba","class":"Zeta","littles":[{"name":"Raymond L. Fisher","class":"Eta","littles":[],"gradDate":"","id":"26"}],"gradDate":"","id":"24"},{"name":"Scott A. Weishaar","class":"Eta","littles":[{"name":"Richard C. Bergen","class":"theta","littles":[],"gradDate":"","id":"27"}],"gradDate":"","id":"25"}],"gradDate":"","id":"10"}],"gradDate":"","id":"7"}],"gradDate":"","id":"6"}';

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
        if (this.root == null || this.root.propertyIsEnumerable(property) == false) return [];
        
        var results = [];
        if (this.root != null){
            var stack = [this.root];
            while(stack.length > 0){
                var brother = stack.pop();
                stack = stack.concat(brother.littles);
                
                if (brother[property].toLowerCase().includes(value.toLowerCase())) {
                    results.push(brother);
                }
            }
        }
        return results;
    }
    
    /** Retrieve a brother whose id is the same as the given id
     * 
     * @param {String} id  The unique id we are looking for
     *
     * @returns {Brother}  The brother with the ide
     */
    this.searchId = function(id){
        if (this.root == null) return [];
        
        var results = [];
        if (this.root != null){
            var stack = [this.root];
            while(stack.length > 0){
                var brother = stack.pop();
                stack = stack.concat(brother.littles);
                
                if (brother.id.toLowerCase() === id.toLowerCase()) {
                    return brother;
                }
            }
        }
        return null;
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
        BrotherFactory.currentId = this.getHighestId();
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
        BrotherFactory.currentId = this.getHighestId();
    }
    
    /** @returns {int}  The highest id in the lineage tree
     */
    this.getHighestId = function(){
        return BrotherFactory.getHighestId(this.root);
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
    "debugMode": false,
};

/** Constructs a new brother
 * 
 * @param {String} name  The name of the brother
 * @param {String} intitiationClass  The initiation class of the brother
 * @param {String} gradDate  The graduation month and year of the brother
 *
 * @returns {Object}  The new brother
 */
BrotherFactory.new = function(name, initclass, gradDate){
    return {
        "name": name || "",
        "class": initclass || "",
        "littles": [],
        "gradDate": gradDate || "",
        "id": ""+BrotherFactory.getNextId(),
    };
}

/** Whether or not the other brother is the same brother
 *
 * @param {Brother} brother  The brother to compare to
 *
 * @returns {boolean}
 */
BrotherFactory.areEqual = function(b1, b2){
    return b1.name==b2.name && b1.class == b2.class;
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
    
    // If the brother isn't "null"
    if (BrotherFactory.debugMode || brother.name !== "") {
        // Node data
        sb.push("  ", brother.id, " [\n    label=< <B>", brother.name, " </B><br/>" , brother.class, "<br/>", brother.gradDate, ">\n  ]\n\n");
        
        // Connect to littles
        sb.push("  ", brother.id, " -> { ");
        for (var i = 0; i < brother.littles.length; i++) {
            // Add connection
            sb.push(brother.littles[i].id, " ");
        }
        sb.push(" } \n\n");
    }
    
    
    // Write node data for littles
    for (var i = 0; i < brother.littles.length; i++) {    
        sb.push(BrotherFactory.toViz(brother.littles[i]));
    }
    
    return sb.join("");
}

/** @returns {int}  The Highest id inclusively under this brother
 */
BrotherFactory.getHighestId = function(brother){
    var highest = -1;
    var bId = parseInt(brother.id);
    if (bId > highest) highest = bId;
    for (var i = 0; i < brother.littles.length; i++) {
        var littleHighest = BrotherFactory.getHighestId(brother.littles[i]);
        if (littleHighest > highest) highest = littleHighest;
    }
    return ""+highest;
}






/*************************
 ** Just some utilities **
 *************************/

// makes a big tree
function addLittles(layer, bro){
  bro.littles.push(BrotherFactory.new(bro.name + "a", ""+layer));
  bro.littles.push(BrotherFactory.new(bro.name + "b", ""+layer));
  if (layer !== 1){
    addLittles(layer - 1, bro.littles[0]);
    addLittles(layer - 1, bro.littles[1]);
  }
}