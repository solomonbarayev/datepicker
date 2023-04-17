import { months, monthsShort, daysShort } from "./constants.js";

//convert all code from script.js to a class called Datepicker
class Datepicker {
  constructor(inputSelector, options) {
    this.options = options || {};
    this.input = document.querySelector(inputSelector);
    this.today = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
    this.maxDate = options.maxDate || this.getDefaultMaxDate();
    this.minDate = options.minDate || this.getDefaultMinDate();
    this.datepicker = document.createElement("div");
    this.datepicker.classList.add("datepicker");
    console.log(this.datepicker);
    this.dateSelected = this.today;
    this.monthToday = new Date().getMonth();
    this.yearToday = new Date().getFullYear();
    this.monthSelected = this.monthToday;
    this.yearSelected = this.yearToday;
    this.dateFormat = { year: "numeric", month: "numeric", day: "numeric" };
    this.datepickerContainer = document.createElement("div");
    this.datepickerContainer.classList.add("datepicker-container");
    this.header = document.createElement("div");
    this.header.classList.add("datepicker-header");
    this.headerDateContainer = document.createElement("div");
    this.headerDateContainer.classList.add("datepicker-date-text");
    this.body = document.createElement("div");
    this.body.classList.add("datepicker-body");
    this.calendar = document.createElement("div");
    this.calendar.classList.add("datepicker-calendar");
    this.yearButton = document.createElement("button");
    this.yearButton.classList.add("datepicker-year");
    this.yearButton.textContent = this.yearSelected;
    this.days = document.createElement("div");
    this.days.classList.add("datepicker-days");
    //build function to render days of week
    this.body.appendChild(this.days);
    this.bodyHeader = document.createElement("div");
    this.bodyHeader.classList.add("datepicker-body-header");
    this.previousButton = document.createElement("button");
    this.previousButton.classList.add("datepicker-previous");
    this.previousButton.textContent = "<";
    this.nextButton = document.createElement("button");
    this.nextButton.classList.add("datepicker-next");
    this.nextButton.textContent = ">";
    this.headerDateContainer = document.createElement("button");
    this.headerDateContainer.classList.add("datepicker-header-text");
    this.headerDateContainer.textContent = `${
      months[Number(this.monthSelected)]
    } ${this.yearSelected}`;
    this.footer = document.createElement("div");
    this.footer.classList.add("datepicker-footer");
    this.okButton = document.createElement("button");
    this.okButton.classList.add("datepicker-footer__button");
    this.okButton.textContent = this.options.okButtonText || "OK";
    this.cancelButton = document.createElement("button");
    this.cancelButton.classList.add("datepicker-footer__button");
    this.cancelButton.textContent = this.options.cancelButtonText || "Cancel";

    //month elements
    this.monthView = document.createElement("div");
    this.monthView.classList.add("month-view");
    this.monthViewGrid = document.createElement("div");
    this.monthViewGrid.classList.add("month-view-grid");

    //add elements to the DOM
    document.body.appendChild(this.datepicker);
    this.datepicker.appendChild(this.datepickerContainer);
    this.datepickerContainer.appendChild(this.header);
    this.header.appendChild(this.yearButton);
    this.header.appendChild(this.headerDateContainer);
    this.datepickerContainer.appendChild(this.body);
    this.body.appendChild(this.calendar);
    this.body.prepend(this.bodyHeader);
    this.bodyHeader.appendChild(this.previousButton);
    this.bodyHeader.appendChild(this.headerDateContainer);
    this.bodyHeader.appendChild(this.nextButton);
    this.footer.appendChild(this.okButton);
    this.footer.appendChild(this.cancelButton);
    this.datepickerContainer.appendChild(this.footer);

    this.monthView.appendChild(this.monthViewGrid);

    //render initial calendar
    this.renderCalendar();
    //add event listeners
    this.addEventListeners();
  }

  open() {
    this.datepicker.classList.add("open");
  }

  close() {
    this.datepicker.classList.remove("open");
  }

  closeOnOverlayClick(e) {
    if (!e.target.closest(".datepicker-container")) {
      this.close();
    }
  }

  getDefaultMaxDate() {
    //defaults to 10 years from now in yyyy-mm-dd format
    const today = new Date();
    const year = today.getFullYear() + 10;
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`;
  }

  getDefaultMinDate() {
    //defaults to 10 years ago
    const today = new Date();
    const year = today.getFullYear() - 10;
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`;
  }

  renderDaysOfWeek() {
    for (let i = 0; i < daysShort.length; i++) {
      const day = document.createElement("div");
      day.classList.add("datepicker-day");
      day.textContent = daysShort[i];
      this.days.appendChild(day);
    }
  }

  renderCalendar() {
    const daysInMonth = new Date(
      this.yearToday,
      this.monthToday + 1,
      0
    ).getDate();
    const firstDay = new Date(this.yearToday, this.monthToday, 1).getDay();

    this.calendar.innerHTML = "";

    //render days of week
    this.renderDaysOfWeek();

    //render blank days
    for (let i = 0; i < firstDay; i++) {
      const day = document.createElement("div");
      day.classList.add("datepicker-day");
      this.calendar.appendChild(day);
    }

    //render days in month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.classList.add("datepicker-day");
      day.setAttribute(
        "data-date",
        `${this.yearToday}-${this.monthToday + 1}-${i}`
      );
      day.textContent = i;
      this.calendar.appendChild(day);
    }

    //set active date
    this.setActiveDate();
  }

  setActiveDate() {
    const activeDate = document.querySelector(
      `[data-date="${this.dateSelected}"]`
    );
    if (activeDate) {
      activeDate.classList += " today active";
    }
  }

  setActiveMonth() {
    const activeMonth = document.querySelector(
      `[data-month="${this.monthSelected}"]`
    );
    if (activeMonth) {
      activeMonth.classList += " active-month";
    }
  }

  renderNavigation(view) {
    if (view == "month") {
      this.headerDateContainer.textContent = this.yearSelected;
      this.body.appendChild(this.bodyHeader);
    } else if (view == "day") {
      this.headerDateContainer.textContent =
        this.yearSelected + " " + months[this.monthSelected];
      this.body.appendChild(this.bodyHeader);
    }
  }

  renderMonthView(e) {
    e.stopPropagation();
    this.body.innerHTML = "";
    this.monthViewGrid.innerHTML = "";

    this.renderNavigation("month");

    for (let i = 0; i < monthsShort.length; i++) {
      const month = document.createElement("div");
      month.classList.add("month-gridview");
      month.setAttribute("data-month", i);
      month.textContent = monthsShort[i];
      this.monthViewGrid.appendChild(month);
    }
    this.body.appendChild(this.monthViewGrid);

    this.setActiveMonth();
  }

  //add event listeners to input and datepicker
  addEventListeners() {
    this.input.addEventListener("click", () => this.open());
    this.datepicker.addEventListener("click", (e) =>
      this.closeOnOverlayClick(e)
    );
    this.headerDateContainer.addEventListener("click", (e) =>
      this.renderMonthView(e)
    );
  }
}

const datepicker = new Datepicker("#datepicker-input", {
  maxDate: "2033-12-31",
  minDate: "2010-01-01",
  okButtonText: "Select",
  cancelButtonText: "Cancel",
});
