/*
 * TODO: Decide on whether to use classes, or a Static that works on the data structure
 *
 * - I could probably get away with using the Static class for brothers , and the normal class for LineageTree
 * - - This would make it easy to translate between object and JSON, but make the project a little harder to follow
 */

var fakeJsonTreeData = "";

function LineageTree(jsonTreeData) {
    
    // The root of the tree
    this.root = null;
    
    /** Retrieve a brother whose name contains the given name
     * 
     * @param {String} name  The name of the brother
     *
     * @returns {Brother[]}  The list of brothers that meet the criteria
     */
    this.getBrothersWithName = function(name){
        var results = [];
        if (this.root != null){
            var stack = [].concat(this.root);
            while(stack.length > 0){
                var brother = stack.pop();
                stack = stack.concat(brother.getLittles());
                
                if (brother.getName().indexOf(name) >= 0) {
                    results.push(brother);
                }
            }
        }
        return results;
    }
    
    /** @returns {String} The lineage tree in the JSON format
     */
    this.toJSON = function(){
        return this.root.toJSON();
    }
    
    /** Turns JSON back into a lineage tree
     * 
     * @param {String} jsonTreeData  The JSON data
     */
    this.parseTree = function(jsonTreeData){
        var data = JSON.parse(jsonTreeData);
        this.root = data.root || null;
    }
    
    /** Sets a new root for the tree
     *
     * @param {Brother} newRoot
     */
    this.setRoot = function(newRoot){
        this.root = newRoot;
    }
    
    // Part of the constructor
    if (jsonTreeData) {
        this.parseTree(jsonTreeData);
    }
}


/** The Brother class
 *
 * @constructor
 * @param {String} name  The name of the brother
 * @param {String} initiationClass  The initiation class of the brother
 */
function Brother(name, initiationClass){
    // The big of the brother
    this.big = null;
    
    // The littles of the brother
    this.littles = [];
    
    // The path picture of the brother to be displayed
    this.picturePath = "";
    
    // The name of the brother
    this.name = name;
    
    // The initiation class of the brother
    this.initiationClass = initiationClass;
    
    
    /** Gets the name of the brother
     *
     * @returns {String} The name of the brother
     */
    this.getName = function(){
        return name;
    }
    
    /** Sets the name of the brother
     *
     * @param {String} newName  The name of the brother
     *  
     */
    this.setName = function(newName){
        this.name = newName;
    }
    
    
    
    /** @returns {Stiring} The name of the initiation class
     */
    this.getInitiationClass = function(){
        return initiationClass;
    }
    
    /** Set the name of the brother's initiation class
     * 
     * @param {String} newInitiationClass
     */
    this.setInitiationClass = function(newInitiationClass){
        this.initiationClass = newInitiationClass;
    }
    
    
    
    /** Set the brother's big brother
     *
     * @param {Brother} big
     */
    this.setBig = function(hisBig){
        this.big = hisBig;
    }
    
    /** Remove the brother's big
     */
    this.removeBig = function(){
        this.setBig(null);
    }
    
    /** @returns {Brother} The brother's big
     */
    this.getBig = function(){
        return this.big;
    }
    
    
    
    /** @returns {Brothers[]} The brother's littles
     */
    this.getLittles = function(){
        return this.littles;
    }
    
    /** Adds a little to the brother
     * 
     * @param {Brother} theLittle
     */
    this.addLittle = function(theLittle){
        theLittle.setBig(this);
        this.littles.push(theLittle);
    }
    
    /** Removes the little from the brother's list of littles
     *
     * @param {Brother} little
     */
    this.removeLittle = function(theLittle){
        theLittle.setBig(null);
        this.littles.remove(theLittle);
    }

    
    
    /** Whether or not the other brother is the same brother
     *
     * @param {Brother} brother  The brother to compare to
     *
     * @returns {boolean}
     */
    this.equals = function(brother){
        return this.name==brother.getName() && this.initiationClass == brother.getInitiationClass();
    }
    
    
    
    /** Sets the path for the picture of the brother
     *
     * @param {String} newPicturePath
     */
    this.setPicturePath = function(newPicturePath){
        this.picturePath = newPicturePath;
    }
    
    /** @returns {String} The path for the picture of the brother
     */
    this.getPicturePath = function(){
        return this.picturePath;
    }
    
    
    
    /** Converts the brother's data to a JSON formatted string
     *
     * @returns {String} the formatted JSON
     */
    this.toJSON = function(){
        var result = "{\"name\": \"" + this.name +
            "\", \"initiationClass\": \"" + this.initiationClass +
            "\", \"picturePath\": \"" + this.picturePath +
            // "\", \"big\":\"" + this.big.g +
            "\", \"littles\":[";
        
        // Add all of the littles
        for (var i = 0; i < this.littles.length; i++) {
            if (i > 0) result += ", ";
            result += this.littles[i].toJSON();
        }
        
        result += "]}";
        
        return result;
    }
}