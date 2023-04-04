
// add months in hebrew to dropdown menu
let months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

//arrary of months in hebrew short names
const monthsShort = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני", "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"];

let dateSelected = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
let monthSelected = `${new Date().getMonth() + 1}`;
let yearSelected = `${new Date().getFullYear()}`;

const stateView = {
    calendarView: true,
    monthView: false,
    yearView: false,
}

// Get the input field and set the date format
const input = document.getElementById("datepicker-input");
const dateFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };

// Create the datepicker modal
const datepicker = document.createElement("div");
datepicker.classList.add("datepicker");
document.body.appendChild(datepicker);



//create container that holds datepicker
const datepickerContainer = document.createElement("div");
datepickerContainer.classList.add("datepicker-container");
datepicker.appendChild(datepickerContainer);

// Create the datepicker header
const header = document.createElement("div");
header.classList.add("datepicker-header");
datepickerContainer.appendChild(header);



// create button that hold the year selected currently
const yearButton = document.createElement("button");
yearButton.classList.add("datepicker-year");
yearButton.textContent = yearSelected;
header.appendChild(yearButton);


//create container that holds the header date text
//const headerDateContainer = document.createElement("div");
//headerDateContainer.classList.add("datepicker-header-text");
//header.appendChild(headerDateContainer);





// Create the datepicker body
const body = document.createElement("div");
body.classList.add("datepicker-body");
datepickerContainer.appendChild(body);

// Create the datepicker calendar
const calendar = document.createElement("div");
calendar.classList.add("datepicker-calendar");
body.appendChild(calendar);



//create bodyHeader that contains a button previous, the current month select and year selected concatenated into a string, and a button next
const bodyHeader = document.createElement("div");
bodyHeader.classList.add("datepicker-body-header");
body.prepend(bodyHeader);

const previousButton = document.createElement("button");
previousButton.classList.add("datepicker-previous");
previousButton.textContent = "<";
bodyHeader.appendChild(previousButton);

//create container that holds the header date text
const headerDateContainer = document.createElement("button");
headerDateContainer.classList.add("datepicker-header-text");
headerDateContainer.textContent = `${yearSelected} ${months[Number(monthSelected) - 1]}`;
bodyHeader.appendChild(headerDateContainer);

const nextButton = document.createElement("button");
nextButton.classList.add("datepicker-next");
nextButton.innerHTML = ">";
bodyHeader.appendChild(nextButton);


// Create the datepicker footer
const footer = document.createElement("div");
footer.classList.add("datepicker-footer");
datepickerContainer.appendChild(footer);

// Create the today button
const todayButton = document.createElement("button");
todayButton.classList.add("datepicker-today");
todayButton.innerHTML = "Today";
footer.appendChild(todayButton);

// Open the datepicker when the input field is clicked
input.addEventListener("click", function () {
    datepicker.classList.add("open");
});


// Set the input field value when a date is selected
calendar.addEventListener("click", function (event) {
    if (event.target.classList.contains("datepicker-day")) {
        const date = new Date(event.target.getAttribute("data-date"));
        const formattedDate = date.toLocaleDateString("en-GB", dateFormat);
        input.value = formattedDate;
        dateSelected = formattedDate;

        // Set the calendar header
        setHeader(dateSelected);
        datepicker.classList.remove("open");



        setActiveDate(event);

        
        monthSelected = event.target.getAttribute("data-date").split("-")[1];
        yearSelected = event.target.getAttribute("data-date").split("-")[0];




        //set the month and year selected
    }
});

//function to setActiveDate
function setActiveDate(event) {
    //add active class to selected date
    //   const active = document.getElementsByClassName("active");
    const active = document.querySelector(".active");
    if (active) {
        active.className = active.className.replace(" active", "");
    }
    event.target.className += " active";

}




// Set the calendar to the current month and year
function setCalendar() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();


    // Set the calendar header
    setHeader(date.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }))

    // Clear the calendar
    calendar.innerHTML = "";

    // Create the calendar days
    for (let i = 0; i < firstDay; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        calendar.appendChild(day);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        day.setAttribute("data-date", `${year}-${month + 1}-${i}`);
        day.innerHTML = i;
        calendar.appendChild(day);
    }
}

setCalendar();

//funtion to set the header to the current date
function setHeader(date) {
    headerDateContainer.innerHTML = `${date}`;
}

todayButton.addEventListener("click", function () {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", dateFormat);
    input.value = formattedDate;
    dateSelected = formattedDate;

    setHeader(dateSelected);
    datepicker.classList.remove("open");

    const active = document.querySelector(".active");
    if (active) {
        active.className = active.className.replace(" active", "");
    }

    setCalendar();

    monthDropdown.value = dateSelected.split("/")[1] - 1;
    yearDropdown.value = dateSelected.split("/")[2];
    const year = dateSelected.split("/")[2];
    const month = dateSelected.split("/")[1] % 10;
    const day = dateSelected.split("/")[0];
    const today = document.querySelector(`[data-date="${year}-${month}-${day}"]`);
    today.className += " active";

});


