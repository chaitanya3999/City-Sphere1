// Search functionality
function searchMedicine() {
    const searchInput = document.getElementById("searchInput").value;
    if (searchInput.trim() !== "") {
      alert(Searching for "${searchInput}"...);
    } else {
      alert("Please enter a search term.");
    }
  }

  // Select category
  function selectCategory(category) {
    document.getElementById("category").value = category;
    alert(Selected category: ${category});
  }

  // Submit order form
  function submitOrder(event) {
    event.preventDefault();
    const form = document.getElementById("medicineForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    alert(Order Submitted:\n${JSON.stringify(data, null, 2)});
  }