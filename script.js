import { months, monthsShort, daysShort } from "./constants.js";

let dateSelected = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;
let monthToday = `${new Date().getMonth()}`;
let yearToday = `${new Date().getFullYear()}`;
let currentDate = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

//initialize to today
let monthSelected = monthToday;
let yearSelected = yearToday;

// Get the input field and set the date format
const input = document.getElementById("datepicker-input");
const dateFormat = { year: "numeric", month: "numeric", day: "numeric" };

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

// Create the datepicker body
const body = document.createElement("div");
body.classList.add("datepicker-body");
datepickerContainer.appendChild(body);

setDaysOfWeek();

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
headerDateContainer.textContent = `${
  months[Number(monthSelected)]
} ${yearSelected}`;
bodyHeader.appendChild(headerDateContainer);

const nextButton = document.createElement("button");
nextButton.classList.add("datepicker-next");
nextButton.innerHTML = ">";
bodyHeader.appendChild(nextButton);

// Create the datepicker footer
const footer = document.createElement("div");
footer.classList.add("datepicker-footer");
datepickerContainer.appendChild(footer);

// Create the datepicker date container
const dateContainer = document.createElement("div");
dateContainer.classList.add("datepicker-date-container");

//create two buttons in the footer on is "Ok" and the other is "Cancel"
const okButton = document.createElement("button");
okButton.classList.add("datepicker-footer__button");
okButton.textContent = "בחר";
footer.appendChild(okButton);

const cancelButton = document.createElement("button");
cancelButton.classList.add("datepicker-footer__button");
cancelButton.textContent = "ביטול";
footer.appendChild(cancelButton);

