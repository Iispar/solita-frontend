import React, { useState, useEffect, useRef } from 'react'
import bikeService from '../services/BikeService'
import ListJourneys from './ListJourneys'
import $ from 'jquery'
import 'jquery-ui-bundle'
import 'jquery-ui-bundle/jquery-ui.css'
import { getPageFilter } from './filterHelpers'

/**
 * method for creating the list of journeys.
 * @returns the journeys
 */
const Journeys = () => {
  const [journeys, setJourneys] = useState([])
  const page = useRef(0)
  const [filterNow, setFilterNow] = useState(['limit=10'])
  const [departure, setDeparture] = useState('')
  const [arrival, setArrival] = useState('')

  const stationsAndIds = { Hanasaari: '501', Keilalahti: '503', Westendinasema: '505', Golfpolku: '507', Revontulentie: '509', Sateentie: '511', Hakalehto: '513', Oravannahkatori: '515', Länsituuli: '517', Tuulimäki: '518', Tapionaukio: '519', Kulttuuriaukio: '521', Ahertajantie: '523', Mäntyviita: '525', Otsolahti: '527', 'Keilaniemi (M)': '529', Keilaranta: '531', Betonimies: '532', Tekniikantie: '533', Innopoli: '537', Hagalundsparken: '538', Otaranta: '543', Sähkömies: '545', Jämeräntaival: '547', Maarinranta: '549', Tietäjä: '551', Metsänneidonpolku: '553', Kalevalantie: '555', Louhentori: '557', Pohjankulma: '559', 'Koivu-Mankkaa': '561', Mankkaanlaaksontie: '563', Mankkaanaukio: '565', 'Tapiola Sports Park': '571', 'Sports Park (M)': '573', Tontunmäentie: '575', Olarinluoma: '577', Niittymaa: '579', 'Niittykumpu (M)': '581', Haukilahdenaukio: '585', Hauenkallio: '587', Haukilahdenranta: '589', Mellstenintie: '591', Toppelundintie: '593', Westendintie: '595', Toppelundinportti: '596', Linnakepolku: '597', Nokkala: '601', Matinlahdenranta: '603', Nuottaniementie: '607', Sepetlahdentie: '609', Matinkartanontie: '611', Matinkyläntie: '613', Tiistiläntie: '615', Tiistinkallio: '617', Etuniementie: '619', Hauenkalliontie: '621', Nelikkotie: '623', Suomenlahdentie: '625', Piispansilta: '627', Piispanportti: '629', Friisilänaukio: '631', Avaruuskatu: '633', Kuunkatu: '635', Ruomelantie: '637', Itäportti: '639', Komeetankatu: '641', Auringonkatu: '643', Piispankallio: '645', Lystimäki: '647', Lystimäensilta: '649', Suurpellonaukio: '651', Lukutori: '653', 'Gallen-Kallelan tie': '701', Elfvik: '703', 'Laajalahden keskus': '705', Majurinkulma: '707', Yhdyskunnankuja: '709', Kirjurinkuja: '711', Upseerinkatu: '713', Komentajankatu: '715', Säteri: '719', Säterinrinne: '721', Säterinniitty: '723', Rummunlyöjänkatu: '725', Ratsutori: '727', Leppävaaranaukio: '729', Leppävaarankäytävä: '731', Läkkitori: '733', 'Armas Launiksen katu': '735', Muurarinkuja: '737', 'Postipuun koulu': '739', Gransinmäki: '741', 'Leppävaaran urheilupuisto': '745', 'Leppävaaran uimahalli': '747', Vallikatu: '749', Vallipolku: '751', Linnuntie: '753', Kutsuntatie: '755', Painiitty: '757', 'Mäkkylän asema': '761', Kalkkipellonmäki: '763', Ruutikatu: '767', Tiurintie: '769', Orionintie: '900', 'Bike Station': '901', 'Derby Business Park': '902', Kaivopuisto: '1', Laivasillankatu: '2', Kapteeninpuistikko: '3', Viiskulma: '4', Sepänkatu: '5', Hietalahdentori: '6', 'Design Museum': '7', 'Vanha kirkkopuisto': '8', 'Erottajan aukio': '9', Kasarmitori: '10', Unioninkatu: '11', Kanavaranta: '12', Merisotilaantori: '13', 'Senate Square': '14', Ritarikatu: '15', Liisanpuistikko: '16', Varsapuistikko: '17', Porthania: '18', 'Central Railway Station/East': '19', Kaisaniemenpuisto: '20', Töölönlahdenkatu: '21', 'Central Railway Station/West': '22', Kiasma: '23', Mannerheimintie: '24', Narinkka: '25', 'Kamppi (M)': '26', Eerikinkatu: '27', Lastenlehto: '28', Baana: '29', Itämerentori: '30', 'Maria Hospital': '31', 'Finnish Museum of Natural History': '32', 'Hanken School of Economics': '33', 'National Museum': '34', Cygnaeuksenkatu: '35', Apollonkatu: '36', Töölönkatu: '37', Töölöntori: '38', Opera: '39', 'Hakaniemi (M)': '40', Ympyrätalo: '41', Haapaniemenkatu: '42', Karhupuisto: '43', 'Sörnäinen (M)': '44', 'Brahen kenttä': '45', Diakoniapuisto: '46', 'Market Square': '47', Mastokatu: '48', Annankatu: '49', Melkonkuja: '50', Itälahdenkatu: '51', Heikkilänaukio: '52', Heikkiläntie: '53', Gyldenintie: '54', Puistokaari: '55', Luoteisväylä: '56', 'Lauttasaari Shopping Center': '57', Lauttasaarensilta: '58', Salmisaarenranta: '59', 'Cable Factory': '60', Länsisatamankatu: '61', Välimerenkatu: '62', Jätkäsaarenlaituri: '63', Tyynenmerenkatu: '64', Hernesaarenranta: '65', Ehrenströmintie: '66', Perämiehenkatu: '67', Albertinkatu: '68', Kalevankatu: '69', Sammonpuistikko: '70', Hietaniemenkatu: '71', 'Eteläinen Hesperiankatu': '72', Kesäkatu: '73', Rajasaarentie: '74', Korjaamo: '75', 'Olympic Stadium': '76', Nordenskiöldinaukio: '77', Messeniuksenkatu: '78', 'Swimming Stadium': '79', 'Ice hall': '80', Stenbäckinkatu: '81', Töölöntulli: '82', 'Meilahti Hospital': '83', Paciuksenkatu: '84', Jalavatie: '85', Kuusitie: '86', Kustaankatu: '87', Kiskontie: '88', Tilkanvierto: '89', Paciuksenkaari: '90', Seurasaari: '91', Saunalahdentie: '92', Torpanranta: '93', 'Laajalahden aukio': '94', 'Munkkiniemen aukio': '95', Huopalahdentie: '96', Ulvilantie: '98', Muusantori: '99', Teljäntie: '100', 'Munkkivuori Shopping Center': '101', Vihdintie: '103', Kriikunakuja: '104', Tilkantori: '105', Korppaanmäentie: '106', Tenholantie: '107', Radiokatu: '108', Hertanmäenkatu: '109', Maistraatintori: '110', Esterinportti: '111', Rautatieläisenkatu: '112', 'Pasila railway station': '113', Ratapihantie: '114', Venttiilikuja: '115', 'Linnanmäki Amusement Park': '116', 'Brahen puistikko': '117', Fleminginkatu: '118', Gebhardinaukio: '119', Mäkelänkatu: '120', Vilhonvuorenkatu: '121', Lintulahdenkatu: '122', Näkinsilta: '123', Isoisänsilta: '124', Arielinkatu: '125', 'Kalasatama (M)': '126', Teurastamo: '127', Päijänteentie: '128', Pernajantie: '129', Teollisuuskatu: '130', Elimäenkatu: '131', Hollolantie: '132', Paavalinpuisto: '133', Haukilahdenkatu: '134', Velodrominrinne: '135', Sofianlehdonkatu: '136', 'Arabia Shopping Center': '137', Arabiankatu: '138', Kaironkatu: '139', Verkatehtaanpuisto: '140', Intiankatu: '141', Koskelantie: '142', Kuikkarinne: '143', Käpyläntie: '144', Pohjolankatu: '145', Pohjolanaukio: '146', 'Käpylä station': '147', 'Juhana Herttuan tie': '148', 'Toinen linja': '149', 'Töölönlahden puisto': '150', Eteläesplanadi: '161', Leppäsuonaukio: '162', Lehtisaarentie: '163', 'West Terminal': '200', Länsisatamankuja: '201', Merihaka: '202', Opastinsilta: '203', 'A.I. Virtasen aukio': '204', 'Ilmala Station': '205', 'Ruskeasuo depot': '206', 'Vanha Viertotie': '207', Valimotie: '208', Takomotie: '209', Pajamäki: '210', 'Haagan tori': '211', Tunnelitie: '212', 'Huopalahti Station': '213', 'Valimo Station': '214', 'Pitäjänmäki Station': '215', Jännetie: '216', Marttila: '217', 'Pohjois-Haaga Station': '218', Näyttelijäntie: '219', 'Ida Aalbergin tie': '220', Thalianaukio: '221', Huovitie: '222', Hämeenlinnanväylä: '223', Vesakkotie: '224', Maunula: '225', Lepolantie: '226', Kylävoudintie: '227', Kustaankartano: '228', Käskynhaltijantie: '229', Mäkitorpantie: '230', Siltavoudintie: '231', 'Oulunkylä Station': '232', Kirkkoherrantie: '233', 'Otto Brandtin tie': '234', 'Katariina Saksilaisen katu': '235', Hernepellontie: '236', Aulangontie: '237', Pihlajamäki: '238', 'Viikki Science Park': '239', 'Viikki Teacher Training School': '240', Agronominkatu: '241', 'Von Daehnin katu': '242', Mustikkamaa: '243', Relanderinaukio: '244', 'Kulosaari (M)': '245', Tupasaarentie: '246', Haakoninlahdenkatu: '247', Gunillantie: '248', Isosaarentie: '249', Reiherintie: '250', 'Laajasalo shopping center': '251', Humalniementie: '252', 'Tammisalon aukio': '253', Agnetankuja: '254', 'Laivalahden puistotie': '255', Herttoniemenranta: '256', Margareetankuja: '257', 'Abraham Wetterin tie': '258', 'Petter Wetterin tie': '259', 'Herttoniemi (M)': '260', Asentajanpuisto: '261', 'Siilitie (M)': '262', 'Herttoniemi Church': '263', Eränkävijäntori: '264', 'Siilitie 9': '265', 'Siilitie 13': '266', Roihupelto: '267', 'Porolahti school': '268', Peukaloisentie: '269', Tulisuontie: '270', Prinsessantie: '271', Marjaniementie: '272', Voikukantie: '274', 'Itäkeskus (M)': '275', Puotinharju: '276', Marjaniemi: '277', Puotilantie: '278', 'Puotinkylä Manor': '279', 'Puotila shopping center': '280', 'Puotila (M)': '281', Karhulantie: '282', Alakiventie: '283', 'Myllypuro (M)': '284', Orpaanporras: '285', Mamsellimyllynkatu: '286', 'Vallilan varikko': '290', 'Itäkeskus Metrovarikko': '291', 'Koskelan varikko': '292', Korkeasaari: '293', Postipuisto: '294', Aurinkotuulenkatu: '301', Sumukuja: '302', Leikosaarentie: '303', Aurinkolahdenaukio: '304', Kalkkihiekantie: '305', 'Shopping Center Columbus': '306', 'Vuosaaren liikuntapuisto': '315', Mosaiikkitori: '308', Kaivonkatsojanpuisto: '309', Halkaisijantie: '310', Ramsinniementie: '311', 'Meri-Rastilan tori': '312', 'Rastila (M)': '313', Lokitie: '314', Punakiventie: '316', Haapasaarentie: '317', 'Vuosaaren puistopolku': '318', Purjetie: '319', Koukkusaarentie: '320', Vartioharjuntie: '321', Rukatunturintie: '322', Sallatunturintie: '323', 'Mellunmäki (M)': '325', Sinkilätie: '324', Humikkalankuja: '327', Lallukankuja: '328', Kurkimäki: '329', 'Kontula (M)': '330', Tuukkalantie: '326', Lettopolku: '331', Kontulankaari: '332', Varustuksentie: '334', Kurkimäentie: '335', Kivikonlaita: '336', 'Kivikko sports park': '337', Jakomäentie: '338', Jakomäki: '340', Alppikylä: '339', Heikinlaakso: '341', 'Puistolan VPK': '342', Puistolantori: '343', 'Puistolan asema': '344', Maatullinkuja: '346', Sateenkaarentie: '347', Siltamäki: '348', Töyrynummentie: '349', Töyrynummi: '350', Kotinummentie: '351', Porvarintie: '345', Helluntairaitti: '353', 'Tapanila railway station': '352', Saniaiskuja: '354', Halmetie: '355', Laulurastaantie: '356', 'Vanha Tapanilantie': '357', Syystie: '358', 'Malmi Hospital': '359', 'Malmi railway station': '360', Huhtakuja: '361', Teerisuontie: '362', 'Ala-Malmin tori': '364', Väärämäentie: '363', Karviaistie: '365', Tilketori: '366', Karhusuontie: '367', Jokipellontie: '372', 'Pukinmäki sports park': '368', 'Pukinmäki railway station': '369', Rapakiventie: '370', Tollinpolku: '391', Mikkolantie: '373', Etupellonpuisto: '374', Piikintie: '375', Torpparinmäentie: '376', 'Paloheinän kirjasto': '379', 'Paloheinän maja': '377', Paloheinäntie: '378', 'Pirkkolan liikuntapuisto': '380', Maununneva: '381', Ulappasilta: '307', Hakuninmaa: '382', Kuninkaantammi: '383', Kalannintie: '384', 'Kannelmäen liikuntapuisto': '386', Pajupillintie: '385', 'Shopping Center Kaari': '387', Kaustisentie: '388', 'Kannelmäki railway station': '389', Savela: '371', Trumpettikuja: '390', Viljelijäntie: '392', 'Malminkartano railway station': '393', Tuohipolku: '394', Honkasuo: '395', 'Malminkartano Hill': '396', Hankasuontie: '397', Ajomiehentie: '398', Vähäntuvantie: '399', Kuusisaari: '400', 'Koivusaari metro station': '401', Verkkosaari: '403', Sompasaari: '404', Jollas: '405' }

  /**
   * UseEffect hook that retrieves the data when the app is loaded in.
   */
  useEffect(() => {
    bikeService.getAll()
      .then(journeysData => setJourneys(journeysData))
    $('#backwards-button').prop('disabled', true)
  }, [])

  /**
   * method for changing the filter. And setting the journeydata as instructed by the filtering.
   * @param {Array} filter
   */
  const changeFilter = (addToFilter) => {
    const newFilter = [...filterNow]
    for (const i in addToFilter) {
      const adding = addToFilter[i].split('=')[0]
      for (const i in newFilter) {
        if (newFilter[i].includes(adding)) {
          newFilter.pop(i)
        }
      }
      newFilter.push(addToFilter[i])
    }
    setFilterNow(newFilter)
    bikeService.getFiltered(newFilter)
      .then(filteredJourneys => setJourneys(filteredJourneys))
  }

  /**
   * method for moving forwards and backwords pages of journeydata.
   * @param {String} direction
   * @param {Integer} page
   * @returns set journeydata as filtered
   */
  const changePage = (direction, page) => {
    if (direction === 'f') page.current = page.current + 1
    else page.current = page.current - 1
    page.current === 0 ? $('#backwards-button').prop('disabled', true) : $('#backwards-button').prop('disabled', false)
    const filter = getPageFilter(direction, page.current, filterNow)
    bikeService.getFiltered(filter)
      .then(filteredJourneys => setJourneys(filteredJourneys))
  }

  /**
   * Handles the submit of the form, formats the request and sends it to changeFilter()
   */
  const handleSubmitDeparture = (event) => {
    event.preventDefault()
    const id = stationsAndIds[departure]
    const filterToChange = ['Departure_station_id=' + id]
    changeFilter(filterToChange)
    setDeparture('')
  }

  const handleSubmitReturn = (event) => {
    event.preventDefault()
    const id = stationsAndIds[arrival]
    const filterToChange = ['Return_station_id=' + id]
    changeFilter(filterToChange)
    setDeparture('')
  }

  /**
   * Using jQuery autocomplete which also sets the inputfield data into the city variable.
   * Can this be done with const(?)
   */
  $(() => {
    const stations = ['Hanasaari', 'Keilalahti', 'Westendinasema', 'Golfpolku', 'Revontulentie', 'Sateentie', 'Hakalehto', 'Oravannahkatori', 'Länsituuli', 'Tuulimäki', 'Tapionaukio', 'Kulttuuriaukio', 'Ahertajantie', 'Mäntyviita', 'Otsolahti', 'Keilaniemi (M)', 'Keilaranta', 'Betonimies', 'Tekniikantie', 'Innopoli', 'Hagalundsparken', 'nan', 'nan', 'Otaranta', 'Sähkömies', 'Jämeräntaival', 'Maarinranta', 'Tietäjä', 'Metsänneidonpolku', 'Kalevalantie', 'Louhentori', 'Pohjankulma', 'Koivu-Mankkaa', 'Mankkaanlaaksontie', 'Mankkaanaukio', 'Tapiola Sports Park', 'Sports Park (M)', 'Tontunmäentie', 'Olarinluoma', 'Niittymaa', 'Niittykumpu (M)', 'Haukilahdenkatu', 'Haukilahdenaukio', 'Hauenkallio', 'Haukilahdenranta', 'Mellstenintie', 'Toppelundintie', 'Westendintie', 'Toppelundinportti', 'Linnakepolku', 'Nokkala', 'Matinlahdenranta', 'Nuottaniementie', 'Sepetlahdentie', 'Matinkartanontie', 'Matinkyläntie', 'Tiistiläntie', 'Tiistinkallio', 'Etuniementie', 'Hauenkalliontie', 'Nelikkotie', 'Suomenlahdentie', 'Piispansilta', 'Piispanportti', 'Friisilänaukio', 'Avaruuskatu', 'Kuunkatu', 'Ruomelantie', 'Itäportti', 'Komeetankatu', 'Auringonkatu', 'Piispankallio', 'Lystimäki', 'Lystimäensilta', 'Suurpellonaukio', 'Lukutori', 'Gallen-Kallelan tie', 'Elfvik', 'Laajalahden keskus', 'Majurinkulma', 'Yhdyskunnankuja', 'Kirjurinkuja', 'Upseerinkatu', 'Komentajankatu', 'Säteri', 'Säterinrinne', 'Säterinniitty', 'Rummunlyöjänkatu', 'Ratsutori', 'Leppävaaranaukio', 'Leppävaarankäytävä', 'Läkkitori', 'Armas Launiksen katu', 'Muurarinkuja', 'Postipuun koulu', 'Gransinmäki', 'Leppävaaran urheilupuisto', 'Leppävaaran uimahalli', 'Vallikatu', 'Vallipolku', 'Linnuntie', 'Kutsuntatie', 'Painiitty', 'Mäkkylän asema', 'Kalkkipellonmäki', 'Ruutikatu', 'Tiurintie', 'Orionintie', 'Bike Station', 'Derby Business Park', 'Kaivopuisto', 'Laivasillankatu', 'Kapteeninpuistikko', 'Viiskulma', 'Sepänkatu', 'Hietalahdentori', 'Design Museum', 'Vanha kirkkopuisto', 'Erottajan aukio', 'Kasarmitori', 'Unioninkatu', 'Kanavaranta', 'Merisotilaantori', 'Senate Square', 'Ritarikatu', 'Liisanpuistikko', 'Varsapuistikko', 'Porthania', 'Central Railway Station/East', 'Kaisaniemenpuisto', 'Töölönlahdenkatu', 'Central Railway Station/West', 'Kiasma', 'Mannerheimintie', 'Narinkka', 'Kamppi (M)', 'Eerikinkatu', 'Lastenlehto', 'Baana', 'Itämerentori', 'Maria Hospital', 'Finnish Museum of Natural History', 'Hanken School of Economics', 'National Museum', 'Cygnaeuksenkatu', 'Apollonkatu', 'Töölönkatu', 'Töölöntori', 'Opera', 'Hakaniemi (M)', 'Ympyrätalo', 'Haapaniemenkatu', 'Karhupuisto', 'Sörnäinen (M)', 'Brahen kenttä', 'Diakoniapuisto', 'Market Square', 'Mastokatu', 'Annankatu', 'Melkonkuja', 'Itälahdenkatu', 'Heikkilänaukio', 'Heikkiläntie', 'Gyldenintie', 'Puistokaari', 'Luoteisväylä', 'Lauttasaari Shopping Center', 'Lauttasaarensilta', 'Salmisaarenranta', 'Cable Factory', 'Länsisatamankatu', 'Välimerenkatu', 'Jätkäsaarenlaituri', 'Tyynenmerenkatu', 'Hernesaarenranta', 'Ehrenströmintie', 'Perämiehenkatu', 'Albertinkatu', 'Kalevankatu', 'Sammonpuistikko', 'Hietaniemenkatu', 'Eteläinen Hesperiankatu', 'Kesäkatu', 'Rajasaarentie', 'Korjaamo', 'Olympic Stadium', 'Nordenskiöldinaukio', 'Messeniuksenkatu', 'Swimming Stadium', 'Ice hall', 'Stenbäckinkatu', 'Töölöntulli', 'Meilahti Hospital', 'Paciuksenkatu', 'Jalavatie', 'Kuusitie', 'Kustaankatu', 'Kiskontie', 'Tilkanvierto', 'Paciuksenkaari', 'Seurasaari', 'Saunalahdentie', 'Torpanranta', 'Laajalahden aukio', 'Munkkiniemen aukio', 'Huopalahdentie', 'Ulvilantie', 'Muusantori', 'Teljäntie', 'Munkkivuori Shopping Center', 'Vihdintie', 'Kriikunakuja', 'Tilkantori', 'Korppaanmäentie', 'Tenholantie', 'Radiokatu', 'Hertanmäenkatu', 'Maistraatintori', 'Esterinportti', 'Rautatieläisenkatu', 'Pasila railway station', 'Ratapihantie', 'Venttiilikuja', 'Linnanmäki Amusement Park', 'Brahen puistikko', 'Fleminginkatu', 'Gebhardinaukio', 'Mäkelänkatu', 'Vilhonvuorenkatu', 'Lintulahdenkatu', 'Näkinsilta', 'Isoisänsilta', 'Arielinkatu', 'Kalasatama (M)', 'Teurastamo', 'Päijänteentie', 'Pernajantie', 'Teollisuuskatu', 'Elimäenkatu', 'Hollolantie', 'Paavalinpuisto', 'Haukilahdenkatu', 'Velodrominrinne', 'Sofianlehdonkatu', 'Arabia Shopping Center', 'Arabiankatu', 'Kaironkatu', 'Verkatehtaanpuisto', 'Intiankatu', 'Koskelantie', 'Kuikkarinne', 'Käpyläntie', 'Pohjolankatu', 'Pohjolanaukio', 'Käpylä station', 'Juhana Herttuan tie', 'Toinen linja', 'Töölönlahden puisto', 'Eteläesplanadi', 'Leppäsuonaukio', 'Lehtisaarentie', 'West Terminal', 'Länsisatamankuja', 'Merihaka', 'Opastinsilta', 'A.I. Virtasen aukio', 'Ilmala Station', 'Ruskeasuo depot', 'Vanha Viertotie', 'Valimotie', 'Takomotie', 'Pajamäki', 'Haagan tori', 'Tunnelitie', 'Huopalahti Station', 'Valimo Station', 'Pitäjänmäki Station', 'Jännetie', 'Marttila', 'Pohjois-Haaga Station', 'Näyttelijäntie', 'Ida Aalbergin tie', 'Thalianaukio', 'Huovitie', 'Hämeenlinnanväylä', 'Vesakkotie', 'Maunula', 'Lepolantie', 'Kylävoudintie', 'Kustaankartano', 'Käskynhaltijantie', 'Mäkitorpantie', 'Siltavoudintie', 'Oulunkylä Station', 'Kirkkoherrantie', 'Otto Brandtin tie', 'Katariina Saksilaisen katu', 'Hernepellontie', 'Aulangontie', 'Pihlajamäki', 'Viikki Science Park', 'Viikki Teacher Training School', 'Agronominkatu', 'Von Daehnin katu', 'Mustikkamaa', 'Relanderinaukio', 'Kulosaari (M)', 'Tupasaarentie', 'Haakoninlahdenkatu', 'Gunillantie', 'Isosaarentie', 'Reiherintie', 'Laajasalo shopping center', 'Humalniementie', 'Tammisalon aukio', 'Agnetankuja', 'Laivalahden puistotie', 'Herttoniemenranta', 'Margareetankuja', 'Abraham Wetterin tie', 'Petter Wetterin tie', 'Herttoniemi (M)', 'Asentajanpuisto', 'Siilitie (M)', 'Herttoniemi Church', 'Eränkävijäntori', 'Siilitie 9', 'Siilitie 13', 'Roihupelto', 'Porolahti school', 'Peukaloisentie', 'Tulisuontie', 'Prinsessantie', 'Marjaniementie', 'Voikukantie', 'Itäkeskus (M)', 'Puotinharju', 'Marjaniemi', 'Puotilantie', 'Puotinkylä Manor', 'Puotila shopping center', 'Puotila (M)', 'Karhulantie', 'Alakiventie', 'Myllypuro (M)', 'Orpaanporras', 'Mamsellimyllynkatu', 'Vallilan varikko', 'Itäkeskus Metrovarikko', 'Koskelan varikko', 'Korkeasaari', 'Postipuisto', 'Aurinkotuulenkatu', 'Sumukuja', 'Leikosaarentie', 'Aurinkolahdenaukio', 'Kalkkihiekantie', 'Shopping Center Columbus', 'Vuosaaren liikuntapuisto', 'Mosaiikkitori', 'Kaivonkatsojanpuisto', 'Halkaisijantie', 'Ramsinniementie', 'Meri-Rastilan tori', 'Rastila (M)', 'Lokitie', 'Punakiventie', 'Haapasaarentie', 'Vuosaaren puistopolku', 'Purjetie', 'Koukkusaarentie', 'Vartioharjuntie', 'Rukatunturintie', 'Sallatunturintie', 'Mellunmäki (M)', 'Sinkilätie', 'Humikkalankuja', 'Lallukankuja', 'Kurkimäki', 'Kontula (M)', 'Tuukkalantie', 'Lettopolku', 'Kontulankaari', 'nan', 'Varustuksentie', 'Kurkimäentie', 'Kivikonlaita', 'Kivikko sports park', 'Jakomäentie', 'Jakomäki', 'Alppikylä', 'Heikinlaakso', 'Puistolan VPK', 'Puistolantori', 'Puistolan asema', 'Maatullinkuja', 'Sateenkaarentie', 'Siltamäki', 'Töyrynummentie', 'Töyrynummi', 'Kotinummentie', 'Porvarintie', 'Helluntairaitti', 'Tapanila railway station', 'Saniaiskuja', 'Halmetie', 'Laulurastaantie', 'Vanha Tapanilantie', 'Syystie', 'Malmi Hospital', 'Malmi railway station', 'Huhtakuja', 'Teerisuontie', 'Ala-Malmin tori', 'Väärämäentie', 'Karviaistie', 'Tilketori', 'Karhusuontie', 'Jokipellontie', 'Pukinmäki sports park', 'Pukinmäki railway station', 'Rapakiventie', 'Tollinpolku', 'Mikkolantie', 'Etupellonpuisto', 'Piikintie', 'Torpparinmäentie', 'Paloheinän kirjasto', 'Paloheinän maja', 'Paloheinäntie', 'Pirkkolan liikuntapuisto', 'Maununneva', 'Ulappasilta', 'Hakuninmaa', 'Kuninkaantammi', 'Kalannintie', 'Kannelmäen liikuntapuisto', 'Pajupillintie', 'Shopping Center Kaari', 'Kaustisentie', 'Kannelmäki railway station', 'Savela', 'Trumpettikuja', 'Viljelijäntie', 'Malminkartano railway station', 'Tuohipolku', 'Honkasuo', 'Malminkartano Hill', 'Hankasuontie', 'Ajomiehentie', 'Vähäntuvantie', 'Kuusisaari', 'Koivusaari metro station', 'Välimerenkatu', 'Verkkosaari', 'Sompasaari', 'Jollas']
    $('#DepartureStationsInput').autocomplete({
      source: stations,
      select: (event, ui) => {
        setDeparture(ui.item.value)
      },
      change: (event, ui) => {
        setDeparture(ui.item.value)
      }
    })
  })

  /**
   * Because we have two different fields we need two different useStates so we need to make different autofills, for each one.
   */
  $(() => {
    const stations = ['Hanasaari', 'Keilalahti', 'Westendinasema', 'Golfpolku', 'Revontulentie', 'Sateentie', 'Hakalehto', 'Oravannahkatori', 'Länsituuli', 'Tuulimäki', 'Tapionaukio', 'Kulttuuriaukio', 'Ahertajantie', 'Mäntyviita', 'Otsolahti', 'Keilaniemi (M)', 'Keilaranta', 'Betonimies', 'Tekniikantie', 'Innopoli', 'Hagalundsparken', 'nan', 'nan', 'Otaranta', 'Sähkömies', 'Jämeräntaival', 'Maarinranta', 'Tietäjä', 'Metsänneidonpolku', 'Kalevalantie', 'Louhentori', 'Pohjankulma', 'Koivu-Mankkaa', 'Mankkaanlaaksontie', 'Mankkaanaukio', 'Tapiola Sports Park', 'Sports Park (M)', 'Tontunmäentie', 'Olarinluoma', 'Niittymaa', 'Niittykumpu (M)', 'Haukilahdenkatu', 'Haukilahdenaukio', 'Hauenkallio', 'Haukilahdenranta', 'Mellstenintie', 'Toppelundintie', 'Westendintie', 'Toppelundinportti', 'Linnakepolku', 'Nokkala', 'Matinlahdenranta', 'Nuottaniementie', 'Sepetlahdentie', 'Matinkartanontie', 'Matinkyläntie', 'Tiistiläntie', 'Tiistinkallio', 'Etuniementie', 'Hauenkalliontie', 'Nelikkotie', 'Suomenlahdentie', 'Piispansilta', 'Piispanportti', 'Friisilänaukio', 'Avaruuskatu', 'Kuunkatu', 'Ruomelantie', 'Itäportti', 'Komeetankatu', 'Auringonkatu', 'Piispankallio', 'Lystimäki', 'Lystimäensilta', 'Suurpellonaukio', 'Lukutori', 'Gallen-Kallelan tie', 'Elfvik', 'Laajalahden keskus', 'Majurinkulma', 'Yhdyskunnankuja', 'Kirjurinkuja', 'Upseerinkatu', 'Komentajankatu', 'Säteri', 'Säterinrinne', 'Säterinniitty', 'Rummunlyöjänkatu', 'Ratsutori', 'Leppävaaranaukio', 'Leppävaarankäytävä', 'Läkkitori', 'Armas Launiksen katu', 'Muurarinkuja', 'Postipuun koulu', 'Gransinmäki', 'Leppävaaran urheilupuisto', 'Leppävaaran uimahalli', 'Vallikatu', 'Vallipolku', 'Linnuntie', 'Kutsuntatie', 'Painiitty', 'Mäkkylän asema', 'Kalkkipellonmäki', 'Ruutikatu', 'Tiurintie', 'Orionintie', 'Bike Station', 'Derby Business Park', 'Kaivopuisto', 'Laivasillankatu', 'Kapteeninpuistikko', 'Viiskulma', 'Sepänkatu', 'Hietalahdentori', 'Design Museum', 'Vanha kirkkopuisto', 'Erottajan aukio', 'Kasarmitori', 'Unioninkatu', 'Kanavaranta', 'Merisotilaantori', 'Senate Square', 'Ritarikatu', 'Liisanpuistikko', 'Varsapuistikko', 'Porthania', 'Central Railway Station/East', 'Kaisaniemenpuisto', 'Töölönlahdenkatu', 'Central Railway Station/West', 'Kiasma', 'Mannerheimintie', 'Narinkka', 'Kamppi (M)', 'Eerikinkatu', 'Lastenlehto', 'Baana', 'Itämerentori', 'Maria Hospital', 'Finnish Museum of Natural History', 'Hanken School of Economics', 'National Museum', 'Cygnaeuksenkatu', 'Apollonkatu', 'Töölönkatu', 'Töölöntori', 'Opera', 'Hakaniemi (M)', 'Ympyrätalo', 'Haapaniemenkatu', 'Karhupuisto', 'Sörnäinen (M)', 'Brahen kenttä', 'Diakoniapuisto', 'Market Square', 'Mastokatu', 'Annankatu', 'Melkonkuja', 'Itälahdenkatu', 'Heikkilänaukio', 'Heikkiläntie', 'Gyldenintie', 'Puistokaari', 'Luoteisväylä', 'Lauttasaari Shopping Center', 'Lauttasaarensilta', 'Salmisaarenranta', 'Cable Factory', 'Länsisatamankatu', 'Välimerenkatu', 'Jätkäsaarenlaituri', 'Tyynenmerenkatu', 'Hernesaarenranta', 'Ehrenströmintie', 'Perämiehenkatu', 'Albertinkatu', 'Kalevankatu', 'Sammonpuistikko', 'Hietaniemenkatu', 'Eteläinen Hesperiankatu', 'Kesäkatu', 'Rajasaarentie', 'Korjaamo', 'Olympic Stadium', 'Nordenskiöldinaukio', 'Messeniuksenkatu', 'Swimming Stadium', 'Ice hall', 'Stenbäckinkatu', 'Töölöntulli', 'Meilahti Hospital', 'Paciuksenkatu', 'Jalavatie', 'Kuusitie', 'Kustaankatu', 'Kiskontie', 'Tilkanvierto', 'Paciuksenkaari', 'Seurasaari', 'Saunalahdentie', 'Torpanranta', 'Laajalahden aukio', 'Munkkiniemen aukio', 'Huopalahdentie', 'Ulvilantie', 'Muusantori', 'Teljäntie', 'Munkkivuori Shopping Center', 'Vihdintie', 'Kriikunakuja', 'Tilkantori', 'Korppaanmäentie', 'Tenholantie', 'Radiokatu', 'Hertanmäenkatu', 'Maistraatintori', 'Esterinportti', 'Rautatieläisenkatu', 'Pasila railway station', 'Ratapihantie', 'Venttiilikuja', 'Linnanmäki Amusement Park', 'Brahen puistikko', 'Fleminginkatu', 'Gebhardinaukio', 'Mäkelänkatu', 'Vilhonvuorenkatu', 'Lintulahdenkatu', 'Näkinsilta', 'Isoisänsilta', 'Arielinkatu', 'Kalasatama (M)', 'Teurastamo', 'Päijänteentie', 'Pernajantie', 'Teollisuuskatu', 'Elimäenkatu', 'Hollolantie', 'Paavalinpuisto', 'Haukilahdenkatu', 'Velodrominrinne', 'Sofianlehdonkatu', 'Arabia Shopping Center', 'Arabiankatu', 'Kaironkatu', 'Verkatehtaanpuisto', 'Intiankatu', 'Koskelantie', 'Kuikkarinne', 'Käpyläntie', 'Pohjolankatu', 'Pohjolanaukio', 'Käpylä station', 'Juhana Herttuan tie', 'Toinen linja', 'Töölönlahden puisto', 'Eteläesplanadi', 'Leppäsuonaukio', 'Lehtisaarentie', 'West Terminal', 'Länsisatamankuja', 'Merihaka', 'Opastinsilta', 'A.I. Virtasen aukio', 'Ilmala Station', 'Ruskeasuo depot', 'Vanha Viertotie', 'Valimotie', 'Takomotie', 'Pajamäki', 'Haagan tori', 'Tunnelitie', 'Huopalahti Station', 'Valimo Station', 'Pitäjänmäki Station', 'Jännetie', 'Marttila', 'Pohjois-Haaga Station', 'Näyttelijäntie', 'Ida Aalbergin tie', 'Thalianaukio', 'Huovitie', 'Hämeenlinnanväylä', 'Vesakkotie', 'Maunula', 'Lepolantie', 'Kylävoudintie', 'Kustaankartano', 'Käskynhaltijantie', 'Mäkitorpantie', 'Siltavoudintie', 'Oulunkylä Station', 'Kirkkoherrantie', 'Otto Brandtin tie', 'Katariina Saksilaisen katu', 'Hernepellontie', 'Aulangontie', 'Pihlajamäki', 'Viikki Science Park', 'Viikki Teacher Training School', 'Agronominkatu', 'Von Daehnin katu', 'Mustikkamaa', 'Relanderinaukio', 'Kulosaari (M)', 'Tupasaarentie', 'Haakoninlahdenkatu', 'Gunillantie', 'Isosaarentie', 'Reiherintie', 'Laajasalo shopping center', 'Humalniementie', 'Tammisalon aukio', 'Agnetankuja', 'Laivalahden puistotie', 'Herttoniemenranta', 'Margareetankuja', 'Abraham Wetterin tie', 'Petter Wetterin tie', 'Herttoniemi (M)', 'Asentajanpuisto', 'Siilitie (M)', 'Herttoniemi Church', 'Eränkävijäntori', 'Siilitie 9', 'Siilitie 13', 'Roihupelto', 'Porolahti school', 'Peukaloisentie', 'Tulisuontie', 'Prinsessantie', 'Marjaniementie', 'Voikukantie', 'Itäkeskus (M)', 'Puotinharju', 'Marjaniemi', 'Puotilantie', 'Puotinkylä Manor', 'Puotila shopping center', 'Puotila (M)', 'Karhulantie', 'Alakiventie', 'Myllypuro (M)', 'Orpaanporras', 'Mamsellimyllynkatu', 'Vallilan varikko', 'Itäkeskus Metrovarikko', 'Koskelan varikko', 'Korkeasaari', 'Postipuisto', 'Aurinkotuulenkatu', 'Sumukuja', 'Leikosaarentie', 'Aurinkolahdenaukio', 'Kalkkihiekantie', 'Shopping Center Columbus', 'Vuosaaren liikuntapuisto', 'Mosaiikkitori', 'Kaivonkatsojanpuisto', 'Halkaisijantie', 'Ramsinniementie', 'Meri-Rastilan tori', 'Rastila (M)', 'Lokitie', 'Punakiventie', 'Haapasaarentie', 'Vuosaaren puistopolku', 'Purjetie', 'Koukkusaarentie', 'Vartioharjuntie', 'Rukatunturintie', 'Sallatunturintie', 'Mellunmäki (M)', 'Sinkilätie', 'Humikkalankuja', 'Lallukankuja', 'Kurkimäki', 'Kontula (M)', 'Tuukkalantie', 'Lettopolku', 'Kontulankaari', 'nan', 'Varustuksentie', 'Kurkimäentie', 'Kivikonlaita', 'Kivikko sports park', 'Jakomäentie', 'Jakomäki', 'Alppikylä', 'Heikinlaakso', 'Puistolan VPK', 'Puistolantori', 'Puistolan asema', 'Maatullinkuja', 'Sateenkaarentie', 'Siltamäki', 'Töyrynummentie', 'Töyrynummi', 'Kotinummentie', 'Porvarintie', 'Helluntairaitti', 'Tapanila railway station', 'Saniaiskuja', 'Halmetie', 'Laulurastaantie', 'Vanha Tapanilantie', 'Syystie', 'Malmi Hospital', 'Malmi railway station', 'Huhtakuja', 'Teerisuontie', 'Ala-Malmin tori', 'Väärämäentie', 'Karviaistie', 'Tilketori', 'Karhusuontie', 'Jokipellontie', 'Pukinmäki sports park', 'Pukinmäki railway station', 'Rapakiventie', 'Tollinpolku', 'Mikkolantie', 'Etupellonpuisto', 'Piikintie', 'Torpparinmäentie', 'Paloheinän kirjasto', 'Paloheinän maja', 'Paloheinäntie', 'Pirkkolan liikuntapuisto', 'Maununneva', 'Ulappasilta', 'Hakuninmaa', 'Kuninkaantammi', 'Kalannintie', 'Kannelmäen liikuntapuisto', 'Pajupillintie', 'Shopping Center Kaari', 'Kaustisentie', 'Kannelmäki railway station', 'Savela', 'Trumpettikuja', 'Viljelijäntie', 'Malminkartano railway station', 'Tuohipolku', 'Honkasuo', 'Malminkartano Hill', 'Hankasuontie', 'Ajomiehentie', 'Vähäntuvantie', 'Kuusisaari', 'Koivusaari metro station', 'Välimerenkatu', 'Verkkosaari', 'Sompasaari', 'Jollas']
    $('#ReturnStationInput').autocomplete({
      source: stations,
      select: (event, ui) => {
        setArrival(ui.item.value)
      },
      change: (event, ui) => {
        setArrival(ui.item.value)
      }
    })
  })

  /**
   * Resets the filters back to none and also refreshes the journey data back.
   */
  const resetFilters = () => {
    setFilterNow(['limit=10'])
    bikeService.getFiltered(filterNow)
      .then(filteredJourneys => setJourneys(filteredJourneys))
  }

  return (
    <div className = "journeys-container">
        <div className = "filters-container">
            <div className = "stationSearch-container">
                <form onSubmit={handleSubmitDeparture}>
                    <input id="DepartureStationsInput" placeholder="Departure station"></input>
                </form>
            </div>
            <div className = "stationSearch-container">
            <form onSubmit={handleSubmitReturn}>
                <input id="ReturnStationInput" placeholder="Return station"></input>
            </form>
        <div className="resetButton-container">
            <button id="reset-button" className="reset-button" onClick={() => resetFilters()}> reset filters </button>
        </div>
        </div>

            <div className = "dropdown-container">
            <button className = "dropdown-button"> Sort </button>
            <div className = "dropdown-content">
                <button className = "sort-button" onClick={() => changeFilter(['sort=-Covered_distance'])}> Furthest </button>
                <button className = "sort-button" onClick={() => changeFilter(['sort=+Covered_distance'])}> Shortest </button>
                <button className = "sort-button" onClick={() => changeFilter(['sort=-Duration'])}> Longest </button>
                <button className = "sort-button" onClick={() => changeFilter(['sort=+Duration'])}> Fastest </button>
            </div>
        </div>
    </div>

        <div className = "listOfJourneys-container">
            <ListJourneys journeys = {journeys} />
        </div>

        <div className = "pagination-container">
        <button id = "backwards-button" onClick = {() => changePage('b', page)}> previous </button>
            <button id = "forwards-button" onClick = {() => changePage('f', page)}> next </button>
        </div>
    </div>
  )
}

export default Journeys
