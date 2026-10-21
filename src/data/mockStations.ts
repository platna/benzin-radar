import type { Station } from '../types/station.ts';

export const FALLBACK_STATIONS: Station[] = [
  {
    "osm_id": "551531303",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Бурнаковский пр-д, 17",
    "lat": 56.3216904,
    "lon": 43.9100626,
    "distance_km": 6.4,
    "status": "no",
    "detail": "Заправка не работает",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 02:29:58",
    "confidence_base": 0
  },
  {
    "osm_id": "472059201",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Новикова-Прибоя, 25",
    "lat": 56.2756556,
    "lon": 43.9054865,
    "distance_km": 10.1,
    "status": null,
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 0,
    "last_at": "2026-10-20 12:08:43",
    "confidence_base": 0,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_87c_UNqWWeM",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Федосеенко, 61А",
    "lat": 56.33965738235636,
    "lon": 43.80577649179272,
    "distance_km": 12,
    "status": "no",
    "detail": "Заправка не работает",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 05:27:48",
    "confidence_base": 0.35
  },
  {
    "osm_id": "usr_nwYoV1hLORc",
    "brand": "Макойл",
    "name": "Макойл",
    "addr": "",
    "lat": 56.22205890415084,
    "lon": 44.056506156921394,
    "distance_km": 14.6,
    "status": "no",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:37:01",
    "confidence_base": 0.35
  },
  {
    "osm_id": "1822484685",
    "brand": "ПТМ",
    "name": "ПТМ",
    "addr": "ул Заречная, 19",
    "lat": 56.4094331,
    "lon": 43.6474806,
    "distance_km": 22.7,
    "status": "no",
    "detail": "Заправка не работает",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 11:15:17",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "2479390676",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Красная Слобода, 10",
    "lat": 56.3287859,
    "lon": 44.0311845,
    "distance_km": 3,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "92,95",
    "confirmations": 1,
    "last_at": "2026-10-20 20:45:05",
    "confidence_base": 0,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "usr_RkQhlleqMgU",
    "brand": "АЗС",
    "name": "АЗС",
    "addr": "ул Керченская, 20Б",
    "lat": 56.335611459999534,
    "lon": 43.95612314343453,
    "distance_km": 3.1,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 05:35:31",
    "confidence_base": 0.35
  },
  {
    "osm_id": "usr_iqOsWSp2mfQ",
    "brand": "АГЗС Газэнергосеть",
    "name": "АГЗС Газэнергосеть",
    "addr": "ул Бетанкура, 1Е",
    "lat": 56.33741203792239,
    "lon": 43.95314502720794,
    "distance_km": 3.2,
    "status": "yes",
    "detail": "95, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:26:06",
    "confidence_base": 0.7104
  },
  {
    "osm_id": "4682407056",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Мещерский б-р, 1",
    "lat": 56.333375,
    "lon": 43.9487774,
    "distance_km": 3.7,
    "status": "yes",
    "detail": "92, 95, ДТ · Лимит 40 л",
    "fuels_now": "92,95,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-18 10:43:25",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1106788026",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Р-159, 10 км.",
    "lat": 56.3664127,
    "lon": 43.9387409,
    "distance_km": 4.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:10:26",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100",
        "lpg"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "usr_SwjH8ZvQQWQ",
    "brand": "Солид",
    "name": "Солид",
    "addr": "ул Красногорка, 99",
    "lat": 56.388863424919805,
    "lon": 44.01053428686282,
    "distance_km": 4.4,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:12:37",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "12960097562",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "улица Кольцова, 24А",
    "lat": 56.3775651,
    "lon": 44.0558691,
    "distance_km": 4.6,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:56:15",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "3043826790",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "улица Тимирязева, 11А",
    "lat": 56.3081103,
    "lon": 44.0020154,
    "distance_km": 4.7,
    "status": "yes",
    "detail": "92, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 4,
    "last_at": "2026-10-18 09:12:20",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_zCBhvIGZjCY",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Красногорка, 120",
    "lat": 56.39184309760658,
    "lon": 44.01134252513658,
    "distance_km": 4.7,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:43:02",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "12559986081",
    "brand": "Реал Инвест",
    "name": "Реал Инвест",
    "addr": "Бурнаковская улица, 33",
    "lat": 56.3397022,
    "lon": 43.9189128,
    "distance_km": 5.1,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:14:58",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "usr_36yAkMaTwOY",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Озерная, 1В",
    "lat": 56.39554232936716,
    "lon": 43.99996185367854,
    "distance_km": 5.1,
    "status": "yes",
    "detail": "95, 95+, ДТ · Лимит 40 л",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:22:17",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "503285894",
    "brand": "ОПТИ",
    "name": "Опти",
    "addr": "ул Салганская, 35Б",
    "lat": 56.3048666,
    "lon": 44.0212376,
    "distance_km": 5.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:41:29",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "80",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "4594202983",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "ул Долгополова, 84А",
    "lat": 56.3140684,
    "lon": 43.9455425,
    "distance_km": 5.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:37:54",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "1979549048",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Куйбышева, 65А",
    "lat": 56.334466,
    "lon": 43.9182283,
    "distance_km": 5.3,
    "status": "yes",
    "detail": "92, 95 · Лимит 40 л",
    "fuels_now": "92,95",
    "confirmations": 3,
    "last_at": "2026-10-18 10:34:11",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1821380015",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Стеклозаводское шоссе, 6",
    "lat": 56.344692,
    "lon": 44.087127,
    "distance_km": 5.4,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:12:10",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1851942358",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "улица Июльских Дней, 1Б",
    "lat": 56.3093922,
    "lon": 43.9470889,
    "distance_km": 5.6,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 3,
    "last_at": "2026-10-18 10:10:07",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_7t_yn-E4_HQ",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Московское шоссе, 34А",
    "lat": 56.317696013205314,
    "lon": 43.92928361892701,
    "distance_km": 5.6,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:20:55",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "1674764865",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Родионова, 163А",
    "lat": 56.3163049,
    "lon": 44.0693628,
    "distance_km": 5.7,
    "status": "yes",
    "detail": "92, 95, ДТ · Лимит 40 л",
    "fuels_now": "92,95,ДТ",
    "confirmations": 6,
    "last_at": "2026-10-18 10:29:08",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "12960097563",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "улица Нахимова, 68В",
    "lat": 56.3491986,
    "lon": 44.0926945,
    "distance_km": 5.7,
    "status": "yes",
    "detail": "92, 95, 95+, 100, ДТ",
    "fuels_now": "92,95,95+,100,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 10:27:32",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "usr_j-tyUhNCC1k",
    "brand": "Бензоробот",
    "name": "Бензоробот",
    "addr": "ул Артельная, 15",
    "lat": 56.29826434162772,
    "lon": 43.99665478163517,
    "distance_km": 5.8,
    "status": "yes",
    "detail": "95 · Только наличные",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 05:51:00",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "1658293594",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "пр-кт Гагарина, 23В",
    "lat": 56.2963713,
    "lon": 43.9830621,
    "distance_km": 6.1,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-21 05:34:48",
    "confidence_base": 0.85,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "599191712",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "ул Надежды Сусловой, 21",
    "lat": 56.3024695,
    "lon": 44.048789,
    "distance_km": 6.1,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 2,
    "last_at": "2026-10-19 07:16:39",
    "confidence_base": 0.8807,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "w398360170",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Бурнаковский проезд, 17",
    "lat": 56.3220191,
    "lon": 43.9111289,
    "distance_km": 6.3,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ · Лимит 40 л",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 6,
    "last_at": "2026-10-18 10:27:54",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "5152652131",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Бурнаковская, 33А",
    "lat": 56.3437906,
    "lon": 43.8944152,
    "distance_km": 6.5,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 07:57:29",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "503595021",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Комсомольская площадь, 3А",
    "lat": 56.2992505,
    "lon": 43.9452975,
    "distance_km": 6.6,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ · Лимит 30 л",
    "fuels_now": "",
    "confirmations": 5,
    "last_at": "2026-10-18 10:15:03",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1885004578",
    "brand": "Реал Инвест",
    "name": "Реал Инвест",
    "addr": "ул Коминтерна, 32",
    "lat": 56.3402252,
    "lon": 43.889195,
    "distance_km": 6.9,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 07:17:03",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "lpg"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1673731750",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "пр-кт Гагарина, 31А",
    "lat": 56.2880356,
    "lon": 43.9803932,
    "distance_km": 7,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-21 06:11:44",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1745380891",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Ванеева, 110И",
    "lat": 56.2902714,
    "lon": 44.0368296,
    "distance_km": 7,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 04:58:11",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1745380911",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Ванеева, 207Б",
    "lat": 56.2904475,
    "lon": 44.0357657,
    "distance_km": 7,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 04:58:28",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr__MdJQAY0Hl8",
    "brand": "Солид",
    "name": "Солид",
    "addr": "ул Совхозная, 2",
    "lat": 56.41248880101376,
    "lon": 44.010779857635505,
    "distance_km": 7,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:10:51",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "1706992430",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Юбилейная, 3",
    "lat": 56.2858374,
    "lon": 43.9984095,
    "distance_km": 7.1,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:43:34",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "3340296009",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Весенняя, 5",
    "lat": 56.2967176,
    "lon": 43.935417,
    "distance_km": 7.1,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 04:12:36",
    "confidence_base": 0.3729,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1731947616",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Ванеева, 110В",
    "lat": 56.2881303,
    "lon": 44.0369688,
    "distance_km": 7.2,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 6,
    "last_at": "2026-10-18 10:38:54",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "968431748",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Комсомольское шоссе, 2",
    "lat": 56.2954212,
    "lon": 43.9330126,
    "distance_km": 7.3,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "92,95",
    "confirmations": 1,
    "last_at": "2026-10-21 03:32:10",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1979549015",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Комсомольское шоссе, 3В",
    "lat": 56.2988787,
    "lon": 43.9265509,
    "distance_km": 7.3,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 5,
    "last_at": "2026-10-18 10:46:15",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1672796022",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "ул Родионова, 198",
    "lat": 56.3023461,
    "lon": 44.081421,
    "distance_km": 7.3,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 08:56:29",
    "confidence_base": 0.35
  },
  {
    "osm_id": "11494417128",
    "brand": "КорундОйл",
    "name": "КорундОйл",
    "addr": "",
    "lat": 56.4158481,
    "lon": 44.0058939,
    "distance_km": 7.3,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:11:27",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "4221673408",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "улица Голубева, 3А",
    "lat": 56.2884497,
    "lon": 43.9535857,
    "distance_km": 7.4,
    "status": "yes",
    "detail": "95, ДТ",
    "fuels_now": "95,ДТ",
    "confirmations": 5,
    "last_at": "2026-10-18 10:23:53",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "304927874",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Коминтерна, 17",
    "lat": 56.3406097,
    "lon": 43.8803488,
    "distance_km": 7.4,
    "status": "yes",
    "detail": "92, 95, 95+",
    "fuels_now": "92,95,95+",
    "confirmations": 4,
    "last_at": "2026-10-18 10:40:35",
    "confidence_base": 0.8795,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1873946701",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "Комсомольское шоссе, 5Б",
    "lat": 56.3114519,
    "lon": 43.8998943,
    "distance_km": 7.5,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-18 10:43:24",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "80",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_mkHSwslrezk",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "ул имени Генерала Ивлиева И.Д., 33Б",
    "lat": 56.288309976480505,
    "lon": 44.05453173447313,
    "distance_km": 7.6,
    "status": "yes",
    "detail": "95, 98, ДТ",
    "fuels_now": "95,98,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 08:50:13",
    "confidence_base": 0.35
  },
  {
    "osm_id": "428600249",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Комсомольское шоссе, 14",
    "lat": 56.310483,
    "lon": 43.8988281,
    "distance_km": 7.6,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 6,
    "last_at": "2026-10-18 10:43:06",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "12960097542",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Щербакова, 27",
    "lat": 56.35087,
    "lon": 43.87517,
    "distance_km": 7.7,
    "status": "yes",
    "detail": "92, 95, 95+ · Лимит 40 л",
    "fuels_now": "92,95,95+",
    "confirmations": 4,
    "last_at": "2026-10-18 10:42:18",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100",
        "lpg"
      ]
    }
  },
  {
    "osm_id": "usr_MZgvIYH28O8",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "пр-кт Героев, 72",
    "lat": 56.32249782548814,
    "lon": 43.88278469751904,
    "distance_km": 7.8,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ · Лимит 40 л",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:40:10",
    "confidence_base": 0.8795
  },
  {
    "osm_id": "13947402183",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "Казанское шоссе, 7Б",
    "lat": 56.2920628,
    "lon": 44.0743853,
    "distance_km": 7.9,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 08:55:55",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "13947402184",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Казанское шоссе, 6А",
    "lat": 56.2922951,
    "lon": 44.0754388,
    "distance_km": 7.9,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:40:59",
    "confidence_base": 0.8795,
    "meta": {
      "f": [
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1942823075",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Ванеева, 247",
    "lat": 56.2793654,
    "lon": 44.0346267,
    "distance_km": 8.1,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-18 10:35:36",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "3768653789",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Московское шоссе, 213Б",
    "lat": 56.3146888,
    "lon": 43.869233,
    "distance_km": 9,
    "status": "yes",
    "detail": "92, 95, 95+, 100, ДТ",
    "fuels_now": "92,95,95+,100,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-18 10:51:23",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1104336470",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Ярошенко, 1А",
    "lat": 56.3306224,
    "lon": 43.8583918,
    "distance_km": 9,
    "status": "yes",
    "detail": "92, ДТ · Лимит 30 л",
    "fuels_now": "92,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:37:28",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "6265317469",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Кузбасская, 1Ж",
    "lat": 56.3098229,
    "lon": 43.8706816,
    "distance_km": 9.1,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 09:32:52",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "4779736721",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "Анкудиновское шоссе, 16",
    "lat": 56.2672964,
    "lon": 43.9965534,
    "distance_km": 9.2,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 07:58:13",
    "confidence_base": 0.3729,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "6657549030",
    "brand": "Русгаз",
    "name": "Русгаз",
    "addr": "",
    "lat": 56.2935169,
    "lon": 44.1092637,
    "distance_km": 9.2,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 05:12:07",
    "confidence_base": 0.35
  },
  {
    "osm_id": "9373479811",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Московское шоссе, 232Б",
    "lat": 56.3119236,
    "lon": 43.8670528,
    "distance_km": 9.2,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ · Очередь до 15 мин · Лимит 40 л",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:02:51",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1104335589",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Московское шоссе, 248А",
    "lat": 56.313012,
    "lon": 43.8661076,
    "distance_km": 9.2,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 10:48:36",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1104334720",
    "brand": "Vk Oil",
    "name": "Vk Oil",
    "addr": "ул. Кузбасская, 1А, корп. 1",
    "lat": 56.3069212,
    "lon": 43.8714751,
    "distance_km": 9.3,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 09:28:04",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "usr_73lL_TzX8_8",
    "brand": "Солид",
    "name": "Солид",
    "addr": "",
    "lat": 56.43338906238902,
    "lon": 43.992312754926395,
    "distance_km": 9.3,
    "status": "yes",
    "detail": "95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 03:34:34",
    "confidence_base": 0.35
  },
  {
    "osm_id": "1188839843",
    "brand": "АЗС-204",
    "name": "АЗС-204",
    "addr": "ул Удмуртская, 37б",
    "lat": 56.2926569,
    "lon": 43.886404,
    "distance_km": 9.5,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 04:51:26",
    "confidence_base": 0.3729,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1105606206",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Кузбасская, 2Б",
    "lat": 56.3030418,
    "lon": 43.8717838,
    "distance_km": 9.5,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:46:32",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "982316606",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Циолковского, 46",
    "lat": 56.3364599,
    "lon": 43.8478935,
    "distance_km": 9.5,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 10:33:24",
    "confidence_base": 0.35
  },
  {
    "osm_id": "1188839779",
    "brand": "Энтиком Инвест",
    "name": "Энтиком Инвест",
    "addr": "ул Удмуртская, 4А",
    "lat": 56.2912295,
    "lon": 43.8846973,
    "distance_km": 9.7,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 04:51:07",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "4748992371",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "улица Академика Сахарова, 8",
    "lat": 56.262648,
    "lon": 44.0240853,
    "distance_km": 9.8,
    "status": "yes",
    "detail": "95",
    "fuels_now": "95",
    "confirmations": 3,
    "last_at": "2026-10-21 05:48:00",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "494615159",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "ул Удмуртская, 67",
    "lat": 56.2834966,
    "lon": 43.8939881,
    "distance_km": 9.9,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 10:42:19",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "3652593054",
    "brand": "Esco",
    "name": "Esco",
    "addr": "улица Станиславского, 1А",
    "lat": 56.3509026,
    "lon": 43.8389718,
    "distance_km": 9.9,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:28:22",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "usr_RyR7vl8jDEs",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Сучанская, 18б",
    "lat": 56.279506,
    "lon": 43.89228,
    "distance_km": 10.3,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 08:18:30",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "601354450",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Московское шоссе, 235",
    "lat": 56.3130851,
    "lon": 43.8469954,
    "distance_km": 10.3,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:37:38",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "12960097557",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Магистральная, 10Б",
    "lat": 56.26999,
    "lon": 44.0889542,
    "distance_km": 10.5,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:08:39",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1246358609",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Московское шоссе, 237",
    "lat": 56.3130064,
    "lon": 43.8416156,
    "distance_km": 10.6,
    "status": "yes",
    "detail": "92, 95, 100, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:25:14",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "usr_NO_borap2hE",
    "brand": "Топливный остров",
    "name": "Топливный остров",
    "addr": "ул Светлоярская, 45",
    "lat": 56.35938694258437,
    "lon": 43.82749732787551,
    "distance_km": 10.7,
    "status": "yes",
    "detail": "95",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:10:31",
    "confidence_base": 0.35
  },
  {
    "osm_id": "1188839960",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Героя Попова, 35А",
    "lat": 56.2583413,
    "lon": 43.9335316,
    "distance_km": 11,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:12:52",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1435551122",
    "brand": "Ока Пропан",
    "name": "Ока Пропан",
    "addr": "Суздальская улица, 1А",
    "lat": 56.2554524,
    "lon": 43.9396909,
    "distance_km": 11.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:35:37",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "lpg"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "965102137",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Героя Попова, 58В",
    "lat": 56.256648,
    "lon": 43.9310106,
    "distance_km": 11.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:43:11",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "10108987158",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "пр-кт Ленина, 82Б",
    "lat": 56.2617875,
    "lon": 43.9089826,
    "distance_km": 11.3,
    "status": "yes",
    "detail": "92",
    "fuels_now": "92",
    "confirmations": 8,
    "last_at": "2026-10-18 10:36:37",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "7470134186",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "улица Героя Попова, 38",
    "lat": 56.2550669,
    "lon": 43.9278932,
    "distance_km": 11.5,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 08:51:05",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "lpg"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "usr_cfMYdskaP0Q",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Федосеенко, 50А",
    "lat": 56.3417389027713,
    "lon": 43.81222061812878,
    "distance_km": 11.6,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 09:09:50",
    "confidence_base": 0.35
  },
  {
    "osm_id": "9644429598",
    "brand": "Татнефть",
    "name": "Татнефть",
    "addr": "проспект Гагарина, 69А",
    "lat": 56.2463718,
    "lon": 43.9654732,
    "distance_km": 11.7,
    "status": "yes",
    "detail": "95, 98, ДТ",
    "fuels_now": "",
    "confirmations": 4,
    "last_at": "2026-10-18 10:40:51",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_XmRqJx-goUY",
    "brand": "expressАЗС",
    "name": "expressАЗС",
    "addr": "ул. Луговая 30",
    "lat": 56.246128452401074,
    "lon": 44.0431272983551,
    "distance_km": 11.9,
    "status": "yes",
    "detail": "95",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 02:29:15",
    "confidence_base": 0
  },
  {
    "osm_id": "1585250197",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Ларина, 2",
    "lat": 56.2429713,
    "lon": 43.9733225,
    "distance_km": 12,
    "status": null,
    "detail": "95",
    "fuels_now": "95",
    "confirmations": 0,
    "last_at": "2026-10-20 18:14:27",
    "confidence_base": 0,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1212104644",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "улица Гаугеля, 2А",
    "lat": 56.3576511,
    "lon": 43.8059314,
    "distance_km": 12,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 09:22:34",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "12960097541",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Гаугеля, 2Б",
    "lat": 56.35593,
    "lon": 43.80427,
    "distance_km": 12.1,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:42:58",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "lpg"
      ]
    }
  },
  {
    "osm_id": "1839076936",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "пр-кт Ленина, 92а",
    "lat": 56.2558,
    "lon": 43.8975116,
    "distance_km": 12.2,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 10,
    "last_at": "2026-10-18 11:18:59",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1109284734",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Коновалова, 1А",
    "lat": 56.3511948,
    "lon": 43.8016686,
    "distance_km": 12.2,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 10:40:20",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_3Q3VIvOSFWo",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Ларина, 13а",
    "lat": 56.239937439502626,
    "lon": 43.98988634117504,
    "distance_km": 12.3,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:35:56",
    "confidence_base": 0.7104
  },
  {
    "osm_id": "1303013525",
    "brand": "Реал Инвест",
    "name": "Реал Инвест",
    "addr": "ул Борская, 17Б",
    "lat": 56.2583632,
    "lon": 43.8897125,
    "distance_km": 12.3,
    "status": "yes",
    "detail": "92",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:17:32",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "lpg"
      ]
    }
  },
  {
    "osm_id": "11463706220",
    "brand": "IRBIS",
    "name": "Irbis",
    "addr": "улица Ларина, 26А",
    "lat": 56.2379209,
    "lon": 44.00927,
    "distance_km": 12.5,
    "status": "yes",
    "detail": "95, 95+",
    "fuels_now": "95,95+",
    "confirmations": 2,
    "last_at": "2026-10-18 10:22:15",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_eec8C6Wd3Ek",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Ларина, 32",
    "lat": 56.23620737451813,
    "lon": 44.02177201852994,
    "distance_km": 12.7,
    "status": "yes",
    "detail": "92",
    "fuels_now": "92",
    "confirmations": 1,
    "last_at": "2026-10-21 03:27:10",
    "confidence_base": 0.35
  },
  {
    "osm_id": "1326646466",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "ул Львовская, 11А",
    "lat": 56.2631229,
    "lon": 43.8666329,
    "distance_km": 12.7,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "92,95",
    "confirmations": 1,
    "last_at": "2026-10-18 10:45:41",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "12960097545",
    "brand": "Газпромнефть",
    "name": "Газпромнефть №235",
    "addr": "ул Федосеенко, 63А",
    "lat": 56.3333399,
    "lon": 43.7947508,
    "distance_km": 12.8,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 09:13:21",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_xzBLNCL_AIQ",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "ул Ларина, 23",
    "lat": 56.23493766532613,
    "lon": 44.025996767399036,
    "distance_km": 12.9,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:30:56",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "2117401099",
    "brand": "Максойл",
    "name": "Максойл",
    "addr": "ул Магистральная, 137В",
    "lat": 56.2475648,
    "lon": 44.0991738,
    "distance_km": 12.9,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 06:21:04",
    "confidence_base": 0.35
  },
  {
    "osm_id": "12960097544",
    "brand": "Газпромнефть",
    "name": "Газпромнефть №236",
    "addr": "ул Федосеенко, 64Б",
    "lat": 56.3339466,
    "lon": 43.7933684,
    "distance_km": 12.9,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 09:12:42",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "8346218117",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "",
    "lat": 56.2353893,
    "lon": 44.0479069,
    "distance_km": 13.1,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:35:52",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "1831366451",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Дьяконова, 2б",
    "lat": 56.2572731,
    "lon": 43.8687275,
    "distance_km": 13.1,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:56:15",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1145383058",
    "brand": "ОПТИ",
    "name": "ОПТИ",
    "addr": "Московское шоссе, 245",
    "lat": 56.3113973,
    "lon": 43.7986639,
    "distance_km": 13.1,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 03:32:11",
    "confidence_base": 0.3729,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "700873647",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Кима, 339",
    "lat": 56.3830176,
    "lon": 43.7929487,
    "distance_km": 13.3,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:18:27",
    "confidence_base": 0.7507,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "1145383044",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "Московское шоссе, 352Б",
    "lat": 56.3101003,
    "lon": 43.7886596,
    "distance_km": 13.8,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:27:38",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_mjBcXt-buJs",
    "brand": "Газпром",
    "name": "Газпром",
    "addr": "пр-кт Гагарина, 228А",
    "lat": 56.22779578317838,
    "lon": 43.943869471549995,
    "distance_km": 14,
    "status": "yes",
    "detail": "95, ДТ",
    "fuels_now": "",
    "confirmations": 3,
    "last_at": "2026-10-18 07:34:49",
    "confidence_base": 0.9
  },
  {
    "osm_id": "usr_HFgXX0NNGi4",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "пр-кт Гагарина, 121А",
    "lat": 56.228207799393154,
    "lon": 43.942335247993476,
    "distance_km": 14,
    "status": "yes",
    "detail": "92, 95, 100, ДТ",
    "fuels_now": "92,95,100,ДТ",
    "confirmations": 5,
    "last_at": "2026-10-18 11:00:48",
    "confidence_base": 0.9
  },
  {
    "osm_id": "usr_WPubOupKfVs",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "пр-кт Гагарина, 127",
    "lat": 56.223731048027375,
    "lon": 43.938971757888794,
    "distance_km": 14.5,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 07:01:43",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "1253573545",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "пр-кт Гагарина, 232а",
    "lat": 56.2239357,
    "lon": 43.9411833,
    "distance_km": 14.5,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 6,
    "last_at": "2026-10-18 10:57:37",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "13018690858",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "улица Монастырка, 19",
    "lat": 56.2363465,
    "lon": 43.8830082,
    "distance_km": 14.6,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:38:57",
    "confidence_base": 0.8323,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "4221665907",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "",
    "lat": 56.2226083,
    "lon": 44.0741394,
    "distance_km": 14.9,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:29:57",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "usr_Zgf7asardFg",
    "brand": "Esco",
    "name": "Esco",
    "addr": "пр-кт Гагарина, 236",
    "lat": 56.2194169636785,
    "lon": 43.93811877662289,
    "distance_km": 15,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 08:30:14",
    "confidence_base": 0.8323
  },
  {
    "osm_id": "usr_G9LxiviJhKs",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "",
    "lat": 56.487165,
    "lon": 44.021428,
    "distance_km": 15.3,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 4,
    "last_at": "2026-10-18 09:51:05",
    "confidence_base": 0.9
  },
  {
    "osm_id": "usr_kHrZQirJI7w",
    "brand": "IRBIS",
    "name": "Irbis",
    "addr": "ул Магистральная, 2",
    "lat": 56.21837436295459,
    "lon": 44.10490393638611,
    "distance_km": 16,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:42:05",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "8490117960",
    "brand": "Татнефть",
    "name": "Татнефть",
    "addr": "Молодежный пр-кт, 29В",
    "lat": 56.2440623,
    "lon": 43.8248089,
    "distance_km": 16,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,95+,ДТ",
    "confirmations": 7,
    "last_at": "2026-10-18 10:16:40",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "usr_Z8yJZTwQESg",
    "brand": "СфераОйл",
    "name": "СфераОйл",
    "addr": "",
    "lat": 56.248736,
    "lon": 43.80807,
    "distance_km": 16.3,
    "status": "yes",
    "detail": "ДТ",
    "fuels_now": "ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 10:59:11",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "usr_UtHRpk4hluU",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Магистральная, 6",
    "lat": 56.213706536911076,
    "lon": 44.10564512014389,
    "distance_km": 16.5,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-21 05:26:50",
    "confidence_base": 0.8
  },
  {
    "osm_id": "5820252560",
    "brand": "Teboil",
    "name": "Teboil",
    "addr": "Молодежный пр-кт, 39",
    "lat": 56.2462108,
    "lon": 43.8078835,
    "distance_km": 16.5,
    "status": "yes",
    "detail": "92, 95, ДТ · Лимит 40 л",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:43:12",
    "confidence_base": 0.7104,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "1827733522",
    "brand": "ОПТИ",
    "name": "Опти",
    "addr": "ул Афанасьева, 7",
    "lat": 56.2236688,
    "lon": 43.8534234,
    "distance_km": 16.7,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:43:27",
    "confidence_base": 0.9
  },
  {
    "osm_id": "usr_tzWzTV6gNxU",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Школьная ул., 70Б, сельский посёлок Ждановский, 607684",
    "lat": 56.207264,
    "lon": 44.087379,
    "distance_km": 16.8,
    "status": null,
    "detail": "100",
    "fuels_now": "100",
    "confirmations": 0,
    "last_at": "2026-10-20 17:43:54",
    "confidence_base": 0,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1814710925",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Минеева, 15А",
    "lat": 56.2272297,
    "lon": 43.8405496,
    "distance_km": 16.8,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 09:58:36",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "usr__IZ5Ams1XlM",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Школьная, 70А",
    "lat": 56.20647223986004,
    "lon": 44.09059524536132,
    "distance_km": 16.9,
    "status": "yes",
    "detail": "92, 95",
    "fuels_now": "92,95",
    "confirmations": 1,
    "last_at": "2026-10-21 03:03:57",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "9644429597",
    "brand": "Татнефть",
    "name": "Татнефть",
    "addr": "ул Светлая, 11",
    "lat": 56.1983688,
    "lon": 44.111741,
    "distance_km": 18.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:23:29",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1807987499",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "ул Центральная, 2Е",
    "lat": 56.1862036,
    "lon": 43.9214463,
    "distance_km": 18.8,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 3,
    "last_at": "2026-10-18 10:56:14",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95"
      ]
    }
  },
  {
    "osm_id": "920813606",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Безводная, 14",
    "lat": 56.2125852,
    "lon": 43.8024083,
    "distance_km": 19.6,
    "status": "yes",
    "detail": "95+, ДТ · Лимит 40 л",
    "fuels_now": "95+,ДТ",
    "confirmations": 6,
    "last_at": "2026-10-18 10:56:54",
    "confidence_base": 0.9,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "usr_8XruuSi1YoQ",
    "brand": "Газпромнефть",
    "name": "Газпромнефть",
    "addr": "Дзержинск, Московское (398й км, справа)",
    "lat": 56.305628,
    "lon": 43.687423,
    "distance_km": 19.9,
    "status": "yes",
    "detail": "92, 95, 95+, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 03:38:33",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "usr_t_kAxiQ8Bm0",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Советская, 106",
    "lat": 56.18501413686588,
    "lon": 44.14272453635933,
    "distance_km": 20.4,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:39:30",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "usr_xdHgOziJVVs",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "ул Советская, 106",
    "lat": 56.185151276966266,
    "lon": 44.14384603500368,
    "distance_km": 20.4,
    "status": "yes",
    "detail": "92, 95, ДТ",
    "fuels_now": "92,95,ДТ",
    "confirmations": 2,
    "last_at": "2026-10-18 10:42:01",
    "confidence_base": 0.7104
  },
  {
    "osm_id": "13140815469",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "",
    "lat": 56.2430578,
    "lon": 43.7253579,
    "distance_km": 20.7,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:16:45",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    },
    "svc": "only"
  },
  {
    "osm_id": "1296949962",
    "brand": "Лукойл",
    "name": "Лукойл",
    "addr": "",
    "lat": 56.242389,
    "lon": 43.7218468,
    "distance_km": 20.9,
    "status": "yes",
    "detail": "92, 95, ДТ · Лимит 40 л",
    "fuels_now": "",
    "confirmations": 2,
    "last_at": "2026-10-18 10:42:45",
    "confidence_base": 0.35,
    "meta": {
      "f": [
        "dt",
        "92",
        "95",
        "100"
      ]
    }
  },
  {
    "osm_id": "w166116449",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "",
    "lat": 56.3064746,
    "lon": 43.6663609,
    "distance_km": 21.1,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 03:38:55",
    "confidence_base": 0.3729
  },
  {
    "osm_id": "usr_MmpsCjUeemo",
    "brand": "Мик Газ",
    "name": "Мик Газ",
    "addr": "ул Объединения, 14Б",
    "lat": 56.22081963190769,
    "lon": 43.747696464380006,
    "distance_km": 21.2,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:55:12",
    "confidence_base": 0.35
  },
  {
    "osm_id": "2172339474",
    "brand": "Терминал",
    "name": "Терминал",
    "addr": "ул Новополевая, 36",
    "lat": 56.2074619,
    "lon": 43.7700212,
    "distance_km": 21.3,
    "status": "yes",
    "detail": "92, ДТ",
    "fuels_now": "92,ДТ",
    "confirmations": 1,
    "last_at": "2026-10-18 11:05:08",
    "confidence_base": 0.35
  },
  {
    "osm_id": "usr_muQ_8M8cTRA",
    "brand": "Esco",
    "name": "Esco",
    "addr": "пр-кт Капитана Рачкова, 38",
    "lat": 56.16531292981333,
    "lon": 44.18554455041886,
    "distance_km": 23.5,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:13:16",
    "confidence_base": 0.35,
    "svc": "only"
  },
  {
    "osm_id": "3158641388",
    "brand": "ESCO",
    "name": "Esco",
    "addr": "",
    "lat": 56.3042108,
    "lon": 43.6077661,
    "distance_km": 24.7,
    "status": "yes",
    "detail": "",
    "fuels_now": "",
    "confirmations": 1,
    "last_at": "2026-10-18 10:41:39",
    "confidence_base": 0.35,
    "svc": "only"
  }
];
