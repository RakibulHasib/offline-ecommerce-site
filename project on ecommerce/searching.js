const search = () => {
    const searchBox = document.getElementById("search-input").value.toUpperCase();
    const storeItems = document.getElementById("middle2");
    const product = document.querySelectorAll(".Product-item");
    const pname = storeItems.getElementsByTagName("p");

    for (var i = 0; i < pname.length; i++) {
        let match = product[i].getElementsByTagName('p')[0];

        if (match) {
            let textvalue = match.textContent || match.innerHTML

            if (textvalue.toUpperCase().indexOf(searchBox) > -1) {
                product[i].style.display = "";
            }
            else {
                product[i].style.display = "none";
            }
        }
    }
}