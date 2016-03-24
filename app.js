/**********************
 ** Global variables **
 **********************/
// lineage tree
var lin;

// DOM elems
var contextMenu = document.getElementById('context-menu');
var newBrotherMenuHolder = document.getElementById("newBrotherDialogHolder");
var changeNameDialogHolder = document.getElementById("changeNameDialogHolder");
var changeClassDialogHolder = document.getElementById("changeClassDialogHolder");

// CSS classes
var contextMenuActiveClass = "context-menu-active";
var holderActive = "holderActive";
var highlightedBrother = "highlightedBrother";

// Brother stuff
var selectedBrother;






/***********************
 ** General Functions **
 ***********************/

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
    //console.log(vizString);
    document.getElementById('vizStuff').innerHTML = Viz(vizString);
    removeTitlesFromVizSVG();
}

/** Because I didn't want to go through the settings and do it that way
 */
function removeTitlesFromVizSVG() {
    var titles = document.getElementsByTagName("title");
    for (var i = 1; i < titles.length; i++) {
        var id = titles[i].innerHTML;
        var par = titles[i].parentNode || titles[i].parentElement;
        var att = document.createAttribute("bro-id");
        att.value = id;
        par.setAttributeNode(att);
        titles[i].innerHTML = "";
    }
}

/** Handles when a brother is clicked
 *
 * @param {mouseEvent} e
 */
function handleBrotherClick(e) {
    e.preventDefault();
    var elem = e.srcElement || e.target;
    var par = elem.parentElement || elem.parentNode;
    var id = par.getAttribute("bro-id");
    
    console.log("id: " + id);
    
    var bro = lin.searchId(id);
    
    selectedBrother = bro;
    
    console.log("id: " + bro.id + "\nname: " + bro.name + "\ninitiation class: " + bro.class);
    
    moveContextMenuTo(e);
}

/** Moves the popupMenu to wherever the mouse was clicked
 *
 * @param {mouseEvent}
 */
function moveContextMenuTo(e) {
    contextMenu.style.left = ((e.pageX || e.layerX) - 10) + "px";
    contextMenu.style.top = ((e.pageY || e.layerY) - 10) + "px";
    
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
    
    var par = el.parentElement;
    
    var result = (par.tagName === "g" && par.id !== "graph0" && !par.id.includes("edge") );
    
    //console.log("result: ", result);
    
    return  result;
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
    document.getElementById('ccd_previous').innerHTML = "Change class from " + selectedBrother.class + " to";
    changeClassDialogHolder.classList.add(holderActive);
    document.getElementById('ccd_class').focus();
}

/** Add a new brother as the little of the selected brother
 */
function showNewBrotherDialog(){
    document.getElementById('nbd_label').innerHTML = "New Brother";
    
    newBrotherMenuHolder.classList.add(holderActive);
    document.getElementById('nbd_name').focus();
}

/** Add a new brother as the little of the selected brother
 */
function showEditBrotherDialog(){
    document.getElementById('nbd_label').innerHTML = "Edit Brother";
    
    document.getElementById('nbd_name').value = selectedBrother.name;
    document.getElementById('nbd_class').value = selectedBrother.class;
    document.getElementById('nbd_grad').value = selectedBrother.gradDate;
    
    newBrotherMenuHolder.classList.add(holderActive);
    document.getElementById('nbd_name').focus();
}

/** Brings up the dialog to save the lineage as a text file
 */
function showSaveLineageDialog(){
    var content = JSON.stringify(lin.root);
    download("lineage.txt", content);
}
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}





/************************************
 ** The New Brother menu functions **
 ************************************/

/** Adds the new brother as a little to the selected brother
 */
function confirmNewBrother() {
    var name = document.getElementById('nbd_name').value;
    var initclass = document.getElementById('nbd_class').value;
    var gradDate = document.getElementById('nbd_grad').value;
    if (name.trim() === "" || initclass.trim() === "") return;
    
    if (document.getElementById('nbd_label').innerHTML.includes("New") === true){
        selectedBrother.littles.push(BrotherFactory.new(name, initclass, gradDate));
    } else {
        selectedBrother.name = name;
        selectedBrother.class = initclass;
        selectedBrother.gradDate = gradDate;
    }
    hideNewBrotherMenu();
    
    updateGraph();
}

/** Cancels out of the newBrotherMenu
 */
function hideNewBrotherMenu() {
    newBrotherMenuHolder.classList.remove(holderActive);
    
    document.getElementById('nbd_name').value = "";
    document.getElementById('nbd_class').value = "";
    document.getElementById('nbd_grad').value = "";
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
    var initclass = document.getElementById('ccd_class').value;
    if (initclass.trim() == "" ) return;
    
    selectedBrother.class = initclass;
    
    hideChangeClassDialog();
    
    updateGraph();
}

/** Cancels out of the change class dialog
 */
function hideChangeClassDialog() {
    changeClassDialogHolder.classList.remove(holderActive);
    
    document.getElementById('cnd_name').value = "";
}







/****************************
 ** Control Menu Functions **
 ****************************/

/** Highlights the brothers that match the search
 */
function highlightName() {
    unhighlightAllBrothers();
    var name = document.getElementById('cm_broName').value.trim();
    var bros = lin.search('name', name);
    for (var i = 0; i < bros.length; i++) {
        highlightBrotherWithId(bros[i].id);
    }
}


/** Highlights the brother with a specific Id
 *
 * @param {int} id  The id of the brother to highlight
 */
function highlightBrotherWithId(id) {
    var bro = document.querySelector("g[bro-id=\""+id+"\"] polygon");
    if (bro == null) return;
    
    var classes = bro.classList;
    classes.add(highlightedBrother);
}


/** Unhighlight every brother
 */
function unhighlightAllBrothers() {
    var bros = document.querySelectorAll("g[bro-id] polygon."+highlightedBrother);
    if (bros == null) return;
    
    for (var i = 0; i < bros.length; i++) {
        var bro = bros[i];
        var classes = bro.classList;
        classes.remove(highlightedBrother);
    }
}



/*****************
 ** Final setup **
 *****************/
function toggleDebug() {
    BrotherFactory.debugMode = !BrotherFactory.debugMode;
    updateGraph();
    document.getElementById('b_toggleDebug').innerHTML = "Turn Debug " + (BrotherFactory.debugMode===false?"On":"Off");
}

// Set onclick functions for the context menu
(function(){
    // Control Menu
    // Search for brother
    document.getElementById('cm_searchBroName').onclick = highlightName;
    // Debug mode
    document.getElementById('b_toggleDebug').onclick = toggleDebug;
    
    // Context Menu
    // Add little
    document.getElementById('mia_little').onclick = showNewBrotherDialog;
        // Confirm the little
        document.getElementById('nbd_confirm').onclick = confirmNewBrother;
        // Cancel the little
        document.getElementById('nbd_cancel').onclick = hideNewBrotherMenu;
    
    // Edit Brother
    document.getElementById('mia_edit').onclick = showEditBrotherDialog;
        // These are the same
        // Confirm the little
        // document.getElementById('nbd_confirm').onclick = confirmNewBrother;
        // Cancel the little
        // document.getElementById('nbd_cancel').onclick = hideNewBrotherMenu;
    
    // Get lineage file
    document.getElementById('mia_file').onclick = showSaveLineageDialog;
   
})()


// now that we are done, lets start the page
loadTreeData();