// add dropdown menu to chose the month
const monthDropdown = document.createElement("select");
monthDropdown.classList.add("month-dropdown");
body.appendChild(monthDropdown);

// add dropdown menu to chose the year
const yearDropdown = document.createElement("div");
yearDropdown.classList.add("year-dropdown");

const yearDropdownSelect = document.createElement("select");
yearDropdownSelect.classList.add("year-dropdown-select");
yearDropdown.appendChild(yearDropdownSelect);
body.prepend(yearDropdown);


// Create the close button
// const closeButton = document.createElement("button");
// closeButton.classList.add("datepicker-close");
// closeButton.innerHTML = "&times;";
// header.appendChild(closeButton);


//array of integers from 1 to 12
// const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

for (let i = 0; i < months.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = months[i];
    monthDropdown.appendChild(option);
}

// add years to dropdown menu
for (let i = 2020; i < 2030; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    yearDropdownSelect.appendChild(option);
}

// set the dropdown menu to the current month and year
monthDropdown.value = new Date().getMonth();
yearDropdownSelect.value = new Date().getFullYear();

// set the calendar to the selected month and year
monthDropdown.addEventListener("change", function (evt) {
    const date = new Date();
    const year = yearDropdownSelect.value;
    const month = monthDropdown.value;
    const daysInMonth = new Date(Number(year), Number(month) + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();


    // Set the calendar header
    // setHeader(date.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }))

    // Clear the calendar
    calendar.innerHTML = "";

    // Create the calendar days
    for (let i = 0; i < firstDay; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        calendar.appendChild(day);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        day.setAttribute("data-date", `${year}-${Number(month) + 1}-${i}`);
        day.innerHTML = i;
        calendar.appendChild(day);
    }
});



yearDropdownSelect.addEventListener("change", function () {
    const date = new Date();
    const year = yearDropdownSelect.value;
    const month = monthDropdown.value;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Set the calendar header
    // setHeader(date.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }))

    // Clear the calendar
    calendar.innerHTML = "";

    // Create the calendar days
    for (let i = 0; i < firstDay; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        calendar.appendChild(day);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.classList.add("datepicker-day");
        day.setAttribute("data-date", `${year}-${Number(month) + 1}-${i}`);
        day.innerHTML = i;
        calendar.appendChild(day);
    }
})

//add active class to date that corresponds to the dateSelected
const activeDate = document.querySelector(`[data-date="${dateSelected}"]`);
activeDate.className += " active";




datepicker.addEventListener("click", function (event) {
    if (!event.target.closest(".datepicker-container")) {
        datepicker.classList.remove("open");
    };
});


// Close the datepicker when the close button is clicked
closeButton.addEventListener("click", function () {
    datepicker.classList.remove("open");
});





//build monthView
const monthView = document.createElement("div");
monthView.classList.add("month-view");


const monthViewHeading = setHeader(yearSelected);

//build a 3x4 table grid for the month view
const monthViewGrid = document.createElement("div");
monthViewGrid.classList.add("month-view-grid");

//loop through monthsShort array and add each as element to monthViewGrid
for (let i = 1; i < monthsShort.length; i++) {
    const month = document.createElement("div");
    month.classList.add("month-gridview");
    month.setAttribute("data-month", i);
    month.textContent = monthsShort[i];
    monthViewGrid.appendChild(month);
}



//add monthViewHeading and monthViewGrid to monthView
monthView.appendChild(monthViewHeading);
monthView.appendChild(monthViewGrid);





//build yearView
const yearView = document.createElement("div");
yearView.classList.add("year-view");

//build scrollable year options
const yearBody= document.createElement("div");
yearBody.classList.add("year-body");

//build year options
for (let i = 2020; i < 2030; i++) {
    const year = document.createElement("div");
    year.classList.add("year-option");
    year.setAttribute("data-year", i);
    year.textContent = i;
    yearBody.appendChild(year);
}

//check which year is selected and add active class to it
const activeYear = document.querySelector(`[data-year="${yearSelected}"]`);
if(activeYear) activeYear.className += " active-year";

//add yearBody to yearView
yearView.appendChild(yearBody);



//buiild a function that generate a header component that contains prev and next buttons on the sides and accepts a parameter that is the current date which is in between
function setHeader(date) {
    
    const monthHeader = document.createElement("div");
    // monthHeader.classList.add("datepicker-monthHeader");

    const prevButton = document.createElement("button");
    prevButton.classList.add("prev-button");
    prevButton.innerHTML = "&lt;";
    monthHeader.appendChild(prevButton);

    const dateElement = document.createElement("div");
    dateElement.classList.add("date-element");
    dateElement.textContent = date;
    monthHeader.appendChild(dateElement);

    const nextButton = document.createElement("button");
    nextButton.classList.add("next-button");
    nextButton.innerHTML = "&gt;";
    monthHeader.appendChild(nextButton);

    console.log(monthHeader);

    //header.appendChild(monthHeader);

    return monthHeader;
}