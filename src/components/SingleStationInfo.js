import React from 'react'
import $ from 'jquery'

const Station = () => {
  /**
   * Closes the single station view and returns the list.
   */
  const closeView = () => {
    $('#list-container').css('display', 'flex')
    $('#singleStation-container').css('display', 'none')
  }
  return (
    <div className = "stationInformation" id="stationInformation">
    <button onClick={() => closeView()}> close </button>
      <div className = "singleStationHeader" id="singleStationHeader">
        station name
      </div>
      <div className = "singleStationInfo" id="singleStationInfo">
        streetname, city
      </div>
      <div className = "singleStationData" id="singleStationData">
        <p id="singleStationCapasity"> capasity </p>
        <p id="singleStationTripsDeparture"> trips </p>
        <p id="singleStationTripsReturn"> trips </p>
        <p id="singleStationTopReturning"> topR </p>
        <p id="singleStationTopDeparting"> topD </p>
        <p id="singleStationAvgReturning"> avgLR </p>
        <p id="singleStationAvgDeparting"> avgLD </p>
      </div>
    </div>
  )
}
export default Station
