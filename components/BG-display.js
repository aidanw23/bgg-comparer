import React, { useState, useEffect} from 'react';

export function BG_display (props) {
    const [passedID, setPassedID] = useState(props.id)
    //roughGameData is a state to store the converted xml, but converted form is too unwieldy to use for display
    const [roughGameData, setRoughGameData] = useState([])
    /*sortedData is a cleaner JS object that is far more usable than the rawData.
    Object contains:  imageURL, name, description, year, playerCount (array of two nums)*/
    const [sortedData, setSortedData] = useState({})

    useEffect (() => {
        setPassedID(props.id)
    },[props.id])

    useEffect(() => {
        console.groupCollapsed('Rough Data Table')
        console.table(roughGameData)
        console.groupEnd()

        console.groupCollapsed('Rough Data pure')
        console.log(roughGameData)
        console.groupEnd()

        if(roughGameData.length > 1) {
            parseRough()
            console.groupCollapsed('Parsed Data')
            console.table(sortedData)
            console.log(sortedData)
            console.groupEnd()
        }
    },[roughGameData])

    //when passed a new id, fetches it from bgg and 
    //converts xml to a rough js object which will need further sorting.
    useEffect (() => {
        console.log('new id')
        var convert = require('xml-js')
        fetch('https://boardgamegeek.com/xmlapi2/thing?id='+passedID+'&stats=1')
            .then((response) => {
                return response.text();
            }).then ((data) => {
                const jsed = convert.xml2js(data)
                try {
                    setRoughGameData(jsed.elements[0].elements[0].elements)
                } catch (err) {
                    console.log(err)
                }
            })
    },[passedID])

    function parseRough () {
        for (let i=0; i< roughGameData.length; i++) {
            if (roughGameData[i].name === 'image') {
                setSortedData(prevState => ({...prevState, imageURL: roughGameData[i].elements[0].text }))
            }
            if (roughGameData[i].name === 'name') {
                if (roughGameData[i].attributes.type === 'primary'){
                    setSortedData(prevState => ({...prevState, name: roughGameData[i].attributes.value}))
                }
            }
            if (roughGameData[i].name === 'description') {
                setSortedData(prevState => ({...prevState, description: roughGameData[i].elements[0].text}))
            }
            if (roughGameData[i].name === 'yearpublished') {
                setSortedData(prevState => ({...prevState, year: roughGameData[i].attributes.value}))
            }
            if (roughGameData[i].name === 'minplayers') {
                setSortedData(prevState => ({...prevState, playerCount: [roughGameData[i].attributes.value, roughGameData[i+1].attributes.value]}))
            }
            if (roughGameData[i].name === 'poll') {
                if (roughGameData[i].attributes.name === 'suggested_numplayers') {
                    let playerCountVotes = []
                    for (let item of roughGameData[i].elements) {
                        playerCountVotes.push([item.attributes.numplayers, item.elements[0].attributes.numvotes])
                    }
                    setSortedData(prevState => ({...prevState, bestPlayerCount: playerCountVotes}))
                }
            }
            if (roughGameData[i].name === 'playingtime') {
                setSortedData (prevState => ({...prevState, playTime: roughGameData[i].attributes.value}))
            }
            if (roughGameData[i].name === 'statistics') {
                setSortedData (prevState => ({...prevState, averageRating: roughGameData[i].elements[0].elements[2].attributes.value}))
            }
        }
    }

    return (
        <div>
            <p>DISPLAY</p>
            <p>{passedID}</p>
        </div>
    )
}