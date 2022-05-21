import { Component, OnInit } from '@angular/core';
// import { AuthService } from '@core/services/auth.service';
// import { Router } from '@angular/router';

type TMainRegionsCoords = { [key: number]: number[]; };

type TmainRegions = {
  [key: number]: {
    city: string;
    qty: number;
    image: string;
    fio: string;
    gender: string;
  };
};

@Component({
  selector: 'app-map-container',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  /* @ts-ignore-nextline */
  private map: ymaps = {};
  // [latitude, longitude] - Центр страны.
  private center: number[] = [65.33902341000702, 105.3371582420178];
  private zoom = 4;

  private mainRegionsCoords: TMainRegionsCoords = {
    102269: [55.75731259886307, 37.61731033959772], // Москва
    337422: [59.93938318830523, 30.31976322248647], // Санкт-Петербург
    140294: [55.02042110093748, 82.89794047835093], // Новосибирск
    79379: [56.85148905638376, 60.589843788892736], // Екатеринбург
    79374: [55.799911181273814, 49.110477030362084], // Казань
    72195: [56.32684535574211, 44.01098569319437], // Нижний Новгород
    77687: [55.1558919152007, 61.39733890608024], // Челябинск
    72194: [53.187165459457184, 50.07592777326774], // Самара
    140292: [54.98251784508478, 73.32299808576772], // Омск
    85606: [47.18810477799233, 39.68286136701773], // Ростов-на-Дону
  };

  private mainRegions: TmainRegions = {
    102269: {
      image: '/assets/curator/1.jpg',
      fio: 'Ивашкин Давид Дмитриевич',
      qty: 11,
      city: 'Москва',
      gender: 'male',
    },
    337422: {
      image: '/assets/curator/2.jpg',
      fio: 'Галкин Роман Александрович',
      qty: 19,
      city: 'Санкт-Петербург',
      gender: 'male',
    },
    140294: {
      image: '/assets/curator/3.jpg',
      fio: 'Хазраткулов Зиёбек Турдимурод угли',
      qty: 8,
      city: 'Новосибирск',
      gender: 'male',
    },
    79379: {
      image: '/assets/curator/4.jpg',
      fio: 'Сабирова Эльвира Руслановна',
      qty: 15,
      city: 'Екатеринбург',
      gender: 'female',
    },
    79374: {
      image: '/assets/curator/5.jpg',
      fio: 'Хугаева Виктория Демировна',
      qty: 17,
      city: 'Казань',
      gender: 'female',
    },
    72195: {
      image: '/assets/curator/6.jpg',
      fio: 'Тумилович Анастасия Олеговна',
      qty: 5,
      city: 'Нижний Новгород',
      gender: 'female',
    },
    77687: {
      image: '/assets/curator/7.jpg',
      fio: 'Любимова Софья Ивановна',
      qty: 68,
      city: 'Челябинск',
      gender: 'female',
    },
    72194: {
      image: '/assets/curator/8.jpg',
      fio: 'Афанасьев Павел Даниилович',
      qty: 51,
      city: 'Самара',
      gender: 'male',
    },
    140292: {
      image: '/assets/curator/9.jpg',
      fio: 'Беляев Артём Кириллович',
      qty: 59,
      city: 'Омск',
      gender: 'male',
    },
    85606: {
      image: '/assets/curator/10.jpg',
      fio: 'Быкова Ева Михайловна',
      qty: 34,
      city: 'Ростов-на-Дону',
      gender: 'female',
    },
  };

  constructor() { }

  async ngOnInit(): Promise<void> {
    /* @ts-ignore-nextline */
    await window.ymaps.ready();
    this.drawMap();
    await this.renderRegion();
  };

  drawMap(): void {
    /* @ts-ignore-nextline */
    this.map = new window.ymaps.Map(document.getElementById('map') as HTMLElement, {
      type: 'yandex#map',
      center: this.center,
      zoom: this.zoom,
      controls: [],
    }, {
      /* @ts-ignore-nextline */
      restrictMapArea: [[82, 18], [40, -170]],
    });

    this.map.events.add('click', (): void => {
      if (this.map.balloon.isOpen()) {
        this.map.balloon.close();
      }
    });

    this.drawPlacemarks();
  };

  drawPlacemarks(): void {
    /* @ts-ignore-nextline */
    Object.keys(this.mainRegionsCoords).forEach((osmId: number): void => {
      /* @ts-ignore-nextline */
      const placemark = new window.ymaps.Placemark(this.mainRegionsCoords[osmId], {
        balloonContentHeader: `
          <div style="
            font-size: 20px;
            font-weight: normal;
            color: #292584;
          ">
            ${this.mainRegions[osmId].city}
          </div>
        `,
        balloonContentBody: `
          <div style="margin-top: 12px;">
            <div style="
              font-size: 30px;
              color: #F96300;
            ">
              ${this.mainRegions[osmId].qty}
            </div>

            <div style="
              margin-top: 4px;
              font-size: 14px;
              color: gray;
            ">
              военнослужащих
            </div>
          </div>
        `,
        balloonContentFooter: `
          <div style="
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div style="
              margin-right: 20px;
              min-height: 150px;
            ">
              <img
                src="${this.mainRegions[osmId].image}"
                draggable="false"
                style="
                  display: block;
                  width: 120px;
                  object-fit: contain;
                "
              >
            </div>

            <div>
              <div style="
                font-size: 16px;
                color: gray;
              ">
                Куратор
              </div>

              <div style="
                margin-top: 10px;
                width: min-content;
                word-wrap: break-word;
                line-height: 1.3;
                font-size: 16px;
                color: black;
              ">
                ${this.mainRegions[osmId].fio}
              </div>
            </div>
          </div>
        `,
      }, {
        /* @ts-ignore-nextline */
        iconLayout: 'default#image',
        iconImageHref: '/assets/map_pin.png',
        iconImageSize: [25, 40],
        iconImageOffset: [-9, -39],
      });

      this.map.geoObjects.add(placemark);
    });
  }

  async renderRegion(): Promise<void> {
    /* @ts-ignore-nextline */ // regions 'RU'
    const regions: any = await window.ymaps.borders.load('001', { lang: 'ru', quality: 2 });

    /* @ts-ignore-nextline */
    const background = new window.ymaps.Polygon([
      [
        [85, -100],
        [85, 0],
        [85, 100],
        [85, 180],
        [85, -110],
        [-85, -110],
        [-85, 180],
        [-85, 100],
        [-85, 0],
        [-85, -100],
        [85, -100],
      ],
    ], {}, {
      strokeWidth: 0,
      fillColor: '#cccccc80',
    });

    const [region] = regions.features.filter(({ properties }: any) => properties.iso3166 === 'RU');
    const masks = region.geometry.coordinates;

    masks.forEach((mask: any) => {
      /* @ts-ignore-nextline */
      background.geometry.insert(1, mask);
    });

    this.map.geoObjects.add(background);
  };
}
