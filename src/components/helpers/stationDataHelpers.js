import bikeService from '../../services/BikeService';
import { stationsAndIds } from '../../data/stationsData';

const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

/**
 * Calls the count api and return all trips ending in given location
 * @param {String} stationId
 * @returns
 */
export const getCountTripsEnding = async (stationId) => {
  const filter = [`Return_station_id=${stationId}`];
  const result = await bikeService.getCount(filter);
  return result;
};

/**
 * Calls the count api and return all trips starting in given location
 * @param {String} stationId
 * @returns
 */
export const getCountTripsStarting = async (stationId) => {
  const filter = [`Departure_station_id=${stationId}`];
  const result = await bikeService.getCount(filter);
  return result;
};

/**
 * Calls the average api and returns average distance of trips from or to station.
 * @param {String} stationId
 * @returns
 */
export const getAverageDistance = async (direction, stationId, month) => {
  const result = await bikeService.getAverage(direction, stationId, month);
  return result[0].average;
};

/**
 * Calls the top api and returns top 5 returning or deparute stations for this station.
 * @param {String} stationId
 * @returns
 */
export const getTop = async (direction, stationId, month) => {
  const result = await bikeService.getTop(direction, stationId, month);
  const list = [];
  for (let i = 0; i < result.length; i += 1) {
    const name = getKeyByValue(stationsAndIds, result[i]._id);
    list.push(name);
  }
  return list;
};
