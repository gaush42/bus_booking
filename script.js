const bookingForm = document.getElementById("bookingForm");
const filterDropdown = document.getElementById("filter");
const bookingTable = document.getElementById("bookingTable").querySelector("tbody");


const API_URL = "https://crudcrud.com/api/369ea01982d14fb29b04c4699daf2e82/bookings";


document.addEventListener("DOMContentLoaded", fetchBookings);

bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const booking = {
        name: bookingForm.name.value,
        email: bookingForm.email.value,
        phone: bookingForm.phone.value,
        bus: bookingForm.bus.value,
    };

    try {
        await fetch(API_URL, { mode: 'no-cors' },{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
        });

        bookingForm.reset();
        fetchBookings();
    } catch (error) {
        console.error("Error adding booking:", error);
    }
});

async function fetchBookings() {
    try {
        const response = await fetch(API_URL);
        const bookings = await response.json();
        renderBookings(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

function renderBookings(bookings) {
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
                    <button onclick="editBooking('${booking._id}')">Edit</button>
                    <button onclick="deleteBooking('${booking._id}')">Delete</button>
                </td>
            `;
            bookingTable.appendChild(row);
        });
}

async function deleteBooking(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchBookings();
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}

async function editBooking(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const booking = await response.json();

        bookingForm.name.value = booking.name;
        bookingForm.email.value = booking.email;
        bookingForm.phone.value = booking.phone;
        bookingForm.bus.value = booking.bus;

        await deleteBooking(id);
    } catch (error) {
        console.error("Error editing booking:", error);
    }
}

filterDropdown.addEventListener("change", fetchBookings);
