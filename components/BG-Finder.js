import React, { useState, useEffect } from 'react';
//import styles from '../styles/Home.module.css'

export function BG_Finder (props) {
    
//search is constantly updated when text is entered in search bar
  const [search, setSearch] = useState("")
  //result is converted xml response from bgg api, as js object
  const [result, setResult] = useState({})
  const [usableSearch, setUsableSearch] = useState([])

  useEffect (() => {
    if(result.boardgame) {
      console.log(result.boardgame)
      makeResultUsable()
    }
  },[result])

  //function that searches bgg for titles matching search, returns js object to result state
  async function bggSearch () {
    try {
      var convert = require('xml-js')
      const req = new XMLHttpRequest()
      req.open("GET", "https://boardgamegeek.com/xmlapi/search?search="+search)
      req.send()
      req.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          var js = convert.xml2js(req.responseText, {compact: true})
          setResult(js.boardgames);
        }
      })  
    } catch (err) {
      console.log(err)
    }
  }

  //function called when results is updated, turns janky converted xml into a much more readable object
  function makeResultUsable () {
    try{
      let usable = {}
      let count = 0;
      for (let game of result.boardgame) {
        usable[count] = {
          name: game.name._text,
          year: game.yearpublished._text,
          id: game._attributes.objectid
        }
        count += 1;
      }
      console.log(usable)
      console.log(Object.keys(usable).length)
      setUsableSearch(usable)
    } catch (err) {
      console.log(`Error in making usable: ${err}`)
      console.log(`Usable: ${JSON.stringify(usableSearch)}`)
    }
  }

  //updates search state to whatever is input
  function searchUpdate (e) {
    setSearch(e.target.value)
  }

  //renders list of results of search
  function renderResults() {
    var games = []
    for (let i = 0; i <Object.keys(usableSearch).length; i++) {
      console.log(usableSearch[i])
      games.push(<p key={usableSearch[i].id} className='result'>{usableSearch[i].name}</p>)
    }
    return games;
  }

  return (
    <div>
      <div>
        <h1>i want die</h1>
        <input type="text" id="gameOne" onChange = {searchUpdate}/>
        <button onClick={bggSearch}>Submit</button>
      </div>
      <div>
        {Object.keys(usableSearch).length >= 1 ? renderResults() : <p>No results</p>}
      </div>
    </div>
  )
}