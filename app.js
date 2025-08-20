const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Assume `countryList` is already defined in `codes.js`
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selection
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Update flag on change
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Update the flag icon
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Get country code from countryList
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Update and display exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    // amount.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const url = `${BASE_URL}/${from}.json`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    let rate = data[from][to];
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Something went wrong. Please try again later.";
  }
};

// Trigger conversion on button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Run on initial load
window.addEventListener("load", () => {
  updateExchangeRate();
});
