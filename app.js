var lin;
var contextMenu = document.getElementById('context-menu');
var newBrotherMenuHolder = document.getElementById("newBrotherMenuHolder");
var changeNameDialogHolder = document.getElementById("changeNameDialogHolder");
var changeClassDialogHolder = document.getElementById("changeClassDialogHolder");
var contextMenuActiveClass = "context-menu-active";
var holderActive = "holderActive"
var disapearTimer;
var selectedBrother;

/** Load in the tree data, either from the data.txt file, or the fake data backup
 */
function loadTreeData()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "data.txt", true);
    rawFile.onreadystatechange = function ()
    {
        console.log(rawFile);
        if(rawFile.readyState === 4 && rawFile.responseText !== "")
        {
            var treeData = rawFile.responseText;
            lin = new LineageTree(treeData);
            updateGraph();
        }
    }
    
    rawFile.onerror = function()
    {
        console.error("File could not be reached. Falling back on fake data.");
        lin = new LineageTree(fakeJsonTreeData);
        updateGraph();
    }
    
    rawFile.send();
}

/** Draws the svg to the vizStuff div
 */
function drawViz(){
    var vizString = lin.toViz();
    console.log(vizString);
    document.getElementById('vizStuff').innerHTML = Viz(vizString);
}

/** Handles when a brother is clicked
 *
 * @param {mouseEvent} e
 */
function handleBrotherClick(e) {
    e.preventDefault();
    var elem = e.srcElement || e.target;
    var par = elem.parentElement || elem.parentNode;
    var id = par.childNodes[0].innerHTML;
    var bro = lin.searchId(id);
    
    selectedBrother = bro;
    
    console.log("id: " + bro.id + "\nname: " + bro.name + "\ninitiation class: " + bro.initiationClass);
    
    moveContextMenuTo(e);
}

/** Moves the popupMenu to wherever the mouse was clicked
 *
 * @param {mouseEvent}
 */
function moveContextMenuTo(e) {
    contextMenu.style.left = ((e.pageX || e.layerX) - 10) + "px";
    contextMenu.style.top = ((e.pageY || e.layerY) - 10) + "px";
    
    window.clearTimeout(disapearTimer);
    contextMenu.classList.add(contextMenuActiveClass);
}

/** Hide the menu if the mouse leaves for 500ms;
 */
function hideMenu(e){
    if (!clickedABrother(e)){
        contextMenu.classList.remove(contextMenuActiveClass);
    }
}
document.body.onclick = hideMenu;

/** @returns {Boolean}  Whether or not the click was on a brother
 */
function clickedABrother(e) {
    var el = e.srcElement || e.target;
    
    console.log(el.tagName);
    
    return  el.tagName == "polygon" ||
            el.tagName == "text";
}

/** Makes all of the brothers clickable
 */
function makeClickable() {
    var nodes = document.getElementsByClassName("node");
    for (var i = 0; i < nodes.length; i++){
        nodes.item(i).oncontextmenu = handleBrotherClick;
    }
}

/** Updates the graph by redrawing and making the brothers clickable
 */
function updateGraph() {
    drawViz()
    makeClickable();
}





/********************************
 ** The context menu functions **
 ********************************/

/** Change the name of the selected brother
 */
function showChangeNameDialog(){
    document.getElementById('cnd_previous').innerHTML = "Change name from " + selectedBrother.name + " to";
    
    changeNameDialogHolder.classList.add(holderActive);
    document.getElementById('cnd_name').focus();
}

/** Change the initiation class of the selected brother
 */
function showChangeClassDialog() {
    document.getElementById('ccd_previous').innerHTML = "Change class from " + selectedBrother.initiationClass + " to";
    changeClassDialogHolder.classList.add(holderActive);
    document.getElementById('ccd_class').focus();
}

/** Add a new brother as the little of the selected brother
 */
function showNewBrotherDialog(){
    newBrotherMenuHolder.classList.add(holderActive);
    document.getElementById('nbm_name').focus();
}





/************************************
 ** The New Brother menu functions **
 ************************************/

/** Adds the new brother as a little to the selected brother
 */
function confirmNewBrother() {
    var name = document.getElementById('nbm_name').value;
    var initiationClass = document.getElementById('nbm_class').value;
    if (name.trim() == "" || initiationClass.trim() == "") return;
    
    selectedBrother.littles.push(BrotherFactory.new(name, initiationClass));
    
    hideNewBrotherMenu();
    
    updateGraph();
}

/** Cancels out of the newBrotherMenu
 */
function hideNewBrotherMenu() {
    newBrotherMenuHolder.classList.remove(holderActive);
    
    document.getElementById('nbm_name').value = "";
    document.getElementById('nbm_class').value = "";
}

/** Confirm the new name of the selected brother
 */
function confirmChangeName() {
    var name = document.getElementById('cnd_name').value;
    if (name.trim() == "" ) return;
    
    selectedBrother.name = name;
    
    hideChangeNameDialog();
    
    updateGraph();
}

/** Cancels out of the change name dialog
 */
function hideChangeNameDialog() {
    changeNameDialogHolder.classList.remove(holderActive);
    
    document.getElementById('cnd_name').value = "";
}

/** Confirms the new class of the selected brother
 */
function confirmChangeClass() {
    var initiationClass = document.getElementById('ccd_class').value;
    if (initiationClass.trim() == "" ) return;
    
    selectedBrother.initiationClass = initiationClass;
    
    hideChangeClassDialog();
    
    updateGraph();
}

/** Canvels out of the change class dialog
 */
function hideChangeClassDialog() {
    changeClassDialogHolder.classList.remove(holderActive);
    
    document.getElementById('cnd_name').value = "";
}

/*****************
 ** Final setup **
 *****************/
function toggleDebug() {
    BrotherFactory.debugMode = !BrotherFactory.debugMode;
    updateGraph();
    document.getElementById('b_toggleDebug').innerHTML = "Debug: " + (BrotherFactory.debugMode===true?"On":"Off");
}

// Set onclick functions for the context menu
(function(){
    // Menu is active
    
    // Change name
    document.getElementById('mia_name').onclick = showChangeNameDialog;
        // Confirm the name
        document.getElementById('cnd_confirm').onclick = confirmChangeName;
        // Cancel the name
        document.getElementById('cnd_cancel').onclick = hideChangeNameDialog;
    
    // Change Class
    document.getElementById('mia_class').onclick = showChangeClassDialog;
        // Confirm the class
        document.getElementById('ccd_confirm').onclick = confirmChangeClass;
        // Cancel the class
        document.getElementById('ccd_cancel').onclick = hideChangeClassDialog;
    
    // Add little
    document.getElementById('mia_little').onclick = showNewBrotherDialog;
        // Confirm the little
        document.getElementById('nbm_confirm').onclick = confirmNewBrother;
        // Cancel the little
        document.getElementById('nbm_cancel').onclick = hideNewBrotherMenu;
    
    // Debug mode
    document.getElementById('b_toggleDebug').onclick = toggleDebug;
})()


// now that we are done, lets start the page
loadTreeData();


