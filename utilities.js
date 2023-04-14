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

function roundToMultiple(mutliple){
    let input = document.getElementById("reach-distance");
    let value = input.value;
    let rounded = Math.round(value / mutliple) * mutliple;
    input.value = rounded;
}


 function toggleCollapse(id){
    id = document.querySelector("#" + id);
            id.classList.toggle("active");
            let content = id.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
 
}

