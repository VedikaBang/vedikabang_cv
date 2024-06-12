function toggleDetails(detailId) {
    console.log("Function called for:", detailId);  // This line helps to debug
    var element = document.getElementById(detailId);
    if (element.style.display === 'none') {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  }
  