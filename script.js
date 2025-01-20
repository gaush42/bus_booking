const bookingForm = document.getElementById("bookingForm");
const filterDropdown = document.getElementById("filter");
const bookingTable = document.getElementById("bookingTable").querySelector("tbody");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = {
        id: Date.now().toString(),
        name: bookingForm.name.value,
        email: bookingForm.email.value,
        phone: bookingForm.phone.value,
        bus: bookingForm.bus.value,
    };

    bookings.push(booking);
    saveToLocalStorage();
    bookingForm.reset();
    renderBookings();
});

function saveToLocalStorage() {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}


function renderBookings() {
    const filterValue = filterDropdown.value;
    bookingTable.innerHTML = "";

    bookings
        .filter((booking) => filterValue === "All" || booking.bus === filterValue)
        .forEach((booking) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.bus}</td>
                <td>
                    <button onclick="editBooking('${booking.id}')">Edit</button>
                    <button onclick="deleteBooking('${booking.id}')">Delete</button>
                </td>
            `;
            bookingTable.appendChild(row);
        });
}

function deleteBooking(id) {
    bookings = bookings.filter((booking) => booking.id !== id);
    saveToLocalStorage();
    renderBookings();
}


function editBooking(id) {
    const booking = bookings.find((booking) => booking.id === id);

    bookingForm.name.value = booking.name;
    bookingForm.email.value = booking.email;
    bookingForm.phone.value = booking.phone;
    bookingForm.bus.value = booking.bus;

    deleteBooking(id);
}


filterDropdown.addEventListener("change", renderBookings);

renderBookings();
