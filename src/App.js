import React, { Component } from 'react';
import './App.css';
import letters from './alphabet.js'

class App extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      kana: '',
      letterList: [],
      selectedLetter: null,
      sortedLetters: []
    }
  }

  resetMatching() {
    const arrList = this.state.letterList
    const arrSorted = this.state.sortedLetters

    arrSorted.forEach(col => {
      col.forEach(el => {
        el.showLetter = null
      })
    })

    arrList.forEach(letter => {
      letter.show = true
    })

    this.setState({
      letterList: arrList,
      sortedLetters: arrSorted
    })
  }

  setHirigana() {
    this.setState({
      kana: 'Hirigana'
    })

    this.resetMatching()
  }

  setKatakana() {
    this.setState({
      kana: 'Katakana'
    })

    this.resetMatching()
  }

  dragLetter(e, symbol) {
    this.setState({
      selectedLetter: symbol
    })
  }

  onDragOver(e) {
    e.preventDefault()
  }
  

  onDrop(target, col, idx) {

    if(this.state.selectedLetter.eng === target.eng) {
      const toKill = this.state.selectedLetter

      const temp = this.state.sortedLetters
      if(this.state.kana === "Hirigana") temp[col][idx].showLetter = target.hir
      else temp[col][idx].showLetter = target.kan

      const num = this.state.letterList.indexOf(toKill)
      const arr = this.state.letterList

      arr[num].show = false

      this.setState({
        letterList: arr
      })
    }

    this.setState({
      selectedLetter: null
    })
  }

  makeTable() {
    if(!this.state.sortedLetters) return null
    return this.state.sortedLetters.map( (column, col) => {
      return ( 
       <div className="table-column" key={column[0].eng}>
         {
           column.map((letter, idx) => {
             return(
               <div className="letter-holder" 
                key={letter.eng + '-drop'} 
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => {this.onDrop(letter, col, idx)}}
               >
                <span className="letter-to-match">{letter.eng}</span>
                <div className="match-holder">{letter.showLetter}</div>
              </div>
             )
           })
         }
       </div> 
      )
    })
  }

  componentDidMount() {
    let tempArray = []

    letters.forEach(col => {
      col.forEach(lett => {
        lett.show = true
        tempArray.push(lett)  
      })
    })

    for(let i = 0; i < 100; i++) {

      const one = Math.floor(Math.random() * tempArray.length)
      const two = Math.floor(Math.random() * tempArray.length)

      const flip = tempArray[one]
      tempArray[one] = tempArray[two]
      tempArray[two] = flip
    }
    
    this.setState({
      letterList: tempArray,
      sortedLetters: letters
    })
  }

  render() {
    return (
      <div className="App">
        <div id="header">
          <h2>Kana Matching</h2>
          <div style={{flexDirection: 'row'}} > 
            <button style={{marginRight: '8px'}} onClick={() => this.setHirigana()} >Hirigana</button>
            <button onClick={() => this.setKatakana()} >Katakana</button>
          </div>
        </div>
        <div id="page-body">
          <div id="page-content">
          <div id="matching-table">
            {
              this.makeTable()
            }
            </div>
            <div id="letters-to-match">
              {
                  this.state.letterList.map(char => {

                    if(this.state.kana === 'Hirigana' && char.show) return <div className="symbol" onTouchMove={(e) => this.dragLetter(e,char)} onDragStart={(e) => this.dragLetter(e, char)} key={char.eng + '-drag-h'} draggable>{char.hir}</div>
                    else if(char.show) return <div className="symbol" key={char.eng + '-drag-k'} onTouchMove={(e) => this.dragLetter(e,char)} onDragStart={(e) => this.dragLetter(e, char)} draggable >{char.kan}</div>
                  })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
