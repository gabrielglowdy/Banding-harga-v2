let res_elem = document.getElementById("res");
let darkButton;
let original_elem;
const MINIMUM_PRODUCT = 2;
let products = [];
let customClassSwal = {
  popup: "bg-gray-100 dark:bg-gray-700",
  title: "text-gray-800 dark:text-gray-100",
  container: "bg-gray-800 dark:bg-opacity-75 bg-opacity-25",
  htmlContainer: "text-gray-800 dark:text-gray-100",
  confirmButton:
    "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 w-1/2 rounded-lg focus:ring-0 border-none focus:outline-none p-2 font-bold",
};

const light_icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`;
const dark_icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
</svg>`;


let body = document.querySelector('body');

if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
  body.classList.add('dark');
}

const swalCustom = Swal.mixin({
  customClass: customClassSwal,
  buttonsStyling: false,
});

if (res_elem && res_elem.childNodes.length > 0) {
  var elem = res_elem.firstElementChild;

  original_elem = elem.cloneNode(true);

  elem.remove();

  addProduct(MINIMUM_PRODUCT);
}

function addProduct(new_count = 1) {
  for (let index = 0; index < new_count; index++) {
    let new_temp = original_elem.cloneNode(true);

    let title = new_temp.querySelector(".product_name");
    title.value = "Produk " + (products.length + 1);

    let harga = new_temp.querySelector("#harga-x");
    harga.id = "harga-" + products.length;

    let jumlah = new_temp.querySelector("#jumlah-x");
    jumlah.id = "jumlah-" + products.length;

    let errorText = new_temp.querySelector("#error-x");
    errorText.id = "error-" + products.length;

    let deleteButton = new_temp.querySelector("#delete-x");
    deleteButton.id = "delete-" + products.length;

    let id = products.length;
    deleteButton.setAttribute("id-product", id);

    deleteButton.addEventListener("click", function () {
      deleteProduct(deleteButton);
    });
    products.push(new_temp);
  }

  productsSetter(false);
}

function deleteProduct(id_elem) {
  if (!id_elem.hasAttribute("id-product")) {
    return false;
  }

  let id = parseInt(id_elem.getAttribute("id-product"));
  if (id > products.length - 1 || products.length <= MINIMUM_PRODUCT) {
    swalCustom.fire({
      title: "Minimal " + MINIMUM_PRODUCT + " Produk",
      text: `Untuk bisa dibandingin harus ada setidaknya ${MINIMUM_PRODUCT} produk untuk dibandingin :)`,
      icon: "error",
      customClass: customClassSwal,
    });
    return false;
  }

  products.splice(parseInt(id), 1);
  productsSetter();

  return true;
}

function productsSetter(withClear = true) {
  res_elem.innerHTML = "";
  products.forEach((element, index) => {
    let title = element.querySelector(".product_name");
    if (title.value.includes("Produk ") || title.value == "") {
      title.value = "Produk " + (index + 1);
    }

    let harga = element.querySelector(".harga");
    harga.id = "harga-" + index;

    let jumlah = element.querySelector(".jumlah");
    jumlah.id = "jumlah-" + index;

    let errorText = element.querySelector(".error");
    errorText.id = "error-" + index;

    let deleteButton = element.querySelector(".delete");
    deleteButton.id = "delete-" + index;
    deleteButton.setAttribute("id-product", index);

    res_elem.appendChild(element);

    if (withClear) {
      clearError(index);
    }
  });
}

function calculate_product() {
  let valid = true;

  if (products.length < MINIMUM_PRODUCT) {
    errorX("Minimum Product to compare : " + MINIMUM_PRODUCT);
    valid = false;
    return false;
  }

  let data = [];
  let min_product_index = 0;
  let min_product_value;

  products.forEach((element, index) => {
    let product_name = element.querySelector(".product_name");
    if (product_name.value == "") {
      errorInput(index, "Nama Produk wajib diisi");
      valid = false;
      return false;
    }

    let harga = element.querySelector("#harga-" + index);
    if (harga.value < 1) {
      errorInput(index, `Harga ${product_name.value} harus lebih besar dari 0`);
      valid = false;
      return false;
    }

    let jumlah = element.querySelector("#jumlah-" + index);
    if (jumlah.value <= 0 || jumlah.value == "") {
      errorInput(
        index,
        `Jumlah ${product_name.value} harus lebih besar dari 0`
      );
      valid = false;
      return false;
    }

    clearError(index);

    let number = harga.value / jumlah.value;
    if (!min_product_value || number < min_product_value) {
      min_product_index = index;
      min_product_value = number;
    }
  });

  if (!valid) {
    return;
  }

  products.forEach((element, index) => {
    let product_name = element.querySelector(".product_name");
    let harga = element.querySelector("#harga-" + index);
    let jumlah = element.querySelector("#jumlah-" + index);

    let number = harga.value / jumlah.value;

    if (number == min_product_value) {
      data.push({
        product_name: product_name.value,
        number: number,
      });
    }
  });

  if (data.length == products.length) {
    swalCustom.fire({
      title: "Semua Produk sama murahnya",
      text: "Kamu bisa produk apapun yang kamu suka karena sama aja :)",
      icon: "success",
      customClass: customClassSwal,
    });
    return;
  }

  let str = "";
  data.forEach((element, index) => {
    str += element.product_name;
    if (index + 1 < data.length && data.length > 2) {
      str += ", ";
    }

    if (index + 1 == data.length - 1) {
      str += " dan ";
    }
  });
  let res_str = str;
  str += " lebih murah";

  swalCustom.fire({
    title: res_str,
    text: str,
    icon: "success",
    customClass: customClassSwal,
  });
}

function errorInput(index, message) {
  let error_elem = document.querySelector("#error-" + index);
  if (error_elem) {
    error_elem.classList.remove("hidden");
    error_elem.innerText = message;
  }
}

function clearError(index) {
  let error_elem = document.querySelector("#error-" + index);
  if (error_elem) {
    error_elem.classList.add("hidden");
    error_elem.innerText = "";
  }
}

function errorX(message) {
  let error_general = document.getElementById("error-general");
  if (error_general) {
    error_general.classList.remove("hidden");
    error_general.querySelector("p").innerText = message;
    setTimeout(() => {
      error_general.classList.add("hidden");
    }, 3000);
  }
}

function toggleDarkMode() {
  let body = document.querySelector("body");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
  } else {
    body.classList.add("dark");
  }
}

function refreshButton() {
  let body = document.querySelector("body");
  if (body.classList.contains("dark")) {
    darkButton.innerHTML =
      light_icon +
      ` <span class="block md:inline text-xs md:text-base mt-1 md:mt-0">Light Mode</span>`;
  } else {
    darkButton.innerHTML =
      dark_icon +
      ` <span class="block md:inline text-xs md:text-base mt-1 md:mt-0">Dark Mode</span>`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let add_product = document.getElementById("add-product");
  let calculate_button = document.getElementById("calculate");
  let calculate_button_mobile = document.querySelector("#count-mobile");

  add_product.addEventListener("click", function () {
    addProduct();
  });

  calculate_button.addEventListener("click", function () {
    calculate_product();
  });

  calculate_button_mobile.addEventListener("click", function () {
    calculate_product();
  });

  darkButton = document.getElementById("toggle-dark-mode");
  refreshButton();
  if (darkButton) {
    darkButton.addEventListener("click", function () {
      toggleDarkMode();
      refreshButton();
    });
  }
});