//function to setActiveDate
function setActiveDate(event) {
  //add active class to selected date
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

function setActiveStates(element, dateSelected) {
  //add today class to today's date
  const elementDate = element.getAttribute("data-date");

  if (elementDate === dateSelected && elementDate === currentDate) {
    element.className += " today active";
  } else if (elementDate === dateSelected) {
    element.className += " active";
  } else if (elementDate === currentDate) {
    element.className += " today";
  }
}

//add active class to date that corresponds to the dateSelected
const activeDate = document.querySelector(`[data-date="${dateSelected}"]`);
activeDate.className += " today active";

//build monthView
const monthView = document.createElement("div");
monthView.classList.add("month-view");

//build a 3x4 table grid for the month view
const monthViewGrid = document.createElement("div");
monthViewGrid.classList.add("month-view-grid");
monthView.appendChild(monthViewGrid);

//build yearView
const yearView = document.createElement("div");
yearView.classList.add("year-view");

//build scrollable year options
const yearBody = document.createElement("div");
yearBody.classList.add("year-body");

//check which year is selected and add active class to it
const activeYear = document.querySelector(`[data-year="${yearSelected}"]`);
if (activeYear) activeYear.className += " active-year";

//add yearBody to yearView
yearView.appendChild(yearBody);

function setHeaderDateContainerToMonthView(text) {
  !text
    ? (headerDateContainer.textContent = yearSelected)
    : (headerDateContainer.textContent = text);

  body.prepend(bodyHeader);

  headerDateContainer.addEventListener("click", (evt) => {
    evt.stopPropagation();
    generateYearView();
  });
}

function generateYearView() {
  body.innerHTML = "";
  //generate years from 10 years ago the the current year
  for (let i = Number(yearToday); i >= Number(yearToday) - 30; i--) {
    const year = document.createElement("div");
    year.classList.add("year-option");
    year.setAttribute("data-year", i);
    year.textContent = i;
    yearBody.appendChild(year);
  }

  body.appendChild(yearBody);

  if (body.querySelector(".active-year")) {
    body.querySelector(".active-year").classList.remove("active-year");
  }
  //check which year is selected and add active class to it
  const activeYear = document.querySelector(`[data-year="${yearSelected}"]`);
  if (activeYear) activeYear.className += " active-year";
}

function generateGridWithMonths() {
  //clear the monthViewGrid
  monthViewGrid.innerHTML = "";

  for (let i = 0; i < monthsShort.length; i++) {
    const month = document.createElement("div");
    month.classList.add("month-gridview");
    month.setAttribute("data-month", i);
    month.textContent = monthsShort[i];

    monthViewGrid.appendChild(month);
  }

  body.appendChild(monthViewGrid);

  //check which month is selected and add active class to it
  const activeMonth = document.querySelector(
    `[data-month="${Number(monthSelected)}"]`
  );
  if (activeMonth) activeMonth.className += " active-month";
}

function setDaysOfWeek() {
  const days = document.createElement("div");
  days.classList.add("datepicker-days");

  daysShort.forEach((day) => {
    const dayName = document.createElement("div");
    dayName.classList.add("datepicker-day-name");
    dayName.innerHTML = day;
    days.appendChild(dayName);
  });

  body.appendChild(days);
}

function changeCalendarMonth(evt) {
  const year = yearSelected;
  const month = monthSelected;
  const daysInMonth = new Date(Number(year), Number(month) + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Clear the calendar
  //monthViewGrid.style.cssText = "display: none";
  body.innerHTML = "";
  setHeaderDateContainerToMonthView(`${months[monthSelected]} ${yearSelected}`);

  setDaysOfWeek();

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
    setActiveStates(day, dateSelected);
  }

  body.appendChild(calendar);
}

function arrowButtonHandler(direction, type) {
  yearSelected = Number(yearSelected);
  if (type === "month") {
    if (direction === "next") {
      if (
        Number(yearToday) === yearSelected &&
        monthSelected === Number(monthToday)
      )
        return;
      if (monthSelected < 11) {
        monthSelected++;
      } else {
        monthSelected = 0;
        yearSelected++;
      }
    } else if (direction === "prev") {
      if (monthSelected > 0) {
        monthSelected--;
      } else {
        monthSelected = 11;
        yearSelected--;
      }
    }
    changeCalendarMonth();
  } else if (type === "year") {
    if (direction === "next") {
      if (Number(yearToday) === yearSelected) return;
      yearSelected++;
      //generateYearView();
    } else if (direction === "prev") {
      yearSelected--;
      //generateYearView();
    }
    setHeaderDateContainerToMonthView();
    //removeActiveStateFromMonths();
  }
}

//Event listeners

// Open the datepicker when the input field is clicked
input.addEventListener("click", function () {
  datepicker.classList.add("open");
});

yearBody.addEventListener("click", (evt) => {
  evt.stopPropagation();
  if (evt.target.classList.contains("year-option")) {
    yearSelected = evt.target.getAttribute("data-year");
    //remove active class from all years
    const allYears = document.querySelectorAll(".year-option");
    allYears.forEach((year) => {
      year.classList.remove("active-year");
    });
    //add active class to the year that was clicked
    evt.target.className += " active-year";

    //change datepicker-year to the year that was clicked
    yearButton.textContent = yearSelected;
  }

  //return to month view
  body.innerHTML = "";
  setHeaderDateContainerToMonthView();
  generateGridWithMonths();
});

monthViewGrid.addEventListener("click", (evt) => {
  evt.stopPropagation();
  if (evt.target.classList.contains("month-gridview")) {
    monthSelected = evt.target.getAttribute("data-month");
    //remove active class from all months
    const allMonths = document.querySelectorAll(".month-gridview");
    allMonths.forEach((month) => {
      month.classList.remove("active-month");
    });
    //add active class to the month that was clicked
    evt.target.className += " active-month";

    //return to date view
    //body.innerHTML = "";
    changeCalendarMonth();
  }
});

// Set the input field value when a date is selected
calendar.addEventListener("click", function (event) {
  event.stopPropagation();

  const elementDate = event.target.getAttribute("data-date");
  if (event.target.classList.contains("datepicker-day")) {
    //first remove dateContainer
    //header.removeChild(dateContainer);

    const date = new Date(elementDate);
    const formattedDate = date.toLocaleDateString("en-GB", dateFormat);
    input.value = formattedDate;
    dateSelected = elementDate;

    //close the calendar
    //datepicker.classList.remove("open");

    setActiveDate(event);

    monthSelected = elementDate.split("-")[1];
    yearSelected = elementDate.split("-")[0];

    //set the month and year selected
    dateContainer.textContent = "";

    const hebrewDayOfWeek = daysShort[date.getDay()];
    const longDateText = `יום ${hebrewDayOfWeek}, ${date.getDate()} ב${
      monthsShort[Number(monthSelected) - 1]
    }`;
    dateContainer.textContent = longDateText;

    header.appendChild(dateContainer);
  }
});

datepicker.addEventListener("click", function (event) {
  if (!event.target.closest(".datepicker-container")) {
    datepicker.classList.remove("open");
  }
});

headerDateContainer.addEventListener("click", (evt) => {
  evt.stopPropagation();
  body.innerHTML = "";
  setHeaderDateContainerToMonthView();
  generateGridWithMonths();
});

nextButton.addEventListener("click", (evt) => {
  const isMonthView =
    document.querySelector(".datepicker-header-text").textContent.indexOf(" ") >
    0;
  if (isMonthView) {
    arrowButtonHandler("next", "month");
  } else {
    arrowButtonHandler("next", "year");
  }
});

previousButton.addEventListener("click", (evt) => {
  const isMonthView =
    document.querySelector(".datepicker-header-text").textContent.indexOf(" ") >
    0;
  if (isMonthView) {
    arrowButtonHandler("prev", "month");
  } else {
    arrowButtonHandler("prev", "year");
  }
});

// ok button
okButton.addEventListener("click", (evt) => {
  evt.stopPropagation();
  datepicker.classList.remove("open");
});

// cancel button
cancelButton.addEventListener("click", (evt) => {
  evt.stopPropagation();
  datepicker.classList.remove("open");
});

//on yearButton click, show year view
yearButton.addEventListener("click", (evt) => {
  evt.stopPropagation();
  body.innerHTML = "";
  generateYearView();
});
