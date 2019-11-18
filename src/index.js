var state = { name: null, address: null, phoneNumber: null };

function main() {
  const map = new google.maps.Map(document.getElementById("map"), { zoom: 15 });
  const service = new google.maps.places.PlacesService(map);
  const Input = document.getElementById("a-input");
  const Submit = document.getElementById("a-submit");
  const Autofill = document.getElementById("a-autofill");
  const ResultArea = document.getElementById("a-result-area");

  const removeAllChildren = element => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  Input.onkeydown = event => {
    if (event.keyCode === 13) {
      Submit.onclick();
    }
  };

  Submit.onclick = async () => {
    const query = Input.value;
    if (query.length === 0) return;
    const request = {
      query: query,
      fields: [
        "name",
        "geometry",
        "formatted_address",
        "icon",
        "photos",
        "place_id"
      ]
    };

    const places = await new Promise((resolve, reject) => {
      return service.findPlaceFromQuery(request, (res, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          return resolve(res);
        }
        return reject(new Error());
      });
    });

    for (let i = 0; i < places.length; i++) {
      const p = places[i];
      const phoneNumber = await new Promise((resolve, reject) => {
        return service.getDetails(
          { placeId: p.place_id, fields: ["formatted_phone_number"] },
          (res, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              return resolve(res.formatted_phone_number);
            }
            return reject();
          }
        );
      });

      removeAllChildren(ResultArea);

      const header = document.createElement("h3");
      header.innerText = `${i + 1}. 施設名: ${p.name}`;
      state.name = p.name;
      ResultArea.appendChild(header);

      const paragraph1 = document.createElement("p");
      paragraph1.innerText = '住所： ' + p.formatted_address;
      ResultArea.appendChild(paragraph1);
      state.address = p.formatted_address;

      if (phoneNumber) {
        const paragraph2 = document.createElement("p");
        paragraph2.innerText = '電話番号： ' + phoneNumber;
        ResultArea.appendChild(paragraph2);
        state.phoneNumber = phoneNumber;
      }

      // const icon = document.createElement("img");
      // icon.src = p.icon;
      // ResultArea.appendChild(icon);

      if (p.photos) {
        const photo = document.createElement("img");
        photo.src = p.photos[0].getUrl();
        photo.style.width = "300px";
        photo.style.borderRadius = '20px';
        ResultArea.appendChild(photo);
      }
    }
  };

  Autofill.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          name: state.name,
          address: state.address,
          phoneNumber: state.phoneNumber
        },
        response => {
          console.log(response);
        }
      );
    });
  };
}
