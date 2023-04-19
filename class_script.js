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
    this.maxYear = this.maxDate.split("-")[0];
    this.minYear = this.minDate.split("-")[0];
    this.minMonth = this.minDate.split("-")[1];
    this.maxMonth = this.maxDate.split("-")[1];
    this.datepicker = document.createElement("div");
    this.datepicker.classList.add("datepicker");
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
    this.headerDateSelected = document.createElement("div");
    this.headerDateSelected.classList.add("datepicker-date-text");
    this.body = document.createElement("div");
    this.body.classList.add("datepicker-body");
    this.calendar = document.createElement("div");
    this.calendar.classList.add("datepicker-calendar");
    this.yearButton = document.createElement("button");
    this.yearButton.classList.add("datepicker-year");
    this.yearButton.textContent = this.yearSelected;
    this.setAriaLabel(this.yearButton, this.yearSelected);
    this.days = document.createElement("div");
    this.days.classList.add("datepicker-days");
    //build function to render days of week
    this.body.appendChild(this.days);
    this.bodyHeader = document.createElement("div");
    this.bodyHeader.classList.add("datepicker-body-header");
    this.previousButton = document.createElement("button");
    this.previousButton.classList.add("datepicker-previous");
    this.previousButton.textContent = "<";
    this.setAriaLabel(this.previousButton, "navigate previous");
    this.nextButton = document.createElement("button");
    this.nextButton.classList.add("datepicker-next");
    this.nextButton.textContent = ">";
    this.setAriaLabel(this.nextButton, "navigate next");
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
    this.setAriaLabel(this.okButton, this.okButton.textContent);
    this.cancelButton = document.createElement("button");
    this.cancelButton.classList.add("datepicker-footer__button");
    this.cancelButton.textContent = this.options.cancelButtonText || "Cancel";
    this.setAriaLabel(this.cancelButton, this.cancelButton.textContent);
    //month elements
    this.monthView = document.createElement("div");
    this.monthView.classList.add("month-view");
    this.monthViewGrid = document.createElement("div");
    this.monthViewGrid.classList.add("month-view-grid");
    //year elements
    this.yearView = document.createElement("div");
    this.yearView.classList.add("year-view");
    this.yearBody = document.createElement("div");
    this.yearBody.classList.add("year-body");
    //add elements to the DOM
    document.body.appendChild(this.datepicker);
    this.datepicker.appendChild(this.datepickerContainer);
    this.datepickerContainer.appendChild(this.header);
    this.header.appendChild(this.yearButton);
    this.header.appendChild(this.headerDateSelected);
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
    this.days.innerHTML = "";
    for (let i = 0; i < daysShort.length; i++) {
      const day = document.createElement("div");
      day.classList.add("datepicker-day");
      day.textContent = daysShort[i];
      this.days.appendChild(day);
    }
  }

  setAriaLabel(element, text) {
    element.setAttribute("aria-label", text);
  }

  setAriaDisabled(element) {
    element.setAttribute("aria-disabled", true);
  }

  renderCalendar(month = this.monthToday, year = this.yearToday) {
    this.body.innerHTML = "";
    this.renderNavigation("day");
    this.body.appendChild(this.days);

    const daysInMonth = new Date(year, month, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();

    this.calendar.innerHTML = "";

    //render days of week
    this.renderDaysOfWeek();

    //render blank days
    for (let i = 0; i < firstDay; i++) {
      const day = document.createElement("div");
      day.classList.add("datepicker-day");
      this.calendar.appendChild(day);
      this.setAriaLabel(day, "non date");
    }

    //render days in month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("button");
      day.classList.add("datepicker-day");
      let currentDate = `${this.yearSelected}-${
        Number(this.monthSelected) + 1
      }-${i}`;
      day.setAttribute("data-date", currentDate);
      if (this.checkIfDayDisable(currentDate)) {
        day.classList.add("disabled");
        day.setAttribute("disabled", true);

        this.setAriaDisabled(day);
      }
      day.textContent = i;
      this.calendar.appendChild(day);
      this.setActiveStates(day, this.dateSelected);

      this.body.append(this.calendar);

      this.headerDateContainer.classList.remove("month-render");

      this.setAriaLabel(day, currentDate);
    }
  }

  setActiveStates(element, dateSelected) {
    const elementDate = element.getAttribute("data-date");
    if (elementDate == dateSelected && elementDate == this.today) {
      element.classList += " today active";
    } else if (elementDate == dateSelected) {
      element.classList += " active";
    } else if (elementDate == this.today) {
      element.classList += " today";
    }
  }

  renderNavigation(view) {
    // this.bodyHeader.innerHTML = "";
    if (view == "month") {
      this.headerDateContainer.textContent = this.yearSelected;
      // this.body.appendChild(this.bodyHeader);
    } else if (view == "day") {
      this.headerDateContainer.textContent =
        months[this.monthSelected] + " " + this.yearSelected;
      // this.body.appendChild(this.bodyHeader);
    }
    this.setAriaLabel(
      this.headerDateContainer,
      this.headerDateContainer.textContent
    );

    this.body.prepend(this.bodyHeader);
  }

  checkIfMonthDisabled(month) {
    if (this.yearSelected == this.maxYear) {
      if (month + 1 > this.maxMonth) {
        return true;
      } else return false;
    } else if (this.yearSelected == this.minYear) {
      if (month + 1 <= Number(this.minMonth - 1)) {
        return true;
      }
      return false;
    }
  }
  checkIfDayDisable(date) {
    const maxDate = new Date(this.maxDate).setDate(
      new Date(this.maxDate).getDate()
    );
    //adding one day less to minDate
    const minDate = new Date(this.minDate).setDate(
      new Date(this.minDate).getDate() - 1
    );

    if (minDate > new Date(date)) {
      return true;
    } else if (maxDate < new Date(date)) {
      return true;
    }
    return false;
  }

  renderMonthView(e) {
    e.stopPropagation();
    this.body.innerHTML = "";

    this.monthViewGrid.innerHTML = "";

    this.renderNavigation("month");

    for (let i = 0; i < monthsShort.length; i++) {
      const month = document.createElement("button");
      month.classList.add("month-gridview");
      if (this.checkIfMonthDisabled(i)) {
        month.classList.add("disabled");
        month.setAttribute("disabled", true);
        this.setAriaDisabled(month);
      }
      month.setAttribute("data-month", i);
      month.textContent = monthsShort[i];
      this.monthViewGrid.appendChild(month);
      this.setAriaLabel(month, `month = ${i}`);
    }
    this.body.appendChild(this.monthViewGrid);

    this.headerDateContainer.classList += " month-render";

    this.setActiveMonth();
  }

  updateYearButton() {
    this.yearButton.textContent = this.yearSelected;
    this.setAriaLabel(this.yearButton, this.yearSelected);
  }

  setActiveYear(e) {
    //this.monthSelected = "";
    this.yearSelected = e.target.getAttribute("data-year");

    this.updateYearButton();

    let notYearOption = !e.target.getAttribute("data-year");

    if (!notYearOption) {
      const years = [...document.querySelectorAll(".year-option")];
      years.forEach((year) => {
        year.classList.remove("active-year");
        const yearTarget = year.getAttribute("data-year");
        if (yearTarget == this.yearSelected) {
          year.classList.add("active-year");
        }
      });
    }

    this.renderMonthView(e);
  }

  renderYearView(e) {
    e.stopPropagation();
    this.body.innerHTML = "";
    this.yearBody.innerHTML = "";

    for (let i = Number(this.minYear); i <= Number(this.maxYear); i++) {
      const year = document.createElement("button");
      year.classList.add("year-option");
      year.setAttribute("data-year", i);
      year.setAttribute("aria-label", i);
      year.textContent = i;
      this.yearBody.appendChild(year);

      if (i == Number(this.yearSelected)) {
        year.classList.add("active-year");
      }

      this.setAriaLabel(year, `year = ${i}`);
    }

    this.body.appendChild(this.yearBody);

    this.yearBody.querySelector(".active-year").scrollIntoView({
      block: "center",
      inline: "center",
    });
  }

  resetActiveDays() {
    const days = document.querySelectorAll(".datepicker-day");
    days.forEach((day) => {
      day.classList.remove("active");
      this.setActiveStates(day, this.dateSelected);
    });
  }

  selectDay(e) {
    e.stopPropagation();
    const elementDate = e.target.getAttribute("data-date");
    if (elementDate) {
      const date = new Date(elementDate);
      const formattedDate = date.toLocaleDateString("en-GB", this.dateFormat);

      this.input.value = formattedDate;
      this.dateSelected = elementDate;

      this.setActiveStates(e.target, this.dateSelected);

      this.monthSelected = Number(elementDate.split("-")[1]) - 1;

      this.yearSelected = elementDate.split("-")[0];

      const hebrewDayOfWeek = daysShort[date.getDay()];
      const longDateText = `יום ${hebrewDayOfWeek}, ${date.getDate()} ב${
        monthsShort[Number(this.monthSelected)]
      }`;
      this.headerDateSelected.textContent = longDateText;

      this.resetActiveDays();
    }
  }

  isMonthViewRendered() {
    if (this.headerDateContainer.classList.contains("month-render"))
      return true;
    return false;
  }

  navigateNext(e) {
    //first check what kind of navigation we are in
    if (this.isMonthViewRendered()) {
      if (this.yearSelected <= this.maxYear) {
        this.yearSelected++;
        this.updateYearButton();
        this.renderMonthView(e);
      } else {
        return;
      }
    } else {
      //check if maxDate is reached
      if (
        this.yearSelected == this.maxYear &&
        this.monthSelected == Number(this.maxMonth) - 1
      ) {
        console.log("reach maximum date");
        return;
      }
      this.monthSelected++;
      this.updateYearButton();
      if (this.monthSelected > 11) {
        this.monthSelected = 0;
        this.yearSelected++;
        this.updateYearButton();
      }
      this.renderNavigation("day");
      this.renderCalendar(Number(this.monthSelected), this.yearSelected);
    }
  }

  navigatePrevious(e) {
    //first check what kind of navigation we are in
    if (this.isMonthViewRendered()) {
      if (this.yearSelected > this.minYear) {
        this.yearSelected--;
        this.updateYearButton();
        this.renderMonthView(e);
      } else {
        return;
      }
    } else {
      //check if minDate is reached
      if (
        this.yearSelected == this.minYear &&
        this.monthSelected == Number(this.minMonth) - 1
      ) {
        console.log("reach minimum date");
        return;
      }

      this.monthSelected--;
      if (this.monthSelected < 0) {
        this.monthSelected = 11;
        this.yearSelected--;
        this.updateYearButton();
      }
      this.renderNavigation("day");
      this.renderCalendar(Number(this.monthSelected), this.yearSelected);
    }
  }

  setActiveMonth() {
    const dateSelectedYear = this.dateSelected.split("-")[0];
    const dateSelectedMonth = this.dateSelected.split("-")[1];

    const gridArr = [...document.querySelectorAll(".month-gridview")];
    gridArr.forEach((element) => {
      element.classList.remove("active-month");
      if (
        this.monthSelected == element.getAttribute("data-month") &&
        dateSelectedYear == this.yearSelected
      ) {
        element.classList.add("active-month");
      }
    });
  }

  selectMonth(e) {
    e.stopPropagation();
    if (e.target.getAttribute("data-month")) {
      this.monthSelected = e.target.getAttribute("data-month");

      this.setActiveMonth();
      //render calendar with new month
      this.body.innerHTML = "";
      this.renderCalendar(this.monthSelected, this.yearSelected);
    }
  }

  //add event listeners to input and datepicker
  addEventListeners() {
    this.input.addEventListener("click", () => this.open());
    this.datepicker.addEventListener("click", (e) =>
      this.closeOnOverlayClick(e)
    );
    this.headerDateContainer.addEventListener("click", (e) => {
      if (this.headerDateContainer.classList.contains("month-render")) {
        this.renderYearView(e);
      } else {
        this.renderMonthView(e);
      }
    });

    //add event listeners to calendar
    this.calendar.addEventListener("click", (e) => this.selectDay(e));

    //navigate between calenar months
    this.nextButton.addEventListener("click", (e) => this.navigateNext(e));
    this.previousButton.addEventListener("click", (e) =>
      this.navigatePrevious(e)
    );
    this.monthViewGrid.addEventListener("click", (e) => this.selectMonth(e));
    this.yearBody.addEventListener("click", (e) => this.setActiveYear(e));
    this.okButton.addEventListener("click", () => this.close());
    this.cancelButton.addEventListener("click", () => this.close());
    this.yearButton.addEventListener("click", (e) => this.renderYearView(e));
  }
}

const datepicker = new Datepicker("#datepicker-input", {
  minDate: "2024-12-05",
  maxDate: "2033-11-21",
  okButtonText: "בחר",
  cancelButtonText: "בטל",
});
