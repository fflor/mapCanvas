function copyToClipboard(copyText){
    //copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    //alert("copied the text: " + copyText);
    //change the copy button's text to "copied"
    document.getElementById("button-copy").innerText = "copied";
    //add a class to the button to change the color
    document.getElementById("button-copy").classList.add("copied");
    //disable the button
    document.getElementById("button-copy").disabled = true;
    //remove the class after 1 second
    setTimeout(function(){
        document.getElementById("button-copy").classList.remove("copied");
        document.getElementById("button-copy").innerText = "copy to clipboard";
        document.getElementById("button-copy").disabled = false;
    }, 1000);


}
 
