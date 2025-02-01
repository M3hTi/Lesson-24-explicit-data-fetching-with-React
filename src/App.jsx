import * as React from 'react'

import './App.css'


function reducer(state,action) {
  switch (action.type) {
    case 'LOADING':
      return {info: [], isLoading: true, isError: false}
    case 'LOADED':
      return {info: action.payload, isLoading: false, isError: false}
    case 'ERROR':
      return {info : [], isLoading: false, isError: action.payload}
    default:
      return state
  }
}




function App() {
  const initialInformation = {
    info: [],
    isLoading: false,
    isError: false
  }

  const [term, setTerm] = React.useState('')
  const [confirmSearch, setConfirmSearch] = React.useState('')

  const[data, dispatchData] = React.useReducer(reducer, initialInformation)


  const handlerInput = React.useCallback((e) => {
    const newValue = e.target.value 
    setTerm(newValue)
  },[])
  

  const handleConfirmSrch = React.useCallback((e) => {
    if(e.type=== 'click' || (e.type === 'keydown' && e.key === 'Enter')){
      setConfirmSearch(term)
    }
  },[term])


  const fetchData = React.useCallback(() => {
    if(confirmSearch === '') return 
      dispatchData({type: 'LOADING'})
    fetch(`https://restcountries.com/v3.1/name/${confirmSearch}`)
      .then(response => {
        if(!response.ok) throw new Error("Error is occurred");
        return response.json()
      })
      .then(data => dispatchData({type: 'LOADED', payload: data}))
      .catch(error => {
        dispatchData({type: 'ERROR', payload: error.message})
      });
  },[confirmSearch])


  React.useEffect(() => {
    fetchData()
  },[fetchData])





  return (
    <div className="app-container">
      <h1>REST Countries</h1>
      <div className="search-container">
        <InputWithButton id='search' type='text' value={term} onHandler={handlerInput} onConfirm={handleConfirmSrch} />
      </div>
      <div>
        {data.isError && <p className="error-message">{data.isError}</p>}
        {data.isLoading ? (<div className="spinner"></div>) : (<List items={data.info} />)}
      </div>
    </div>
  )
}

function InputWithButton({id, type, value, onHandler, onConfirm}) {
  return(
    <>
      <input type={type} id={id} value={value} onInput={onHandler} onKeyDown={onConfirm}  placeholder='Please enter the country name' />
      <button onClick={onConfirm}>Search</button>
    </>
  )
}



function List({items}) {
  if (!items.length) return null;
  
  return (
    <div className="countries-grid">
      {items.map(country => {
        const {name:{common}, flags:{png}, region, capital ,population} = country
        const [first] = capital
        return(
        <div key={common} className="country-card">
          <img 
            className="country-flag" 
            src={png} 
            alt={`Flag of ${common}`}
          />
          <div className="country-info">
            <h2 className="country-name">{common}</h2>
            <div className="country-details">
              <p><strong>Capital:</strong> { first || 'N/A'}</p>
              <p><strong>Region:</strong> {region}</p>
              <p><strong>Population:</strong> {population.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
}


export default App
