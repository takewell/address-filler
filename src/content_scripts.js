const ZOZO_ADDRESSFORM_PATH =
  "https://zozo.jp/_member/deliveryaddress/add.html?c=New";
const AMAZON_ADDRESSFORM_PATH =
  "https://www.amazon.co.jp/a/addresses/add?ref=ya_address_book_add_button";

(() => {
  chrome.runtime.onMessage.addListener((state, sender, sendResponse) => {
    if (location.href === ZOZO_ADDRESSFORM_PATH) {
      autofillZOZO(state);
    } else if (location.href === AMAZON_ADDRESSFORM_PATH) {
      autofillAMAZON(state);
    }

    return true;
  });
})();

// ハードコードしすぎ...
function autofillZOZO(state) {
  const { name, address, phoneNumber } = state;
  const nameDom = document.querySelector(".nameFrm > input");
  console.log("nameDom", nameDom);
  nameDom.value = name;
  const re = /〒(\d{3})-(\d{4}) (.*)/;
  address.replace(re);
  const zipcode = RegExp.$1 + RegExp.$2;
  const zipdom = document.querySelector(".adress");
  zipdom.value = zipcode;
  const phones = phoneNumber.split("-");
  const phoneNumDoms = document.querySelectorAll(".phonFrm > input");
  for (let d = 0; d < phoneNumDoms.length; d++) {
    phoneNumDoms[d].value = phones[d];
  }
  setTimeout(() => {
    const addressButton = document.querySelector(".btnGray");
    addressButton.click();
  }, 1000 * 0.5);
  // setTimeout(() => {
  //   const address1Dom = document.querySelector('.add1Frm > input')
  //   console.log('address', address1Dom);
  //   address.replace(/.+?[都道府県](.*)/)
  //   const address1 = RegExp.$1
  //   address1Dom.value = address1
  // }, 1000 * 3)
}

function autofillAMAZON(state) {
  const { name, address, phoneNumber } = state;
  
  const nameDom = document.querySelector("#address-ui-widgets-enterAddressFullName");
  nameDom.value = name;
  const zipcode1 = document.querySelector("#address-ui-widgets-enterAddressPostalCodeOne");
  const zipcode2 = document.querySelector("#address-ui-widgets-enterAddressPostalCodeTwo");
  const prefa = document.querySelector("#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId_19");

  return null;
}
