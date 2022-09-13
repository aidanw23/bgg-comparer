import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

export function BG_Finder2 (props) {
    
//search is constantly updated when text is entered in search bar
  const [search, setSearch] = useState("")
  //result is converted xml response from bgg api, as js object
  const [result, setResult] = useState({})
  const [usableSearch, setUsableSearch] = useState([])

  useEffect (() => {
    console.log("Setting result state")
    if(result.item) {
      console.log(result.item)
      makeResultUsable()
    }
  },[result])

  //function that searches bgg for titles matching search, returns js object to result state
  async function bggSearch () {
    try {
      console.log("Making request in bggSearch")
      var convert = require('xml-js')
      const req = new XMLHttpRequest()
      req.open("GET", "https://boardgamegeek.com/xmlapi2/search?query="+search)
      req.send()
      req.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          var js = convert.xml2js(req.responseText, {compact: true})
          //console.log(js.items)
          setResult(js.items);
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
      for (let game of result.item) {
        //console.log(game)
        if (game._attributes.type === 'boardgame') {
          usable[count] = {
            name: game.name._attributes.value,
            year: game.yearpublished._attributes.value,
            id: game._attributes.id
          }
        }
        count += 1;
      }
      //console.log(usable)
      //console.log(Object.keys(usable).length)
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

  function IDselect (e) {
    console.log(e.target.id)
    props.onChange(props.game, e.target.id)
    document.getElementById('game1').value ='';
    setResult('')
    setUsableSearch([])
  }

  //renders list of results of search
  function renderResults() {
    var games = []
    for (let i = 0; i <Object.keys(usableSearch).length; i++) {
      console.log(usableSearch[i])
      games.push(<div><a key={usableSearch[i].id} className='result' id={usableSearch[i].id} onClick = {IDselect}>{usableSearch[i].name}</a></div>)
    }
    return games;
  }

  return (
  <div>
    <div>
      <h1>i want die</h1>
      <input type="text" id={"game"+props.game} onChange = {searchUpdate}/>
      <button onClick={bggSearch}>Submit</button>
    </div>
    <div>
      {Object.keys(usableSearch).length >= 1 ? renderResults() : <p>No results</p>}
    </div>
  </div>
  )
}

/*
THE CLIPBOARD
  

*/