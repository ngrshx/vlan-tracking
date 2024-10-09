document.addEventListener("DOMContentLoaded", () => {
  // Fetch the VLAN data from the new API endpoint
  fetch("/api/vlans")
    .then((response) => response.json())
    .then((data) => {
      let allData = [];

      // Since your data is coming as a flat array of objects now, you can directly use it
      allData = data; // Use the fetched data directly

      // Initialize the DataTable with the fetched data
      $("#example").DataTable({
        data: allData,
        columns: [
          { data: "VLAN" },
          {
            data: "SERV_Port_NUM",
            render: function (data) {
              let color = data > 3000 ? "red" : "#00ff00";
              return `<span style="color:${color}">${data}</span>`;
            },
          },
          { data: "ipaddress" }, // Display the IP address dynamically
          {
            data: "Replaced_Vlan", // Adjust according to your field names in MongoDB
            render: function (data, type, row) {
              // Check if the data is undefined, and provide a fallback
              const replacedVlan =
                data !== undefined && data !== null ? data : "Fixed";

              // Render the checkbox with the fallback text
              return `<input type="checkbox" class="replace-vlan-checkbox" data-vlan="${row.VLAN}" data-ipaddress="${row.ipaddress}"> ${replacedVlan}`;
            },
          },
        ],
      });
    })
    .catch((error) => console.error("Error fetching VLAN data:", error));

  // Add an event listener to handle checkbox changes
  document.addEventListener("change", function (e) {
    if (e.target && e.target.classList.contains("replace-vlan-checkbox")) {
      const isChecked = e.target.checked;
      const vlan = e.target.getAttribute("data-vlan");
      const ipaddress = e.target.getAttribute("data-ipaddress");

      console.log(
        `Checkbox for VLAN ${vlan} with IP ${ipaddress} is ${
          isChecked ? "checked" : "unchecked"
        }`
      );

      // You can handle the checkbox state here, e.g., send it to the server, store locally, etc.
    }
  });
});
